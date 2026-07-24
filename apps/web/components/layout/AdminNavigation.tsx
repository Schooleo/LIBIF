'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NotificationBadge } from '../domain/notifications/NotificationBadge';
import { Button, Drawer } from '../ui';

type StaffRole = 'ADMIN' | 'LIBRARIAN';

type StaffNavItem = {
  label: string;
  href: string;
  roles: readonly StaffRole[];
};

type StaffNavGroup = {
  label: string;
  items: readonly StaffNavItem[];
};

const allStaffRoles: readonly StaffRole[] = ['ADMIN', 'LIBRARIAN'];
const adminOnlyRoles: readonly StaffRole[] = ['ADMIN'];
const notificationsHref = '/admin/notifications';

const staffNavGroups: readonly StaffNavGroup[] = [
  {
    label: 'Librarian Workspace',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', roles: allStaffRoles },
      { label: 'Documents', href: '/admin/documents', roles: allStaffRoles },
      { label: 'Processing Queue', href: '/admin/processing', roles: allStaffRoles },
      { label: 'Approval Queue', href: '/admin/approvals', roles: allStaffRoles },
      { label: 'Notifications', href: notificationsHref, roles: allStaffRoles },
    ]
  },
  {
    label: 'Administration',
    items: [
      { label: 'Categories', href: '/admin/categories', roles: allStaffRoles },
      { label: 'Tags', href: '/admin/tags', roles: allStaffRoles },
      { label: 'Users', href: '/admin/users', roles: adminOnlyRoles },
      { label: 'Management & Reports', href: '/admin/management', roles: adminOnlyRoles },
      { label: 'General Settings', href: '/admin/settings/general', roles: adminOnlyRoles },
    ]
  }
];

function normalizeRole(role: string): StaffRole {
  return role === 'ADMIN' ? 'ADMIN' : 'LIBRARIAN';
}

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/admin/documents') {
    return pathname === href || (pathname.startsWith(`${href}/`) && pathname !== '/admin/documents/new');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNotificationLinkAriaLabel(count?: number): string {
  if (typeof count !== 'number') return 'Notifications';
  return `Notifications, ${count} unread`;
}

function renderNavItemLabel(item: StaffNavItem, notificationCount?: number) {
  if (item.href !== notificationsHref) return item.label;

  return (
    <>
      <span>{item.label}</span>
      <NotificationBadge count={notificationCount ?? 0} />
    </>
  );
}

function StaffNavigationLinks({ role, label, notificationCount, onNavigate }: { role: string; label: string; notificationCount?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  const staffRole = normalizeRole(role);
  const navigationId = label.replaceAll(' ', '-').toLowerCase();

  return (
    <nav className="app-shell__staff-nav" aria-label={label}>
      <a
        className="app-shell__sidebar-action ui-button ui-button--primary"
        href="/admin/documents/new"
        aria-current={pathname === '/admin/documents/new' ? 'page' : undefined}
        onClick={onNavigate}
      >
        New Intake
      </a>
      {staffNavGroups.map((group) => {
        const items = group.items.filter((item) => item.roles.includes(staffRole));
        const groupId = `${navigationId}-${group.label.replaceAll(' ', '-').toLowerCase()}`;
        if (items.length === 0) return null;

        return (
          <section className="app-shell__nav-group" key={group.label} aria-labelledby={groupId}>
            <h2 id={groupId} className="app-shell__nav-group-label">{group.label}</h2>
            <ul className="app-shell__nav-list">
              {items.map((item) => {
                const isNotificationsLink = item.href === notificationsHref;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
                      aria-label={isNotificationsLink ? getNotificationLinkAriaLabel(notificationCount) : undefined}
                      onClick={onNavigate}
                    >
                      {renderNavItemLabel(item, notificationCount)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}

export function AdminSidebarNavigation({ role, notificationCount }: { role: string; notificationCount?: number }) {
  return (
    <aside className="app-shell__sidebar">
      <a className="app-shell__sidebar-brand" href="/admin/dashboard" aria-label="LIBIF staff workspace home">
        <strong>LIBIF</strong>
        <span>Staff workspace</span>
      </a>
      <StaffNavigationLinks role={role} label="Staff workspace navigation" notificationCount={notificationCount} />
    </aside>
  );
}

export function AdminMobileNavigation({ role, notificationCount }: { role: string; notificationCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="app-shell__mobile-nav-trigger" variant="secondary" size="sm" onClick={() => setOpen(true)} aria-expanded={open}>
        Open navigation
      </Button>
      <Drawer open={open} title="Staff navigation" onClose={() => setOpen(false)}>
        <StaffNavigationLinks role={role} label="Mobile staff workspace navigation" notificationCount={notificationCount} onNavigate={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
