import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminShell, AuthShell, ReaderShell } from '../components/layout';
import { getDevAuthHeaders } from '../lib/auth/session';

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/dashboard'
}));

describe('route-group shells and auth helper', () => {
  const originalEnableDevAuth = process.env.NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH;
  const originalRole = process.env.NEXT_PUBLIC_LIBIF_DEV_ROLE;
  const originalEmail = process.env.NEXT_PUBLIC_LIBIF_DEV_EMAIL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH = originalEnableDevAuth;
    process.env.NEXT_PUBLIC_LIBIF_DEV_ROLE = originalRole;
    process.env.NEXT_PUBLIC_LIBIF_DEV_EMAIL = originalEmail;
  });

  it('renders reader shell navigation with a skip link and main landmark', () => {
    render(<ReaderShell><h1>Reader home</h1></ReaderShell>);
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('navigation', { name: /reader workspace navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('uses the desktop sidebar as the single primary staff navigation', () => {
    render(<AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }}><h1>Admin books</h1></AdminShell>);

    const navigation = screen.getByRole('navigation', { name: /staff workspace navigation/i });
    expect(screen.queryByRole('navigation', { name: /admin workspace navigation/i })).not.toBeInTheDocument();
    expect(within(navigation).getByRole('link', { name: /^dashboard$/i })).toHaveAttribute('href', '/admin/dashboard');
    expect(within(navigation).getByRole('link', { name: /^documents$/i })).toHaveAttribute('href', '/admin/documents');
    expect(within(navigation).getByRole('link', { name: /new intake/i })).toHaveAttribute('href', '/admin/documents/new');
    expect(within(navigation).getByRole('link', { name: /processing queue/i })).toHaveAttribute('href', '/admin/processing');
    expect(within(navigation).getByRole('link', { name: /approval queue/i })).toHaveAttribute('href', '/admin/approvals');
    expect(within(navigation).getByRole('link', { name: /notifications/i })).toHaveAttribute('href', '/admin/notifications');
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('keeps taxonomy discoverable for the Librarian read-only contract', () => {
    render(<AdminShell user={{ name: 'Lin Librarian', email: 'lin@example.test', role: 'LIBRARIAN' }}><h1>Categories</h1></AdminShell>);

    const navigation = screen.getByRole('navigation', { name: /staff workspace navigation/i });
    expect(within(navigation).getByRole('link', { name: /^categories$/i })).toHaveAttribute('href', '/admin/categories');
    expect(within(navigation).getByRole('link', { name: /^tags$/i })).toHaveAttribute('href', '/admin/tags');
    expect(screen.getByText('Librarian')).toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: /^users$/i })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: /settings/i })).not.toBeInTheDocument();
  });

  it('moves staff navigation into a closable mobile drawer', async () => {
    const user = userEvent.setup();
    render(<AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }}><h1>Admin books</h1></AdminShell>);

    expect(screen.queryByRole('dialog', { name: /staff navigation/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    const drawer = screen.getByRole('dialog', { name: /staff navigation/i });
    expect(within(drawer).getByRole('navigation', { name: /mobile staff workspace navigation/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /^documents$/i })).toHaveAttribute('href', '/admin/documents');

    await user.click(within(drawer).getByRole('button', { name: /close drawer/i }));
    expect(screen.queryByRole('dialog', { name: /staff navigation/i })).not.toBeInTheDocument();
  });

  it('renders auth shell boundary navigation', () => {
    render(<AuthShell><h1>Access denied</h1></AuthShell>);
    expect(screen.getByRole('navigation', { name: /access boundary navigation/i })).toBeInTheDocument();
    // Auth shell shows a minimal nav with a Home link (auth actions are in the reader avatar menu)
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
    // The brand subtitle identifies the shell context
    expect(screen.getByText(/access boundary/i)).toBeInTheDocument();
  });

  it('creates controlled development auth headers with safe role fallback', () => {
    process.env.NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH = 'true';
    process.env.NEXT_PUBLIC_LIBIF_DEV_ROLE = 'not-a-role';
    process.env.NEXT_PUBLIC_LIBIF_DEV_EMAIL = 'staff@example.test';
    expect(getDevAuthHeaders()).toEqual({
      'x-libif-dev-role': 'LIBRARIAN',
      'x-libif-dev-user-email': 'staff@example.test'
    });
  });

  it('does not create development auth headers unless explicitly enabled', () => {
    process.env.NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH = 'false';
    process.env.NEXT_PUBLIC_LIBIF_DEV_ROLE = 'ADMIN';
    expect(getDevAuthHeaders()).toEqual({});
  });
});
