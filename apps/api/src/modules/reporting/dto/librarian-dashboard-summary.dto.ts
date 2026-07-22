import { ApiProperty } from '@nestjs/swagger';
import { BookStatus } from '../../../generated/prisma/client';

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
