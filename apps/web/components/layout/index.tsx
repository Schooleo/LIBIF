import type { ReactNode } from 'react';
import { classNames } from '../../lib/classnames';
import { Badge, Card } from '../ui';
import { AdminMobileNavigation, AdminSidebarNavigation } from './AdminNavigation';
import { AvatarMenu } from './AvatarMenu';

type ShellVariant = 'reader' | 'admin' | 'auth';

type NavItem = {
  label: string;
  href: string;
  description?: string;
  active?: boolean;
};

export type ShellUser = {
  name: string;
  email?: string;
  role: string;
};

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <header className="ui-stack"><div className="ui-cluster"><h1>{title}</h1>{actions}</div>{description ? <p>{description}</p> : null}</header>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb"><ol className="ui-cluster">{items.map((item) => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}</li>)}</ol></nav>;
}

export function Tabs({ tabs }: { tabs: { label: string; href: string; active?: boolean }[] }) {
  return <nav aria-label="Tabs" className="ui-cluster">{tabs.map((tab) => <a key={tab.href} href={tab.href} aria-current={tab.active ? 'page' : undefined}>{tab.label}</a>)}</nav>;
}

export function AppShell({
  variant,
  navItems,
  user,
  children,
  utility,
  notificationCount,
}: {
  variant: ShellVariant;
  navItems: NavItem[];
  user?: ShellUser;
  children: ReactNode;
  utility?: ReactNode;
  notificationCount?: number;
}) {
  return (
    <div className={classNames('app-shell', `app-shell--${variant}`)}>
      <a className="app-shell__skip-link" href="#main-content">Skip to main content</a>
      <header className="app-shell__topbar">
        {variant === 'admin' && user ? (
          <div className="app-shell__context">
            <AdminMobileNavigation role={user.role} notificationCount={notificationCount} />
            <span>
              <strong>Staff workspace</strong>
              <small>Operations and administration</small>
            </span>
          </div>
        ) : (
          <>
            <a className="app-shell__brand" href="/" aria-label="LIBIF home">
              <span aria-hidden="true">LIBIF</span>
              <small>{variantLabel(variant)}</small>
            </a>
            <nav className="app-shell__nav" aria-label={`${variantLabel(variant)} navigation`}>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined}>
                  {item.label}
                </a>
              ))}
            </nav>
          </>
        )}
        <div className="app-shell__utility">
          {utility}
          {variant === 'reader' ? (
            /* Reader shell: avatar menu with auth links for guests or sign-out for users */
            user ? (
              <AvatarMenu authenticated name={user.name} email={user.email ?? ''} role={user.role} />
            ) : (
              <AvatarMenu authenticated={false} />
            )
          ) : user ? (
            /* Staff shell: top bar is utility-only; primary navigation remains in the sidebar/drawer. */
            <div className="app-shell__user">
              <Badge tone="info">{user.role === 'ADMIN' ? 'Administrator' : 'Librarian'}</Badge>
              <span>
                <strong>{user.name}</strong>
                <small>{user.email ?? user.role}</small>
              </span>
            </div>
          ) : variant === 'auth' ? null : (
            <Badge tone="info">Session boundary</Badge>
          )}
        </div>
      </header>
      {variant === 'admin' && user ? <AdminSidebarNavigation role={user.role} notificationCount={notificationCount} /> : null}
      <main id="main-content" className="app-shell__main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

/**
 * Reader shell — call from layout.tsx with optional session user.
 * When no user is provided the avatar menu shows guest auth links.
 */
export function ReaderShell({ children, user }: { children: ReactNode; user?: ShellUser }) {
  return (
    <AppShell variant="reader" navItems={readerNav} user={user}>
      {children}
    </AppShell>
  );
}

export function AdminShell({ children, user, utility, notificationCount }: { children: ReactNode; user: ShellUser; utility?: ReactNode; notificationCount?: number }) {
  return (
    <AppShell variant="admin" navItems={[]} user={user} utility={utility} notificationCount={notificationCount}>
      {children}
    </AppShell>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <AppShell variant="auth" navItems={authNav}>
      {children}
    </AppShell>
  );
}

export function AccessBoundaryCard({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref: string; actionLabel: string }) {
  return (
    <Card>
      <div className="ui-stack">
        <PageHeader title={title} description={description} />
        <p><a className="ui-button ui-button--primary" href={actionHref}>{actionLabel}</a></p>
      </div>
    </Card>
  );
}

// ── Nav definitions ──────────────────────────────────────────────────────────

/** Reader portal: public nav only. Auth actions are in the avatar dropdown. */
const readerNav: NavItem[] = [
  { label: 'Home', href: '/', description: 'Reader landing' },
  { label: 'Catalogue', href: '/catalogue', description: 'Published books' },
];

/** Auth layout: minimal — just a back-to-home link in the nav. */
const authNav: NavItem[] = [
  { label: 'Home', href: '/' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function variantLabel(variant: ShellVariant): string {
  if (variant === 'admin') return 'Admin workspace';
  if (variant === 'auth') return 'Access boundary';
  return 'Reader workspace';
}
