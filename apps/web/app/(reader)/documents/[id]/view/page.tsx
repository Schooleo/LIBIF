import { PageHeader } from '../../../../../components/layout';
import { Card, InlineAlert } from '../../../../../components/ui';
import { fetchAccessDecision, fetchPublicBooks } from '../../../../../lib/api-server';
import { ProtectedDocumentViewer } from '../../../../../components/domain/reader';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_FALLBACK: Record<string, { heading: string; body: string; icon: string }> = {
  PROCESSING: {
    heading: 'Document is Being Processed',
    body: 'This document is currently undergoing processing. Please check back shortly — it will be available for reading once processing is complete.',
    icon: 'autorenew',
  },
  PENDING_PROCESSING: {
    heading: 'Awaiting Processing',
    body: 'This document has been uploaded and is queued for processing. It will become available once the pipeline completes.',
    icon: 'schedule',
  },
  PENDING_APPROVAL: {
    heading: 'Under Review',
    body: 'This document is currently under librarian review and is not yet publicly available. Check back soon.',
    icon: 'pending_actions',
  },
  DRAFT: {
    heading: 'Not Yet Available',
    body: 'This document has not been published yet. Please return later.',
    icon: 'edit_note',
  },
  REJECTED: {
    heading: 'Document Not Available',
    body: 'This document is not available for reading.',
    icon: 'cancel',
  },
};

export default async function DocumentViewPage({ params }: PageProps) {
  const { id } = await params;

  let decision: { allowed: boolean; reason?: string; documentStatus?: string } = {
    allowed: false,
    reason: 'Verifying access eligibility...',
  };
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
  } catch {
    // Non-critical; title falls back to Document ID
  }

  if (!decision.allowed) {
    const fallback = STATUS_FALLBACK[decision.documentStatus ?? ''];
    return (
      <section className="ui-stack" style={{ gap: '1.5rem' }}>
        <PageHeader title="Access Restricted" description="Authorized reader stream boundary" />
        <Card>
          <div className="ui-stack" style={{ gap: '1.25rem', padding: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '2.5rem', color: 'var(--color-text-muted, #717976)' }}
                aria-hidden="true"
              >
                {fallback?.icon ?? 'lock'}
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-primary, #151C27)' }}>
                  {fallback?.heading ?? 'Access Restricted'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #414846)' }}>
                  {fallback?.body ?? (decision.reason || 'You do not have access entitlement to view this document.')}
                </p>
              </div>
            </div>

            {!fallback && (
              <InlineAlert tone="error">
                Access Denied: {decision.reason || 'You do not have access entitlement to view this document.'}
              </InlineAlert>
            )}

            <div className="ui-cluster" style={{ gap: '0.75rem' }}>
              <a className="ui-button ui-button--secondary" href={`/catalogue/${id}`}>
                ← View Document Details
              </a>
              <a className="ui-button ui-button--secondary" href="/library">
                Return to My Library
              </a>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="ui-stack">
      <ProtectedDocumentViewer documentId={id} title={title} />
    </section>
  );
}
