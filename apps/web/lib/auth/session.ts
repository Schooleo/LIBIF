type RoleKey = 'ADMIN' | 'LIBRARIAN' | 'READER';

const DEV_AUTH_ENABLED = 'true';
const DEV_ROLE_HEADER = 'x-libif-dev-role';
const DEV_EMAIL_HEADER = 'x-libif-dev-user-email';

export function getDevAuthHeaders(): Record<string, string> {
  if (process.env.NODE_ENV === 'production') return {};
  if (process.env.NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH !== DEV_AUTH_ENABLED) return {};
  const role = normalizeRole(process.env.NEXT_PUBLIC_LIBIF_DEV_ROLE ?? 'LIBRARIAN');
  return {
    [DEV_ROLE_HEADER]: role,
    [DEV_EMAIL_HEADER]: process.env.NEXT_PUBLIC_LIBIF_DEV_EMAIL ?? `${role.toLowerCase()}@libif.local`
  };
}

function normalizeRole(role: string): RoleKey {
  const normalized = role.toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'LIBRARIAN' || normalized === 'READER') return normalized;
  return 'LIBRARIAN';
}
