import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessingJobStatus } from '../../../generated/prisma/client';

export class ProcessingJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  bookId!: string;

  @ApiProperty()
  bookFileId!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  bookTitle?: string | null;

  @ApiProperty()
  type!: string;

  @ApiProperty({ enum: ProcessingJobStatus })
  status!: ProcessingJobStatus;

  @ApiPropertyOptional({ type: String, nullable: true })
  stage?: string | null;

  @ApiPropertyOptional({ type: Number })
  progressPercent?: number;

  @ApiProperty()
  attemptNumber!: number;

  @ApiProperty()
  attempts!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  retryOfJobId?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  terminalReason?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  errorMessage?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
