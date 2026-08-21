import { headers } from 'next/headers';
import { createLibifApiClient, apiErrorMessage } from './api-client';
import type {
  AccessDecisionDto,
  AdminBookListItemDto,
  DocumentDetailResponseDto,
  DocumentListQuery,
  GeneralSettingsResponseDto,
  LibrarianDashboardSummaryDto,
  ManagementDashboardSummaryDto,
  NotificationResponseDto,
  OperationsReportRangeQuery,
  PagedBookListDto,
  PagedDocumentListResponseDto,
  PublicBookDetailDto,
  ReaderAccessReportQuery,
  ReaderAccessReportResponseDto,
  ReaderDocumentStateDto,
  ReaderLibraryItemDto,
  ReaderLibraryResponseDto,
  SessionDto,
  TaxonomyCategoryDto,
  TaxonomyTagDto,
  UnreadNotificationCountDto,
  UserDetailResponseDto,
  UserListQuery,
  UserListResponseDto,
} from './api-types';
import { getDevAuthHeaders } from './auth/session';

type ReaderLibraryQuery = { filter?: 'ALL' | 'READING' | 'BOOKMARKED' | 'COMPLETED'; search?: string; page?: number; limit?: number };
export type PublicCatalogQuery = { q?: string; categoryId?: string; tagIds?: string; sort?: string; page?: number; pageSize?: number };

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

export async function fetchTaxonomyCategories(): Promise<TaxonomyCategoryDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/taxonomy/categories');
  if (error) throw new Error(apiErrorMessage(error, 'Taxonomy categories request failed'));
  return data;
}

export async function fetchTaxonomyTags(): Promise<TaxonomyTagDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/taxonomy/tags');
  if (error) throw new Error(apiErrorMessage(error, 'Taxonomy tags request failed'));
  return data;
}

export async function fetchPublicCategories(): Promise<TaxonomyCategoryDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/categories');
  if (error) throw new Error(apiErrorMessage(error, 'Public categories request failed'));
  return data;
}

export async function fetchPublicTags(): Promise<TaxonomyTagDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/tags');
  if (error) throw new Error(apiErrorMessage(error, 'Public tags request failed'));
  return data;
}

export async function fetchAdminBooks(): Promise<AdminBookListItemDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/books');
  if (error) throw new Error(apiErrorMessage(error, 'Admin books request failed'));
  return data;
}

export async function fetchPublicBooks(query?: PublicCatalogQuery): Promise<PagedBookListDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/catalog/books', { params: { query: query ?? {} } });
  if (error) throw new Error(apiErrorMessage(error, 'Catalog books request failed'));
  return data as PagedBookListDto;
}

export async function fetchPublicBookDetail(documentId: string): Promise<PublicBookDetailDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/catalog/books/{documentId}', {
    params: { path: { documentId } }
  });
  if (error) throw new Error(apiErrorMessage(error, 'Public book detail request failed'));
  return data;
}

export async function fetchLibrarianDashboardSummary(): Promise<LibrarianDashboardSummaryDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/dashboard/librarian', { params: { query: {} } });
  if (error) throw new Error(apiErrorMessage(error, 'Dashboard summary request failed'));
  return data;
}

export async function fetchUnreadNotificationCount(): Promise<UnreadNotificationCountDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/notifications/unread-count');
  if (error) throw new Error(apiErrorMessage(error, 'Unread notifications request failed'));
  return data;
}

export async function fetchAccessDecision(documentId: string): Promise<AccessDecisionDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/access/documents/{documentId}/decision', {
    params: { path: { documentId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Access decision request failed'));
  return data as AccessDecisionDto;
}

export async function fetchReaderDocumentState(documentId: string): Promise<ReaderDocumentStateDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/reader/documents/{documentId}/state', {
    params: { path: { documentId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Reader state request failed'));
  return data;
}

export async function fetchAdminUsers(query?: UserListQuery): Promise<UserListResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/users', {
    params: { query: query ?? {} },
  });
  if (error) throw new Error(apiErrorMessage(error, 'User administration list request failed'));
  return data;
}

export async function fetchAdminUserDetail(userId: string): Promise<UserDetailResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/users/{userId}', {
    params: { path: { userId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'User administration detail request failed'));
  return data;
}

export async function fetchManagementDashboardSummary(
  query?: OperationsReportRangeQuery,
): Promise<ManagementDashboardSummaryDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/dashboard/management', {
    params: { query: query ?? {} },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Management dashboard request failed'));
  return data;
}

export async function fetchReaderAccessReport(
  query?: ReaderAccessReportQuery,
): Promise<ReaderAccessReportResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/reports/reader-access', {
    params: { query: query ?? {} },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Reader access report request failed'));
  return data;
}

export async function fetchGeneralSettings(): Promise<GeneralSettingsResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/admin/settings/general');
  if (error) throw new Error(apiErrorMessage(error, 'General settings request failed'));
  return data;
}

export async function fetchReaderLibrary(query?: ReaderLibraryQuery): Promise<ReaderLibraryResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/reader/library', {
    params: { query: query ?? {} },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Reader library request failed'));
  return data as ReaderLibraryResponseDto;
}

export async function fetchReaderHistory(): Promise<ReaderLibraryItemDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/reader/history');
  if (error) throw new Error(apiErrorMessage(error, 'Reader history request failed'));
  return data as ReaderLibraryItemDto[];
}

export async function fetchReaderBookmarks(): Promise<ReaderLibraryItemDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/reader/bookmarks');
  if (error) throw new Error(apiErrorMessage(error, 'Reader bookmarks request failed'));
  return data as ReaderLibraryItemDto[];
}

export async function fetchAdminDocuments(query?: DocumentListQuery): Promise<PagedDocumentListResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/documents', { params: { query: query ?? {} } });
  if (error) throw new Error(apiErrorMessage(error, 'Admin documents request failed'));
  return data;
}

export async function fetchDocumentDetail(id: string): Promise<DocumentDetailResponseDto> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/documents/{id}', { params: { path: { id } } });
  if (error) throw new Error(apiErrorMessage(error, 'Document detail request failed'));
  return data;
}

export async function fetchMyNotifications(): Promise<NotificationResponseDto[]> {
  const client = await createServerClient();
  const { data, error } = await client.GET('/api/notifications', { params: { query: {} } });
  if (error) throw new Error(apiErrorMessage(error, 'Notifications request failed'));
  return data;
}
