import { Inject, Injectable } from '@nestjs/common';
import { BookAuditAction, BookStatus, ProcessingJobStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  BookStatusCountsDto,
  DASHBOARD_ACTIVITY_ACTIONS,
  DASHBOARD_BOOK_STATUSES,
  LibrarianDashboardSummaryDto,
  ProcessingJobStatusCountsDto,
  ReportingActivityCountsDto,
  ReportingActivityItemDto,
  UserRoleCountsDto
} from './dto/librarian-dashboard-summary.dto';

@Injectable()
export class ReportingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getLibrarianDashboardSummary(): Promise<LibrarianDashboardSummaryDto> {
    const [bookGroups, processingJobGroups, categoryCount, tagCount, userGroups, recentBooks, activityGroups, recentActivity] = await Promise.all([
      this.prisma.book.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.processingJob.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.category.count(),
      this.prisma.tag.count(),
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.book.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true } }),
      this.prisma.bookAuditEvent.groupBy({ by: ['action'], where: { action: { in: [...DASHBOARD_ACTIVITY_ACTIONS] } }, _count: { _all: true } }),
      this.prisma.bookAuditEvent.findMany({
        take: 10,
        where: { action: { in: [...DASHBOARD_ACTIVITY_ACTIONS] } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          action: true,
          message: true,
          createdAt: true,
          book: { select: { id: true, title: true } },
          actor: { select: { email: true } }
        }
      })
    ]);

    const books = mapBookCounts(bookGroups);
    const users = mapUserCounts(userGroups);

    return {
      generatedAt: new Date().toISOString(),
      books,
      processingJobs: mapProcessingCounts(processingJobGroups),
      taxonomy: { categories: categoryCount, tags: tagCount },
      users,
      recentBooks: recentBooks.map((book) => ({ id: book.id, title: book.title, status: book.status, createdAt: book.createdAt.toISOString() })),
      activity: {
        counts: mapActivityCounts(activityGroups),
        recent: recentActivity.map(mapActivityItem)
      }
    };
  }
}

type CountGroup<TStatus extends string> = { status: TStatus; _count: { _all: number } };
type RoleCountGroup = { role: UserRole; _count: { _all: number } };
type ActivityCountGroup = { action: BookAuditAction; _count: { _all: number } };
type RecentActivityRecord = {
  id: string;
  action: BookAuditAction;
  message: string | null;
  createdAt: Date;
  book: { id: string; title: string };
  actor: { email: string } | null;
};

const PROCESSING_ACTIVITY_ACTIONS = new Set<BookAuditAction>([
  BookAuditAction.PROCESSING_QUEUED,
  BookAuditAction.PROCESSING_STARTED,
  BookAuditAction.PROCESSING_COMPLETED
]);

const APPROVAL_ACTIVITY_ACTIONS = new Set<BookAuditAction>([
  BookAuditAction.APPROVAL_REQUESTED,
  BookAuditAction.APPROVED,
  BookAuditAction.PUBLISHED,
  BookAuditAction.REJECTED
]);

const CORRECTION_ACTIVITY_ACTIONS = new Set<BookAuditAction>([BookAuditAction.CORRECTION_REQUESTED]);

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

export function mapActivityCounts(groups: ActivityCountGroup[]): ReportingActivityCountsDto {
  let processing = 0;
  let approval = 0;
  let correction = 0;

  for (const group of groups) {
    if (PROCESSING_ACTIVITY_ACTIONS.has(group.action)) processing += group._count._all;
    if (APPROVAL_ACTIVITY_ACTIONS.has(group.action)) approval += group._count._all;
    if (CORRECTION_ACTIVITY_ACTIONS.has(group.action)) correction += group._count._all;
  }

  return { processing, approval, correction, total: processing + approval + correction };
}

export function mapActivityItem(activity: RecentActivityRecord): ReportingActivityItemDto {
  return {
    id: activity.id,
    documentId: activity.book.id,
    documentTitle: activity.book.title,
    action: activity.action,
    message: activity.message,
    actorEmail: activity.actor?.email ?? null,
    createdAt: activity.createdAt.toISOString()
  };
}
