import { PageHeader } from '../../../../../components/layout';
import { InlineAlert } from '../../../../../components/ui';
import { fetchAccessDecision, fetchPublicBooks } from '../../../../../lib/api-server';
import { ProtectedDocumentViewer } from '../../../../../components/domain/reader';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentViewPage({ params }: PageProps) {
  const { id } = await params;

  let decision: { allowed: boolean; reason?: string } = { allowed: false, reason: 'Verifying access eligibility...' };
  let title = `Document ${id}`;

  try {
    decision = await fetchAccessDecision(id);
  } catch (err) {
    decision = { allowed: false, reason: (err as Error).message };
  }

  try {
    const books = await fetchPublicBooks();
    const book = books.find((b: any) => b.id === id);
    if (book?.title) {
      title = book.title;
    }
  } catch (err) {
    console.error('Failed to fetch book title for viewer:', err);
  }

  if (!decision.allowed) {
    return (
      <section className="ui-stack" style={{ gap: '1.5rem' }}>
        <PageHeader title="Access Restricted" description="Authorized reader stream boundary" />
        <InlineAlert tone="error">
          Access Denied: {decision.reason || 'You do not have access entitlement to view this document.'}
        </InlineAlert>
        <div>
          <a className="ui-button ui-button--secondary" href="/library">
            ← Return to My Library
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="ui-stack">
      <ProtectedDocumentViewer documentId={id} title={title} />
    </section>
  );
}
