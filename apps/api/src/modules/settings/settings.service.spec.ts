import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: {
    systemSettings: {
      findUniqueOrThrow: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      systemSettings: {
        findUniqueOrThrow: jest.fn(),
        update: jest.fn()
      }
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'test';
              return undefined;
            })
          }
        }
      ]
    }).compile();

    service = moduleRef.get(SettingsService);
  });

  it('returns product settings with safe read-only capability metadata', async () => {
    prisma.systemSettings.findUniqueOrThrow.mockResolvedValue({
      id: 'default',
      libraryName: 'LIBIF',
      supportEmail: null,
      defaultLocale: 'vi',
      readerNotice: null,
      updatedAt: new Date('2026-07-23T10:00:00.000Z'),
      updatedById: null
    });

    await expect(service.getGeneralSettings()).resolves.toEqual({
      libraryName: 'LIBIF',
      supportEmail: null,
      defaultLocale: 'vi',
      readerNotice: null,
      updatedAt: '2026-07-23T10:00:00.000Z',
      updatedById: null,
      deploymentSecurity: {
        watermarkSigningConfigured: false,
        scrapeProtectionConfigured: true,
        personalizedPageCachePolicy: 'private, no-store',
        editable: false
      }
    });
  });

  it('updates only provided fields and always persists the real admin updater', async () => {
    prisma.systemSettings.update.mockResolvedValue({
      id: 'default',
      libraryName: 'LIBIF University Library',
      supportEmail: null,
      defaultLocale: 'en-US',
      readerNotice: null,
      updatedAt: new Date('2026-07-23T10:05:00.000Z'),
      updatedById: 'admin-1'
    });

    await expect(
      service.updateGeneralSettings(
        { libraryName: 'LIBIF University Library', defaultLocale: 'en-US' },
        'admin-1'
      )
    ).resolves.toMatchObject({
      libraryName: 'LIBIF University Library',
      defaultLocale: 'en-US',
      updatedById: 'admin-1',
      deploymentSecurity: { editable: false }
    });

    expect(prisma.systemSettings.update).toHaveBeenCalledWith({
      where: { id: 'default' },
      data: {
        libraryName: 'LIBIF University Library',
        defaultLocale: 'en-US',
        updatedById: 'admin-1'
      }
    });
  });

  it('persists explicit nullable blanks after dto normalization as null', async () => {
    prisma.systemSettings.update.mockResolvedValue({
      id: 'default',
      libraryName: 'LIBIF',
      supportEmail: null,
      defaultLocale: 'vi',
      readerNotice: null,
      updatedAt: new Date('2026-07-23T10:10:00.000Z'),
      updatedById: 'admin-2'
    });

    await service.updateGeneralSettings({ supportEmail: null, readerNotice: null }, 'admin-2');

    expect(prisma.systemSettings.update).toHaveBeenCalledWith({
      where: { id: 'default' },
      data: {
        supportEmail: null,
        readerNotice: null,
        updatedById: 'admin-2'
      }
    });
  });

  it('treats an empty patch as updater evidence without overwriting product fields', async () => {
    prisma.systemSettings.update.mockResolvedValue({
      id: 'default',
      libraryName: 'LIBIF',
      supportEmail: null,
      defaultLocale: 'vi',
      readerNotice: null,
      updatedAt: new Date('2026-07-23T10:15:00.000Z'),
      updatedById: 'admin-3'
    });

    await service.updateGeneralSettings({}, 'admin-3');

    expect(prisma.systemSettings.update).toHaveBeenCalledWith({
      where: { id: 'default' },
      data: { updatedById: 'admin-3' }
    });
  });

  it('does not claim detector configuration in production without Redis', () => {
    const productionService = new SettingsService(prisma as never, {
      get: (key: string) => (key === 'NODE_ENV' ? 'production' : undefined)
    } as ConfigService);

    expect(productionService.getDeploymentSecurityMetadata()).toEqual({
      watermarkSigningConfigured: false,
      scrapeProtectionConfigured: false,
      personalizedPageCachePolicy: 'private, no-store',
      editable: false
    });
  });
});
