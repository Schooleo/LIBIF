import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { ProcessingJobStatus } from '../../generated/prisma/client';

export class ProcessingTransitionPolicy {
  private static readonly VALID_TRANSITIONS: Record<ProcessingJobStatus, ProcessingJobStatus[]> = {
    [ProcessingJobStatus.QUEUED]: [
      ProcessingJobStatus.RUNNING,
      ProcessingJobStatus.CANCELLED,
      ProcessingJobStatus.SUPERSEDED
    ],
    [ProcessingJobStatus.RUNNING]: [
      ProcessingJobStatus.SUCCEEDED,
      ProcessingJobStatus.FAILED,
      ProcessingJobStatus.CANCELLED,
      ProcessingJobStatus.SUPERSEDED
    ],
    [ProcessingJobStatus.SUCCEEDED]: [],
    [ProcessingJobStatus.FAILED]: [ProcessingJobStatus.QUEUED],
    [ProcessingJobStatus.CANCELLED]: [],
    [ProcessingJobStatus.SUPERSEDED]: []
  };

  private static readonly TERMINAL_STATUSES: ProcessingJobStatus[] = [
    ProcessingJobStatus.SUCCEEDED,
    ProcessingJobStatus.FAILED,
    ProcessingJobStatus.CANCELLED,
    ProcessingJobStatus.SUPERSEDED
  ];

  static isTerminal(status: ProcessingJobStatus): boolean {
    return this.TERMINAL_STATUSES.includes(status);
  }

  static canTransition(from: ProcessingJobStatus, to: ProcessingJobStatus): boolean {
    const allowed = this.VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  static assertCanTransition(from: ProcessingJobStatus, to: ProcessingJobStatus): void {
    if (!this.canTransition(from, to)) {
      if (this.isTerminal(from)) {
        throw new UnprocessableEntityException(`Cannot transition processing job that is already in terminal state ${from}`);
      }
      throw new BadRequestException(`Invalid processing job state transition from ${from} to ${to}`);
    }
  }

  static assertCanRetry(status: ProcessingJobStatus): void {
    if (status !== ProcessingJobStatus.FAILED) {
      throw new BadRequestException(`Only FAILED processing jobs can be retried (current status: ${status})`);
    }
  }

  static assertCanCancel(status: ProcessingJobStatus): void {
    if (this.isTerminal(status)) {
      throw new BadRequestException(`Cannot cancel processing job that is already in terminal state ${status}`);
    }
  }
}
