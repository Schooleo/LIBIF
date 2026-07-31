import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { PROTECTED_PAGE_RENDERER } from '../src/modules/rendering/protected-page-renderer.port';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('ReaderModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hasher: PasswordHasher;
  let readerCookie: string;
  let testBookId: string;
  let draftBookId: string;

  beforeAll(async () => {
    process.env.LIBIF_SCRYPT_N = '1024';
    process.env.LIBIF_ENABLE_DEV_AUTH = 'false';

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ProcessingQueue)
      .useClass(FakeProcessingQueue)
      .overrideProvider(PROTECTED_PAGE_RENDERER)
      .useValue({
        renderBasePage: jest.fn().mockResolvedValue({
          content: Buffer.from('base'),
          contentType: 'image/png',
          pageNumber: 1,
          pageCount: 150,
          width: 800,
          height: 1000,
          profile: 'READER_STANDARD',
        }),
        composeWatermark: jest.fn(),
      })
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

    const readerUser = await prisma.user.create({
      data: {
        email: 'reader-e2e@example.com',
        passwordHash: await hasher.hash('reader-password-123'),
        role: 'READER',
      },
    });

    const signInRes = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'reader-e2e@example.com', password: 'reader-password-123' })
      .expect(200);

    const setCookie = signInRes.headers['set-cookie'];
    readerCookie = Array.isArray(setCookie) ? setCookie[0].split(';')[0] : (setCookie?.split(';')[0] ?? '');

    const book = await prisma.book.create({
      data: {
        title: 'Published Test Book',
        status: 'PUBLISHED',
        createdById: readerUser.id,
        files: {
          create: {
            originalFilename: 'reader-test.pdf',
            bucket: 'documents',
            objectKey: 'reader-test.pdf',
            mimeType: 'application/pdf',
            sizeBytes: BigInt(1),
            checksumSha256: 'reader-e2e-checksum',
            status: 'ACTIVE',
          },
        },
      },
    });
    testBookId = book.id;

    const draftBook = await prisma.book.create({
      data: {
        title: 'Draft Test Book',
        status: 'DRAFT',
        createdById: readerUser.id,
      },
    });
    draftBookId = draftBook.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /api/reader/library returns published books for authenticated reader', async () => {
    const res = await request(app.getHttpServer()).get('/api/reader/library').set('Cookie', readerCookie).expect(200);

    expect(res.body.items).toBeDefined();
    expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    expect(res.body.items[0].id).toBe(testBookId);
  });

  it('GET /api/reader/documents/:documentId/state returns reader state', async () => {
    const res = await request(app.getHttpServer()).get(`/api/reader/documents/${testBookId}/state`).set('Cookie', readerCookie).expect(200);

    expect(res.body.documentId).toBe(testBookId);
    expect(res.body.bookmarked).toBe(false);
  });

  it('GET /api/reader/documents/:documentId/state hides unpublished documents', async () => {
    await request(app.getHttpServer()).get(`/api/reader/documents/${draftBookId}/state`).set('Cookie', readerCookie).expect(404);
  });

  it('POST /api/reader/bookmarks and GET /api/reader/bookmarks manages bookmarks', async () => {
    await request(app.getHttpServer())
      .post('/api/reader/bookmarks')
      .set('Cookie', readerCookie)
      .send({ documentId: testBookId })
      .expect(200);

    const stateRes = await request(app.getHttpServer())
      .get(`/api/reader/documents/${testBookId}/state`)
      .set('Cookie', readerCookie)
      .expect(200);
    expect(stateRes.body.bookmarked).toBe(true);

    await request(app.getHttpServer()).delete(`/api/reader/bookmarks/${testBookId}`).set('Cookie', readerCookie).expect(200);
  });

  it('POST /api/reader/bookmarks does not reveal unpublished documents', async () => {
    await request(app.getHttpServer())
      .post('/api/reader/bookmarks')
      .set('Cookie', readerCookie)
      .send({ documentId: draftBookId })
      .expect(404);
  });

  it('PATCH /api/reader/progress/:documentId updates reading progress and hydrates state', async () => {
    const patchRes = await request(app.getHttpServer())
      .patch(`/api/reader/progress/${testBookId}`)
      .set('Cookie', readerCookie)
      .send({ currentPage: 15, totalPages: 150 })
      .expect(200);

    expect(patchRes.body.currentPage).toBe(15);
    expect(patchRes.body.percentage).toBe(10);

    const stateRes = await request(app.getHttpServer())
      .get(`/api/reader/documents/${testBookId}/state`)
      .set('Cookie', readerCookie)
      .expect(200);

    expect(stateRes.body.progress?.currentPage).toBe(15);
    expect(stateRes.body.progress?.totalPages).toBe(150);
  });

  it('PATCH /api/reader/progress/:documentId rejects bounds and fabricated totals', async () => {
    await request(app.getHttpServer())
      .patch(`/api/reader/progress/${testBookId}`)
      .set('Cookie', readerCookie)
      .send({ currentPage: 151, totalPages: 150 })
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/api/reader/progress/${testBookId}`)
      .set('Cookie', readerCookie)
      .send({ currentPage: 10, totalPages: 150, percentage: 99 })
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/api/reader/progress/${testBookId}`)
      .set('Cookie', readerCookie)
      .send({ currentPage: 16, totalPages: 151 })
      .expect(400);
  });

  it('PATCH /api/reader/progress/:documentId hides unpublished documents', async () => {
    await request(app.getHttpServer())
      .patch(`/api/reader/progress/${draftBookId}`)
      .set('Cookie', readerCookie)
      .send({ currentPage: 1, totalPages: 10 })
      .expect(404);
  });
});
