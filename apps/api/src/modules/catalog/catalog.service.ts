import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookStatus, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { mapPagedPublicBooks, mapPublicBookDetail } from './catalog.mapper';

type SortSpec = { [key: string]: 'asc' | 'desc' };

@Injectable()
export class CatalogService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({
      where: {
        books: {
          some: {
            status: BookStatus.PUBLISHED
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  listTags() {
    return this.prisma.tag.findMany({
      where: {
        books: {
          some: {
            book: { status: BookStatus.PUBLISHED }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getPublicBookDetail(documentId: string) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: documentId,
        status: BookStatus.PUBLISHED
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        authors: { include: { author: true } }
      }
    });

    if (!book) {
      throw new NotFoundException('Book not found or not published');
    }

    return mapPublicBookDetail(book);
  }

  async listPublicBooks(query: CatalogQueryDto = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: any = { status: BookStatus.PUBLISHED };
    const searchQuery = query.q?.trim();

    if (searchQuery) {
      const matchingBookIds = await this.findPublishedFullTextMatches(searchQuery);
      if (matchingBookIds.length === 0) {
        return mapPagedPublicBooks([], page, pageSize, 0);
      }
      where.id = { in: matchingBookIds };
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.tagIds) {
      const tagIds = query.tagIds.split(',').map((s) => s.trim()).filter(Boolean);
      if (tagIds.length) {
        where.tags = { some: { tagId: { in: tagIds } } };
      }
    }

    const ALLOWED_SORT_FIELDS = ['createdAt', 'title', 'publishedYear'];
    let orderBy: SortSpec = { createdAt: 'desc' };
    if (query.sort) {
      const [field, dir] = query.sort.split('_');
      if (field && ALLOWED_SORT_FIELDS.includes(field) && (dir === 'asc' || dir === 'desc')) {
        orderBy = { [field]: dir } as SortSpec;
      }
    }

    const totalCount = await this.prisma.book.count({ where });
    const books = await this.prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: { category: true, tags: { include: { tag: true } }, authors: { include: { author: true } } }
    });

    return mapPagedPublicBooks(books, page, pageSize, totalCount);
  }

  private async findPublishedFullTextMatches(searchQuery: string): Promise<string[]> {
    const matchingBooks = await this.prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`
        SELECT "id"
        FROM "Book"
        WHERE "status" = ${BookStatus.PUBLISHED}::"BookStatus"
          AND to_tsvector(
            'simple',
            "title" || ' ' || COALESCE("isbn", '') || ' ' || COALESCE("searchText", '')
          ) @@ websearch_to_tsquery('simple', ${searchQuery})
      `,
    );

    return matchingBooks.map((book) => book.id);
  }
}
