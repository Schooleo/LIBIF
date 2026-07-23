export const PROTECTED_PAGE_RENDERER = Symbol('PROTECTED_PAGE_RENDERER');

export const RENDER_PROFILES = ['READER_STANDARD', 'READER_HIGH_DPI'] as const;
export type RenderProfile = (typeof RENDER_PROFILES)[number];

export type RenderBasePageInput = Readonly<{
  bookFileId: string;
  bucket: string;
  objectKey: string;
  pageNumber: number;
  profile: RenderProfile;
}>;

export type RenderedBasePage = Readonly<{
  content: Buffer;
  contentType: 'image/png' | 'image/webp';
  pageNumber: number;
  pageCount: number;
  width: number;
  height: number;
  profile: RenderProfile;
}>;

export type ComposePageWatermarkInput = Readonly<{
  basePage: RenderedBasePage;
  maskedReaderLabel: string;
  occurredAt: Date;
  documentId: string;
  pageNumber: number;
  opaqueTrace: string;
}>;

export type WatermarkedPage = Readonly<{
  content: Buffer;
  contentType: 'image/png' | 'image/webp';
  pageNumber: number;
  pageCount: number;
  width: number;
  height: number;
  traceFingerprint: string;
}>;

/**
 * Phase 7 contract owned by RenderingModule and consumed by AccessModule.
 *
 * Implementations must never return OCR text, object-storage credentials, an
 * object key, or a source-PDF URL. Only unwatermarked base pages may be cached;
 * personalized output is composed for one request and delivered no-store.
 */
export interface ProtectedPageRenderer {
  renderBasePage(input: RenderBasePageInput): Promise<RenderedBasePage>;
  composeWatermark(input: ComposePageWatermarkInput): Promise<WatermarkedPage>;
}
