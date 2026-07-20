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

export class BookListItemResponseDto {
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

  @ApiPropertyOptional({ type: () => BookFileSummaryDto, nullable: true })
  file?: BookFileSummaryDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
