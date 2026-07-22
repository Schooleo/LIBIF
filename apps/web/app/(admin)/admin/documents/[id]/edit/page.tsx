import Link from 'next/link';
import { PageHeader } from '../../../../../../components/layout';
import { Button } from '../../../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../../../components/ui/feedback/feedback';
import { fetchDocumentDetail, fetchTaxonomyCategories, fetchTaxonomyTags } from '../../../../../../lib/api-server';
import { EditDocumentClient } from './EditDocumentClient';

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = await params;
  const [documentResult, categoryResult, tagResult] = await Promise.allSettled([
    fetchDocumentDetail(id),
    fetchTaxonomyCategories(),
    fetchTaxonomyTags()
  ]);
  const doc: any = documentResult.status === 'fulfilled' ? documentResult.value : null;
  const categories = categoryResult.status === 'fulfilled' ? categoryResult.value : [];
  const tags = tagResult.status === 'fulfilled' ? tagResult.value : [];
  const loadError = documentResult.status === 'rejected'
    ? (documentResult.reason instanceof Error ? documentResult.reason.message : 'Document request failed')
    : undefined;
  const taxonomyErrors = [categoryResult, tagResult]
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason instanceof Error ? result.reason.message : 'Unknown taxonomy error');

  if (loadError || !doc) {
    return (
      <section className="ui-stack">
        <PageHeader title="Edit Document Metadata" />
        <InlineAlert tone="error">Failed to load document: {loadError || 'Not found'}</InlineAlert>
        <Link href="/admin/documents">
          <Button variant="secondary">Back to Documents List</Button>
        </Link>
      </section>
    );
  }

  const initialValues = {
    title: doc.title || '',
    subtitle: doc.subtitle || '',
    description: doc.description || '',
    publisher: doc.publisher || '',
    publishedYear: doc.publishedYear ? String(doc.publishedYear) : '',
    language: doc.language || 'vi',
    isbn: doc.isbn || '',
    categoryId: doc.category?.id || '',
    authors: doc.authors?.map((a: any) => a.name).join(', ') || '',
    tags: doc.tags?.map((t: any) => t.name).join(', ') || ''
  };

  return (
    <section className="ui-stack ui-stack-lg">
      <PageHeader
        title={`Edit: ${doc.title}`}
        description="Update metadata attributes, assigned categories, and tags."
        actions={
          <Link href={`/admin/documents/${doc.id}`}>
            <Button variant="secondary">Cancel & Return</Button>
          </Link>
        }
      />
      {taxonomyErrors.length > 0 ? <InlineAlert tone="error">Some taxonomy options could not be loaded: {taxonomyErrors.join('; ')}</InlineAlert> : null}
      <EditDocumentClient documentId={doc.id} initialValues={initialValues} categories={categories} tags={tags} />
    </section>
  );
}
