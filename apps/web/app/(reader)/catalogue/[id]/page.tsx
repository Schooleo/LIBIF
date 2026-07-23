import { PageHeader } from '../../../../components/layout';
import { Badge, Card, InlineAlert } from '../../../../components/ui';
import { fetchAccessDecision, fetchPublicBookDetail, fetchReaderDocumentState } from '../../../../lib/api-server';
import type { PublicBookDetailDto, ReaderDocumentStateDto } from '../../../../lib/api-types';
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
  let book: PublicBookDetailDto | null = null;
  let readerState: ReaderDocumentStateDto | null = null;
  let errorMsg: string | null = null;

  try {
    decision = await fetchAccessDecision(id);
  } catch (err) {
    decision = { allowed: false, reason: (err as Error).message };
  }

  try {
    book = await fetchPublicBookDetail(id);
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  try {
    readerState = await fetchReaderDocumentState(id);
  } catch {
    // Public metadata remains useful when personalized state is unavailable.
  }

  const title = book?.title || `Document ${id}`;
  const subtitle = book?.subtitle;
  const description = book?.description;
  const authors = book?.authors?.map((a: { id: string; name: string }) => a.name) || [];
  const publisher = book?.publisher;
  const publishedYear = book?.publishedYear;
  const language = book?.language;
  const category = book?.category;
  const tags = book?.tags || [];
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

              {subtitle ? (
                <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-secondary, #414846)', fontStyle: 'italic' }}>
                  {subtitle}
                </p>
              ) : null}

              {authors.length > 0 ? (
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-secondary, #414846)', fontWeight: 500 }}>
                  Author(s): {authors.join(', ')}
                </p>
              ) : null}

              <div className="ui-cluster" style={{ gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #717976)' }}>
                {publisher ? <span>Publisher: {publisher} {publishedYear ? `(${publishedYear})` : ''}</span> : null}
                {book?.isbn ? <span>ISBN: {book.isbn}</span> : null}
                {language ? <span>Language: {language}</span> : null}
                {category ? <Badge tone="info">Category: {category.name}</Badge> : null}
              </div>

              {tags.length > 0 ? (
                <div className="ui-cluster" style={{ gap: '0.5rem', marginTop: '0.25rem' }}>
                  {tags.map((t) => (
                    <Badge key={t.id} tone="neutral">#{t.name}</Badge>
                  ))}
                </div>
              ) : null}

              {description ? (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-bg-subtle, #F4F6F8)', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--color-text-primary, #151C27)' }}>Description</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #414846)', lineHeight: 1.5 }}>
                    {description}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="ui-cluster" style={{ alignItems: 'center' }}>
              <BookmarkButton documentId={id} initialBookmarked={readerState?.bookmarked ?? false} />
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
