import { redirect } from 'next/navigation';
import { fetchSession } from '../api-server';

export async function requireAdmin(): Promise<void> {
  const session = await fetchSession().catch(() => undefined);
  if (!session?.authenticated) redirect('/session-expired');
  if (session.user?.role !== 'ADMIN') redirect('/access-denied');
}
