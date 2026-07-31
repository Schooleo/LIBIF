import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

export const SESSION_COOKIE_NAME = 'libif_session';

@Injectable()
export class AuthCookieService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  readSessionToken(request: Request): string | undefined {
    return parseCookieHeader(request.headers.cookie)[SESSION_COOKIE_NAME];
  }

  setSessionCookie(response: Response, token: string, expiresAt: Date): void {
    response.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
      domain: this.cookieDomain()
    });
  }

  clearSessionCookie(response: Response): void {
    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: 'lax',
      path: '/',
      domain: this.cookieDomain()
    });
  }

  private cookieDomain(): string | undefined {
    const domain = this.config.get<string>('LIBIF_SESSION_COOKIE_DOMAIN')?.trim();
    return domain || undefined;
  }

  private isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }
}

function parseCookieHeader(header?: string): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf('=');
        if (separatorIndex === -1) return [part, ''];
        const name = part.slice(0, separatorIndex);
        const value = part.slice(separatorIndex + 1);
        return [name, safeDecodeCookieValue(value)];
      })
  );
}

function safeDecodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
