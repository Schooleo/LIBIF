import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

function normalizeName({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;
}

function normalizeParentId({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return value.trim() || null;
}

export class TaxonomyCategoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: String, nullable: true })
  parentId!: string | null;
}

export class CreateTaxonomyCategoryDto {
  @ApiProperty({ example: 'Institutional Archives' })
  @Transform(normalizeName)
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ type: String, nullable: true, description: 'Parent category ID. Omit or pass null for a root category.' })
  @Transform(normalizeParentId)
  @IsOptional()
  @IsString()
  parentId?: string | null;
}

export class UpdateTaxonomyCategoryDto {
  @ApiPropertyOptional({ example: 'Institutional Archives' })
  @Transform(normalizeName)
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ type: String, nullable: true, description: 'Parent category ID. Pass null to move the category to the root.' })
  @Transform(normalizeParentId)
  @IsOptional()
  @IsString()
  parentId?: string | null;
}
