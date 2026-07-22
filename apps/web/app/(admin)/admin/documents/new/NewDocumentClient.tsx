'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '../../../../../components/ui/forms/FormField';
import { FileDropzone } from '../../../../../components/ui/forms/FileDropzone';
import { DocumentMetadataForm, type DocumentMetadataFormValues, type CategoryOption, type TagOption } from '../../../../../components/domain/documents/DocumentMetadataForm';
import { InlineAlert } from '../../../../../components/ui/feedback/feedback';

interface NewDocumentClientProps {
  categories: CategoryOption[];
  tags: TagOption[];
}

export function NewDocumentClient({ categories, tags }: NewDocumentClientProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (values: DocumentMetadataFormValues) => {
    setErrorMsg(null);
    if (!selectedFile) {
      setErrorMsg('Please select a PDF document file to upload.');
      return;
    }

    setIsLoading(true);

    const metadataPayload = {
      title: values.title.trim(),
      subtitle: values.subtitle.trim() || undefined,
      description: values.description.trim() || undefined,
      publisher: values.publisher.trim() || undefined,
      publishedYear: values.publishedYear ? parseInt(values.publishedYear, 10) : undefined,
      language: values.language || 'vi',
      isbn: values.isbn.trim() || undefined,
      categoryId: values.categoryId || undefined,
      authors: values.authors.split(',').map((s: string) => s.trim()).filter((s: string) => Boolean(s)),
      tags: values.tags.split(',').map((s: string) => s.trim()).filter((s: string) => Boolean(s))
    };

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('metadata', JSON.stringify(metadataPayload));

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(err.message || 'Failed to submit document upload intake.');
      }

      const result = await res.json() as { book: { id: string } };
      router.push(`/admin/documents/${result.book.id}`);
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message || 'Upload intake failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-stack ui-stack-lg">
      {errorMsg ? <InlineAlert tone="error">{errorMsg}</InlineAlert> : null}

      <FormField
        label="Document File (PDF)"
        required
        description="Select a scanned or digital PDF document (Max 500MB)"
      >
        {() => (
          <FileDropzone
            label="Drop PDF file here or click to browse"
            accept="application/pdf"
            file={selectedFile}
            onFile={setSelectedFile}
          />
        )}
      </FormField>

      <DocumentMetadataForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        submitLabel="Create Document & Submit Intake"
        isLoading={isLoading}
      />
    </div>
  );
}
