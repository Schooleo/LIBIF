'use client';

import { type KeyboardEvent, useState } from 'react';
import { ProcessingQueue, type ProcessingJob } from './ProcessingQueue';

type ProcessingView = 'queue' | 'history';

const TABS: { id: ProcessingView; label: string }[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' }
];

const HISTORY_STATUSES = new Set(['SUCCEEDED', 'CANCELLED', 'SUPERSEDED']);

export function ProcessingQueueTabs({ jobs }: { jobs: ProcessingJob[] }) {
  const [activeView, setActiveView] = useState<ProcessingView>('queue');
  const queueJobs = jobs.filter((job) => !HISTORY_STATUSES.has(job.status.toUpperCase()));
  const historyJobs = jobs.filter((job) => HISTORY_STATUSES.has(job.status.toUpperCase()));
  const visibleJobs = activeView === 'queue' ? queueJobs : historyJobs;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    event.preventDefault();
    const currentIndex = TABS.findIndex((tab) => tab.id === activeView);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = TABS[(currentIndex + direction + TABS.length) % TABS.length];
    if (!nextTab) return;

    setActiveView(nextTab.id);
    document.getElementById(`processing-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className="ui-stack">
      <div
        role="tablist"
        aria-label="Processing queue views"
        className="flex gap-1 border-b border-neutral-200 pb-2"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab) => {
          const isSelected = activeView === tab.id;
          const count = tab.id === 'queue' ? queueJobs.length : historyJobs.length;
          return (
            <button
              key={tab.id}
              id={`processing-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`processing-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveView(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isSelected
                  ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      <div
        id={`processing-panel-${activeView}`}
        role="tabpanel"
        aria-labelledby={`processing-tab-${activeView}`}
      >
        <ProcessingQueue
          jobs={visibleJobs}
          caption={activeView === 'queue' ? 'Active processing jobs' : 'Processing job history'}
          emptyTitle={activeView === 'queue' ? 'No active processing jobs' : 'No processing history'}
          showActions={activeView === 'queue'}
        />
      </div>
    </div>
  );
}
