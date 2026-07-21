import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CatalogQueryDto {
  @ApiPropertyOptional({ description: 'Full-text search over title and isbn' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Category id to filter' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Comma-separated tag ids to filter' })
  @IsOptional()
  @IsString()
  tagIds?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Sort spec, e.g. createdAt_desc or title_asc' })
  @IsOptional()
  @IsString()
  sort?: string;
}
