import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  PROTECTED_PAGE_RENDERER,
  ProtectedPageRenderer,
} from '../rendering/protected-page-renderer.port';
import { BookmarkDto } from './dto/bookmark.dto';
import { ReaderLibraryFilter, ReaderLibraryQueryDto } from './dto/reader-library-query.dto';
import { ReaderLibraryItemDto, ReaderLibraryResponseDto, ReadingProgressStateDto } from './dto/reader-library-item.dto';
import { ReadingProgressDto } from './dto/reading-progress.dto';
import { ReaderDocumentStateDto } from './dto/reader-document-state.dto';

@Injectable()
export class ReaderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PROTECTED_PAGE_RENDERER)
    private readonly pageRenderer: ProtectedPageRenderer,
  ) {}

  async getLibrary(userId: string, query: ReaderLibraryQueryDto = {}): Promise<ReaderLibraryResponseDto> {
    const { filter = ReaderLibraryFilter.ALL, search, page = 1, limit = 20 } = query;

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

    const readingCount = allMappedItems.filter((item) => item.progress && item.progress.percentage < 100).length;
    const bookmarkedCount = allMappedItems.filter((item) => item.bookmarked).length;

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

  async getDocumentState(userId: string, documentId: string): Promise<ReaderDocumentStateDto> {
    await this.ensurePublishedDocument(documentId);

    const bookmark = await this.prisma.bookmark.findUnique({
      where: { userId_bookId: { userId, bookId: documentId } },
    });

    const rp = await this.prisma.readingProgress.findUnique({
      where: { userId_bookId: { userId, bookId: documentId } },
    });

    return {
      documentId,
      bookmarked: !!bookmark,
      progress: rp
        ? {
            currentPage: rp.currentPage,
            totalPages: rp.totalPages,
            percentage: rp.percentage,
            status: rp.status,
            lastReadAt: rp.lastReadAt.toISOString(),
          }
        : null,
    };
  }

  async addBookmark(userId: string, dto: BookmarkDto): Promise<{ success: boolean; documentId: string }> {
    await this.ensurePublishedDocument(dto.documentId);
    await this.prisma.bookmark.upsert({
      where: { userId_bookId: { userId, bookId: dto.documentId } },
      create: { userId, bookId: dto.documentId },
      update: {},
    });
    return { success: true, documentId: dto.documentId };
  }

  async removeBookmark(userId: string, documentId: string): Promise<{ success: boolean; documentId: string }> {
    const book = await this.prisma.book.findUnique({ where: { id: documentId } });
    if (!book || book.status !== 'PUBLISHED') {
      return { success: true, documentId };
    }

    await this.prisma.bookmark.deleteMany({ where: { userId, bookId: documentId } });
    return { success: true, documentId };
  }

  async updateProgress(userId: string, documentId: string, dto: ReadingProgressDto): Promise<ReadingProgressStateDto> {
    const activeFile = await this.getPublishedActiveFile(documentId);
    const renderedPage = await this.pageRenderer.renderBasePage({
      bookFileId: activeFile.id,
      bucket: activeFile.bucket,
      objectKey: activeFile.objectKey,
      pageNumber: 1,
      profile: 'READER_STANDARD',
    });
    const totalPages = renderedPage.pageCount;
    if (dto.totalPages !== totalPages) {
      throw new BadRequestException('totalPages must match the authoritative document manifest');
    }
    if (dto.currentPage > totalPages) {
      throw new BadRequestException('currentPage cannot exceed totalPages');
    }

    const computedPercentage = Math.min(100, Math.round((dto.currentPage / totalPages) * 100));
    if (dto.percentage !== undefined && Math.round(dto.percentage) !== computedPercentage) {
      throw new BadRequestException('percentage must match currentPage and totalPages');
    }

    const percentage = dto.percentage !== undefined ? Math.round(dto.percentage) : computedPercentage;
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

  private async ensurePublishedDocument(documentId: string): Promise<void> {
    const book = await this.prisma.book.findUnique({ where: { id: documentId } });
    if (!book || book.status !== 'PUBLISHED') {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
  }

  private async getPublishedActiveFile(documentId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: documentId },
      include: {
        files: {
          where: { status: 'ACTIVE' },
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });
    const activeFile = book?.files?.[0];
    if (!book || book.status !== 'PUBLISHED' || !activeFile) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
    return activeFile;
  }
}
