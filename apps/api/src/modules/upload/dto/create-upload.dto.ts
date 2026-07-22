import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateUploadDto {
  @ApiProperty({ example: 'Operating Systems Principles' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'Concepts and Architecture' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'Comprehensive guide to OS internals.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Wiley' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  publishedYear?: number;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '9781118063330' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'cat_comp_sci' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: ['Abraham Silberschatz'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  authors!: string[];

  @ApiPropertyOptional({ example: ['operating-systems', 'computer-science'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
