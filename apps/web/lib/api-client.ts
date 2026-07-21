import createClient from 'openapi-fetch';
import type { paths } from './generated/api-types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    const serverUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001';
    return serverUrl.replace('//localhost:', '//127.0.0.1:');
  }
  return API_BASE_URL;
}

export function createLibifApiClient(headers: Record<string, string> = {}) {
  return createClient<paths>({
    baseUrl: getApiBaseUrl(),
    credentials: 'include',
    headers,
    fetch: (input: any, init?: any) => fetch(input, { ...init, cache: 'no-store' }),
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
