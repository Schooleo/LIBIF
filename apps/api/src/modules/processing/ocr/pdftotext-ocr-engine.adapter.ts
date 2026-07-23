import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { createWorker, OEM, PSM } from 'tesseract.js';
import { StorageService } from '../../storage/storage.service';
import { OcrEngine, OcrExtractionError, OcrResult } from './ocr-engine.port';
import {
  cleanupAbandonedOcrWorkspaces,
  createPrivateOcrWorkspace,
  makeFilesPrivate,
  writePrivateFile
} from './ocr-temp-workspace';

const execFileAsync = promisify(execFile);
const SUPPORTED_OCR_LANGUAGES = ['vie', 'eng'] as const;
type SupportedOcrLanguage = (typeof SUPPORTED_OCR_LANGUAGES)[number];

@Injectable()
export class PdftotextOcrEngineAdapter implements OcrEngine, OnModuleInit {
  private readonly logger = new Logger(PdftotextOcrEngineAdapter.name);
  private readonly commandTimeoutMs: number;
  private readonly maxPages: number;
  private readonly renderDpi: number;
  private readonly languages: SupportedOcrLanguage[];
  private readonly tempRoot: string;
  private readonly legacyTempStaleAgeMs: number;

  constructor(
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(ConfigService) config: ConfigService
  ) {
    this.commandTimeoutMs = positiveInteger(config.get<string>('OCR_COMMAND_TIMEOUT_MS'), 60_000);
    this.maxPages = positiveInteger(config.get<string>('OCR_MAX_PAGES'), 50);
    this.renderDpi = positiveInteger(config.get<string>('OCR_RENDER_DPI'), 200);
    this.languages = parseLanguages(config.get<string>('OCR_LANGUAGES') ?? 'vie+eng');
    this.tempRoot = config.get<string>('OCR_TEMP_ROOT')?.trim() || os.tmpdir();
    this.legacyTempStaleAgeMs = positiveInteger(
      config.get<string>('OCR_TEMP_STALE_AGE_MS'),
      60 * 60 * 1000
    );
  }

  async onModuleInit(): Promise<void> {
    const removed = await cleanupAbandonedOcrWorkspaces({
      root: this.tempRoot,
      legacyStaleAgeMs: this.legacyTempStaleAgeMs
    });
    if (removed > 0) {
      this.logger.warn(`Removed ${removed} abandoned OCR temporary workspace(s).`);
    }
  }

  async extractText(bucket: string, objectKey: string, mimeType = 'application/pdf'): Promise<OcrResult> {
    if (mimeType !== 'application/pdf') {
      throw new OcrExtractionError('Text extraction accepts PDF files only.');
    }

    const tmpDir = await createPrivateOcrWorkspace(this.tempRoot);
    const pdfPath = path.join(tmpDir, 'input.pdf');
    const txtPath = path.join(tmpDir, 'embedded.txt');

    try {
      const fileBuffer = await this.loadSourcePdf(bucket, objectKey);
      await writePrivateFile(pdfPath, fileBuffer);

      const pageCount = await this.readPageCount(pdfPath);
      if (pageCount > this.maxPages) {
        throw new OcrExtractionError(`PDF exceeds the ${this.maxPages}-page processing limit.`);
      }

      const embeddedText = await this.extractEmbeddedText(pdfPath, txtPath);
      if (embeddedText) {
        this.logger.log('Extracted an embedded text layer from a private source document.');
        return resultFor(embeddedText, 'EMBEDDED_TEXT', pageCount, 'vi');
      }

      const ocrText = await this.extractScannedText(pdfPath, tmpDir, pageCount);
      this.logger.log('Completed OCR for a private source document.');
      return resultFor(ocrText, 'OCR', pageCount, 'vi');
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch((error: unknown) => {
        this.logger.warn(`Could not remove OCR temporary directory: ${errorMessage(error)}`);
      });
    }
  }

  private async loadSourcePdf(bucket: string, objectKey: string): Promise<Buffer> {
    try {
      return await this.storage.getObjectBuffer(bucket, objectKey);
    } catch (error) {
      throw new OcrExtractionError('Source PDF could not be loaded from private storage.', { cause: error });
    }
  }

  private async readPageCount(pdfPath: string): Promise<number> {
    try {
      const { stdout } = await execFileAsync('pdfinfo', [pdfPath], this.commandOptions());
      const match = /^Pages:\s+(\d+)$/m.exec(stdout);
      const pageCount = match ? Number.parseInt(match[1], 10) : 0;
      if (pageCount < 1) {
        throw new Error('pdfinfo did not report a positive page count');
      }
      return pageCount;
    } catch (error) {
      this.logger.warn('Private PDF validation failed.');
      throw new OcrExtractionError('PDF is invalid or unreadable.', { cause: error });
    }
  }

  private async extractEmbeddedText(pdfPath: string, txtPath: string): Promise<string> {
    try {
      await execFileAsync('pdftotext', [pdfPath, txtPath], this.commandOptions());
      await makeFilesPrivate([txtPath]);
      return (await fs.readFile(txtPath, 'utf8')).trim();
    } catch (error) {
      this.logger.warn('Private PDF embedded text extraction failed.');
      throw new OcrExtractionError('PDF text extraction failed.', { cause: error });
    }
  }

  private async extractScannedText(pdfPath: string, tmpDir: string, pageCount: number): Promise<string> {
    const pagePrefix = path.join(tmpDir, 'page');
    try {
      await execFileAsync(
        'pdftoppm',
        ['-png', '-r', String(this.renderDpi), '-f', '1', '-l', String(pageCount), pdfPath, pagePrefix],
        this.commandOptions()
      );
    } catch (error) {
      this.logger.warn('Private PDF rendering for OCR failed.');
      throw new OcrExtractionError('PDF pages could not be rendered for OCR.', { cause: error });
    }

    const pageImages = (await fs.readdir(tmpDir))
      .filter((filename) => /^page-\d+\.png$/.test(filename))
      .sort((left, right) => pageNumber(left) - pageNumber(right))
      .map((filename) => path.join(tmpDir, filename));

    if (pageImages.length !== pageCount) {
      throw new OcrExtractionError('PDF rendering produced an incomplete page set.');
    }
    await makeFilesPrivate(pageImages);

    const languageDataPath = await this.prepareLanguageData(tmpDir);
    const worker = await createWorker(this.languages, OEM.LSTM_ONLY, {
      langPath: languageDataPath,
      cacheMethod: 'none',
      logger: (message: { status?: string; progress?: number }) => {
        if (message.status === 'recognizing text' && typeof message.progress === 'number') {
          this.logger.debug(`OCR progress ${Math.round(message.progress * 100)}%`);
        }
      }
    });

    try {
      await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO });
      const pageTexts: string[] = [];
      for (const pageImage of pageImages) {
        const recognition: any = await withTimeout(
          worker.recognize(pageImage),
          this.commandTimeoutMs,
          'OCR recognition timed out.'
        );
        pageTexts.push(recognition.data.text.trim());
      }

      const text = pageTexts.filter(Boolean).join('\n\n').trim();
      if (!text) {
        throw new OcrExtractionError('OCR completed but found no readable text.');
      }
      return text;
    } catch (error) {
      if (error instanceof OcrExtractionError) throw error;
      this.logger.warn('Private document OCR recognition failed.');
      throw new OcrExtractionError('OCR recognition failed.', { cause: error });
    } finally {
      await worker.terminate();
    }
  }

  private async prepareLanguageData(tmpDir: string): Promise<string> {
    const languageDataPath = path.join(tmpDir, 'tessdata');
    await fs.mkdir(languageDataPath);

    for (const language of this.languages) {
      const packageEntry = require.resolve(`@tesseract.js-data/${language}`);
      const source = path.join(path.dirname(packageEntry), '4.0.0', `${language}.traineddata.gz`);
      const destination = path.join(languageDataPath, `${language}.traineddata.gz`);
      await fs.copyFile(source, destination);
    }

    return languageDataPath;
  }

  private commandOptions(): { timeout: number; maxBuffer: number } {
    return {
      timeout: this.commandTimeoutMs,
      maxBuffer: 10 * 1024 * 1024
    };
  }
}

function resultFor(
  text: string,
  method: OcrResult['method'],
  pageCount: number,
  language: string
): OcrResult {
  const normalizedText = text.trim();
  return {
    text: normalizedText,
    method,
    sizeBytes: BigInt(Buffer.byteLength(normalizedText)),
    checksumSha256: crypto.createHash('sha256').update(normalizedText).digest('hex'),
    language,
    pageCount
  };
}

function parseLanguages(value: string): SupportedOcrLanguage[] {
  const requested = value
    .split('+')
    .map((language) => language.trim())
    .filter(Boolean);
  const languages = [...new Set(requested)];
  if (
    languages.length === 0 ||
    languages.some((language) => !SUPPORTED_OCR_LANGUAGES.includes(language as SupportedOcrLanguage))
  ) {
    throw new Error(`OCR_LANGUAGES must contain only: ${SUPPORTED_OCR_LANGUAGES.join(', ')}`);
  }
  return languages as SupportedOcrLanguage[];
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function pageNumber(filename: string): number {
  return Number.parseInt(filename.match(/\d+/)?.[0] ?? '0', 10);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new OcrExtractionError(message)), timeoutMs);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
