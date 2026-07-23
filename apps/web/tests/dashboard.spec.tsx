import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminShell } from '../components/layout';
import { DashboardMetrics } from '../components/domain/reporting';
import type { LibrarianDashboardSummaryDto } from '../lib/api-types';
import AdminDashboardLoading from '../app/(admin)/admin/dashboard/loading';

const fetchMock = vi.hoisted(() => vi.fn());

vi.mock('../lib/api-server', () => ({
  fetchLibrarianDashboardSummary: fetchMock
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/dashboard'
}));

import AdminDashboardPage from '../app/(admin)/admin/dashboard/page';

const dashboardSummary: LibrarianDashboardSummaryDto = {
  generatedAt: '2026-07-21T04:00:00.000Z',
  books: { total: 3, draft: 0, pendingProcessing: 1, processing: 1, pendingApproval: 0, correctionRequired: 0, published: 1, rejected: 0 },
  processingJobs: { queued: 2, running: 1, succeeded: 4, failed: 0, cancelled: 0, superseded: 0 },
  taxonomy: { categories: 5, tags: 8 },
  users: { admins: 1, librarians: 2, readers: 9, total: 12 },
  recentBooks: [{ id: 'book-1', title: 'Digital Preservation', status: 'PUBLISHED', createdAt: '2026-07-20T10:00:00.000Z' }],
  activity: {
    counts: { processing: 2, approval: 1, correction: 1, total: 4 },
    recent: [
      {
        id: 'audit-1',
        documentId: 'book-1',
        documentTitle: 'Digital Preservation',
        action: 'PUBLISHED',
        message: 'Document approved and published',
        actorEmail: 'librarian@libif.local',
        createdAt: '2026-07-21T03:00:00.000Z'
      },
      {
        id: 'audit-2',
        documentId: 'book-2',
        documentTitle: 'Metadata Cleanup',
        action: 'CORRECTION_REQUESTED',
        message: 'Please add publisher details before approval can continue. This note is intentionally long to prove the dashboard keeps the detail readable in the activity table.',
        actorEmail: null,
        createdAt: '2026-07-21T02:00:00.000Z'
      }
    ]
  }
};

describe('admin dashboard', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('renders dashboard metrics, activity, and recent books from the summary component', () => {
    render(<DashboardMetrics summary={dashboardSummary} />);

    expect(screen.getByText('Total books')).toBeInTheDocument();
    expect(screen.getAllByText('Digital Preservation')).toHaveLength(2);
    expect(screen.getByText('Metadata Cleanup')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /recent processing, approval, and correction activity/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /recent digital book intakes/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard metric row 1').children).toHaveLength(3);
    expect(screen.getByLabelText('Dashboard metric row 2').children).toHaveLength(3);
    expect(screen.getByLabelText('Dashboard activity summary').children).toHaveLength(3);
    expect(screen.getByText(/system activity/i)).toBeInTheDocument();
    expect(screen.getAllByText('Published').length).toBeGreaterThanOrEqual(2);
  });

  it('renders empty activity and intake states without hiding metrics', () => {
    render(<DashboardMetrics summary={{ ...dashboardSummary, recentBooks: [], activity: { counts: { processing: 0, approval: 0, correction: 0, total: 0 }, recent: [] } }} />);

    expect(screen.getByText('Total books')).toBeInTheDocument();
    expect(screen.getByText(/no workflow activity yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no recent intakes yet/i)).toBeInTheDocument();
  });

  it('has no automated accessibility violations for populated activity content', async () => {
    const { container } = render(<DashboardMetrics summary={dashboardSummary} />);
    expect(await axe(container)).toHaveNoViolations();
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
    expect(screen.getAllByText('Digital Preservation')).toHaveLength(2);
    expect(screen.getByText('Metadata Cleanup')).toBeInTheDocument();
  });

  it('adds dashboard navigation to the admin shell', () => {
    render(<AdminShell user={{ name: 'Ada Admin', email: 'ada@example.test', role: 'ADMIN' }}><h1>Admin books</h1></AdminShell>);

    expect(screen.getByRole('link', { name: /^dashboard$/i })).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute('href', '/admin/categories');
    expect(screen.getByRole('link', { name: /^tags$/i })).toHaveAttribute('href', '/admin/tags');
  });
});
