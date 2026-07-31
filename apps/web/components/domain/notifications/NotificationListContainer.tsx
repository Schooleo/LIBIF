'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NotificationList, type NotificationItem } from './NotificationList';
import type { NotificationFilter } from './NotificationFilterTabs';

interface PagedNotificationData {
  items: NotificationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface NotificationListContainerProps {
  initialData: PagedNotificationData;
  initialFilter: NotificationFilter;
}

export function NotificationListContainer({
  initialData,
  initialFilter
}: NotificationListContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (newFilter: NotificationFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', newFilter);
    }
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(newPage));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <NotificationList
      notifications={initialData.items}
      page={initialData.page}
      pageSize={initialData.pageSize}
      totalCount={initialData.totalCount}
      totalPages={initialData.totalPages}
      activeFilter={initialFilter}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
    />
  );
}
