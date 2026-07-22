'use client';

import { EmptyState } from '../../ui';
import { Card } from '../../ui/surfaces/Card';

export interface NotificationItem {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications?: NotificationItem[];
}

export function NotificationList({ notifications = [] }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <EmptyState title="No new notifications">
        <p className="text-neutral-500">You are all caught up!</p>
      </EmptyState>
    );
  }

  return (
    <div className="ui-stack gap-3">
      {notifications.map((n) => (
        <Card key={n.id} className={!n.isRead ? 'border-l-4 border-l-emerald-600 bg-emerald-50/20' : ''}>
          <div className="flex justify-between items-start">
            <div className="ui-stack gap-1">
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">{n.type.replace(/_/g, ' ')}</span>
              <h3 className="font-semibold text-neutral-900">{n.title}</h3>
              <p className="text-sm text-neutral-600">{n.body}</p>
            </div>
            <span className="text-xs text-neutral-400">{new Date(n.createdAt).toLocaleString()}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
