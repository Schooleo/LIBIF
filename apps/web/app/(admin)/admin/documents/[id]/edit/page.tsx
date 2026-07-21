import Link from 'next/link';
import { PageHeader } from '../../../../../../components/layout';
import { Button } from '../../../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../../../components/ui/feedback/feedback';
import { fetchCategories, fetchDocumentDetail } from '../../../../../../lib/api-server';
import { EditDocumentClient } from './EditDocumentClient';

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = await params;
  let doc: any = null;
  let categories: any[] = [];
  let loadError: string | undefined;

  try {
    [doc, categories] = await Promise.all([fetchDocumentDetail(id), fetchCategories()]);
  } catch (err) {
    loadError = (err as Error).message;
  }

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
      <EditDocumentClient documentId={doc.id} initialValues={initialValues} categories={categories} />
    </section>
  );
}
