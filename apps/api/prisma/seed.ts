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
const documentationPdfDirectory = resolve(__dirname, '../../../docs/pdfs');
const documentationAuthorName = 'LIBIF Project Team';
const documentationCategoryName = 'Tài liệu dự án';
const documentationCategorySlug = slugify(documentationCategoryName, { lower: true, strict: true, locale: 'vi' });
const documentationPdfs = [
  { filename: 'Development-Method.pdf', title: 'LIBIF Development Method', tags: ['Documentation', 'Development'] },
  { filename: 'Human-verify-proposal.pdf', title: 'Human Verification Proposal', tags: ['Documentation', 'Evaluation'] },
  { filename: 'LIBIF-Architecture.pdf', title: 'LIBIF Architecture', tags: ['Documentation', 'Architecture'] },
  { filename: 'LIBIF-Product-Backlog.pdf', title: 'LIBIF Product Backlog', tags: ['Documentation', 'Planning'] },
  { filename: 'LIBIF-Project-Estimation.pdf', title: 'LIBIF Project Estimation', tags: ['Documentation', 'Planning'] },
  { filename: 'LIBIF-Software-Project-Plan.pdf', title: 'LIBIF Software Project Plan', tags: ['Documentation', 'Planning'] },
  { filename: 'LIBIF-Vision-Scope.pdf', title: 'LIBIF Vision and Scope', tags: ['Documentation', 'Planning'] },
  { filename: 'Project-Charter.pdf', title: 'LIBIF Project Charter', tags: ['Documentation', 'Planning'] },
  { filename: 'Project-Proposal.pdf', title: 'LIBIF Project Proposal', tags: ['Documentation', 'Planning'] },
  { filename: 'Project-Status-Report.pdf', title: 'LIBIF Project Status Report', tags: ['Documentation', 'Reporting'] },
  { filename: 'Proof-of-concept.pdf', title: 'LIBIF Proof of Concept', tags: ['Documentation', 'Proof of Concept'] },
  { filename: 'criteria.pdf', title: 'LIBIF Evaluation Criteria', tags: ['Documentation', 'Evaluation'] },
  { filename: 'evaluation-proposal.pdf', title: 'LIBIF Proposal Evaluation', tags: ['Documentation', 'Evaluation'] },
  { filename: 'evaluation-vision-scope-backlog.pdf', title: 'LIBIF Vision, Scope, and Backlog Evaluation', tags: ['Documentation', 'Evaluation'] }
] as const;
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

export type DocumentationSeedFile = {
  filename: string;
  title: string;
  tags: readonly string[];
  objectKey: string;
  checksumSha256: string;
  sizeBytes: number;
  content: Buffer;
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

  for (const name of ['Giáo trình', 'Nghiên cứu', 'Văn học', 'Luận văn', documentationCategoryName]) {
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

export async function loadDocumentationSeedFiles(): Promise<DocumentationSeedFile[]> {
  return Promise.all(
    documentationPdfs.map(async (document) => {
      const content = await readFile(resolve(documentationPdfDirectory, document.filename));
      const slug = slugify(document.filename.replace(/\.pdf$/i, ''), { lower: true, strict: true });

      return {
        ...document,
        objectKey: `seed/documentation/${slug}.pdf`,
        checksumSha256: createHash('sha256').update(content).digest('hex'),
        sizeBytes: content.byteLength,
        content
      };
    })
  );
}

export async function seedDocumentationPdfCatalogue(
  client: PrismaClient = prisma,
  files: readonly DocumentationSeedFile[],
  bucket = process.env.S3_BUCKET ?? 'libif-pdfs'
): Promise<void> {
  const admin = await client.user.findUniqueOrThrow({ where: { email: 'admin@libif.local' } });
  const category = await client.category.upsert({
    where: { slug: documentationCategorySlug },
    update: { name: documentationCategoryName },
    create: { name: documentationCategoryName, slug: documentationCategorySlug }
  });
  const author = await client.author.upsert({
    where: { name: documentationAuthorName },
    update: {},
    create: { name: documentationAuthorName }
  });

  for (const file of files) {
    const documentSlug = slugify(file.filename.replace(/\.pdf$/i, ''), { lower: true, strict: true });
    const book = await client.book.upsert({
      where: { isbn: `seed-documentation-${documentSlug}` },
      update: {
        title: file.title,
        description: `Seeded from docs/pdfs/${file.filename}.`,
        status: BookStatus.PUBLISHED,
        categoryId: category.id,
        createdById: admin.id,
        language: 'en'
      },
      create: {
        isbn: `seed-documentation-${documentSlug}`,
        title: file.title,
        description: `Seeded from docs/pdfs/${file.filename}.`,
        status: BookStatus.PUBLISHED,
        categoryId: category.id,
        createdById: admin.id,
        language: 'en'
      }
    });

    await client.bookAuthor.upsert({
      where: { bookId_authorId: { bookId: book.id, authorId: author.id } },
      update: {},
      create: { bookId: book.id, authorId: author.id }
    });

    for (const tagName of file.tags) {
      const tag = await client.tag.upsert({
        where: { slug: slugify(tagName, { lower: true, strict: true }) },
        update: { name: tagName },
        create: { name: tagName, slug: slugify(tagName, { lower: true, strict: true }) }
      });
      await client.bookTag.upsert({
        where: { bookId_tagId: { bookId: book.id, tagId: tag.id } },
        update: {},
        create: { bookId: book.id, tagId: tag.id }
      });
    }

    await client.bookFile.upsert({
      where: { objectKey: file.objectKey },
      update: {
        bookId: book.id,
        bucket,
        originalFilename: file.filename,
        mimeType: 'application/pdf',
        sizeBytes: file.sizeBytes,
        checksumSha256: file.checksumSha256,
        version: 1
      },
      create: {
        bookId: book.id,
        bucket,
        objectKey: file.objectKey,
        originalFilename: file.filename,
        mimeType: 'application/pdf',
        sizeBytes: file.sizeBytes,
        checksumSha256: file.checksumSha256,
        version: 1
      }
    });
  }
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
  const documentationFiles = await loadDocumentationSeedFiles();
  const checksumSha256 = createHash('sha256').update(samplePdf).digest('hex');
  if (checksumSha256 !== phase7ReaderSampleChecksum || samplePdf.byteLength !== phase7ReaderSampleSize) {
    throw new Error('The Phase 7 Reader sample fixture does not match its frozen seed metadata.');
  }

  const config = new ConfigService(process.env);
  const storage = new StorageService(config);
  const bucket = config.get<string>('S3_BUCKET') ?? defaultReaderSampleFile.bucket;
  await storage.putObject(bucket, phase7ReaderBookObjectKey, samplePdf, 'application/pdf');
  for (const file of documentationFiles) {
    await storage.putObject(bucket, file.objectKey, file.content, 'application/pdf');
  }
  await seedDevelopmentData(prisma, { bucket, checksumSha256, sizeBytes: samplePdf.byteLength });
  await seedDocumentationPdfCatalogue(prisma, documentationFiles, bucket);
}

if (require.main === module) {
  main()
    .finally(async () => prisma.$disconnect())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
