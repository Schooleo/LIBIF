import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

config({ path: resolve(__dirname, '../../../.env') });

const LEGACY_MIGRATIONS = [
  '20260717073000_init',
  '20260720105000_auth_access',
  '20260721114643_phase5_domain_foundations'
];
const PHASE6_MIGRATION = '20260722062955_phase6_processing_foundation';
const OCR_PRIVACY_MIGRATION = '20260723050000_phase6_ocr_privacy_hardening';

describe('Phase 6 processing schema foundation migration', () => {
  let client: Client;
  const schema = `phase6_migration_${process.pid}_${Date.now()}`;

  beforeAll(async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? 'postgresql://library:library@localhost:5432/libif');
    databaseUrl.searchParams.delete('schema');
    client = new Client({ connectionString: databaseUrl.toString() });
    await client.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);

    for (const migration of LEGACY_MIGRATIONS) {
      await client.query(readMigration(migration));
    }

    await seedPhase5Lifecycle(client);
    await client.query(readMigration(PHASE6_MIGRATION));
    await seedLeakedOcrPreview(client);
    await client.query(readMigration(OCR_PRIVACY_MIGRATION));
  }, 30_000);

  afterAll(async () => {
    if (!client) return;
    await client.query('SET search_path TO public');
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await client.end();
  });

  it('backfills exact file, retry, supersession, and review-round lineage', async () => {
    const files = await client.query<{ id: string; version: number; status: string }>(
      'SELECT "id", "version", "status"::text FROM "BookFile" ORDER BY "version"'
    );
    expect(files.rows).toEqual([
      { id: 'file-old', version: 1, status: 'REPLACED' },
      { id: 'file-new', version: 2, status: 'ACTIVE' }
    ]);

    const jobs = await client.query<{
      id: string;
      bookFileId: string;
      status: string;
      attemptNumber: number;
      retryOfJobId: string | null;
      supersededByJobId: string | null;
    }>(
      'SELECT "id", "bookFileId", "status"::text, "attemptNumber", "retryOfJobId", "supersededByJobId" FROM "ProcessingJob" ORDER BY "createdAt", "id"'
    );
    expect(jobs.rows).toEqual([
      {
        id: 'job-old',
        bookFileId: 'file-old',
        status: 'SUPERSEDED',
        attemptNumber: 1,
        retryOfJobId: null,
        supersededByJobId: 'job-success-old'
      },
      {
        id: 'job-success-old',
        bookFileId: 'file-old',
        status: 'SUCCEEDED',
        attemptNumber: 2,
        retryOfJobId: 'job-old',
        supersededByJobId: null
      },
      {
        id: 'job-success-new',
        bookFileId: 'file-new',
        status: 'SUCCEEDED',
        attemptNumber: 1,
        retryOfJobId: null,
        supersededByJobId: null
      },
      {
        id: 'job-current-old',
        bookFileId: 'file-new',
        status: 'SUPERSEDED',
        attemptNumber: 2,
        retryOfJobId: 'job-success-new',
        supersededByJobId: 'job-current-new'
      },
      {
        id: 'job-current-new',
        bookFileId: 'file-new',
        status: 'QUEUED',
        attemptNumber: 3,
        retryOfJobId: 'job-current-old',
        supersededByJobId: null
      }
    ]);

    const reviews = await client.query<{
      id: string;
      bookFileId: string;
      processingJobId: string;
      round: number;
      status: string;
    }>(
      'SELECT "id", "bookFileId", "processingJobId", "round", "status"::text FROM "ApprovalReview" ORDER BY "round"'
    );
    expect(reviews.rows).toEqual([
      { id: 'review-old', bookFileId: 'file-old', processingJobId: 'job-success-old', round: 1, status: 'SUPERSEDED' },
      { id: 'review-new', bookFileId: 'file-new', processingJobId: 'job-success-new', round: 2, status: 'PENDING' }
    ]);
  });

  it('enforces one current file, processing job, and approval round per document', async () => {
    await expect(
      client.query(
        `INSERT INTO "BookFile" ("id", "bookId", "bucket", "objectKey", "originalFilename", "mimeType", "sizeBytes", "checksumSha256", "version", "status", "createdAt", "updatedAt")
         VALUES ('file-duplicate-active', 'book-1', 'test', 'raw/duplicate.pdf', 'duplicate.pdf', 'application/pdf', 1, 'duplicate', 3, 'ACTIVE', now(), now())`
      )
    ).rejects.toMatchObject({ code: '23505' });

    await expect(
      client.query(
        `INSERT INTO "ProcessingJob" ("id", "bookId", "bookFileId", "status", "attemptNumber", "attempts", "progressPercent", "createdAt", "updatedAt")
         VALUES ('job-duplicate-current', 'book-1', 'file-new', 'RUNNING', 4, 0, 0, now(), now())`
      )
    ).rejects.toMatchObject({ code: '23505' });

    await expect(
      client.query(
        `INSERT INTO "ApprovalReview" ("id", "bookId", "bookFileId", "processingJobId", "round", "status", "createdAt", "updatedAt")
         VALUES ('review-duplicate-pending', 'book-1', 'file-new', 'job-current-new', 3, 'PENDING', now(), now())`
      )
    ).rejects.toMatchObject({ code: '23505' });
  });

  it('persists artifact metadata only for the processing job source file', async () => {
    await client.query(
      `INSERT INTO "ProcessingArtifact" ("id", "processingJobId", "bookFileId", "kind", "extractionMethod", "bucket", "objectKey", "mimeType", "sizeBytes", "checksumSha256", "language", "pageCount", "createdAt", "updatedAt")
       VALUES ('artifact-1', 'job-success-new', 'file-new', 'OCR_TEXT', 'OCR', 'derived', 'derived/file-new/job-success-new.txt', 'text/plain', 128, 'artifact-checksum', 'vi', 4, now(), now())`
    );

    const artifact = await client.query<{ processingJobId: string; bookFileId: string; language: string; pageCount: number }>(
      'SELECT "processingJobId", "bookFileId", "language", "pageCount" FROM "ProcessingArtifact" WHERE "id" = $1',
      ['artifact-1']
    );
    expect(artifact.rows[0]).toEqual({ processingJobId: 'job-success-new', bookFileId: 'file-new', language: 'vi', pageCount: 4 });

    await expect(
      client.query(
        `INSERT INTO "ProcessingArtifact" ("id", "processingJobId", "bookFileId", "kind", "bucket", "objectKey", "mimeType", "sizeBytes", "checksumSha256", "createdAt", "updatedAt")
         VALUES ('artifact-wrong-file', 'job-success-old', 'file-new', 'EXTRACTED_TEXT', 'derived', 'derived/wrong.txt', 'text/plain', 1, 'wrong', now(), now())`
      )
    ).rejects.toMatchObject({ code: '23503' });
  });

  it('purges plaintext OCR previews while preserving non-content artifact metadata', async () => {
    const artifact = await client.query<{ metadata: Record<string, unknown> | null }>(
      'SELECT "metadata" FROM "ProcessingArtifact" WHERE "id" = $1',
      ['artifact-preview']
    );

    expect(artifact.rows[0].metadata).toEqual({ source: 'legacy-worker' });
    expect(artifact.rows[0].metadata).not.toHaveProperty('textPreview');
  });

  it('rejects invalid progress, attempts, and artifact metadata', async () => {
    await expect(
      client.query('UPDATE "ProcessingJob" SET "progressPercent" = 101 WHERE "id" = $1', ['job-current-new'])
    ).rejects.toMatchObject({ code: '23514' });

    await expect(
      client.query('UPDATE "ProcessingJob" SET "attemptNumber" = 0 WHERE "id" = $1', ['job-current-new'])
    ).rejects.toMatchObject({ code: '23514' });

    await expect(
      client.query('UPDATE "ProcessingArtifact" SET "pageCount" = 0 WHERE "id" = $1', ['artifact-1'])
    ).rejects.toMatchObject({ code: '23514' });
  });
});

function readMigration(name: string): string {
  return readFileSync(resolve(__dirname, `../prisma/migrations/${name}/migration.sql`), 'utf8');
}

async function seedPhase5Lifecycle(client: Client): Promise<void> {
  await client.query(`
    INSERT INTO "User" ("id", "email", "passwordHash", "role", "createdAt", "updatedAt")
    VALUES ('user-1', 'phase6@example.test', 'test', 'LIBRARIAN', '2026-01-01', '2026-01-01');

    INSERT INTO "Book" ("id", "title", "status", "createdById", "createdAt", "updatedAt")
    VALUES ('book-1', 'Phase 6 Migration Fixture', 'PENDING_APPROVAL', 'user-1', '2026-01-01', '2026-02-05');

    INSERT INTO "BookFile" ("id", "bookId", "bucket", "objectKey", "originalFilename", "mimeType", "sizeBytes", "checksumSha256", "status", "createdAt", "updatedAt")
    VALUES
      ('file-old', 'book-1', 'test', 'raw/old.pdf', 'old.pdf', 'application/pdf', 10, 'old-checksum', 'ACTIVE', '2026-01-01', '2026-01-01'),
      ('file-new', 'book-1', 'test', 'raw/new.pdf', 'new.pdf', 'application/pdf', 20, 'new-checksum', 'ACTIVE', '2026-02-01', '2026-02-01');

    INSERT INTO "ProcessingJob" ("id", "bookId", "status", "stage", "progressPercent", "attempts", "errorMessage", "cancelledAt", "createdAt", "updatedAt")
    VALUES
      ('job-old', 'book-1', 'FAILED', 'superseded', 10, 1, 'Superseded by replacement', '2026-01-02', '2026-01-02', '2026-01-02'),
      ('job-success-old', 'book-1', 'SUCCEEDED', 'completed', 100, 1, NULL, NULL, '2026-01-03', '2026-01-03'),
      ('job-success-new', 'book-1', 'SUCCEEDED', 'completed', 100, 1, NULL, NULL, '2026-02-02', '2026-02-02'),
      ('job-current-old', 'book-1', 'QUEUED', 'queued', 0, 0, NULL, NULL, '2026-02-03', '2026-02-03'),
      ('job-current-new', 'book-1', 'QUEUED', 'queued', 0, 0, NULL, NULL, '2026-02-04', '2026-02-04');

    INSERT INTO "ApprovalReview" ("id", "bookId", "status", "createdAt", "updatedAt")
    VALUES
      ('review-old', 'book-1', 'PENDING', '2026-01-04', '2026-01-04'),
      ('review-new', 'book-1', 'PENDING', '2026-02-05', '2026-02-05');
  `);
}

async function seedLeakedOcrPreview(client: Client): Promise<void> {
  await client.query(`
    INSERT INTO "ProcessingArtifact" (
      "id", "processingJobId", "bookFileId", "kind", "extractionMethod",
      "bucket", "objectKey", "mimeType", "sizeBytes", "checksumSha256",
      "language", "pageCount", "metadata", "createdAt", "updatedAt"
    )
    VALUES (
      'artifact-preview', 'job-success-new', 'file-new', 'EXTRACTED_TEXT', 'OCR',
      'derived', 'derived/file-new/privacy-preview.txt', 'text/plain', 128, 'privacy-checksum',
      'vi', 1, '{"textPreview":"sensitive OCR content","source":"legacy-worker"}'::jsonb, now(), now()
    )
  `);
}
