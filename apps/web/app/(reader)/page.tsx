import { PageHeader } from '../../components/layout';
import { Badge, Card } from '../../components/ui';
import { fetchPublicBooks, fetchReaderLibrary } from '../../lib/api-server';
import type { PublicBookListItemDto } from '../../lib/api-types';
import { ContinueReading } from '../../components/domain/reader';

export const dynamic = 'force-dynamic';

export default async function ReaderHomePage() {
  let publicBooks: PublicBookListItemDto[] = [];
  let libraryItems: any[] = [];
  let readingCount = 0;
  let bookmarkedCount = 0;

  try {
    const publicRes = await fetchPublicBooks();
    publicBooks = publicRes.items;
  } catch (err) {
    console.error('Failed to load public books for reader home', err);
  }

  try {
    const libraryRes = await fetchReaderLibrary();
    libraryItems = libraryRes?.items || [];
    readingCount = libraryRes?.readingCount || 0;
    bookmarkedCount = libraryRes?.bookmarkedCount || 0;
  } catch (err) {
    console.error('Failed to load reader library for reader home', err);
  }

  return (
    <section className="ui-stack" style={{ gap: '1.75rem' }}>
      <PageHeader
        title="LIBIF Reader Portal"
        description="Access institutional digital publications, manage your personal library, and continue active reading sessions."
      />

      {/* Overview Metric Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'rgba(16, 60, 53, 0.1)',
                color: 'var(--color-action-primary, #103C35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                local_library
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>MY LIBRARY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-action-primary, #103C35)' }}>{libraryItems.length} Items</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'rgba(12, 102, 104, 0.1)',
                color: 'var(--color-secondary, #0C6668)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                menu_book
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>CURRENTLY READING</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary, #0C6668)' }}>{readingCount} Active</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'rgba(184, 125, 0, 0.1)',
                color: '#B87D00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                bookmark
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>SAVED BOOKMARKS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#B87D00' }}>{bookmarkedCount} Saved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Continue Reading Section (If active progress items exist) */}
      <ContinueReading items={libraryItems} />

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Card>
          <div className="ui-stack" style={{ justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-action-primary, #103C35)' }} aria-hidden="true">
                  search
                </span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-primary, #151C27)' }}>Public Catalogue</h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary, #414846)', fontSize: '0.9rem', margin: 0 }}>
                Explore published books, research publications, and institutional documents across all categories.
              </p>
            </div>
            <div>
              <a className="ui-button ui-button--primary" href="/catalogue" style={{ width: '100%', justifyContent: 'center' }}>
                Browse Catalogue →
              </a>
            </div>
          </div>
        </Card>

        <Card>
          <div className="ui-stack" style={{ justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary, #0C6668)' }} aria-hidden="true">
                  collections_bookmark
                </span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-primary, #151C27)' }}>My Reader Library</h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary, #414846)', fontSize: '0.9rem', margin: 0 }}>
                Manage your active reading items, saved bookmarks, completed documents, and progress statistics.
              </p>
            </div>
            <div>
              <a className="ui-button ui-button--secondary" href="/library" style={{ width: '100%', justifyContent: 'center' }}>
                View My Library →
              </a>
            </div>
          </div>
        </Card>

        <Card>
          <div className="ui-stack" style={{ justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#666' }} aria-hidden="true">
                  history
                </span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-primary, #151C27)' }}>Reading History</h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary, #414846)', fontSize: '0.9rem', margin: 0 }}>
                Review chronological history of accessed documents, page timestamps, and completion rates.
              </p>
            </div>
            <div>
              <a className="ui-button ui-button--secondary" href="/history" style={{ width: '100%', justifyContent: 'center' }}>
                View History →
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Accessions Section */}
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text-primary, #151C27)' }}>Recent Accessions</h2>
          <a href="/catalogue" style={{ fontSize: '0.9rem', color: 'var(--color-secondary, #0C6668)', fontWeight: 600, textDecoration: 'none' }}>
            View all in Catalogue →
          </a>
        </div>

        {publicBooks.length === 0 ? (
          <Card>
            <p style={{ color: 'var(--color-text-secondary, #666)', margin: 0, padding: '1rem 0', textAlign: 'center' }}>
              No published items available in the catalogue yet.
            </p>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {publicBooks.slice(0, 6).map((book) => (
              <Card key={book.id}>
                <div className="ui-stack" style={{ justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary, #151C27)' }}>
                        {book.title}
                      </h3>
                      <Badge tone="success">Published</Badge>
                    </div>
                    {book.authors?.length ? (
                      <p style={{ color: 'var(--color-text-secondary, #414846)', fontSize: '0.85rem', margin: '0.35rem 0' }}>
                        By {book.authors.map((author) => author.name).join(', ')}
                      </p>
                    ) : null}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <a className="ui-button ui-button--secondary ui-button--sm" href={`/catalogue/${book.id}`} style={{ width: '100%', justifyContent: 'center' }}>
                      View Document Details →
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
