import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Worker } from 'bullmq';
import {
  BookAuditAction,
  BookFileStatus,
  BookStatus,
  NotificationType,
  ProcessingArtifactKind,
  ProcessingJobStatus,
  TextExtractionMethod,
  UserRole
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
import { BookUploadedEvent } from './events/book-uploaded.event';
import { OCR_ENGINE, OcrEngine, OcrExtractionError } from './ocr/ocr-engine.port';
import { PDF_PROCESSING_QUEUE } from './processing.queue';
import { ProcessingTransitionPolicy } from './processing.transition-policy';

class ProcessingJobAbortedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ProcessingJobAbortedError.name;
  }
}

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

    this.worker.on('failed', (job, error) => {
      this.logger.error(`BullMQ job ${job?.id} failed: ${error.message}`, error.stack);
    });

    this.logger.log(`ProcessingProcessor listening on queue "${PDF_PROCESSING_QUEUE}"`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }

  async processJob(job: Job<BookUploadedEvent>): Promise<void> {
    const { processingJobId, bookId, fileId } = job.data;
    const artifactKey = `artifacts/${bookId}/${fileId}/${processingJobId}/extracted.txt`;
    let claimed = false;
    let artifactUploaded = false;

    this.logger.log(`Processing job ${processingJobId} for book ${bookId}`);

    const dbJob = await this.prisma.processingJob.findUnique({
      where: { id: processingJobId },
      include: { bookFile: true, book: true }
    });

    if (!dbJob) {
      this.logger.warn(`ProcessingJob ${processingJobId} not found in database. Skipping.`);
      return;
    }

    if (
      dbJob.bookId !== bookId ||
      dbJob.bookFileId !== fileId ||
      dbJob.bookFile.objectKey !== job.data.objectKey
    ) {
      this.logger.warn(`ProcessingJob ${processingJobId} payload does not match its persisted file lineage. Skipping.`);
      return;
    }

    if (ProcessingTransitionPolicy.isTerminal(dbJob.status)) {
      this.logger.warn(`ProcessingJob ${processingJobId} is already ${dbJob.status}. Skipping duplicate delivery.`);
      return;
    }

    if (dbJob.bookFile.status !== BookFileStatus.ACTIVE) {
      await this.supersedeQueuedJob(processingJobId, 'Source file was replaced before processing started.');
      return;
    }

    try {
      await this.claimJob(processingJobId, bookId, fileId);
      claimed = true;
      await this.setStage(processingJobId, 'performing_ocr', 40);

      const ocrResult = await this.ocrEngine.extractText(
        dbJob.bookFile.bucket,
        dbJob.bookFile.objectKey,
        dbJob.bookFile.mimeType
      );

      await this.assertJobIsCurrent(processingJobId, fileId);
      const textBuffer = Buffer.from(ocrResult.text, 'utf8');
      await this.storage.putObject(dbJob.bookFile.bucket, artifactKey, textBuffer, 'text/plain');
      artifactUploaded = true;
      await this.assertJobIsCurrent(processingJobId, fileId);

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
          bucket: dbJob.bookFile.bucket,
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

      await this.setStage(processingJobId, 'indexing', 80);
      await this.completeJob(processingJobId, bookId, fileId);
      this.logger.log(`ProcessingJob ${processingJobId} completed successfully.`);
      try {
        await this.notifyReviewers(dbJob.book.title, bookId, processingJobId);
      } catch (notificationError) {
        this.logger.error(
          `ProcessingJob ${processingJobId} completed, but reviewer notification failed: ${errorMessage(notificationError)}`
        );
      }
    } catch (error) {
      if (error instanceof ProcessingJobAbortedError) {
        this.logger.warn(`ProcessingJob ${processingJobId} stopped without mutation: ${error.message}`);
        if (claimed) {
          await this.cleanupStaleArtifact(processingJobId, dbJob.bookFile.bucket, artifactKey, artifactUploaded);
        }
        return;
      }

      if (!claimed) {
        throw error;
      }

      const safeMessage =
        error instanceof OcrExtractionError ? error.message : 'Processing pipeline failed unexpectedly.';
      this.logger.error(
        `ProcessingJob ${processingJobId} failed: ${errorMessage(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      await this.cleanupStaleArtifact(processingJobId, dbJob.bookFile.bucket, artifactKey, artifactUploaded);
      const failed = await this.failRunningJob(processingJobId, bookId, safeMessage);
      if (failed) {
        try {
          await this.notifyProcessingFailure(dbJob.book.createdById, dbJob.book.title, bookId, processingJobId);
        } catch (notificationError) {
          this.logger.error(
            `ProcessingJob ${processingJobId} failed safely, but failure notification failed: ${errorMessage(notificationError)}`
          );
        }
      }
    }
  }

  private async claimJob(processingJobId: string, bookId: string, fileId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const activeFile = await tx.bookFile.findFirst({
        where: { id: fileId, bookId, status: BookFileStatus.ACTIVE },
        select: { id: true }
      });
      if (!activeFile) {
        throw new ProcessingJobAbortedError('Source file is no longer active.');
      }

      const claim = await tx.processingJob.updateMany({
        where: { id: processingJobId, bookId, bookFileId: fileId, status: ProcessingJobStatus.QUEUED },
        data: {
          status: ProcessingJobStatus.RUNNING,
          stage: 'validating',
          progressPercent: 10,
          startedAt: new Date(),
          attempts: { increment: 1 }
        }
      });
      if (claim.count !== 1) {
        throw new ProcessingJobAbortedError('Another delivery already claimed or completed this job.');
      }

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
  }

  private async setStage(processingJobId: string, stage: string, progressPercent: number): Promise<void> {
    const update = await this.prisma.processingJob.updateMany({
      where: { id: processingJobId, status: ProcessingJobStatus.RUNNING },
      data: { stage, progressPercent }
    });
    if (update.count !== 1) {
      throw new ProcessingJobAbortedError(`Job became terminal before stage "${stage}".`);
    }
  }

  private async assertJobIsCurrent(processingJobId: string, fileId: string): Promise<void> {
    const current = await this.prisma.processingJob.findUnique({
      where: { id: processingJobId },
      select: {
        status: true,
        bookFileId: true,
        bookFile: { select: { status: true } }
      }
    });
    if (
      !current ||
      current.status !== ProcessingJobStatus.RUNNING ||
      current.bookFileId !== fileId ||
      current.bookFile.status !== BookFileStatus.ACTIVE
    ) {
      throw new ProcessingJobAbortedError('Job was cancelled, superseded, or detached from the active file.');
    }
  }

  private async completeJob(processingJobId: string, bookId: string, fileId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const activeFile = await tx.bookFile.findFirst({
        where: { id: fileId, bookId, status: BookFileStatus.ACTIVE },
        select: { id: true }
      });
      if (!activeFile) {
        throw new ProcessingJobAbortedError('Source file was replaced before completion.');
      }

      const completion = await tx.processingJob.updateMany({
        where: { id: processingJobId, status: ProcessingJobStatus.RUNNING },
        data: {
          status: ProcessingJobStatus.SUCCEEDED,
          stage: 'completed',
          progressPercent: 100,
          completedAt: new Date()
        }
      });
      if (completion.count !== 1) {
        throw new ProcessingJobAbortedError('Job became terminal before completion.');
      }

      const previousReview = await tx.approvalReview.findFirst({
        where: { bookId },
        orderBy: { round: 'desc' }
      });

      await tx.book.update({
        where: { id: bookId },
        data: { status: BookStatus.PENDING_APPROVAL }
      });
      await tx.bookAuditEvent.createMany({
        data: [
          {
            bookId,
            action: BookAuditAction.PROCESSING_COMPLETED,
            message: 'Processing completed successfully'
          },
          {
            bookId,
            action: BookAuditAction.APPROVAL_REQUESTED,
            message: 'Processing completed successfully, awaiting approval review'
          }
        ]
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
  }

  private async failRunningJob(processingJobId: string, bookId: string, safeMessage: string): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const failure = await tx.processingJob.updateMany({
        where: { id: processingJobId, status: ProcessingJobStatus.RUNNING },
        data: {
          status: ProcessingJobStatus.FAILED,
          stage: 'failed',
          errorMessage: safeMessage,
          terminalReason: safeMessage,
          completedAt: new Date()
        }
      });
      if (failure.count !== 1) return false;

      await tx.book.update({
        where: { id: bookId },
        data: { status: BookStatus.PENDING_PROCESSING }
      });
      await tx.bookAuditEvent.create({
        data: {
          bookId,
          action: BookAuditAction.PROCESSING_QUEUED,
          message: `Processing failed: ${safeMessage}`
        }
      });
      return true;
    });
  }

  private async supersedeQueuedJob(processingJobId: string, reason: string): Promise<void> {
    await this.prisma.processingJob.updateMany({
      where: { id: processingJobId, status: ProcessingJobStatus.QUEUED },
      data: {
        status: ProcessingJobStatus.SUPERSEDED,
        stage: 'superseded',
        terminalReason: reason,
        supersededAt: new Date(),
        completedAt: new Date()
      }
    });
  }

  private async cleanupStaleArtifact(
    processingJobId: string,
    bucket: string,
    artifactKey: string,
    artifactUploaded: boolean
  ): Promise<void> {
    await this.prisma.processingArtifact.deleteMany({ where: { processingJobId } });
    if (artifactUploaded) {
      await this.storage.deleteObject(bucket, artifactKey);
    }
  }

  private async notifyReviewers(title: string, bookId: string, processingJobId: string): Promise<void> {
    const reviewers = await this.prisma.user.findMany({
      where: { role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] } }
    });
    for (const reviewer of reviewers) {
      await this.notifications.createNotification({
        recipientId: reviewer.id,
        type: NotificationType.APPROVAL_REQUIRED,
        title: 'Approval Required',
        body: `Document "${title}" processing complete. Approval required.`,
        payload: { bookId, jobId: processingJobId },
        actionHref: '/admin/approvals'
      });
    }
  }

  private async notifyProcessingFailure(
    recipientId: string,
    title: string,
    bookId: string,
    processingJobId: string
  ): Promise<void> {
    await this.notifications.createNotification({
      recipientId,
      type: NotificationType.PROCESSING_FAILED,
      title: 'Processing Failed',
      body: `Document "${title}" could not be processed. Review the job details before retrying.`,
      payload: { bookId, jobId: processingJobId },
      actionHref: `/admin/processing/${processingJobId}`
    });
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
