import { Inject, Injectable } from '@nestjs/common';
import { BookStatus } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { mapPagedPublicBooks } from './catalog.mapper';

type SortSpec = { [key: string]: 'asc' | 'desc' };

@Injectable()
export class CatalogService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async listPublicBooks(query: CatalogQueryDto = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: any = { status: BookStatus.PUBLISHED };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { isbn: { contains: query.q } }
      ];
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

    const [totalCount, books] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: { category: true, tags: { include: { tag: true } }, authors: { include: { author: true } } }
      })
    ]);

    return mapPagedPublicBooks(books, page, pageSize, totalCount);
  }
}
