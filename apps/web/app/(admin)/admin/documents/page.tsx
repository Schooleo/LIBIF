import Link from 'next/link';
import { PageHeader } from '../../../../components/layout';
import { Button } from '../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../components/ui/feedback/feedback';
import { DocumentTable } from '../../../../components/domain/documents/DocumentTable';
import { fetchAdminDocuments } from '../../../../lib/api-server';

interface AdminDocumentsPageProps {
  searchParams?: Promise<{ search?: string; status?: string; categoryId?: string; page?: string }>;
}

export default async function AdminDocumentsPage({ searchParams }: AdminDocumentsPageProps) {
  const params = (await searchParams) || {};
  let pagedData: any = { items: [], totalCount: 0, page: 1, totalPages: 1 };
  let loadError: string | undefined;

  try {
    pagedData = await fetchAdminDocuments({
      search: params.search,
      status: params.status,
      categoryId: params.categoryId,
      page: params.page ? parseInt(params.page, 10) : 1,
      limit: 10
    });
  } catch (err) {
    loadError = (err as Error).message;
  }

  const tableItems = pagedData.items.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    subtitle: doc.subtitle,
    authors: doc.authors.map((a: any) => a.name),
    category: doc.category?.name ?? null,
    status: doc.status,
    activeFile: doc.activeFile,
    updatedAt: doc.updatedAt
  }));

  return (
    <section className="ui-stack ui-stack-lg">
      <PageHeader
        title="Admin Document Management"
        description="Inspect digital documents, verify intake status, edit metadata, or upload new files."
        actions={
          <Link href="/admin/documents/new">
            <Button variant="primary">New Document Intake</Button>
          </Link>
        }
      />

      {loadError ? <InlineAlert tone="error">Documents could not be loaded: {loadError}</InlineAlert> : null}

      <DocumentTable documents={tableItems} emptyMessage="No digital document records found." />
    </section>
  );
}
