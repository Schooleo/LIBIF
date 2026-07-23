'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyState } from '../../ui';
import { Button } from '../../ui/actions/Button';
import { Card } from '../../ui/surfaces/Card';
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
  onRefresh?: () => void;
}

export function NotificationList({ notifications = [], onRefresh }: NotificationListProps) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>(notifications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync props to state if props change
  if (notifications !== items && notifications.length !== items.length) {
    setItems(notifications);
  }

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
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
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
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState title="No new notifications">
        <p className="text-neutral-500">You are all caught up!</p>
      </EmptyState>
    );
  }

  const hasUnread = items.some((n) => !n.isRead);

  return (
    <div className="ui-stack gap-3">
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
  );
}
