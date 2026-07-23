import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import {
  type DeploymentSecurityMetadataDto,
  type GeneralSettingsResponseDto,
  type UpdateGeneralSettingsDto
} from './dto/settings.dto';

const SYSTEM_SETTINGS_ID = 'default';

export interface StoredGeneralSettings {
  libraryName: string;
  supportEmail: string | null;
  defaultLocale: string;
  readerNotice: string | null;
  updatedAt: string;
  updatedById: string | null;
}

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  async getGeneralSettings(): Promise<GeneralSettingsResponseDto> {
    const settings = await this.prisma.systemSettings.findUniqueOrThrow({
      where: { id: SYSTEM_SETTINGS_ID }
    });

    return {
      ...this.toStoredGeneralSettings(settings),
      deploymentSecurity: this.getDeploymentSecurityMetadata()
    };
  }

  async updateGeneralSettings(
    input: UpdateGeneralSettingsDto,
    updatedById: string
  ): Promise<GeneralSettingsResponseDto> {
    const settings = await this.prisma.systemSettings.update({
      where: { id: SYSTEM_SETTINGS_ID },
      data: {
        ...(input.libraryName !== undefined ? { libraryName: input.libraryName } : {}),
        ...(input.supportEmail !== undefined ? { supportEmail: input.supportEmail } : {}),
        ...(input.defaultLocale !== undefined ? { defaultLocale: input.defaultLocale } : {}),
        ...(input.readerNotice !== undefined ? { readerNotice: input.readerNotice } : {}),
        updatedById
      }
    });

    return {
      ...this.toStoredGeneralSettings(settings),
      deploymentSecurity: this.getDeploymentSecurityMetadata()
    };
  }

  getDeploymentSecurityMetadata(): DeploymentSecurityMetadataDto {
    const nodeEnv = this.config.get<string>('NODE_ENV') ?? process.env.NODE_ENV;
    const redisConfigured = Boolean(this.config.get<string>('REDIS_URL')?.trim());
    const developmentFallbackConfigured =
      nodeEnv === 'test' ||
      (nodeEnv !== 'production' &&
        this.config.get<string>('LIBIF_ALLOW_IN_MEMORY_READER_LIMITS') === 'true');

    return {
      watermarkSigningConfigured: false,
      scrapeProtectionConfigured: redisConfigured || developmentFallbackConfigured,
      personalizedPageCachePolicy: 'private, no-store',
      editable: false
    };
  }

  private toStoredGeneralSettings(settings: {
    libraryName: string;
    supportEmail: string | null;
    defaultLocale: string;
    readerNotice: string | null;
    updatedAt: Date;
    updatedById: string | null;
  }): StoredGeneralSettings {
    return {
      libraryName: settings.libraryName,
      supportEmail: settings.supportEmail,
      defaultLocale: settings.defaultLocale,
      readerNotice: settings.readerNotice,
      updatedAt: settings.updatedAt.toISOString(),
      updatedById: settings.updatedById
    };
  }
}
