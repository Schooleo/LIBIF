import { ConflictException } from '@nestjs/common';
import { ApprovalReviewStatus } from '../../generated/prisma/client';

export class ApprovalTransitionPolicy {
  private static readonly VALID_DECISIONS: Record<ApprovalReviewStatus, ApprovalReviewStatus[]> = {
    [ApprovalReviewStatus.PENDING]: [
      ApprovalReviewStatus.APPROVED,
      ApprovalReviewStatus.REJECTED,
      ApprovalReviewStatus.CORRECTION_REQUESTED,
      ApprovalReviewStatus.SUPERSEDED
    ],
    [ApprovalReviewStatus.APPROVED]: [],
    [ApprovalReviewStatus.REJECTED]: [],
    [ApprovalReviewStatus.CORRECTION_REQUESTED]: [],
    [ApprovalReviewStatus.SUPERSEDED]: []
  };

  static canDecide(currentStatus: ApprovalReviewStatus, targetStatus: ApprovalReviewStatus): boolean {
    const allowed = this.VALID_DECISIONS[currentStatus];
    return allowed ? allowed.includes(targetStatus) : false;
  }

  static assertCanDecide(currentStatus: ApprovalReviewStatus, targetStatus: ApprovalReviewStatus): void {
    if (currentStatus !== ApprovalReviewStatus.PENDING) {
      throw new ConflictException(
        `Cannot decide approval review with ID that is already in status "${currentStatus}". Review decisions are final.`
      );
    }
    if (!this.canDecide(currentStatus, targetStatus)) {
      throw new ConflictException(`Invalid approval review transition from ${currentStatus} to ${targetStatus}`);
    }
  }
}
