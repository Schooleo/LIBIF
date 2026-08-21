import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookStatus } from '../../../generated/prisma/client';

export class CategoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  parentId?: string | null;
}

export class TagResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;
}

export class AuthorResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class BookFileSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  originalFilename!: string;

  @ApiProperty({ example: '123456' })
  sizeBytes!: string;
}

export class PublicBookListItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

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

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class PublicBookDetailResponseDto extends PublicBookListItemResponseDto {
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
}

export class AdminBookListItemResponseDto extends PublicBookListItemResponseDto {
  @ApiPropertyOptional({ type: () => BookFileSummaryDto, nullable: true })
  file?: BookFileSummaryDto | null;
}

export class PagedPublicBookListResponseDto {
  @ApiPropertyOptional({ type: [PublicBookListItemResponseDto] })
  items!: PublicBookListItemResponseDto[];

  @ApiPropertyOptional({ description: 'Total number of items matching the query' })
  totalCount!: number;

  @ApiPropertyOptional({ description: 'Current page (1-based)' })
  page!: number;

  @ApiPropertyOptional({ description: 'Page size requested' })
  pageSize!: number;
}
