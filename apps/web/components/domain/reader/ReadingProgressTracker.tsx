'use client';

import { useEffect, useState } from 'react';
import { Button, ProgressBar } from '../../ui';

export interface ReadingProgressTrackerProps {
  currentPage: number;
  totalPages?: number;
  saving?: boolean;
  saveStatus?: string | null;
  progressLabel?: string;
  onPageChange?: (page: number) => void;
}

export function ReadingProgressTracker({
  currentPage,
  totalPages = 100,
  saving = false,
  saveStatus = null,
  progressLabel = 'Reading progress',
  onPageChange,
}: ReadingProgressTrackerProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const percentage = Math.min(100, Math.round((currentPage / safeTotalPages) * 100));

  const commitPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > safeTotalPages || nextPage === currentPage) {
      setPageInput(String(currentPage));
      return;
    }
    onPageChange?.(nextPage);
  };

  return (
    <div
      className="ui-stack"
      style={{
        padding: '1rem',
        background: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-border, #d9e1de)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div className="ui-cluster reader-progress-controls" style={{ alignItems: 'center' }}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => commitPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
          >
            ← Previous
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={safeTotalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => {
                const value = Number.parseInt(pageInput, 10);
                if (!Number.isNaN(value)) {
                  commitPage(value);
                } else {
                  setPageInput(String(currentPage));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = Number.parseInt(pageInput, 10);
                  if (!Number.isNaN(value)) {
                    commitPage(value);
                  }
                }
                if (e.key === 'Escape') {
                  setPageInput(String(currentPage));
                }
              }}
              style={{
                width: '60px',
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--color-border, #ccc)',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '0.9rem',
              }}
              aria-label="Jump to page number"
            />
            <span style={{ color: 'var(--color-text-secondary, #666)' }}>of {safeTotalPages}</span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => commitPage(currentPage + 1)}
            disabled={currentPage >= safeTotalPages}
            aria-label="Next Page"
          >
            Next →
          </Button>
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #666)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {saveStatus ? <span style={{ fontStyle: 'italic' }}>{saveStatus}</span> : null}
          {saving ? <span aria-label="Progress save in flight">•</span> : null}
          <span style={{ fontWeight: 700, color: 'var(--color-secondary, #0C6668)' }}>{percentage}% Complete</span>
        </div>
      </div>

      <ProgressBar value={percentage} label={progressLabel} />
    </div>
  );
}
