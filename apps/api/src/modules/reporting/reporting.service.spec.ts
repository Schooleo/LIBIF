import { BadRequestException } from '@nestjs/common';
import {
  BookAuditAction,
  BookStatus,
  ProcessingJobStatus,
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
  UserRole
} from '../../generated/prisma/client';
import {
  buildReaderAccessWhere,
  buildReaderLabel,
  buildOpaqueReference,
  mapActivityCounts,
  mapActivityItem,
  mapBookCounts,
  mapProcessingCounts,
  mapReaderAccessItem,
  mapReaderAccessRiskCounts,
  mapUserCounts,
  normalizeReaderAccessReportQuery,
  normalizeOperationsRange,
  OPERATIONS_CSV_ROW_CAP,
  DOCUMENTS_CSV_HEADERS,
  USERS_CSV_HEADERS,
  ACTIVITY_CSV_HEADERS,
  READER_ACCESS_CSV_HEADERS,
  ReportingService,
  sanitizeTraceFingerprint,
  serializeCsvCell
} from './reporting.service';

describe('ReportingService dashboard aggregation', () => {
  it('fills missing book, processing, activity, and user buckets with zero', () => {
    expect(mapBookCounts([])).toEqual({ draft: 0, pendingProcessing: 0, processing: 0, pendingApproval: 0, correctionRequired: 0, published: 0, rejected: 0, total: 0 });
    expect(mapProcessingCounts([])).toEqual({ queued: 0, running: 0, succeeded: 0, failed: 0, cancelled: 0, superseded: 0 });
    expect(mapActivityCounts([])).toEqual({ processing: 0, approval: 0, correction: 0, total: 0 });
    expect(mapUserCounts([])).toEqual({ admins: 0, librarians: 0, readers: 0, total: 0 });
  });

  it('maps grouped counts into dashboard buckets', () => {
    expect(mapBookCounts([{ status: BookStatus.PUBLISHED, _count: { _all: 4 } }, { status: BookStatus.PENDING_PROCESSING, _count: { _all: 2 } }])).toMatchObject({ published: 4, pendingProcessing: 2, total: 6 });
    expect(mapProcessingCounts([{ status: ProcessingJobStatus.FAILED, _count: { _all: 1 } }, { status: ProcessingJobStatus.QUEUED, _count: { _all: 3 } }])).toMatchObject({ failed: 1, queued: 3, running: 0 });
    expect(
      mapActivityCounts([
        { action: BookAuditAction.PROCESSING_STARTED, _count: { _all: 2 } },
        { action: BookAuditAction.APPROVAL_REQUESTED, _count: { _all: 5 } },
        { action: BookAuditAction.PUBLISHED, _count: { _all: 1 } },
        { action: BookAuditAction.REJECTED, _count: { _all: 3 } },
        { action: BookAuditAction.CORRECTION_REQUESTED, _count: { _all: 4 } }
      ])
    ).toEqual({ processing: 2, approval: 9, correction: 4, total: 15 });
    expect(mapUserCounts([{ role: UserRole.ADMIN, _count: { _all: 1 } }, { role: UserRole.READER, _count: { _all: 7 } }])).toEqual({ admins: 1, librarians: 0, readers: 7, total: 8 });
  });

  it('maps recent activity rows with nullable actor and message fields', () => {
    expect(
      mapActivityItem({
        id: 'audit-1',
        action: BookAuditAction.CORRECTION_REQUESTED,
        message: null,
        createdAt: new Date('2026-07-21T05:00:00.000Z'),
        book: { id: 'book-1', title: 'Needs metadata fixes' },
        actor: null
      })
    ).toEqual({
      id: 'audit-1',
      documentId: 'book-1',
      documentTitle: 'Needs metadata fixes',
      action: BookAuditAction.CORRECTION_REQUESTED,
      message: null,
      actorEmail: null,
      createdAt: '2026-07-21T05:00:00.000Z'
    });
  });

  it('returns a dashboard summary from Prisma read models', async () => {
    const now = new Date('2026-07-21T00:00:00.000Z');
    const service = new ReportingService({
      book: {
        groupBy: jest.fn().mockResolvedValue([{ status: BookStatus.PUBLISHED, _count: { _all: 1 } }]),
        findMany: jest.fn().mockResolvedValue([{ id: 'book-1', title: 'Published Book', status: BookStatus.PUBLISHED, createdAt: now }])
      },
      processingJob: { groupBy: jest.fn().mockResolvedValue([{ status: ProcessingJobStatus.QUEUED, _count: { _all: 2 } }]) },
      category: { count: jest.fn().mockResolvedValue(3) },
      tag: { count: jest.fn().mockResolvedValue(4) },
      user: { groupBy: jest.fn().mockResolvedValue([{ role: UserRole.LIBRARIAN, _count: { _all: 1 } }]) },
      bookAuditEvent: {
        groupBy: jest.fn().mockResolvedValue([
          { action: BookAuditAction.PROCESSING_COMPLETED, _count: { _all: 2 } },
          { action: BookAuditAction.APPROVAL_REQUESTED, _count: { _all: 1 } },
          { action: BookAuditAction.PUBLISHED, _count: { _all: 1 } },
          { action: BookAuditAction.CORRECTION_REQUESTED, _count: { _all: 1 } }
        ]),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'audit-2',
            action: BookAuditAction.PUBLISHED,
            message: 'Document approved and published',
            createdAt: now,
            book: { id: 'book-1', title: 'Published Book' },
            actor: { email: 'admin@libif.local' }
          }
        ])
      }
    } as never);

    await expect(service.getLibrarianDashboardSummary()).resolves.toMatchObject({
      books: { published: 1, total: 1 },
      processingJobs: { queued: 2 },
      taxonomy: { categories: 3, tags: 4 },
      users: { librarians: 1, total: 1 },
      recentBooks: [{ id: 'book-1', title: 'Published Book', status: BookStatus.PUBLISHED, createdAt: '2026-07-21T00:00:00.000Z' }],
      activity: {
        counts: { processing: 2, approval: 2, correction: 1, total: 5 },
        recent: [
          {
            id: 'audit-2',
            documentId: 'book-1',
            documentTitle: 'Published Book',
            action: BookAuditAction.PUBLISHED,
            message: 'Document approved and published',
            actorEmail: 'admin@libif.local',
            createdAt: '2026-07-21T00:00:00.000Z'
          }
        ]
      }
    });
  });
});

describe('Reader access reporting helpers', () => {
  it('normalizes defaults, validates UTC timestamps, and enforces bounded ranges', () => {
    const now = new Date('2026-07-23T12:00:00.000Z');
    expect(normalizeReaderAccessReportQuery({}, now)).toMatchObject({
      from: new Date('2026-07-16T12:00:00.000Z'),
      to: now,
      page: 1,
      pageSize: 50,
      offset: 0
    });

    expect(() => normalizeReaderAccessReportQuery({ from: '2026-07-23T12:00:00.000Z', to: '2026-07-23T12:00:00.000Z' }, now)).toThrow(BadRequestException);
    expect(() => normalizeReaderAccessReportQuery({ from: '2026-07-01T00:00:00.000Z', to: '2026-08-02T00:00:00.000Z' }, now)).toThrow(
      'Requested range exceeds the 31-day reporting limit.'
    );
    expect(() => normalizeReaderAccessReportQuery({ from: '2026-07-23T12:00:00+07:00' }, now)).toThrow('from must be a UTC timestamp ending in Z.');
  });

  it('builds safe reader projections and zero-filled risk counts', () => {
    const label = buildReaderLabel('user-secret-id');
    expect(label).toMatch(/^reader-[0-9a-f]{12}$/);
    expect(label).not.toContain('user-secret-id');

    expect(
      mapReaderAccessItem({
        id: 'event-1',
        eventType: ReaderAccessEventType.PAGE_SERVED,
        riskLevel: ReaderAccessRiskLevel.NONE,
        reasonCode: null,
        pageNumber: 8,
        traceFingerprint: 'a'.repeat(64),
        createdAt: new Date('2026-07-23T00:00:00.000Z'),
        userId: 'reader-1',
        book: { id: 'book-1' }
      })
    ).toEqual({
      eventReference: buildOpaqueReference('event', 'event-1'),
      documentReference: buildOpaqueReference('document', 'book-1'),
      readerLabel: buildReaderLabel('reader-1'),
      eventType: ReaderAccessEventType.PAGE_SERVED,
      riskLevel: ReaderAccessRiskLevel.NONE,
      reasonCode: null,
      pageNumber: 8,
      traceFingerprint: 'a'.repeat(64),
      occurredAt: '2026-07-23T00:00:00.000Z'
    });

    expect(mapReaderAccessRiskCounts([{ riskLevel: ReaderAccessRiskLevel.HIGH, _count: { _all: 2 } }])).toEqual({ none: 0, low: 0, medium: 0, high: 2 });
    expect(sanitizeTraceFingerprint('not-hex')).toBeNull();
  });

  it('serializes CSV cells with quoting and formula neutralization', () => {
    expect(READER_ACCESS_CSV_HEADERS).toEqual([
      'eventReference',
      'documentReference',
      'readerLabel',
      'eventType',
      'riskLevel',
      'reasonCode',
      'pageNumber',
      'traceFingerprint',
      'occurredAt'
    ]);
    expect(serializeCsvCell('=cmd')).toBe('"\'=cmd"');
    expect(serializeCsvCell('@sum')).toBe('"\'@sum"');
    expect(serializeCsvCell('hello,"world"')).toBe('"hello,""world"""');
    expect(serializeCsvCell(null)).toBe('""');
  });

  it('queries reader access rows with explicit filters, ordering, and safe selects', async () => {
    const count = jest.fn().mockResolvedValue(3);
    const groupBy = jest.fn().mockResolvedValue([{ riskLevel: ReaderAccessRiskLevel.LOW, _count: { _all: 3 } }]);
    const findMany = jest.fn().mockResolvedValue([
      {
        id: 'event-2',
        eventType: ReaderAccessEventType.RATE_LIMITED,
        riskLevel: ReaderAccessRiskLevel.LOW,
        reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
        pageNumber: 4,
        traceFingerprint: null,
        createdAt: new Date('2026-07-23T02:00:00.000Z'),
        userId: 'reader-2',
        book: { id: 'book-9' }
      }
    ]);
    const service = new ReportingService({ readerAccessEvent: { count, groupBy, findMany } } as never);
    const query = { from: '2026-07-22T00:00:00.000Z', to: '2026-07-24T00:00:00.000Z', risk: ReaderAccessRiskLevel.LOW, page: 2, pageSize: 2 };

    await expect(service.getReaderAccessReport(query, new Date('2026-07-24T00:00:00.000Z'))).resolves.toMatchObject({
      totalCount: 3,
      page: 2,
      pageSize: 2,
      riskCounts: { none: 0, low: 3, medium: 0, high: 0 },
      items: [
        {
          eventReference: buildOpaqueReference('event', 'event-2'),
          documentReference: buildOpaqueReference('document', 'book-9'),
          readerLabel: buildReaderLabel('reader-2'),
          eventType: ReaderAccessEventType.RATE_LIMITED,
          riskLevel: ReaderAccessRiskLevel.LOW,
          reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
          pageNumber: 4,
          traceFingerprint: null,
          occurredAt: '2026-07-23T02:00:00.000Z'
        }
      ]
    });

    const where = buildReaderAccessWhere({
      from: new Date('2026-07-22T00:00:00.000Z'),
      to: new Date('2026-07-24T00:00:00.000Z'),
      risk: ReaderAccessRiskLevel.LOW
    });
    expect(count).toHaveBeenCalledWith({ where });
    expect(groupBy).toHaveBeenCalledWith({ by: ['riskLevel'], where, _count: { _all: true } });
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: 2,
        take: 2,
        select: expect.objectContaining({
          id: true,
          userId: true,
          book: { select: { id: true } }
        })
      })
    );
  });
});

describe('Operations reporting and CSV', () => {
  it('normalizes inclusive-start/exclusive-end UTC ranges with the shared 31-day cap', () => {
    const now = new Date('2026-07-23T12:00:00.000Z');
    expect(normalizeOperationsRange({}, now)).toEqual({
      from: new Date('2026-07-16T12:00:00.000Z'),
      to: now
    });
    expect(() =>
      normalizeOperationsRange({
        from: '2026-07-23T12:00:00+07:00',
        to: '2026-07-24T12:00:00.000Z'
      })
    ).toThrow('from must be a UTC timestamp ending in Z.');
  });

  it('uses fixed headers, deterministic ordering, safe selects, and the 1000-row cap', async () => {
    const bookFindMany = jest.fn().mockResolvedValue([]);
    const userFindMany = jest.fn().mockResolvedValue([]);
    const activityFindMany = jest.fn().mockResolvedValue([]);
    const service = new ReportingService({
      book: { findMany: bookFindMany },
      user: { findMany: userFindMany },
      bookAuditEvent: { findMany: activityFindMany }
    } as never);
    const query = {
      from: '2026-07-22T00:00:00.000Z',
      to: '2026-07-23T00:00:00.000Z'
    };

    await expect(service.exportDocumentsCsv(query)).resolves.toBe(DOCUMENTS_CSV_HEADERS.join(','));
    await expect(service.exportUsersCsv(query)).resolves.toBe(USERS_CSV_HEADERS.join(','));
    await expect(service.exportActivityCsv(query)).resolves.toBe(ACTIVITY_CSV_HEADERS.join(','));

    for (const findMany of [bookFindMany, userFindMany, activityFindMany]) {
      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: OPERATIONS_CSV_ROW_CAP,
          select: expect.not.objectContaining({
            passwordHash: true,
            objectKey: true,
            tokenHash: true
          })
        })
      );
    }
  });

  it('returns management counts with a bounded reader scrape summary', async () => {
    const countResults = [2, 3, 4, 5, 1, 2, 1];
    const service = new ReportingService({
      book: { count: jest.fn().mockResolvedValue(countResults[0]) },
      user: { count: jest.fn().mockResolvedValue(countResults[1]) },
      bookAuditEvent: { count: jest.fn().mockResolvedValue(countResults[2]) },
      readerAccessEvent: {
        count: jest
          .fn()
          .mockResolvedValueOnce(countResults[3])
          .mockResolvedValueOnce(countResults[4])
          .mockResolvedValueOnce(countResults[5])
          .mockResolvedValueOnce(countResults[6])
      }
    } as never);

    await expect(
      service.getManagementDashboardSummary(
        {
          from: '2026-07-22T00:00:00.000Z',
          to: '2026-07-23T00:00:00.000Z'
        },
        new Date('2026-07-23T12:00:00.000Z')
      )
    ).resolves.toEqual({
      generatedAt: '2026-07-23T12:00:00.000Z',
      from: '2026-07-22T00:00:00.000Z',
      to: '2026-07-23T00:00:00.000Z',
      documentsCreated: 2,
      usersCreated: 3,
      activityEvents: 4,
      readerSecurity: {
        total: 5,
        rateLimited: 1,
        scrapeSuspected: 2,
        highRisk: 1
      }
    });
  });
});
