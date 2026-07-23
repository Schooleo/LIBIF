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

- Root scripts: `dev`, `build`, `lint`, `test`, `openapi:generate`, `test:e2e`, `db:migrate`, and `db:seed`.
- API scripts now include dedicated worker entry points: `start:worker` and `dev:worker` in addition to Nest HTTP start/build/test scripts.
- Web scripts provide Next dev/build, generated API type refresh, ESLint, and Vitest.
- Prisma generation lives in `apps/api` and is part of API prebuild/pretest flows.
- The Makefile still wraps install, infra, database, lint, build, and test tasks.

## Framework and dependency baseline

- Web: Next.js 16.2.x, React 19.2.x, TypeScript 6.0.x, Vitest, Testing Library.
- API: NestJS 11.1.x, Prisma 7.8.x, `@nestjs/swagger`, BullMQ, AWS S3 client, Multer, class-validator, and class-transformer.
- OCR/processing adapter: the current worker binds `OCR_ENGINE` to `PdftotextOcrEngineAdapter` inside `ProcessingModule`.

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
- `AccessModule` owns reader/staff access decisions plus protected stream/download delivery for active files.
- `ReaderModule` owns reader library, bookmarks, and reading-progress persistence.
- `ReportingModule` owns read-only dashboard aggregation.
- `TaxonomyModule` owns staff selector contracts and starter admin category/tag management.
- `BooksModule` remains a compatibility-only intake/list boundary and should not regain primary ownership.

## Database and persistence baseline

- Prisma models include `Book`, `BookFile`, `ProcessingJob`, `ProcessingArtifact`, `ApprovalReview`, `Notification`, `BookAuditEvent`, reader progress/bookmarks, auth/session models, and taxonomy joins.
- `ProcessingJob` is now file-scoped through `bookFileId`, with lineage fields `attemptNumber`, `retryOfJobId`, and supersession markers.
- `ApprovalReview` is file/job-scoped and keeps `round`, `reason`, `requestedChanges`, `decidedAt`, and `supersededAt`.
- `ProcessingArtifact` persists extracted text or OCR artifacts with bucket/object-key identity and metadata.
- Notifications are now durable in Prisma instead of process-local memory.
- PostgreSQL remains the single source of truth; no frontend code reads the database directly.

## Queue, worker, and storage boundary

- `ProcessingQueue` publishes BullMQ jobs on the `pdf-processing` queue when `REDIS_URL` is configured.
- `worker.main.ts` boots a Nest application context for background processing work.
- `ProcessingProcessor` claims queued jobs, updates lifecycle progress, extracts text through the OCR port, stores artifact objects through `StorageService`, and creates pending approval rounds on success.
- `StorageService` remains the only storage boundary; browsers never receive bucket credentials.
- Protected reading/downloading goes through `AccessModule`, which resolves the active file and streams the PDF through the API.

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

1. `ProcessingProcessor` is provided inside `ProcessingModule`, which means the HTTP application and the dedicated worker bootstrap currently share the same worker provider boundary instead of isolating worker startup cleanly.
2. The repository has no `test:worker` command or infrastructure-backed proof covering Redis delivery, MinIO input/output, PostgreSQL state, duplicate delivery, cancellation, supersession, and a deterministic OCR fixture.
3. `PdftotextOcrEngineAdapter` returns synthetic `[OCR Processed]` text after extraction errors, so the current fallback can falsely report OCR success and does not satisfy the Phase 6 OCR gate.
4. `APPROVAL_REQUESTED` is part of the audit/reporting contract, but the merged processing/approval path does not emit it.
5. There is still no dedicated correction-history or resubmission endpoint family; correction work is expressed through generic document edit, replace-file, and submit-processing commands.
6. Approval currently exposes two publish-like commands (`approve` and `approve-and-publish`) without a separate persisted non-published approved state.
7. Access-token generation is request-time string construction; there is no persisted token ledger or revocation model beyond document-status checks and token-shape validation.
8. `BooksModule` remains as a live compatibility surface and continues to duplicate part of the intake boundary.

## Migration strategy status

1. Phase 1 foundations remain in place: semantic tokens and shared UI primitives.
2. Phase 2 route shells, auth/session boundary scaffolding, and generated-contract tooling remain the integration base.
3. Phase 3 authentication and password-reset flows remain the current auth baseline.
4. Phase 4 reader/access/catalog/dashboard foundations remain merged.
5. Phase 5 document lifecycle, taxonomy selectors, upload boundary, and persisted workflow tables remain the basis for current Phase 6 work.
6. Current Phase 6 code adds the worker bootstrap, persisted notification reads, approval commands, processing lineage/artifacts, and runtime correction loop reuse.
7. Member D completed contract regeneration, reporting activity, and staff unread-count integration. Phase 6 closure remains blocked on the worker/OCR evidence gaps listed above, not on a new architectural split.

## Anti-fragmentation decisions

- Keep one NestJS application codebase and one PostgreSQL database.
- Do not let Next.js talk directly to PostgreSQL, Redis, BullMQ, or object storage.
- Keep worker execution in the same repository and shared module graph, even if the startup boundary still needs cleanup.
- Preserve module ownership through exported services and controller contracts instead of cross-reading tables from unrelated UI code.
