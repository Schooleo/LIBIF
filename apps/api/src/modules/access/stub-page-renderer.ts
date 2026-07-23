import { Injectable } from '@nestjs/common';
import {
  ComposePageWatermarkInput,
  ProtectedPageRenderer,
  RenderBasePageInput,
  RenderedBasePage,
  WatermarkedPage,
} from '../rendering/protected-page-renderer.port';

// Minimal 1x1 PNG pixel buffer for testing/stub rendering
const MINIMAL_PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

@Injectable()
export class StubProtectedPageRenderer implements ProtectedPageRenderer {
  async renderBasePage(input: RenderBasePageInput): Promise<RenderedBasePage> {
    return {
      content: MINIMAL_PNG_BUFFER,
      contentType: 'image/png',
      pageNumber: input.pageNumber,
      pageCount: 10, // Default stub page count
      width: 800,
      height: 1131,
      profile: input.profile,
    };
  }

  async composeWatermark(
    input: ComposePageWatermarkInput,
  ): Promise<WatermarkedPage> {
    return {
      content: MINIMAL_PNG_BUFFER,
      contentType: 'image/png',
      pageNumber: input.pageNumber,
      pageCount: input.basePage.pageCount,
      width: input.basePage.width,
      height: input.basePage.height,
      traceFingerprint: input.opaqueTrace,
    };
  }
}
