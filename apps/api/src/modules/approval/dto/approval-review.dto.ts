import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalReviewStatus } from '../../../generated/prisma/client';

export class ApprovalReviewResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  bookId!: string;

  @ApiProperty()
  bookFileId!: string;

  @ApiProperty()
  processingJobId!: string;

  @ApiProperty()
  round!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  bookTitle?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reviewerId?: string | null;

  @ApiProperty({ enum: ApprovalReviewStatus })
  status!: ApprovalReviewStatus;

  @ApiPropertyOptional({ type: String, nullable: true })
  reason?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  requestedChanges?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  decidedAt?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  supersededAt?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
