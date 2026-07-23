import { headers } from 'next/headers';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { NotificationListContainer } from '../../../../components/domain/notifications/NotificationListContainer';
import type { NotificationItem } from '../../../../components/domain/notifications/NotificationList';
import type { NotificationFilter } from '../../../../components/domain/notifications/NotificationFilterTabs';
import { API_BASE_URL } from '../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../lib/auth/session';

interface PagedNotificationResponse {
  items: NotificationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchNotificationsPage(page: number, filter: NotificationFilter): Promise<PagedNotificationResponse> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (filter && filter !== 'all') params.set('filter', filter);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/api/notifications${queryString}`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return {
      items: data,
      totalCount: data.length,
      page: 1,
      pageSize: 20,
      totalPages: 1
    };
  }

  return data;
}

interface PageProps {
  searchParams?: Promise<{ page?: string; filter?: string }>;
}

export default async function AdminNotificationsPage({ searchParams }: PageProps) {
  const resolvedParams = (await searchParams) || {};
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10));
  const filter = (resolvedParams.filter as NotificationFilter) || 'all';

  let pagedData: PagedNotificationResponse = {
    items: [],
    totalCount: 0,
    page,
    pageSize: 20,
    totalPages: 1
  };
  let loadError: string | undefined;

  try {
    pagedData = await fetchNotificationsPage(page, filter);
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
      {!loadError && (
        <NotificationListContainer
          initialData={pagedData}
          initialFilter={filter}
        />
      )}
    </section>
  );
}
