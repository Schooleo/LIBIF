import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalReviewStatus, BookAuditAction, BookFileStatus, BookStatus, ProcessingJobStatus } from '../../../generated/prisma/client';
import { AuthorResponseDto, CategoryResponseDto, TagResponseDto } from '../../catalog/dto/catalog-response.dto';

export class BookFileVersionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  originalFilename!: string;

  @ApiProperty()
  sizeBytes!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty({ enum: BookFileStatus })
  status!: BookFileStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class BookAuditEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: BookAuditAction })
  action!: BookAuditAction;

  @ApiPropertyOptional({ type: String, nullable: true })
  message?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  actorEmail?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class ProcessingJobSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ProcessingJobStatus })
  status!: ProcessingJobStatus;

  @ApiPropertyOptional({ type: String, nullable: true })
  stage?: string | null;

  @ApiProperty()
  progressPercent!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  errorMessage?: string | null;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}

export class ApprovalReviewSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ApprovalReviewStatus })
  status!: ApprovalReviewStatus;

  @ApiPropertyOptional({ type: String, nullable: true })
  reason?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  requestedChanges?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reviewerEmail?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  decidedAt?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class DocumentDetailResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  subtitle?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  publisher?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  publishedYear?: number | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  language?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  isbn?: string | null;

  @ApiProperty({ enum: BookStatus })
  status!: BookStatus;

  @ApiPropertyOptional({ type: () => CategoryResponseDto, nullable: true })
  category?: CategoryResponseDto | null;

  @ApiProperty({ type: [TagResponseDto] })
  tags!: TagResponseDto[];

  @ApiProperty({ type: [AuthorResponseDto] })
  authors!: AuthorResponseDto[];

  @ApiProperty({ type: [BookFileVersionDto] })
  files!: BookFileVersionDto[];

  @ApiPropertyOptional({ type: () => BookFileVersionDto, nullable: true })
  activeFile?: BookFileVersionDto | null;

  @ApiPropertyOptional({ type: () => ProcessingJobSummaryDto, nullable: true })
  activeProcessingJob?: ProcessingJobSummaryDto | null;

  @ApiProperty({ type: [ProcessingJobSummaryDto] })
  processingHistory!: ProcessingJobSummaryDto[];

  @ApiProperty({ type: [ApprovalReviewSummaryDto] })
  approvalHistory!: ApprovalReviewSummaryDto[];

  @ApiPropertyOptional({ type: () => ApprovalReviewSummaryDto, nullable: true })
  latestApprovalReview?: ApprovalReviewSummaryDto | null;

  @ApiProperty({ type: [BookAuditEventDto] })
  auditHistory!: BookAuditEventDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}

export class PagedDocumentListResponseDto {
  @ApiProperty({ type: [DocumentDetailResponseDto] })
  items!: DocumentDetailResponseDto[];

  @ApiProperty()
  totalCount!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  totalPages!: number;
}
