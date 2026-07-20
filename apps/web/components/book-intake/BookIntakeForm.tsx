'use client';

import type { CategoryDto, CreateBookIntakeDto, CreateBookIntakeResponse } from '../../lib/api';
import { useMemo, useState } from 'react';
import { lookupIsbn, uploadBookIntake } from '../../lib/api';
import { Button, Card, InlineAlert, ProgressBar, ResultState } from '../ui';
import { CategoryTagFields } from './CategoryTagFields';
import { MetadataFields } from './MetadataFields';
import { PdfDropzone } from './PdfDropzone';

const initialMetadata: CreateBookIntakeDto = {
  title: '',
  authors: [],
  tags: [],
  language: 'vi'
};

export function BookIntakeForm({ categories }: { categories: CategoryDto[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<CreateBookIntakeDto>(initialMetadata);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();
  const [lookupMessage, setLookupMessage] = useState<string>();
  const [result, setResult] = useState<CreateBookIntakeResponse>();

  const fileError = useMemo(() => {
    if (!file) return undefined;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return 'Only PDF files are accepted.';
    if (file.size > 200 * 1024 * 1024) return 'PDF file must be 200MB or smaller.';
    return undefined;
  }, [file]);
  const canSubmit = Boolean(file && !fileError && metadata.title.trim() && metadata.authors.length > 0);

  const handleLookup = async () => {
    if (!metadata.isbn) {
      setLookupMessage('Enter an ISBN first.');
      return;
    }
    const response = await lookupIsbn(metadata.isbn);
    if (!response.found || !response.metadata) {
      setLookupMessage(response.message ?? 'Không tìm thấy thông tin, vui lòng tự điền.');
      return;
    }
    setMetadata({ ...metadata, ...response.metadata, tags: metadata.tags });
    setLookupMessage('Metadata loaded from ISBN lookup.');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !canSubmit) return;
    setError(undefined);
    setResult(undefined);
    setProgress(0);
    try {
      const response = await uploadBookIntake(file, metadata, setProgress);
      setResult(response);
      setProgress(100);
    } catch (uploadError) {
      setError((uploadError as Error).message);
    }
  };

  return (
    <Card>
      <form className="ui-stack" onSubmit={submit}>
        <PdfDropzone file={file} onFile={setFile} error={fileError} />
        <MetadataFields metadata={metadata} onChange={setMetadata} onLookup={handleLookup} lookupMessage={lookupMessage} />
        <CategoryTagFields categories={categories} metadata={metadata} onChange={setMetadata} />
        {progress > 0 ? <ProgressBar label="Upload progress" value={progress} /> : null}
        <Button type="submit" disabled={!canSubmit}>Create digital book intake</Button>
        {error ? <InlineAlert tone="error">{error}</InlineAlert> : null}
        {result ? (
          <ResultState title="Book intake queued">
            <p>Book ID: {result.book.id}</p>
            <p>Status: {result.book.status}</p>
            <p>Processing job: {result.processingJob.id} ({result.processingJob.status})</p>
            <p><a href="/admin/books">View admin book list</a></p>
          </ResultState>
        ) : null}
      </form>
    </Card>
  );
}
