import { Test, TestingModule } from '@nestjs/testing';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { READER_RISK_EVENT_SINK } from './contracts/reader-access.contract';
import { ReaderAccessAuditService } from './reader-access-audit.service';

describe('ReaderAccessAuditService', () => {
  let service: ReaderAccessAuditService;
  let prisma: { readerAccessEvent: { create: jest.Mock } };
  let sink: { publishCommittedRiskFact: jest.Mock };

  beforeEach(async () => {
    prisma = {
      readerAccessEvent: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'evt-123', ...data })),
      },
    };
    sink = { publishCommittedRiskFact: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaderAccessAuditService,
        { provide: PrismaService, useValue: prisma },
        { provide: READER_RISK_EVENT_SINK, useValue: sink },
      ],
    }).compile();

    service = module.get<ReaderAccessAuditService>(ReaderAccessAuditService);
  });

  it('records reader access event to Prisma', async () => {
    const now = new Date();
    const event = await service.recordEvent({
      eventType: ReaderAccessEventType.PAGE_SERVED,
      riskLevel: ReaderAccessRiskLevel.NONE,
      userId: 'usr-1',
      sessionId: 'sess-1',
      bookId: 'book-1',
      bookFileId: 'file-1',
      pageNumber: 2,
      traceFingerprint: 'abc123trace',
      createdAt: now,
    });

    expect(event.id).toBe('evt-123');
    expect(prisma.readerAccessEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: 'PAGE_SERVED',
        userId: 'usr-1',
        bookId: 'book-1',
        pageNumber: 2,
      }),
    });
    expect(sink.publishCommittedRiskFact).not.toHaveBeenCalled();
  });

  it('fails closed when Prisma throws an error', async () => {
    prisma.readerAccessEvent.create.mockRejectedValueOnce(new Error('DB Error'));

    await expect(
      service.recordEvent({
        eventType: ReaderAccessEventType.PAGE_SERVED,
        riskLevel: ReaderAccessRiskLevel.NONE,
        userId: 'usr-1',
        bookId: 'book-1',
        createdAt: new Date(),
      }),
    ).rejects.toThrow('DB Error');
  });

  it('publishes committed rate-limit risk facts to the optional sink', async () => {
    await service.recordEvent({
      eventType: ReaderAccessEventType.RATE_LIMITED,
      riskLevel: ReaderAccessRiskLevel.MEDIUM,
      reasonCode: ReaderAccessReasonCode.PARALLEL_SESSION_ABUSE,
      userId: 'usr-1',
      bookId: 'book-1',
      pageNumber: 4,
      createdAt: new Date('2026-07-23T12:00:00Z'),
    });

    expect(sink.publishCommittedRiskFact).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ReaderAccessEventType.RATE_LIMITED,
        reasonCode: ReaderAccessReasonCode.PARALLEL_SESSION_ABUSE,
      }),
    );
  });

  it('does not publish dependency denials as scrape or rate-limit facts', () => {
    const now = new Date();
    const fact = service.mapToCommittedRiskFact({
      id: 'evt-456',
      eventType: ReaderAccessEventType.PAGE_DENIED,
      riskLevel: ReaderAccessRiskLevel.HIGH,
      reasonCode: ReaderAccessReasonCode.DEPENDENCY_UNAVAILABLE,
      bookId: 'book-99',
      pageNumber: 4,
      createdAt: now,
    });

    expect(fact).toBeNull();
  });
});
