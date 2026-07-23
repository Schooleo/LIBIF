import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('AccessModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hasher: PasswordHasher;
  let readerCookie: string;
  let adminCookie: string;
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

    // Create reader
    await prisma.user.create({
      data: {
        email: 'access-reader@example.com',
        passwordHash: await hasher.hash('password-123'),
        role: 'READER',
      },
    });

    // Create admin
    const adminUser = await prisma.user.create({
      data: {
        email: 'access-admin@example.com',
        passwordHash: await hasher.hash('password-123'),
        role: 'ADMIN',
      },
    });

    // Sign in reader
    const readerRes = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'access-reader@example.com', password: 'password-123' })
      .expect(200);
    const rCookie = readerRes.headers['set-cookie'];
    readerCookie = Array.isArray(rCookie) ? rCookie[0].split(';')[0] : (rCookie?.split(';')[0] ?? '');

    // Sign in admin
    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'access-admin@example.com', password: 'password-123' })
      .expect(200);
    const aCookie = adminRes.headers['set-cookie'];
    adminCookie = Array.isArray(aCookie) ? aCookie[0].split(';')[0] : (aCookie?.split(';')[0] ?? '');

    // Create published & draft & correction books with file attachment
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
            sizeBytes: BigInt(1024),
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
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /api/access/documents/:documentId/decision allows reader for published doc and denies for draft doc', async () => {
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
  });

  it('GET /api/access/documents/:documentId/decision denies reader for CORRECTION_REQUIRED doc', async () => {
    const corrRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${correctionBookId}/decision`)
      .set('Cookie', readerCookie)
      .expect(200);
    expect(corrRes.body.allowed).toBe(false);
    expect(corrRes.body.documentStatus).toBe('CORRECTION_REQUIRED');
    expect(corrRes.body.reason).toContain('under revision');
  });

  it('GET /api/access/documents/:documentId/decision allows admin for draft and correction docs', async () => {
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

  it('GET /api/access/documents/:documentId/manifest returns document manifest for published doc', async () => {
    const manifestRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/manifest`)
      .set('Cookie', readerCookie)
      .expect(200);

    expect(manifestRes.body.documentId).toBe(publishedBookId);
    expect(manifestRes.body.pageCount).toBeDefined();
    expect(manifestRes.body.pages).toBeDefined();
  });

  it('GET /api/access/documents/:documentId/pages/:pageNumber delivers watermarked page image with no-store headers', async () => {
    const pageRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${publishedBookId}/pages/1`)
      .set('Cookie', readerCookie)
      .expect(200);

    expect(pageRes.headers['content-type']).toContain('image/png');
    expect(pageRes.headers['cache-control']).toBe('private, no-store');
    expect(pageRes.headers['x-trace-fingerprint']).toBeDefined();
  });

  it('POST download-token is denied (403) for READER role and allowed for ADMIN', async () => {
    await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/download-token`)
      .set('Cookie', readerCookie)
      .expect(403);

    await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/download-token`)
      .set('Cookie', adminCookie)
      .expect(200);
  });
});
