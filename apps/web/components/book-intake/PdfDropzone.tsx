'use client';

import { FileDropzone } from '../ui';

type Props = {
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string;
};

export function PdfDropzone({ file, onFile, error }: Props) {
  return <FileDropzone label="PDF file" description="PDF file (max 200MB). Drag and drop a scanned PDF here." accept="application/pdf,.pdf" maxSizeBytes={200 * 1024 * 1024} file={file} onFile={onFile} error={error} />;
}
