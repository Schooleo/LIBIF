import { PageHeader } from '../../../components/layout';
import { Badge, Card, EmptyState, InlineAlert } from '../../../components/ui';
import { fetchReaderBookmarks } from '../../../lib/api-server';
import { BookmarkButton } from '../../../components/domain/reader';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  let bookmarks: any[] = [];
  let errorMsg: string | null = null;

  try {
    bookmarks = await fetchReaderBookmarks();
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title="Saved Bookmarks"
        description="Quick access to all documents bookmarked in your personal reader library."
      />

      {errorMsg ? (
        <InlineAlert tone="error">Failed to load bookmarks: {errorMsg}</InlineAlert>
      ) : bookmarks.length === 0 ? (
        <EmptyState title="No bookmarks saved yet">
          <p style={{ color: 'var(--color-text-secondary, #666)' }}>
            Bookmark documents from the catalogue or reading view for quick access.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a className="ui-button ui-button--primary" href="/catalogue">
              Browse Catalogue →
            </a>
          </div>
        </EmptyState>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {bookmarks.map((item) => (
            <Card key={item.id}>
              <div className="ui-stack" style={{ height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary, #151C27)' }}>
                      {item.title}
                    </h3>
                    <Badge tone={item.status === 'PUBLISHED' ? 'success' : 'neutral'}>{item.status}</Badge>
                  </div>

                  {item.authors && item.authors.length > 0 ? (
                    <p style={{ color: 'var(--color-text-secondary, #414846)', fontSize: '0.875rem', margin: '0.35rem 0' }}>
                      By {item.authors.join(', ')}
                    </p>
                  ) : null}

                  {item.publisher ? (
                    <p style={{ color: 'var(--color-text-muted, #717976)', fontSize: '0.8rem', margin: '0.1rem 0' }}>
                      {item.publisher} {item.publishedYear ? `(${item.publishedYear})` : ''}
                    </p>
                  ) : null}
                </div>

                <div className="ui-cluster" style={{ marginTop: '1.25rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a className="ui-button ui-button--primary ui-button--sm" href={`/documents/${item.id}/view`}>
                    Start Reading →
                  </a>
                  <BookmarkButton documentId={item.id} initialBookmarked={true} size="sm" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
