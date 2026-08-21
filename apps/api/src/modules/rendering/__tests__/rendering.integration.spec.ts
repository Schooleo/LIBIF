import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { StorageService } from '../../storage/storage.service';
import { PageWatermarkService } from '../page-watermark.service';
import { PopplerPageRendererAdapter } from '../poppler-page-renderer.adapter';
import { PrivateBaseCacheService } from '../private-base-cache.service';
import { RenderBoundsError } from '../rendering.errors';
import { RenderingService } from '../rendering.service';

describe('RenderingService (Integration)', () => {
  let renderingService: RenderingService;
  let popplerAdapter: PopplerPageRendererAdapter;
  let cacheService: PrivateBaseCacheService;
  let watermarkService: PageWatermarkService;
  let mockStorage: jest.Mocked<StorageService>;

  let validPdfBuffer: Buffer;
  const inMemoryStorage = new Map<string, Buffer>();

  beforeAll(async () => {
    const fixturePath = path.join(__dirname, '../../../../test/fixtures/valid-sample.pdf');
    validPdfBuffer = await fs.readFile(fixturePath);
  });

  beforeEach(() => {
    inMemoryStorage.clear();

    mockStorage = {
      getObjectBuffer: jest.fn(async (_bucket: string, key: string) => {
        if (key === 'raw-books/test.pdf') return validPdfBuffer;
        const stored = inMemoryStorage.get(key);
        if (!stored) throw new Error(`Key ${key} not found`);
        return stored;
      }),
      putObject: jest.fn(async (_bucket: string, key: string, body: Buffer) => {
        inMemoryStorage.set(key, body);
      }),
      deleteObject: jest.fn(async (_bucket: string, key: string) => {
        inMemoryStorage.delete(key);
      }),
      ensureBucket: jest.fn(),
      putPrivatePdf: jest.fn()
    } as unknown as jest.Mocked<StorageService>;

    const config = new ConfigService({
      RENDER_COMMAND_TIMEOUT_MS: '15000',
      RENDER_CACHE_BUCKET: 'test-renders'
    });

    popplerAdapter = new PopplerPageRendererAdapter(mockStorage, config);
    cacheService = new PrivateBaseCacheService(mockStorage, config);
    watermarkService = new PageWatermarkService();

    renderingService = new RenderingService(popplerAdapter, cacheService, watermarkService);
  });

  it('renders a base page on cache miss and uses cache on subsequent calls', async () => {
    const input = {
      bookFileId: 'file-xyz',
      bucket: 'library-pdfs',
      objectKey: 'raw-books/test.pdf',
      pageNumber: 1,
      profile: 'READER_STANDARD' as const
    };

    const spyPoppler = jest.spyOn(popplerAdapter, 'renderBasePage');

    // First call: cache miss, renders via Poppler
    const page1 = await renderingService.renderBasePage(input);
    expect(page1.pageNumber).toBe(1);
    expect(page1.pageCount).toBe(2);
    expect(page1.contentType).toBe('image/webp');
    expect(spyPoppler).toHaveBeenCalledTimes(1);

    // Second call: cache hit
    const page1Cached = await renderingService.renderBasePage(input);
    expect(page1Cached.content.equals(page1.content)).toBe(true);
    expect(spyPoppler).toHaveBeenCalledTimes(1); // Still 1!
  });

  it('composes a watermarked page with unique trace fingerprint', async () => {
    const basePage = await renderingService.renderBasePage({
      bookFileId: 'file-xyz',
      bucket: 'library-pdfs',
      objectKey: 'raw-books/test.pdf',
      pageNumber: 1,
      profile: 'READER_STANDARD'
    });

    const watermarked1 = await renderingService.composeWatermark({
      basePage,
      maskedReaderLabel: 'R****789',
      occurredAt: new Date(),
      documentId: 'doc-123',
      pageNumber: 1,
      opaqueTrace: 'trace-fingerprint-aaa'
    });

    const watermarked2 = await renderingService.composeWatermark({
      basePage,
      maskedReaderLabel: 'R****999',
      occurredAt: new Date(),
      documentId: 'doc-123',
      pageNumber: 1,
      opaqueTrace: 'trace-fingerprint-bbb'
    });

    expect(watermarked1.traceFingerprint).toBe('trace-fingerprint-aaa');
    expect(watermarked2.traceFingerprint).toBe('trace-fingerprint-bbb');
    expect(watermarked1.content.equals(watermarked2.content)).toBe(false);
  });

  it('invalidates file base cache upon version updates or replacement', async () => {
    const input = {
      bookFileId: 'file-to-replace',
      bucket: 'library-pdfs',
      objectKey: 'raw-books/test.pdf',
      pageNumber: 1,
      profile: 'READER_STANDARD' as const
    };

    const spyPoppler = jest.spyOn(popplerAdapter, 'renderBasePage');

    await renderingService.renderBasePage(input);
    expect(spyPoppler).toHaveBeenCalledTimes(1);

    // Invalidate cache for file
    await renderingService.invalidateFileCache('file-to-replace');

    // Next call should re-render
    await renderingService.renderBasePage(input);
    expect(spyPoppler).toHaveBeenCalledTimes(2);
  });

  it('enforces bounds validation for out-of-range pages', async () => {
    await expect(
      renderingService.renderBasePage({
        bookFileId: 'file-xyz',
        bucket: 'library-pdfs',
        objectKey: 'raw-books/test.pdf',
        pageNumber: 0,
        profile: 'READER_STANDARD'
      })
    ).rejects.toThrow(RenderBoundsError);

    await expect(
      renderingService.renderBasePage({
        bookFileId: 'file-xyz',
        bucket: 'library-pdfs',
        objectKey: 'raw-books/test.pdf',
        pageNumber: 99,
        profile: 'READER_STANDARD'
      })
    ).rejects.toThrow(RenderBoundsError);
  });
});
