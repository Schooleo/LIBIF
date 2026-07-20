import createClient from 'openapi-fetch';
import type { paths } from './generated/api-types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export function createLibifApiClient(headers: Record<string, string> = {}) {
  return createClient<paths>({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    headers,
    fetch: (request) => fetch(request, { cache: 'no-store' })
  });
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const value = (error as { message?: unknown }).message;
    if (Array.isArray(value)) return value.join('; ');
    if (typeof value === 'string' && value) return value;
  }
  return fallback;
}
