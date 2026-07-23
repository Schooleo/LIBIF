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
