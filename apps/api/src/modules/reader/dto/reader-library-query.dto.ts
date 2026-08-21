import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum ReaderLibraryFilter {
  ALL = 'ALL',
  READING = 'READING',
  BOOKMARKED = 'BOOKMARKED',
  COMPLETED = 'COMPLETED',
}

export class ReaderLibraryQueryDto {
  @ApiPropertyOptional({ enum: ReaderLibraryFilter, default: ReaderLibraryFilter.ALL })
  @IsOptional()
  @IsEnum(ReaderLibraryFilter)
  filter?: ReaderLibraryFilter = ReaderLibraryFilter.ALL;

  @ApiPropertyOptional({ description: 'Search term for title or author' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
