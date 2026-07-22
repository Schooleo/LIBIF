import { headers } from 'next/headers';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { NotificationList, type NotificationItem } from '../../../../components/domain/notifications/NotificationList';
import { API_BASE_URL } from '../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../lib/auth/session';

async function fetchNotifications(): Promise<NotificationItem[]> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/notifications`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.statusText}`);
  }

  return res.json();
}

export default async function AdminNotificationsPage() {
  let notifications: NotificationItem[] = [];
  let loadError: string | undefined;

  try {
    notifications = await fetchNotifications();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <PageHeader title="Notifications" />
      {loadError ? (
        <InlineAlert tone="error">
          Notifications could not be loaded: {loadError}
        </InlineAlert>
      ) : null}
      {!loadError && <NotificationList notifications={notifications} />}
    </section>
  );
}
