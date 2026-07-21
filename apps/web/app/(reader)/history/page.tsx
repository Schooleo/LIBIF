import { PageHeader } from '../../../components/layout';
import { Badge, Card, EmptyState, InlineAlert, ProgressBar } from '../../../components/ui';
import { fetchReaderHistory } from '../../../lib/api-server';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  let historyItems: any[] = [];
  let errorMsg: string | null = null;

  try {
    historyItems = await fetchReaderHistory();
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title="Reading History"
        description="Review your recently accessed publications and track timestamped progress across reading sessions."
      />

      {errorMsg ? (
        <InlineAlert tone="error">Failed to load reading history: {errorMsg}</InlineAlert>
      ) : historyItems.length === 0 ? (
        <EmptyState title="No reading history yet">
          <p style={{ color: 'var(--color-text-secondary, #666)' }}>
            Start reading documents from the catalogue or your personal library to track your history.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a className="ui-button ui-button--primary" href="/catalogue">
              Browse Catalogue →
            </a>
          </div>
        </EmptyState>
      ) : (
        <div className="ui-stack" style={{ gap: '1rem' }}>
          {historyItems.map((item) => (
            <Card key={item.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'rgba(12, 102, 104, 0.1)',
                      color: 'var(--color-secondary, #0C6668)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                      history
                    </span>
                  </div>

                  <div>
                    <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary, #151C27)' }}>
                        {item.title}
                      </h3>
                      <Badge tone={item.status === 'PUBLISHED' ? 'success' : 'neutral'}>{item.status}</Badge>
                    </div>

                    {item.authors && item.authors.length > 0 ? (
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary, #414846)' }}>
                        By {item.authors.join(', ')}
                      </p>
                    ) : null}

                    {item.progress?.lastReadAt ? (
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted, #717976)' }}>
                        Last accessed: {new Date(item.progress.lastReadAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div style={{ minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  {item.progress ? (
                    <div style={{ width: '100%', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>Page {item.progress.currentPage} of {item.progress.totalPages}</span>
                        <span style={{ color: 'var(--color-secondary, #0C6668)' }}>{item.progress.percentage}%</span>
                      </div>
                      <ProgressBar value={item.progress.percentage} />
                    </div>
                  ) : null}

                  <a className="ui-button ui-button--primary ui-button--sm" href={`/documents/${item.id}/view`}>
                    Resume Reading →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
