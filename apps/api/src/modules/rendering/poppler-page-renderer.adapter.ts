import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { StorageService } from '../storage/storage.service';
import {
  cleanupAbandonedOcrWorkspaces,
  createPrivateOcrWorkspace,
  makeFilesPrivate,
  writePrivateFile
} from '../processing/ocr/ocr-temp-workspace';
import { RenderBasePageInput, RenderedBasePage } from './protected-page-renderer.port';
import { getProfileConfig } from './rendering-profile.config';
import { RenderBoundsError, RenderSourceError } from './rendering.errors';

const execFileAsync = promisify(execFile);

@Injectable()
export class PopplerPageRendererAdapter implements OnModuleInit {
  private readonly logger = new Logger(PopplerPageRendererAdapter.name);
  private readonly commandTimeoutMs: number;
  private readonly tempRoot: string;
  private readonly legacyTempStaleAgeMs: number;

  constructor(
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(ConfigService) config: ConfigService
  ) {
    this.commandTimeoutMs = positiveInteger(config.get<string>('RENDER_COMMAND_TIMEOUT_MS'), 30_000);
    this.tempRoot = config.get<string>('RENDER_TEMP_ROOT')?.trim() || os.tmpdir();
    this.legacyTempStaleAgeMs = positiveInteger(
      config.get<string>('RENDER_TEMP_STALE_AGE_MS'),
      60 * 60 * 1000
    );
  }

  async onModuleInit(): Promise<void> {
    const removed = await cleanupAbandonedOcrWorkspaces({
      root: this.tempRoot,
      legacyStaleAgeMs: this.legacyTempStaleAgeMs
    });
    if (removed > 0) {
      this.logger.warn(`Removed ${removed} abandoned rendering temporary workspace(s).`);
    }
  }

  async renderBasePage(input: RenderBasePageInput): Promise<RenderedBasePage> {
    const { bookFileId, bucket, objectKey, pageNumber, profile } = input;

    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
      throw new RenderBoundsError('Page number must be greater than zero.');
    }

    const profileConfig = getProfileConfig(profile);

    const tmpDir = await createPrivateOcrWorkspace(this.tempRoot);
    const pdfPath = path.join(tmpDir, 'input.pdf');
    const pagePrefix = path.join(tmpDir, 'page');

    try {
      const pdfBuffer = await this.loadSourcePdf(bucket, objectKey);
      await writePrivateFile(pdfPath, pdfBuffer);

      const pageCount = await this.readPageCount(pdfPath);
      if (pageNumber > pageCount) {
        throw new RenderBoundsError(`Page number ${pageNumber} exceeds document page count of ${pageCount}.`);
      }

      await execFileAsync(
        'pdftoppm',
        ['-png', '-r', String(profileConfig.dpi), '-f', String(pageNumber), '-l', String(pageNumber), pdfPath, pagePrefix],
        this.commandOptions()
      );

      const files = await fs.readdir(tmpDir);
      const renderedFileName = files.find((name) => /^page-\d+\.png$/.test(name));
      if (!renderedFileName) {
        throw new RenderSourceError(`pdftoppm failed to render page ${pageNumber}.`);
      }

      const renderedPngPath = path.join(tmpDir, renderedFileName);
      await makeFilesPrivate([renderedPngPath]);

      let finalImagePath = renderedPngPath;
      if (profileConfig.format === 'webp') {
        const webpPath = path.join(tmpDir, 'page.webp');
        await execFileAsync('convert', [renderedPngPath, '-quality', '85', `webp:${webpPath}`], this.commandOptions());
        await makeFilesPrivate([webpPath]);
        finalImagePath = webpPath;
      }

      const dimensions = await this.readImageDimensions(finalImagePath);
      const content = await fs.readFile(finalImagePath);

      this.logger.log(
        `Rendered base page ${pageNumber}/${pageCount} for book file ${bookFileId} with profile ${profile}`
      );

      return {
        content,
        contentType: profileConfig.contentType,
        pageNumber,
        pageCount,
        width: dimensions.width,
        height: dimensions.height,
        profile
      };
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch((error: unknown) => {
        this.logger.warn(`Could not remove rendering temporary directory: ${errorMessage(error)}`);
      });
    }
  }

  private async loadSourcePdf(bucket: string, objectKey: string): Promise<Buffer> {
    try {
      return await this.storage.getObjectBuffer(bucket, objectKey);
    } catch (error) {
      throw new RenderSourceError('Source document could not be loaded for rendering.', { cause: error });
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
      throw new RenderSourceError('Source document is invalid or unreadable.', { cause: error });
    }
  }

  private async readImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
    try {
      const { stdout } = await execFileAsync('identify', ['-format', '%w %h', imagePath], this.commandOptions());
      const [wStr, hStr] = stdout.trim().split(/\s+/);
      const width = Number.parseInt(wStr, 10);
      const height = Number.parseInt(hStr, 10);
      if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
        throw new Error(`identify returned invalid dimensions: ${stdout}`);
      }
      return { width, height };
    } catch (error) {
      throw new RenderSourceError('Failed to determine dimensions of rendered page image.', { cause: error });
    }
  }

  private commandOptions(): { timeout: number; maxBuffer: number } {
    return {
      timeout: this.commandTimeoutMs,
      maxBuffer: 20 * 1024 * 1024
    };
  }
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
