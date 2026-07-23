import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReaderRateLimitService } from './reader-rate-limit.service';

describe('ReaderRateLimitService', () => {
  let service: ReaderRateLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaderRateLimitService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(undefined), // No Redis URL -> in-memory fallback
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
    await service.checkPageAccessRate('usr-multi', 'sess-4', 1, 10);

    const res = await service.checkPageAccessRate('usr-multi', 'sess-4', 1, 10);
    expect(res.allowed).toBe(false);
    expect(res.eventType).toBe('RATE_LIMITED');
    expect(res.reasonCode).toBe('PARALLEL_SESSION_ABUSE');
  });
});
