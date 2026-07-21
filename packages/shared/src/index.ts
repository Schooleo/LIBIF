export type BookStatus = 'DRAFT' | 'PENDING_PROCESSING' | 'PROCESSING' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED';

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

export type TagDto = {
  id: string;
  name: string;
  slug: string;
};

export type AuthorDto = {
  id: string;
  name: string;
};

export type BookFileSummaryDto = {
  id: string;
  originalFilename: string;
  sizeBytes: string;
};

export type PagedDto<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type BookListItemBaseDto = {
  id: string;
  title: string;
  isbn?: string | null;
  status: BookStatus;
  category?: CategoryDto | null;
  tags: TagDto[];
  authors: AuthorDto[];
  createdAt: string;
};

export type PublicBookListItemDto = BookListItemBaseDto;

export type AdminBookListItemDto = BookListItemBaseDto & {
  file?: BookFileSummaryDto | null;
};

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

export type CreateBookIntakeResponse = {
  book: { id: string; title: string; status: BookStatus };
  file: { id: string; originalFilename: string; sizeBytes: string };
  processingJob: { id: string; status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' };
};

export type IsbnLookupResponse = {
  found: boolean;
  metadata?: Partial<CreateBookIntakeDto>;
  message?: string;
};
