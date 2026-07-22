import { ApiProperty } from '@nestjs/swagger';
import { BookStatus, ProcessingJobStatus } from '../../../generated/prisma/client';

export class IntakeBookSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: BookStatus })
  status!: BookStatus;
}

export class IntakeFileSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  originalFilename!: string;

  @ApiProperty({ example: '123456' })
  sizeBytes!: string;
}

export class IntakeProcessingJobSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ProcessingJobStatus })
  status!: ProcessingJobStatus;
}

export class CreateBookIntakeResponseDto {
  @ApiProperty({ type: IntakeBookSummaryDto })
  book!: IntakeBookSummaryDto;

  @ApiProperty({ type: IntakeFileSummaryDto })
  file!: IntakeFileSummaryDto;

  @ApiProperty({ type: IntakeProcessingJobSummaryDto })
  processingJob!: IntakeProcessingJobSummaryDto;
}
