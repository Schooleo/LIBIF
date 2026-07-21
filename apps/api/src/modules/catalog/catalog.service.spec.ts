import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../database/prisma.service';
import { BookStatus } from '../../generated/prisma/client';

describe('CatalogService', () => {
  let service: CatalogService;
  let prisma: {
    category: { findMany: jest.Mock };
    book: { count: jest.Mock; findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      category: { findMany: jest.fn().mockResolvedValue([]) },
      book: { count: jest.fn().mockResolvedValue(0), findMany: jest.fn().mockResolvedValue([]) }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('lists public categories sorted by name', async () => {
    prisma.category.findMany.mockResolvedValue([
      { id: 'cat-1', name: 'Computer Science', slug: 'computer-science', parentId: null }
    ]);

    const res = await service.listCategories();
    expect(res).toHaveLength(1);
    expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
  });

  it('lists public books with default pagination and filter', async () => {
    const dummyBook = {
      id: 'b-1',
      title: 'Design Patterns',
      isbn: '9780201633610',
      status: BookStatus.PUBLISHED,
      category: { id: 'c-1', name: 'Software', slug: 'software', parentId: null },
      tags: [],
      authors: [],
      createdAt: new Date('2026-07-21T00:00:00Z')
    };
    prisma.book.count.mockResolvedValue(1);
    prisma.book.findMany.mockResolvedValue([dummyBook]);

    const result = await service.listPublicBooks({ q: 'Design', categoryId: 'c-1', page: 1, pageSize: 10, sort: 'title_asc' });

    expect(result).toMatchObject({
      totalCount: 1,
      page: 1,
      pageSize: 10,
      items: expect.arrayContaining([expect.objectContaining({ id: 'b-1', title: 'Design Patterns' })])
    });

    expect(prisma.book.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        orderBy: { title: 'asc' },
        where: expect.objectContaining({
          status: BookStatus.PUBLISHED,
          categoryId: 'c-1'
        })
      })
    );
  });

  it('handles tag filtering and invalid sort fallback', async () => {
    await service.listPublicBooks({ tagIds: 'tag1, tag2', sort: 'invalidField_asc' });

    expect(prisma.book.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
        where: expect.objectContaining({
          tags: { some: { tagId: { in: ['tag1', 'tag2'] } } }
        })
      })
    );
  });
});
