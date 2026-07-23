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
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    if (originalDevAuth === undefined) {
      delete process.env.LIBIF_ENABLE_DEV_AUTH;
    } else {
      process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
    }
  });

  it('GET /api/categories returns public category options', async () => {
    const res = await request(app.getHttpServer()).get('/api/categories').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
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
});
