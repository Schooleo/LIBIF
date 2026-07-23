-- CreateEnum
CREATE TYPE "UserAccountStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "UserAdministrationAction" AS ENUM ('ROLE_CHANGED', 'DEACTIVATED', 'REACTIVATED');

-- CreateEnum
CREATE TYPE "ReaderAccessEventType" AS ENUM ('VIEWER_OPENED', 'PAGE_SERVED', 'PAGE_DENIED', 'RATE_LIMITED', 'SCRAPE_SUSPECTED');

-- CreateEnum
CREATE TYPE "ReaderAccessRiskLevel" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ReaderAccessReasonCode" AS ENUM (
  'ACCESS_DENIED',
  'DOCUMENT_UNAVAILABLE',
  'PAGE_OUT_OF_RANGE',
  'RATE_LIMIT_EXCEEDED',
  'CONCURRENCY_LIMIT_EXCEEDED',
  'PAGE_ENUMERATION',
  'IMPOSSIBLE_READING_RATE',
  'REPEATED_INVALID_PAGE',
  'PARALLEL_SESSION_ABUSE',
  'DEPENDENCY_UNAVAILABLE'
);

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "status" "UserAccountStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "deactivatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserAdministrationEvent" (
  "id" TEXT NOT NULL,
  "targetUserId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "action" "UserAdministrationAction" NOT NULL,
  "previousRole" "UserRole",
  "nextRole" "UserRole",
  "reason" VARCHAR(500),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserAdministrationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderAccessEvent" (
  "id" TEXT NOT NULL,
  "eventType" "ReaderAccessEventType" NOT NULL,
  "riskLevel" "ReaderAccessRiskLevel" NOT NULL DEFAULT 'NONE',
  "reasonCode" "ReaderAccessReasonCode",
  "userId" TEXT NOT NULL,
  "sessionId" TEXT,
  "bookId" TEXT NOT NULL,
  "bookFileId" TEXT,
  "pageNumber" INTEGER,
  "traceFingerprint" VARCHAR(64),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReaderAccessEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "libraryName" VARCHAR(120) NOT NULL DEFAULT 'LIBIF',
  "supportEmail" VARCHAR(254),
  "defaultLocale" VARCHAR(16) NOT NULL DEFAULT 'vi',
  "readerNotice" VARCHAR(500),
  "updatedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");
CREATE INDEX "UserAdministrationEvent_targetUserId_createdAt_idx" ON "UserAdministrationEvent"("targetUserId", "createdAt");
CREATE INDEX "UserAdministrationEvent_actorUserId_createdAt_idx" ON "UserAdministrationEvent"("actorUserId", "createdAt");
CREATE INDEX "UserAdministrationEvent_action_createdAt_idx" ON "UserAdministrationEvent"("action", "createdAt");
CREATE UNIQUE INDEX "ReaderAccessEvent_traceFingerprint_key" ON "ReaderAccessEvent"("traceFingerprint");
CREATE INDEX "ReaderAccessEvent_userId_createdAt_idx" ON "ReaderAccessEvent"("userId", "createdAt");
CREATE INDEX "ReaderAccessEvent_sessionId_createdAt_idx" ON "ReaderAccessEvent"("sessionId", "createdAt");
CREATE INDEX "ReaderAccessEvent_bookId_createdAt_idx" ON "ReaderAccessEvent"("bookId", "createdAt");
CREATE INDEX "ReaderAccessEvent_bookFileId_createdAt_idx" ON "ReaderAccessEvent"("bookFileId", "createdAt");
CREATE INDEX "ReaderAccessEvent_eventType_createdAt_idx" ON "ReaderAccessEvent"("eventType", "createdAt");
CREATE INDEX "ReaderAccessEvent_riskLevel_createdAt_idx" ON "ReaderAccessEvent"("riskLevel", "createdAt");
CREATE INDEX "SystemSettings_updatedById_idx" ON "SystemSettings"("updatedById");

-- AddForeignKey
ALTER TABLE "UserAdministrationEvent"
  ADD CONSTRAINT "UserAdministrationEvent_targetUserId_fkey"
  FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserAdministrationEvent"
  ADD CONSTRAINT "UserAdministrationEvent_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ReaderAccessEvent"
  ADD CONSTRAINT "ReaderAccessEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ReaderAccessEvent"
  ADD CONSTRAINT "ReaderAccessEvent_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SystemSettings"
  ADD CONSTRAINT "SystemSettings_updatedById_fkey"
  FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "User"
  ADD CONSTRAINT "User_deactivation_state_check"
  CHECK (
    ("status" = 'ACTIVE' AND "deactivatedAt" IS NULL)
    OR ("status" = 'DEACTIVATED' AND "deactivatedAt" IS NOT NULL)
  );

ALTER TABLE "UserAdministrationEvent"
  ADD CONSTRAINT "UserAdministrationEvent_role_change_shape_check"
  CHECK (
    (
      "action" = 'ROLE_CHANGED'
      AND "previousRole" IS NOT NULL
      AND "nextRole" IS NOT NULL
      AND "previousRole" <> "nextRole"
    )
    OR (
      "action" IN ('DEACTIVATED', 'REACTIVATED')
      AND "previousRole" IS NULL
      AND "nextRole" IS NULL
    )
  ),
  ADD CONSTRAINT "UserAdministrationEvent_reason_check"
  CHECK ("reason" IS NULL OR length(btrim("reason")) BETWEEN 1 AND 500);

ALTER TABLE "ReaderAccessEvent"
  ADD CONSTRAINT "ReaderAccessEvent_page_number_check"
  CHECK ("pageNumber" IS NULL OR "pageNumber" >= 1),
  ADD CONSTRAINT "ReaderAccessEvent_trace_fingerprint_check"
  CHECK ("traceFingerprint" IS NULL OR "traceFingerprint" ~ '^[0-9a-f]{64}$'),
  ADD CONSTRAINT "ReaderAccessEvent_fact_shape_check"
  CHECK (
    (
      "eventType" = 'VIEWER_OPENED'
      AND "pageNumber" IS NULL
      AND "traceFingerprint" IS NULL
      AND "reasonCode" IS NULL
      AND "riskLevel" = 'NONE'
    )
    OR (
      "eventType" = 'PAGE_SERVED'
      AND "pageNumber" IS NOT NULL
      AND "bookFileId" IS NOT NULL
      AND "traceFingerprint" IS NOT NULL
      AND "reasonCode" IS NULL
      AND "riskLevel" = 'NONE'
    )
    OR (
      "eventType" = 'PAGE_DENIED'
      AND "traceFingerprint" IS NULL
      AND "reasonCode" IN ('ACCESS_DENIED', 'DOCUMENT_UNAVAILABLE', 'PAGE_OUT_OF_RANGE', 'DEPENDENCY_UNAVAILABLE')
      AND "riskLevel" IN ('NONE', 'LOW')
    )
    OR (
      "eventType" = 'RATE_LIMITED'
      AND "traceFingerprint" IS NULL
      AND "reasonCode" IN ('RATE_LIMIT_EXCEEDED', 'CONCURRENCY_LIMIT_EXCEEDED', 'DEPENDENCY_UNAVAILABLE')
      AND "riskLevel" IN ('LOW', 'MEDIUM', 'HIGH')
    )
    OR (
      "eventType" = 'SCRAPE_SUSPECTED'
      AND "traceFingerprint" IS NULL
      AND "reasonCode" IN ('PAGE_ENUMERATION', 'IMPOSSIBLE_READING_RATE', 'REPEATED_INVALID_PAGE', 'PARALLEL_SESSION_ABUSE')
      AND "riskLevel" IN ('MEDIUM', 'HIGH')
    )
  );

ALTER TABLE "SystemSettings"
  ADD CONSTRAINT "SystemSettings_singleton_check" CHECK ("id" = 'default'),
  ADD CONSTRAINT "SystemSettings_library_name_check" CHECK (length(btrim("libraryName")) BETWEEN 1 AND 120),
  ADD CONSTRAINT "SystemSettings_default_locale_check" CHECK ("defaultLocale" ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  ADD CONSTRAINT "SystemSettings_support_email_check" CHECK (
    "supportEmail" IS NULL
    OR (
      length("supportEmail") <= 254
      AND "supportEmail" ~ '^[^[:space:]@]+@[^[:space:]@]+$'
    )
  ),
  ADD CONSTRAINT "SystemSettings_reader_notice_check" CHECK (
    "readerNotice" IS NULL OR length(btrim("readerNotice")) BETWEEN 1 AND 500
  );

-- Immutable audit facts cannot be rewritten or deleted after insertion.
CREATE FUNCTION "reject_phase7_audit_mutation"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'P0001';
END;
$$;

CREATE TRIGGER "UserAdministrationEvent_append_only"
BEFORE UPDATE OR DELETE ON "UserAdministrationEvent"
FOR EACH ROW EXECUTE FUNCTION "reject_phase7_audit_mutation"();

CREATE TRIGGER "ReaderAccessEvent_append_only"
BEFORE UPDATE OR DELETE ON "ReaderAccessEvent"
FOR EACH ROW EXECUTE FUNCTION "reject_phase7_audit_mutation"();

-- Ensure a valid singleton exists for upgrades before the application seed runs.
INSERT INTO "SystemSettings" ("id", "libraryName", "defaultLocale", "updatedAt")
VALUES ('default', 'LIBIF', 'vi', CURRENT_TIMESTAMP);
