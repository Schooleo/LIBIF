'use client';

import { useState } from 'react';
import { classNames } from '../../../lib/classnames';
import { FormField } from './FormField';

type FileDropzoneProps = {
  label: string;
  accept?: string;
  maxSizeBytes?: number;
  file: File | null;
  onFile: (file: File | null) => void;
  description?: string;
  error?: string;
};

export function FileDropzone({ label, accept, maxSizeBytes, file, onFile, description, error }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const maxSizeError = file && maxSizeBytes && file.size > maxSizeBytes ? `File must be ${Math.round(maxSizeBytes / 1024 / 1024)}MB or smaller.` : undefined;
  const effectiveError = error ?? maxSizeError;
  const handleFiles = (files: FileList | null) => onFile(files?.[0] ?? null);
  return (
    <FormField label={label} description={description} error={effectiveError}>
      {(fieldProps) => (
        <div
          className={classNames('ui-dropzone', dragging && 'ui-dropzone--dragging')}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files); }}
        >
          <input {...fieldProps} type="file" accept={accept} onChange={(event) => handleFiles(event.target.files)} />
          <p>{file ? `Selected: ${file.name} (${Math.round(file.size / 1024)} KB)` : 'Drag and drop a file here or choose a file.'}</p>
        </div>
      )}
    </FormField>
  );
}
