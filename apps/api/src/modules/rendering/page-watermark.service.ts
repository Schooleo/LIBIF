import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import {
  createPrivateOcrWorkspace,
  makeFilesPrivate,
  writePrivateFile
} from '../processing/ocr/ocr-temp-workspace';
import { ComposePageWatermarkInput, WatermarkedPage } from './protected-page-renderer.port';
import { WatermarkCompositionError } from './rendering.errors';

const execFileAsync = promisify(execFile);

@Injectable()
export class PageWatermarkService {
  private readonly logger = new Logger(PageWatermarkService.name);

  async composeWatermark(input: ComposePageWatermarkInput): Promise<WatermarkedPage> {
    const { basePage, maskedReaderLabel, occurredAt, documentId, pageNumber, opaqueTrace } = input;

    const tmpDir = await createPrivateOcrWorkspace(os.tmpdir());
    const baseExt = basePage.contentType === 'image/webp' ? 'webp' : 'png';
    const basePath = path.join(tmpDir, `base.${baseExt}`);
    const svgPath = path.join(tmpDir, 'watermark.svg');
    const outPath = path.join(tmpDir, `watermarked.${baseExt}`);

    try {
      await writePrivateFile(basePath, basePage.content);

      const svgContent = this.generateWatermarkSvg({
        width: basePage.width,
        height: basePage.height,
        maskedReaderLabel,
        occurredAt,
        documentId,
        pageNumber,
        opaqueTrace
      });

      await writePrivateFile(svgPath, svgContent);

      await execFileAsync(
        'convert',
        [basePath, svgPath, '-composite', '-quality', '85', outPath],
        { timeout: 15_000, maxBuffer: 20 * 1024 * 1024 }
      );

      await makeFilesPrivate([outPath]);
      const watermarkedContent = await fs.readFile(outPath);

      this.logger.debug(
        `Composed server-burned watermark for document ${documentId} p${pageNumber} (trace: ${opaqueTrace.slice(0, 8)})`
      );

      return {
        content: watermarkedContent,
        contentType: basePage.contentType,
        pageNumber: basePage.pageNumber,
        pageCount: basePage.pageCount,
        width: basePage.width,
        height: basePage.height,
        traceFingerprint: opaqueTrace
      };
    } catch (error) {
      this.logger.error(`Watermark composition failed: ${errorMessage(error)}`);
      throw new WatermarkCompositionError('Watermark composition failed.', { cause: error });
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch((err: unknown) => {
        this.logger.warn(`Failed to cleanup watermark temp workspace: ${errorMessage(err)}`);
      });
    }
  }

  private generateWatermarkSvg(params: {
    width: number;
    height: number;
    maskedReaderLabel: string;
    occurredAt: Date;
    documentId: string;
    pageNumber: number;
    opaqueTrace: string;
  }): string {
    const { width, height, maskedReaderLabel, occurredAt, documentId, pageNumber, opaqueTrace } = params;
    const isoTime = occurredAt.toISOString();
    const docShort = escapeXml(documentId.slice(0, 10));
    const label = escapeXml(maskedReaderLabel);
    const traceShort = escapeXml(opaqueTrace.slice(0, 16));
    const fullTrace = escapeXml(opaqueTrace);

    const fontSize = Math.max(14, Math.round(width / 60));
    const diagFontSize = Math.max(18, Math.round(width / 45));

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .wm-header { font-family: DejaVu Sans, Arial, sans-serif; font-size: ${fontSize}px; font-weight: bold; fill: rgba(120, 120, 120, 0.40); }
    .wm-footer { font-family: DejaVu Sans, Arial, sans-serif; font-size: ${fontSize}px; font-weight: bold; fill: rgba(120, 120, 120, 0.40); }
    .wm-diag   { font-family: DejaVu Sans, Arial, sans-serif; font-size: ${diagFontSize}px; font-weight: bold; fill: rgba(140, 140, 140, 0.22); }
  </style>

  <!-- Top Header Bar -->
  <text x="20" y="${fontSize + 15}" class="wm-header">LIBIF PROTECTED • ${label} • ${isoTime} • Doc:${docShort}/P${pageNumber}</text>

  <!-- Bottom Footer Bar -->
  <text x="20" y="${height - 20}" class="wm-footer">TRACE: ${traceShort}... • ${isoTime}</text>

  <!-- Diagonal Center Watermark -->
  <g transform="rotate(-30 ${width / 2} ${height / 2})">
    <text x="${width / 6}" y="${height / 2}" class="wm-diag">LIBIF • ${label} • TRACE:${fullTrace}</text>
  </g>
</svg>`;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
