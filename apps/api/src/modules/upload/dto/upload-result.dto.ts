import { ApiProperty } from '@nestjs/swagger';
import { BookStatus, ProcessingJobStatus } from '../../../generated/prisma/client';

export class UploadResultBookDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: BookStatus })
  status!: BookStatus;
}

export class UploadResultFileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  originalFilename!: string;

  @ApiProperty()
  sizeBytes!: string;
}

export class UploadResultJobDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ProcessingJobStatus })
  status!: ProcessingJobStatus;
}

export class UploadResultDto {
  @ApiProperty({ type: () => UploadResultBookDto })
  book!: UploadResultBookDto;

  @ApiProperty({ type: () => UploadResultFileDto })
  file!: UploadResultFileDto;

  @ApiProperty({ type: () => UploadResultJobDto })
  processingJob!: UploadResultJobDto;
}
