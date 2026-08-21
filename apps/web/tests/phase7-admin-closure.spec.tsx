import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminShell } from '../components/layout';
import type {
  GeneralSettingsResponseDto,
  ManagementDashboardSummaryDto,
  ReaderAccessReportResponseDto,
  UserDetailResponseDto,
  UserListResponseDto,
} from '../lib/api-types';

const apiServer = vi.hoisted(() => ({
  fetchAdminUsers: vi.fn(),
  fetchAdminUserDetail: vi.fn(),
  fetchManagementDashboardSummary: vi.fn(),
  fetchReaderAccessReport: vi.fn(),
  fetchGeneralSettings: vi.fn(),
  fetchSession: vi.fn(),
}));
const apiBrowser = vi.hoisted(() => ({
  changeAdminUserRole: vi.fn(),
  deactivateAdminUser: vi.fn(),
  reactivateAdminUser: vi.fn(),
  updateGeneralSettings: vi.fn(),
}));
const refresh = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() => vi.fn());

vi.mock('../lib/api-server', () => apiServer);
vi.mock('../lib/api-browser', () => apiBrowser);
vi.mock('next/navigation', () => ({
  redirect,
  usePathname: () => '/admin/users',
  useRouter: () => ({ refresh }),
}));

import AdminManagementPage from '../app/(admin)/admin/management/page';
import AdminGeneralSettingsPage from '../app/(admin)/admin/settings/general/page';
import AdminUserDetailPage from '../app/(admin)/admin/users/[id]/page';
import AdminUsersPage from '../app/(admin)/admin/users/page';

const userDetail: UserDetailResponseDto = {
  id: 'user-1',
  email: 'reader@example.test',
  role: 'READER',
  status: 'ACTIVE',
  lastSignInAt: '2026-07-24T01:00:00.000Z',
  deactivatedAt: null,
  createdAt: '2026-07-20T01:00:00.000Z',
  updatedAt: '2026-07-24T01:00:00.000Z',
  activeSessionCount: 1,
  sessionSummary: {
    activeCount: 1,
    revokedCount: 0,
    expiredCount: 0,
    mostRecentCreatedAt: '2026-07-24T00:30:00.000Z',
    mostRecentLastSeenAt: '2026-07-24T01:00:00.000Z',
    mostRecentExpiresAt: '2026-07-25T00:30:00.000Z',
    mostRecentRevokedAt: null,
  },
  administrationEvents: [],
};

const users: UserListResponseDto = {
  items: [userDetail],
  totalCount: 1,
  page: 1,
  pageSize: 20,
};

const summary: ManagementDashboardSummaryDto = {
  generatedAt: '2026-07-24T02:00:00.000Z',
  from: '2026-07-01T00:00:00.000Z',
  to: '2026-08-01T00:00:00.000Z',
  documentsCreated: 3,
  usersCreated: 4,
  activityEvents: 5,
  readerSecurity: { total: 6, rateLimited: 2, scrapeSuspected: 1, highRisk: 1 },
};

const report: ReaderAccessReportResponseDto = {
  generatedAt: summary.generatedAt,
  riskCounts: { none: 3, low: 2, medium: 0, high: 1 },
  items: [{
    eventReference: 'event-ref',
    documentReference: 'document-ref',
    readerLabel: 'READER-1234',
    eventType: 'SCRAPE_SUSPECTED',
    riskLevel: 'HIGH',
    reasonCode: 'PAGE_ENUMERATION',
    pageNumber: 9,
    traceFingerprint: null,
    occurredAt: '2026-07-24T01:30:00.000Z',
  }],
  totalCount: 1,
  page: 1,
  pageSize: 50,
};

const settings: GeneralSettingsResponseDto = {
  libraryName: 'LIBIF',
  supportEmail: 'support@example.test',
  defaultLocale: 'vi',
  readerNotice: 'Pages are personalized and access is audited.',
  updatedAt: '2026-07-24T01:00:00.000Z',
  updatedById: null,
  deploymentSecurity: {
    watermarkSigningConfigured: false,
    scrapeProtectionConfigured: true,
    personalizedPageCachePolicy: 'private, no-store',
    editable: false,
  },
};

describe('Phase 7 Admin web closure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiServer.fetchSession.mockResolvedValue({
      authenticated: true,
      user: { id: 'admin-1', email: 'admin@example.test', role: 'ADMIN' },
    });
    apiServer.fetchAdminUsers.mockResolvedValue(users);
    apiServer.fetchAdminUserDetail.mockResolvedValue(userDetail);
    apiServer.fetchManagementDashboardSummary.mockResolvedValue(summary);
    apiServer.fetchReaderAccessReport.mockResolvedValue(report);
    apiServer.fetchGeneralSettings.mockResolvedValue(settings);
  });

  it('denies direct Admin route access to librarians before loading protected data', async () => {
    apiServer.fetchSession.mockResolvedValue({
      authenticated: true,
      user: { id: 'librarian-1', email: 'librarian@example.test', role: 'LIBRARIAN' },
    });
    redirect.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`);
    });

    await expect(AdminUsersPage({ searchParams: Promise.resolve({}) }))
      .rejects.toThrow('NEXT_REDIRECT:/access-denied');
    expect(apiServer.fetchAdminUsers).not.toHaveBeenCalled();
  });

  it('fails closed to session expiry when the Admin session cannot be loaded', async () => {
    apiServer.fetchSession.mockRejectedValue(new Error('Session service unavailable'));
    redirect.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`);
    });

    await expect(AdminGeneralSettingsPage())
      .rejects.toThrow('NEXT_REDIRECT:/session-expired');
    expect(apiServer.fetchGeneralSettings).not.toHaveBeenCalled();
  });

  it('shows Admin-only users, reports, and settings navigation without exposing it to librarians', () => {
    const { rerender } = render(<AdminShell user={{ name: 'Admin', role: 'ADMIN' }}><p>Content</p></AdminShell>);
    let navigation = screen.getByRole('navigation', { name: /staff workspace navigation/i });
    expect(within(navigation).getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/admin/users');
    expect(within(navigation).getByRole('link', { name: 'Management & Reports' })).toHaveAttribute('href', '/admin/management');
    expect(within(navigation).getByRole('link', { name: 'General Settings' })).toHaveAttribute('href', '/admin/settings/general');

    rerender(<AdminShell user={{ name: 'Librarian', role: 'LIBRARIAN' }}><p>Content</p></AdminShell>);
    navigation = screen.getByRole('navigation', { name: /staff workspace navigation/i });
    expect(within(navigation).queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'Management & Reports' })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'General Settings' })).not.toBeInTheDocument();
  });

  it('renders the user list and detail routes from generated-client-backed adapters', async () => {
    const list = render(await AdminUsersPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /user administration accounts/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'reader@example.test' })).toHaveAttribute('href', '/admin/users/user-1');
    list.unmount();

    render(await AdminUserDetailPage({ params: Promise.resolve({ id: 'user-1' }) }));
    expect(screen.getByRole('heading', { level: 1, name: 'reader@example.test' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Change role' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Deactivate account' })).toBeInTheDocument();
  });

  it('submits a role change with an auditable reason', async () => {
    const user = userEvent.setup();
    apiBrowser.changeAdminUserRole.mockResolvedValue({ ...userDetail, role: 'LIBRARIAN', activeSessionCount: 0 });
    render(await AdminUserDetailPage({ params: Promise.resolve({ id: 'user-1' }) }));

    await user.selectOptions(screen.getByLabelText(/Role/), 'LIBRARIAN');
    await user.type(screen.getAllByLabelText(/Reason/)[0], 'Assigned to catalogue operations');
    await user.click(screen.getByRole('button', { name: 'Save role' }));

    expect(apiBrowser.changeAdminUserRole).toHaveBeenCalledWith('user-1', {
      role: 'LIBRARIAN',
      reason: 'Assigned to catalogue operations',
    });
    expect(await screen.findByRole('status')).toHaveTextContent(/role updated/i);
  });

  it('renders management security evidence and bounded CSV links', async () => {
    const { container } = render(await AdminManagementPage({ searchParams: Promise.resolve({ risk: 'HIGH' }) }));
    expect(screen.getByRole('heading', { name: 'Management & Reporting' })).toBeInTheDocument();
    expect(screen.getByText('READER-1234')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reader access CSV' })).toHaveAttribute(
      'href',
      expect.stringContaining('/api/admin/reports/reader-access.csv'),
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders and saves product-owned settings while keeping deployment protections read-only', async () => {
    const user = userEvent.setup();
    apiBrowser.updateGeneralSettings.mockResolvedValue({ ...settings, libraryName: 'LIBIF Digital' });
    render(await AdminGeneralSettingsPage());

    const name = screen.getByLabelText(/Library name/);
    await user.clear(name);
    await user.type(name, 'LIBIF Digital');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(apiBrowser.updateGeneralSettings).toHaveBeenCalledWith(expect.objectContaining({
      libraryName: 'LIBIF Digital',
      defaultLocale: 'vi',
    }));
    expect(screen.getByText(/opaque trace fingerprints remain unsigned/i)).toBeInTheDocument();
  });
});
