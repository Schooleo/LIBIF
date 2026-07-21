import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { ReaderLibraryFilter } from './dto/reader-library-query.dto';
import { ReaderService } from './reader.service';

describe('ReaderService', () => {
  let service: ReaderService;
  let prisma: { book: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      book: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'book-1',
            title: 'Sample Book One',
            subtitle: 'Sub 1',
            status: 'PUBLISHED',
            publisher: 'Publisher 1',
            publishedYear: 2024,
            updatedAt: new Date(),
            authors: [{ author: { name: 'Author Alpha' } }],
          },
          {
            id: 'book-2',
            title: 'Sample Book Two',
            subtitle: null,
            status: 'PUBLISHED',
            publisher: null,
            publishedYear: null,
            updatedAt: new Date(),
            authors: [{ author: { name: 'Author Beta' } }],
          },
        ]),
        findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
          if (id === 'book-1' || id === 'book-2') {
            return Promise.resolve({ id, title: 'Sample Book', status: 'PUBLISHED' });
          }
          return Promise.resolve(null);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaderService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReaderService>(ReaderService);
  });

  it('should return reader library items', async () => {
    const res = await service.getLibrary('user-1', { filter: ReaderLibraryFilter.ALL });
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(2);
    expect(res.items[0].bookmarked).toBe(false);
  });

  it('should manage bookmarks correctly', async () => {
    await service.addBookmark('user-1', { documentId: 'book-1' });
    let bookmarks = await service.getBookmarks('user-1');
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0].id).toBe('book-1');

    await service.removeBookmark('user-1', 'book-1');
    bookmarks = await service.getBookmarks('user-1');
    expect(bookmarks.length).toBe(0);
  });

  it('should update and retrieve reading progress', async () => {
    const progress = await service.updateProgress('user-1', 'book-1', { currentPage: 10, totalPages: 100 });
    expect(progress.currentPage).toBe(10);
    expect(progress.percentage).toBe(10);

    const history = await service.getHistory('user-1');
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('book-1');
  });

  it('should throw NotFoundException for non-existent document in addBookmark', async () => {
    await expect(service.addBookmark('user-1', { documentId: 'invalid-id' })).rejects.toThrow(NotFoundException);
  });
});
