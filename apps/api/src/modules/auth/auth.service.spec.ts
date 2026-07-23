import type { Request } from 'express';
import { AuthService } from './auth.service';

describe('AuthService development fallback', () => {
  function service(nodeEnv: string, devAuth: string, persistedUserId?: string) {
    const config = { get: (key: string) => (key === 'NODE_ENV' ? nodeEnv : key === 'LIBIF_ENABLE_DEV_AUTH' ? devAuth : undefined) };
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(persistedUserId ? { id: persistedUserId } : null) } };
    return new AuthService(config as never, prisma as never, {} as never, {} as never, { readSessionToken: () => undefined } as never, {} as never);
  }

  it('does not accept dev auth headers in production', async () => {
    const request = { headers: { 'x-libif-dev-role': 'ADMIN', 'x-libif-dev-user-email': 'admin@example.test' } } as unknown as Request;
    await expect(service('production', 'true').resolveUser(request)).resolves.toBeUndefined();
  });

  it('requires explicit non-production dev auth opt-in', async () => {
    const request = { headers: { 'x-libif-dev-role': 'LIBRARIAN', 'x-libif-dev-user-email': 'staff@example.test' } } as unknown as Request;
    await expect(service('test', 'false').resolveUser(request)).resolves.toBeUndefined();
    await expect(service('test', 'true').resolveUser(request)).resolves.toMatchObject({ email: 'staff@example.test', role: 'LIBRARIAN' });
  });

  it('binds development headers to the persisted seeded account when available', async () => {
    const request = {
      headers: { 'x-libif-dev-role': 'READER', 'x-libif-dev-user-email': 'reader@libif.local' },
    } as unknown as Request;

    await expect(service('test', 'true', 'seeded-reader-id').resolveUser(request)).resolves.toMatchObject({
      id: 'seeded-reader-id',
      email: 'reader@libif.local',
      role: 'READER',
    });
  });
});
