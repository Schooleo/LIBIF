import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessingJobStatus } from '../../../generated/prisma/client';

export class ProcessingJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  bookId!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty({ enum: ProcessingJobStatus })
  status!: ProcessingJobStatus;

  @ApiProperty()
  attempts!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  errorMessage?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
