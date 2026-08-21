import { ConfigService } from '@nestjs/config';
import {
  API_SECURITY_HEADERS,
  configuredWebOrigins,
  createCorsOriginValidator
} from './http-security';

describe('HTTP security configuration', () => {
  it('allows only explicitly configured web origins', () => {
    const config = new ConfigService({
      LIBIF_WEB_BASE_URL: 'https://library.example.edu/',
      LIBIF_CORS_ORIGINS: 'https://preview.example.edu, http://localhost:3000/path'
    });
    const origins = configuredWebOrigins(config);

    expect(origins).toEqual(new Set([
      'https://library.example.edu',
      'https://preview.example.edu',
      'http://localhost:3000'
    ]));
    expect(validateOrigin(origins, 'https://library.example.edu')).toBe(true);
    expect(validateOrigin(origins, 'https://attacker.example')).toBe(false);
  });

  it('allows same-origin and server-to-server requests without reflecting arbitrary origins', () => {
    const origins = new Set(['https://library.example.edu']);

    expect(validateOrigin(origins, undefined)).toBe(true);
    expect(validateOrigin(origins, 'not a URL')).toBe(false);
    expect(validateOrigin(origins, 'file:///tmp/request')).toBe(false);
  });

  it('defines browser hardening headers without exposing framework details', () => {
    expect(API_SECURITY_HEADERS).toMatchObject({
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    });
  });
});

function validateOrigin(origins: ReadonlySet<string>, origin: string | undefined): boolean {
  let allowed = false;
  createCorsOriginValidator(origins)(origin, (_error, value) => {
    allowed = value === true;
  });
  return allowed;
}
