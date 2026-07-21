import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { BookStatus, UserRole } from '../src/generated/prisma/client';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Admin dashboard reporting (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminHeaders = { 'x-libif-dev-role': 'ADMIN', 'x-libif-dev-user-email': 'admin@libif.local' };
  const librarianHeaders = { 'x-libif-dev-role': 'LIBRARIAN', 'x-libif-dev-user-email': 'librarian@libif.local' };
  const readerHeaders = { 'x-libif-dev-role': 'READER', 'x-libif-dev-user-email': 'reader@libif.local' };
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;

  beforeAll(async () => {
    process.env.LIBIF_ENABLE_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(ProcessingQueue).useClass(FakeProcessingQueue).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
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
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
  });

  it('returns real dashboard counts for admins and librarians', async () => {
    const admin = await prisma.user.create({ data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN } });
    await prisma.user.create({ data: { email: 'librarian@libif.local', passwordHash: 'dev-only', role: UserRole.LIBRARIAN } });
    await prisma.user.create({ data: { email: 'reader@libif.local', passwordHash: 'dev-only', role: UserRole.READER } });
    const category = await prisma.category.create({ data: { name: 'Giáo trình', slug: 'giao-trinh' } });
    await prisma.tag.create({ data: { name: 'Digital', slug: 'digital' } });
    const published = await prisma.book.create({ data: { title: 'Published Book', status: BookStatus.PUBLISHED, categoryId: category.id, createdById: admin.id } });
    await prisma.book.create({ data: { title: 'Pending Book', status: BookStatus.PENDING_PROCESSING, createdById: admin.id } });
    await prisma.processingJob.create({ data: { bookId: published.id } });

    const adminResponse = await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(adminHeaders).expect(200);
    expect(adminResponse.body).toMatchObject({
      books: { total: 2, published: 1, pendingProcessing: 1, rejected: 0 },
      processingJobs: { queued: 1, running: 0, succeeded: 0, failed: 0 },
      taxonomy: { categories: 1, tags: 1 },
      users: { admins: 1, librarians: 1, readers: 1, total: 3 }
    });
    expect(adminResponse.body.generatedAt).toEqual(expect.any(String));
    expect(adminResponse.body.recentBooks).toHaveLength(2);

    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(librarianHeaders).expect(200);
  });

  it('forbids reader and anonymous dashboard access', async () => {
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(readerHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').expect(403);
  });
});
