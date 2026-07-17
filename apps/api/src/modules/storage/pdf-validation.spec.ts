import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { validatePdfUpload, MAX_PDF_SIZE_BYTES } from './pdf-validation';

function file(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'book.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 12,
    buffer: Buffer.from('%PDF-1.4\n'),
    stream: undefined as never,
    destination: '',
    filename: '',
    path: '',
    ...overrides
  };
}

describe('validatePdfUpload', () => {
  it('accepts a valid PDF upload', () => {
    expect(() => validatePdfUpload(file())).not.toThrow();
  });

  it('rejects non-PDF content', () => {
    expect(() => validatePdfUpload(file({ buffer: Buffer.from('not pdf'), originalname: 'book.txt', mimetype: 'text/plain' }))).toThrow(BadRequestException);
  });

  it('rejects oversized PDFs', () => {
    expect(() => validatePdfUpload(file({ size: MAX_PDF_SIZE_BYTES + 1 }))).toThrow(PayloadTooLargeException);
  });
});
