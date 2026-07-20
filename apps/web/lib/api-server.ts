import { createLibifApiClient, apiErrorMessage } from './api-client';
import type { BookListItemDto, CategoryDto, SessionDto } from './api-types';
import { getDevAuthHeaders } from './auth/session';

const client = createLibifApiClient(getDevAuthHeaders());

export async function fetchSession(): Promise<SessionDto> {
  const { data, error } = await client.GET('/api/auth/session');
  if (error) throw new Error(apiErrorMessage(error, 'Session request failed'));
  return data;
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const { data, error } = await client.GET('/api/categories');
  if (error) throw new Error(apiErrorMessage(error, 'Categories request failed'));
  return data;
}

export async function fetchAdminBooks(): Promise<BookListItemDto[]> {
  const { data, error } = await client.GET('/api/admin/books');
  if (error) throw new Error(apiErrorMessage(error, 'Admin books request failed'));
  return data;
}

export async function fetchPublicBooks(): Promise<BookListItemDto[]> {
  const { data, error } = await client.GET('/api/catalog/books');
  if (error) throw new Error(apiErrorMessage(error, 'Catalog books request failed'));
  return data;
}
