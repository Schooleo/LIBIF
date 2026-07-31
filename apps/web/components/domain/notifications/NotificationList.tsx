'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyState } from '../../ui';
import { Button } from '../../ui/actions/Button';
import { Card } from '../../ui/surfaces/Card';
import { Pagination } from '../../ui/data/DataTable';
import { NotificationFilterTabs, type NotificationFilter } from './NotificationFilterTabs';
import { API_BASE_URL } from '../../../lib/api-client';
import { getDevAuthHeaders } from '../../../lib/auth/session';

export interface NotificationItem {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  body: string;
  payload?: Record<string, any> | null;
  actionHref?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications?: NotificationItem[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  activeFilter?: NotificationFilter;
  onFilterChange?: (filter: NotificationFilter) => void;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export function NotificationList({
  notifications = [],
  page = 1,
  pageSize: _pageSize = 20,
  totalCount: _totalCount = 0,
  totalPages = 1,
  activeFilter = 'all',
  onFilterChange,
  onPageChange,
  onRefresh
}: NotificationListProps) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>(notifications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setLoadingId(id);

    try {
      const devHeaders = getDevAuthHeaders();
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...devHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch {
      // Revert on error
      setItems(notifications);
    } finally {
      setLoadingId(null);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic UI update
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setLoadingId('ALL');

    try {
      const devHeaders = getDevAuthHeaders();
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...devHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch {
      // Revert on error
      setItems(notifications);
    } finally {
      setLoadingId(null);
    }
  };

  const unreadCount = items.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="ui-stack gap-4">
      {/* ARIA Live Region for accessibility announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {unreadCount === 0
          ? 'No unread notifications'
          : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {onFilterChange ? (
          <NotificationFilterTabs
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            unreadCount={unreadCount}
          />
        ) : (
          <div />
        )}

        {hasUnread && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              disabled={loadingId === 'ALL'}
              onClick={markAllAsRead}
            >
              {loadingId === 'ALL' ? 'Updating...' : 'Mark all as read'}
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title="No notifications">
          <p className="text-neutral-500">
            {activeFilter === 'unread'
              ? 'You have no unread notifications.'
              : activeFilter === 'read'
              ? 'You have no read notifications.'
              : 'You are all caught up!'}
          </p>
        </EmptyState>
      ) : (
        <div className="ui-stack gap-3">
          {items.map((n) => (
            <Card key={n.id} className={!n.isRead ? 'border-l-4 border-l-emerald-600 bg-emerald-50/20' : ''}>
              <div className="flex justify-between items-start">
                <div className="ui-stack gap-1">
                  <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
                    {n.type.replace(/_/g, ' ')}
                  </span>
                  <h3 className="font-semibold text-neutral-900">{n.title}</h3>
                  <p className="text-sm text-neutral-600">{n.body}</p>

                  {n.actionHref && (
                    <div className="mt-2">
                      <Link href={n.actionHref} className="ui-link text-xs font-semibold">
                        Open Action &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-neutral-400">{new Date(n.createdAt).toLocaleString()}</span>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={loadingId === n.id}
                      onClick={() => markAsRead(n.id)}
                    >
                      {loadingId === n.id ? '...' : 'Mark read'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center pt-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
