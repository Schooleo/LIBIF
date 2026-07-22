import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { ReaderLibraryFilter } from './dto/reader-library-query.dto';
import { ReaderService } from './reader.service';

/** Helper: build a minimal published book row with per-user relations. */
function makeBook(id: string, opts: { bookmarked?: boolean; progress?: { currentPage: number; totalPages: number; percentage: number; lastReadAt: Date } } = {}) {
  return {
    id,
    title: `Sample Book ${id}`,
    subtitle: null,
    status: 'PUBLISHED',
    publisher: null,
    publishedYear: null,
    updatedAt: new Date(),
    authors: [{ author: { name: 'Test Author' } }],
    bookmarks: opts.bookmarked ? [{ id: 'bm-1' }] : [],
    readingProgress: opts.progress
      ? [{ currentPage: opts.progress.currentPage, totalPages: opts.progress.totalPages, percentage: opts.progress.percentage, lastReadAt: opts.progress.lastReadAt }]
      : [],
  };
}

describe('ReaderService (Prisma-backed)', () => {
  let service: ReaderService;
  let prisma: {
    book: { findMany: jest.Mock; findUnique: jest.Mock };
    bookmark: { upsert: jest.Mock; delete: jest.Mock; findMany: jest.Mock };
    readingProgress: { upsert: jest.Mock; findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      book: {
        findMany: jest.fn().mockResolvedValue([
          makeBook('book-1'),
          makeBook('book-2'),
        ]),
        findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
          if (id === 'book-1' || id === 'book-2') {
            return Promise.resolve({ id, title: 'Sample Book', status: 'PUBLISHED' });
          }
          return Promise.resolve(null);
        }),
      },
      bookmark: {
        upsert: jest.fn().mockResolvedValue({ id: 'bm-new', userId: 'user-1', bookId: 'book-1' }),
        delete: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
      },
      readingProgress: {
        upsert: jest.fn().mockImplementation(({ create }) =>
          Promise.resolve({
            currentPage: create.currentPage,
            totalPages: create.totalPages,
            percentage: create.percentage,
            lastReadAt: create.lastReadAt,
            status: create.status,
          }),
        ),
        findMany: jest.fn().mockResolvedValue([]),
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

  // ── Library ──────────────────────────────────────────────────────────────

  it('should return reader library items from Prisma', async () => {
    const res = await service.getLibrary('user-1', { filter: ReaderLibraryFilter.ALL });
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(2);
    expect(res.items[0].bookmarked).toBe(false);
    expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
  });

  it('should reflect bookmarked=true when Prisma bookmark relation is non-empty', async () => {
    prisma.book.findMany.mockResolvedValueOnce([
      makeBook('book-1', { bookmarked: true }),
      makeBook('book-2'),
    ]);
    const res = await service.getLibrary('user-1', {});
    expect(res.items[0].bookmarked).toBe(true);
    expect(res.bookmarkedCount).toBe(1);
  });

  it('should reflect reading progress when Prisma readingProgress relation is non-empty', async () => {
    prisma.book.findMany.mockResolvedValueOnce([
      makeBook('book-1', { progress: { currentPage: 10, totalPages: 100, percentage: 10, lastReadAt: new Date() } }),
    ]);
    const res = await service.getLibrary('user-1', {});
    expect(res.readingCount).toBe(1);
    expect(res.items[0].progress?.currentPage).toBe(10);
  });

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  it('should add a bookmark via Prisma upsert (idempotent)', async () => {
    const result = await service.addBookmark('user-1', { documentId: 'book-1' });
    expect(result.success).toBe(true);
    expect(result.documentId).toBe('book-1');
    expect(prisma.bookmark.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } } }),
    );
  });

  it('should throw NotFoundException when adding a bookmark for a non-existent document', async () => {
    await expect(service.addBookmark('user-1', { documentId: 'invalid-id' })).rejects.toThrow(NotFoundException);
    expect(prisma.bookmark.upsert).not.toHaveBeenCalled();
  });

  it('should remove a bookmark via Prisma delete', async () => {
    const result = await service.removeBookmark('user-1', 'book-1');
    expect(result.success).toBe(true);
    expect(prisma.bookmark.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } } }),
    );
  });

  it('should succeed silently when removing a bookmark that does not exist (idempotent DELETE)', async () => {
    prisma.bookmark.delete.mockRejectedValueOnce(new Error('Record not found'));
    const result = await service.removeBookmark('user-1', 'nonexistent');
    expect(result.success).toBe(true);
  });

  // ── Reading Progress ───────────────────────────────────────────────────────

  it('should upsert reading progress and return the progress DTO', async () => {
    const progress = await service.updateProgress('user-1', 'book-1', { currentPage: 10, totalPages: 100 });
    expect(progress.currentPage).toBe(10);
    expect(progress.percentage).toBe(10);
    expect(prisma.readingProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } },
        create: expect.objectContaining({ currentPage: 10, totalPages: 100, percentage: 10 }),
        update: expect.objectContaining({ currentPage: 10, totalPages: 100, percentage: 10 }),
      }),
    );
  });

  it('should mark status COMPLETED when percentage reaches 100', async () => {
    prisma.readingProgress.upsert.mockImplementationOnce(({ create }: { create: { status: string; currentPage: number; totalPages: number; percentage: number; lastReadAt: Date } }) =>
      Promise.resolve({ ...create }),
    );
    const progress = await service.updateProgress('user-1', 'book-1', { currentPage: 100, totalPages: 100 });
    expect(progress.percentage).toBe(100);
    expect(prisma.readingProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ status: 'COMPLETED', percentage: 100 }),
      }),
    );
  });

  it('should throw NotFoundException for non-existent document in updateProgress', async () => {
    await expect(service.updateProgress('user-1', 'invalid-id', { currentPage: 10, totalPages: 100 })).rejects.toThrow(NotFoundException);
    expect(prisma.readingProgress.upsert).not.toHaveBeenCalled();
  });

  // ── History ────────────────────────────────────────────────────────────────

  it('should return empty history when no progress records exist', async () => {
    prisma.readingProgress.findMany.mockResolvedValueOnce([]);
    const history = await service.getHistory('user-1');
    expect(history).toEqual([]);
  });

  it('should return history mapped from Prisma readingProgress records filtering by PUBLISHED status', async () => {
    prisma.readingProgress.findMany.mockResolvedValueOnce([
      {
        currentPage: 15,
        totalPages: 150,
        percentage: 10,
        lastReadAt: new Date('2026-07-01'),
        book: {
          id: 'book-1',
          title: 'Sample Book book-1',
          subtitle: null,
          status: 'PUBLISHED',
          publisher: null,
          publishedYear: null,
          updatedAt: new Date(),
          authors: [{ author: { name: 'Test Author' } }],
          bookmarks: [],
        },
      },
    ]);
    const history = await service.getHistory('user-1');
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('book-1');
    expect(history[0].progress?.currentPage).toBe(15);
    expect(prisma.readingProgress.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          book: { status: 'PUBLISHED' },
        }),
      }),
    );
  });

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  it('should return bookmarks mapped from Prisma filtering by PUBLISHED status', async () => {
    prisma.bookmark.findMany.mockResolvedValueOnce([
      {
        createdAt: new Date('2026-07-01'),
        book: {
          id: 'book-2',
          title: 'Bookmarked Book',
          subtitle: null,
          status: 'PUBLISHED',
          publisher: null,
          publishedYear: null,
          updatedAt: new Date(),
          authors: [],
          readingProgress: [],
        },
      },
    ]);
    const bookmarks = await service.getBookmarks('user-1');
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0].id).toBe('book-2');
    expect(prisma.bookmark.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          book: { status: 'PUBLISHED' },
        }),
      }),
    );
  });
});
