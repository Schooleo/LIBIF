import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';

export type RateLimitCheckResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
  eventType?: ReaderAccessEventType;
  reasonCode?: ReaderAccessReasonCode;
  riskLevel?: ReaderAccessRiskLevel;
};

@Injectable()
export class ReaderRateLimitService implements OnModuleDestroy {
  private readonly logger = new Logger(ReaderRateLimitService.name);
  private redis?: Redis;

  // In-memory fallback tracking for testing or non-Redis execution
  private inMemoryWindow = new Map<string, number[]>();
  private inMemorySessions = new Map<string, Map<string, number>>();
  private inMemoryInvalidProbes = new Map<string, number[]>();

  // Thresholds
  private readonly PAGE_RATE_LIMIT_PER_MIN = 30;
  private readonly IMPOSSIBLE_READING_RATE_PER_MIN = 60;
  private readonly MAX_CONCURRENT_SESSIONS = 3;
  private readonly MAX_INVALID_PROBES = 5;

  constructor(config: ConfigService) {
    const redisUrl = config.get<string>('REDIS_URL');
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, { lazyConnect: true });
        this.redis.connect().catch((err) => {
          this.logger.warn(`Redis connection error: ${(err as Error).message}`);
        });
      } catch (err) {
        this.logger.warn(`Failed to initialize Redis client: ${(err as Error).message}`);
      }
    }
  }

  async checkPageAccessRate(
    userId: string,
    sessionId: string | undefined,
    pageNumber: number,
    pageCount: number,
  ): Promise<RateLimitCheckResult> {
    const now = Date.now();
    const oneMinAgo = now - 60 * 1000;
    const tenMinAgo = now - 10 * 60 * 1000;

    // Check invalid page probe first
    if (pageNumber < 1 || pageNumber > pageCount) {
      const probes = this.recordInvalidProbe(userId, now, tenMinAgo);
      if (probes > this.MAX_INVALID_PROBES) {
        return {
          allowed: false,
          retryAfterSeconds: 60,
          eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
          reasonCode: ReaderAccessReasonCode.REPEATED_INVALID_PAGE,
          riskLevel: ReaderAccessRiskLevel.HIGH,
        };
      }
      return {
        allowed: false,
        retryAfterSeconds: 5,
        eventType: ReaderAccessEventType.PAGE_DENIED,
        reasonCode: ReaderAccessReasonCode.PAGE_OUT_OF_RANGE,
        riskLevel: ReaderAccessRiskLevel.LOW,
      };
    }

    // Record request timestamp
    const requestTimestamps = this.recordPageRequest(userId, now, oneMinAgo);
    const activeSessions = this.recordActiveSession(userId, sessionId, now, oneMinAgo);

    // 1. Check Scrape / Impossible reading rate (>60 pages/min)
    if (requestTimestamps.length > this.IMPOSSIBLE_READING_RATE_PER_MIN) {
      return {
        allowed: false,
        retryAfterSeconds: 120,
        eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
        reasonCode: ReaderAccessReasonCode.IMPOSSIBLE_READING_RATE,
        riskLevel: ReaderAccessRiskLevel.HIGH,
      };
    }

    // 2. Check Concurrent session limit
    if (activeSessions > this.MAX_CONCURRENT_SESSIONS) {
      return {
        allowed: false,
        retryAfterSeconds: 60,
        eventType: ReaderAccessEventType.RATE_LIMITED,
        reasonCode: ReaderAccessReasonCode.PARALLEL_SESSION_ABUSE,
        riskLevel: ReaderAccessRiskLevel.MEDIUM,
      };
    }

    // 3. Check Page rate limit (>30 pages/min)
    if (requestTimestamps.length > this.PAGE_RATE_LIMIT_PER_MIN) {
      const oldestInWindow = requestTimestamps[0];
      const resetInSeconds = Math.ceil((oldestInWindow + 60000 - now) / 1000);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, resetInSeconds),
        eventType: ReaderAccessEventType.RATE_LIMITED,
        reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
        riskLevel: ReaderAccessRiskLevel.LOW,
      };
    }

    return { allowed: true };
  }

  private recordPageRequest(userId: string, now: number, windowStart: number): number[] {
    let timestamps = this.inMemoryWindow.get(userId) ?? [];
    timestamps = timestamps.filter((t) => t > windowStart);
    timestamps.push(now);
    this.inMemoryWindow.set(userId, timestamps);
    return timestamps;
  }

  private recordActiveSession(
    userId: string,
    sessionId: string | undefined,
    now: number,
    windowStart: number,
  ): number {
    if (!sessionId) return 1;
    let sessions = this.inMemorySessions.get(userId);
    if (!sessions) {
      sessions = new Map<string, number>();
      this.inMemorySessions.set(userId, sessions);
    }
    sessions.set(sessionId, now);
    // Cleanup old sessions
    for (const [sId, time] of sessions.entries()) {
      if (time <= windowStart) {
        sessions.delete(sId);
      }
    }
    return sessions.size;
  }

  private recordInvalidProbe(userId: string, now: number, windowStart: number): number {
    let probes = this.inMemoryInvalidProbes.get(userId) ?? [];
    probes = probes.filter((t) => t > windowStart);
    probes.push(now);
    this.inMemoryInvalidProbes.set(userId, probes);
    return probes.length;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit().catch(() => {});
    }
  }
}
