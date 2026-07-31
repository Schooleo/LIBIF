import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../storage/storage.service';
import { RenderedBasePage, RenderProfile } from './protected-page-renderer.port';

type CachedPageMeta = {
  contentType: 'image/png' | 'image/webp';
  pageCount: number;
  width: number;
  height: number;
};

@Injectable()
export class PrivateBaseCacheService {
  private readonly logger = new Logger(PrivateBaseCacheService.name);
  private readonly cacheBucket: string;

  constructor(
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(ConfigService) config: ConfigService
  ) {
    this.cacheBucket = config.get<string>('RENDER_CACHE_BUCKET') ?? config.get<string>('S3_BUCKET') ?? 'library-pdfs';
  }

  async get(bookFileId: string, pageNumber: number, profile: RenderProfile): Promise<RenderedBasePage | null> {
    const imgKey = this.getImgKey(bookFileId, pageNumber, profile);
    const metaKey = this.getMetaKey(bookFileId, pageNumber, profile);

    try {
      const [imgBuffer, metaBuffer] = await Promise.all([
        this.storage.getObjectBuffer(this.cacheBucket, imgKey),
        this.storage.getObjectBuffer(this.cacheBucket, metaKey)
      ]);

      const meta = JSON.parse(metaBuffer.toString('utf8')) as CachedPageMeta;

      this.logger.debug(`Cache HIT for base page ${bookFileId} p${pageNumber} [${profile}]`);

      return {
        content: imgBuffer,
        contentType: meta.contentType,
        pageNumber,
        pageCount: meta.pageCount,
        width: meta.width,
        height: meta.height,
        profile
      };
    } catch {
      this.logger.debug(`Cache MISS for base page ${bookFileId} p${pageNumber} [${profile}]`);
      return null;
    }
  }

  async put(page: RenderedBasePage, bookFileId: string): Promise<void> {
    const imgKey = this.getImgKey(bookFileId, page.pageNumber, page.profile);
    const metaKey = this.getMetaKey(bookFileId, page.pageNumber, page.profile);
    const indexKey = this.getIndexKey(bookFileId);

    const meta: CachedPageMeta = {
      contentType: page.contentType,
      pageCount: page.pageCount,
      width: page.width,
      height: page.height
    };

    try {
      await Promise.all([
        this.storage.putObject(this.cacheBucket, imgKey, page.content, page.contentType),
        this.storage.putObject(this.cacheBucket, metaKey, Buffer.from(JSON.stringify(meta), 'utf8'), 'application/json')
      ]);

      const indexKeys = await this.readIndex(indexKey);
      if (!indexKeys.includes(imgKey) || !indexKeys.includes(metaKey)) {
        const updated = Array.from(new Set([...indexKeys, imgKey, metaKey]));
        await this.storage.putObject(
          this.cacheBucket,
          indexKey,
          Buffer.from(JSON.stringify(updated), 'utf8'),
          'application/json'
        );
      }

      this.logger.debug(`Cached base page ${bookFileId} p${page.pageNumber} [${page.profile}]`);
    } catch (error) {
      this.logger.warn(`Failed to store base page cache: ${errorMessage(error)}`);
    }
  }

  async invalidateByFileId(bookFileId: string): Promise<void> {
    const indexKey = this.getIndexKey(bookFileId);
    try {
      const keys = await this.readIndex(indexKey);
      if (keys.length === 0) return;

      await Promise.all(keys.map((key) => this.storage.deleteObject(this.cacheBucket, key)));
      await this.storage.deleteObject(this.cacheBucket, indexKey);

      this.logger.log(`Invalidated ${keys.length} cached base page derivative(s) for book file ${bookFileId}`);
    } catch (error) {
      this.logger.warn(`Failed to invalidate cache for book file ${bookFileId}: ${errorMessage(error)}`);
    }
  }

  private getImgKey(bookFileId: string, pageNumber: number, profile: RenderProfile): string {
    return `renders/bases/${bookFileId}/${pageNumber}/${profile}.img`;
  }

  private getMetaKey(bookFileId: string, pageNumber: number, profile: RenderProfile): string {
    return `renders/bases/${bookFileId}/${pageNumber}/${profile}.json`;
  }

  private getIndexKey(bookFileId: string): string {
    return `renders/bases/${bookFileId}/index.json`;
  }

  private async readIndex(indexKey: string): Promise<string[]> {
    try {
      const buffer = await this.storage.getObjectBuffer(this.cacheBucket, indexKey);
      return JSON.parse(buffer.toString('utf8')) as string[];
    } catch {
      return [];
    }
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
