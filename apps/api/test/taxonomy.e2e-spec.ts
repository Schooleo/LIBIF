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

describe('Taxonomy read APIs (e2e)', () => {
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
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.tag.deleteMany({ where: { id: { in: createdTagIds.splice(0) } } });
    await prisma.category.deleteMany({ where: { id: { in: createdCategoryIds.splice(0) } } });
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
});
