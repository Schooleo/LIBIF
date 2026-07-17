import type { BookListItemDto, CategoryDto, CreateBookIntakeDto, CreateBookIntakeResponse, IsbnLookupResponse } from '@libif/shared';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const message = Array.isArray(error.message) ? error.message.join('; ') : error.message;
    throw new Error(message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  return parseResponse<CategoryDto[]>(await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' }));
}

export async function fetchAdminBooks(): Promise<BookListItemDto[]> {
  return parseResponse<BookListItemDto[]>(await fetch(`${API_BASE_URL}/api/admin/books`, { cache: 'no-store' }));
}

export async function fetchPublicBooks(): Promise<BookListItemDto[]> {
  return parseResponse<BookListItemDto[]>(await fetch(`${API_BASE_URL}/api/catalog/books`, { cache: 'no-store' }));
}

export async function lookupIsbn(isbn: string): Promise<IsbnLookupResponse> {
  return parseResponse<IsbnLookupResponse>(await fetch(`${API_BASE_URL}/api/isbn/${encodeURIComponent(isbn)}`));
}

export function uploadBookIntake(file: File, metadata: CreateBookIntakeDto, onProgress: (progress: number) => void): Promise<CreateBookIntakeResponse> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(metadata));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/admin/books/intake`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) resolve(payload as CreateBookIntakeResponse);
        else reject(new Error(payload.message ?? 'Upload failed'));
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}
