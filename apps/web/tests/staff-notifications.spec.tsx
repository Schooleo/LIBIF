import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { AdminShell } from '../components/layout';

const currentPath = vi.hoisted(() => ({ value: '/admin/dashboard' }));
const redirectMock = vi.hoisted(() => vi.fn((path: string) => { throw new Error(`redirect:${path}`); }));
const fetchSessionMock = vi.hoisted(() => vi.fn());
const fetchUnreadNotificationCountMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  usePathname: () => currentPath.value,
  redirect: redirectMock,
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));

vi.mock('../lib/api-server', () => ({
  fetchSession: fetchSessionMock,
  fetchUnreadNotificationCount: fetchUnreadNotificationCountMock,
}));

import AdminLayout from '../app/(admin)/layout';

describe('staff notification navigation', () => {
  afterEach(() => {
    currentPath.value = '/admin/dashboard';
    redirectMock.mockClear();
    fetchSessionMock.mockReset();
    fetchUnreadNotificationCountMock.mockReset();
  });

  it('hides the badge for zero unread notifications while keeping the link accessible', async () => {
    const { container } = render(
      <AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }} notificationCount={0}>
        <h1>Dashboard</h1>
      </AdminShell>
    );

    const navigation = screen.getByRole('navigation', { name: /staff workspace navigation/i });
    const notificationsLink = within(navigation).getByRole('link', { name: 'Notifications, 0 unread' });

    expect(notificationsLink).toHaveAttribute('href', '/admin/notifications');
    expect(within(notificationsLink).queryByText('0')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows a bounded visual badge but preserves the exact unread count in the accessible name', async () => {
    currentPath.value = '/admin/notifications';
    render(
      <AdminShell user={{ name: 'Lin Librarian', email: 'lin@example.test', role: 'LIBRARIAN' }} notificationCount={128}>
        <h1>Notifications</h1>
      </AdminShell>
    );

    const notificationsLink = screen.getByRole('link', { name: 'Notifications, 128 unread' });
    expect(notificationsLink).toHaveAttribute('aria-current', 'page');
    expect(within(notificationsLink).getByText('99+')).toBeInTheDocument();
  });

  it('reuses the same notification count in the mobile drawer and closes after navigation', async () => {
    const user = userEvent.setup();
    render(
      <AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }} notificationCount={3}>
        <h1>Dashboard</h1>
      </AdminShell>
    );

    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    const drawer = screen.getByRole('dialog', { name: /staff navigation/i });
    const notificationsLink = within(drawer).getByRole('link', { name: 'Notifications, 3 unread' });
    expect(within(notificationsLink).getByText('3')).toBeInTheDocument();

    await user.click(notificationsLink);
    expect(screen.queryByRole('dialog', { name: /staff navigation/i })).not.toBeInTheDocument();
  });

  it('keeps the admin layout rendering when unread-count fetch fails', async () => {
    fetchSessionMock.mockResolvedValueOnce({
      authenticated: true,
      user: { id: 'staff-1', email: 'ada@example.test', role: 'ADMIN' },
    });
    fetchUnreadNotificationCountMock.mockRejectedValueOnce(new Error('notification count offline'));

    render(await AdminLayout({ children: <h1>Dashboard</h1> }));

    expect(redirectMock).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 1, name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notifications' })).toHaveAttribute('href', '/admin/notifications');
    expect(screen.queryByText('99+')).not.toBeInTheDocument();
  });
});

import { NotificationList } from '../components/domain/notifications/NotificationList';

describe('NotificationList component', () => {
  const sampleNotifications = [
    {
      id: 'n-1',
      recipientId: 'user-1',
      type: 'DOCUMENT_AVAILABLE',
      title: 'Document Published',
      body: 'Clean Architecture is now available',
      isRead: false,
      createdAt: '2026-07-23T10:00:00Z'
    },
    {
      id: 'n-2',
      recipientId: 'user-1',
      type: 'SYSTEM',
      title: 'System Alert',
      body: 'System maintenance scheduled',
      isRead: true,
      createdAt: '2026-07-22T10:00:00Z'
    }
  ];

  it('renders filter tabs and pagination controls', () => {
    const onFilterChange = vi.fn();
    const onPageChange = vi.fn();

    render(
      <NotificationList
        notifications={sampleNotifications}
        page={1}
        pageSize={1}
        totalCount={2}
        totalPages={2}
        activeFilter="all"
        onFilterChange={onFilterChange}
        onPageChange={onPageChange}
      />
    );

    // Filter tablist
    expect(screen.getByRole('tablist', { name: /filter notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /all/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /unread/i })).toHaveAttribute('aria-selected', 'false');

    // Pagination nav
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('announces unread count in polite live region', () => {
    render(
      <NotificationList
        notifications={sampleNotifications}
        activeFilter="all"
      />
    );

    // Live region
    const liveRegion = screen.getByText('1 unread notification');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('supports keyboard arrow navigation across filter tabs', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(
      <NotificationList
        notifications={sampleNotifications}
        activeFilter="all"
        onFilterChange={onFilterChange}
      />
    );

    const allTab = screen.getByRole('tab', { name: /all/i });
    allTab.focus();

    await user.keyboard('{ArrowRight}');
    expect(onFilterChange).toHaveBeenCalledWith('unread');
  });
});
