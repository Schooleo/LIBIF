import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let publishedBookId: string;
  let draftBookId: string;
  let categoryId: string;
  let draftOnlyCategoryId: string;
  let creatorId: string;
  let publishedTagId: string;
  let draftOnlyTagId: string;
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;

  beforeAll(async () => {
    process.env.LIBIF_ENABLE_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ProcessingQueue)
      .useClass(FakeProcessingQueue)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);

    const creator = await prisma.user.create({
      data: {
        email: `catalog-closure-${Date.now()}@example.com`,
        passwordHash: 'catalog-closure-test-only',
        role: 'ADMIN',
      },
    });
    creatorId = creator.id;
    const category = await prisma.category.create({
      data: {
        name: `Catalog closure ${Date.now()}`,
        slug: `catalog-closure-${Date.now()}`,
      },
    });
    categoryId = category.id;
    const draftOnlyCategory = await prisma.category.create({
      data: {
        name: `Draft-only category ${Date.now()}`,
        slug: `draft-only-category-${Date.now()}`,
      },
    });
    draftOnlyCategoryId = draftOnlyCategory.id;
    const [publishedTag, draftOnlyTag] = await Promise.all([
      prisma.tag.create({
        data: {
          name: `Published tag ${Date.now()}`,
          slug: `published-tag-${Date.now()}`,
        },
      }),
      prisma.tag.create({
        data: {
          name: `Draft-only tag ${Date.now()}`,
          slug: `draft-only-tag-${Date.now()}`,
        },
      }),
    ]);
    publishedTagId = publishedTag.id;
    draftOnlyTagId = draftOnlyTag.id;
    const published = await prisma.book.create({
      data: {
        title: 'Published closure detail',
        subtitle: 'Reader-safe subtitle',
        description: 'Reader-safe description',
        publisher: 'LIBIF',
        publishedYear: 2026,
        language: 'vi',
        status: 'PUBLISHED',
        categoryId,
        createdById: creatorId,
        tags: { create: { tagId: publishedTagId } },
        files: {
          create: {
            originalFilename: 'private-source.pdf',
            bucket: 'private-documents',
            objectKey: `catalog-closure/${Date.now()}.pdf`,
            mimeType: 'application/pdf',
            sizeBytes: 1234,
            checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            status: 'ACTIVE',
          },
        },
      },
    });
    publishedBookId = published.id;
    draftBookId = (
      await prisma.book.create({
        data: {
          title: 'Draft closure detail',
          status: 'DRAFT',
          categoryId: draftOnlyCategoryId,
          createdById: creatorId,
          tags: { create: { tagId: draftOnlyTagId } },
        },
      })
    ).id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany({ where: { id: { in: [publishedBookId, draftBookId] } } });
    await prisma.tag.deleteMany({ where: { id: { in: [publishedTagId, draftOnlyTagId] } } });
    await prisma.category.deleteMany({ where: { id: { in: [categoryId, draftOnlyCategoryId] } } });
    await prisma.user.deleteMany({ where: { id: creatorId } });
    await app.close();
    await prisma.$disconnect();
    if (originalDevAuth === undefined) {
      delete process.env.LIBIF_ENABLE_DEV_AUTH;
    } else {
      process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
    }
  });

  it('GET /api/categories exposes published taxonomy without leaking draft-only categories', async () => {
    const res = await request(app.getHttpServer()).get('/api/categories').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: categoryId }),
    ]));
    expect(res.body).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ id: draftOnlyCategoryId }),
    ]));
  });

  it('GET /api/tags exposes published taxonomy without leaking draft-only tags', async () => {
    const res = await request(app.getHttpServer()).get('/api/tags').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: publishedTagId }),
    ]));
    expect(res.body).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ id: draftOnlyTagId }),
    ]));
  });

  it('GET /api/catalog/books returns 200 with paged books array', async () => {
    const res = await request(app.getHttpServer()).get('/api/catalog/books').expect(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('totalCount');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('pageSize');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('GET /api/catalog/books/:documentId returns 404 for non-existent document ID', async () => {
    await request(app.getHttpServer())
      .get('/api/catalog/books/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('GET /api/catalog/books/:documentId returns published reader-safe detail without source metadata', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/catalog/books/${publishedBookId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: publishedBookId,
      title: 'Published closure detail',
      subtitle: 'Reader-safe subtitle',
      description: 'Reader-safe description',
      publisher: 'LIBIF',
      publishedYear: 2026,
      language: 'vi',
      status: 'PUBLISHED',
    });
    for (const forbiddenKey of ['files', 'file', 'bucket', 'objectKey', 'checksumSha256', 'originalFilename']) {
      expect(JSON.stringify(response.body)).not.toContain(forbiddenKey);
    }
  });

  it('GET /api/catalog/books/:documentId hides unpublished records behind 404', async () => {
    await request(app.getHttpServer())
      .get(`/api/catalog/books/${draftBookId}`)
      .expect(404);
  });
});
