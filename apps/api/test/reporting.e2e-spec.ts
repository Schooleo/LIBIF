import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import {
  BookAuditAction,
  BookStatus,
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
  UserRole
} from '../src/generated/prisma/client';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { buildOpaqueReference, buildReaderLabel } from '../src/modules/reporting/reporting.service';

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

  it('returns reader access summaries with inclusive/exclusive ranges, deterministic ordering, and masked projections', async () => {
    const { reader, book } = await seedReaderAccessFixture(prisma);
    await prisma.readerAccessEvent.createMany({
      data: [
        {
          id: 'evt-early',
          eventType: ReaderAccessEventType.VIEWER_OPENED,
          riskLevel: ReaderAccessRiskLevel.NONE,
          userId: reader.id,
          bookId: book.id,
          traceFingerprint: null,
          createdAt: new Date('2026-07-22T00:00:00.000Z')
        },
        {
          id: 'evt-z-last',
          eventType: ReaderAccessEventType.RATE_LIMITED,
          riskLevel: ReaderAccessRiskLevel.LOW,
          reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
          userId: reader.id,
          bookId: book.id,
          pageNumber: 3,
          createdAt: new Date('2026-07-22T10:00:00.000Z')
        },
        {
          id: 'evt-a-first',
          eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
          riskLevel: ReaderAccessRiskLevel.HIGH,
          reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION,
          userId: reader.id,
          bookId: book.id,
          pageNumber: 99,
          createdAt: new Date('2026-07-22T10:00:00.000Z')
        },
        {
          id: 'evt-excluded-end',
          eventType: ReaderAccessEventType.PAGE_DENIED,
          riskLevel: ReaderAccessRiskLevel.LOW,
          reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
          userId: reader.id,
          bookId: book.id,
          pageNumber: 4,
          createdAt: new Date('2026-07-23T00:00:00.000Z')
        }
      ]
    });

    const beforeCount = await prisma.readerAccessEvent.count();
    const response = await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z', pageSize: 2 })
      .set(adminHeaders)
      .expect(200);
    const afterCount = await prisma.readerAccessEvent.count();

    expect(afterCount).toBe(beforeCount);
    expect(response.body).toMatchObject({
      totalCount: 3,
      page: 1,
      pageSize: 2,
      riskCounts: { none: 1, low: 1, medium: 0, high: 1 },
      items: [
        {
          eventReference: buildOpaqueReference('event', 'evt-z-last'),
          documentReference: buildOpaqueReference('document', book.id),
          readerLabel: buildReaderLabel(reader.id),
          eventType: 'RATE_LIMITED',
          riskLevel: 'LOW',
          reasonCode: 'RATE_LIMIT_EXCEEDED',
          pageNumber: 3,
          traceFingerprint: null,
          occurredAt: '2026-07-22T10:00:00.000Z'
        },
        {
          eventReference: buildOpaqueReference('event', 'evt-a-first'),
          documentReference: buildOpaqueReference('document', book.id),
          readerLabel: buildReaderLabel(reader.id),
          eventType: 'SCRAPE_SUSPECTED',
          riskLevel: 'HIGH',
          reasonCode: 'PAGE_ENUMERATION',
          pageNumber: 99,
          traceFingerprint: null,
          occurredAt: '2026-07-22T10:00:00.000Z'
        }
      ]
    });
    expect(response.body.items[0]).not.toHaveProperty('userId');
    expect(response.body.items[0]).not.toHaveProperty('sessionId');
    expect(response.body.items[0]).not.toHaveProperty('bookFileId');
    expect(response.body.items[0]).not.toHaveProperty('email');
    expect(response.body.items[0]).not.toHaveProperty('id');
    expect(response.body.items[0]).not.toHaveProperty('documentId');
    expect(response.body.items[0].readerLabel).not.toContain('reader@libif.local');
    expect(response.body.items[0].readerLabel).toMatch(/^reader-[0-9a-f]{12}$/);
  });

  it('filters by risk and validates bounded UTC ranges and page caps', async () => {
    const { reader, book } = await seedReaderAccessFixture(prisma);
    await prisma.readerAccessEvent.createMany({
      data: [
        {
          id: 'evt-low',
          eventType: ReaderAccessEventType.RATE_LIMITED,
          riskLevel: ReaderAccessRiskLevel.LOW,
          reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
          userId: reader.id,
          bookId: book.id,
          createdAt: new Date('2026-07-22T01:00:00.000Z')
        },
        {
          id: 'evt-high',
          eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
          riskLevel: ReaderAccessRiskLevel.HIGH,
          reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION,
          userId: reader.id,
          bookId: book.id,
          createdAt: new Date('2026-07-22T02:00:00.000Z')
        }
      ]
    });

    await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z', risk: 'HIGH' })
      .set(adminHeaders)
      .expect(200)
      .expect(({ body }) => {
        expect(body.totalCount).toBe(1);
        expect(body.riskCounts).toEqual({ none: 0, low: 0, medium: 0, high: 1 });
        expect(body.items.map((item: { eventReference: string }) => item.eventReference)).toEqual([
          buildOpaqueReference('event', 'evt-high')
        ]);
      });

    await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-23T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z' })
      .set(adminHeaders)
      .expect(400);

    await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ from: '2026-07-23T00:00:00+07:00', to: '2026-07-24T00:00:00.000Z' })
      .set(adminHeaders)
      .expect(400);

    await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access')
      .query({ pageSize: 201 })
      .set(adminHeaders)
      .expect(400);
  });

  it('exports CSV with fixed headers, deterministic ordering, and no raw internal identifiers', async () => {
    const admin = await prisma.user.create({ data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN } });
    const reader = await prisma.user.create({ data: { id: 'reader-csv', email: 'reader@libif.local', passwordHash: 'dev-only', role: UserRole.READER } });
    const category = await prisma.category.create({ data: { name: 'CSV Reports', slug: 'csv-reports' } });
    const book = await prisma.book.create({ data: { id: '@doc,1', title: 'CSV fixture', status: BookStatus.PUBLISHED, categoryId: category.id, createdById: admin.id } });
    await prisma.readerAccessEvent.create({
      data: {
        id: '=row-1',
        eventType: ReaderAccessEventType.PAGE_DENIED,
        riskLevel: ReaderAccessRiskLevel.LOW,
        reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
        userId: reader.id,
        bookId: book.id,
        createdAt: new Date('2026-07-22T03:00:00.000Z')
      }
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/reports/reader-access.csv')
      .query({ from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z' })
      .set(adminHeaders)
      .expect(200);

    expect(response.headers['content-type']).toContain('text/csv; charset=utf-8');
    expect(response.headers['content-disposition']).toBe('attachment; filename="reader-access-report.csv"');
    const [header, row] = response.text.trimEnd().split('\n');
    expect(header).toBe('eventReference,documentReference,readerLabel,eventType,riskLevel,reasonCode,pageNumber,traceFingerprint,occurredAt');
    expect(row).toContain(`"${buildOpaqueReference('event', '=row-1')}"`);
    expect(row).toContain(`"${buildOpaqueReference('document', '@doc,1')}"`);
    expect(row).not.toContain('=row-1');
    expect(row).not.toContain('@doc,1');
    expect(row).toContain(`"${buildReaderLabel(reader.id)}"`);
    expect(row).toContain('"PAGE_DENIED"');
    expect(row).toContain('"LOW"');
  });

  it('keeps reader-access report routes admin-only without changing dashboard authorization', async () => {
    await seedReaderAccessFixture(prisma);

    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(librarianHeaders).expect(200);
    await request(app.getHttpServer()).get('/api/admin/reports/reader-access').set(librarianHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/admin/reports/reader-access').set(readerHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/admin/reports/reader-access').expect(403);
    await request(app.getHttpServer()).get('/api/admin/reports/reader-access.csv').set(librarianHeaders).expect(403);
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

  it('returns a bounded management summary and safe formula-neutralized operations CSV exports', async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@libif.local',
        passwordHash: 'dev-only',
        role: UserRole.ADMIN,
        createdAt: new Date('2026-07-22T01:00:00.000Z')
      }
    });
    const reader = await prisma.user.create({
      data: {
        id: '=reader-export',
        email: 'reader@example.edu',
        passwordHash: 'must-never-export',
        role: UserRole.READER,
        createdAt: new Date('2026-07-22T02:00:00.000Z')
      }
    });
    const category = await prisma.category.create({
      data: { name: '@Restricted,Category', slug: 'restricted-category' }
    });
    const book = await prisma.book.create({
      data: {
        id: '@document-export',
        title: '=Formula,\nDocument',
        status: BookStatus.PUBLISHED,
        categoryId: category.id,
        createdById: admin.id,
        createdAt: new Date('2026-07-22T03:00:00.000Z')
      }
    });
    await prisma.bookAuditEvent.create({
      data: {
        id: '+activity-export',
        bookId: book.id,
        actorId: admin.id,
        action: BookAuditAction.PUBLISHED,
        message: '@formula,\nmessage',
        createdAt: new Date('2026-07-22T04:00:00.000Z')
      }
    });
    await prisma.readerAccessEvent.createMany({
      data: [
        {
          eventType: ReaderAccessEventType.RATE_LIMITED,
          riskLevel: ReaderAccessRiskLevel.LOW,
          reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
          userId: reader.id,
          bookId: book.id,
          createdAt: new Date('2026-07-22T05:00:00.000Z')
        },
        {
          eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
          riskLevel: ReaderAccessRiskLevel.HIGH,
          reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION,
          userId: reader.id,
          bookId: book.id,
          createdAt: new Date('2026-07-22T06:00:00.000Z')
        }
      ]
    });
    const query = { from: '2026-07-22T00:00:00.000Z', to: '2026-07-23T00:00:00.000Z' };

    await request(app.getHttpServer())
      .get('/api/admin/dashboard/management')
      .query(query)
      .set(adminHeaders)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          from: query.from,
          to: query.to,
          documentsCreated: 1,
          usersCreated: 2,
          activityEvents: 1,
          readerSecurity: {
            total: 2,
            rateLimited: 1,
            scrapeSuspected: 1,
            highRisk: 1
          }
        });
      });

    const documentCsv = await request(app.getHttpServer())
      .get('/api/admin/reports/documents.csv')
      .query(query)
      .set(adminHeaders)
      .expect(200);
    expect(documentCsv.headers['content-disposition']).toBe(
      'attachment; filename="documents-report.csv"'
    );
    expect(documentCsv.text).toContain(
      'documentId,title,status,category,createdByEmail,createdAt,updatedAt'
    );
    expect(documentCsv.text).toContain('"\'@document-export"');
    expect(documentCsv.text).toContain('"\'=Formula,\nDocument"');
    expect(documentCsv.text).toContain('"\'@Restricted,Category"');

    const usersCsv = await request(app.getHttpServer())
      .get('/api/admin/reports/users.csv')
      .query(query)
      .set(adminHeaders)
      .expect(200);
    expect(usersCsv.headers['content-disposition']).toBe('attachment; filename="users-report.csv"');
    expect(usersCsv.text).toContain('userId,email,role,status');
    expect(usersCsv.text).toContain('"\'=reader-export"');
    expect(usersCsv.text).not.toContain('must-never-export');

    const activityCsv = await request(app.getHttpServer())
      .get('/api/admin/reports/activity.csv')
      .query(query)
      .set(adminHeaders)
      .expect(200);
    expect(activityCsv.headers['content-disposition']).toBe(
      'attachment; filename="activity-report.csv"'
    );
    expect(activityCsv.text).toContain('"\'+activity-export"');
    expect(activityCsv.text).toContain('"\'@formula,\nmessage"');
  });

  it('keeps management and operations CSV routes admin-only and validates their UTC range', async () => {
    const routes = [
      '/api/admin/dashboard/management',
      '/api/admin/reports/documents.csv',
      '/api/admin/reports/users.csv',
      '/api/admin/reports/activity.csv'
    ];
    for (const route of routes) {
      await request(app.getHttpServer()).get(route).set(librarianHeaders).expect(403);
      await request(app.getHttpServer()).get(route).set(readerHeaders).expect(403);
    }

    await request(app.getHttpServer())
      .get('/api/admin/reports/documents.csv')
      .query({
        from: '2026-07-23T00:00:00+07:00',
        to: '2026-07-24T00:00:00.000Z'
      })
      .set(adminHeaders)
      .expect(400);
  });

  it('forbids reader and anonymous dashboard access', async () => {
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').set(readerHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/admin/dashboard/librarian').expect(403);
  });
});

async function seedReaderAccessFixture(prisma: PrismaService) {
  const admin = await prisma.user.create({ data: { email: 'admin@libif.local', passwordHash: 'dev-only', role: UserRole.ADMIN } });
  const reader = await prisma.user.create({ data: { email: 'reader@libif.local', passwordHash: 'dev-only', role: UserRole.READER } });
  const category = await prisma.category.create({ data: { name: 'Reader Reports', slug: `reader-reports-${Date.now()}` } });
  const book = await prisma.book.create({ data: { title: 'Reader Reporting Fixture', status: BookStatus.PUBLISHED, categoryId: category.id, createdById: admin.id } });
  const bookFile = await prisma.bookFile.create({
    data: {
      bookId: book.id,
      bucket: 'test',
      objectKey: `reader-reporting/${book.id}.pdf`,
      originalFilename: 'reader-reporting.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1,
      checksumSha256: `checksum-${book.id}`
    }
  });

  return { admin, reader, category, book, bookFile };
}
