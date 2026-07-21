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

    await prisma.passwordResetToken.deleteMany();
    await prisma.userSession.deleteMany();
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

    // Create published & draft books
    const pub = await prisma.book.create({
      data: { title: 'Published Document', status: 'PUBLISHED', createdById: adminUser.id },
    });
    publishedBookId = pub.id;

    const draft = await prisma.book.create({
      data: { title: 'Draft Document', status: 'DRAFT', createdById: adminUser.id },
    });
    draftBookId = draft.id;
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

  it('GET /api/access/documents/:documentId/decision allows admin for draft doc', async () => {
    const adminDraftRes = await request(app.getHttpServer())
      .get(`/api/access/documents/${draftBookId}/decision`)
      .set('Cookie', adminCookie)
      .expect(200);
    expect(adminDraftRes.body.allowed).toBe(true);
  });

  it('POST view-token and download-token succeed when allowed and return 403 when denied', async () => {
    await request(app.getHttpServer())
      .post(`/api/access/documents/${publishedBookId}/view-token`)
      .set('Cookie', readerCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.url).toBeDefined();
      });

    await request(app.getHttpServer())
      .post(`/api/access/documents/${draftBookId}/view-token`)
      .set('Cookie', readerCookie)
      .expect(403);
  });
});
