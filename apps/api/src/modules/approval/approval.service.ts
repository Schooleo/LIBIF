import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalReviewStatus } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ApprovalReviewResponseDto } from './dto/approval-review.dto';

@Injectable()
export class ApprovalService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listPendingReviews(status?: ApprovalReviewStatus): Promise<ApprovalReviewResponseDto[]> {
    const reviews = await this.prisma.approvalReview.findMany({
      where: status ? { status } : { status: ApprovalReviewStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { title: true }
        }
      }
    });

    return reviews.map((r) => this.mapToDto(r));
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

  private mapToDto(review: any): ApprovalReviewResponseDto {
    return {
      id: review.id,
      bookId: review.bookId,
      bookTitle: review.book?.title ?? null,
      reviewerId: review.reviewerId ?? null,
      status: review.status,
      reason: review.reason ?? null,
      requestedChanges: review.requestedChanges ?? null,
      decidedAt: review.decidedAt ? review.decidedAt.toISOString() : null,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    };
  }
}
