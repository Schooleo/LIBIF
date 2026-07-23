import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '../../components/layout';
import { SignOutButton } from '../../components/auth/SignOutButton';
import { fetchSession, fetchUnreadNotificationCount } from '../../lib/api-server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession().catch(() => undefined);
  const user = session?.user;
  if (!session?.authenticated || !user) redirect('/session-expired');
  if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') redirect('/access-denied');

  const notificationCount = await fetchUnreadNotificationCount()
    .then((result) => result.count)
    .catch(() => undefined);

  return (
    <AdminShell
      user={{ name: user.email, email: user.email, role: user.role }}
      utility={<SignOutButton />}
      notificationCount={notificationCount}
    >
      {children}
    </AdminShell>
  );
}
