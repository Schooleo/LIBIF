'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentMetadataForm, DocumentMetadataFormValues, CategoryOption, TagOption } from '../../../../../../components/domain/documents/DocumentMetadataForm';
import { InlineAlert } from '../../../../../../components/ui/feedback/feedback';

interface EditDocumentClientProps {
  documentId: string;
  initialValues: Partial<DocumentMetadataFormValues>;
  categories: CategoryOption[];
  tags: TagOption[];
}

export function EditDocumentClient({ documentId, initialValues, categories, tags }: EditDocumentClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (values: DocumentMetadataFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    const payload = {
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

    try {
      const res = await fetch(`/api/documents/${documentId}/metadata`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || 'Failed to update document metadata.');
      }
      router.push(`/admin/documents/${documentId}`);
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message || 'Update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-stack ui-stack-md">
      {errorMsg ? <InlineAlert tone="error">{errorMsg}</InlineAlert> : null}
      <DocumentMetadataForm
        initialValues={initialValues}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        submitLabel="Save Metadata Changes"
        isLoading={isLoading}
      />
    </div>
  );
}
