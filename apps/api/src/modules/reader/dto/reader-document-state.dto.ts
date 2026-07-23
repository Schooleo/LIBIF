import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadingProgressStatus } from '../../../generated/prisma/client';

export class ReaderDocumentProgressDto {
  @ApiProperty({ minimum: 1 })
  currentPage!: number;

  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1 })
  totalPages?: number | null;

  @ApiProperty({ minimum: 0, maximum: 100 })
  percentage!: number;

  @ApiProperty({ enum: ReadingProgressStatus })
  status!: ReadingProgressStatus;

  @ApiProperty({ format: 'date-time' })
  lastReadAt!: string;
}

export class ReaderDocumentStateDto {
  @ApiProperty()
  documentId!: string;

  @ApiProperty()
  bookmarked!: boolean;

  @ApiPropertyOptional({ type: () => ReaderDocumentProgressDto, nullable: true })
  progress?: ReaderDocumentProgressDto | null;
}
