import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookAuditAction, BookStatus, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../database/prisma.service';
import { ProcessingQueue } from '../processing/processing.queue';
import { validatePdfUpload } from '../storage/pdf-validation';
import { StorageService } from '../storage/storage.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadResultDto } from './dto/upload-result.dto';

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
export class UploadService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(ProcessingQueue) private readonly queue: ProcessingQueue
  ) {}

  async createUpload(dto: CreateUploadDto, file: Express.Multer.File, librarianEmail = 'librarian@libif.local'): Promise<UploadResultDto> {
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
      const result = await this.prisma.$transaction(async (tx) => {
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
            isbn,
            title,
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

        for (const authorName of authors) {
          const author = await tx.author.upsert({ where: { name: authorName }, update: {}, create: { name: authorName } });
          await tx.bookAuthor.create({ data: { bookId: book.id, authorId: author.id } });
        }

        for (const tagName of tags) {
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

        const processingJob = await tx.processingJob.create({ data: { bookId: book.id, bookFileId: bookFile.id, type: 'PDF_OCR_PIPELINE' } });

        await tx.bookAuditEvent.create({
          data: {
            bookId: book.id,
            actorId: librarian.id,
            action: BookAuditAction.CREATED,
            message: `Document intake created with file ${file.originalname}`
          }
        });

        return {
          book: { id: book.id, title: book.title, status: book.status },
          file: { id: bookFile.id, originalFilename: bookFile.originalFilename, sizeBytes: bookFile.sizeBytes.toString() },
          processingJob: { id: processingJob.id, status: processingJob.status }
        };
      });

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

  async getUploadState(id: string): Promise<UploadResultDto> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        files: { take: 1, orderBy: { createdAt: 'desc' } },
        jobs: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!book) {
      throw new NotFoundException(`Upload record with ID "${id}" was not found.`);
    }

    const file = book.files[0];
    const job = book.jobs[0];

    return {
      book: { id: book.id, title: book.title, status: book.status },
      file: file
        ? { id: file.id, originalFilename: file.originalFilename, sizeBytes: file.sizeBytes.toString() }
        : { id: 'none', originalFilename: 'No file', sizeBytes: '0' },
      processingJob: job
        ? { id: job.id, status: job.status }
        : { id: 'none', status: ProcessingJobStatus.QUEUED }
    };
  }

  async cancelUpload(id: string, actorEmail: string): Promise<{ success: boolean; message: string }> {
    const state = await this.getUploadState(id);
    if (state.processingJob.status === ProcessingJobStatus.RUNNING || state.processingJob.status === ProcessingJobStatus.SUCCEEDED) {
      throw new BadRequestException('Cannot cancel an upload that is already running or completed.');
    }

    const librarian = await this.prisma.user.findUnique({ where: { email: actorEmail } });

    await this.prisma.$transaction([
      this.prisma.processingJob.updateMany({
        where: { bookId: id, status: ProcessingJobStatus.QUEUED },
        data: {
          status: ProcessingJobStatus.CANCELLED,
          stage: 'cancelled',
          terminalReason: 'Upload intake cancelled by user',
          cancelledAt: new Date(),
          completedAt: new Date()
        }
      }),
      this.prisma.bookAuditEvent.create({
        data: {
          bookId: id,
          actorId: librarian?.id,
          action: BookAuditAction.PROCESSING_QUEUED,
          message: 'Upload intake cancelled'
        }
      })
    ]);

    return { success: true, message: 'Upload intake cancelled.' };
  }

  async retryUpload(id: string, actorEmail: string): Promise<UploadResultDto> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        files: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!book || !book.files[0]) {
      throw new NotFoundException(`Valid file for upload ID "${id}" was not found.`);
    }

    const librarian = await this.prisma.user.findUnique({ where: { email: actorEmail } });

    const file = book.files[0];
    const previousJob = await this.prisma.processingJob.findFirst({
      where: { bookFileId: file.id },
      orderBy: [{ attemptNumber: 'desc' }, { createdAt: 'desc' }]
    });
    const job = await this.prisma.processingJob.create({
      data: {
        bookId: id,
        bookFileId: file.id,
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.QUEUED,
        attemptNumber: (previousJob?.attemptNumber ?? 0) + 1,
        retryOfJobId: previousJob?.id
      }
    });

    await this.prisma.book.update({
      where: { id },
      data: { status: BookStatus.PENDING_PROCESSING }
    });

    await this.prisma.bookAuditEvent.create({
      data: {
        bookId: id,
        actorId: librarian?.id,
        action: BookAuditAction.PROCESSING_QUEUED,
        message: 'Upload intake retried'
      }
    });

    await this.queue.enqueueBookUploaded({
      bookId: id,
      fileId: file.id,
      objectKey: file.objectKey,
      processingJobId: job.id
    });

    return this.getUploadState(id);
  }
}
