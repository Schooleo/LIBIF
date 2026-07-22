import { ApiProperty } from '@nestjs/swagger';
import { ProcessingJobResponseDto } from './processing-job.dto';

export class ProcessingJobHistoryDto {
  @ApiProperty({ type: ProcessingJobResponseDto })
  current!: ProcessingJobResponseDto;

  @ApiProperty({ type: [ProcessingJobResponseDto] })
  history!: ProcessingJobResponseDto[];
}
