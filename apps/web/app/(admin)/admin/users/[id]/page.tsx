import { Breadcrumbs, PageHeader } from '../../../../../components/layout';
import { UserAdministrationPanel } from '../../../../../components/domain/users';
import { InlineAlert } from '../../../../../components/ui';
import { fetchAdminUserDetail } from '../../../../../lib/api-server';
import { requireAdmin } from '../../../../../lib/auth/require-admin';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const user = await fetchAdminUserDetail(id).catch((error: Error) => error);

  return (
    <section className="ui-stack">
      <Breadcrumbs items={[{ label: 'Users', href: '/admin/users' }, { label: user instanceof Error ? 'Account' : user.email }]} />
      <PageHeader title={user instanceof Error ? 'User account' : user.email} description="Role, account status, session summary, and immutable administration history." />
      {user instanceof Error
        ? <InlineAlert tone="error">User details could not be loaded: {user.message}</InlineAlert>
        : <UserAdministrationPanel initialUser={user} />}
    </section>
  );
}
