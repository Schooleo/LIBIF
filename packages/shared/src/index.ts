export type BookStatus =
  | 'DRAFT'
  | 'PENDING_PROCESSING'
  | 'PROCESSING'
  | 'PENDING_APPROVAL'
  | 'CORRECTION_REQUIRED'
  | 'PUBLISHED'
  | 'REJECTED';

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

export type PublicBookDetailDto = PublicBookListItemDto & {
  subtitle?: string | null;
  description?: string | null;
  publisher?: string | null;
  publishedYear?: number | null;
  language?: string | null;
};

export type AdminBookListItemDto = BookListItemBaseDto & {
  file?: BookFileSummaryDto | null;
};

export type ReaderDocumentStateDto = {
  documentId: string;
  bookmarked: boolean;
  progress: {
    currentPage: number;
    totalPages?: number | null;
    percentage: number;
    status: 'READING' | 'COMPLETED';
    lastReadAt: string;
  } | null;
};

export type ProtectedPageDescriptorDto = {
  pageNumber: number;
  width: number;
  height: number;
};

export type ProtectedDocumentManifestDto = {
  documentId: string;
  pageCount: number;
  minZoom: number;
  maxZoom: number;
  pages: ProtectedPageDescriptorDto[];
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
