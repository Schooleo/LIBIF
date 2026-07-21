import { API_BASE_URL, createLibifApiClient, apiErrorMessage } from './api-client';
import type { AuthMessageDto, CreateBookIntakeDto, CreateBookIntakeResponse, IsbnLookupResponse, PasswordResetDto, PasswordResetRequestDto, RegisterRequestDto, SessionDto, SignInRequestDto } from './api-types';
import { getDevAuthHeaders } from './auth/session';

const client = createLibifApiClient(getDevAuthHeaders());

export async function registerReader(payload: RegisterRequestDto): Promise<SessionDto> {
  const { data, error } = await client.POST('/api/auth/register', { body: payload });
  if (error) throw new Error(apiErrorMessage(error, 'Registration failed'));
  return data;
}

export async function signIn(payload: SignInRequestDto): Promise<SessionDto> {
  const { data, error } = await client.POST('/api/auth/sign-in', { body: payload });
  if (error) throw new Error(apiErrorMessage(error, 'Sign in failed'));
  return data;
}

export async function signOut(): Promise<AuthMessageDto> {
  const { data, error } = await client.POST('/api/auth/sign-out');
  if (error) throw new Error(apiErrorMessage(error, 'Sign out failed'));
  return data;
}

export async function requestPasswordReset(payload: PasswordResetRequestDto): Promise<AuthMessageDto> {
  const { data, error } = await client.POST('/api/auth/password-reset-requests', { body: payload });
  if (error) throw new Error(apiErrorMessage(error, 'Password reset request failed'));
  return data;
}

export async function resetPassword(payload: PasswordResetDto): Promise<AuthMessageDto> {
  const { data, error } = await client.POST('/api/auth/password-resets', { body: payload });
  if (error) throw new Error(apiErrorMessage(error, 'Password reset failed'));
  return data;
}

export async function lookupIsbn(isbn: string): Promise<IsbnLookupResponse> {
  const { data, error } = await client.GET('/api/isbn/{isbn}', { params: { path: { isbn } } });
  if (error) throw new Error(apiErrorMessage(error, 'ISBN lookup failed'));
  return data;
}

export function uploadBookIntake(file: File, metadata: CreateBookIntakeDto, onProgress: (progress: number) => void): Promise<CreateBookIntakeResponse> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(metadata));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/admin/books/intake`);
    for (const [name, value] of Object.entries(getDevAuthHeaders())) xhr.setRequestHeader(name, value);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) resolve(payload as CreateBookIntakeResponse);
        else reject(new Error(apiErrorMessage(payload, 'Upload failed')));
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

export async function fetchViewToken(documentId: string): Promise<{ url: string; token: string; expiresAt: string }> {
  const { data, error } = await client.POST('/api/access/documents/{documentId}/view-token', {
    params: { path: { documentId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'View token request failed'));
  return data as { url: string; token: string; expiresAt: string };
}

export async function fetchDownloadToken(documentId: string): Promise<{ url: string; token: string; expiresAt: string }> {
  const { data, error } = await client.POST('/api/access/documents/{documentId}/download-token', {
    params: { path: { documentId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Download token request failed'));
  return data as { url: string; token: string; expiresAt: string };
}

export async function addBookmark(documentId: string): Promise<{ success: boolean }> {
  const { data, error } = await client.POST('/api/reader/bookmarks', {
    body: { documentId },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Add bookmark failed'));
  return data as { success: boolean };
}

export async function removeBookmark(documentId: string): Promise<{ success: boolean }> {
  const { data, error } = await client.DELETE('/api/reader/bookmarks/{documentId}', {
    params: { path: { documentId } },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Remove bookmark failed'));
  return data as { success: boolean };
}

export async function updateReadingProgress(documentId: string, page: number, totalPages: number): Promise<any> {
  const { data, error } = await client.PATCH('/api/reader/progress/{documentId}', {
    params: { path: { documentId } },
    body: { currentPage: page, totalPages },
  });
  if (error) throw new Error(apiErrorMessage(error, 'Update progress failed'));
  return data;
}

