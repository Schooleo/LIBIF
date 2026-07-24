import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { ReaderAccessRiskLevel } from '../src/generated/prisma/client';
import { seedDevelopmentData } from '../prisma/seed';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Reader-access reporting seed slice (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminHeaders = { 'x-libif-dev-role': 'ADMIN', 'x-libif-dev-user-email': 'admin@libif.local' };
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;

  beforeAll(async () => {
    process.env.LIBIF_ENABLE_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(ProcessingQueue).useClass(FakeProcessingQueue).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "ReaderAccessEvent", "UserAdministrationEvent" CASCADE;').catch(() => {});
    await prisma.passwordResetToken.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.approvalReview.deleteMany();
    await prisma.bookAuditEvent.deleteMany();
    await prisma.processingJob.deleteMany();
    await prisma.bookFile.deleteMany();
    await prisma.bookTag.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.book.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
  });

  it('seeds the phase 7 reader-access sample idempotently and exposes trace fingerprints in reports', async () => {
    await seedDevelopmentData(prisma as never);
    await seedDevelopmentData(prisma as never);

    const seededBook = await prisma.book.findMany({ where: { isbn: 'phase7-wave4-reader-access-sample' }, select: { id: true } });
    const seededFile = await prisma.bookFile.findMany({ where: { objectKey: 'seed/phase7-wave4-reader-access-sample.pdf' }, select: { id: true } });
    const seededEvents = await prisma.readerAccessEvent.findMany({
      where: { id: { startsWith: 'phase7-reader-event-' } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, traceFingerprint: true, sessionId: true, userId: true }
    });

    expect(seededBook).toHaveLength(1);
    expect(seededFile).toHaveLength(1);
    expect(seededEvents).toEqual([
      {
        id: 'phase7-reader-event-viewer-opened',
        traceFingerprint: null,
        sessionId: null,
        userId: expect.any(String)
      },
      {
        id: 'phase7-reader-event-page-served',
        traceFingerprint: '22a6b6df2f7939f0ddf6f1bb3981ee55137d593208ab8d1a11d8b1a7d9766e44',
        sessionId: '6c58d5f6b8797786c58d5f6b8797786c58d5f6b8797786c58d5f6b8797786',
        userId: expect.any(String)
      },
      {
        id: 'phase7-reader-event-page-served-second-reader',
        traceFingerprint: '7743989bd1fcb3c3a9f3c34fef785a0e0de62b18d65da182c8821d3bd141b354',
        sessionId: '13ecac240f3569c113ecac240f3569c113ecac240f3569c113ecac240f3569c1',
        userId: expect.any(String)
      },
      { id: 'phase7-reader-event-page-denied', traceFingerprint: null, sessionId: null, userId: expect.any(String) },
      { id: 'phase7-reader-event-rate-limited', traceFingerprint: null, sessionId: null, userId: expect.any(String) },
      { id: 'phase7-reader-event-scrape-suspected', traceFingerprint: null, sessionId: null, userId: expect.any(String) }
    ]);
    expect(seededEvents[1].userId).not.toBe(seededEvents[2].userId);
    expect(seededEvents[1].sessionId).not.toBe(seededEvents[2].sessionId);
    await expect(
      prisma.notification.count({ where: { id: 'phase7-reader-risk-alert-admin' } }),
    ).resolves.toBe(1);

    const response = await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z', pageSize: 200 })
      .set(adminHeaders)
      .expect(200);

    expect(response.body.totalCount).toBe(6);
    expect(response.body.riskCounts).toEqual({ none: 3, low: 2, medium: 0, high: 1 });
    expect(response.body.items.map((item: { eventType: string }) => item.eventType)).toEqual([
      'SCRAPE_SUSPECTED',
      'RATE_LIMITED',
      'PAGE_DENIED',
      'PAGE_SERVED',
      'PAGE_SERVED',
      'VIEWER_OPENED'
    ]);
    expect(
      response.body.items
        .filter((item: { traceFingerprint: string | null }) => item.traceFingerprint)
        .map((item: { traceFingerprint: string }) => item.traceFingerprint)
    ).toEqual([
      '7743989bd1fcb3c3a9f3c34fef785a0e0de62b18d65da182c8821d3bd141b354',
      '22a6b6df2f7939f0ddf6f1bb3981ee55137d593208ab8d1a11d8b1a7d9766e44'
    ]);

    const filtered = await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z', risk: ReaderAccessRiskLevel.HIGH })
      .set(adminHeaders)
      .expect(200);
    expect(filtered.body.items.map((item: { eventType: string }) => item.eventType)).toEqual(['SCRAPE_SUSPECTED']);
  });
});
