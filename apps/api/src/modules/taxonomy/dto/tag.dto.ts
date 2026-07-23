import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

function normalizeName({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;
}

export class TaxonomyTagDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;
}

export class CreateTaxonomyTagDto {
  @ApiProperty({ example: 'Digital Preservation' })
  @Transform(normalizeName)
  @IsString()
  @MinLength(1)
  name!: string;
}

export class UpdateTaxonomyTagDto {
  @ApiPropertyOptional({ example: 'Digital Preservation' })
  @Transform(normalizeName)
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}

export class TaxonomyTagImpactDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  documentCount!: number;
}

export class MergeTagDto {
  @ApiProperty({ description: 'Target tag ID to merge source tag into.' })
  @Transform(normalizeName)
  @IsString()
  @MinLength(1)
  targetTagId!: string;
}

