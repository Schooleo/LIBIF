'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { PagedBookListDto, TaxonomyCategoryDto, TaxonomyTagDto } from '../../../lib/api-types';
import { Badge, Card, EmptyState } from '../../ui';

interface CatalogueDiscoveryProps {
  initialData: PagedBookListDto;
  categories: TaxonomyCategoryDto[];
  tags: TaxonomyTagDto[];
  currentParams: {
    q?: string;
    categoryId?: string;
    tagIds?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
    view?: 'grid' | 'list';
  };
}

export function CatalogueDiscovery({ initialData, categories, tags, currentParams }: CatalogueDiscoveryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentParams.q || '');
  const viewMode = currentParams.view || 'grid';

  const updateFilters = (newParams: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: search, page: 1 });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ categoryId: e.target.value, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: e.target.value, page: 1 });
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = currentParams.tagIds ? currentParams.tagIds.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    updateFilters({ tagIds: updatedTags.length ? updatedTags.join(',') : null, page: 1 });
  };

  const selectedTagIds = currentParams.tagIds ? currentParams.tagIds.split(',').map((t) => t.trim()) : [];
  const totalPages = Math.ceil(initialData.totalCount / initialData.pageSize) || 1;
  const currentPage = initialData.page || 1;

  return (
    <div className="ui-stack" style={{ gap: '1.5rem' }}>
      {/* Search & Filter Toolbar */}
      <Card>
        <div className="ui-stack" style={{ gap: '1rem', padding: '0.5rem' }}>
          <form onSubmit={handleSearchSubmit} className="ui-cluster" style={{ gap: '0.75rem', width: '100%' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by title, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ui-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                aria-label="Search catalogue"
              />
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted, #717976)',
                  fontSize: '20px'
                }}
              >
                search
              </span>
            </div>

            <button type="submit" className="ui-button ui-button--primary" disabled={isPending}>
              Search
            </button>

            {searchParams.toString() ? (
              <button
                type="button"
                className="ui-button ui-button--secondary"
                onClick={() => {
                  setSearch('');
                  startTransition(() => router.push(pathname));
                }}
              >
                Reset
              </button>
            ) : null}
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="ui-cluster" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Category Filter */}
              <select
                value={currentParams.categoryId || ''}
                onChange={handleCategoryChange}
                className="ui-select"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={currentParams.sort || 'createdAt_desc'}
                onChange={handleSortChange}
                className="ui-select"
                aria-label="Sort books"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="title_asc">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
                <option value="publishedYear_desc">Publication Year (Newest)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="ui-cluster" style={{ gap: '0.25rem' }}>
              <button
                type="button"
                className={`ui-button ${viewMode === 'grid' ? 'ui-button--primary' : 'ui-button--secondary'}`}
                onClick={() => updateFilters({ view: 'grid' })}
                title="Grid view"
                aria-label="Grid view"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  grid_view
                </span>
              </button>
              <button
                type="button"
                className={`ui-button ${viewMode === 'list' ? 'ui-button--primary' : 'ui-button--secondary'}`}
                onClick={() => updateFilters({ view: 'list' })}
                title="List view"
                aria-label="List view"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  format_list_bulleted
                </span>
              </button>
            </div>
          </div>

          {/* Tags Pills */}
          {tags.length > 0 ? (
            <div className="ui-stack" style={{ gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #414846)' }}>
                Filter by Tags:
              </span>
              <div className="ui-cluster" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTagToggle(t.id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    >
                      <Badge tone={isSelected ? 'info' : 'neutral'}>
                        {isSelected ? '✓ ' : ''}#{t.name}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Catalogue Results */}
      {initialData.items.length === 0 ? (
        <EmptyState title="No books found matching your filters.">
          Try adjusting your search criteria or resetting filters.
        </EmptyState>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {initialData.items.map((book) => (
            <Card key={book.id}>
              <div className="ui-stack" style={{ gap: '0.75rem', height: '100%', justifyContent: 'space-between', padding: '0.5rem' }}>
                <div className="ui-stack" style={{ gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-primary, #151C27)' }}>
                      <a href={`/catalogue/${book.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {book.title}
                      </a>
                    </h3>
                    <Badge tone="success">Published</Badge>
                  </div>

                  {book.authors && book.authors.length > 0 ? (
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #414846)' }}>
                      by {book.authors.map((a) => a.name).join(', ')}
                    </p>
                  ) : null}

                  {book.category ? (
                    <div>
                      <Badge tone="info">{book.category.name}</Badge>
                    </div>
                  ) : null}

                  {book.tags && book.tags.length > 0 ? (
                    <div className="ui-cluster" style={{ gap: '0.25rem' }}>
                      {book.tags.map((t) => (
                        <span key={t.id} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #717976)' }}>
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle, #E1E3E5)' }}>
                  <a
                    className="ui-button ui-button--secondary"
                    href={`/catalogue/${book.id}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <section className="ui-stack" style={{ gap: '0.75rem' }} aria-label="Published books list">
          {initialData.items.map((book) => (
            <Card key={book.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '0.25rem' }}>
                <div className="ui-stack" style={{ gap: '0.25rem' }}>
                  <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-primary, #151C27)' }}>
                      <a href={`/catalogue/${book.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {book.title}
                      </a>
                    </h3>
                    {book.category ? <Badge tone="info">{book.category.name}</Badge> : null}
                  </div>
                  {book.authors && book.authors.length > 0 ? (
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary, #414846)' }}>
                      Author(s): {book.authors.map((a) => a.name).join(', ')}
                    </p>
                  ) : null}
                </div>

                <a className="ui-button ui-button--secondary" href={`/catalogue/${book.id}`}>
                  View Details →
                </a>
              </div>
            </Card>
          ))}
        </section>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #414846)' }}>
            Showing page {currentPage} of {totalPages} ({initialData.totalCount} total books)
          </span>

          <div className="ui-cluster" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="ui-button ui-button--secondary"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateFilters({ page: currentPage - 1 })}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="ui-button ui-button--secondary"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateFilters({ page: currentPage + 1 })}
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
