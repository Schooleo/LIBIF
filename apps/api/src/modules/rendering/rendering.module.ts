import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';
import { PageWatermarkService } from './page-watermark.service';
import { PopplerPageRendererAdapter } from './poppler-page-renderer.adapter';
import { PrivateBaseCacheService } from './private-base-cache.service';
import { PROTECTED_PAGE_RENDERER } from './protected-page-renderer.port';
import { RenderingService } from './rendering.service';

@Module({
  imports: [ConfigModule, StorageModule],
  providers: [
    PopplerPageRendererAdapter,
    PrivateBaseCacheService,
    PageWatermarkService,
    RenderingService,
    {
      provide: PROTECTED_PAGE_RENDERER,
      useExisting: RenderingService
    }
  ],
  exports: [PROTECTED_PAGE_RENDERER, RenderingService]
})
export class RenderingModule {}
