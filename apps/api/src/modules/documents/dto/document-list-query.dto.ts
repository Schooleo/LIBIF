import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

/** Mirrors BookStatus enum — avoids coupling DTO to generated Prisma client. */
export const BOOK_STATUS_VALUES = [
  'DRAFT',
  'PENDING_PROCESSING',
  'PROCESSING',
  'PENDING_APPROVAL',
  'PUBLISHED',
  'REJECTED'
] as const;

export type BookStatusValue = (typeof BOOK_STATUS_VALUES)[number];

export class DocumentListQueryDto {
  @ApiPropertyOptional({ description: 'Search title, author, or ISBN' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: BOOK_STATUS_VALUES,
    description: 'Filter by document lifecycle status'
  })
  @IsOptional()
  @IsIn(BOOK_STATUS_VALUES)
  status?: BookStatusValue;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
