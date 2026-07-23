'use client';

import { KeyboardEvent } from 'react';

export type NotificationFilter = 'all' | 'unread' | 'read';

interface NotificationFilterTabsProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount?: number;
}

const TABS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' }
];

export function NotificationFilterTabs({
  activeFilter,
  onFilterChange,
  unreadCount
}: NotificationFilterTabsProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    e.preventDefault();
    const currentIndex = TABS.findIndex((tab) => tab.id === activeFilter);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    }

    const nextTab = TABS[nextIndex];
    if (nextTab) {
      onFilterChange(nextTab.id);
      const nextButton = document.getElementById(`notif-tab-${nextTab.id}`);
      nextButton?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Filter notifications"
      className="flex gap-1 border-b border-neutral-200 pb-2"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab) => {
        const isSelected = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            id={`notif-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isSelected
                ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
            {tab.id === 'unread' && unreadCount !== undefined && unreadCount > 0 ? (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                isSelected ? 'bg-emerald-950 text-white' : 'bg-emerald-100 text-emerald-800 font-semibold'
              }`}>
                {unreadCount}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
