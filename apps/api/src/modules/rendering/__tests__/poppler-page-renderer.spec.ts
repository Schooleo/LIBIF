import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { StorageService } from '../../storage/storage.service';
import { PopplerPageRendererAdapter } from '../poppler-page-renderer.adapter';
import { RenderBoundsError, RenderSourceError } from '../rendering.errors';

describe('PopplerPageRendererAdapter', () => {
  let adapter: PopplerPageRendererAdapter;
  let mockStorage: jest.Mocked<StorageService>;
  let validPdfBuffer: Buffer;

  beforeAll(async () => {
    const fixturePath = path.join(__dirname, '../../../../test/fixtures/valid-sample.pdf');
    validPdfBuffer = await fs.readFile(fixturePath);
  });

  beforeEach(() => {
    mockStorage = {
      getObjectBuffer: jest.fn(),
      putObject: jest.fn(),
      deleteObject: jest.fn(),
      ensureBucket: jest.fn(),
      putPrivatePdf: jest.fn()
    } as unknown as jest.Mocked<StorageService>;

    const config = new ConfigService({
      RENDER_COMMAND_TIMEOUT_MS: '15000'
    });

    adapter = new PopplerPageRendererAdapter(mockStorage, config);
  });

  it('renders a valid page 1 from PDF', async () => {
    mockStorage.getObjectBuffer.mockResolvedValue(validPdfBuffer);

    const result = await adapter.renderBasePage({
      bookFileId: 'file-123',
      bucket: 'library-pdfs',
      objectKey: 'raw-books/test.pdf',
      pageNumber: 1,
      profile: 'READER_STANDARD'
    });

    expect(result.pageNumber).toBe(1);
    expect(result.pageCount).toBe(2);
    expect(result.contentType).toBe('image/webp');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.profile).toBe('READER_STANDARD');
  });

  it('renders page 2 from valid PDF', async () => {
    mockStorage.getObjectBuffer.mockResolvedValue(validPdfBuffer);

    const result = await adapter.renderBasePage({
      bookFileId: 'file-123',
      bucket: 'library-pdfs',
      objectKey: 'raw-books/test.pdf',
      pageNumber: 2,
      profile: 'READER_HIGH_DPI'
    });

    expect(result.pageNumber).toBe(2);
    expect(result.pageCount).toBe(2);
    expect(result.profile).toBe('READER_HIGH_DPI');
  });

  it('rejects pageNumber <= 0 with RenderBoundsError', async () => {
    await expect(
      adapter.renderBasePage({
        bookFileId: 'file-123',
        bucket: 'library-pdfs',
        objectKey: 'raw-books/test.pdf',
        pageNumber: 0,
        profile: 'READER_STANDARD'
      })
    ).rejects.toThrow(RenderBoundsError);
  });

  it('rejects pageNumber > totalPages with RenderBoundsError', async () => {
    mockStorage.getObjectBuffer.mockResolvedValue(validPdfBuffer);

    await expect(
      adapter.renderBasePage({
        bookFileId: 'file-123',
        bucket: 'library-pdfs',
        objectKey: 'raw-books/test.pdf',
        pageNumber: 99,
        profile: 'READER_STANDARD'
      })
    ).rejects.toThrow(RenderBoundsError);
  });

  it('handles corrupt PDF by throwing RenderSourceError', async () => {
    mockStorage.getObjectBuffer.mockResolvedValue(Buffer.from('not a pdf content'));

    await expect(
      adapter.renderBasePage({
        bookFileId: 'file-123',
        bucket: 'library-pdfs',
        objectKey: 'raw-books/test.pdf',
        pageNumber: 1,
        profile: 'READER_STANDARD'
      })
    ).rejects.toThrow(RenderSourceError);
  });
});
