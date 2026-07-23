import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import {
  CommittedReaderRiskFact,
  ReaderAccessEventInput,
} from './contracts/reader-access.contract';

@Injectable()
export class ReaderAccessAuditService {
  private readonly logger = new Logger(ReaderAccessAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Durably records a reader access event in PostgreSQL.
   * Fails closed if audit recording throws an error.
   */
  async recordEvent(input: ReaderAccessEventInput) {
    try {
      const event = await this.prisma.readerAccessEvent.create({
        data: {
          eventType: input.eventType,
          riskLevel: input.riskLevel,
          reasonCode: input.reasonCode,
          userId: input.userId,
          sessionId: input.sessionId,
          bookId: input.bookId,
          bookFileId: input.bookFileId,
          pageNumber: input.pageNumber,
          traceFingerprint: input.traceFingerprint,
          createdAt: input.createdAt,
        },
      });
      return event;
    } catch (error) {
      this.logger.error(
        `Failed to persist ReaderAccessEvent for user ${input.userId}, book ${input.bookId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Helper to construct a CommittedReaderRiskFact fact from a persisted risk event.
   */
  mapToCommittedRiskFact(event: {
    id: string;
    eventType: ReaderAccessEventType;
    riskLevel: ReaderAccessRiskLevel;
    reasonCode: ReaderAccessReasonCode | null;
    bookId: string;
    pageNumber: number | null;
    createdAt: Date;
  }): CommittedReaderRiskFact | null {
    if (
      event.eventType !== ReaderAccessEventType.RATE_LIMITED &&
      event.eventType !== ReaderAccessEventType.SCRAPE_SUSPECTED
    ) {
      return null;
    }

    if (
      event.riskLevel !== ReaderAccessRiskLevel.LOW &&
      event.riskLevel !== ReaderAccessRiskLevel.MEDIUM &&
      event.riskLevel !== ReaderAccessRiskLevel.HIGH
    ) {
      return null;
    }

    if (!event.reasonCode) {
      return null;
    }

    return {
      accessEventId: event.id,
      eventType: event.eventType,
      riskLevel: event.riskLevel,
      reasonCode: event.reasonCode,
      documentId: event.bookId,
      pageNumber: event.pageNumber ?? undefined,
      occurredAt: event.createdAt,
    };
  }
}
