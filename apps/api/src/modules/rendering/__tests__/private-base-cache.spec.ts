import { ConfigService } from '@nestjs/config';
import { StorageService } from '../../storage/storage.service';
import { PrivateBaseCacheService } from '../private-base-cache.service';
import { RenderedBasePage } from '../protected-page-renderer.port';

describe('PrivateBaseCacheService', () => {
  let cacheService: PrivateBaseCacheService;
  let mockStorage: jest.Mocked<StorageService>;
  let inMemoryStorage: Map<string, Buffer>;

  beforeEach(() => {
    inMemoryStorage = new Map<string, Buffer>();

    mockStorage = {
      getObjectBuffer: jest.fn(async (_bucket: string, key: string) => {
        const data = inMemoryStorage.get(key);
        if (!data) throw new Error(`Key ${key} not found`);
        return data;
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

    const config = new ConfigService({ RENDER_CACHE_BUCKET: 'test-renders' });
    cacheService = new PrivateBaseCacheService(mockStorage, config);
  });

  it('returns null on cache miss', async () => {
    const result = await cacheService.get('file-1', 1, 'READER_STANDARD');
    expect(result).toBeNull();
  });

  it('stores and retrieves a base page correctly (cache hit)', async () => {
    const samplePage: RenderedBasePage = {
      content: Buffer.from('fake-image-bytes'),
      contentType: 'image/webp',
      pageNumber: 1,
      pageCount: 10,
      width: 1600,
      height: 2200,
      profile: 'READER_STANDARD'
    };

    await cacheService.put(samplePage, 'file-1');

    const result = await cacheService.get('file-1', 1, 'READER_STANDARD');
    expect(result).not.toBeNull();
    expect(result?.content.toString()).toBe('fake-image-bytes');
    expect(result?.contentType).toBe('image/webp');
    expect(result?.pageNumber).toBe(1);
    expect(result?.pageCount).toBe(10);
    expect(result?.width).toBe(1600);
    expect(result?.height).toBe(2200);
  });

  it('isolates cache entries by bookFileId, pageNumber, and profile', async () => {
    const page1: RenderedBasePage = {
      content: Buffer.from('page-1-std'),
      contentType: 'image/webp',
      pageNumber: 1,
      pageCount: 5,
      width: 1600,
      height: 2200,
      profile: 'READER_STANDARD'
    };

    const page1HiDpi: RenderedBasePage = {
      content: Buffer.from('page-1-hidpi'),
      contentType: 'image/webp',
      pageNumber: 1,
      pageCount: 5,
      width: 2400,
      height: 3300,
      profile: 'READER_HIGH_DPI'
    };

    await cacheService.put(page1, 'file-A');
    await cacheService.put(page1HiDpi, 'file-A');

    const resStd = await cacheService.get('file-A', 1, 'READER_STANDARD');
    const resHi = await cacheService.get('file-A', 1, 'READER_HIGH_DPI');
    const resB = await cacheService.get('file-B', 1, 'READER_STANDARD');

    expect(resStd?.content.toString()).toBe('page-1-std');
    expect(resHi?.content.toString()).toBe('page-1-hidpi');
    expect(resB).toBeNull();
  });

  it('invalidates all page derivatives for a specified bookFileId', async () => {
    const page1: RenderedBasePage = {
      content: Buffer.from('page-1'),
      contentType: 'image/webp',
      pageNumber: 1,
      pageCount: 2,
      width: 1600,
      height: 2200,
      profile: 'READER_STANDARD'
    };

    const page2: RenderedBasePage = {
      content: Buffer.from('page-2'),
      contentType: 'image/webp',
      pageNumber: 2,
      pageCount: 2,
      width: 1600,
      height: 2200,
      profile: 'READER_STANDARD'
    };

    const pageOtherFile: RenderedBasePage = {
      content: Buffer.from('other-file-page'),
      contentType: 'image/webp',
      pageNumber: 1,
      pageCount: 2,
      width: 1600,
      height: 2200,
      profile: 'READER_STANDARD'
    };

    await cacheService.put(page1, 'file-to-invalidate');
    await cacheService.put(page2, 'file-to-invalidate');
    await cacheService.put(pageOtherFile, 'file-to-keep');

    await cacheService.invalidateByFileId('file-to-invalidate');

    expect(await cacheService.get('file-to-invalidate', 1, 'READER_STANDARD')).toBeNull();
    expect(await cacheService.get('file-to-invalidate', 2, 'READER_STANDARD')).toBeNull();
    expect((await cacheService.get('file-to-keep', 1, 'READER_STANDARD'))?.content.toString()).toBe('other-file-page');
  });
});
