import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadingProgressStateDto {
  @ApiProperty({ example: 5 })
  currentPage!: number;

  @ApiProperty({ example: 100 })
  totalPages!: number;

  @ApiProperty({ example: 5.0 })
  percentage!: number;

  @ApiProperty({ example: '2026-07-21T10:00:00.000Z' })
  lastReadAt!: string;
}

export class ReaderLibraryItemDto {
  @ApiProperty({ example: 'cm123456789' })
  id!: string;

  @ApiProperty({ example: 'Intro to Algorithms' })
  title!: string;

  @ApiPropertyOptional({ example: '2nd Edition' })
  subtitle?: string;

  @ApiProperty({ example: ['Thomas H. Cormen'], type: [String] })
  authors!: string[];

  @ApiPropertyOptional({ example: 'MIT Press' })
  publisher?: string;

  @ApiPropertyOptional({ example: 2009 })
  publishedYear?: number;

  @ApiProperty({ example: 'PUBLISHED' })
  status!: string;

  @ApiProperty({ example: true })
  bookmarked!: boolean;

  @ApiPropertyOptional({ type: ReadingProgressStateDto })
  progress?: ReadingProgressStateDto;

  @ApiProperty({ example: '2026-07-21T10:00:00.000Z' })
  updatedAt!: string;
}

export class ReaderLibraryResponseDto {
  @ApiProperty({ type: [ReaderLibraryItemDto] })
  items!: ReaderLibraryItemDto[];

  @ApiProperty({ example: 10 })
  total!: number;

  @ApiProperty({ example: 3 })
  readingCount!: number;

  @ApiProperty({ example: 5 })
  bookmarkedCount!: number;
}
