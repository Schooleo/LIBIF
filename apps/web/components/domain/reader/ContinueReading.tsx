import type { ReaderLibraryItemDto } from '../../../lib/api-types';
import { ProgressBar } from '../../ui';

export interface ContinueReadingProps {
  items: ReaderLibraryItemDto[];
}

export function ContinueReading({ items }: ContinueReadingProps) {
  const activeItems = items.filter((item) => item.progress && item.progress.percentage < 100);

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <section className="ui-stack" aria-labelledby="continue-reading-heading">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--color-action-primary, #103C35)', fontSize: '24px' }} aria-hidden="true">
          auto_stories
        </span>
        <h2 id="continue-reading-heading" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary, #151C27)' }}>
          Continue Reading
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {activeItems.map((item) => (
          <div
            key={item.id}
            className="ui-card ui-card--interactive"
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #d9e1de)',
              borderRadius: '8px',
            }}
          >
            {/* Book Thumbnail Cover */}
            <div
              style={{
                width: '4.5rem',
                height: '6rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, var(--color-action-primary, #103C35) 0%, var(--color-secondary, #0C6668) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              }}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                book
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary, #151C27)', lineHeight: 1.3 }}>
                {item.title}
              </h3>

              {item.authors && item.authors.length > 0 ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary, #414846)' }}>
                  {item.authors.join(', ')}
                </p>
              ) : null}

              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #717976)', marginBottom: '0.25rem' }}>
                  <span>Page {item.progress?.currentPage} of {item.progress?.totalPages}</span>
                  <span style={{ color: 'var(--color-secondary, #0C6668)' }}>{item.progress?.percentage}%</span>
                </div>

                <ProgressBar value={item.progress?.percentage ?? 0} label={`Reading progress: ${item.progress?.percentage}%`} />

                <div style={{ marginTop: '0.75rem' }}>
                  <a
                    className="ui-button ui-button--primary ui-button--sm"
                    href={`/documents/${item.id}/view`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Resume Reading →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
