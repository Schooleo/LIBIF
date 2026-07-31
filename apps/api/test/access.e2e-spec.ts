import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import Redis from 'ioredis';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { StorageService } from '../src/modules/storage/storage.service';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('AccessModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hasher: PasswordHasher;
  let storage: StorageService;
  let readerCookie: string;
  let adminCookie: string;
  let adminUserId: string;
  let publishedBookId: string;
  let draftBookId: string;
  let correctionBookId: string;

  beforeAll(async () => {
    process.env.LIBIF_SCRYPT_N = '1024';
    process.env.LIBIF_ENABLE_DEV_AUTH = 'false';

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
    hasher = app.get(PasswordHasher);
    storage = app.get(StorageService);
    await clearReaderAccessRateKeys();

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "ReaderAccessEvent", "UserAdministrationEvent" CASCADE;').catch(() => {});
    await prisma.passwordResetToken.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.readingProgress.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.processingJob.deleteMany();
    await prisma.bookFile.deleteMany();
    await prisma.bookTag.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.book.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        email: 'access-reader@example.com',
        passwordHash: await hasher.hash('password-123'),
        role: 'READER',
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        email: 'access-admin@example.com',
        passwordHash: await hasher.hash('password-123'),
        role: 'ADMIN',
      },
    });
    adminUserId = adminUser.id;

    const fixturePath = path.join(__dirname, 'fixtures/valid-sample.pdf');
    const pdfBuffer = await fs.readFile(fixturePath);
    await storage.putObject('documents', 'published.pdf', pdfBuffer, 'application/pdf');

    const readerRes = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'access-reader@example.com', password: 'password-123' })
      .expect(200);
    const rCookie = readerRes.headers['set-cookie'];
    readerCookie = Array.isArray(rCookie) ? rCookie[0].split(';')[0] : (rCookie?.split(';')[0] ?? '');

    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'access-admin@example.com', password: 'password-123' })
      .expect(200);
    const aCookie = adminRes.headers['set-cookie'];
    adminCookie = Array.isArray(aCookie) ? aCookie[0].split(';')[0] : (aCookie?.split(';')[0] ?? '');

    const pub = await prisma.book.create({
      data: {
        title: 'Published Document',
        status: 'PUBLISHED',
        createdById: adminUser.id,
        files: {
          create: {
            originalFilename: 'published.pdf',
            bucket: 'documents',
            objectKey: 'published.pdf',
            mimeType: 'application/pdf',
            sizeBytes: BigInt(pdfBuffer.length),
            checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            status: 'ACTIVE',
          },
        },
      },
    });
    publishedBookId = pub.id;

    const draft = await prisma.book.create({
      data: { title: 'Draft Document', status: 'DRAFT', createdById: adminUser.id },
    });
    draftBookId = draft.id;

    const correction = await prisma.book.create({
      data: { title: 'Correction Document', status: 'CORRECTION_REQUIRED', createdById: adminUser.id },
    });
    correctionBookId = correction.id;
  });

  afterAll(async () => {
    await clearReaderAccessRateKeys();
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await clearReaderAccessRateKeys();
  });

  it('allows reader for published doc and denies for draft/correction docs', async () => {
    const pubRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/decision`)
      .set('Cookie', readerCookie)
      .expect(200);
    expect(pubRes.body.allowed).toBe(true);

    const draftRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${draftBookId}/decision`)
      .set('Cookie', readerCookie)
      .expect(200);
    expect(draftRes.body.allowed).toBe(false);

    const corrRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${correctionBookId}/decision`)
      .set('Cookie', readerCookie)
      .expect(200);
    expect(corrRes.body.allowed).toBe(false);
    expect(corrRes.body.documentStatus).toBe('CORRECTION_REQUIRED');
    expect(corrRes.body.reason).toContain('under revision');
  });

  it('allows admin for draft and correction docs', async () => {
    const adminDraftRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${draftBookId}/decision`)
      .set('Cookie', adminCookie)
      .expect(200);
    expect(adminDraftRes.body.allowed).toBe(true);

    const adminCorrRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${correctionBookId}/decision`)
      .set('Cookie', adminCookie)
      .expect(200);
    expect(adminCorrRes.body.allowed).toBe(true);
  });

  it('returns a manifest from the real renderer wiring for a published doc', async () => {
    const manifestRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/manifest`)
      .set('Cookie', readerCookie)
      .expect(200);

    expect(manifestRes.body.documentId).toBe(publishedBookId);
    expect(manifestRes.body.pageCount).toBe(2);
    expect(manifestRes.body.pages).toEqual([
      expect.objectContaining({ pageNumber: 1 }),
      expect.objectContaining({ pageNumber: 2 }),
    ]);
  });

  it('delivers a watermarked page image with no-store headers', async () => {
    const pageRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/pages/1`)
      .set('Cookie', readerCookie)
      .expect(200);

    expect(pageRes.headers['content-type']).toMatch(/^image\//);
    expect(pageRes.headers['cache-control']).toBe('private, no-store');
    expect(pageRes.headers['x-trace-fingerprint']).toMatch(/^[a-f0-9]{64}$/);
    expect(pageRes.body).toBeInstanceOf(Buffer);

    const event = await prisma.readerAccessEvent.findUnique({
      where: { traceFingerprint: pageRes.headers['x-trace-fingerprint'] },
    });
    expect(event).toMatchObject({
      eventType: 'PAGE_SERVED',
      bookId: publishedBookId,
      pageNumber: 1,
      traceFingerprint: pageRes.headers['x-trace-fingerprint'],
    });
    expect(event?.sessionId).toMatch(/^[a-f0-9]{64}$/);
    expect(readerCookie).not.toContain(event?.sessionId ?? '');
  });

  it('denies reader raw-source routes and denies fabricated staff tokens', async () => {
    await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/view-token`)
      .set('Cookie', readerCookie)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/stream?token=view_${publishedBookId}_fake`)
      .set('Cookie', readerCookie)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/file?token=download_${publishedBookId}_fake`)
      .set('Cookie', readerCookie)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/stream?token=view_${publishedBookId}_fake`)
      .set('Cookie', adminCookie)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/file?token=download_${publishedBookId}_fake`)
      .set('Cookie', adminCookie)
      .expect(403);
  });

  it('allows staff-only download-token and separate raw-source behaviors', async () => {
    const viewTokenRes = await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/view-token`)
      .set('Cookie', adminCookie)
      .expect(200);

    const downloadTokenRes = await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/download-token`)
      .set('Cookie', adminCookie)
      .expect(200);

    await request(app.getHttpServer())
      .get(viewTokenRes.body.url)
      .set('Cookie', adminCookie)
      .expect(200)
      .expect('Content-Type', /application\/pdf/)
      .expect('Content-Disposition', /inline/);

    await request(app.getHttpServer())
      .get(downloadTokenRes.body.url)
      .set('Cookie', adminCookie)
      .expect(200)
      .expect('Content-Type', /application\/pdf/)
      .expect('Content-Disposition', /attachment/);
  });

  it('turns committed high-risk scrape facts into one deduplicated safe staff alert', async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      await request(app.getHttpServer())
        .get(`/api/access/documents/${publishedBookId}/pages/999`)
        .set('Cookie', readerCookie)
        .expect(404);
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      await request(app.getHttpServer())
        .get(`/api/access/documents/${publishedBookId}/pages/999`)
        .set('Cookie', readerCookie)
        .expect(429);
    }

    const alerts = await prisma.notification.findMany({
      where: {
        recipientId: adminUserId,
        actionHref: '/admin/reports/reader-access',
      },
    });
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: 'SYSTEM',
      title: 'Reader access risk alert',
      body: 'Suspicious reader activity requires review.',
    });

    const serialized = JSON.stringify(alerts[0].payload);
    for (const forbidden of [
      publishedBookId,
      adminUserId,
      'documentId',
      'pageNumber',
      'userId',
      'sessionId',
      'traceFingerprint',
      'objectKey',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it('returns 429 with numeric Retry-After while keeping the stable JSON body', async () => {
    for (let i = 0; i < 30; i++) {
      await request(app.getHttpServer())
        .get(`/api/access/documents/${publishedBookId}/pages/1`)
        .set('Cookie', readerCookie)
        .expect(200);
    }

    const rateLimited = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/pages/1`)
      .set('Cookie', readerCookie)
      .expect(429);

    expect(rateLimited.headers['retry-after']).toMatch(/^\d+$/);
    expect(rateLimited.body.code).toBe('READER_PAGE_RATE_LIMITED');
    expect(typeof rateLimited.body.retryAfterSeconds).toBe('number');
    expect(rateLimited.body.retryAfterSeconds).toBeGreaterThan(0);
  });
});

async function clearReaderAccessRateKeys(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return;
  const redis = new Redis(redisUrl);
  try {
    const keys = await redis.keys('reader-access:v1:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } finally {
    await redis.quit();
  }
}
