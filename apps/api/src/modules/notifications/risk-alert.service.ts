import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import {
  NotificationStatus,
  NotificationType,
  ReaderAccessRiskLevel,
  UserAccountStatus,
  UserRole,
  type Prisma
} from '../../generated/prisma/client';
import type { CommittedReaderRiskFact } from '../access/contracts/reader-access.contract';
import type { ReaderRiskEventSink } from '../access/contracts/reader-access.contract';
import { PrismaService } from '../database/prisma.service';

const DEFAULT_DEDUP_WINDOW_SECONDS = 15 * 60;
const MIN_DEDUP_WINDOW_SECONDS = 60;
const MAX_DEDUP_WINDOW_SECONDS = 24 * 60 * 60;
const RISK_ALERT_DEDUP_WINDOW_SECONDS_KEY = 'LIBIF_RISK_ALERT_DEDUP_WINDOW_SECONDS';

const RISK_ALERT_TITLE = 'Reader access risk alert';
const RISK_ALERT_BODY = 'Suspicious reader activity requires review.';
const RISK_ALERT_ACTION_HREF = '/admin/reports/reader-access' as const;

type RiskAlertPayload = Readonly<{
  eventType: CommittedReaderRiskFact['eventType'];
  riskLevel: CommittedReaderRiskFact['riskLevel'];
  reasonCode: CommittedReaderRiskFact['reasonCode'];
  dedupWindowSeconds: number;
  dedupWindowStart: string;
  dedupWindowEnd: string;
}>;

@Injectable()
export class RiskAlertService implements ReaderRiskEventSink {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly config: ConfigService
  ) {}

  async publishCommittedRiskFact(fact: CommittedReaderRiskFact): Promise<void> {
    await this.createAlertsForCommittedRiskFact(fact);
  }

  async createAlertsForCommittedRiskFact(fact: CommittedReaderRiskFact): Promise<number> {
    if (fact.riskLevel !== ReaderAccessRiskLevel.HIGH) {
      return 0;
    }

    const dedupWindowSeconds = this.getDedupWindowSeconds();
    const { windowStart, windowEnd } = toUtcWindow(fact.occurredAt, dedupWindowSeconds);
    const recipients = await this.prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] },
        status: UserAccountStatus.ACTIVE,
        deactivatedAt: null
      },
      select: { id: true }
    });

    if (recipients.length === 0) {
      return 0;
    }

    const payload: RiskAlertPayload = {
      eventType: fact.eventType,
      riskLevel: fact.riskLevel,
      reasonCode: fact.reasonCode,
      dedupWindowSeconds,
      dedupWindowStart: windowStart.toISOString(),
      dedupWindowEnd: windowEnd.toISOString()
    };

    const data: Prisma.NotificationCreateManyInput[] = recipients.map(({ id: recipientId }) => ({
      id: buildNotificationId({ recipientId, fact, windowStart, dedupWindowSeconds }),
      recipientId,
      type: NotificationType.SYSTEM,
      status: NotificationStatus.UNREAD,
      title: RISK_ALERT_TITLE,
      body: RISK_ALERT_BODY,
      payload,
      actionHref: RISK_ALERT_ACTION_HREF
    }));

    const result = await this.prisma.notification.createMany({
      data,
      skipDuplicates: true
    });

    return result.count;
  }

  private getDedupWindowSeconds(): number {
    const configured = Number(this.config.get(RISK_ALERT_DEDUP_WINDOW_SECONDS_KEY));
    if (!Number.isFinite(configured)) {
      return DEFAULT_DEDUP_WINDOW_SECONDS;
    }

    return Math.min(MAX_DEDUP_WINDOW_SECONDS, Math.max(MIN_DEDUP_WINDOW_SECONDS, Math.floor(configured)));
  }
}

function buildNotificationId({
  recipientId,
  fact,
  windowStart,
  dedupWindowSeconds
}: {
  recipientId: string;
  fact: CommittedReaderRiskFact;
  windowStart: Date;
  dedupWindowSeconds: number;
}): string {
  const documentScopeHash = createHash('sha256')
    .update(JSON.stringify({ documentId: fact.documentId, pageNumber: fact.pageNumber ?? null }))
    .digest('hex');

  return createHash('sha256')
    .update(
      JSON.stringify({
        recipientId,
        eventType: fact.eventType,
        reasonCode: fact.reasonCode,
        dedupWindowSeconds,
        dedupWindowStart: windowStart.toISOString(),
        documentScopeHash
      })
    )
    .digest('hex');
}

function toUtcWindow(occurredAt: Date, dedupWindowSeconds: number): { windowStart: Date; windowEnd: Date } {
  const windowMs = dedupWindowSeconds * 1000;
  const windowStartMs = Math.floor(occurredAt.getTime() / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);
  const windowEnd = new Date(windowStartMs + windowMs);
  return { windowStart, windowEnd };
}

export const RiskAlertConstants = {
  DEFAULT_DEDUP_WINDOW_SECONDS,
  MIN_DEDUP_WINDOW_SECONDS,
  MAX_DEDUP_WINDOW_SECONDS,
  RISK_ALERT_DEDUP_WINDOW_SECONDS_KEY,
  RISK_ALERT_TITLE,
  RISK_ALERT_BODY,
  RISK_ALERT_ACTION_HREF
} as const;
