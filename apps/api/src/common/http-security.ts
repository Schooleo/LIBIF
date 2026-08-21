import type { ConfigService } from '@nestjs/config';

type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

export const API_SECURITY_HEADERS = Object.freeze({
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
});

export function configuredWebOrigins(config: ConfigService): ReadonlySet<string> {
  const configuredValues = [
    config.get<string>('LIBIF_WEB_BASE_URL'),
    ...(config.get<string>('LIBIF_CORS_ORIGINS') ?? '').split(',')
  ];

  return new Set(configuredValues.flatMap((value) => {
    const origin = normalizeHttpOrigin(value);
    return origin ? [origin] : [];
  }));
}

export function createCorsOriginValidator(
  allowedOrigins: ReadonlySet<string>
): (origin: string | undefined, callback: CorsOriginCallback) => void {
  return (origin, callback) => {
    // Requests without Origin are server-to-server or same-origin requests.
    if (!origin) {
      callback(null, true);
      return;
    }
    callback(null, allowedOrigins.has(normalizeHttpOrigin(origin) ?? ''));
  };
}

function normalizeHttpOrigin(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
