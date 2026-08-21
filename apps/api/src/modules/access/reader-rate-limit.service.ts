import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';
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

export class DetectorDependencyUnavailableError extends Error {
  constructor(message = 'Protected page access is temporarily unavailable.') {
    super(message);
    this.name = DetectorDependencyUnavailableError.name;
  }
}

@Injectable()
export class ReaderRateLimitService implements OnModuleDestroy {
  private readonly logger = new Logger(ReaderRateLimitService.name);
  private readonly redisConfigured: boolean;
  private readonly allowInMemoryFallback: boolean;
  private redis?: Redis;

  private inMemoryWindow = new Map<string, number[]>();
  private inMemorySessions = new Map<string, Map<string, number>>();
  private inMemoryInvalidProbes = new Map<string, number[]>();

  private readonly PAGE_RATE_LIMIT_PER_MIN: number;
  private readonly IMPOSSIBLE_READING_RATE_PER_MIN: number;
  private readonly MAX_CONCURRENT_SESSIONS: number;
  private readonly MAX_INVALID_PROBES: number;
  private readonly REQUEST_WINDOW_MS = 60 * 1000;
  private readonly INVALID_PROBE_WINDOW_MS = 10 * 60 * 1000;
  private readonly REQUEST_WINDOW_SECONDS = 60;
  private readonly INVALID_PROBE_WINDOW_SECONDS = 10 * 60;
  private readonly KEY_PREFIX = 'reader-access:v1';

  constructor(config: ConfigService) {
    const redisUrl = config.get<string>('REDIS_URL')?.trim();
    this.redisConfigured = Boolean(redisUrl);
    this.allowInMemoryFallback =
      (config.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'test' ||
      config.get<string>('LIBIF_ALLOW_IN_MEMORY_READER_LIMITS') === 'true';
    this.PAGE_RATE_LIMIT_PER_MIN = positiveInteger(
      config.get<string>('READER_PAGE_RATE_LIMIT_PER_MIN'),
      30,
    );
    this.IMPOSSIBLE_READING_RATE_PER_MIN = Math.max(
      this.PAGE_RATE_LIMIT_PER_MIN + 1,
      positiveInteger(config.get<string>('READER_IMPOSSIBLE_RATE_PER_MIN'), 60),
    );
    this.MAX_CONCURRENT_SESSIONS = positiveInteger(
      config.get<string>('READER_MAX_CONCURRENT_SESSIONS'),
      3,
    );
    this.MAX_INVALID_PROBES = positiveInteger(
      config.get<string>('READER_MAX_INVALID_PROBES'),
      5,
    );

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
    documentId = 'global',
  ): Promise<RateLimitCheckResult> {
    if (this.redis) {
      return this.checkPageAccessRateRedis(userId, sessionId, pageNumber, pageCount, documentId);
    }

    if (this.redisConfigured || !this.allowInMemoryFallback) {
      throw new DetectorDependencyUnavailableError();
    }

    return this.checkPageAccessRateInMemory(userId, sessionId, pageNumber, pageCount, documentId);
  }

  private async checkPageAccessRateRedis(
    userId: string,
    sessionId: string | undefined,
    pageNumber: number,
    pageCount: number,
    documentId: string,
  ): Promise<RateLimitCheckResult> {
    try {
      const now = Date.now();
      const scope = hashIdentifier(`${userId}:${documentId}`);
      const requestKey = `${this.KEY_PREFIX}:requests:${scope}`;
      const sessionKey = `${this.KEY_PREFIX}:sessions:${scope}`;
      const invalidKey = `${this.KEY_PREFIX}:invalid:${scope}`;
      const raw = (await this.redis!.eval(
        REDIS_RATE_LIMIT_SCRIPT,
        3,
        requestKey,
        sessionKey,
        invalidKey,
        String(now),
        String(pageNumber),
        String(pageCount),
        sessionId ? hashIdentifier(sessionId) : '',
        String(this.PAGE_RATE_LIMIT_PER_MIN),
        String(this.IMPOSSIBLE_READING_RATE_PER_MIN),
        String(this.MAX_CONCURRENT_SESSIONS),
        String(this.MAX_INVALID_PROBES),
        String(this.REQUEST_WINDOW_MS),
        String(this.INVALID_PROBE_WINDOW_MS),
        String(this.REQUEST_WINDOW_SECONDS),
        String(this.INVALID_PROBE_WINDOW_SECONDS),
        randomUUID(),
      )) as [number | string, number | string | null | undefined, string | undefined, string | undefined, string | undefined];

      return parseRedisResult(raw);
    } catch (error) {
      this.logger.error(`Redis-backed reader access checks failed: ${errorMessage(error)}`);
      throw new DetectorDependencyUnavailableError();
    }
  }

  private async checkPageAccessRateInMemory(
    userId: string,
    sessionId: string | undefined,
    pageNumber: number,
    pageCount: number,
    documentId: string,
  ): Promise<RateLimitCheckResult> {
    const now = Date.now();
    const oneMinAgo = now - this.REQUEST_WINDOW_MS;
    const tenMinAgo = now - this.INVALID_PROBE_WINDOW_MS;
    const scope = hashIdentifier(`${userId}:${documentId}`);

    if (pageNumber < 1 || pageNumber > pageCount) {
      const probes = this.recordInvalidProbe(scope, now, tenMinAgo);
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

    const requestTimestamps = this.recordPageRequest(scope, now, oneMinAgo);
    const activeSessions = this.recordActiveSession(
      scope,
      sessionId ? hashIdentifier(sessionId) : undefined,
      now,
      oneMinAgo,
    );

    if (requestTimestamps.length > this.IMPOSSIBLE_READING_RATE_PER_MIN) {
      return {
        allowed: false,
        retryAfterSeconds: 120,
        eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
        reasonCode: ReaderAccessReasonCode.IMPOSSIBLE_READING_RATE,
        riskLevel: ReaderAccessRiskLevel.HIGH,
      };
    }

    if (activeSessions > this.MAX_CONCURRENT_SESSIONS) {
      return {
        allowed: false,
        retryAfterSeconds: 60,
        eventType: ReaderAccessEventType.RATE_LIMITED,
        reasonCode: ReaderAccessReasonCode.PARALLEL_SESSION_ABUSE,
        riskLevel: ReaderAccessRiskLevel.MEDIUM,
      };
    }

    if (requestTimestamps.length > this.PAGE_RATE_LIMIT_PER_MIN) {
      const oldestInWindow = requestTimestamps[0];
      const resetInSeconds = Math.ceil((oldestInWindow + this.REQUEST_WINDOW_MS - now) / 1000);
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
      await Promise.resolve(this.redis.quit()).catch(() => {});
    }
  }
}

const REDIS_RATE_LIMIT_SCRIPT = `
local requestKey = KEYS[1]
local sessionKey = KEYS[2]
local invalidKey = KEYS[3]

local now = tonumber(ARGV[1])
local pageNumber = tonumber(ARGV[2])
local pageCount = tonumber(ARGV[3])
local sessionId = ARGV[4]
local pageRateLimit = tonumber(ARGV[5])
local impossibleRateLimit = tonumber(ARGV[6])
local maxConcurrentSessions = tonumber(ARGV[7])
local maxInvalidProbes = tonumber(ARGV[8])
local requestWindowMs = tonumber(ARGV[9])
local invalidWindowMs = tonumber(ARGV[10])
local requestTtlSeconds = tonumber(ARGV[11])
local invalidTtlSeconds = tonumber(ARGV[12])
local requestMember = ARGV[13]

local requestWindowStart = now - requestWindowMs
local invalidWindowStart = now - invalidWindowMs

if pageNumber < 1 or pageNumber > pageCount then
  redis.call('ZREMRANGEBYSCORE', invalidKey, 0, invalidWindowStart)
  redis.call('ZADD', invalidKey, now, requestMember)
  redis.call('EXPIRE', invalidKey, invalidTtlSeconds)
  local invalidCount = redis.call('ZCARD', invalidKey)
  if invalidCount > maxInvalidProbes then
    return {0, 60, 'SCRAPE_SUSPECTED', 'REPEATED_INVALID_PAGE', 'HIGH'}
  end
  return {0, 5, 'PAGE_DENIED', 'PAGE_OUT_OF_RANGE', 'LOW'}
end

redis.call('ZREMRANGEBYSCORE', requestKey, 0, requestWindowStart)
redis.call('ZADD', requestKey, now, requestMember)
redis.call('EXPIRE', requestKey, requestTtlSeconds)
local requestCount = redis.call('ZCARD', requestKey)

local activeSessions = 1
if sessionId ~= nil and sessionId ~= '' then
  redis.call('ZREMRANGEBYSCORE', sessionKey, 0, requestWindowStart)
  redis.call('ZADD', sessionKey, now, sessionId)
  redis.call('EXPIRE', sessionKey, requestTtlSeconds)
  activeSessions = redis.call('ZCARD', sessionKey)
end

if requestCount > impossibleRateLimit then
  return {0, 120, 'SCRAPE_SUSPECTED', 'IMPOSSIBLE_READING_RATE', 'HIGH'}
end

if activeSessions > maxConcurrentSessions then
  return {0, 60, 'RATE_LIMITED', 'PARALLEL_SESSION_ABUSE', 'MEDIUM'}
end

if requestCount > pageRateLimit then
  local oldest = redis.call('ZRANGE', requestKey, 0, 0, 'WITHSCORES')
  local oldestScore = tonumber(oldest[2])
  local retryAfter = math.ceil(((oldestScore + requestWindowMs) - now) / 1000)
  if retryAfter < 1 then
    retryAfter = 1
  end
  return {0, retryAfter, 'RATE_LIMITED', 'RATE_LIMIT_EXCEEDED', 'LOW'}
end

return {1}
`;

function parseRedisResult(
  raw: [number | string, number | string | null | undefined, string | undefined, string | undefined, string | undefined],
): RateLimitCheckResult {
  const allowed = Number(raw[0]) === 1;
  if (allowed) {
    return { allowed: true };
  }

  return {
    allowed: false,
    retryAfterSeconds: raw[1] === undefined ? undefined : Number(raw[1]),
    eventType: raw[2] as ReaderAccessEventType,
    reasonCode: raw[3] as ReaderAccessReasonCode,
    riskLevel: raw[4] as ReaderAccessRiskLevel,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
