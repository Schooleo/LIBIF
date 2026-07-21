import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { ReaderLibraryFilter, ReaderLibraryQueryDto } from './dto/reader-library-query.dto';
import { ReaderLibraryItemDto, ReaderLibraryResponseDto, ReadingProgressStateDto } from './dto/reader-library-item.dto';
import { ReadingProgressDto } from './dto/reading-progress.dto';

@Injectable()
export class ReaderService {
  private readonly bookmarksMap = new Map<string, Set<string>>();
  private readonly progressMap = new Map<string, Map<string, ReadingProgressStateDto>>();

  constructor(private readonly prisma: PrismaService) {}

  async getLibrary(userId: string, query: ReaderLibraryQueryDto = {}): Promise<ReaderLibraryResponseDto> {
    const { filter = ReaderLibraryFilter.ALL, search, page = 1, limit = 20 } = query;
    const userBookmarks = this.getUserBookmarks(userId);
    const userProgress = this.getUserProgressMap(userId);

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
      },
      orderBy: { updatedAt: 'desc' },
    });

    let allMappedItems: ReaderLibraryItemDto[] = books.map((book) => {
      const bookmarked = userBookmarks.has(book.id);
      const progress = userProgress.get(book.id);
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

    // Calculate metrics
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
    const response = await this.getLibrary(userId, { filter: ReaderLibraryFilter.ALL, limit: 1000 });
    return response.items
      .filter((item) => item.progress !== undefined)
      .sort((a, b) => new Date(b.progress!.lastReadAt).getTime() - new Date(a.progress!.lastReadAt).getTime());
  }

  async getBookmarks(userId: string): Promise<ReaderLibraryItemDto[]> {
    const response = await this.getLibrary(userId, { filter: ReaderLibraryFilter.BOOKMARKED, limit: 1000 });
    return response.items;
  }

  async addBookmark(userId: string, dto: BookmarkDto): Promise<{ success: boolean; documentId: string }> {
    const book = await this.prisma.book.findUnique({ where: { id: dto.documentId } });
    if (!book) {
      throw new NotFoundException(`Document with ID ${dto.documentId} not found`);
    }
    const bookmarks = this.getUserBookmarks(userId);
    bookmarks.add(dto.documentId);
    return { success: true, documentId: dto.documentId };
  }

  async removeBookmark(userId: string, documentId: string): Promise<{ success: boolean; documentId: string }> {
    const bookmarks = this.getUserBookmarks(userId);
    bookmarks.delete(documentId);
    return { success: true, documentId };
  }

  async updateProgress(userId: string, documentId: string, dto: ReadingProgressDto): Promise<ReadingProgressStateDto> {
    const book = await this.prisma.book.findUnique({ where: { id: documentId } });
    if (!book) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
    const totalPages = dto.totalPages ?? 100;
    const percentage = dto.percentage ?? Math.min(100, Math.round((dto.currentPage / totalPages) * 100));

    const progressState: ReadingProgressStateDto = {
      currentPage: dto.currentPage,
      totalPages,
      percentage,
      lastReadAt: new Date().toISOString(),
    };

    const userProgress = this.getUserProgressMap(userId);
    userProgress.set(documentId, progressState);
    return progressState;
  }

  private getUserBookmarks(userId: string): Set<string> {
    let bookmarks = this.bookmarksMap.get(userId);
    if (!bookmarks) {
      bookmarks = new Set<string>();
      this.bookmarksMap.set(userId, bookmarks);
    }
    return bookmarks;
  }

  private getUserProgressMap(userId: string): Map<string, ReadingProgressStateDto> {
    let progress = this.progressMap.get(userId);
    if (!progress) {
      progress = new Map<string, ReadingProgressStateDto>();
      this.progressMap.set(userId, progress);
    }
    return progress;
  }
}
