import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsLocale, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

function trimString({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return value.trim();
}

function trimNullableToNull({ value }: { value: unknown }): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export class UpdateGeneralSettingsDto {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libraryName?: string;

  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 254 })
  @IsOptional()
  @Transform(trimNullableToNull)
  @IsEmail()
  @MaxLength(254)
  supportEmail?: string | null;

  @ApiPropertyOptional({ example: 'vi' })
  @IsOptional()
  @Transform(trimString)
  @IsLocale()
  @MaxLength(16)
  defaultLocale?: string;

  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 500 })
  @IsOptional()
  @Transform(trimNullableToNull)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  readerNotice?: string | null;
}

export class DeploymentSecurityMetadataDto {
  @ApiProperty()
  watermarkSigningConfigured!: boolean;

  @ApiProperty()
  scrapeProtectionConfigured!: boolean;

  @ApiProperty({ enum: ['private, no-store'] })
  personalizedPageCachePolicy!: 'private, no-store';

  @ApiProperty({ enum: [false] })
  editable!: false;
}

export class GeneralSettingsResponseDto {
  @ApiProperty()
  libraryName!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  supportEmail?: string | null;

  @ApiProperty()
  defaultLocale!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  readerNotice?: string | null;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  updatedById?: string | null;

  @ApiProperty({ type: () => DeploymentSecurityMetadataDto })
  deploymentSecurity!: DeploymentSecurityMetadataDto;
}
