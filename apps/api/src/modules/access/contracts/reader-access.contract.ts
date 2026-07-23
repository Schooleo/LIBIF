import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel
} from '../../../generated/prisma/client';

export const PERSONALIZED_PAGE_CACHE_CONTROL = 'private, no-store' as const;

export type ReaderAccessEventInput = Readonly<{
  eventType: ReaderAccessEventType;
  riskLevel: ReaderAccessRiskLevel;
  reasonCode?: ReaderAccessReasonCode;
  userId: string;
  sessionId?: string;
  bookId: string;
  bookFileId?: string;
  pageNumber?: number;
  traceFingerprint?: string;
  createdAt: Date;
}>;

export type CommittedReaderRiskFact = Readonly<{
  accessEventId: string;
  eventType:
    | typeof ReaderAccessEventType.RATE_LIMITED
    | typeof ReaderAccessEventType.SCRAPE_SUSPECTED;
  riskLevel:
    | typeof ReaderAccessRiskLevel.LOW
    | typeof ReaderAccessRiskLevel.MEDIUM
    | typeof ReaderAccessRiskLevel.HIGH;
  reasonCode: ReaderAccessReasonCode;
  documentId: string;
  pageNumber?: number;
  occurredAt: Date;
}>;
