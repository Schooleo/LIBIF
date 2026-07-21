import type { ReactNode } from 'react';
import { ReaderShell } from '../../components/layout';
import type { ShellUser } from '../../components/layout';
import { fetchSession } from '../../lib/api-server';

export const dynamic = 'force-dynamic';

export default async function ReaderLayout({ children }: { children: ReactNode }) {
  // Attempt to fetch the session. If not authenticated (or API is down), user stays undefined
  // and the ReaderShell will render the guest avatar menu with auth links.
  const session = await fetchSession().catch(() => undefined);
  const u = session?.authenticated && session.user ? session.user : undefined;

  const shellUser: ShellUser | undefined = u
    ? { name: u.email, email: u.email, role: u.role }
    : undefined;

  return <ReaderShell user={shellUser}>{children}</ReaderShell>;
}
