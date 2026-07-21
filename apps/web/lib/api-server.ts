import { headers } from 'next/headers';
import { createLibifApiClient, apiErrorMessage } from './api-client';
import type { AdminBookListItemDto, CategoryDto, PagedBookListDto, PublicBookListItemDto, SessionDto } from './api-types';
import { getDevAuthHeaders } from './auth/session';

async function createServerClient() {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  return createLibifApiClient({ ...getDevAuthHeaders(), ...(cookie ? { cookie } : {}) });
}

export async function fetchSession(): Promise<SessionDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/auth/session');
  if (error) throw new Error(apiErrorMessage(error, 'Session request failed'));
  return data;
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/categories');
  if (error) throw new Error(apiErrorMessage(error, 'Categories request failed'));
  return data;
}

export async function fetchAdminBooks(): Promise<AdminBookListItemDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/books');
  if (error) throw new Error(apiErrorMessage(error, 'Admin books request failed'));
  return data;
}

export async function fetchPublicBooks(): Promise<PublicBookListItemDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/catalog/books');
  if (error) throw new Error(apiErrorMessage(error, 'Catalog books request failed'));
  return (data as PagedBookListDto).items;
}
