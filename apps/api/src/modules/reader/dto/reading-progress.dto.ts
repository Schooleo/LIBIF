import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ReadingProgressDto {
  @ApiProperty({ example: 5, description: 'Current page number' })
  @IsInt()
  @Min(1)
  currentPage!: number;

  @ApiProperty({ example: 120, description: 'Authoritative total pages in document' })
  @IsInt()
  @Min(1)
  totalPages!: number;

  @ApiPropertyOptional({ example: 45.5, description: 'Reading progress percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;
}
