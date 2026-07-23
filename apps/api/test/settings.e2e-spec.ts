import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { UserRole } from '../src/generated/prisma/client';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Admin general settings (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminHeaders = {
    'x-libif-dev-role': 'ADMIN',
    'x-libif-dev-user-email': 'admin@libif.local'
  };
  const librarianHeaders = {
    'x-libif-dev-role': 'LIBRARIAN',
    'x-libif-dev-user-email': 'librarian@libif.local'
  };
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;

  beforeAll(async () => {
    process.env.LIBIF_ENABLE_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ProcessingQueue)
      .useClass(FakeProcessingQueue)
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.systemSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        libraryName: 'LIBIF',
        supportEmail: null,
        defaultLocale: 'vi',
        readerNotice: null,
        updatedById: null
      },
      update: {
        libraryName: 'LIBIF',
        supportEmail: null,
        defaultLocale: 'vi',
        readerNotice: null,
        updatedById: null
      }
    });
    await prisma.user.deleteMany({ where: { email: 'admin@libif.local' } });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
  });

  it('persists supported product settings and returns no deployment secrets or thresholds', async () => {
    const admin = await prisma.user.create({
      data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN }
    });

    const response = await request(app.getHttpServer())
      .patch('/api/admin/settings/general')
      .set(adminHeaders)
      .send({
        libraryName: 'LIBIF University',
        supportEmail: 'library@example.edu',
        defaultLocale: 'en-US',
        readerNotice: 'For enrolled readers only.'
      })
      .expect(200);

    expect(response.body).toMatchObject({
      libraryName: 'LIBIF University',
      supportEmail: 'library@example.edu',
      defaultLocale: 'en-US',
      readerNotice: 'For enrolled readers only.',
      updatedById: admin.id,
      deploymentSecurity: {
        watermarkSigningConfigured: false,
        personalizedPageCachePolicy: 'private, no-store',
        editable: false
      }
    });
    expect(response.body.deploymentSecurity).not.toHaveProperty('secret');
    expect(response.body.deploymentSecurity).not.toHaveProperty('rateLimit');
    expect(response.body.deploymentSecurity).not.toHaveProperty('scrapeThreshold');

    const persisted = await prisma.systemSettings.findUniqueOrThrow({ where: { id: 'default' } });
    expect(persisted).toMatchObject({
      libraryName: 'LIBIF University',
      supportEmail: 'library@example.edu',
      defaultLocale: 'en-US',
      readerNotice: 'For enrolled readers only.',
      updatedById: admin.id
    });
  });

  it('returns the same safe metadata on reads and rejects unsupported or invalid fields', async () => {
    await prisma.user.create({
      data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN }
    });

    await request(app.getHttpServer())
      .get('/api/admin/settings/general')
      .set(adminHeaders)
      .expect(200)
      .expect(({ body }) => {
        expect(body.deploymentSecurity).toEqual({
          watermarkSigningConfigured: false,
          scrapeProtectionConfigured: true,
          personalizedPageCachePolicy: 'private, no-store',
          editable: false
        });
      });

    await request(app.getHttpServer())
      .patch('/api/admin/settings/general')
      .set(adminHeaders)
      .send({ supportEmail: 'not-an-email', watermarkSigningSecret: 'must-not-be-accepted' })
      .expect(400);
  });

  it('keeps settings reads and writes admin-only', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/settings/general')
      .set(librarianHeaders)
      .expect(403);
    await request(app.getHttpServer())
      .patch('/api/admin/settings/general')
      .set(librarianHeaders)
      .send({ libraryName: 'Denied' })
      .expect(403);
    await request(app.getHttpServer()).get('/api/admin/settings/general').expect(403);
  });
});
