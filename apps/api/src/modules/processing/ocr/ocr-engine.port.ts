export interface OcrPageText {
  pageNumber: number;
  text: string;
}

export interface OcrResult {
  text: string;
  pages: OcrPageText[];
  method: 'EMBEDDED_TEXT' | 'OCR' | 'HYBRID';
  pageCount: number;
  language: string;
  checksumSha256: string;
  sizeBytes: bigint;
}

export interface OcrEngine {
  extractText(bucket: string, objectKey: string, mimeType?: string): Promise<OcrResult>;
}

export class OcrExtractionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = OcrExtractionError.name;
  }
}

export const OCR_ENGINE = Symbol('OCR_ENGINE');
