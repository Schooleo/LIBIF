import { BookStatus, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { mapBookCounts, mapProcessingCounts, mapUserCounts, ReportingService } from './reporting.service';

describe('ReportingService dashboard aggregation', () => {
  it('fills missing book, processing, and user buckets with zero', () => {
    expect(mapBookCounts([])).toEqual({ draft: 0, pendingProcessing: 0, processing: 0, pendingApproval: 0, correctionRequired: 0, published: 0, rejected: 0, total: 0 });
    expect(mapProcessingCounts([])).toEqual({ queued: 0, running: 0, succeeded: 0, failed: 0, cancelled: 0, superseded: 0 });
    expect(mapUserCounts([])).toEqual({ admins: 0, librarians: 0, readers: 0, total: 0 });
  });

  it('maps grouped counts into dashboard buckets', () => {
    expect(mapBookCounts([{ status: BookStatus.PUBLISHED, _count: { _all: 4 } }, { status: BookStatus.PENDING_PROCESSING, _count: { _all: 2 } }])).toMatchObject({ published: 4, pendingProcessing: 2, total: 6 });
    expect(mapProcessingCounts([{ status: ProcessingJobStatus.FAILED, _count: { _all: 1 } }, { status: ProcessingJobStatus.QUEUED, _count: { _all: 3 } }])).toMatchObject({ failed: 1, queued: 3, running: 0 });
    expect(mapUserCounts([{ role: UserRole.ADMIN, _count: { _all: 1 } }, { role: UserRole.READER, _count: { _all: 7 } }])).toEqual({ admins: 1, librarians: 0, readers: 7, total: 8 });
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
      user: { groupBy: jest.fn().mockResolvedValue([{ role: UserRole.LIBRARIAN, _count: { _all: 1 } }]) }
    } as never);

    await expect(service.getLibrarianDashboardSummary()).resolves.toMatchObject({
      books: { published: 1, total: 1 },
      processingJobs: { queued: 2 },
      taxonomy: { categories: 3, tags: 4 },
      users: { librarians: 1, total: 1 },
      recentBooks: [{ id: 'book-1', title: 'Published Book', status: BookStatus.PUBLISHED, createdAt: '2026-07-21T00:00:00.000Z' }]
    });
  });
});
