'use client';

import { useState } from 'react';
import { Button, ProgressBar } from '../../ui';
import { updateReadingProgress } from '../../../lib/api-browser';

export interface ReadingProgressTrackerProps {
  documentId: string;
  initialPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ReadingProgressTracker({
  documentId,
  initialPage = 1,
  totalPages = 100,
  onPageChange,
}: ReadingProgressTrackerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const percentage = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const changePage = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
    setSaving(true);
    setSaveStatus('Saving progress...');

    try {
      await updateReadingProgress(documentId, newPage, totalPages);
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error('Failed to update reading progress:', err);
      setSaveStatus('Failed to save progress');
    } finally {
      setSaving(false);
    }
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="ui-cluster" style={{ alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1 || saving}
            aria-label="Previous Page"
          >
            ← Previous
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  changePage(val);
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
            <span style={{ color: 'var(--color-text-secondary, #666)' }}>of {totalPages}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages || saving}
            aria-label="Next Page"
          >
            Next →
          </Button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary, #666)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saveStatus ? <span style={{ fontStyle: 'italic' }}>{saveStatus}</span> : null}
          <span style={{ fontWeight: 700, color: 'var(--color-secondary, #0C6668)' }}>{percentage}% Complete</span>
        </div>
      </div>

      <ProgressBar value={percentage} aria-label={`Reading progress: ${percentage}%`} />
    </div>
  );
}
