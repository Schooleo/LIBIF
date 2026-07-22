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
export type LibrarianDashboardSummaryDto = components['schemas']['LibrarianDashboardSummaryDto'];
export type CreateBookIntakeResponse = components['schemas']['CreateBookIntakeResponseDto'];
export type IsbnLookupResponse = components['schemas']['IsbnLookupResponseDto'];
export type TaxonomyCategoryDto = components['schemas']['TaxonomyCategoryDto'];
export type TaxonomyTagDto = components['schemas']['TaxonomyTagDto'];
export type CreateTaxonomyCategoryDto = components['schemas']['CreateTaxonomyCategoryDto'];
export type UpdateTaxonomyCategoryDto = components['schemas']['UpdateTaxonomyCategoryDto'];
export type CreateTaxonomyTagDto = components['schemas']['CreateTaxonomyTagDto'];
export type UpdateTaxonomyTagDto = components['schemas']['UpdateTaxonomyTagDto'];

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

export type ReaderLibraryItemDto = components['schemas']['ReaderLibraryItemDto'];
export type ReaderLibraryResponseDto = components['schemas']['ReaderLibraryResponseDto'];
export type ReadingProgressStateDto = components['schemas']['ReadingProgressStateDto'];
export type AccessDecisionDto = components['schemas']['AccessDecisionDto'];
export type ProtectedDocumentUrlDto = components['schemas']['ProtectedDocumentUrlDto'];
