import type { components } from './generated/api-types';
import type {
  AdminBookListItemDto as SharedAdminBookListItemDto,
  CategoryDto as SharedCategoryDto,
  PagedDto as SharedPagedDto,
  PublicBookListItemDto as SharedPublicBookListItemDto
} from '@libif/shared';

export type SessionDto = components['schemas']['SessionDto'];
export type SessionUserDto = components['schemas']['SessionUserDto'];
export type AuthMessageDto = components['schemas']['AuthMessageDto'];
export type RegisterRequestDto = components['schemas']['RegisterRequestDto'];
export type SignInRequestDto = components['schemas']['SignInRequestDto'];
export type PasswordResetRequestDto = components['schemas']['PasswordResetRequestDto'];
export type PasswordResetDto = components['schemas']['PasswordResetDto'];
export type CreateBookIntakeResponse = components['schemas']['CreateBookIntakeResponseDto'];
export type IsbnLookupResponse = components['schemas']['IsbnLookupResponseDto'];

export type PublicBookListItemDto = SharedPublicBookListItemDto;
export type AdminBookListItemDto = SharedAdminBookListItemDto;
export type BookListItemDto = SharedPublicBookListItemDto;
export type PagedBookListDto = SharedPagedDto<SharedPublicBookListItemDto>;
export type CategoryDto = SharedCategoryDto;

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
