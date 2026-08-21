import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import {
  CommittedReaderRiskFact,
  ReaderAccessEventInput,
  READER_RISK_EVENT_SINK,
  ReaderRiskEventSink,
} from './contracts/reader-access.contract';

@Injectable()
export class ReaderAccessAuditService {
  private readonly logger = new Logger(ReaderAccessAuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(READER_RISK_EVENT_SINK)
    private readonly riskEventSink?: ReaderRiskEventSink,
  ) {}

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

      const fact = this.mapToCommittedRiskFact({
        id: event.id,
        eventType: event.eventType,
        riskLevel: event.riskLevel,
        reasonCode: event.reasonCode,
        bookId: event.bookId,
        pageNumber: event.pageNumber,
        createdAt: event.createdAt,
      });

      if (fact && this.riskEventSink) {
        try {
          await this.riskEventSink.publishCommittedRiskFact(fact);
        } catch (error) {
          this.logger.warn(`Risk alert handoff failed for ${event.id}: ${errorMessage(error)}`);
        }
      }

      return event;
    } catch (error) {
      this.logger.error(
        `Failed to persist ReaderAccessEvent for ${redactId(input.userId)}/${redactId(input.bookId)}: ${errorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  mapToCommittedRiskFact(event: {
    id: string;
    eventType: ReaderAccessEventType;
    riskLevel: ReaderAccessRiskLevel;
    reasonCode: ReaderAccessReasonCode | null;
    bookId: string;
    pageNumber: number | null;
    createdAt: Date;
  }): CommittedReaderRiskFact | null {
    if (!event.reasonCode) {
      return null;
    }

    const isCommittedRiskEvent =
      event.eventType === ReaderAccessEventType.RATE_LIMITED ||
      event.eventType === ReaderAccessEventType.SCRAPE_SUSPECTED;

    if (!isCommittedRiskEvent) {
      return null;
    }

    if (
      event.riskLevel !== ReaderAccessRiskLevel.LOW &&
      event.riskLevel !== ReaderAccessRiskLevel.MEDIUM &&
      event.riskLevel !== ReaderAccessRiskLevel.HIGH
    ) {
      return null;
    }

    return {
      accessEventId: event.id,
      eventType: event.eventType as CommittedReaderRiskFact['eventType'],
      riskLevel: event.riskLevel,
      reasonCode: event.reasonCode,
      documentId: event.bookId,
      pageNumber: event.pageNumber ?? undefined,
      occurredAt: event.createdAt,
    };
  }
}

function redactId(value: string | undefined): string {
  if (!value) return 'unknown';
  return `…${value.slice(-6)}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
