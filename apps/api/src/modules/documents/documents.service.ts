import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookAuditAction, BookFileStatus, BookStatus, Prisma, UserRole } from '../../generated/prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../database/prisma.service';
import { ProcessingQueue } from '../processing/processing.queue';
import { validatePdfUpload } from '../storage/pdf-validation';
import { StorageService } from '../storage/storage.service';
import { DocumentDetailResponseDto, PagedDocumentListResponseDto } from './dto/document-detail.dto';
import { DocumentListQueryDto } from './dto/document-list-query.dto';
import { UpdateDocumentMetadataDto } from './dto/update-document-metadata.dto';

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
export class DocumentsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(ProcessingQueue) private readonly queue: ProcessingQueue
  ) {}

  async listDocuments(query: DocumentListQueryDto): Promise<PagedDocumentListResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};

    if (query.status) {
      where.status = query.status as BookStatus;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { isbn: { contains: q, mode: 'insensitive' } },
        { authors: { some: { author: { name: { contains: q, mode: 'insensitive' } } } } }
      ];
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: true,
          tags: { include: { tag: true } },
          authors: { include: { author: true } },
          files: { orderBy: { version: 'desc' } },
          jobs: { orderBy: { createdAt: 'desc' }, take: 1 },
          auditEvents: { orderBy: { createdAt: 'desc' }, include: { actor: true } }
        }
      }),
      this.prisma.book.count({ where })
    ]);

    return {
      items: items.map((doc) => this.mapDocumentDetail(doc)),
      totalCount,
      page,
      pageSize: limit,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getDocumentDetail(id: string): Promise<DocumentDetailResponseDto> {
    const doc = await this.prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
        authors: { include: { author: true } },
        files: { orderBy: { version: 'desc' } },
        jobs: { orderBy: { createdAt: 'desc' }, take: 1 },
        auditEvents: { orderBy: { createdAt: 'desc' }, include: { actor: true } }
      }
    });

    if (!doc) {
      throw new NotFoundException(`Document with ID "${id}" was not found.`);
    }

    return this.mapDocumentDetail(doc);
  }

  async updateMetadata(id: string, dto: UpdateDocumentMetadataDto, actorEmail: string): Promise<DocumentDetailResponseDto> {
    await this.getDocumentDetail(id);

    const title = normalizeName(dto.title);
    if (!title) {
      throw new BadRequestException('Title is required.');
    }
    const authors = uniqueNormalized(dto.authors);
    if (authors.length === 0) {
      throw new BadRequestException('At least one author is required.');
    }
    const tags = uniqueNormalized(dto.tags ?? []);
    const isbn = normalizeIsbn(dto.isbn);

    const actor = await this.findOrCreateActor(actorEmail);

    await this.prisma.$transaction(async (tx) => {
      if (dto.categoryId) {
        const cat = await tx.category.findUnique({ where: { id: dto.categoryId } });
        if (!cat) throw new BadRequestException('Selected category does not exist.');
      }

      await tx.book.update({
        where: { id },
        data: {
          title,
          subtitle: dto.subtitle?.trim() || null,
          description: dto.description?.trim() || null,
          publisher: dto.publisher?.trim() || null,
          publishedYear: dto.publishedYear ?? null,
          language: dto.language?.trim() || 'vi',
          isbn: isbn ?? null,
          categoryId: dto.categoryId || null
        }
      });

      await tx.bookAuthor.deleteMany({ where: { bookId: id } });
      for (const name of authors) {
        const author = await tx.author.upsert({ where: { name }, update: {}, create: { name } });
        await tx.bookAuthor.create({ data: { bookId: id, authorId: author.id } });
      }

      await tx.bookTag.deleteMany({ where: { bookId: id } });
      for (const name of tags) {
        const tag = await tx.tag.upsert({ where: { slug: slug(name) }, update: { name }, create: { name, slug: slug(name) } });
        await tx.bookTag.create({ data: { bookId: id, tagId: tag.id } });
      }

      await tx.bookAuditEvent.create({
        data: {
          bookId: id,
          actorId: actor.id,
          action: BookAuditAction.METADATA_UPDATED,
          message: 'Document metadata updated'
        }
      });
    });

    return this.getDocumentDetail(id);
  }

  async submitProcessing(id: string, actorEmail: string): Promise<DocumentDetailResponseDto> {
    const doc = await this.getDocumentDetail(id);
    const activeFile = doc.activeFile;
    if (!activeFile) {
      throw new BadRequestException('Document has no active file for processing.');
    }

    const actor = await this.findOrCreateActor(actorEmail);

    const { job, file } = await this.prisma.$transaction(async (tx) => {
      await tx.book.update({
        where: { id },
        data: { status: BookStatus.PENDING_PROCESSING }
      });

      const dbFile = await tx.bookFile.findUniqueOrThrow({ where: { id: activeFile.id } });

      const processingJob = await tx.processingJob.create({
        data: { bookId: id, type: 'PDF_OCR_PIPELINE' }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: id,
          actorId: actor.id,
          action: BookAuditAction.PROCESSING_QUEUED,
          message: 'Processing manually queued'
        }
      });

      return { job: processingJob, file: dbFile };
    });

    await this.queue.enqueueBookUploaded({
      bookId: id,
      fileId: file.id,
      objectKey: file.objectKey,
      processingJobId: job.id
    });

    return this.getDocumentDetail(id);
  }

  async replaceFile(id: string, file: Express.Multer.File, actorEmail: string): Promise<DocumentDetailResponseDto> {
    await this.getDocumentDetail(id);
    validatePdfUpload(file);

    const storedPdf = await this.storage.putPrivatePdf(file);
    const actor = await this.findOrCreateActor(actorEmail);

    try {
      const { newFile, job } = await this.prisma.$transaction(async (tx) => {
        // Deactivate older active files
        await tx.bookFile.updateMany({
          where: { bookId: id, status: BookFileStatus.ACTIVE },
          data: { status: BookFileStatus.REPLACED }
        });

        const activeFiles = await tx.bookFile.findMany({ where: { bookId: id } });
        const maxVersion = activeFiles.reduce((max, f) => Math.max(max, f.version), 0);

        const newBookFile = await tx.bookFile.create({
          data: {
            bookId: id,
            bucket: storedPdf.bucket,
            objectKey: storedPdf.objectKey,
            originalFilename: file.originalname,
            mimeType: file.mimetype,
            sizeBytes: storedPdf.sizeBytes,
            checksumSha256: storedPdf.checksumSha256,
            version: maxVersion + 1,
            status: BookFileStatus.ACTIVE
          }
        });

        await tx.book.update({
          where: { id },
          data: { status: BookStatus.PENDING_PROCESSING }
        });

        const processingJob = await tx.processingJob.create({
          data: { bookId: id, type: 'PDF_OCR_PIPELINE' }
        });

        await tx.bookAuditEvent.create({
          data: {
            bookId: id,
            actorId: actor.id,
            action: BookAuditAction.FILE_REPLACED,
            message: `Active file replaced with ${file.originalname} (v${newBookFile.version})`
          }
        });

        return { newFile: newBookFile, job: processingJob };
      });

      await this.queue.enqueueBookUploaded({
        bookId: id,
        fileId: newFile.id,
        objectKey: storedPdf.objectKey,
        processingJobId: job.id
      });

      return this.getDocumentDetail(id);
    } catch (error) {
      await this.storage.deleteObject(storedPdf.bucket, storedPdf.objectKey);
      throw error;
    }
  }

  private async findOrCreateActor(email: string) {
    return this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: 'dev-only', role: UserRole.LIBRARIAN }
    });
  }

  private mapDocumentDetail(doc: any): DocumentDetailResponseDto {
    const activeFile = doc.files?.find((f: any) => f.status === BookFileStatus.ACTIVE) || doc.files?.[0] || null;
    const latestJob = doc.jobs?.[0] || null;

    return {
      id: doc.id,
      title: doc.title,
      subtitle: doc.subtitle,
      description: doc.description,
      publisher: doc.publisher,
      publishedYear: doc.publishedYear,
      language: doc.language,
      isbn: doc.isbn,
      status: doc.status,
      category: doc.category
        ? {
            id: doc.category.id,
            name: doc.category.name,
            slug: doc.category.slug,
            parentId: doc.category.parentId
          }
        : null,
      tags: doc.tags?.map((t: any) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })) ?? [],
      authors: doc.authors?.map((a: any) => ({ id: a.author.id, name: a.author.name })) ?? [],
      files:
        doc.files?.map((f: any) => ({
          id: f.id,
          originalFilename: f.originalFilename,
          sizeBytes: f.sizeBytes.toString(),
          mimeType: f.mimeType,
          version: f.version,
          status: f.status,
          createdAt: f.createdAt.toISOString()
        })) ?? [],
      activeFile: activeFile
        ? {
            id: activeFile.id,
            originalFilename: activeFile.originalFilename,
            sizeBytes: activeFile.sizeBytes.toString(),
            mimeType: activeFile.mimeType,
            version: activeFile.version,
            status: activeFile.status,
            createdAt: activeFile.createdAt.toISOString()
          }
        : null,
      activeProcessingJob: latestJob
        ? {
            id: latestJob.id,
            status: latestJob.status,
            stage: latestJob.stage,
            progressPercent: latestJob.progressPercent ?? 0,
            errorMessage: latestJob.errorMessage,
            updatedAt: latestJob.updatedAt.toISOString()
          }
        : null,
      auditHistory:
        doc.auditEvents?.map((evt: any) => ({
          id: evt.id,
          action: evt.action,
          message: evt.message,
          actorEmail: evt.actor?.email ?? null,
          createdAt: evt.createdAt.toISOString()
        })) ?? [],
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  }
}
