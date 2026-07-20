import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AdminShell, AuthShell, ReaderShell } from '../components/layout';
import { getDevAuthHeaders } from '../lib/auth/session';

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

  it('renders admin shell with sidebar navigation for staff sections', () => {
    render(<AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }}><h1>Admin books</h1></AdminShell>);
    expect(screen.getByRole('navigation', { name: /admin workspace navigation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/admin sections/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /new intake/i })[0]).toHaveAttribute('href', '/admin/books/new');
  });

  it('renders auth shell boundary navigation', () => {
    render(<AuthShell><h1>Access denied</h1></AuthShell>);
    expect(screen.getByRole('navigation', { name: /access boundary navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/session boundary/i)).toBeInTheDocument();
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
