import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

const currentYear = new Date().getFullYear();

export class CreateBookIntakeDto {
  @IsOptional()
  @IsString()
  isbn?: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  authors!: string[];

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(currentYear + 1)
  publishedYear?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  tags: string[] = [];
}
