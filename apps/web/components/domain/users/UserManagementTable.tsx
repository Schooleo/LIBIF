import type { UserListItemDto, UserListResponseDto } from '../../../lib/api-types';
import { DataTable, StatusBadge, type DataColumn } from '../../ui';
import { UserRoleBadge } from './UserRoleBadge';

const columns: DataColumn<UserListItemDto>[] = [
  {
    key: 'email',
    header: 'Account',
    render: (user) => <a href={`/admin/users/${user.id}`}><strong>{user.email}</strong></a>,
  },
  { key: 'role', header: 'Role', render: (user) => <UserRoleBadge role={user.role} /> },
  { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status} /> },
  { key: 'sessions', header: 'Active sessions', render: (user) => user.activeSessionCount, align: 'end' },
  {
    key: 'lastSignInAt',
    header: 'Last sign-in',
    render: (user) => user.lastSignInAt ? <time dateTime={user.lastSignInAt}>{formatDateTime(user.lastSignInAt)}</time> : 'Never',
  },
];

export function UserManagementTable({ result }: { result: UserListResponseDto }) {
  return (
    <DataTable
      caption="User administration accounts"
      columns={columns}
      items={result.items}
      getRowKey={(user) => user.id}
      emptyTitle="No users match these filters."
      state={{ page: result.page, pageSize: result.pageSize }}
      rowCount={result.totalCount}
    />
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
