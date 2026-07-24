import { PageWatermarkService } from '../page-watermark.service';
import { RenderedBasePage } from '../protected-page-renderer.port';
import { WatermarkCompositionError } from '../rendering.errors';
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

describe('PageWatermarkService', () => {
  let service: PageWatermarkService;
  let basePage: RenderedBasePage;

  beforeAll(async () => {
    // Generate a real test PNG buffer (200x300) with binary encoding
    const { stdout } = await execFileAsync('convert', ['-size', '200x300', 'xc:white', 'png:-'], { encoding: 'buffer' });
    const pngBuffer = Buffer.from(stdout);

    basePage = {
      content: pngBuffer,
      contentType: 'image/png',
      pageNumber: 1,
      pageCount: 10,
      width: 200,
      height: 300,
      profile: 'READER_STANDARD'
    };
  });

  beforeEach(() => {
    service = new PageWatermarkService();
  });

  it('composes a watermarked page with trace fingerprint', async () => {
    const result = await service.composeWatermark({
      basePage,
      maskedReaderLabel: 'R****123',
      occurredAt: new Date('2026-07-23T12:00:00Z'),
      documentId: 'doc-abc-12345',
      pageNumber: 1,
      opaqueTrace: 'trace-sha256-fingerprint-999'
    });

    expect(result.pageNumber).toBe(1);
    expect(result.pageCount).toBe(10);
    expect(result.width).toBe(200);
    expect(result.height).toBe(300);
    expect(result.traceFingerprint).toBe('trace-sha256-fingerprint-999');
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('generates unique watermarks for different reader identities and trace IDs', async () => {
    const res1 = await service.composeWatermark({
      basePage,
      maskedReaderLabel: 'R****111',
      occurredAt: new Date('2026-07-23T12:00:00Z'),
      documentId: 'doc-abc-12345',
      pageNumber: 1,
      opaqueTrace: 'trace-111'
    });

    const res2 = await service.composeWatermark({
      basePage,
      maskedReaderLabel: 'R****222',
      occurredAt: new Date('2026-07-23T12:00:00Z'),
      documentId: 'doc-abc-12345',
      pageNumber: 1,
      opaqueTrace: 'trace-222'
    });

    expect(res1.traceFingerprint).toBe('trace-111');
    expect(res2.traceFingerprint).toBe('trace-222');
    expect(res1.content.equals(res2.content)).toBe(false);
  });

  it('uses a larger bottom-left to top-right diagonal watermark', () => {
    const generateWatermarkSvg = (service as unknown as {
      generateWatermarkSvg: (params: {
        width: number;
        height: number;
        maskedReaderLabel: string;
        occurredAt: Date;
        documentId: string;
        pageNumber: number;
        opaqueTrace: string;
      }) => string;
    }).generateWatermarkSvg;

    const svg = generateWatermarkSvg({
      width: 200,
      height: 300,
      maskedReaderLabel: 'R****123',
      occurredAt: new Date('2026-07-23T12:00:00Z'),
      documentId: 'doc-abc-12345',
      pageNumber: 1,
      opaqueTrace: 'trace-diagonal'
    });

    expect(svg).toContain('font-size: 32px');
    expect(svg).toContain('transform="rotate(-56.309932474020215 0 300)"');
    expect(svg).toContain('<text x="20" y="280" class="wm-diag">');
  });

  it.each([
    ['PNG', 'image/png', 'png'],
    ['WebP', 'image/webp', 'webp']
  ] as const)('preserves the rendered document pixels beneath a %s watermark', async (_label, contentType, extension) => {
    const { stdout } = await execFileAsync('convert', ['-size', '200x300', 'xc:black', `${extension}:-`], {
      encoding: 'buffer'
    });
    const documentPage: RenderedBasePage = {
      ...basePage,
      content: Buffer.from(stdout),
      contentType
    };

    const result = await service.composeWatermark({
      basePage: documentPage,
      maskedReaderLabel: 'R****123',
      occurredAt: new Date('2026-07-23T12:00:00Z'),
      documentId: 'doc-abc-12345',
      pageNumber: 1,
      opaqueTrace: 'trace-preserves-document'
    });

    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'libif-watermark-test-'));
    const outputPath = path.join(workspace, `watermarked.${extension}`);
    try {
      await fs.writeFile(outputPath, result.content);
      const { stdout: meanOutput } = await execFileAsync('identify', ['-format', '%[fx:mean]', outputPath]);
      expect(result.contentType).toBe(contentType);
      expect(Number.parseFloat(meanOutput)).toBeLessThan(0.25);
    } finally {
      await fs.rm(workspace, { recursive: true, force: true });
    }
  });

  it('throws WatermarkCompositionError on corrupt base page content', async () => {
    const corruptBase: RenderedBasePage = {
      ...basePage,
      content: Buffer.from('invalid-image-data')
    };

    await expect(
      service.composeWatermark({
        basePage: corruptBase,
        maskedReaderLabel: 'R****123',
        occurredAt: new Date('2026-07-23T12:00:00Z'),
        documentId: 'doc-abc-12345',
        pageNumber: 1,
        opaqueTrace: 'trace-999'
      })
    ).rejects.toThrow(WatermarkCompositionError);
  });
});
