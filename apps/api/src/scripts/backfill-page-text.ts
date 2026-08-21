import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHash, randomUUID } from 'node:crypto';
import {
  BookStatus,
  BookFileStatus,
  PrismaClient,
  ProcessingArtifactKind,
  ProcessingJobStatus,
  TextExtractionMethod
} from '../generated/prisma/client';
import { PdftotextOcrEngineAdapter } from '../modules/processing/ocr/pdftotext-ocr-engine.adapter';
import { StorageService } from '../modules/storage/storage.service';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const config = new ConfigService(process.env);
  const storage = new StorageService(config);
  const ocrEngine = new PdftotextOcrEngineAdapter(storage, config);
  await ocrEngine.onModuleInit();

  const files = await prisma.bookFile.findMany({
    where: {
      status: BookFileStatus.ACTIVE,
      artifacts: { none: { kind: ProcessingArtifactKind.OCR_LAYOUT } },
      OR: [
        { processingJobs: { some: { status: ProcessingJobStatus.SUCCEEDED } } },
        { book: { status: BookStatus.PUBLISHED } }
      ]
    },
    include: {
      book: { select: { status: true } },
      processingJobs: {
        select: { id: true, status: true, attemptNumber: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  let indexed = 0;
  const failures: string[] = [];

  for (const file of files) {
    const processingJob = file.processingJobs.find(
      (job) => job.status === ProcessingJobStatus.SUCCEEDED
    );
    if (!processingJob && file.book.status !== BookStatus.PUBLISHED) continue;

    const processingJobId = processingJob?.id ?? randomUUID();
    const objectKey = `artifacts/${file.bookId}/${file.id}/${processingJobId}/page-text.json`;
    try {
      const ocrResult = await ocrEngine.extractText(file.bucket, file.objectKey, file.mimeType);
      const body = Buffer.from(JSON.stringify({ version: 1, pages: ocrResult.pages }), 'utf8');
      const checksumSha256 = createHash('sha256').update(body).digest('hex');

      await storage.putObject(file.bucket, objectKey, body, 'application/json');
      await prisma.$transaction(async (transaction) => {
        if (!processingJob) {
          const timestamp = new Date();
          const attemptNumber = Math.max(0, ...file.processingJobs.map((job) => job.attemptNumber)) + 1;
          await transaction.processingJob.create({
            data: {
              id: processingJobId,
              bookId: file.bookId,
              bookFileId: file.id,
              type: 'PAGE_TEXT_BACKFILL',
              status: ProcessingJobStatus.SUCCEEDED,
              stage: 'completed',
              progressPercent: 100,
              attemptNumber,
              attempts: 1,
              startedAt: timestamp,
              completedAt: timestamp
            }
          });
        }

        await transaction.processingArtifact.upsert({
          where: {
            processingJobId_kind: {
              processingJobId,
              kind: ProcessingArtifactKind.OCR_LAYOUT
            }
          },
          create: {
            processingJobId,
            bookFileId: file.id,
            kind: ProcessingArtifactKind.OCR_LAYOUT,
            extractionMethod: ocrResult.method as TextExtractionMethod,
            bucket: file.bucket,
            objectKey,
            mimeType: 'application/json',
            sizeBytes: BigInt(body.byteLength),
            checksumSha256,
            language: ocrResult.language,
            pageCount: ocrResult.pageCount,
            metadata: { schemaVersion: 1 }
          },
          update: {
            extractionMethod: ocrResult.method as TextExtractionMethod,
            sizeBytes: BigInt(body.byteLength),
            checksumSha256,
            language: ocrResult.language,
            pageCount: ocrResult.pageCount,
            metadata: { schemaVersion: 1 }
          }
        });
      });
      indexed += 1;
      console.log(`Indexed page text for ${file.originalFilename}.`);
    } catch (error) {
      await storage.deleteObject(file.bucket, objectKey);
      failures.push(`${file.originalFilename}: ${errorMessage(error)}`);
      console.error(`Could not index page text for ${file.originalFilename}: ${errorMessage(error)}`);
    }
  }

  console.log(
    `Indexed page text for ${indexed} document${indexed === 1 ? '' : 's'}; ${failures.length} failed.`
  );
  if (failures.length > 0) {
    throw new Error(`Page-text backfill failed for ${failures.length} document${failures.length === 1 ? '' : 's'}.`);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main()
  .finally(async () => prisma.$disconnect())
  .catch((error) => {
    console.error('Failed to backfill page-level document text.', error);
    process.exit(1);
  });
