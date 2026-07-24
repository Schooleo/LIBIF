import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { PrismaClient, BookStatus, ReaderAccessEventType, ReaderAccessReasonCode, ReaderAccessRiskLevel, UserRole } from '../src/generated/prisma/client';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import { StorageService } from '../src/modules/storage/storage.service';
import slugify from 'slugify';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string
});

const prisma = new PrismaClient({ adapter });
const passwordHasher = new PasswordHasher();

const devUsers = [
  { email: 'admin@libif.local', password: 'admin libif dev passphrase', role: UserRole.ADMIN },
  { email: 'librarian@libif.local', password: 'librarian libif dev passphrase', role: UserRole.LIBRARIAN },
  { email: 'reader@libif.local', password: 'reader libif dev passphrase', role: UserRole.READER },
  { email: 'reader2@libif.local', password: 'reader two libif dev passphrase', role: UserRole.READER }
];

const phase7ReaderBookIsbn = 'phase7-wave4-reader-access-sample';
const phase7ReaderBookObjectKey = 'seed/phase7-wave4-reader-access-sample.pdf';
const phase7ReaderSamplePath = resolve(__dirname, '../test/fixtures/valid-sample.pdf');
const phase7ReaderSampleChecksum = 'f9ed63e2ba84dc78189da50ebf813d3768bd45f887fca3e9ae22e5f7bee744bc';
const phase7ReaderSampleSize = 5616;
const phase7ReaderEventFixtures = [
  {
    id: 'phase7-reader-event-viewer-opened',
    eventType: ReaderAccessEventType.VIEWER_OPENED,
    riskLevel: ReaderAccessRiskLevel.NONE,
    reasonCode: null,
    pageNumber: null,
    traceFingerprint: null,
    sessionId: null,
    userEmail: 'reader@libif.local',
    createdAt: new Date('2026-07-22T08:00:00.000Z')
  },
  {
    id: 'phase7-reader-event-page-served',
    eventType: ReaderAccessEventType.PAGE_SERVED,
    riskLevel: ReaderAccessRiskLevel.NONE,
    reasonCode: null,
    pageNumber: 4,
    traceFingerprint: '22a6b6df2f7939f0ddf6f1bb3981ee55137d593208ab8d1a11d8b1a7d9766e44',
    sessionId: '6c58d5f6b8797786c58d5f6b8797786c58d5f6b8797786c58d5f6b8797786',
    userEmail: 'reader@libif.local',
    createdAt: new Date('2026-07-22T08:01:00.000Z')
  },
  {
    id: 'phase7-reader-event-page-served-second-reader',
    eventType: ReaderAccessEventType.PAGE_SERVED,
    riskLevel: ReaderAccessRiskLevel.NONE,
    reasonCode: null,
    pageNumber: 1,
    traceFingerprint: '7743989bd1fcb3c3a9f3c34fef785a0e0de62b18d65da182c8821d3bd141b354',
    sessionId: '13ecac240f3569c113ecac240f3569c113ecac240f3569c113ecac240f3569c1',
    userEmail: 'reader2@libif.local',
    createdAt: new Date('2026-07-22T08:01:30.000Z')
  },
  {
    id: 'phase7-reader-event-page-denied',
    eventType: ReaderAccessEventType.PAGE_DENIED,
    riskLevel: ReaderAccessRiskLevel.LOW,
    reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
    pageNumber: 999,
    traceFingerprint: null,
    sessionId: null,
    userEmail: 'reader@libif.local',
    createdAt: new Date('2026-07-22T08:02:00.000Z')
  },
  {
    id: 'phase7-reader-event-rate-limited',
    eventType: ReaderAccessEventType.RATE_LIMITED,
    riskLevel: ReaderAccessRiskLevel.LOW,
    reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
    pageNumber: 4,
    traceFingerprint: null,
    sessionId: null,
    userEmail: 'reader@libif.local',
    createdAt: new Date('2026-07-22T08:03:00.000Z')
  },
  {
    id: 'phase7-reader-event-scrape-suspected',
    eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
    riskLevel: ReaderAccessRiskLevel.HIGH,
    reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION,
    pageNumber: 40,
    traceFingerprint: null,
    sessionId: null,
    userEmail: 'reader@libif.local',
    createdAt: new Date('2026-07-22T08:04:00.000Z')
  }
] as const;

type ReaderSampleFile = {
  bucket: string;
  checksumSha256: string;
  sizeBytes: number;
};

const defaultReaderSampleFile: ReaderSampleFile = {
  bucket: process.env.S3_BUCKET ?? 'libif-pdfs',
  checksumSha256: phase7ReaderSampleChecksum,
  sizeBytes: phase7ReaderSampleSize
};

export async function seedDevelopmentData(client: PrismaClient = prisma, readerSampleFile: ReaderSampleFile = defaultReaderSampleFile): Promise<void> {
  for (const user of devUsers) {
    const passwordHash = await passwordHasher.hash(user.password);
    await client.user.upsert({
      where: { email: user.email },
      update: { passwordHash, role: user.role },
      create: { email: user.email, passwordHash, role: user.role }
    });
  }

  for (const name of ['Giáo trình', 'Nghiên cứu', 'Văn học', 'Luận văn']) {
    await client.category.upsert({
      where: { slug: slugify(name, { lower: true, strict: true, locale: 'vi' }) },
      update: { name },
      create: { name, slug: slugify(name, { lower: true, strict: true, locale: 'vi' }) }
    });
  }

  await client.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      libraryName: 'LIBIF',
      defaultLocale: 'vi'
    }
  });

  await seedReaderAccessReportingSample(client, readerSampleFile);
}

export async function seedReaderAccessReportingSample(
  client: PrismaClient = prisma,
  readerSampleFile: ReaderSampleFile = defaultReaderSampleFile
): Promise<void> {
  const admin = await client.user.findUniqueOrThrow({ where: { email: 'admin@libif.local' } });
  const category = await client.category.findUniqueOrThrow({ where: { slug: slugify('Giáo trình', { lower: true, strict: true, locale: 'vi' }) } });

  const book = await client.book.upsert({
    where: { isbn: phase7ReaderBookIsbn },
    update: {
      title: 'Phase 7 Reader-access Reporting Sample',
      status: BookStatus.PUBLISHED,
      categoryId: category.id,
      createdById: admin.id,
      language: 'vi'
    },
    create: {
      isbn: phase7ReaderBookIsbn,
      title: 'Phase 7 Reader-access Reporting Sample',
      status: BookStatus.PUBLISHED,
      categoryId: category.id,
      createdById: admin.id,
      language: 'vi'
    }
  });

  const bookFile = await client.bookFile.upsert({
    where: { objectKey: phase7ReaderBookObjectKey },
    update: {
      bookId: book.id,
      bucket: readerSampleFile.bucket,
      originalFilename: 'phase7-reader-access-sample.pdf',
      mimeType: 'application/pdf',
      sizeBytes: readerSampleFile.sizeBytes,
      checksumSha256: readerSampleFile.checksumSha256,
      version: 1
    },
    create: {
      bookId: book.id,
      bucket: readerSampleFile.bucket,
      objectKey: phase7ReaderBookObjectKey,
      originalFilename: 'phase7-reader-access-sample.pdf',
      mimeType: 'application/pdf',
      sizeBytes: readerSampleFile.sizeBytes,
      checksumSha256: readerSampleFile.checksumSha256,
      version: 1
    }
  });

  for (const event of phase7ReaderEventFixtures) {
    const existing = await client.readerAccessEvent.findUnique({ where: { id: event.id }, select: { id: true } });
    if (existing) continue;
    const reader = await client.user.findUniqueOrThrow({ where: { email: event.userEmail } });

    await client.readerAccessEvent.create({
      data: {
        id: event.id,
        eventType: event.eventType,
        riskLevel: event.riskLevel,
        reasonCode: event.reasonCode ?? undefined,
        userId: reader.id,
        sessionId: event.sessionId ?? undefined,
        bookId: book.id,
        bookFileId: event.eventType === ReaderAccessEventType.PAGE_SERVED ? bookFile.id : undefined,
        pageNumber: event.pageNumber ?? undefined,
        traceFingerprint: event.traceFingerprint ?? undefined,
        createdAt: event.createdAt
      }
    });
  }

  await client.notification.upsert({
    where: { id: 'phase7-reader-risk-alert-admin' },
    update: {},
    create: {
      id: 'phase7-reader-risk-alert-admin',
      recipientId: admin.id,
      type: 'SYSTEM',
      status: 'UNREAD',
      title: 'Reader access risk alert',
      body: 'Suspicious reader activity requires review.',
      payload: {
        eventType: ReaderAccessEventType.SCRAPE_SUSPECTED,
        riskLevel: ReaderAccessRiskLevel.HIGH,
        reasonCode: ReaderAccessReasonCode.PAGE_ENUMERATION
      },
      actionHref: '/admin/reports/reader-access'
    }
  });
}

async function main() {
  const samplePdf = await readFile(phase7ReaderSamplePath);
  const checksumSha256 = createHash('sha256').update(samplePdf).digest('hex');
  if (checksumSha256 !== phase7ReaderSampleChecksum || samplePdf.byteLength !== phase7ReaderSampleSize) {
    throw new Error('The Phase 7 Reader sample fixture does not match its frozen seed metadata.');
  }

  const config = new ConfigService(process.env);
  const storage = new StorageService(config);
  const bucket = config.get<string>('S3_BUCKET') ?? defaultReaderSampleFile.bucket;
  await storage.putObject(bucket, phase7ReaderBookObjectKey, samplePdf, 'application/pdf');
  await seedDevelopmentData(prisma, { bucket, checksumSha256, sizeBytes: samplePdf.byteLength });
}

if (require.main === module) {
  main()
    .finally(async () => prisma.$disconnect())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
