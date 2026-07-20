import type { ReactNode } from 'react';
import { classNames } from '../../lib/classnames';
import { Avatar, Badge, Card } from '../ui';

type ShellVariant = 'reader' | 'admin' | 'auth';

type NavItem = {
  label: string;
  href: string;
  description?: string;
  active?: boolean;
};

type ShellUser = {
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

export function AppShell({ variant, navItems, user, children, utility }: { variant: ShellVariant; navItems: NavItem[]; user?: ShellUser; children: ReactNode; utility?: ReactNode }) {
  return (
    <div className={classNames('app-shell', `app-shell--${variant}`)}>
      <a className="app-shell__skip-link" href="#main-content">Skip to main content</a>
      <header className="app-shell__topbar">
        <a className="app-shell__brand" href="/" aria-label="LIBIF home"><span aria-hidden="true">LIBIF</span><small>{variantLabel(variant)}</small></a>
        <nav className="app-shell__nav" aria-label={`${variantLabel(variant)} navigation`}>
          {navItems.map((item) => <a key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined}>{item.label}</a>)}
        </nav>
        <div className="app-shell__utility">
          {utility}
          {user ? <UserSummary user={user} /> : <Badge tone="info">Session boundary</Badge>}
        </div>
      </header>
      {variant === 'admin' ? <aside className="app-shell__sidebar" aria-label="Admin sections">{navItems.map((item) => <a key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined}>{item.label}<span>{item.description}</span></a>)}</aside> : null}
      <main id="main-content" className="app-shell__main" tabIndex={-1}>{children}</main>
    </div>
  );
}

export function ReaderShell({ children, user = { name: 'Reader preview', role: 'Reader' } }: { children: ReactNode; user?: ShellUser }) {
  return <AppShell variant="reader" navItems={readerNav} user={user}>{children}</AppShell>;
}

export function AdminShell({ children, user }: { children: ReactNode; user: ShellUser }) {
  return <AppShell variant="admin" navItems={adminNav} user={user}>{children}</AppShell>;
}

export function AuthShell({ children }: { children: ReactNode }) {
  return <AppShell variant="auth" navItems={authNav}>{children}</AppShell>;
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

const readerNav: NavItem[] = [
  { label: 'Home', href: '/', description: 'Reader landing' },
  { label: 'Catalogue', href: '/catalogue', description: 'Published public books' },
  { label: 'Staff intake', href: '/admin/books/new', description: 'Development staff workflow' }
];

const adminNav: NavItem[] = [
  { label: 'Admin books', href: '/admin/books', description: 'Digital book intake records' },
  { label: 'New intake', href: '/admin/books/new', description: 'Upload and queue a scanned PDF' },
  { label: 'Public catalogue', href: '/catalogue', description: 'Reader-facing catalogue preview' }
];

const authNav: NavItem[] = [
  { label: 'Access denied', href: '/access-denied' },
  { label: 'Session expired', href: '/session-expired' },
  { label: 'Home', href: '/' }
];

function variantLabel(variant: ShellVariant): string {
  if (variant === 'admin') return 'Admin workspace';
  if (variant === 'auth') return 'Access boundary';
  return 'Reader workspace';
}

function UserSummary({ user }: { user: ShellUser }) {
  return (
    <div className="app-shell__user">
      <Avatar name={user.name} />
      <span><strong>{user.name}</strong><small>{user.email ?? user.role}</small></span>
    </div>
  );
}
