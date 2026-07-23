import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import {
  BookAuditAction,
  BookStatus,
  Prisma,
  ProcessingJobStatus,
  ReaderAccessRiskLevel,
  UserRole
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  ReaderAccessReportItemDto,
  ReaderAccessReportQueryDto,
  ReaderAccessReportResponseDto,
  ReaderAccessRiskCountsDto
} from './dto/reader-access-report.dto';
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

export const READER_ACCESS_DEFAULT_PAGE = 1;
export const READER_ACCESS_DEFAULT_PAGE_SIZE = 50;
export const READER_ACCESS_MAX_PAGE_SIZE = 200;
export const READER_ACCESS_DEFAULT_RANGE_MS = 7 * 24 * 60 * 60 * 1000;
export const READER_ACCESS_MAX_RANGE_MS = 31 * 24 * 60 * 60 * 1000;
export const READER_ACCESS_CSV_HEADERS = [
  'eventReference',
  'documentReference',
  'readerLabel',
  'eventType',
  'riskLevel',
  'reasonCode',
  'pageNumber',
  'traceFingerprint',
  'occurredAt'
] as const;

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

  async getReaderAccessReport(query: ReaderAccessReportQueryDto, now = new Date()): Promise<ReaderAccessReportResponseDto> {
    const normalized = normalizeReaderAccessReportQuery(query, now);
    const where = buildReaderAccessWhere(normalized);

    const [totalCount, riskGroups, rows] = await Promise.all([
      this.prisma.readerAccessEvent.count({ where }),
      this.prisma.readerAccessEvent.groupBy({ by: ['riskLevel'], where, _count: { _all: true } }),
      this.prisma.readerAccessEvent.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: normalized.offset,
        take: normalized.pageSize,
        select: readerAccessReportSelect
      })
    ]);

    return {
      generatedAt: now.toISOString(),
      riskCounts: mapReaderAccessRiskCounts(riskGroups),
      items: rows.map(mapReaderAccessItem),
      totalCount,
      page: normalized.page,
      pageSize: normalized.pageSize
    };
  }

  async exportReaderAccessCsv(query: ReaderAccessReportQueryDto, now = new Date()): Promise<string> {
    const report = await this.getReaderAccessReport(query, now);
    const lines = [READER_ACCESS_CSV_HEADERS.join(',')];

    for (const item of report.items) {
      lines.push(
        [
          item.eventReference,
          item.documentReference,
          item.readerLabel,
          item.eventType,
          item.riskLevel,
          item.reasonCode ?? null,
          item.pageNumber ?? null,
          item.traceFingerprint ?? null,
          item.occurredAt
        ]
          .map(serializeCsvCell)
          .join(',')
      );
    }

    return lines.join('\n');
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
type ReaderAccessRiskCountGroup = { riskLevel: ReaderAccessRiskLevel; _count: { _all: number } };
type ReaderAccessReportRecord = Prisma.ReaderAccessEventGetPayload<{ select: typeof readerAccessReportSelect }>;
export type NormalizedReaderAccessReportQuery = Readonly<{
  from: Date;
  to: Date;
  risk?: ReaderAccessRiskLevel;
  page: number;
  pageSize: number;
  offset: number;
}>;

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
const TRACE_FINGERPRINT_PATTERN = /^[0-9a-f]{64}$/;

const readerAccessReportSelect = {
  id: true,
  eventType: true,
  riskLevel: true,
  reasonCode: true,
  pageNumber: true,
  traceFingerprint: true,
  createdAt: true,
  userId: true,
  book: { select: { id: true } }
} satisfies Prisma.ReaderAccessEventSelect;

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

export function normalizeReaderAccessReportQuery(
  query: ReaderAccessReportQueryDto,
  now = new Date()
): NormalizedReaderAccessReportQuery {
  const defaultTo = new Date(now);
  const parsedFrom = query.from ? parseUtcDate(query.from, 'from') : null;
  const parsedTo = query.to ? parseUtcDate(query.to, 'to') : null;

  const to = parsedTo ?? defaultTo;
  const from = parsedFrom ?? new Date(to.getTime() - READER_ACCESS_DEFAULT_RANGE_MS);

  if (from.getTime() >= to.getTime()) {
    throw new BadRequestException('from must be earlier than to.');
  }

  if (to.getTime() - from.getTime() > READER_ACCESS_MAX_RANGE_MS) {
    throw new BadRequestException('Requested range exceeds the 31-day reporting limit.');
  }

  const page = query.page ?? READER_ACCESS_DEFAULT_PAGE;
  const pageSize = query.pageSize ?? READER_ACCESS_DEFAULT_PAGE_SIZE;

  return {
    from,
    to,
    risk: query.risk,
    page,
    pageSize,
    offset: (page - 1) * pageSize
  };
}

export function buildReaderAccessWhere(query: Pick<NormalizedReaderAccessReportQuery, 'from' | 'to' | 'risk'>): Prisma.ReaderAccessEventWhereInput {
  return {
    createdAt: { gte: query.from, lt: query.to },
    ...(query.risk ? { riskLevel: query.risk } : {})
  };
}

export function mapReaderAccessRiskCounts(groups: ReaderAccessRiskCountGroup[]): ReaderAccessRiskCountsDto {
  const counts = new Map(groups.map((group) => [group.riskLevel, group._count._all]));
  return {
    none: counts.get(ReaderAccessRiskLevel.NONE) ?? 0,
    low: counts.get(ReaderAccessRiskLevel.LOW) ?? 0,
    medium: counts.get(ReaderAccessRiskLevel.MEDIUM) ?? 0,
    high: counts.get(ReaderAccessRiskLevel.HIGH) ?? 0
  };
}

export function mapReaderAccessItem(record: ReaderAccessReportRecord): ReaderAccessReportItemDto {
  return {
    eventReference: buildOpaqueReference('event', record.id),
    documentReference: buildOpaqueReference('document', record.book.id),
    readerLabel: buildReaderLabel(record.userId),
    eventType: record.eventType,
    riskLevel: record.riskLevel,
    reasonCode: record.reasonCode,
    pageNumber: record.pageNumber,
    traceFingerprint: sanitizeTraceFingerprint(record.traceFingerprint),
    occurredAt: record.createdAt.toISOString()
  };
}

export function buildReaderLabel(userId: string): string {
  const digest = createHash('sha256').update(userId).digest('hex').slice(0, 12);
  return `reader-${digest}`;
}

export function buildOpaqueReference(kind: 'event' | 'document', internalId: string): string {
  const digest = createHash('sha256').update(`${kind}:${internalId}`).digest('hex').slice(0, 16);
  return `${kind}-${digest}`;
}

export function sanitizeTraceFingerprint(value: string | null): string | null {
  if (!value) return null;
  return TRACE_FINGERPRINT_PATTERN.test(value) ? value : null;
}

export function serializeCsvCell(value: string | number | null): string {
  if (value === null) return '""';
  const stringValue = typeof value === 'number' ? String(value) : value;
  const safeValue = /^[=+\-@]|^[\t\r]/.test(stringValue) ? `'${stringValue}` : stringValue;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function parseUtcDate(value: string, field: 'from' | 'to'): Date {
  if (!value.endsWith('Z')) {
    throw new BadRequestException(`${field} must be a UTC timestamp ending in Z.`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestException(`${field} must be a valid UTC timestamp.`);
  }

  return parsed;
}
