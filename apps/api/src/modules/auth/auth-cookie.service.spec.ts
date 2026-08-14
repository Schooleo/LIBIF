import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthCookieService, SESSION_COOKIE_NAME } from './auth-cookie.service';

describe('AuthCookieService', () => {
  it('marks session cookies Secure when HTTPS is explicitly configured', () => {
    const service = new AuthCookieService(
      new ConfigService({ NODE_ENV: 'development', LIBIF_SESSION_COOKIE_SECURE: 'true' })
    );
    const response = { cookie: jest.fn() } as unknown as Response;
    const expiresAt = new Date('2026-08-14T00:00:00.000Z');

    service.setSessionCookie(response, 'token', expiresAt);

    expect(response.cookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      'token',
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'lax' })
    );
  });

  it('keeps the production default when no explicit override is configured', () => {
    const service = new AuthCookieService(new ConfigService({ NODE_ENV: 'production' }));
    const response = { clearCookie: jest.fn() } as unknown as Response;

    service.clearSessionCookie(response);

    expect(response.clearCookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.objectContaining({ secure: true })
    );
  });
});
