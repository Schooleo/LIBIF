import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Taxonomy APIs (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const createdCategoryIds: string[] = [];
  const createdTagIds: string[] = [];
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

  afterEach(async () => {
    await prisma.tag.deleteMany({ where: { id: { in: createdTagIds.splice(0) } } });
    const categoryIds = createdCategoryIds.splice(0);
    await prisma.category.updateMany({ where: { id: { in: categoryIds } }, data: { parentId: null } });
    await prisma.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
  });

  it('lists stable category and tag options for admins and librarians', async () => {
    const category = await prisma.category.create({ data: { name: 'Phase 5 Archive', slug: 'phase-5-archive' } });
    const tag = await prisma.tag.create({ data: { name: 'Phase 5 Digital', slug: 'phase-5-digital' } });
    createdCategoryIds.push(category.id);
    createdTagIds.push(tag.id);

    const categoryResponse = await request(app.getHttpServer()).get('/api/taxonomy/categories').set(librarianHeaders).expect(200);
    expect(categoryResponse.body).toEqual(expect.arrayContaining([{ id: category.id, name: category.name, slug: category.slug, parentId: null }]));

    const tagResponse = await request(app.getHttpServer()).get('/api/taxonomy/tags').set(adminHeaders).expect(200);
    expect(tagResponse.body).toEqual(expect.arrayContaining([{ id: tag.id, name: tag.name, slug: tag.slug }]));
  });

  it('forbids readers and anonymous callers', async () => {
    await request(app.getHttpServer()).get('/api/taxonomy/categories').set(readerHeaders).expect(403);
    await request(app.getHttpServer()).get('/api/taxonomy/tags').expect(403);
  });

  it('allows admins to create and edit normalized categories with stable response fields', async () => {
    const parentResponse = await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: '  Phase 5   Root  ' }).expect(201);
    createdCategoryIds.push(parentResponse.body.id);
    expect(parentResponse.body).toEqual({ id: expect.any(String), name: 'Phase 5 Root', slug: 'phase-5-root', parentId: null });

    const childResponse = await request(app.getHttpServer())
      .post('/api/admin/categories')
      .set(adminHeaders)
      .send({ name: ' Hồ   Sơ Số ', parentId: parentResponse.body.id })
      .expect(201);
    createdCategoryIds.push(childResponse.body.id);
    expect(childResponse.body).toEqual({ id: expect.any(String), name: 'Hồ Sơ Số', slug: 'ho-so-so', parentId: parentResponse.body.id });

    const editResponse = await request(app.getHttpServer())
      .patch(`/api/admin/categories/${childResponse.body.id}`)
      .set(adminHeaders)
      .send({ name: ' Digital   Archive ', parentId: null })
      .expect(200);
    expect(editResponse.body).toEqual({ id: childResponse.body.id, name: 'Digital Archive', slug: 'digital-archive', parentId: null });
    expect(Object.keys(editResponse.body).sort()).toEqual(['id', 'name', 'parentId', 'slug']);
  });

  it('allows admins to create and edit normalized tags with stable response fields', async () => {
    const createResponse = await request(app.getHttpServer()).post('/api/admin/tags').set(adminHeaders).send({ name: '  Tài   Liệu Số ' }).expect(201);
    createdTagIds.push(createResponse.body.id);
    expect(createResponse.body).toEqual({ id: expect.any(String), name: 'Tài Liệu Số', slug: 'tai-lieu-so' });

    const editResponse = await request(app.getHttpServer())
      .patch(`/api/admin/tags/${createResponse.body.id}`)
      .set(adminHeaders)
      .send({ name: ' Digital   Preservation ' })
      .expect(200);
    expect(editResponse.body).toEqual({ id: createResponse.body.id, name: 'Digital Preservation', slug: 'digital-preservation' });
    expect(Object.keys(editResponse.body).sort()).toEqual(['id', 'name', 'slug']);
  });

  it('rejects unknown category parents and category cycles', async () => {
    await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: 'Orphan', parentId: 'missing-category' }).expect(400);

    const rootResponse = await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: 'Cycle Root' }).expect(201);
    createdCategoryIds.push(rootResponse.body.id);
    const childResponse = await request(app.getHttpServer())
      .post('/api/admin/categories')
      .set(adminHeaders)
      .send({ name: 'Cycle Child', parentId: rootResponse.body.id })
      .expect(201);
    createdCategoryIds.push(childResponse.body.id);

    const cycleResponse = await request(app.getHttpServer())
      .patch(`/api/admin/categories/${rootResponse.body.id}`)
      .set(adminHeaders)
      .send({ parentId: childResponse.body.id })
      .expect(400);
    expect(cycleResponse.body).toEqual(expect.objectContaining({ code: 'VALIDATION_FAILED', message: 'Category parent would create a cycle.', status: 400 }));
  });

  it('returns safe conflicts for duplicate category and tag slugs', async () => {
    const categoryResponse = await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: 'Duplicate Archive' }).expect(201);
    createdCategoryIds.push(categoryResponse.body.id);
    const duplicateCategory = await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: ' Duplicate   Archive ' }).expect(409);
    expect(duplicateCategory.body).toEqual(expect.objectContaining({ code: 'RESOURCE_CONFLICT', message: 'Category slug already exists.', status: 409 }));
    const secondCategory = await request(app.getHttpServer()).post('/api/admin/categories').set(adminHeaders).send({ name: 'Second Archive' }).expect(201);
    createdCategoryIds.push(secondCategory.body.id);
    await request(app.getHttpServer()).patch(`/api/admin/categories/${secondCategory.body.id}`).set(adminHeaders).send({ name: 'Duplicate Archive' }).expect(409);

    const tagResponse = await request(app.getHttpServer()).post('/api/admin/tags').set(adminHeaders).send({ name: 'Duplicate Tag' }).expect(201);
    createdTagIds.push(tagResponse.body.id);
    const duplicateTag = await request(app.getHttpServer()).post('/api/admin/tags').set(adminHeaders).send({ name: ' Duplicate   Tag ' }).expect(409);
    expect(duplicateTag.body).toEqual(expect.objectContaining({ code: 'RESOURCE_CONFLICT', message: 'Tag slug already exists.', status: 409 }));
    const secondTag = await request(app.getHttpServer()).post('/api/admin/tags').set(adminHeaders).send({ name: 'Second Tag' }).expect(201);
    createdTagIds.push(secondTag.body.id);
    await request(app.getHttpServer()).patch(`/api/admin/tags/${secondTag.body.id}`).set(adminHeaders).send({ name: 'Duplicate Tag' }).expect(409);
  });

  it('forbids librarian, reader, and anonymous taxonomy mutations', async () => {
    const category = await prisma.category.create({ data: { name: 'Permission Category', slug: 'permission-category' } });
    const tag = await prisma.tag.create({ data: { name: 'Permission Tag', slug: 'permission-tag' } });
    createdCategoryIds.push(category.id);
    createdTagIds.push(tag.id);

    for (const headers of [librarianHeaders, readerHeaders]) {
      await request(app.getHttpServer()).post('/api/admin/categories').set(headers).send({ name: 'Blocked Category' }).expect(403);
      await request(app.getHttpServer()).patch(`/api/admin/categories/${category.id}`).set(headers).send({ name: 'Blocked Category' }).expect(403);
      await request(app.getHttpServer()).post('/api/admin/tags').set(headers).send({ name: 'Blocked Tag' }).expect(403);
      await request(app.getHttpServer()).patch(`/api/admin/tags/${tag.id}`).set(headers).send({ name: 'Blocked Tag' }).expect(403);
    }

    await request(app.getHttpServer()).post('/api/admin/categories').send({ name: 'Blocked Category' }).expect(403);
    await request(app.getHttpServer()).patch(`/api/admin/categories/${category.id}`).send({ name: 'Blocked Category' }).expect(403);
    await request(app.getHttpServer()).post('/api/admin/tags').send({ name: 'Blocked Tag' }).expect(403);
    await request(app.getHttpServer()).patch(`/api/admin/tags/${tag.id}`).send({ name: 'Blocked Tag' }).expect(403);
  });
});
