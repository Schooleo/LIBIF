import type {
  AdminBookListItemDto,
  AuthorDto,
  BookFileSummaryDto,
  CategoryDto,
  PagedDto,
  PublicBookDetailDto,
  PublicBookListItemDto,
  TagDto
} from '@libif/shared';

type BookRecord = {
  id: string;
  isbn: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  publisher?: string | null;
  publishedYear?: number | null;
  language?: string | null;
  status: string;
  category: { id: string; name: string; slug: string; parentId: string | null } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
  authors: Array<{ author: { id: string; name: string } }>;
  files?: Array<{
    id: string;
    originalFilename: string;
    sizeBytes: bigint;
  }>;
  createdAt: Date;
};

export function mapCategory(category: { id: string; name: string; slug: string; parentId: string | null }): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId
  };
}

function mapTags(tags: BookRecord['tags']): TagDto[] {
  return tags.map(({ tag }) => ({ id: tag.id, name: tag.name, slug: tag.slug }));
}

function mapAuthors(authors: BookRecord['authors']): AuthorDto[] {
  return authors.map(({ author }) => ({ id: author.id, name: author.name }));
}

function mapFile(files: NonNullable<BookRecord['files']>): BookFileSummaryDto | null {
  const file = files[0];
  if (!file) return null;
  return {
    id: file.id,
    originalFilename: file.originalFilename,
    sizeBytes: file.sizeBytes.toString()
  };
}

function mapBaseBook(book: BookRecord): Omit<PublicBookListItemDto, 'createdAt'> & { createdAt: string } {
  return {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    status: book.status as PublicBookListItemDto['status'],
    category: book.category ? mapCategory(book.category) : null,
    tags: mapTags(book.tags),
    authors: mapAuthors(book.authors),
    createdAt: book.createdAt.toISOString()
  };
}

export function mapPublicBook(book: BookRecord): PublicBookListItemDto {
  return mapBaseBook(book);
}

export function mapPublicBookDetail(book: BookRecord): PublicBookDetailDto {
  return {
    ...mapBaseBook(book),
    subtitle: book.subtitle ?? null,
    description: book.description ?? null,
    publisher: book.publisher ?? null,
    publishedYear: book.publishedYear ?? null,
    language: book.language ?? null
  };
}

export function mapAdminBook(book: BookRecord): AdminBookListItemDto {
  return {
    ...mapBaseBook(book),
    file: mapFile(book.files ?? [])
  };
}

export function mapPagedPublicBooks(items: BookRecord[], page: number, pageSize: number, totalCount: number): PagedDto<PublicBookListItemDto> {
  return {
    items: items.map(mapPublicBook),
    totalCount,
    page,
    pageSize
  };
}

