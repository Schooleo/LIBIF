import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminShell } from '../components/layout';
import { DashboardMetrics } from '../components/domain/reporting';
import type { LibrarianDashboardSummaryDto } from '../lib/api-types';
import AdminDashboardLoading from '../app/(admin)/admin/dashboard/loading';

const fetchMock = vi.hoisted(() => vi.fn());

vi.mock('../lib/api-server', () => ({
  fetchLibrarianDashboardSummary: fetchMock
}));

import AdminDashboardPage from '../app/(admin)/admin/dashboard/page';

const dashboardSummary: LibrarianDashboardSummaryDto = {
  generatedAt: '2026-07-21T04:00:00.000Z',
  books: { total: 3, draft: 0, pendingProcessing: 1, processing: 1, pendingApproval: 0, published: 1, rejected: 0 },
  processingJobs: { queued: 2, running: 1, succeeded: 4, failed: 0 },
  taxonomy: { categories: 5, tags: 8 },
  users: { admins: 1, librarians: 2, readers: 9, total: 12 },
  recentBooks: [{ id: 'book-1', title: 'Digital Preservation', status: 'PUBLISHED', createdAt: '2026-07-20T10:00:00.000Z' }]
};

describe('admin dashboard', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('renders dashboard metrics and recent books from the summary component', () => {
    render(<DashboardMetrics summary={dashboardSummary} />);

    expect(screen.getByText('Total books')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Digital Preservation')).toBeInTheDocument();
    expect(screen.getAllByText('Published')).toHaveLength(2);
    expect(screen.getByRole('table', { name: /recent digital book intakes/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard metric row 1').children).toHaveLength(3);
    expect(screen.getByLabelText('Dashboard metric row 2').children).toHaveLength(3);
  });

  it('renders an empty recent-intakes state without hiding metrics', () => {
    render(<DashboardMetrics summary={{ ...dashboardSummary, recentBooks: [] }} />);

    expect(screen.getByText('Total books')).toBeInTheDocument();
    expect(screen.getByText(/no recent intakes yet/i)).toBeInTheDocument();
  });

  it('renders route loading skeletons with accessible status labels', () => {
    render(<AdminDashboardLoading />);

    expect(screen.getByRole('heading', { level: 1, name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /books metric loading/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /recent intakes loading/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard loading metric row 1').children).toHaveLength(3);
    expect(screen.getByLabelText('Dashboard loading metric row 2').children).toHaveLength(3);
  });

  it('renders dashboard fetch errors in the route', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network unavailable'));

    render(await AdminDashboardPage());

    expect(screen.getByRole('heading', { level: 1, name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/network unavailable/i);
  });

  it('renders successful route data through the dashboard page', async () => {
    fetchMock.mockResolvedValueOnce(dashboardSummary);

    render(await AdminDashboardPage());

    expect(screen.getByRole('heading', { level: 1, name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByText('Digital Preservation')).toBeInTheDocument();
  });

  it('adds dashboard navigation to the admin shell', () => {
    render(<AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }}><h1>Admin books</h1></AdminShell>);

    expect(screen.getAllByRole('link', { name: /dashboard/i })[0]).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getAllByRole('link', { name: /categories/i })[0]).toHaveAttribute('href', '/admin/categories');
    expect(screen.getAllByRole('link', { name: /^tags/i })[0]).toHaveAttribute('href', '/admin/tags');
  });
});
