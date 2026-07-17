import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { StorageService, StoredPdf } from '../src/modules/storage/storage.service';
import request from 'supertest';

class FakeStorageService {
  objects = new Map<string, Buffer>();
  async putPrivatePdf(file: Express.Multer.File): Promise<StoredPdf> {
    const objectKey = `raw-books/test/${file.originalname}`;
    this.objects.set(objectKey, file.buffer);
    return { bucket: 'test-bucket', objectKey, checksumSha256: 'test-checksum', sizeBytes: BigInt(file.size) };
  }
  async deleteObject(_bucket: string, objectKey: string): Promise<void> {
    this.objects.delete(objectKey);
  }
}

class FakeProcessingQueue {
  events: unknown[] = [];
  async enqueueBookUploaded(event: unknown): Promise<void> {
    this.events.push(event);
  }
}

describe('Digital book intake (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let queue: FakeProcessingQueue;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(StorageService)
      .useClass(FakeStorageService)
      .overrideProvider(ProcessingQueue)
      .useClass(FakeProcessingQueue)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
    queue = app.get(ProcessingQueue) as unknown as FakeProcessingQueue;
  });

  beforeEach(async () => {
    await prisma.processingJob.deleteMany();
    await prisma.bookFile.deleteMany();
    await prisma.bookTag.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.book.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    queue.events = [];
  });

  afterAll(async () => {
    await app.close();
  });

  it('persists book, private file pointer, tags, authors, and queued processing job', async () => {
    const category = await prisma.category.create({ data: { name: 'Giáo trình', slug: 'giao-trinh' } });
    const metadata = {
      isbn: '9780132350884',
      title: 'Clean Code',
      authors: ['Robert C. Martin', 'Robert C. Martin'],
      publisher: 'Prentice Hall',
      publishedYear: 2008,
      categoryId: category.id,
      tags: ['Software', ' software ']
    };

    const response = await request(app.getHttpServer())
      .post('/api/admin/books/intake')
      .field('metadata', JSON.stringify(metadata))
      .attach('file', 'test/fixtures/sample.pdf')
      .expect(201);

    expect(response.body.book).toMatchObject({ title: 'Clean Code', status: 'PENDING_PROCESSING' });
    expect(response.body.file.originalFilename).toBe('sample.pdf');
    expect(response.body.processingJob.status).toBe('QUEUED');

    const book = await prisma.book.findUnique({
      where: { id: response.body.book.id },
      include: { files: true, jobs: true, tags: { include: { tag: true } }, authors: { include: { author: true } } }
    });
    expect(book).toBeTruthy();
    expect(book?.files).toHaveLength(1);
    expect(book?.files[0].objectKey).toBe('raw-books/test/sample.pdf');
    expect(book?.files[0].objectKey).not.toMatch(/^https?:\/\//);
    expect(book?.jobs[0].status).toBe('QUEUED');
    expect(book?.tags.map(({ tag }) => tag.slug)).toEqual(['software']);
    expect(book?.authors.map(({ author }) => author.name)).toEqual(['Robert C. Martin']);
    expect(queue.events).toHaveLength(1);
  });

  it('rejects a non-PDF upload without committed book rows', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/books/intake')
      .field('metadata', JSON.stringify({ title: 'Bad', authors: ['A'], tags: [] }))
      .attach('file', Buffer.from('not pdf'), { filename: 'bad.txt', contentType: 'text/plain' })
      .expect(400);

    await expect(prisma.book.count()).resolves.toBe(0);
  });

  it('does not expose pending books in public catalog', async () => {
    await prisma.user.create({ data: { email: 'librarian@libif.local', passwordHash: 'dev-only', role: 'LIBRARIAN' } });
    await prisma.book.create({ data: { title: 'Pending Book', createdBy: { connect: { email: 'librarian@libif.local' } } } });
    await request(app.getHttpServer()).get('/api/catalog/books').expect(200, []);
  });
});
