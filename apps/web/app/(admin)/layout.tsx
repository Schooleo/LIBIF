import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '../../components/layout';
import { fetchSession } from '../../lib/api';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession().catch(() => undefined);
  const user = session?.user;
  if (!session?.authenticated || !user || (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN')) redirect('/access-denied');
  return <AdminShell user={{ name: user.email, email: user.email, role: user.role }}>{children}</AdminShell>;
}
