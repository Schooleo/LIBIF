import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';

describe('ReaderAccessAuditService', () => {
  let service: ReaderAccessAuditService;
  let prisma: { readerAccessEvent: { create: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      readerAccessEvent: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'evt-123', ...data }),
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaderAccessAuditService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReaderAccessAuditService>(ReaderAccessAuditService);
  });

  it('should record reader access event to Prisma', async () => {
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
  });

  it('should fail closed when Prisma throws an error', async () => {
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

  it('should correctly map RATE_LIMITED event to CommittedReaderRiskFact', () => {
    const now = new Date();
    const fact = service.mapToCommittedRiskFact({
      id: 'evt-456',
      eventType: ReaderAccessEventType.RATE_LIMITED,
      riskLevel: ReaderAccessRiskLevel.MEDIUM,
      reasonCode: ReaderAccessReasonCode.PARALLEL_SESSION_ABUSE,
      bookId: 'book-99',
      pageNumber: 4,
      createdAt: now,
    });

    expect(fact).not.toBeNull();
    expect(fact?.accessEventId).toBe('evt-456');
    expect(fact?.eventType).toBe('RATE_LIMITED');
    expect(fact?.riskLevel).toBe('MEDIUM');
    expect(fact?.reasonCode).toBe('PARALLEL_SESSION_ABUSE');
    expect(fact?.documentId).toBe('book-99');
    expect(fact?.pageNumber).toBe(4);
  });
});
