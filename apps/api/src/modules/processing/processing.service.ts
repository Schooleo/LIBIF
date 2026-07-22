import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookAuditAction, BookStatus, NotificationType, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProcessingJobHistoryDto } from './dto/processing-job-history.dto';
import { ProcessingJobResponseDto } from './dto/processing-job.dto';
import { ProcessingQueue } from './processing.queue';
import { ProcessingTransitionPolicy } from './processing.transition-policy';

@Injectable()
export class ProcessingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notifications: NotificationsService,
    @Inject(ProcessingQueue) private readonly processingQueue: ProcessingQueue
  ) {}

  async listJobs(): Promise<ProcessingJobResponseDto[]> {
    const jobs = await this.prisma.processingJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { title: true, status: true }
        }
      }
    });
    const seenBookIds = new Set<string>();
    return jobs
      .filter((job) => {
        if (seenBookIds.has(job.bookId)) return false;
        seenBookIds.add(job.bookId);
        return true;
      })
      .map((job) => this.mapToDto(job));
  }

  async getJobById(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id },
      include: {
        book: {
          select: { title: true, status: true }
        }
      }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }
    return this.mapToDto(job);
  }

  async getJobHistory(id: string): Promise<ProcessingJobHistoryDto> {
    const currentJob = await this.getJobById(id);
    const historyJobs = await this.prisma.processingJob.findMany({
      where: { bookId: currentJob.bookId },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { title: true, status: true }
        }
      }
    });

    return {
      current: currentJob,
      history: historyJobs.map((j) => this.mapToDto(j))
    };
  }

  async advanceJob(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id },
      include: {
        book: true
      }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }

    if (ProcessingTransitionPolicy.isTerminal(job.status)) {
      ProcessingTransitionPolicy.assertCanTransition(job.status, ProcessingJobStatus.RUNNING);
    }

    if (job.status === ProcessingJobStatus.QUEUED) {
      ProcessingTransitionPolicy.assertCanTransition(job.status, ProcessingJobStatus.RUNNING);
      await this.prisma.$transaction(async (tx) => {
        await tx.processingJob.update({
          where: { id },
          data: {
            status: ProcessingJobStatus.RUNNING,
            stage: 'performing_ocr',
            progressPercent: 50,
            attempts: { increment: 1 },
            startedAt: new Date()
          }
        });
        await tx.book.update({
          where: { id: job.bookId },
          data: { status: BookStatus.PROCESSING }
        });
        await tx.bookAuditEvent.create({
          data: {
            bookId: job.bookId,
            action: BookAuditAction.PROCESSING_STARTED,
            message: 'PDF processing pipeline started'
          }
        });
      });
    } else if (job.status === ProcessingJobStatus.RUNNING) {
      ProcessingTransitionPolicy.assertCanTransition(job.status, ProcessingJobStatus.SUCCEEDED);
      await this.prisma.$transaction(async (tx) => {
        const previousReview = await tx.approvalReview.findFirst({
          where: { bookId: job.bookId },
          orderBy: { round: 'desc' }
        });
        await tx.processingJob.update({
          where: { id },
          data: {
            status: ProcessingJobStatus.SUCCEEDED,
            stage: 'completed',
            progressPercent: 100,
            completedAt: new Date()
          }
        });
        await tx.book.update({
          where: { id: job.bookId },
          data: { status: BookStatus.PENDING_APPROVAL }
        });
        await tx.bookAuditEvent.create({
          data: {
            bookId: job.bookId,
            action: BookAuditAction.PROCESSING_COMPLETED,
            message: 'PDF processing completed, awaiting approval'
          }
        });
        await tx.approvalReview.create({
          data: {
            bookId: job.bookId,
            bookFileId: job.bookFileId,
            processingJobId: job.id,
            round: (previousReview?.round ?? 0) + 1,
            status: 'PENDING'
          }
        });
      });

      // Notify Admins
      const admins = await this.prisma.user.findMany({
        where: { role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] } }
      });

      for (const admin of admins) {
        await this.notifications.createNotification({
          recipientId: admin.id,
          type: NotificationType.APPROVAL_REQUIRED,
          title: 'Approval Required',
          body: `Document "${job.book.title}" has been successfully processed and is awaiting final approval.`,
          payload: { bookId: job.bookId, jobId: job.id }
        });
      }
    }

    return this.getJobById(id);
  }

  async retryJob(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id },
      include: { bookFile: true }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }

    ProcessingTransitionPolicy.assertCanRetry(job.status);

    const nextAttemptNumber = (job.attemptNumber ?? 1) + 1;

    const newJob = await this.prisma.$transaction(async (tx) => {
      // Mark old job as superseded
      await tx.processingJob.update({
        where: { id },
        data: { supersededAt: new Date() }
      });

      const created = await tx.processingJob.create({
        data: {
          bookId: job.bookId,
          bookFileId: job.bookFileId,
          type: job.type,
          status: ProcessingJobStatus.QUEUED,
          stage: 'queued',
          progressPercent: 0,
          attemptNumber: nextAttemptNumber,
          attempts: job.attempts + 1,
          retryOfJobId: job.id
        },
        include: {
          book: { select: { title: true } }
        }
      });

      await tx.book.update({
        where: { id: job.bookId },
        data: { status: BookStatus.PENDING_PROCESSING }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: job.bookId,
          action: BookAuditAction.PROCESSING_QUEUED,
          message: `Processing job retry enqueued (attempt ${nextAttemptNumber})`
        }
      });

      return created;
    });

    // Enqueue queue event for background processing worker
    await this.processingQueue.enqueueBookUploaded({
      bookId: job.bookId,
      fileId: job.bookFileId,
      objectKey: job.bookFile?.objectKey ?? `documents/${job.bookId}/${job.bookFileId}.pdf`,
      processingJobId: newJob.id
    });

    return this.mapToDto(newJob);
  }

  async cancelJob(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }

    ProcessingTransitionPolicy.assertCanCancel(job.status);

    await this.prisma.$transaction(async (tx) => {
      await tx.processingJob.update({
        where: { id },
        data: {
          status: ProcessingJobStatus.CANCELLED,
          stage: 'cancelled',
          terminalReason: 'Cancelled by administrator',
          cancelledAt: new Date(),
          completedAt: new Date()
        }
      });
      await tx.book.update({
        where: { id: job.bookId },
        data: { status: BookStatus.REJECTED }
      });
    });

    return this.getJobById(id);
  }

  private mapToDto(job: any): ProcessingJobResponseDto {
    return {
      id: job.id,
      bookId: job.bookId,
      bookFileId: job.bookFileId,
      bookTitle: job.book?.title ?? null,
      bookStatus: job.book?.status ?? null,
      type: job.type,
      status: job.status,
      stage: job.stage ?? null,
      progressPercent: job.progressPercent ?? 0,
      attemptNumber: job.attemptNumber ?? 1,
      attempts: job.attempts,
      retryOfJobId: job.retryOfJobId ?? null,
      terminalReason: job.terminalReason ?? null,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString()
    };
  }
}
