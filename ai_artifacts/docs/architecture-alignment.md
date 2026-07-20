# Architecture Alignment

Generated: 2026-07-20 08:47:25Z

## Current repository structure

- Root npm workspace: `package.json` declares `packages/shared`, `apps/api`, and `apps/web`.
- Web application: `apps/web` uses Next.js, React, TypeScript, App Router files under `apps/web/app`, components under `apps/web/components`, and Vitest tests under `apps/web/tests`.
- API application: `apps/api` uses NestJS modules under `apps/api/src/modules` and Prisma under `apps/api/prisma`.
- Shared package: `packages/shared/src/index.ts` currently exports TypeScript DTO types used by both web and API-adjacent code.
- Infrastructure: `docker-compose.yml`, `docker-compose.debug.yml`, and `docker/pgadmin/servers.json` provide local PostgreSQL, Redis, MinIO, and debug tooling.
- Existing PDFs under `docs/` are source/product references; Phase 0 markdown docs are now maintained alongside them.

## Current scripts and quality gates

- Root scripts: `dev`, `build`, `lint`, `test`, `test:e2e`, `db:migrate`, `db:seed`.
- Web scripts: `next dev`, `next build`, ESLint over `app`, `components`, `lib`, and `vitest run`.
- API scripts: Nest build/dev/start, ESLint, Jest unit tests, Jest e2e tests, Prisma migration/seed/generate.
- Makefile wraps install, infra, debug, database, build, lint, test, e2e, and full `verify`.

## Framework and dependency baseline

- Web: Next.js 16.2.x, React 19.2.x, TypeScript 6.0.x, Vitest, Testing Library.
- API: NestJS 11.1.x, Prisma 7.8.x, PostgreSQL driver, AWS SDK S3 client, BullMQ, class-validator/class-transformer, Multer.
- Shared: TypeScript package with DTO types.

## Current route and component baseline

- Current routes: `/`, `/catalog`, `/admin/books`, `/admin/books/new`.
- Current root layout uses one global navigation in `apps/web/app/layout.tsx`.
- Current CSS in `apps/web/app/globals.css` uses raw hex values, global element selectors, hard-coded radii, and a general `.card`/`.grid` pattern.
- Current book intake components are `BookIntakeForm`, `CategoryTagFields`, `MetadataFields`, and `PdfDropzone` under `apps/web/components/book-intake`.

## Current API/module baseline

- `AppModule` imports `DatabaseModule`, `StorageModule`, `ProcessingModule`, `BooksModule`, `CatalogModule`, `IsbnModule`, and `HealthModule`.
- Current endpoints include:
  - `POST /api/admin/books/intake`
  - `GET /api/admin/books`
  - `GET /api/categories`
  - `GET /api/catalog/books`
  - `GET /api/isbn/:isbn`
  - health endpoints under `HealthModule`
- `BooksService` currently owns intake persistence and coordinates Prisma, storage, and processing queue.
- `CatalogService` currently owns category reads and public published-book list reads.

## Database layer

- Prisma schema currently models `User`, `Book`, `BookFile`, `Author`, `BookAuthor`, `Category`, `Tag`, `BookTag`, and `ProcessingJob`.
- Current enums: `UserRole`, `BookStatus`, `ProcessingJobStatus`.
- PostgreSQL is the configured provider.
- Future catalogue search must add authoritative backend pagination/filtering/sorting and `pg_trgm` behavior; no direct frontend database access is allowed.

## Object-storage boundary

- `StorageService` uses an S3-compatible client configured from environment variables.
- Uploads write private PDF objects and store bucket/object keys, not public URLs.
- Future reader access must be authorized through NestJS and return short-lived access grants/presigned URLs only for active reading; Next.js must never receive storage credentials.

## Queue/worker boundary

- `ProcessingQueue` wraps BullMQ and adds `book-uploaded` jobs with three attempts when `REDIS_URL` is configured.
- No worker entry point was found during Phase 0 inventory; later Processing work must add independently testable processors for Validation -> Compression -> OCR Text -> Search Indexing.
- Browser code must use REST status endpoints and bounded polling; it must never connect to Redis/BullMQ.

## Event ownership

- Upload completion currently passes a `BookUploadedEvent`-shaped payload to `ProcessingQueue` after database persistence.
- Future event handlers must be idempotent, past-tense facts, and must not contain UI concerns.
- Catalog approval/correction and notification side effects must coordinate through exported services or internal events, not cross-module table reads.

## Target module boundaries

- **Auth module:** authentication, registration, sessions, permissions, user administration, role changes, account deactivation.
- **Upload module:** PDF intake, validation, storage coordination, file replacement, upload lifecycle.
- **Catalog module:** metadata, ISBN enrichment, catalogue search, taxonomy, tags, approval/correction workflow.
- **Reader module:** reading authorization, presigned access, bookmarks, continue-reading, reading history.
- **Processing module:** pipeline jobs, stage progress, failures, retry history, workers.
- **Notifications capability:** event-driven records and authorized action links, without duplicating workflow truth.
- **Reporting read layer:** query services over approved module-owned data; no ad hoc frontend database access.

## Architecture gaps to resolve after Phase 0

1. Auth and Reader modules are not yet present as first-class modules.
2. Upload ownership is currently folded into `BooksModule` rather than a separate Upload module/application service boundary.
3. Frontend API client is hand-written and not generated from or validated against OpenAPI.
4. OpenAPI generation/decorators are not currently established in the inspected source.
5. Current web styling uses raw tokens and global selectors rather than semantic CSS variables/Tailwind tokens.
6. Current root navigation is placeholder-style and not role-aware.
7. Processing queue exists, but worker entry points and stable UI processing stages are not implemented.
8. Processing status enum is infrastructure-oriented (`QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`) and must map to stable UI domain states (`queued`, `validating`, `compressing`, `performing_ocr`, `indexing`, `retrying`, `completed`, `failed`, `cancelled`).
9. Current Prisma schema lacks audit records, approval/correction records, notification records, reading state, bookmarks, report export jobs, file versioning, and full-text/search structures.
10. Admin/Reader route groups and nested layouts are not yet implemented.

## Design inconsistencies and implementation risks

- Stitch count mismatch: prompt states 80 first-level folders; actual inventory is 82, including three reference/extra folders.
- `institutional_precision` and `libif_system` lack screenshots and generated HTML; use them as design guidance only.
- Generated Tailwind/HTML is not production architecture and must not be copied wholesale.
- `action_notification_detail` has a known horizontal overflow/clipping risk to correct during Batch 5 implementation.
- Current web CSS uses non-canonical colors (`#155eef`, `#f7f7fb`, etc.) that conflict with canonical LIBIF tokens.

## Migration strategy

1. Phase 1: introduce semantic tokens and shared components without changing business behavior.
2. Phase 2: add role-aware Next.js route groups/layouts and typed OpenAPI-backed API client.
3. Later batches: move current intake behavior behind Upload/Catalog boundaries while preserving existing endpoint behavior until the new contracts are verified.
4. Add Auth and Reader modules before protected routes rely on them.
5. Add processing workers and status endpoints before processing queue screens.
6. Add audit/event records before approval/correction, taxonomy risky actions, and user administration screens.

## Anti-fragmentation decisions

- Keep one NestJS application and one PostgreSQL database.
- Do not split admin, processing, reporting, or reader into separate backend services.
- Do not let Next.js access PostgreSQL, Redis, BullMQ, S3/MinIO, or Tesseract directly.
- Cross-module coordination must go through exported application services or internal events.
- Preserve the existing monorepo unless a later plan proves a change is necessary.

## Future implementation file targets

- Phase 1 likely adds `apps/web/components/ui`, `apps/web/components/layout`, `apps/web/components/domain`, `apps/web/styles` or equivalent token files, and component tests/stories.
- Phase 2 likely adds route groups under `apps/web/app/(auth)`, `apps/web/app/(reader)`, `apps/web/app/(admin)`, typed API client package/files, and NestJS OpenAPI setup.
- Backend follow-up likely adds `apps/api/src/modules/auth`, `apps/api/src/modules/upload`, `apps/api/src/modules/reader`, expanded `processing`, and reporting/notification capabilities.
