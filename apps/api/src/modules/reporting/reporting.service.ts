import { Inject, Injectable } from '@nestjs/common';
import { BookStatus, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BookStatusCountsDto, DASHBOARD_BOOK_STATUSES, LibrarianDashboardSummaryDto, ProcessingJobStatusCountsDto, UserRoleCountsDto } from './dto/librarian-dashboard-summary.dto';

@Injectable()
export class ReportingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getLibrarianDashboardSummary(): Promise<LibrarianDashboardSummaryDto> {
    const [bookGroups, processingJobGroups, categoryCount, tagCount, userGroups, recentBooks] = await Promise.all([
      this.prisma.book.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.processingJob.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.category.count(),
      this.prisma.tag.count(),
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.book.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true } })
    ]);

    const books = mapBookCounts(bookGroups);
    const users = mapUserCounts(userGroups);

    return {
      generatedAt: new Date().toISOString(),
      books,
      processingJobs: mapProcessingCounts(processingJobGroups),
      taxonomy: { categories: categoryCount, tags: tagCount },
      users,
      recentBooks: recentBooks.map((book) => ({ id: book.id, title: book.title, status: book.status, createdAt: book.createdAt.toISOString() }))
    };
  }
}

type CountGroup<TStatus extends string> = { status: TStatus; _count: { _all: number } };
type RoleCountGroup = { role: UserRole; _count: { _all: number } };

export function mapBookCounts(groups: CountGroup<BookStatus>[]): BookStatusCountsDto {
  const counts = new Map(groups.map((group) => [group.status, group._count._all]));
  return {
    draft: counts.get(BookStatus.DRAFT) ?? 0,
    pendingProcessing: counts.get(BookStatus.PENDING_PROCESSING) ?? 0,
    processing: counts.get(BookStatus.PROCESSING) ?? 0,
    pendingApproval: counts.get(BookStatus.PENDING_APPROVAL) ?? 0,
    correctionRequired: counts.get(BookStatus.CORRECTION_REQUIRED) ?? 0,
    published: counts.get(BookStatus.PUBLISHED) ?? 0,
    rejected: counts.get(BookStatus.REJECTED) ?? 0,
    total: DASHBOARD_BOOK_STATUSES.reduce((total, status) => total + (counts.get(status) ?? 0), 0)
  };
}

export function mapProcessingCounts(groups: CountGroup<ProcessingJobStatus>[]): ProcessingJobStatusCountsDto {
  const counts = new Map(groups.map((group) => [group.status, group._count._all]));
  return {
    queued: counts.get(ProcessingJobStatus.QUEUED) ?? 0,
    running: counts.get(ProcessingJobStatus.RUNNING) ?? 0,
    succeeded: counts.get(ProcessingJobStatus.SUCCEEDED) ?? 0,
    failed: counts.get(ProcessingJobStatus.FAILED) ?? 0,
    cancelled: counts.get(ProcessingJobStatus.CANCELLED) ?? 0,
    superseded: counts.get(ProcessingJobStatus.SUPERSEDED) ?? 0
  };
}

export function mapUserCounts(groups: RoleCountGroup[]): UserRoleCountsDto {
  const counts = new Map(groups.map((group) => [group.role, group._count._all]));
  const admins = counts.get(UserRole.ADMIN) ?? 0;
  const librarians = counts.get(UserRole.LIBRARIAN) ?? 0;
  const readers = counts.get(UserRole.READER) ?? 0;
  return { admins, librarians, readers, total: admins + librarians + readers };
}
