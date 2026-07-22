import { BadRequestException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { BookAuditAction, BookStatus, NotificationType, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProcessingJobResponseDto } from './dto/processing-job.dto';

@Injectable()
export class ProcessingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notifications: NotificationsService
  ) {}

  async listJobs(): Promise<ProcessingJobResponseDto[]> {
    const jobs = await this.prisma.processingJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { title: true }
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
          select: { title: true }
        }
      }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }
    return this.mapToDto(job);
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

    if (job.status === ProcessingJobStatus.SUCCEEDED || job.status === ProcessingJobStatus.FAILED) {
      throw new UnprocessableEntityException(`Cannot advance processing job that is already ${job.status}`);
    }

    if (job.status === ProcessingJobStatus.QUEUED) {
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
      await this.prisma.$transaction(async (tx) => {
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
      where: { id }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }

    if (job.status !== ProcessingJobStatus.FAILED) {
      throw new BadRequestException(`Only FAILED processing jobs can be retried`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.processingJob.update({
        where: { id },
        data: {
          status: ProcessingJobStatus.QUEUED,
          stage: 'queued',
          progressPercent: 0,
          errorMessage: null,
          attempts: { increment: 1 }
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
          message: 'Processing job retry enqueued'
        }
      });
    });

    return this.getJobById(id);
  }

  async cancelJob(id: string): Promise<ProcessingJobResponseDto> {
    const job = await this.prisma.processingJob.findUnique({
      where: { id }
    });
    if (!job) {
      throw new NotFoundException(`Processing job with ID ${id} not found`);
    }

    if (job.status === ProcessingJobStatus.SUCCEEDED || job.status === ProcessingJobStatus.FAILED) {
      throw new BadRequestException(`Cannot cancel job that is already ${job.status}`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.processingJob.update({
        where: { id },
        data: {
          status: ProcessingJobStatus.FAILED,
          stage: 'cancelled',
          errorMessage: 'Cancelled by administrator',
          cancelledAt: new Date()
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
      bookTitle: job.book?.title ?? null,
      type: job.type,
      status: job.status,
      stage: job.stage ?? null,
      progressPercent: job.progressPercent ?? 0,
      attempts: job.attempts,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString()
    };
  }
}
