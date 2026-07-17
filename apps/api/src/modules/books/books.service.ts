import { BadRequestException, Injectable } from '@nestjs/common';
import { BookStatus, Prisma, UserRole } from '../../generated/prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../database/prisma.service';
import { ProcessingQueue } from '../processing/processing.queue';
import { validatePdfUpload } from '../storage/pdf-validation';
import { StorageService, StoredPdf } from '../storage/storage.service';
import { CreateBookIntakeDto } from './dto/create-book-intake.dto';

type IntakeResult = {
  book: { id: string; title: string; status: BookStatus };
  file: { id: string; originalFilename: string; sizeBytes: string };
  processingJob: { id: string; status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' };
};

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function uniqueNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = normalizeName(value);
    if (!normalized) continue;
    const key = normalized.toLocaleLowerCase('vi');
    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }
  return result;
}

function slug(value: string): string {
  return slugify(value, { lower: true, strict: true, locale: 'vi' });
}

function normalizeIsbn(isbn?: string): string | undefined {
  if (!isbn) return undefined;
  const normalized = isbn.replace(/[\s-]/g, '').toUpperCase();
  if (![10, 13].includes(normalized.length)) {
    throw new BadRequestException('ISBN must be ISBN-10 or ISBN-13 length.');
  }
  return normalized;
}

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly queue: ProcessingQueue
  ) {}

  async createIntake(dto: CreateBookIntakeDto, file: Express.Multer.File, librarianEmail = 'librarian@libif.local'): Promise<IntakeResult> {
    validatePdfUpload(file);
    const authors = uniqueNormalized(dto.authors);
    if (authors.length === 0) {
      throw new BadRequestException('At least one author is required.');
    }
    const tags = uniqueNormalized(dto.tags ?? []);
    const isbn = normalizeIsbn(dto.isbn);
    const title = normalizeName(dto.title);
    if (!title) {
      throw new BadRequestException('Title is required.');
    }

    const storedPdf = await this.storage.putPrivatePdf(file);
    try {
      const result = await this.prisma.$transaction(async (tx) => this.persistIntake(tx, dto, { authors, tags, isbn, title }, storedPdf, file, librarianEmail));
      await this.queue.enqueueBookUploaded({
        bookId: result.book.id,
        fileId: result.file.id,
        objectKey: storedPdf.objectKey,
        processingJobId: result.processingJob.id
      });
      return result;
    } catch (error) {
      await this.storage.deleteObject(storedPdf.bucket, storedPdf.objectKey);
      throw error;
    }
  }

  private async persistIntake(
    tx: Prisma.TransactionClient,
    dto: CreateBookIntakeDto,
    normalized: { authors: string[]; tags: string[]; isbn?: string; title: string },
    storedPdf: StoredPdf,
    file: Express.Multer.File,
    librarianEmail: string
  ): Promise<IntakeResult> {
    const librarian = await tx.user.upsert({
      where: { email: librarianEmail },
      update: { role: UserRole.LIBRARIAN },
      create: { email: librarianEmail, passwordHash: 'dev-only', role: UserRole.LIBRARIAN }
    });

    if (dto.categoryId) {
      const category = await tx.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) throw new BadRequestException('Selected category does not exist.');
    }

    const book = await tx.book.create({
      data: {
        isbn: normalized.isbn,
        title: normalized.title,
        subtitle: dto.subtitle?.trim() || undefined,
        description: dto.description?.trim() || undefined,
        publisher: dto.publisher?.trim() || undefined,
        publishedYear: dto.publishedYear,
        language: dto.language?.trim() || 'vi',
        status: BookStatus.PENDING_PROCESSING,
        categoryId: dto.categoryId || undefined,
        createdById: librarian.id
      }
    });

    for (const authorName of normalized.authors) {
      const author = await tx.author.upsert({ where: { name: authorName }, update: {}, create: { name: authorName } });
      await tx.bookAuthor.create({ data: { bookId: book.id, authorId: author.id } });
    }

    for (const tagName of normalized.tags) {
      const tag = await tx.tag.upsert({ where: { slug: slug(tagName) }, update: { name: tagName }, create: { name: tagName, slug: slug(tagName) } });
      await tx.bookTag.create({ data: { bookId: book.id, tagId: tag.id } });
    }

    const bookFile = await tx.bookFile.create({
      data: {
        bookId: book.id,
        bucket: storedPdf.bucket,
        objectKey: storedPdf.objectKey,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: storedPdf.sizeBytes,
        checksumSha256: storedPdf.checksumSha256
      }
    });

    const processingJob = await tx.processingJob.create({ data: { bookId: book.id } });
    return {
      book: { id: book.id, title: book.title, status: book.status },
      file: { id: bookFile.id, originalFilename: bookFile.originalFilename, sizeBytes: bookFile.sizeBytes.toString() },
      processingJob: { id: processingJob.id, status: processingJob.status }
    };
  }

  async listAdminBooks() {
    const books = await this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        files: { take: 1, orderBy: { createdAt: 'desc' } },
        tags: { include: { tag: true } },
        authors: { include: { author: true } }
      }
    });
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      status: book.status,
      category: book.category,
      tags: book.tags.map(({ tag }) => tag),
      authors: book.authors.map(({ author }) => author),
      file: book.files[0]
        ? { id: book.files[0].id, originalFilename: book.files[0].originalFilename, sizeBytes: book.files[0].sizeBytes.toString() }
        : null,
      createdAt: book.createdAt.toISOString()
    }));
  }
}
