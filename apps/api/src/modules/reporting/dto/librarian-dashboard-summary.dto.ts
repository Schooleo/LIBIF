import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookAuditAction, BookStatus } from '../../../generated/prisma/client';

export class BookStatusCountsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  draft!: number;

  @ApiProperty()
  pendingProcessing!: number;

  @ApiProperty()
  processing!: number;

  @ApiProperty()
  pendingApproval!: number;

  @ApiProperty()
  correctionRequired!: number;

  @ApiProperty()
  published!: number;

  @ApiProperty()
  rejected!: number;
}

export class ProcessingJobStatusCountsDto {
  @ApiProperty()
  queued!: number;

  @ApiProperty()
  running!: number;

  @ApiProperty()
  succeeded!: number;

  @ApiProperty()
  failed!: number;

  @ApiProperty()
  cancelled!: number;

  @ApiProperty()
  superseded!: number;
}

export class TaxonomyCountsDto {
  @ApiProperty()
  categories!: number;

  @ApiProperty()
  tags!: number;
}

export class UserRoleCountsDto {
  @ApiProperty()
  admins!: number;

  @ApiProperty()
  librarians!: number;

  @ApiProperty()
  readers!: number;

  @ApiProperty()
  total!: number;
}

export class RecentBookSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: BookStatus })
  status!: BookStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class ReportingActivityCountsDto {
  @ApiProperty()
  processing!: number;

  @ApiProperty()
  approval!: number;

  @ApiProperty()
  correction!: number;

  @ApiProperty()
  total!: number;
}

export class ReportingActivityItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  documentId!: string;

  @ApiProperty()
  documentTitle!: string;

  @ApiProperty({ enum: BookAuditAction })
  action!: BookAuditAction;

  @ApiPropertyOptional({ type: String, nullable: true })
  message?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  actorEmail?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class ReportingActivitySummaryDto {
  @ApiProperty({ type: () => ReportingActivityCountsDto })
  counts!: ReportingActivityCountsDto;

  @ApiProperty({ type: [ReportingActivityItemDto] })
  recent!: ReportingActivityItemDto[];
}

export class LibrarianDashboardSummaryDto {
  @ApiProperty({ format: 'date-time' })
  generatedAt!: string;

  @ApiProperty({ type: () => BookStatusCountsDto })
  books!: BookStatusCountsDto;

  @ApiProperty({ type: () => ProcessingJobStatusCountsDto })
  processingJobs!: ProcessingJobStatusCountsDto;

  @ApiProperty({ type: () => TaxonomyCountsDto })
  taxonomy!: TaxonomyCountsDto;

  @ApiProperty({ type: () => UserRoleCountsDto })
  users!: UserRoleCountsDto;

  @ApiProperty({ type: [RecentBookSummaryDto] })
  recentBooks!: RecentBookSummaryDto[];

  @ApiProperty({ type: () => ReportingActivitySummaryDto })
  activity!: ReportingActivitySummaryDto;
}

export const DASHBOARD_BOOK_STATUSES = [
  BookStatus.DRAFT,
  BookStatus.PENDING_PROCESSING,
  BookStatus.PROCESSING,
  BookStatus.PENDING_APPROVAL,
  BookStatus.CORRECTION_REQUIRED,
  BookStatus.PUBLISHED,
  BookStatus.REJECTED
] as const;

export const DASHBOARD_ACTIVITY_ACTIONS = [
  BookAuditAction.PROCESSING_QUEUED,
  BookAuditAction.PROCESSING_STARTED,
  BookAuditAction.PROCESSING_COMPLETED,
  BookAuditAction.APPROVAL_REQUESTED,
  BookAuditAction.APPROVED,
  BookAuditAction.PUBLISHED,
  BookAuditAction.REJECTED,
  BookAuditAction.CORRECTION_REQUESTED
] as const;
