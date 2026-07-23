import { BookAuditAction, BookStatus, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { mapActivityCounts, mapActivityItem, mapBookCounts, mapProcessingCounts, mapUserCounts, ReportingService } from './reporting.service';

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
