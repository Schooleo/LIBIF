import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import {
  DetectorDependencyUnavailableError,
  ReaderRateLimitService,
} from './reader-rate-limit.service';

describe('ReaderRateLimitService', () => {
  let service: ReaderRateLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaderRateLimitService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ReaderRateLimitService>(ReaderRateLimitService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('allows normal sequential page access', async () => {
    const res = await service.checkPageAccessRate('usr-1', 'sess-1', 1, 10);
    expect(res.allowed).toBe(true);
  });

  it('denies out of bounds page access', async () => {
    const res = await service.checkPageAccessRate('usr-1', 'sess-1', 999, 10);
    expect(res.allowed).toBe(false);
    expect(res.reasonCode).toBe('PAGE_OUT_OF_RANGE');
  });

  it('triggers repeated invalid page scrape detection after multiple invalid probes', async () => {
    for (let i = 0; i < 5; i++) {
      await service.checkPageAccessRate('usr-probe', 'sess-1', 99, 10);
    }
    const res = await service.checkPageAccessRate('usr-probe', 'sess-1', 99, 10);
    expect(res.allowed).toBe(false);
    expect(res.eventType).toBe('SCRAPE_SUSPECTED');
    expect(res.reasonCode).toBe('REPEATED_INVALID_PAGE');
  });

  it('detects page rate limit when requests exceed threshold', async () => {
    for (let i = 0; i < 30; i++) {
      await service.checkPageAccessRate('usr-burst', 'sess-1', (i % 10) + 1, 10);
    }
    const res = await service.checkPageAccessRate('usr-burst', 'sess-1', 1, 10);
    expect(res.allowed).toBe(false);
    expect(res.eventType).toBe('RATE_LIMITED');
    expect(res.reasonCode).toBe('RATE_LIMIT_EXCEEDED');
    expect(res.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('detects parallel session abuse when exceeding session limit', async () => {
    await service.checkPageAccessRate('usr-multi', 'sess-1', 1, 10);
    await service.checkPageAccessRate('usr-multi', 'sess-2', 1, 10);
    await service.checkPageAccessRate('usr-multi', 'sess-3', 1, 10);
    const res = await service.checkPageAccessRate('usr-multi', 'sess-4', 1, 10);

    expect(res.allowed).toBe(false);
    expect(res.eventType).toBe('RATE_LIMITED');
    expect(res.reasonCode).toBe('PARALLEL_SESSION_ABUSE');
  });

  it('uses Redis atomically when a client is configured', async () => {
    const redisEval = jest.fn().mockResolvedValue([
      0,
      17,
      ReaderAccessEventType.RATE_LIMITED,
      ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
      ReaderAccessRiskLevel.LOW,
    ]);

    (service as any).redis = { eval: redisEval, quit: jest.fn().mockResolvedValue(undefined) };

    const res = await service.checkPageAccessRate('usr-redis', 'sess-1', 2, 10);

    expect(redisEval).toHaveBeenCalled();
    expect(res).toEqual({
      allowed: false,
      retryAfterSeconds: 17,
      eventType: ReaderAccessEventType.RATE_LIMITED,
      reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
      riskLevel: ReaderAccessRiskLevel.LOW,
    });
  });

  it('fails closed when configured Redis checks error', async () => {
    (service as any).redisConfigured = true;
    (service as any).redis = { eval: jest.fn().mockRejectedValue(new Error('redis down')), quit: jest.fn() };

    await expect(
      service.checkPageAccessRate('usr-redis', 'sess-1', 2, 10),
    ).rejects.toThrow(DetectorDependencyUnavailableError);
  });

  it('fails closed outside tests when Redis is not configured', async () => {
    const productionService = new ReaderRateLimitService({
      get: jest.fn((key: string) => (key === 'NODE_ENV' ? 'production' : undefined)),
    } as unknown as ConfigService);

    await expect(
      productionService.checkPageAccessRate('usr-prod', 'sess-1', 2, 10, 'doc-1'),
    ).rejects.toThrow(DetectorDependencyUnavailableError);
  });
});
