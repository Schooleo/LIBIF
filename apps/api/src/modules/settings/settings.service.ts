import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { type UpdateGeneralSettingsDto } from './dto/settings.dto';

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
  constructor(private readonly prisma: PrismaService) {}

  async getGeneralSettings(): Promise<StoredGeneralSettings> {
    const settings = await this.prisma.systemSettings.findUniqueOrThrow({
      where: { id: SYSTEM_SETTINGS_ID }
    });

    return this.toStoredGeneralSettings(settings);
  }

  async updateGeneralSettings(
    input: UpdateGeneralSettingsDto,
    updatedById: string
  ): Promise<StoredGeneralSettings> {
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

    return this.toStoredGeneralSettings(settings);
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
