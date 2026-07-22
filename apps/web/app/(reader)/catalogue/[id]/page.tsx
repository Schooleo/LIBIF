import { PageHeader } from '../../../../components/layout';
import { Badge, Card, InlineAlert } from '../../../../components/ui';
import { fetchAccessDecision, fetchPublicBooks } from '../../../../lib/api-server';
import { BookmarkButton } from '../../../../components/domain/reader';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Icon + label pairs for reader-visible lifecycle states (no admin-only internals). */
const STATUS_META: Record<string, { icon: string; label: string; tone: 'info' | 'warning' | 'error' | 'success' }> = {
  PUBLISHED: { icon: 'check_circle', label: 'Available for Reading', tone: 'success' },
  PROCESSING: { icon: 'autorenew', label: 'Being Processed', tone: 'info' },
  PENDING_PROCESSING: { icon: 'schedule', label: 'Awaiting Processing', tone: 'info' },
  PENDING_APPROVAL: { icon: 'pending_actions', label: 'Under Review', tone: 'warning' },
  DRAFT: { icon: 'edit_note', label: 'Not Yet Available', tone: 'warning' },
  REJECTED: { icon: 'cancel', label: 'Not Available', tone: 'error' },
};

function getStatusMeta(status?: string) {
  return STATUS_META[status ?? ''] ?? { icon: 'help_outline', label: 'Unavailable', tone: 'warning' as const };
}

export default async function CatalogueDetailPage({ params }: PageProps) {
  const { id } = await params;

  let decision: { allowed: boolean; reason?: string; documentStatus?: string } = {
    allowed: false,
    reason: 'Checking access eligibility...',
  };
  let books: any[] = [];
  let book: any = null;
  let errorMsg: string | null = null;

  try {
    decision = await fetchAccessDecision(id);
  } catch (err) {
    decision = { allowed: false, reason: (err as Error).message };
  }

  try {
    books = await fetchPublicBooks();
    book = books.find((b) => b.id === id);
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  const title = book?.title || `Document ${id}`;
  const authors = book?.authors?.map((a: any) => a.name || a) || [];
  const publisher = book?.publisher;
  const publishedYear = book?.publishedYear;
  const statusMeta = getStatusMeta(decision.documentStatus);

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title={title}
        description="Publication details, metadata, and protected digital access eligibility."
      />

      {errorMsg ? <InlineAlert tone="error">Failed to load document metadata: {errorMsg}</InlineAlert> : null}

      <Card>
        <div className="ui-stack" style={{ gap: '1.5rem', padding: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="ui-stack" style={{ gap: '0.5rem' }}>
              <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary, #151C27)' }}>{title}</h2>
                <Badge tone={statusMeta.tone}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', verticalAlign: 'middle', marginRight: '4px' }} aria-hidden="true">
                    {statusMeta.icon}
                  </span>
                  {statusMeta.label}
                </Badge>
              </div>

              {authors.length > 0 ? (
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-secondary, #414846)', fontWeight: 500 }}>
                  Author(s): {authors.join(', ')}
                </p>
              ) : null}

              {publisher ? (
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #717976)' }}>
                  Publisher: {publisher} {publishedYear ? `(${publishedYear})` : ''}
                </p>
              ) : null}
            </div>

            <div className="ui-cluster" style={{ alignItems: 'center' }}>
              <BookmarkButton documentId={id} />
            </div>
          </div>

          {/* Lifecycle State Banner */}
          {decision.allowed ? (
            <InlineAlert tone="info">
              <strong>Access Decision:</strong> {decision.reason || 'Document is published and available for reading.'}
            </InlineAlert>
          ) : (
            <InlineAlert tone={statusMeta.tone}>
              <strong>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', verticalAlign: 'middle', marginRight: '4px' }} aria-hidden="true">
                  {statusMeta.icon}
                </span>
                {statusMeta.label}:
              </strong>{' '}
              {decision.reason || 'This document is not currently available for reading.'}
            </InlineAlert>
          )}

          {/* Actions Bar */}
          <div className="ui-cluster" style={{ gap: '1rem', paddingTop: '0.5rem' }}>
            {decision.allowed ? (
              <a className="ui-button ui-button--primary" href={`/documents/${id}/view`}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }} aria-hidden="true">
                  menu_book
                </span>
                Open Reader Viewer →
              </a>
            ) : (
              <button type="button" className="ui-button ui-button--secondary" disabled aria-disabled="true">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '6px' }} aria-hidden="true">
                  lock
                </span>
                {statusMeta.label}
              </button>
            )}

            <a className="ui-button ui-button--secondary" href="/catalogue">
              ← Back to Catalogue
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}
