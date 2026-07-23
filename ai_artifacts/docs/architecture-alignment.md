# Architecture Alignment

Last updated: 2026-07-23

## Current repository structure

- Root npm workspace: `package.json` declares `packages/shared`, `apps/api`, and `apps/web`.
- Web application: `apps/web` uses Next.js App Router with reader, admin, and auth route groups under `apps/web/app`.
- API application: `apps/api` uses NestJS modules under `apps/api/src/modules` and Prisma under `apps/api/prisma`.
- Shared package: `packages/shared` still exists for cross-package TypeScript code, while frontend API response types are generated into `apps/web/lib/generated/api-types.ts`.
- Infrastructure: `docker-compose.yml` and `docker-compose.debug.yml` provide PostgreSQL, Redis, MinIO, and debug tooling.
- Canonical project artifacts remain under `ai_artifacts/docs/` and `ai_artifacts/plans/`.

## Current scripts and quality gates

- Root scripts: `dev`, `build`, `lint`, `test`, `test:worker`, `openapi:generate`, `test:e2e`, `db:migrate`, and `db:seed`.
- API scripts include dedicated worker entry points (`start:worker`, `dev:worker`) and the infrastructure-backed `test:worker` gate.
- Web scripts provide Next dev/build, generated API type refresh, ESLint, and Vitest.
- Prisma generation lives in `apps/api` and is part of API prebuild/pretest flows.
- The Makefile still wraps install, infra, database, lint, build, and test tasks.

## Framework and dependency baseline

- Web: Next.js 16.2.x, React 19.2.x, TypeScript 6.0.x, Vitest, Testing Library.
- API: NestJS 11.1.x, Prisma 7.8.x, `@nestjs/swagger`, BullMQ, AWS S3 client, Multer, class-validator, and class-transformer.
- OCR/processing adapter: the dedicated `WorkerModule` binds `OCR_ENGINE` to `PdftotextOcrEngineAdapter`; Poppler validates/renders PDFs and local Tesseract.js English/Vietnamese language data performs OCR without a runtime network fetch.

## Current route and component baseline

- Reader routes include catalogue, library, history, bookmarks, protected document viewing, and reader notifications.
- Admin routes include dashboard, documents index/detail/edit/new, processing queue/detail, approvals queue/detail, notifications, categories, tags, and legacy `/admin/books` compatibility screens.
- Auth routes include register, sign-in, forgot-password, reset-password, session-expired, and access-denied flows.
- Shared shells remain split across Reader/Admin/Auth layouts; the root layout owns only app-level setup.
- Staff desktop sidebar and mobile drawer reuse one navigation model and expose the current user's unread-notification count through the existing Notifications link.

## Current module and ownership boundaries

- `AuthModule` owns registration, sign-in/out, persisted session lookup, password-reset issuance/consumption, and role-guard scaffolding.
- `UploadModule` owns canonical initial staff intake, upload-state reads, queued-intake cancel, and queued-intake retry.
- `DocumentsModule` owns staff document detail/list projections, metadata editing, active-file replacement, and processing resubmission for the active file.
- `ProcessingModule` owns queue publication, processing-job reads, retry/cancel/history, worker orchestration, and OCR artifact persistence.
- `ApprovalModule` owns approval review reads and decision commands.
- `NotificationsModule` owns persisted notification reads, unread counts, and read-state updates.
- `AccessModule` owns reader/staff access decisions plus current protected raw-PDF delivery. Phase 7 keeps ownership here while replacing Reader delivery with authorized raster-page manifest/page endpoints.
- `ReaderModule` owns reader library, bookmarks, and reading-progress persistence; Phase 7 adds a one-document personalized-state read rather than defaulting UI state.
- Phase 7 adds a bounded `RenderingModule`, owned by Member C, that exports Poppler raster/watermark behavior to `AccessModule` without owning authorization or HTTP routes.
- `ReportingModule` owns read-only dashboard aggregation.
- `TaxonomyModule` owns staff selector contracts and starter admin category/tag management.
- `BooksModule` remains a compatibility-only intake/list boundary and should not regain primary ownership.

## Database and persistence baseline

- Prisma models include `Book`, `BookFile`, `ProcessingJob`, `ProcessingArtifact`, `ApprovalReview`, `Notification`, `BookAuditEvent`, reader progress/bookmarks, auth/session models, and taxonomy joins.
- `ProcessingJob` is now file-scoped through `bookFileId`, with lineage fields `attemptNumber`, `retryOfJobId`, and supersession markers.
- `ApprovalReview` is file/job-scoped and keeps `round`, `reason`, `requestedChanges`, `decidedAt`, and `supersededAt`.
- `ProcessingArtifact` persists private extracted-text/OCR object identity, checksum, language, page count, and extraction method; plaintext previews are not duplicated in JSON metadata.
- Notifications are now durable in Prisma instead of process-local memory.
- PostgreSQL remains the single source of truth; no frontend code reads the database directly.

## Queue, worker, and storage boundary

- `ProcessingQueue` publishes identifier-only BullMQ jobs on the `pdf-processing` queue when `REDIS_URL` is configured; storage bucket/object keys are resolved from PostgreSQL by the worker and are not copied into Redis payloads or queue logs.
- `worker.main.ts` boots `WorkerModule`, so HTTP `AppModule` does not instantiate a BullMQ consumer.
- `ProcessingProcessor` atomically claims queued jobs, rechecks active file/job state around storage and persistence side effects, extracts text through the OCR port, stores job-scoped artifact objects through `StorageService`, and creates pending approval rounds on success.
- OCR workspaces are process-owned private directories with private PDF/page permissions, normal-path `finally` cleanup, and dead-process/stale-legacy cleanup at worker startup.
- `StorageService` remains the only storage boundary; browsers never receive bucket credentials.
- Current protected reading/downloading goes through `AccessModule`, which resolves the active file and streams the PDF through the API. This is a known POC gap: Phase 7 must stop delivering the source PDF to Reader viewers and render authorized server-side raster pages on canvas instead.

## Reporting read-model boundary

- The librarian dashboard is a read-only aggregate over books, processing jobs, taxonomy, users, recent books, and persisted processing/approval/correction audit facts.
- Activity counts and the ten newest activity rows are projected from `BookAuditEvent`; reporting does not mutate workflow state.
- Reporting remains a consumer of module-owned persistence, not a writer of workflow state.

## Event and coordination boundary

- Upload and resubmission commands enqueue `BookUploadedEvent`-shaped facts for processing.
- Processing success creates approval work and approval-required notifications after durable transaction commits.
- Approval decisions create audit records, mutate document status, and fan out creator notifications.
- Correction requests do not have a separate correction aggregate; they reopen work by reusing document metadata replacement and submit-processing boundaries.
- Cross-module coordination is still service-driven inside the modular monolith rather than through external message infrastructure.

## Current architecture gaps and contract-sensitive risks

1. Worker hosts require Poppler (`pdfinfo`, `pdftotext`, and `pdftoppm`); CI installs and exercises that prerequisite, but deployment images must preserve it.
2. There is still no dedicated correction-history or resubmission endpoint family; correction work is expressed through generic document edit, replace-file, and submit-processing commands.
3. Approval currently exposes two publish-like commands (`approve` and `approve-and-publish`) without a separate persisted non-published approved state.
4. Access-token generation is request-time string construction; there is no persisted token ledger or revocation model beyond document-status checks and token-shape validation.
5. `BooksModule` remains as a live compatibility surface and continues to duplicate part of the intake boundary.
6. Catalogue cards have no functional detail link, and detail/viewer routes scan the first catalogue list page instead of using direct detail contracts.
7. The Reader viewer embeds the raw PDF, exposes a download action, and has a separate hard-coded page tracker that does not control the embedded viewer.
8. Catalogue detail and viewer bookmark controls default to false because they do not hydrate one-document persisted state.
9. Phase 7 D7-000 now supplies `User` lifecycle state, append-only user-administration history, append-only bounded Reader access facts, and typed singleton product settings. Auth enforcement and administration/reporting/settings controllers remain later tasks.
10. Category deletion/reassignment, tag duplicate review/merge, management reporting/CSV, and settings controllers do not yet have runtime routes. Reader-security report and settings DTOs are frozen but are not live endpoints.
11. Settings must distinguish safe database-backed product settings from deployment-owned secrets and security configuration; Phase 7 must not create an undocumented environment override.

## Migration strategy status

1. Phase 1 foundations remain in place: semantic tokens and shared UI primitives.
2. Phase 2 route shells, auth/session boundary scaffolding, and generated-contract tooling remain the integration base.
3. Phase 3 authentication and password-reset flows remain the current auth baseline.
4. Phase 4 reader/access/catalog/dashboard foundations remain merged.
5. Phase 5 document lifecycle, taxonomy selectors, upload boundary, and persisted workflow tables remain the base consumed by the completed Phase 6 workflow and planned Phase 7 work.
6. Phase 6 adds an isolated worker bootstrap, real embedded-text/OCR extraction, persisted notification reads, approval commands, processing lineage/artifacts, and runtime correction-loop reuse.
7. The Phase 6 worker/OCR closure gate is reproducible through `npm run test:worker -w apps/api` and its CI job.
8. Phase 7 follows `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md` and the validated DRM research. Waves 1–2 are complete and recorded in `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`; Reader POC implementation comes next from the frozen catalogue, rendering, access, state, audit, reporting, and settings shapes.
9. Existing Phase 7 admin decisions remain: one schema foundation precedes user administration/settings, risky taxonomy actions remain in `TaxonomyModule`, reporting remains read-only, and exports are bounded synchronous CSV rather than a second worker subsystem.

## Anti-fragmentation decisions

- Keep one NestJS application codebase and one PostgreSQL database.
- Do not let Next.js talk directly to PostgreSQL, Redis, BullMQ, or object storage.
- Keep worker execution in the same repository while preserving the isolated `WorkerModule` startup boundary.
- Preserve module ownership through exported services and controller contracts instead of cross-reading tables from unrelated UI code.
