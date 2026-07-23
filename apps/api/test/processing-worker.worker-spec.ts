import { TestingModule, Test } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  BookFileStatus,
  ProcessingJobStatus,
  TextExtractionMethod,
  UserRole
} from '../src/generated/prisma/client';
import { PrismaService } from '../src/modules/database/prisma.service';
import { BookUploadedEvent } from '../src/modules/processing/events/book-uploaded.event';
import { PDF_PROCESSING_QUEUE, ProcessingQueue } from '../src/modules/processing/processing.queue';
import { StorageService } from '../src/modules/storage/storage.service';
import { WorkerModule } from '../src/worker.module';

type WorkerFixture = {
  bookId: string;
  fileId: string;
  jobId: string;
  bucket: string;
  objectKey: string;
  event: BookUploadedEvent;
};

describe('Processing worker infrastructure integration', () => {
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const bucket = process.env.S3_BUCKET ?? 'libif-pdfs';
  const suiteId = `worker-${process.pid}-${Date.now()}`;
  const ownerEmail = `${suiteId}@example.test`;
  const createdBookIds: string[] = [];
  const createdObjectKeys: string[] = [];
  const suiteStartedAt = new Date();
  let moduleRef: TestingModule;
  let prisma: PrismaService;
  let storage: StorageService;
  let processingQueue: ProcessingQueue;
  let queueInspector: Queue<BookUploadedEvent>;
  let ownerId: string;

  beforeAll(async () => {
    process.env.OCR_LANGUAGES = 'vie+eng';
    process.env.OCR_COMMAND_TIMEOUT_MS = '60000';
    process.env.OCR_MAX_PAGES = '5';

    queueInspector = new Queue<BookUploadedEvent>(PDF_PROCESSING_QUEUE, {
      connection: { url: redisUrl }
    });
    await queueInspector.obliterate({ force: true });

    moduleRef = await Test.createTestingModule({ imports: [WorkerModule] }).compile();
    await moduleRef.init();
    prisma = moduleRef.get(PrismaService);
    storage = moduleRef.get(StorageService);
    processingQueue = moduleRef.get(ProcessingQueue);

    await storage.ensureBucket(bucket);
    const owner = await prisma.user.create({
      data: {
        email: ownerEmail,
        passwordHash: 'worker-test-only',
        role: UserRole.READER
      }
    });
    ownerId = owner.id;
  }, 90_000);

  afterAll(async () => {
    if (prisma) {
      await prisma.notification.deleteMany({ where: { createdAt: { gte: suiteStartedAt } } });
      if (createdBookIds.length > 0) {
        await prisma.book.deleteMany({ where: { id: { in: createdBookIds } } });
      }
      await prisma.user.deleteMany({ where: { email: ownerEmail } });
    }

    if (storage) {
      for (const objectKey of createdObjectKeys) {
        await storage.deleteObject(bucket, objectKey);
      }
    }

    await moduleRef?.close();
    await queueInspector?.obliterate({ force: true });
    await queueInspector?.close();
  });

  it('processes embedded text once when Redis delivers the same persisted job twice', async () => {
    const fixture = await createFixture('embedded-text.pdf', 'Embedded worker fixture');

    await Promise.all([
      processingQueue.enqueueBookUploaded(fixture.event),
      processingQueue.enqueueBookUploaded(fixture.event)
    ]);
    const completed = await waitForJob(fixture.jobId, ProcessingJobStatus.SUCCEEDED);
    await waitForQueueIdle();

    const [artifact, approvalCount, startedCount] = await Promise.all([
      prisma.processingArtifact.findFirst({ where: { processingJobId: fixture.jobId } }),
      prisma.approvalReview.count({ where: { processingJobId: fixture.jobId } }),
      prisma.bookAuditEvent.count({
        where: { bookId: fixture.bookId, action: 'PROCESSING_STARTED' }
      })
    ]);

    expect(completed.attempts).toBe(1);
    expect(artifact).toMatchObject({
      bookFileId: fixture.fileId,
      extractionMethod: TextExtractionMethod.EMBEDDED_TEXT,
      pageCount: 1
    });
    expect(approvalCount).toBe(1);
    expect(startedCount).toBe(1);

    const persistedText = await storage.getObjectBuffer(bucket, artifact!.objectKey);
    expect(persistedText.toString('utf8')).toContain('LIBIF Worker Integration Fixture');
  });

  it('runs deterministic OCR for a scanned Vietnamese PDF and persists real output', async () => {
    const fixture = await createFixture('scanned-vietnamese.pdf', 'Scanned Vietnamese fixture');

    await processingQueue.enqueueBookUploaded(fixture.event);
    await waitForJob(fixture.jobId, ProcessingJobStatus.SUCCEEDED);

    const artifact = await prisma.processingArtifact.findFirstOrThrow({
      where: { processingJobId: fixture.jobId }
    });
    const persistedText = (await storage.getObjectBuffer(bucket, artifact.objectKey)).toString('utf8');

    expect(artifact).toMatchObject({
      bookFileId: fixture.fileId,
      extractionMethod: TextExtractionMethod.OCR,
      pageCount: 1,
      language: 'vi'
    });
    expect(persistedText).toContain('LIBIF SCANNED DOCUMENT');
    expect(persistedText).not.toContain('[OCR Processed]');
  });

  it('fails a corrupt PDF safely without artifacts or approval rows', async () => {
    const fixture = await createFixture('corrupt.pdf', 'Corrupt PDF fixture');

    await processingQueue.enqueueBookUploaded(fixture.event);
    const failed = await waitForJob(fixture.jobId, ProcessingJobStatus.FAILED);

    await expect(
      prisma.processingArtifact.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
    await expect(
      prisma.approvalReview.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
    expect(failed.errorMessage).toBe('PDF is invalid or unreadable.');
    expect(failed.errorMessage).not.toContain(fixture.objectKey);
  });

  it('ignores a cancelled job payload without recreating work', async () => {
    const fixture = await createFixture(
      'embedded-text.pdf',
      'Cancelled worker fixture',
      ProcessingJobStatus.CANCELLED
    );

    await processingQueue.enqueueBookUploaded(fixture.event);
    await waitForQueueIdle();

    const job = await prisma.processingJob.findUniqueOrThrow({ where: { id: fixture.jobId } });
    expect(job.status).toBe(ProcessingJobStatus.CANCELLED);
    expect(job.attempts).toBe(0);
    await expect(
      prisma.processingArtifact.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
    await expect(
      prisma.approvalReview.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
  });

  it('supersedes a queued payload for a replaced file without reading it', async () => {
    const fixture = await createFixture(
      'embedded-text.pdf',
      'Superseded worker fixture',
      ProcessingJobStatus.QUEUED,
      BookFileStatus.REPLACED
    );

    await processingQueue.enqueueBookUploaded(fixture.event);
    const superseded = await waitForJob(fixture.jobId, ProcessingJobStatus.SUPERSEDED);

    expect(superseded.attempts).toBe(0);
    expect(superseded.terminalReason).toBe('Source file was replaced before processing started.');
    await expect(
      prisma.processingArtifact.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
    await expect(
      prisma.approvalReview.count({ where: { processingJobId: fixture.jobId } })
    ).resolves.toBe(0);
  });

  async function createFixture(
    filename: string,
    title: string,
    status: ProcessingJobStatus = ProcessingJobStatus.QUEUED,
    fileStatus: BookFileStatus = BookFileStatus.ACTIVE
  ): Promise<WorkerFixture> {
    const contents = await readFile(resolve(__dirname, `fixtures/worker/${filename}`));
    const objectKey = `worker-tests/${suiteId}/${createdBookIds.length}-${filename}`;
    await storage.putObject(bucket, objectKey, contents, 'application/pdf');
    createdObjectKeys.push(objectKey);

    const book = await prisma.book.create({
      data: {
        title,
        status: 'PENDING_PROCESSING',
        createdById: ownerId,
        files: {
          create: {
            bucket,
            objectKey,
            originalFilename: filename,
            mimeType: 'application/pdf',
            sizeBytes: BigInt(contents.byteLength),
            checksumSha256: createHash('sha256').update(contents).digest('hex'),
            status: fileStatus
          }
        }
      },
      include: { files: true }
    });
    createdBookIds.push(book.id);
    const file = book.files[0];
    const job = await prisma.processingJob.create({
      data: {
        bookId: book.id,
        bookFileId: file.id,
        status,
        stage: status === ProcessingJobStatus.CANCELLED ? 'cancelled' : 'queued',
        cancelledAt: status === ProcessingJobStatus.CANCELLED ? new Date() : undefined,
        completedAt: status === ProcessingJobStatus.CANCELLED ? new Date() : undefined,
        terminalReason: status === ProcessingJobStatus.CANCELLED ? 'Cancelled before delivery' : undefined
      }
    });
    createdObjectKeys.push(`artifacts/${book.id}/${file.id}/${job.id}/extracted.txt`);

    return {
      bookId: book.id,
      fileId: file.id,
      jobId: job.id,
      bucket,
      objectKey,
      event: {
        bookId: book.id,
        fileId: file.id,
        objectKey,
        processingJobId: job.id
      }
    };
  }

  async function waitForJob(jobId: string, expectedStatus: ProcessingJobStatus) {
    return waitUntil(async () => {
      const job = await prisma.processingJob.findUnique({ where: { id: jobId } });
      return job?.status === expectedStatus ? job : undefined;
    }, `job ${jobId} to reach ${expectedStatus}`);
  }

  async function waitForQueueIdle(): Promise<void> {
    await waitUntil(async () => {
      const counts = await queueInspector.getJobCounts('active', 'waiting', 'delayed', 'prioritized');
      return counts.active + counts.waiting + counts.delayed + counts.prioritized === 0 ? true : undefined;
    }, 'processing queue to become idle');
  }
});

async function waitUntil<T>(
  read: () => Promise<T | undefined>,
  description: string,
  timeoutMs = 90_000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await read();
    if (result !== undefined) return result;
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`Timed out waiting for ${description}`);
}
