import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';

export const MAX_PDF_SIZE_BYTES = 200 * 1024 * 1024;

export function validatePdfUpload(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('PDF file is required.');
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new PayloadTooLargeException('PDF file must be 200MB or smaller.');
  }
  const header = file.buffer.subarray(0, 4).toString('utf8');
  const filenameLooksPdf = file.originalname.toLowerCase().endsWith('.pdf');
  const mimeLooksPdf = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
  if (header !== '%PDF' || !filenameLooksPdf || !mimeLooksPdf) {
    throw new BadRequestException('Only valid PDF files are accepted.');
  }
}
