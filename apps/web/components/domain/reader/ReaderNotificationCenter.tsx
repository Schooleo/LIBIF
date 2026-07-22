'use client';

import { useEffect, useState } from 'react';
import { fetchMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../../lib/api-browser';
import { Badge, Button, Card, InlineAlert } from '../../ui';

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

/**
 * A6-003: Safe notification action link sanitizer for Reader Portal.
 * Enforces reader access bounds: opens only allowlisted catalogue/viewer destinations,
 * and strips/redirects administrative or external links.
 */
export function sanitizeReaderActionHref(actionHref?: string | null, payloadDocumentId?: string): string {
  if (!actionHref || typeof actionHref !== 'string') {
    return payloadDocumentId ? `/catalogue/${encodeURIComponent(payloadDocumentId)}` : '/catalogue';
  }

  const trimmed = actionHref.trim();

  // Block absolute URLs, protocol-relative, javascript:, data: URIs, or admin routes
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:') ||
    trimmed.startsWith('/admin') ||
    trimmed.startsWith('/api')
  ) {
    return payloadDocumentId ? `/catalogue/${encodeURIComponent(payloadDocumentId)}` : '/catalogue';
  }

  // Allowlist reader destinations
  if (
    trimmed === '/' ||
    trimmed.startsWith('/catalogue') ||
    trimmed.startsWith('/library') ||
    trimmed.startsWith('/history') ||
    trimmed.startsWith('/bookmarks') ||
    (trimmed.startsWith('/documents/') && trimmed.endsWith('/view'))
  ) {
    return trimmed;
  }

  return payloadDocumentId ? `/catalogue/${encodeURIComponent(payloadDocumentId)}` : '/catalogue';
}

export function ReaderNotificationCenter({
  initialNotifications = [],
  onNotificationRead,
}: {
  initialNotifications?: NotificationItem[];
  onNotificationRead?: () => void;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNotifications.length === 0) {
      loadNotifications();
    }
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      if (onNotificationRead) onNotificationRead();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onNotificationRead) onNotificationRead();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card>
      <div className="ui-stack" style={{ gap: '1rem' }}>
        <div className="ui-cluster" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="ui-cluster" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Notifications</h2>
            {unreadCount > 0 && <Badge tone="info">{unreadCount} new</Badge>}
          </div>

          <div className="ui-cluster" style={{ gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={loadNotifications} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {error && <InlineAlert tone="error">{error}</InlineAlert>}

        {notifications.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted, #717976)', fontStyle: 'italic', margin: 0 }}>
            No notifications available.
          </p>
        ) : (
          <ul
            className="ui-stack"
            style={{
              gap: '0.75rem',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {notifications.map((item) => {
              const docId = item.payload?.documentId ?? item.payload?.bookId;
              const targetHref = sanitizeReaderActionHref(item.actionHref, docId);

              return (
                <li
                  key={item.id}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: item.isRead
                      ? 'var(--color-surface-subtle, #f5f5f5)'
                      : 'var(--color-surface-elevated, #ffffff)',
                    border: '1px solid var(--color-border-subtle, #e0e0e0)',
                    opacity: item.isRead ? 0.8 : 1,
                  }}
                >
                  <div className="ui-stack" style={{ gap: '0.375rem' }}>
                    <div className="ui-cluster" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: item.isRead ? 500 : 700, fontSize: '0.95rem' }}>
                        {item.title}
                      </span>
                      <small style={{ color: 'var(--color-text-muted, #717976)' }}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary, #414846)' }}>
                      {item.body}
                    </p>

                    <div className="ui-cluster" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <a
                        href={targetHref}
                        className="ui-button ui-button--ghost ui-button--sm"
                        onClick={() => {
                          if (!item.isRead) {
                            handleMarkRead(item.id);
                          }
                        }}
                      >
                        View Document →
                      </a>

                      {!item.isRead && (
                        <button
                          type="button"
                          className="ui-button ui-button--ghost ui-button--sm"
                          onClick={() => handleMarkRead(item.id)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
