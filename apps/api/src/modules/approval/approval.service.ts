import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalReviewStatus, BookAuditAction, BookStatus, NotificationType } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ApprovalTransitionPolicy } from './approval.transition-policy';
import { ApproveReviewDto, RejectReviewDto, RequestCorrectionDto } from './dto/approval-action.dto';
import { ApprovalReviewResponseDto } from './dto/approval-review.dto';

@Injectable()
export class ApprovalService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notifications: NotificationsService
  ) {}

  async listPendingReviews(status?: ApprovalReviewStatus): Promise<ApprovalReviewResponseDto[]> {
    const isPendingQueue = !status || status === ApprovalReviewStatus.PENDING;
    const reviews = await this.prisma.approvalReview.findMany({
      where: isPendingQueue
        ? { status: ApprovalReviewStatus.PENDING }
        : { status },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { title: true }
        }
      }
    });

    const seenBookIds = new Set<string>();
    return reviews
      .filter((review) => {
        if (!isPendingQueue) return true;
        if (seenBookIds.has(review.bookId)) return false;
        seenBookIds.add(review.bookId);
        return true;
      })
      .map((review) => this.mapToDto(review));
  }

  async getReviewById(id: string): Promise<ApprovalReviewResponseDto> {
    const review = await this.prisma.approvalReview.findUnique({
      where: { id },
      include: {
        book: {
          select: { title: true }
        }
      }
    });

    if (!review) {
      throw new NotFoundException(`Approval review with ID ${id} not found`);
    }

    return this.mapToDto(review);
  }

  async approveReview(id: string, reviewerId: string, dto?: ApproveReviewDto): Promise<ApprovalReviewResponseDto> {
    const review = await this.prisma.approvalReview.findUnique({
      where: { id },
      include: { book: true }
    });
    if (!review) {
      throw new NotFoundException(`Approval review with ID ${id} not found`);
    }

    ApprovalTransitionPolicy.assertCanDecide(review.status, ApprovalReviewStatus.APPROVED);

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.approvalReview.update({
        where: { id },
        data: {
          status: ApprovalReviewStatus.APPROVED,
          reviewerId,
          reason: dto?.comment ?? null,
          decidedAt: new Date()
        },
        include: { book: { select: { title: true } } }
      });

      await tx.book.update({
        where: { id: review.bookId },
        data: { status: BookStatus.PUBLISHED }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: review.bookId,
          actorId: reviewerId,
          action: BookAuditAction.APPROVED,
          message: dto?.comment ? `Approved with comment: ${dto.comment}` : 'Document approved'
        }
      });

      return res;
    });

    // Notify document creator
    await this.notifications.createNotification({
      recipientId: review.book.createdById,
      type: NotificationType.SYSTEM,
      title: 'Document Approved',
      body: `Your document "${review.book.title}" has been approved.`,
      payload: { bookId: review.bookId, reviewId: review.id },
      actionHref: `/admin/documents/${review.bookId}`
    });

    return this.mapToDto(updated);
  }

  async approveAndPublish(id: string, reviewerId: string, dto?: ApproveReviewDto): Promise<ApprovalReviewResponseDto> {
    const review = await this.prisma.approvalReview.findUnique({
      where: { id },
      include: { book: true }
    });
    if (!review) {
      throw new NotFoundException(`Approval review with ID ${id} not found`);
    }

    ApprovalTransitionPolicy.assertCanDecide(review.status, ApprovalReviewStatus.APPROVED);

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.approvalReview.update({
        where: { id },
        data: {
          status: ApprovalReviewStatus.APPROVED,
          reviewerId,
          reason: dto?.comment ?? null,
          decidedAt: new Date()
        },
        include: { book: { select: { title: true } } }
      });

      await tx.book.update({
        where: { id: review.bookId },
        data: { status: BookStatus.PUBLISHED }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: review.bookId,
          actorId: reviewerId,
          action: BookAuditAction.PUBLISHED,
          message: dto?.comment ? `Approved and published: ${dto.comment}` : 'Document approved and published'
        }
      });

      return res;
    });

    // Notify document creator
    await this.notifications.createNotification({
      recipientId: review.book.createdById,
      type: NotificationType.DOCUMENT_AVAILABLE,
      title: 'Document Published',
      body: `Your document "${review.book.title}" has been approved and published to the catalogue.`,
      payload: { bookId: review.bookId, reviewId: review.id },
      actionHref: `/catalogue/${review.bookId}`
    });

    return this.mapToDto(updated);
  }

  async rejectReview(id: string, reviewerId: string, dto: RejectReviewDto): Promise<ApprovalReviewResponseDto> {
    const review = await this.prisma.approvalReview.findUnique({
      where: { id },
      include: { book: true }
    });
    if (!review) {
      throw new NotFoundException(`Approval review with ID ${id} not found`);
    }

    ApprovalTransitionPolicy.assertCanDecide(review.status, ApprovalReviewStatus.REJECTED);

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.approvalReview.update({
        where: { id },
        data: {
          status: ApprovalReviewStatus.REJECTED,
          reviewerId,
          reason: dto.reason,
          decidedAt: new Date()
        },
        include: { book: { select: { title: true } } }
      });

      await tx.book.update({
        where: { id: review.bookId },
        data: { status: BookStatus.REJECTED }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: review.bookId,
          actorId: reviewerId,
          action: BookAuditAction.REJECTED,
          message: `Rejected: ${dto.reason}`
        }
      });

      return res;
    });

    // Notify creator
    await this.notifications.createNotification({
      recipientId: review.book.createdById,
      type: NotificationType.SYSTEM,
      title: 'Document Rejected',
      body: `Your document "${review.book.title}" was rejected. Reason: ${dto.reason}`,
      payload: { bookId: review.bookId, reviewId: review.id },
      actionHref: `/admin/documents/${review.bookId}`
    });

    return this.mapToDto(updated);
  }

  async requestCorrection(id: string, reviewerId: string, dto: RequestCorrectionDto): Promise<ApprovalReviewResponseDto> {
    const review = await this.prisma.approvalReview.findUnique({
      where: { id },
      include: { book: true }
    });
    if (!review) {
      throw new NotFoundException(`Approval review with ID ${id} not found`);
    }

    ApprovalTransitionPolicy.assertCanDecide(review.status, ApprovalReviewStatus.CORRECTION_REQUESTED);

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.approvalReview.update({
        where: { id },
        data: {
          status: ApprovalReviewStatus.CORRECTION_REQUESTED,
          reviewerId,
          reason: dto.reason,
          requestedChanges: dto.requestedChanges,
          decidedAt: new Date()
        },
        include: { book: { select: { title: true } } }
      });

      await tx.book.update({
        where: { id: review.bookId },
        data: { status: BookStatus.CORRECTION_REQUIRED }
      });

      await tx.bookAuditEvent.create({
        data: {
          bookId: review.bookId,
          actorId: reviewerId,
          action: BookAuditAction.CORRECTION_REQUESTED,
          message: `Correction requested: ${dto.reason}. Requested changes: ${dto.requestedChanges}`
        }
      });

      return res;
    });

    // Notify creator
    await this.notifications.createNotification({
      recipientId: review.book.createdById,
      type: NotificationType.CORRECTION_REQUESTED,
      title: 'Correction Requested',
      body: `Document "${review.book.title}" requires corrections. Reason: ${dto.reason}. Requested: ${dto.requestedChanges}`,
      payload: { bookId: review.bookId, reviewId: review.id },
      actionHref: `/admin/documents/${review.bookId}/edit`
    });

    return this.mapToDto(updated);
  }

  private mapToDto(review: any): ApprovalReviewResponseDto {
    return {
      id: review.id,
      bookId: review.bookId,
      bookFileId: review.bookFileId,
      processingJobId: review.processingJobId,
      round: review.round,
      bookTitle: review.book?.title ?? null,
      reviewerId: review.reviewerId ?? null,
      status: review.status,
      reason: review.reason ?? null,
      requestedChanges: review.requestedChanges ?? null,
      decidedAt: review.decidedAt ? review.decidedAt.toISOString() : null,
      supersededAt: review.supersededAt ? review.supersededAt.toISOString() : null,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    };
  }
}
