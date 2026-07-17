import { Injectable } from '@nestjs/common';
import { BookStatus } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async listPublicBooks() {
    const books = await this.prisma.book.findMany({
      where: { status: BookStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      include: { category: true, tags: { include: { tag: true } }, authors: { include: { author: true } } }
    });
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      status: book.status,
      category: book.category,
      tags: book.tags.map(({ tag }) => tag),
      authors: book.authors.map(({ author }) => author),
      createdAt: book.createdAt.toISOString()
    }));
  }
}
