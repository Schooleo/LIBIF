export type BookStatus = 'DRAFT' | 'PENDING_PROCESSING' | 'PROCESSING' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED';

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

export type CategoryDto = { id: string; name: string; slug: string; parentId?: string | null };
export type BookListItemDto = {
  id: string;
  title: string;
  isbn?: string | null;
  status: BookStatus;
  category?: CategoryDto | null;
  tags: { id: string; name: string; slug: string }[];
  authors: { id: string; name: string }[];
  file?: { id: string; originalFilename: string; sizeBytes: string } | null;
  createdAt: string;
};
