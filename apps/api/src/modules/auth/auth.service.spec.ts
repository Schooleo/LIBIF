import type { Request } from 'express';
import { AuthService } from './auth.service';

describe('AuthService development fallback', () => {
  function service(nodeEnv: string, devAuth: string) {
    const config = { get: (key: string) => (key === 'NODE_ENV' ? nodeEnv : key === 'LIBIF_ENABLE_DEV_AUTH' ? devAuth : undefined) };
    return new AuthService(config as never, {} as never, {} as never, {} as never, { readSessionToken: () => undefined } as never, {} as never);
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
});
