import { config } from 'dotenv';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

config({ path: resolve(__dirname, '../../../.env') });

const PRE_PHASE7_MIGRATIONS = [
  '20260717073000_init',
  '20260720105000_auth_access',
  '20260721114643_phase5_domain_foundations',
  '20260722062955_phase6_processing_foundation',
  '20260723050000_phase6_ocr_privacy_hardening'
];
const PHASE7_MIGRATION = '20260723143000_phase7_administration_reader_security_foundation';

describe('Phase 7 administration and Reader security schema foundation', () => {
  let client: Client;
  const schema = `phase7_foundation_${process.pid}_${Date.now()}`;

  beforeAll(async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? 'postgresql://library:library@localhost:5432/libif');
    databaseUrl.searchParams.delete('schema');
    client = new Client({ connectionString: databaseUrl.toString() });
    await client.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);

    for (const migration of PRE_PHASE7_MIGRATIONS) {
      await client.query(readMigration(migration));
    }

    await seedExistingPhase6Records(client);
    await client.query(readMigration(PHASE7_MIGRATION));
  }, 30_000);

  afterAll(async () => {
    if (!client) return;
    await client.query('SET search_path TO public');
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await client.end();
  });

  it('uses exactly one Phase 7 migration and backfills existing users as active', async () => {
    const phase7Migrations = readdirSync(resolve(__dirname, '../prisma/migrations')).filter((name) =>
      name.includes('phase7')
    );
    expect(phase7Migrations).toEqual([PHASE7_MIGRATION]);

    const user = await client.query<{ status: string; deactivatedAt: Date | null }>(
      'SELECT "status"::text, "deactivatedAt" FROM "User" WHERE "id" = $1',
      ['reader-1']
    );
    expect(user.rows[0]).toEqual({ status: 'ACTIVE', deactivatedAt: null });
  });

  it('enforces coherent account status and append-only administration events', async () => {
    await expect(
      client.query(`UPDATE "User" SET "status" = 'DEACTIVATED' WHERE "id" = 'reader-1'`)
    ).rejects.toMatchObject({ code: '23514' });

    await client.query(
      `INSERT INTO "UserAdministrationEvent"
        ("id", "targetUserId", "actorUserId", "action", "previousRole", "nextRole", "reason")
       VALUES ('admin-event-1', 'reader-1', 'admin-1', 'ROLE_CHANGED', 'READER', 'LIBRARIAN', 'Approved role change')`
    );

    await expect(
      client.query(`UPDATE "UserAdministrationEvent" SET "reason" = 'rewritten' WHERE "id" = 'admin-event-1'`)
    ).rejects.toMatchObject({ code: 'P0001' });
    await expect(
      client.query(`DELETE FROM "UserAdministrationEvent" WHERE "id" = 'admin-event-1'`)
    ).rejects.toMatchObject({ code: 'P0001' });
  });

  it('accepts bounded Reader facts and rejects invalid or mutable event shapes', async () => {
    const traceFingerprint = 'a'.repeat(64);
    await client.query(
      `INSERT INTO "ReaderAccessEvent"
        ("id", "eventType", "userId", "sessionId", "bookId", "bookFileId", "pageNumber", "traceFingerprint")
       VALUES ('reader-event-1', 'PAGE_SERVED', 'reader-1', 'session-1', 'book-1', 'file-1', 1, $1)`,
      [traceFingerprint]
    );

    await client.query(
      `INSERT INTO "ReaderAccessEvent"
        ("id", "eventType", "riskLevel", "reasonCode", "userId", "sessionId", "bookId", "pageNumber")
       VALUES (
         'reader-event-2',
         'SCRAPE_SUSPECTED',
         'HIGH',
         'PAGE_ENUMERATION',
         'reader-1',
         'session-1',
         'book-1',
         12
       )`
    );

    await expect(
      client.query(
        `INSERT INTO "ReaderAccessEvent"
          ("id", "eventType", "userId", "bookId", "pageNumber")
         VALUES ('invalid-served-event', 'PAGE_SERVED', 'reader-1', 'book-1', 0)`
      )
    ).rejects.toMatchObject({ code: '23514' });

    await expect(
      client.query(
        `INSERT INTO "ReaderAccessEvent"
          ("id", "eventType", "userId", "bookId", "pageNumber", "traceFingerprint")
         VALUES ('served-without-file', 'PAGE_SERVED', 'reader-1', 'book-1', 1, $1)`,
        ['b'.repeat(64)]
      )
    ).rejects.toMatchObject({ code: '23514' });

    await client.query(`DELETE FROM "UserSession" WHERE "id" = 'session-1'`);
    const retainedSessionFact = await client.query<{ sessionId: string | null }>(
      `SELECT "sessionId" FROM "ReaderAccessEvent" WHERE "id" = 'reader-event-1'`
    );
    expect(retainedSessionFact.rows[0]).toEqual({ sessionId: 'session-1' });

    await expect(
      client.query(`DELETE FROM "ReaderAccessEvent" WHERE "id" = 'reader-event-1'`)
    ).rejects.toMatchObject({ code: 'P0001' });
  });

  it('keeps Reader audit storage limited to explicit non-content columns', async () => {
    const columns = await client.query<{ column_name: string }>(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = 'ReaderAccessEvent'
       ORDER BY ordinal_position`,
      [schema]
    );

    expect(columns.rows.map(({ column_name }) => column_name)).toEqual([
      'id',
      'eventType',
      'riskLevel',
      'reasonCode',
      'userId',
      'sessionId',
      'bookId',
      'bookFileId',
      'pageNumber',
      'traceFingerprint',
      'createdAt'
    ]);

    const indexes = await client.query<{ indexname: string }>(
      `SELECT indexname
       FROM pg_indexes
       WHERE schemaname = $1 AND tablename = 'ReaderAccessEvent'`,
      [schema]
    );
    expect(indexes.rows.map(({ indexname }) => indexname)).toEqual(
      expect.arrayContaining([
        'ReaderAccessEvent_traceFingerprint_key',
        'ReaderAccessEvent_userId_createdAt_idx',
        'ReaderAccessEvent_bookId_createdAt_idx',
        'ReaderAccessEvent_eventType_createdAt_idx',
        'ReaderAccessEvent_riskLevel_createdAt_idx'
      ])
    );
  });

  it('creates one validated settings singleton without deployment secrets', async () => {
    const settings = await client.query<{
      id: string;
      libraryName: string;
      defaultLocale: string;
      supportEmail: string | null;
    }>('SELECT "id", "libraryName", "defaultLocale", "supportEmail" FROM "SystemSettings"');
    expect(settings.rows).toEqual([
      { id: 'default', libraryName: 'LIBIF', defaultLocale: 'vi', supportEmail: null }
    ]);

    await expect(
      client.query(
        `INSERT INTO "SystemSettings" ("id", "libraryName", "defaultLocale", "updatedAt")
         VALUES ('secondary', 'Other', 'vi', now())`
      )
    ).rejects.toMatchObject({ code: '23514' });

    await expect(
      client.query(`UPDATE "SystemSettings" SET "supportEmail" = 'not-an-email' WHERE "id" = 'default'`)
    ).rejects.toMatchObject({ code: '23514' });
  });
});

function readMigration(name: string): string {
  return readFileSync(resolve(__dirname, `../prisma/migrations/${name}/migration.sql`), 'utf8');
}

async function seedExistingPhase6Records(client: Client): Promise<void> {
  await client.query(`
    INSERT INTO "User" ("id", "email", "passwordHash", "role", "createdAt", "updatedAt")
    VALUES
      ('admin-1', 'admin-phase7@example.test', 'test', 'ADMIN', now(), now()),
      ('reader-1', 'reader-phase7@example.test', 'test', 'READER', now(), now());

    INSERT INTO "UserSession" ("id", "userId", "tokenHash", "expiresAt", "createdAt")
    VALUES ('session-1', 'reader-1', 'session-hash', now() + interval '1 hour', now());

    INSERT INTO "Book" ("id", "title", "status", "createdById", "createdAt", "updatedAt")
    VALUES ('book-1', 'Phase 7 Reader Fixture', 'PUBLISHED', 'admin-1', now(), now());

    INSERT INTO "BookFile" (
      "id", "bookId", "bucket", "objectKey", "originalFilename", "mimeType",
      "sizeBytes", "checksumSha256", "version", "status", "createdAt", "updatedAt"
    )
    VALUES (
      'file-1', 'book-1', 'private', 'raw/book-1/file-1.pdf', 'fixture.pdf', 'application/pdf',
      1024, 'fixture-checksum', 1, 'ACTIVE', now(), now()
    );
  `);
}
