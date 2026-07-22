-- Phase 6 D6-000 establishes file-scoped processing and review lineage before
-- the worker, correction, approval-command, and notification lanes begin.

-- CreateEnum
CREATE TYPE "ProcessingArtifactKind" AS ENUM ('EXTRACTED_TEXT', 'OCR_TEXT', 'OCR_LAYOUT');

-- CreateEnum
CREATE TYPE "TextExtractionMethod" AS ENUM ('EMBEDDED_TEXT', 'OCR', 'HYBRID');

-- ReplaceEnum: enum replacement keeps the new terminal values usable by the
-- backfill in the same migration on every supported PostgreSQL version.
CREATE TYPE "ProcessingJobStatus_new" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'SUPERSEDED');
ALTER TABLE "ProcessingJob" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProcessingJob"
  ALTER COLUMN "status" TYPE "ProcessingJobStatus_new"
  USING ("status"::text::"ProcessingJobStatus_new");
DROP TYPE "ProcessingJobStatus";
ALTER TYPE "ProcessingJobStatus_new" RENAME TO "ProcessingJobStatus";
ALTER TABLE "ProcessingJob" ALTER COLUMN "status" SET DEFAULT 'QUEUED';

CREATE TYPE "ApprovalReviewStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CORRECTION_REQUESTED', 'SUPERSEDED');
ALTER TABLE "ApprovalReview" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ApprovalReview"
  ALTER COLUMN "status" TYPE "ApprovalReviewStatus_new"
  USING ("status"::text::"ApprovalReviewStatus_new");
DROP TYPE "ApprovalReviewStatus";
ALTER TYPE "ApprovalReviewStatus_new" RENAME TO "ApprovalReviewStatus";
ALTER TABLE "ApprovalReview" ALTER COLUMN "status" SET DEFAULT 'PENDING';

CREATE TYPE "BookStatus_new" AS ENUM ('DRAFT', 'PENDING_PROCESSING', 'PROCESSING', 'PENDING_APPROVAL', 'CORRECTION_REQUIRED', 'PUBLISHED', 'REJECTED');
ALTER TABLE "Book" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Book"
  ALTER COLUMN "status" TYPE "BookStatus_new"
  USING ("status"::text::"BookStatus_new");
DROP TYPE "BookStatus";
ALTER TYPE "BookStatus_new" RENAME TO "BookStatus";
ALTER TABLE "Book" ALTER COLUMN "status" SET DEFAULT 'PENDING_PROCESSING';

-- Add nullable lineage columns first so existing Phase 5 rows can be mapped.
ALTER TABLE "ProcessingJob"
  ADD COLUMN "attemptNumber" INTEGER,
  ADD COLUMN "bookFileId" TEXT,
  ADD COLUMN "queueJobId" TEXT,
  ADD COLUMN "retryOfJobId" TEXT,
  ADD COLUMN "supersededAt" TIMESTAMP(3),
  ADD COLUMN "supersededByJobId" TEXT,
  ADD COLUMN "terminalReason" TEXT;

ALTER TABLE "ApprovalReview"
  ADD COLUMN "bookFileId" TEXT,
  ADD COLUMN "processingJobId" TEXT,
  ADD COLUMN "round" INTEGER,
  ADD COLUMN "supersededAt" TIMESTAMP(3);

-- Normalize legacy file versions and retain only the newest ACTIVE file per
-- book before adding version/current-file uniqueness.
WITH ranked_files AS (
  SELECT
    "id",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "createdAt", "id")::integer AS "normalizedVersion"
  FROM "BookFile"
)
UPDATE "BookFile" AS file
SET "version" = ranked."normalizedVersion"
FROM ranked_files AS ranked
WHERE file."id" = ranked."id";

WITH ranked_active_files AS (
  SELECT
    "id",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "version" DESC, "createdAt" DESC, "id" DESC) AS "activeRank"
  FROM "BookFile"
  WHERE "status" = 'ACTIVE'
)
UPDATE "BookFile" AS file
SET "status" = 'REPLACED'
FROM ranked_active_files AS ranked
WHERE file."id" = ranked."id"
  AND ranked."activeRank" > 1;

-- Associate each legacy job with the file that was current when it was
-- created. Fall back to the newest known file for malformed legacy timestamps.
UPDATE "ProcessingJob" AS job
SET "bookFileId" = COALESCE(
  (
    SELECT file."id"
    FROM "BookFile" AS file
    WHERE file."bookId" = job."bookId"
      AND file."createdAt" <= job."createdAt"
    ORDER BY file."createdAt" DESC, file."version" DESC, file."id" DESC
    LIMIT 1
  ),
  (
    SELECT file."id"
    FROM "BookFile" AS file
    WHERE file."bookId" = job."bookId"
    ORDER BY file."createdAt" DESC, file."version" DESC, file."id" DESC
    LIMIT 1
  )
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "ProcessingJob" WHERE "bookFileId" IS NULL) THEN
    RAISE EXCEPTION 'Phase 6 migration cannot map a ProcessingJob because its Book has no BookFile';
  END IF;
END $$;

-- Convert Phase 5 failure encodings into explicit terminal states.
UPDATE "ProcessingJob"
SET
  "status" = 'SUPERSEDED',
  "supersededAt" = COALESCE("cancelledAt", "completedAt", "updatedAt"),
  "completedAt" = COALESCE("completedAt", "cancelledAt", "updatedAt"),
  "terminalReason" = COALESCE("terminalReason", "errorMessage", 'Superseded by a newer processing request')
WHERE "status" = 'FAILED'
  AND lower(COALESCE("stage", '')) = 'superseded';

UPDATE "ProcessingJob"
SET
  "status" = 'CANCELLED',
  "cancelledAt" = COALESCE("cancelledAt", "completedAt", "updatedAt"),
  "completedAt" = COALESCE("completedAt", "cancelledAt", "updatedAt"),
  "terminalReason" = COALESCE("terminalReason", "errorMessage", 'Cancelled')
WHERE "status" = 'FAILED'
  AND (
    lower(COALESCE("stage", '')) = 'cancelled'
    OR "cancelledAt" IS NOT NULL
  );

-- If legacy data contains multiple current jobs for a book, keep the newest
-- one current and preserve the rest as superseded history.
WITH ranked_current_jobs AS (
  SELECT
    "id",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "createdAt" DESC, "id" DESC) AS "currentRank"
  FROM "ProcessingJob"
  WHERE "status" IN ('QUEUED', 'RUNNING')
)
UPDATE "ProcessingJob" AS job
SET
  "status" = 'SUPERSEDED',
  "stage" = 'superseded',
  "supersededAt" = COALESCE(job."supersededAt", job."updatedAt"),
  "completedAt" = COALESCE(job."completedAt", job."updatedAt"),
  "terminalReason" = COALESCE(job."terminalReason", 'Superseded during Phase 6 lineage migration')
FROM ranked_current_jobs AS ranked
WHERE job."id" = ranked."id"
  AND ranked."currentRank" > 1;

-- Number file-scoped attempts and link each retry to its immediate predecessor.
WITH numbered_jobs AS (
  SELECT
    "id",
    row_number() OVER (PARTITION BY "bookFileId" ORDER BY "createdAt", "id")::integer AS "attemptNumber",
    lag("id") OVER (PARTITION BY "bookFileId" ORDER BY "createdAt", "id") AS "retryOfJobId"
  FROM "ProcessingJob"
)
UPDATE "ProcessingJob" AS job
SET
  "attemptNumber" = numbered."attemptNumber",
  "retryOfJobId" = numbered."retryOfJobId"
FROM numbered_jobs AS numbered
WHERE job."id" = numbered."id";

UPDATE "ProcessingJob" AS job
SET "supersededByJobId" = (
  SELECT newer."id"
  FROM "ProcessingJob" AS newer
  WHERE newer."bookId" = job."bookId"
    AND (newer."createdAt", newer."id") > (job."createdAt", job."id")
  ORDER BY newer."createdAt", newer."id"
  LIMIT 1
)
WHERE job."status" = 'SUPERSEDED';

-- Match historical reviews to successful jobs in chronological order. Phase 5
-- creates reviews only after success, so an unmatched review is treated as
-- corrupt data instead of being silently attached to the wrong file.
WITH ranked_reviews AS (
  SELECT
    "id",
    "bookId",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "createdAt", "id")::integer AS "reviewRound"
  FROM "ApprovalReview"
),
ranked_successful_jobs AS (
  SELECT
    "id",
    "bookId",
    "bookFileId",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "createdAt", "id")::integer AS "reviewRound"
  FROM "ProcessingJob"
  WHERE "status" = 'SUCCEEDED'
)
UPDATE "ApprovalReview" AS review
SET
  "processingJobId" = job."id",
  "bookFileId" = job."bookFileId",
  "round" = ranked."reviewRound"
FROM ranked_reviews AS ranked
JOIN ranked_successful_jobs AS job
  ON job."bookId" = ranked."bookId"
  AND job."reviewRound" = ranked."reviewRound"
WHERE review."id" = ranked."id";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "ApprovalReview"
    WHERE "bookFileId" IS NULL
       OR "processingJobId" IS NULL
       OR "round" IS NULL
  ) THEN
    RAISE EXCEPTION 'Phase 6 migration cannot map an ApprovalReview to a successful ProcessingJob and BookFile';
  END IF;
END $$;

-- Preserve duplicate pending rows as history while leaving one current round.
WITH ranked_pending_reviews AS (
  SELECT
    "id",
    row_number() OVER (PARTITION BY "bookId" ORDER BY "createdAt" DESC, "id" DESC) AS "pendingRank"
  FROM "ApprovalReview"
  WHERE "status" = 'PENDING'
)
UPDATE "ApprovalReview" AS review
SET
  "status" = 'SUPERSEDED',
  "supersededAt" = COALESCE(review."supersededAt", review."updatedAt")
FROM ranked_pending_reviews AS ranked
WHERE review."id" = ranked."id"
  AND ranked."pendingRank" > 1;

ALTER TABLE "ProcessingJob"
  ALTER COLUMN "bookFileId" SET NOT NULL,
  ALTER COLUMN "attemptNumber" SET DEFAULT 1,
  ALTER COLUMN "attemptNumber" SET NOT NULL;

ALTER TABLE "ApprovalReview"
  ALTER COLUMN "bookFileId" SET NOT NULL,
  ALTER COLUMN "processingJobId" SET NOT NULL,
  ALTER COLUMN "round" SET DEFAULT 1,
  ALTER COLUMN "round" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProcessingArtifact" (
  "id" TEXT NOT NULL,
  "processingJobId" TEXT NOT NULL,
  "bookFileId" TEXT NOT NULL,
  "kind" "ProcessingArtifactKind" NOT NULL,
  "extractionMethod" "TextExtractionMethod",
  "bucket" TEXT NOT NULL,
  "objectKey" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" BIGINT NOT NULL,
  "checksumSha256" TEXT NOT NULL,
  "language" TEXT,
  "pageCount" INTEGER,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProcessingArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookFile_id_bookId_key" ON "BookFile"("id", "bookId");
CREATE UNIQUE INDEX "BookFile_bookId_version_key" ON "BookFile"("bookId", "version");
CREATE UNIQUE INDEX "BookFile_one_active_per_book_key" ON "BookFile"("bookId") WHERE "status" = 'ACTIVE';

CREATE UNIQUE INDEX "ProcessingJob_queueJobId_key" ON "ProcessingJob"("queueJobId");
CREATE UNIQUE INDEX "ProcessingJob_id_bookFileId_key" ON "ProcessingJob"("id", "bookFileId");
CREATE UNIQUE INDEX "ProcessingJob_bookFileId_attemptNumber_key" ON "ProcessingJob"("bookFileId", "attemptNumber");
CREATE UNIQUE INDEX "ProcessingJob_one_current_per_book_key" ON "ProcessingJob"("bookId") WHERE "status" IN ('QUEUED', 'RUNNING');
CREATE INDEX "ProcessingJob_bookFileId_createdAt_idx" ON "ProcessingJob"("bookFileId", "createdAt");
CREATE INDEX "ProcessingJob_retryOfJobId_idx" ON "ProcessingJob"("retryOfJobId");
CREATE INDEX "ProcessingJob_supersededByJobId_idx" ON "ProcessingJob"("supersededByJobId");

CREATE UNIQUE INDEX "ProcessingArtifact_objectKey_key" ON "ProcessingArtifact"("objectKey");
CREATE UNIQUE INDEX "ProcessingArtifact_processingJobId_kind_key" ON "ProcessingArtifact"("processingJobId", "kind");
CREATE INDEX "ProcessingArtifact_bookFileId_createdAt_idx" ON "ProcessingArtifact"("bookFileId", "createdAt");

CREATE UNIQUE INDEX "ApprovalReview_processingJobId_bookFileId_key" ON "ApprovalReview"("processingJobId", "bookFileId");
CREATE UNIQUE INDEX "ApprovalReview_bookId_round_key" ON "ApprovalReview"("bookId", "round");
CREATE UNIQUE INDEX "ApprovalReview_one_pending_per_book_key" ON "ApprovalReview"("bookId") WHERE "status" = 'PENDING';
CREATE INDEX "ApprovalReview_bookFileId_createdAt_idx" ON "ApprovalReview"("bookFileId", "createdAt");

-- AddCheckConstraint
ALTER TABLE "BookFile"
  ADD CONSTRAINT "BookFile_version_check" CHECK ("version" >= 1);

ALTER TABLE "ProcessingJob"
  ADD CONSTRAINT "ProcessingJob_progress_check" CHECK ("progressPercent" BETWEEN 0 AND 100),
  ADD CONSTRAINT "ProcessingJob_attempt_number_check" CHECK ("attemptNumber" >= 1),
  ADD CONSTRAINT "ProcessingJob_retry_not_self_check" CHECK ("retryOfJobId" IS NULL OR "retryOfJobId" <> "id"),
  ADD CONSTRAINT "ProcessingJob_supersession_not_self_check" CHECK ("supersededByJobId" IS NULL OR "supersededByJobId" <> "id");

ALTER TABLE "ProcessingArtifact"
  ADD CONSTRAINT "ProcessingArtifact_size_check" CHECK ("sizeBytes" >= 0),
  ADD CONSTRAINT "ProcessingArtifact_page_count_check" CHECK ("pageCount" IS NULL OR "pageCount" >= 1);

ALTER TABLE "ApprovalReview"
  ADD CONSTRAINT "ApprovalReview_round_check" CHECK ("round" >= 1);

-- AddForeignKey: composite references enforce that a job/review/artifact cannot
-- point at a file belonging to another document or another processing job.
ALTER TABLE "ProcessingJob"
  ADD CONSTRAINT "ProcessingJob_bookFileId_bookId_fkey"
  FOREIGN KEY ("bookFileId", "bookId") REFERENCES "BookFile"("id", "bookId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProcessingJob"
  ADD CONSTRAINT "ProcessingJob_retryOfJobId_fkey"
  FOREIGN KEY ("retryOfJobId") REFERENCES "ProcessingJob"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProcessingJob"
  ADD CONSTRAINT "ProcessingJob_supersededByJobId_fkey"
  FOREIGN KEY ("supersededByJobId") REFERENCES "ProcessingJob"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProcessingArtifact"
  ADD CONSTRAINT "ProcessingArtifact_processingJobId_bookFileId_fkey"
  FOREIGN KEY ("processingJobId", "bookFileId") REFERENCES "ProcessingJob"("id", "bookFileId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProcessingArtifact"
  ADD CONSTRAINT "ProcessingArtifact_bookFileId_fkey"
  FOREIGN KEY ("bookFileId") REFERENCES "BookFile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApprovalReview"
  ADD CONSTRAINT "ApprovalReview_bookFileId_bookId_fkey"
  FOREIGN KEY ("bookFileId", "bookId") REFERENCES "BookFile"("id", "bookId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApprovalReview"
  ADD CONSTRAINT "ApprovalReview_processingJobId_bookFileId_fkey"
  FOREIGN KEY ("processingJobId", "bookFileId") REFERENCES "ProcessingJob"("id", "bookFileId")
  ON DELETE CASCADE ON UPDATE CASCADE;
