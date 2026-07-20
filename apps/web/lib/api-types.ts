import type { components } from './generated/api-types';

export type SessionDto = components['schemas']['SessionDto'];
export type SessionUserDto = components['schemas']['SessionUserDto'];
export type CategoryDto = components['schemas']['CategoryResponseDto'];
export type BookListItemDto = components['schemas']['BookListItemResponseDto'];
export type CreateBookIntakeResponse = components['schemas']['CreateBookIntakeResponseDto'];
export type IsbnLookupResponse = components['schemas']['IsbnLookupResponseDto'];

export type CreateBookIntakeDto = {
  isbn?: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedYear?: number;
  description?: string;
  language?: string;
  categoryId?: string;
  tags: string[];
};
