import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsLocale, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGeneralSettingsDto {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  libraryName?: string;

  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 254 })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  supportEmail?: string | null;

  @ApiPropertyOptional({ example: 'vi' })
  @IsOptional()
  @IsLocale()
  @MaxLength(16)
  defaultLocale?: string;

  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 500 })
  @IsOptional()
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
