import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateDocumentMetadataDto {
  @ApiProperty({ example: 'Clean Code: A Handbook of Agile Software Craftsmanship' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'Refactoring and Design Principles' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'A comprehensive guide to code craftsmanship.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Prentice Hall' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ example: 2008 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  publishedYear?: number;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '9780132350884' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'cat_software' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: ['Robert C. Martin'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  authors!: string[];

  @ApiPropertyOptional({ example: ['software', 'clean-code'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
