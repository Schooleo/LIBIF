export interface OcrResult {
  text: string;
  method: 'EMBEDDED_TEXT' | 'OCR' | 'HYBRID';
  pageCount: number;
  language: string;
  checksumSha256: string;
  sizeBytes: bigint;
}

export interface OcrEngine {
  extractText(bucket: string, objectKey: string, mimeType?: string): Promise<OcrResult>;
}

export const OCR_ENGINE = Symbol('OCR_ENGINE');
