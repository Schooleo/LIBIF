'use client';

import { useState } from 'react';
import type { ReaderLibraryItemDto } from '../../../lib/api-types';
import { Badge, Card, EmptyState, ProgressBar } from '../../ui';
import { BookmarkButton } from './BookmarkButton';

export interface ReaderLibraryProps {
  items: ReaderLibraryItemDto[];
  total?: number;
  readingCount?: number;
  bookmarkedCount?: number;
}

export function ReaderLibrary({
  items: initialItems,
  readingCount: initialReadingCount,
  bookmarkedCount: initialBookmarkedCount,
}: ReaderLibraryProps) {
  const [filter, setFilter] = useState<'ALL' | 'READING' | 'BOOKMARKED' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Local interactive items list state to sync with bookmark updates
  const [items, setItems] = useState<ReaderLibraryItemDto[]>(initialItems);

  const handleBookmarkToggle = (documentId: string, isBookmarked: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === documentId ? { ...item, bookmarked: isBookmarked } : item))
    );
  };

  const readingItemsCount = initialReadingCount ?? items.filter((i) => i.progress && i.progress.percentage < 100).length;
  const bookmarkedItemsCount = initialBookmarkedCount ?? items.filter((i) => i.bookmarked).length;
  const completedItemsCount = items.filter((i) => i.progress && i.progress.percentage >= 100).length;

  const filteredItems = items.filter((item) => {
    // Filter matching
    if (filter === 'READING' && (!item.progress || item.progress.percentage >= 100)) return false;
    if (filter === 'BOOKMARKED' && !item.bookmarked) return false;
    if (filter === 'COMPLETED' && (!item.progress || item.progress.percentage < 100)) return false;

    // Search query matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(query);
      const authorMatch = item.authors.some((a) => a.toLowerCase().includes(query));
      const publisherMatch = item.publisher?.toLowerCase().includes(query);
      return titleMatch || authorMatch || publisherMatch;
    }

    return true;
  });

  return (
    <div className="ui-stack">
      {/* Metrics Header Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #d9e1de)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>TOTAL IN LIBRARY</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-action-primary, #103C35)', marginTop: '0.25rem' }}>{items.length}</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #d9e1de)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>CURRENTLY READING</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-secondary, #0C6668)', marginTop: '0.25rem' }}>{readingItemsCount}</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #d9e1de)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>BOOKMARKS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#B87D00', marginTop: '0.25rem' }}>{bookmarkedItemsCount}</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #d9e1de)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', fontWeight: 600 }}>COMPLETED</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#146C2E', marginTop: '0.25rem' }}>{completedItemsCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--color-surface, #ffffff)',
          border: '1px solid var(--color-border, #d9e1de)',
          borderRadius: '8px',
        }}
      >
        <div className="ui-cluster" role="tablist" aria-label="Library Filter Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ALL'}
            className={`ui-button ${filter === 'ALL' ? 'ui-button--primary' : 'ui-button--secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'READING'}
            className={`ui-button ${filter === 'READING' ? 'ui-button--primary' : 'ui-button--secondary'}`}
            onClick={() => setFilter('READING')}
          >
            Reading ({readingItemsCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'BOOKMARKED'}
            className={`ui-button ${filter === 'BOOKMARKED' ? 'ui-button--primary' : 'ui-button--secondary'}`}
            onClick={() => setFilter('BOOKMARKED')}
          >
            Bookmarks ({bookmarkedItemsCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'COMPLETED'}
            className={`ui-button ${filter === 'COMPLETED' ? 'ui-button--primary' : 'ui-button--secondary'}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed ({completedItemsCount})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flexGrow: 1, maxWidth: '360px' }}>
          <input
            type="search"
            placeholder="Search my library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border, #d9e1de)',
              fontSize: '0.9rem',
              background: 'var(--color-page-background, #f7f9f8)',
            }}
            aria-label="Search my library items"
          />
          <span
            className="material-symbols-outlined"
            style={{
              position: 'absolute',
              left: '0.65rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: 'var(--color-text-secondary, #666)',
            }}
            aria-hidden="true"
          >
            search
          </span>
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState title="No documents found">
          <p style={{ color: 'var(--color-text-secondary, #666)' }}>
            {searchQuery
              ? `No items matching "${searchQuery}". Try adjusting your search term.`
              : 'Explore the catalogue to discover and save publications to your personal library.'}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a className="ui-button ui-button--primary" href="/catalogue">
              Browse Catalogue →
            </a>
          </div>
        </EmptyState>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <div className="ui-stack" style={{ height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary, #151C27)' }}>
                      {item.title}
                    </h3>
                    <Badge tone={item.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                      {item.status}
                    </Badge>
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

                {item.progress ? (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--color-page-background, #f7f9f8)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #666)', marginBottom: '0.25rem' }}>
                      <span>Page {item.progress.currentPage} of {item.progress.totalPages}</span>
                      <span style={{ color: 'var(--color-secondary, #0C6668)' }}>{item.progress.percentage}%</span>
                    </div>
                    <ProgressBar value={item.progress.percentage} aria-label={`Progress: ${item.progress.percentage}%`} />
                  </div>
                ) : null}

                <div className="ui-cluster" style={{ marginTop: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a className="ui-button ui-button--primary ui-button--sm" href={`/documents/${item.id}/view`}>
                    {item.progress ? 'Resume Reading' : 'Start Reading'}
                  </a>
                  <BookmarkButton
                    documentId={item.id}
                    initialBookmarked={item.bookmarked}
                    size="sm"
                    onToggle={(isBookmarked) => handleBookmarkToggle(item.id, isBookmarked)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
