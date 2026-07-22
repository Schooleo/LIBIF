# Architecture Alignment

Last updated: 2026-07-22

## Current repository structure

- Root npm workspace: `package.json` declares `packages/shared`, `apps/api`, and `apps/web`.
- Web application: `apps/web` uses Next.js, React, TypeScript, App Router files under `apps/web/app`, components under `apps/web/components`, and Vitest tests under `apps/web/tests`.
- API application: `apps/api` uses NestJS modules under `apps/api/src/modules` and Prisma under `apps/api/prisma`.
- Shared package: `packages/shared/src/index.ts` exports shared TypeScript types for cross-package use, but the web API response surface now consumes generated OpenAPI types from `apps/web/lib/generated/api-types.ts`.
- Infrastructure: `docker-compose.yml`, `docker-compose.debug.yml`, and `docker/pgadmin/servers.json` provide local PostgreSQL, Redis, MinIO, and debug tooling.
- Original PDFs under root `docs/` are source/product references; AI planning and implementation docs are maintained under `ai_artifacts/docs/`.

## Current scripts and quality gates

- Root scripts: `dev`, `build`, `lint`, `test`, `test:e2e`, `db:migrate`, `db:seed`, `openapi:generate`.
- Web scripts: `next dev`, shared prebuild + `next build`, generated API type refresh, ESLint over `app`, `components`, `lib`, and `vitest run`.
- API scripts: Nest build/dev/start, OpenAPI JSON generation, ESLint, Jest unit tests, Jest e2e tests, Prisma migration/seed/generate.
- Makefile wraps install, infra, debug, database, build, lint, test, e2e, and full `verify`.

## Framework and dependency baseline

- Web: Next.js 16.2.x, React 19.2.x, TypeScript 6.0.x, Vitest, Testing Library.
- API: NestJS 11.1.x, `@nestjs/swagger`, Prisma 7.8.x, PostgreSQL driver, AWS SDK S3 client, BullMQ, class-validator/class-transformer, Multer.
- Shared: TypeScript package retained for cross-package TypeScript types; web response DTOs are generated from OpenAPI.

## Current route and component baseline

- Current route groups: `apps/web/app/(reader)`, `apps/web/app/(admin)`, and `apps/web/app/(auth)`.
- Current routes include `/`, `/catalogue`, `/catalog` compatibility redirect, reader library/history/bookmarks and document-view routes, `/admin/documents` with detail/edit/new flows, processing/approval/notification routes, taxonomy routes, `/admin/dashboard`, and authentication/access routes. `/admin/books` remains compatibility-only and is not exposed in primary staff navigation.
- The root layout owns only document shell/font setup; role-aware navigation now lives in Reader/Admin/Auth shells.
- Phase 1 styling now uses semantic tokens and shared CSS in `apps/web/styles/`, imported from `apps/web/app/globals.css`.
- Current book intake components under `apps/web/components/book-intake` have been migrated to shared Phase 1 primitives while preserving existing behavior.

## Current API/module baseline

- `AppModule` imports the integrated domain modules, including Phase 5 `DocumentsModule`, `UploadModule`, `ApprovalModule`, and `TaxonomyModule` alongside reader, access, processing, and notifications.
- Current endpoints include:
  - `POST /api/auth/register`
  - `POST /api/auth/sign-in`
  - `POST /api/auth/sign-out`
  - `GET /api/auth/session`
  - `POST /api/auth/password-reset-requests`
  - `POST /api/auth/password-resets`
  - `POST /api/admin/books/intake`
  - `GET /api/admin/books`
  - `GET /api/categories`
  - `GET /api/taxonomy/categories`
  - `GET /api/taxonomy/tags`
  - `POST/PATCH /api/admin/categories[/:id]`
  - `POST/PATCH /api/admin/tags[/:id]`
  - `GET/PATCH/POST /api/documents[/:id]` metadata, submit-processing, and replacement operations
  - `POST/GET /api/uploads[/:id]` plus cancel/retry operations
  - `GET/POST /api/admin/processing/jobs[/:id]` queue, status, advance, retry, and cancel operations
  - `GET /api/admin/approvals[/:id]`
  - `GET/PATCH /api/notifications[/:id]`
  - reader library/history/bookmark/progress and access decision/token endpoints
  - `GET /api/catalog/books`
  - `GET /api/isbn/:isbn`
  - health endpoints under `HealthModule`
- `AuthModule` owns reader registration, email/password sign-in, sign-out, database-backed sessions, password-reset tokens, role guard scaffolding, and `GET /api/auth/session`. Development auth headers remain available only when both API and web dev-auth flags opt in outside production, so admin UI gates fail closed by default.
- `BooksService` currently owns intake persistence and coordinates Prisma, storage, and processing queue; admin book routes are now guarded by the Auth boundary.
- `CatalogService` currently owns category reads and public published-book list reads.
- `TaxonomyService` owns stable staff category/tag options plus Admin-only starter create/edit rules; deletion/reassignment/merge remain deferred risky workflows.
- `DocumentsService` and `UploadService` own the Phase 5 document metadata/file lifecycle boundary and coordinate storage plus processing queue creation.
- `ProcessingService` owns persisted transition/read foundations and `ApprovalService` owns current approval queue/detail reads. `NotificationsService` still uses process-local state despite the Prisma model; persistence, worker execution, approval commands, and the correction loop remain Phase 6.

## Database layer

- Prisma schema currently models `User`, `UserSession`, `PasswordResetToken`, `Book`, `BookFile`, `Author`, `BookAuthor`, `Category`, `Tag`, `BookTag`, `ProcessingJob`, `ProcessingArtifact`, `ReadingProgress`, `Bookmark`, `Notification`, `BookAuditEvent`, and `ApprovalReview`.
- Current enums: `UserRole`, `BookStatus`, `ProcessingJobStatus`, `ProcessingArtifactKind`, `TextExtractionMethod`, `BookFileStatus`, `ReadingProgressStatus`, `NotificationType`, `NotificationStatus`, `ApprovalReviewStatus`, and `BookAuditAction`.
- Phase 5 schema foundation migration `20260721114643_phase5_domain_foundations` fills the persistence gap that Phase 4 lanes had to work around: reading state/bookmarks, notifications, approval reviews, audit events, processing progress timestamps/percent, and file version/status metadata.
- Phase 6 foundation migration `20260722062955_phase6_processing_foundation` backfills exact file/retry/review lineage, replaces generic failure encodings with `CANCELLED`/`SUPERSEDED`, adds durable artifact metadata, and installs partial uniqueness plus range/identity constraints. OCR consumption and notification persistence remain later Phase 6 work.
- PostgreSQL is the configured provider.
- Future catalogue search must add authoritative backend pagination/filtering/sorting and `pg_trgm` behavior; no direct frontend database access is allowed.

## Object-storage boundary

- `StorageService` uses an S3-compatible client configured from environment variables.
- Uploads write private PDF objects and store bucket/object keys, not public URLs.
- Future reader access must be authorized through NestJS and return short-lived access grants/presigned URLs only for active reading; Next.js must never receive storage credentials.

## Queue/worker boundary

- `ProcessingQueue` wraps BullMQ and adds `book-uploaded` jobs with three attempts when `REDIS_URL` is configured.
- No worker entry point exists yet; Phase 6 must add an independently runnable consumer for Validation -> text extraction/OCR -> indexing/finalization. Manual `advance` is a Phase 5 simulation, not OCR evidence.
- Phase 5 closure repairs route intake/replacement/requeue through authenticated API adapters. D6-000 now preserves superseded jobs/reviews as file-scoped history and enforces only one active file, current job, and pending review per document.
- Browser code must use REST status endpoints and bounded polling; it must never connect to Redis/BullMQ.

## Event ownership

- Upload completion currently passes a `BookUploadedEvent`-shaped payload to `ProcessingQueue` after database persistence.
- Future event handlers must be idempotent, past-tense facts, and must not contain UI concerns.
- Catalog approval/correction and notification side effects must coordinate through exported services or internal events, not cross-module table reads.

## Target module boundaries

- **Auth module:** authentication, registration, sessions, permissions, user administration, role changes, account deactivation.
- **Upload module:** PDF intake, validation, storage coordination, file replacement, upload lifecycle.
- **Catalog module:** metadata, ISBN enrichment, public catalogue search, and approval/correction document integration.
- **Taxonomy module:** staff category/tag option contracts, starter Admin management, and later guarded risky taxonomy workflows.
- **Reader module:** reading authorization, presigned access, bookmarks, continue-reading, reading history.
- **Processing module:** pipeline jobs, stage progress, failures, retry history, workers.
- **Notifications capability:** event-driven records and authorized action links, without duplicating workflow truth.
- **Reporting read layer:** query services over approved module-owned data; no ad hoc frontend database access.

## Architecture gaps after Phase 5 integration

1. Processing worker entry points, durable OCR artifacts, and full retry/status lineage remain Phase 6, although guarded transition/status/retry/cancel foundations now exist.
2. Approval decision commands, correction/resubmission, notification persistence/fanout, and richer action links remain Phase 6.
3. The legacy `BooksModule` intake remains available only as a compatibility surface; it is no longer exposed in primary staff navigation and should be retired through a dedicated API/data migration.
4. Auth-adjacent administration remains deferred: staff provisioning UX, role changes, account deactivation, MFA/OAuth, production email provider integration, throttling, and security settings.
5. Later batches must keep OpenAPI decorators and generated clients current as contracts expand.
6. Remaining data gaps include report export jobs and full-text/search structures.

The detailed Phase 6 execution contract is `ai_artifacts/plans/plan-phase-6-processing-approval-correction-notifications-2026-07-22.md`.

## Design inconsistencies and implementation risks

- `institutional_precision` and `libif_system` are design guidance references.
- Generated Tailwind/HTML is not production architecture and must not be copied wholesale.
- `action_notification_detail` has a known horizontal overflow/clipping risk to correct during Batch 5 implementation.

## Migration strategy

1. Phase 1 completed: semantic tokens and shared components are in place without changing business behavior.
2. Phase 2 completed: role-aware Next.js route groups/layouts, admin session gating, auth/session boundary scaffold, NestJS OpenAPI generation, and typed frontend API client are in place.
3. Phase 3 completed: production auth/access foundation, persisted sessions, password reset, auth screens, secure cookie transport, and generated auth contracts are in place.
4. Phase 4 completed: reader/access/catalog/processing/notification/dashboard foundations and the admin dashboard read model are merged.
5. Phase 5 starts from a migration-first schema foundation, then completes document lifecycle, upload, metadata, taxonomy selectors, processing transition hooks, and protected viewer handoff.
6. Move current intake behavior behind Upload/Catalog boundaries while preserving existing endpoint behavior until the new contracts are verified.
7. Add processing workers and status endpoints before processing queue screens.
8. Use audit/event records before approval/correction, taxonomy risky actions, and user administration screens.

## Anti-fragmentation decisions

- Keep one NestJS application and one PostgreSQL database.
- Do not split admin, processing, reporting, or reader into separate backend services.
- Do not let Next.js access PostgreSQL, Redis, BullMQ, S3/MinIO, or Tesseract directly.
- Cross-module coordination must go through exported application services or internal events.
- Preserve the existing monorepo unless a later plan proves a change is necessary.

## Future implementation file targets

- Phase 1 added `apps/web/components/ui`, `apps/web/components/layout`, `apps/web/components/domain`, `apps/web/styles`, component tests, and an isolated component catalogue.
- Phase 2 added route groups under `apps/web/app/(auth)`, `apps/web/app/(reader)`, `apps/web/app/(admin)`, typed API client files under `apps/web/lib`, and NestJS OpenAPI setup under `apps/api/src/openapi*` plus `apps/api/openapi/libif-api.json`.
- Phase 3 expanded `apps/api/src/modules/auth` into the production auth/access foundation; backend follow-up likely adds `apps/api/src/modules/reader`, a dedicated upload boundary, expanded `processing`, and reporting/notification capabilities.
