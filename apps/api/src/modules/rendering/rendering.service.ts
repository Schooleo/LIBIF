import { Inject, Injectable, Logger } from '@nestjs/common';
import { PageWatermarkService } from './page-watermark.service';
import { PopplerPageRendererAdapter } from './poppler-page-renderer.adapter';
import { PrivateBaseCacheService } from './private-base-cache.service';
import {
  ComposePageWatermarkInput,
  ProtectedPageRenderer,
  RenderBasePageInput,
  RenderedBasePage,
  WatermarkedPage
} from './protected-page-renderer.port';

@Injectable()
export class RenderingService implements ProtectedPageRenderer {
  private readonly logger = new Logger(RenderingService.name);

  constructor(
    @Inject(PopplerPageRendererAdapter) private readonly popplerAdapter: PopplerPageRendererAdapter,
    @Inject(PrivateBaseCacheService) private readonly cacheService: PrivateBaseCacheService,
    @Inject(PageWatermarkService) private readonly watermarkService: PageWatermarkService
  ) {}

  async renderBasePage(input: RenderBasePageInput): Promise<RenderedBasePage> {
    const cached = await this.cacheService.get(input.bookFileId, input.pageNumber, input.profile);
    if (cached) {
      return cached;
    }

    const rendered = await this.popplerAdapter.renderBasePage(input);
    await this.cacheService.put(rendered, input.bookFileId);
    return rendered;
  }

  async composeWatermark(input: ComposePageWatermarkInput): Promise<WatermarkedPage> {
    return this.watermarkService.composeWatermark(input);
  }

  async invalidateFileCache(bookFileId: string): Promise<void> {
    this.logger.log(`Received request to invalidate rendering cache for book file ${bookFileId}`);
    await this.cacheService.invalidateByFileId(bookFileId);
  }
}
