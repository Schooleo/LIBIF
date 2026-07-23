import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Worker } from 'bullmq';
import { BookAuditAction, BookStatus, NotificationType, ProcessingArtifactKind, ProcessingJobStatus, TextExtractionMethod, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
import { BookUploadedEvent } from './events/book-uploaded.event';
import { OCR_ENGINE, OcrEngine } from './ocr/ocr-engine.port';
import { PDF_PROCESSING_QUEUE } from './processing.queue';
import { ProcessingTransitionPolicy } from './processing.transition-policy';

@Injectable()
export class ProcessingProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProcessingProcessor.name);
  private worker?: Worker<BookUploadedEvent>;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notifications: NotificationsService,
    @Inject(StorageService) private readonly storage: StorageService,
    @Inject(OCR_ENGINE) private readonly ocrEngine: OcrEngine
  ) {}

  onModuleInit(): void {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error(
        'REDIS_URL is not configured. The ProcessingProcessor worker cannot start. ' +
        'Please set REDIS_URL in your environment and ensure Redis is running.'
      );
    }

    this.worker = new Worker<BookUploadedEvent>(
      PDF_PROCESSING_QUEUE,
      async (job) => this.processJob(job),
      { connection: { url: redisUrl }, concurrency: 2 }
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`BullMQ job ${job?.id} failed: ${err.message}`, err.stack);
    });

    this.logger.log(`ProcessingProcessor listening on queue "${PDF_PROCESSING_QUEUE}"`);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }
  }

  async processJob(job: Job<BookUploadedEvent>): Promise<void> {
    const { processingJobId, bookId, fileId } = job.data;
    this.logger.log(`Processing job ${processingJobId} for book ${bookId}`);

    // Re-read authoritative ProcessingJob from database
    const dbJob = await this.prisma.processingJob.findUnique({
      where: { id: processingJobId },
      include: { bookFile: true, book: true }
    });

    if (!dbJob) {
      this.logger.warn(`ProcessingJob ${processingJobId} not found in database. Skipping.`);
      return;
    }

    // Idempotency check: if job is already in terminal state, abort immediately without side effects
    if (ProcessingTransitionPolicy.isTerminal(dbJob.status)) {
      this.logger.warn(`ProcessingJob ${processingJobId} is already in terminal status ${dbJob.status}. Skipping.`);
      return;
    }

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    try {
      // Step 1: Validating
      await this.prisma.$transaction(async (tx) => {
        await tx.processingJob.update({
          where: { id: processingJobId },
          data: {
            status: ProcessingJobStatus.RUNNING,
            stage: 'validating',
            progressPercent: 10,
            startedAt: new Date(),
            attempts: { increment: 1 }
          }
        });
        await tx.book.update({
          where: { id: bookId },
          data: { status: BookStatus.PROCESSING }
        });
        await tx.bookAuditEvent.create({
          data: {
            bookId,
            action: BookAuditAction.PROCESSING_STARTED,
            message: 'Processing worker started job execution'
          }
        });
      });

      await delay(1500);

      // Step 2: OCR / Text Extraction
      await this.prisma.processingJob.update({
        where: { id: processingJobId },
        data: {
          stage: 'performing_ocr',
          progressPercent: 40
        }
      });

      const bucket = dbJob.bookFile?.bucket ?? 'libif-private';
      const objectKey = dbJob.bookFile?.objectKey ?? `documents/${bookId}/${fileId}.pdf`;
      const mimeType = dbJob.bookFile?.mimeType ?? 'application/pdf';

      const ocrResult = await this.ocrEngine.extractText(bucket, objectKey, mimeType);

      // Upload full text to MinIO
      const artifactKey = `artifacts/${bookId}/${fileId}/extracted.txt`;
      const textBuffer = Buffer.from(ocrResult.text, 'utf-8');
      await this.storage.putObject(bucket, artifactKey, textBuffer, 'text/plain');

      // Persist artifact metadata to DB (textPreview = first 500 chars for quick display)
      await this.prisma.processingArtifact.upsert({
        where: {
          processingJobId_kind: {
            processingJobId,
            kind: ProcessingArtifactKind.EXTRACTED_TEXT
          }
        },
        create: {
          processingJobId,
          bookFileId: fileId,
          kind: ProcessingArtifactKind.EXTRACTED_TEXT,
          extractionMethod: ocrResult.method as TextExtractionMethod,
          bucket,
          objectKey: artifactKey,
          mimeType: 'text/plain',
          sizeBytes: BigInt(textBuffer.byteLength),
          checksumSha256: ocrResult.checksumSha256,
          language: ocrResult.language,
          pageCount: ocrResult.pageCount,
          metadata: { textPreview: ocrResult.text.slice(0, 500) }
        },
        update: {
          extractionMethod: ocrResult.method as TextExtractionMethod,
          sizeBytes: BigInt(textBuffer.byteLength),
          checksumSha256: ocrResult.checksumSha256,
          language: ocrResult.language,
          pageCount: ocrResult.pageCount,
          metadata: { textPreview: ocrResult.text.slice(0, 500) }
        }
      });

      await delay(1500);

      // Step 3: Indexing
      await this.prisma.processingJob.update({
        where: { id: processingJobId },
        data: {
          stage: 'indexing',
          progressPercent: 80
        }
      });

      await delay(1500);

      // Step 4: Finalize Success & Create Approval Review
      await this.prisma.$transaction(async (tx) => {
        const previousReview = await tx.approvalReview.findFirst({
          where: { bookId },
          orderBy: { round: 'desc' }
        });

        await tx.processingJob.update({
          where: { id: processingJobId },
          data: {
            status: ProcessingJobStatus.SUCCEEDED,
            stage: 'completed',
            progressPercent: 100,
            completedAt: new Date()
          }
        });

        await tx.book.update({
          where: { id: bookId },
          data: { status: BookStatus.PENDING_APPROVAL }
        });

        await tx.bookAuditEvent.create({
          data: {
            bookId,
            action: BookAuditAction.PROCESSING_COMPLETED,
            message: 'Processing completed successfully, awaiting approval review'
          }
        });

        await tx.approvalReview.create({
          data: {
            bookId,
            bookFileId: fileId,
            processingJobId,
            round: (previousReview?.round ?? 0) + 1,
            status: 'PENDING'
          }
        });
      });

      // Notify Admins/Librarians after transaction commits
      const admins = await this.prisma.user.findMany({
        where: { role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] } }
      });

      for (const admin of admins) {
        await this.notifications.createNotification({
          recipientId: admin.id,
          type: NotificationType.APPROVAL_REQUIRED,
          title: 'Approval Required',
          body: `Document "${dbJob.book?.title ?? 'Document'}" processing complete. Approval required.`,
          payload: { bookId, jobId: processingJobId },
          actionHref: `/admin/approvals`
        });
      }

      this.logger.log(`ProcessingJob ${processingJobId} completed successfully.`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Processing pipeline error';
      this.logger.error(`ProcessingJob ${processingJobId} failed: ${errorMessage}`);

      await this.prisma.$transaction(async (tx) => {
        await tx.processingJob.update({
          where: { id: processingJobId },
          data: {
            status: ProcessingJobStatus.FAILED,
            stage: 'failed',
            errorMessage,
            terminalReason: errorMessage,
            completedAt: new Date()
          }
        });

        await tx.book.update({
          where: { id: bookId },
          data: { status: BookStatus.PENDING_PROCESSING }
        });

        await tx.bookAuditEvent.create({
          data: {
            bookId,
            action: BookAuditAction.PROCESSING_QUEUED,
            message: `Processing failed: ${errorMessage}`
          }
        });
      });
    }
  }
}
