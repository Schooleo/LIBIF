import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { ReaderLibraryFilter, ReaderLibraryQueryDto } from './dto/reader-library-query.dto';
import { ReaderLibraryItemDto, ReaderLibraryResponseDto, ReadingProgressStateDto } from './dto/reader-library-item.dto';
import { ReadingProgressDto } from './dto/reading-progress.dto';

@Injectable()
export class ReaderService {
  constructor(private readonly prisma: PrismaService) {}

  async getLibrary(userId: string, query: ReaderLibraryQueryDto = {}): Promise<ReaderLibraryResponseDto> {
    const { filter = ReaderLibraryFilter.ALL, search, page = 1, limit = 20 } = query;

    // Fetch published books from Prisma
    const books = await this.prisma.book.findMany({
      where: {
        status: 'PUBLISHED',
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { authors: { some: { author: { name: { contains: search, mode: 'insensitive' } } } } },
              ],
            }
          : {}),
      },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        // Fetch only the current user's reading progress and bookmarks
        readingProgress: {
          where: { userId },
          take: 1,
        },
        bookmarks: {
          where: { userId },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    let allMappedItems: ReaderLibraryItemDto[] = books.map((book) => {
      const bookmarked = book.bookmarks.length > 0;
      const rp = book.readingProgress[0] ?? null;
      const progress: ReadingProgressStateDto | undefined = rp
        ? {
            currentPage: rp.currentPage,
            totalPages: rp.totalPages ?? 100,
            percentage: rp.percentage,
            lastReadAt: rp.lastReadAt.toISOString(),
          }
        : undefined;
      return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle ?? undefined,
        authors: book.authors.map((ba) => ba.author.name),
        publisher: book.publisher ?? undefined,
        publishedYear: book.publishedYear ?? undefined,
        status: book.status,
        bookmarked,
        progress,
        updatedAt: book.updatedAt.toISOString(),
      };
    });

    // Calculate metrics before filtering
    const readingCount = allMappedItems.filter((item) => item.progress && item.progress.percentage < 100).length;
    const bookmarkedCount = allMappedItems.filter((item) => item.bookmarked).length;

    // Apply filter
    if (filter === ReaderLibraryFilter.READING) {
      allMappedItems = allMappedItems.filter((item) => item.progress && item.progress.percentage < 100);
    } else if (filter === ReaderLibraryFilter.BOOKMARKED) {
      allMappedItems = allMappedItems.filter((item) => item.bookmarked);
    } else if (filter === ReaderLibraryFilter.COMPLETED) {
      allMappedItems = allMappedItems.filter((item) => item.progress && item.progress.percentage >= 100);
    }

    const total = allMappedItems.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = allMappedItems.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      readingCount,
      bookmarkedCount,
    };
  }

  async getHistory(userId: string): Promise<ReaderLibraryItemDto[]> {
    // Fetch all books the user has reading progress for, ordered by lastReadAt desc
    const progressRecords = await this.prisma.readingProgress.findMany({
      where: {
        userId,
        book: { status: 'PUBLISHED' },
      },
      orderBy: { lastReadAt: 'desc' },
      include: {
        book: {
          include: {
            authors: { include: { author: true } },
            bookmarks: { where: { userId }, take: 1 },
          },
        },
      },
    });

    return progressRecords.map((rp) => {
      const book = rp.book;
      return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle ?? undefined,
        authors: book.authors.map((ba) => ba.author.name),
        publisher: book.publisher ?? undefined,
        publishedYear: book.publishedYear ?? undefined,
        status: book.status,
        bookmarked: book.bookmarks.length > 0,
        progress: {
          currentPage: rp.currentPage,
          totalPages: rp.totalPages ?? 100,
          percentage: rp.percentage,
          lastReadAt: rp.lastReadAt.toISOString(),
        },
        updatedAt: book.updatedAt.toISOString(),
      };
    });
  }

  async getBookmarks(userId: string): Promise<ReaderLibraryItemDto[]> {
    const bookmarkRecords = await this.prisma.bookmark.findMany({
      where: {
        userId,
        book: { status: 'PUBLISHED' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          include: {
            authors: { include: { author: true } },
            readingProgress: { where: { userId }, take: 1 },
          },
        },
      },
    });

    return bookmarkRecords.map((bm) => {
      const book = bm.book;
      const rp = book.readingProgress[0] ?? null;
      return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle ?? undefined,
        authors: book.authors.map((ba) => ba.author.name),
        publisher: book.publisher ?? undefined,
        publishedYear: book.publishedYear ?? undefined,
        status: book.status,
        bookmarked: true,
        progress: rp
          ? {
              currentPage: rp.currentPage,
              totalPages: rp.totalPages ?? 100,
              percentage: rp.percentage,
              lastReadAt: rp.lastReadAt.toISOString(),
            }
          : undefined,
        updatedAt: book.updatedAt.toISOString(),
      };
    });
  }

  /**
   * A5-004: Add bookmark via Prisma upsert (idempotent — multiple calls do not duplicate).
   */
  async addBookmark(userId: string, dto: BookmarkDto): Promise<{ success: boolean; documentId: string }> {
    const book = await this.prisma.book.findUnique({ where: { id: dto.documentId } });
    if (!book) {
      throw new NotFoundException(`Document with ID ${dto.documentId} not found`);
    }
    await this.prisma.bookmark.upsert({
      where: { userId_bookId: { userId, bookId: dto.documentId } },
      create: { userId, bookId: dto.documentId },
      update: {},
    });
    return { success: true, documentId: dto.documentId };
  }

  /**
   * A5-004: Remove bookmark via Prisma delete (idempotent — missing bookmark does not throw).
   */
  async removeBookmark(userId: string, documentId: string): Promise<{ success: boolean; documentId: string }> {
    try {
      await this.prisma.bookmark.delete({
        where: { userId_bookId: { userId, bookId: documentId } },
      });
    } catch {
      // Bookmark may already not exist — treat as success for idempotent DELETE semantics.
    }
    return { success: true, documentId };
  }

  /**
   * A5-003: Upsert reading progress in the Prisma ReadingProgress table.
   * Automatically sets status to COMPLETED when percentage reaches 100.
   */
  async updateProgress(userId: string, documentId: string, dto: ReadingProgressDto): Promise<ReadingProgressStateDto> {
    const book = await this.prisma.book.findUnique({ where: { id: documentId } });
    if (!book) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
    const totalPages = dto.totalPages ?? 100;
    const percentage =
      dto.percentage !== undefined
        ? Math.min(100, Math.round(dto.percentage))
        : Math.min(100, Math.round((dto.currentPage / totalPages) * 100));
    const status = percentage >= 100 ? 'COMPLETED' : 'READING';

    const record = await this.prisma.readingProgress.upsert({
      where: { userId_bookId: { userId, bookId: documentId } },
      create: {
        userId,
        bookId: documentId,
        currentPage: dto.currentPage,
        totalPages,
        percentage,
        status,
        lastReadAt: new Date(),
      },
      update: {
        currentPage: dto.currentPage,
        totalPages,
        percentage,
        status,
        lastReadAt: new Date(),
      },
    });

    return {
      currentPage: record.currentPage,
      totalPages: record.totalPages ?? totalPages,
      percentage: record.percentage,
      lastReadAt: record.lastReadAt.toISOString(),
    };
  }
}
