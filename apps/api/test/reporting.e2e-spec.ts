import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { BookAuditAction, BookStatus, UserRole } from '../src/generated/prisma/client';
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

  it('returns real dashboard counts and recent activity for admins and librarians', async () => {
    const admin = await prisma.user.create({ data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN } });
    const librarian = await prisma.user.create({ data: { email: 'librarian@libif.local', passwordHash: 'dev-only', role: UserRole.LIBRARIAN } });
    await prisma.user.create({ data: { email: 'reader@libif.local', passwordHash: 'dev-only', role: UserRole.READER } });
    const category = await prisma.category.create({ data: { name: 'Giáo trình', slug: 'giao-trinh' } });
    await prisma.tag.create({ data: { name: 'Digital', slug: 'digital' } });
    const published = await prisma.book.create({ data: { title: 'Published Book', status: BookStatus.PUBLISHED, categoryId: category.id, createdById: admin.id } });
    const correction = await prisma.book.create({ data: { title: 'Correct Metadata', status: BookStatus.CORRECTION_REQUIRED, createdById: admin.id } });
    const processing = await prisma.book.create({ data: { title: 'Pending Pipeline', status: BookStatus.PENDING_PROCESSING, createdById: admin.id } });
    const publishedFile = await prisma.bookFile.create({
      data: {
        bookId: published.id,
        bucket: 'test',
        objectKey: `reporting/${published.id}.pdf`,
        originalFilename: 'published.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1,
        checksumSha256: 'reporting-checksum'
      }
    });
    await prisma.processingJob.create({ data: { bookId: published.id, bookFileId: publishedFile.id } });

    await prisma.bookAuditEvent.createMany({
      data: [
        {
          id: 'audit-processing-started',
          bookId: processing.id,
          action: BookAuditAction.PROCESSING_STARTED,
          message: 'PDF processing pipeline started',
          createdAt: new Date('2026-07-21T10:00:00.000Z')
        },
        {
          id: 'audit-published',
          bookId: published.id,
          actorId: librarian.id,
          action: BookAuditAction.PUBLISHED,
          message: 'Document approved and published',
          createdAt: new Date('2026-07-21T11:00:00.000Z')
        },
        {
          id: 'audit-correction-requested',
          bookId: correction.id,
          actorId: admin.id,
          action: BookAuditAction.CORRECTION_REQUESTED,
          message: 'Correction requested: add publisher',
          createdAt: new Date('2026-07-21T12:00:00.000Z')
        }
      ]
    });

    const adminResponse = await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(adminHeaders).expect(200);
    expect(adminResponse.body).toMatchObject({
      books: { total: 3, published: 1, pendingProcessing: 1, correctionRequired: 1, rejected: 0 },
      processingJobs: { queued: 1, running: 0, succeeded: 0, failed: 0 },
      taxonomy: { categories: 1, tags: 1 },
      users: { admins: 1, librarians: 1, readers: 1, total: 3 },
      activity: {
        counts: { processing: 1, approval: 1, correction: 1, total: 3 },
        recent: [
          {
            id: 'audit-correction-requested',
            documentId: correction.id,
            documentTitle: 'Correct Metadata',
            action: 'CORRECTION_REQUESTED',
            message: 'Correction requested: add publisher',
            actorEmail: 'admin@libif.local',
            createdAt: '2026-07-21T12:00:00.000Z'
          },
          {
            id: 'audit-published',
            documentId: published.id,
            documentTitle: 'Published Book',
            action: 'PUBLISHED',
            actorEmail: 'librarian@libif.local',
            createdAt: '2026-07-21T11:00:00.000Z'
          },
          {
            id: 'audit-processing-started',
            documentId: processing.id,
            documentTitle: 'Pending Pipeline',
            action: 'PROCESSING_STARTED',
            message: 'PDF processing pipeline started',
            actorEmail: null,
            createdAt: '2026-07-21T10:00:00.000Z'
          }
        ]
      }
    });
    expect(adminResponse.body.generatedAt).toEqual(expect.any(String));
    expect(adminResponse.body.recentBooks).toHaveLength(3);

    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(librarianHeaders).expect(200);
  });

  it('returns zeroed activity counts and no rows for empty datasets', async () => {
    const admin = await prisma.user.create({ data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN } });

    const response = await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(adminHeaders).expect(200);
    expect(admin).toBeDefined();
    expect(response.body).toMatchObject({
      books: { total: 0 },
      processingJobs: { queued: 0, running: 0, succeeded: 0, failed: 0, cancelled: 0, superseded: 0 },
      taxonomy: { categories: 0, tags: 0 },
      users: { admins: 1, librarians: 0, readers: 0, total: 1 },
      recentBooks: [],
      activity: { counts: { processing: 0, approval: 0, correction: 0, total: 0 }, recent: [] }
    });
  });

  it('forbids reader and anonymous dashboard access', async () => {
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(readerHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').expect(403);
  });
});
