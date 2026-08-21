import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
  UserAccountStatus,
  UserRole
} from '../../generated/prisma/client';
import type { CommittedReaderRiskFact } from '../access/contracts/reader-access.contract';
import { PrismaService } from '../database/prisma.service';
import { RiskAlertConstants, RiskAlertService } from './risk-alert.service';

describe('RiskAlertService', () => {
  let service: RiskAlertService;

  const mockPrisma = {
    user: {
      findMany: jest.fn()
    },
    notification: {
      createMany: jest.fn()
    }
  };

  const mockConfig = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskAlertService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig }
      ]
    }).compile();

    service = module.get<RiskAlertService>(RiskAlertService);
    jest.clearAllMocks();
    mockConfig.get.mockReturnValue(undefined);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  it('implements the committed-risk sink used by AccessModule', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);

    await expect(service.publishCommittedRiskFact(buildFact())).resolves.toBeUndefined();
  });

  it('creates one high-risk alert per active admin and librarian recipient', async () => {
    const fact = buildFact();
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }, { id: 'librarian-1' }]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 2 });

    const inserted = await service.createAlertsForCommittedRiskFact(fact);

    expect(inserted).toBe(2);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] },
        status: UserAccountStatus.ACTIVE,
        deactivatedAt: null
      },
      select: { id: true }
    });
    expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          recipientId: 'admin-1',
          type: 'SYSTEM',
          title: RiskAlertConstants.RISK_ALERT_TITLE,
          body: RiskAlertConstants.RISK_ALERT_BODY,
          actionHref: RiskAlertConstants.RISK_ALERT_ACTION_HREF,
          status: 'UNREAD',
          payload: {
            eventType: fact.eventType,
            riskLevel: fact.riskLevel,
            reasonCode: fact.reasonCode,
            dedupWindowSeconds: RiskAlertConstants.DEFAULT_DEDUP_WINDOW_SECONDS,
            dedupWindowStart: '2026-07-23T01:00:00.000Z',
            dedupWindowEnd: '2026-07-23T01:15:00.000Z'
          }
        })
      ]),
      skipDuplicates: true
    });
  });

  it.each([ReaderAccessRiskLevel.LOW, ReaderAccessRiskLevel.MEDIUM])(
    'creates a deduplicated staff alert for committed %s risk facts',
    async (riskLevel) => {
      const fact = buildFact({ riskLevel });
      mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
      mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

      await expect(service.createAlertsForCommittedRiskFact(fact)).resolves.toBe(1);

      expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
        data: [expect.objectContaining({
          recipientId: 'admin-1',
          payload: expect.objectContaining({ riskLevel }),
        })],
        skipDuplicates: true,
      });
    }
  );

  it('excludes readers and deactivated staff by restricting recipient lookup to active admins and librarians', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

    await service.createAlertsForCommittedRiskFact(buildFact());

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.LIBRARIAN] },
        status: UserAccountStatus.ACTIVE,
        deactivatedAt: null
      },
      select: { id: true }
    });
    expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ recipientId: 'admin-1' })],
      skipDuplicates: true
    });
  });

  it('deduplicates replayed and concurrent same-window facts via deterministic ids and skipDuplicates', async () => {
    const fact = buildFact();
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }, { id: 'librarian-1' }]);
    mockPrisma.notification.createMany
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return { count: 2 };
      })
      .mockResolvedValueOnce({ count: 0 });

    const [firstCount, secondCount] = await Promise.all([
      service.createAlertsForCommittedRiskFact(fact),
      service.createAlertsForCommittedRiskFact(fact)
    ]);

    expect(firstCount).toBe(2);
    expect(secondCount).toBe(0);
    expect(mockPrisma.notification.createMany).toHaveBeenCalledTimes(2);

    const firstCall = mockPrisma.notification.createMany.mock.calls[0][0];
    const secondCall = mockPrisma.notification.createMany.mock.calls[1][0];
    expect(firstCall.skipDuplicates).toBe(true);
    expect(secondCall.skipDuplicates).toBe(true);
    expect(firstCall.data).toEqual(secondCall.data);
    expect(firstCall.data[0].id).toMatch(/^[a-f0-9]{64}$/);
  });

  it('uses a different deterministic id in the next dedup window', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

    await service.createAlertsForCommittedRiskFact(buildFact({ occurredAt: new Date('2026-07-23T01:14:59.999Z') }));
    await service.createAlertsForCommittedRiskFact(buildFact({ occurredAt: new Date('2026-07-23T01:15:00.000Z') }));

    const firstCall = mockPrisma.notification.createMany.mock.calls[0][0];
    const secondCall = mockPrisma.notification.createMany.mock.calls[1][0];

    expect(firstCall.data[0].id).not.toBe(secondCall.data[0].id);
    expect(firstCall.data[0].payload).toMatchObject({ dedupWindowStart: '2026-07-23T01:00:00.000Z' });
    expect(secondCall.data[0].payload).toMatchObject({ dedupWindowStart: '2026-07-23T01:15:00.000Z' });
  });

  it('never persists forbidden reader-access identifiers or secrets in alert records', async () => {
    const fact = buildFact({
      accessEventId: 'access-secret-123',
      documentId: 'document-secret-456',
      pageNumber: 42
    });
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

    await service.createAlertsForCommittedRiskFact(fact);

    const [{ data }] = mockPrisma.notification.createMany.mock.calls[0];
    assertNoForbiddenFields(data, [
      'accessEventId',
      'documentId',
      'pageNumber',
      'userId',
      'sessionId',
      'bookId',
      'bookFileId',
      'traceFingerprint',
      'email',
      'content',
      'objectKey',
      'ip',
      'userAgent',
      'token',
      'secret'
    ]);
    const serialized = JSON.stringify(data);
    expect(serialized).not.toContain(fact.accessEventId);
    expect(serialized).not.toContain(fact.documentId);
    expect(serialized).not.toContain(String(fact.pageNumber));
  });

  it('uses UTC bucket boundaries from fact.occurredAt', async () => {
    mockConfig.get.mockImplementation((key: string) =>
      key === RiskAlertConstants.RISK_ALERT_DEDUP_WINDOW_SECONDS_KEY ? '86400' : undefined
    );
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });

    await service.createAlertsForCommittedRiskFact(buildFact({ occurredAt: new Date('2026-07-22T23:59:59.999Z') }));
    await service.createAlertsForCommittedRiskFact(buildFact({ occurredAt: new Date('2026-07-23T00:00:00.000Z') }));

    const firstPayload = mockPrisma.notification.createMany.mock.calls[0][0].data[0].payload;
    const secondPayload = mockPrisma.notification.createMany.mock.calls[1][0].data[0].payload;

    expect(firstPayload).toMatchObject({
      dedupWindowSeconds: 86400,
      dedupWindowStart: '2026-07-22T00:00:00.000Z',
      dedupWindowEnd: '2026-07-23T00:00:00.000Z'
    });
    expect(secondPayload).toMatchObject({
      dedupWindowSeconds: 86400,
      dedupWindowStart: '2026-07-23T00:00:00.000Z',
      dedupWindowEnd: '2026-07-24T00:00:00.000Z'
    });
    expect(mockPrisma.notification.createMany.mock.calls[0][0].data[0].id).not.toBe(
      mockPrisma.notification.createMany.mock.calls[1][0].data[0].id
    );
  });

  it('propagates database errors', async () => {
    const error = new Error('write failed');
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);
    mockPrisma.notification.createMany.mockRejectedValue(error);

    await expect(service.createAlertsForCommittedRiskFact(buildFact())).rejects.toThrow(error);
  });
});

function buildFact(overrides: Partial<CommittedReaderRiskFact> = {}): CommittedReaderRiskFact {
  return {
    accessEventId: 'access-1',
    eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
    riskLevel: ReaderAccessRiskLevel.HIGH,
    reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION,
    documentId: 'document-1',
    pageNumber: 7,
    occurredAt: new Date('2026-07-23T01:02:03.456Z'),
    ...overrides
  };
}

function assertNoForbiddenFields(value: unknown, forbiddenKeys: readonly string[], path = 'root'): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoForbiddenFields(entry, forbiddenKeys, `${path}[${index}]`));
    return;
  }

  if (!value || typeof value !== 'object') {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    expect(forbiddenKeys).not.toContain(key);
    assertNoForbiddenFields(nestedValue, forbiddenKeys, `${path}.${key}`);
  }
}
