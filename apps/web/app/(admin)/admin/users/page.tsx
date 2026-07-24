import { PageHeader } from '../../../../components/layout';
import { UserManagementTable } from '../../../../components/domain/users';
import { InlineAlert } from '../../../../components/ui';
import { fetchAdminUsers } from '../../../../lib/api-server';
import type { UserListQuery } from '../../../../lib/api-types';
import { requireAdmin } from '../../../../lib/auth/require-admin';

type PageProps = {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const query: UserListQuery = {
    q: params.q,
    role: asRole(params.role),
    status: asStatus(params.status),
    page: positiveInteger(params.page, 1),
    pageSize: 20,
  };

  const result = await fetchAdminUsers(query).catch((error: Error) => error);

  return (
    <section className="ui-stack">
      <PageHeader title="Users" description="Admin-only account, role, status, and session administration." />
      <form method="get" className="ui-table-toolbar" role="search" aria-label="User filters">
        <div className="ui-cluster">
          <input className="ui-input" type="search" name="q" defaultValue={query.q} placeholder="Search email" aria-label="Search users by email" />
          <select className="ui-select" name="role" defaultValue={query.role ?? ''} aria-label="Filter users by role">
            <option value="">All roles</option>
            <option value="ADMIN">Administrator</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="READER">Reader</option>
          </select>
          <select className="ui-select" name="status" defaultValue={query.status ?? ''} aria-label="Filter users by status">
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
          <button className="ui-button ui-button--primary" type="submit">Apply filters</button>
          <a className="ui-button ui-button--secondary" href="/admin/users">Reset</a>
        </div>
      </form>
      {result instanceof Error ? (
        <InlineAlert tone="error">Users could not be loaded: {result.message}</InlineAlert>
      ) : (
        <>
          <UserManagementTable result={result} />
          <nav className="ui-pagination" aria-label="User pagination">
            {result.page <= 1
              ? <span className="ui-button ui-button--secondary" aria-disabled="true">Previous</span>
              : <a className="ui-button ui-button--secondary" href={userPageHref(params, result.page - 1)}>Previous</a>}
            <span>Page {result.page} of {Math.max(1, Math.ceil(result.totalCount / result.pageSize))}</span>
            {result.page * result.pageSize >= result.totalCount
              ? <span className="ui-button ui-button--secondary" aria-disabled="true">Next</span>
              : <a className="ui-button ui-button--secondary" href={userPageHref(params, result.page + 1)}>Next</a>}
          </nav>
        </>
      )}
    </section>
  );
}

function asRole(value: string | undefined): UserListQuery['role'] {
  return value === 'ADMIN' || value === 'LIBRARIAN' || value === 'READER' ? value : undefined;
}

function asStatus(value: string | undefined): UserListQuery['status'] {
  return value === 'ACTIVE' || value === 'DEACTIVATED' ? value : undefined;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function userPageHref(params: Awaited<PageProps['searchParams']>, page: number): string {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.role) query.set('role', params.role);
  if (params.status) query.set('status', params.status);
  query.set('page', String(Math.max(1, page)));
  return `/admin/users?${query.toString()}`;
}
