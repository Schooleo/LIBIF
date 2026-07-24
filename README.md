# LIBIF

LIBIF is a TypeScript monorepo for an integrated digital-library application. The current development build includes the Phase 7 Wave 4 protected Reader POC integration:

- **Frontend:** Next.js App Router, shared design tokens/components, reader/admin/auth shells, digital book intake, public catalogue proof, and authentication screens.
- **Backend:** NestJS modular API for auth/access, intake, categories/catalog, ISBN lookup, private storage, approval/notifications, and an isolated BullMQ processing worker.
- **Database:** PostgreSQL via Prisma for users, sessions, password reset tokens, books, files, authors, categories, tags, and processing jobs.
- **Contracts:** OpenAPI generation plus generated frontend API path types.
- **Storage/queue:** MinIO-compatible private object storage, Redis/BullMQ delivery, Poppler PDF extraction/rendering, and local Tesseract.js English/Vietnamese OCR.

## Current dev progress

| Phase | Status | Notes |
|---|---|---|
| Phase 1 — Design tokens/shared components | Complete | Semantic CSS tokens, shared UI primitives, layout shells, domain foundations, component tests. |
| Phase 2 — Route shells/auth boundary/API client | Complete | Reader/Admin/Auth route groups, admin gating, OpenAPI generation, typed API adapters. |
| Phase 3 — Authentication/access | Complete | Register, sign-in/out, DB-backed sessions, HTTP-only cookie, password reset flow, standard error envelope, auth routes. |
| Phase 4 — Reader/access/catalog foundations | Complete | Reader state, protected access, catalogue and dashboard foundations. |
| Phase 5 — Document lifecycle and taxonomy | Complete | Intake, file versioning, metadata, taxonomy, and persisted workflow schema. |
| Phase 6 — Processing and approval loop | Complete | Real worker/OCR, approval/correction, durable notifications, reporting, and worker integration gate. |
| Phase 7 — Reader POC and admin operations | In progress | Waves 1–4 complete. Published catalogue/detail, server-watermarked canvas pages, Reader PDF denial, persisted reader state, enforcement, alerts, and Reader-access reporting are integrated; Wave 5 administration remains. |

The canonical execution plan is `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md`; the Wave 4 integration result is recorded in `ai_artifacts/docs/phase-7-wave-4-p0-integration.md`. The protected Reader draws individually authorized, server-watermarked raster pages onto canvas instead of receiving the source PDF. Persisted bookmark/progress state hydrates through Reader APIs, and access is audited with Redis-backed scrape/rate/concurrency enforcement plus deduplicated staff alerts. This is deterrence and traceability—not absolute DRM or screenshot prevention—as documented in `ai_artifacts/research/document-drm-and-screenshot-prevention-2026-07-23.md`.

## Local setup

```bash
npm install
cp .env.example .env
make infra-up
make db-migrate
make db-seed
make dev
```

Equivalent npm/Docker commands still work if you do not use `make`:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
# In another terminal:
npm run dev:worker -w apps/api
```

The API worker host also requires Poppler commands (`pdfinfo`, `pdftotext`, and `pdftoppm`). Tesseract.js and the English/Vietnamese language models are installed through npm and do not fetch language data at runtime.

OCR stays inside the LIBIF deployment boundary: Redis jobs contain database identifiers only, the worker resolves private object-storage keys from PostgreSQL, extracted text is stored only as a private artifact object, and PostgreSQL metadata does not duplicate a plaintext preview. Temporary PDF/page files use private permissions, are removed after every outcome, and abandoned worker directories are purged on worker startup.

API runs on `http://localhost:3001` and web runs on the Next.js dev port, usually `http://localhost:3000`.

### Self-contained local Docker stack

`docker-compose.local.yml` starts PostgreSQL, Redis, MinIO, migration and seed jobs, the API, worker, web app, Nginx, and a shared Tailscale demonstration machine. Tailscale persists its identity in the ignored `./tailscale-data` directory. Nginx shares the Tailscale network namespace and accepts requests exclusively for `libif.local.com`; no LIBIF service publishes a host port.

Set `TAILSCALE_AUTHKEY` in `.env` to a reusable, non-ephemeral auth key and ask teammates to map the Tailscale machine's `tailscale ip -4` address to `libif.local.com` (or publish the same mapping through your shared DNS):

```text
<tailscale-machine-ip> libif.local.com
```

Then build and start the stack:

```bash
make local-up
# or: COMPOSE_PROJECT_NAME=libif-local docker compose -f docker-compose.local.yml up --build -d
```

Teammates then access `http://libif.local.com` through the tailnet: **teammate → shared Tailscale machine → Nginx → LIBIF services**. The API is available only through the same origin at `/api`; PostgreSQL, Redis, MinIO, the API, and worker do not publish host ports. Configure `SMTP_*` in `.env` for Gmail password-reset delivery (Gmail App Password, port `587`, `SMTP_SECURE=starttls`). Stop it with `make local-down`. This stack intentionally uses HTTP and development cookie settings for demonstration, so do not use it as a production deployment.

## Seeded development accounts

`make db-seed` / `npm run db:seed` creates one usable email/password account for each role. These credentials are for local development only.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@libif.local` | `admin libif dev passphrase` |
| Librarian | `librarian@libif.local` | `librarian libif dev passphrase` |
| Reader | `reader@libif.local` | `reader libif dev passphrase` |

You can also use the explicit development-header fallback for local staff workflows by enabling both API and web flags in `.env`:

```env
LIBIF_ENABLE_DEV_AUTH="true"
NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH="true"
NEXT_PUBLIC_LIBIF_DEV_ROLE="LIBRARIAN"
NEXT_PUBLIC_LIBIF_DEV_EMAIL="librarian@libif.local"
```

Valid dev roles are `ADMIN`, `LIBRARIAN`, and `READER`. Keep these flags disabled outside local development.

## Development commands

The repository includes a `Makefile` for common local workflows:

| Command | Purpose |
|---|---|
| `make help` | List all available commands. |
| `make install` | Install npm workspace dependencies. |
| `make infra-up` | Start core Docker services: PostgreSQL, Redis, MinIO. |
| `make infra-down` | Stop core Docker services. |
| `make infra-logs` | Follow core service logs. |
| `make db-migrate` | Apply Prisma migrations. |
| `make db-seed` | Seed development users and starter categories. |
| `make prisma-generate` | Generate Prisma client. |
| `make db-reset` | Reset local DB, run migrations, and seed data. |
| `make dev` | Start the web app, HTTP API, and background OCR worker together. |
| `make api` | Start only the NestJS API dev server. |
| `make web` | Start only the Next.js web dev server. |
| `make worker` | Start only the background PDF/OCR worker in watch mode. |
| `make test-worker` | Run the Redis/MinIO/PostgreSQL/PDF/OCR worker integration gate. |
| `make verify` | Run lint, unit/component tests, API e2e, worker integration, and build. |
| `make clean` | Remove generated build/test artifacts only. |

## Debug tooling: pgAdmin

pgAdmin is intentionally isolated in `docker-compose.debug.yml` so normal development only starts the core services. Start the debug stack with:

```bash
make pgadmin
```

This runs Docker Compose with both files:

```bash
docker compose -f docker-compose.yml -f docker-compose.debug.yml --profile debug up -d
```

Open pgAdmin at `http://localhost:5050` by default. Defaults are configurable in `.env`:

```env
COMPOSE_PROJECT_NAME=libif
PGADMIN_PORT=5050
PGADMIN_DEFAULT_EMAIL="admin@libif.local"
PGADMIN_DEFAULT_PASSWORD="admin"
```

The bundled `docker/pgadmin/servers.json` pre-registers the local Postgres container:

| Field | Value |
|---|---|
| Host | `postgres` |
| Port | `5432` |
| Database | `libif` |
| Username | `library` |
| Password | `library` |

Use `make debug-logs` to follow pgAdmin logs and `make debug-down` to stop only pgAdmin. Use `make infra-down` when you want to stop the core services too.

## Implemented API contract highlights

OpenAPI JSON is generated to `apps/api/openapi/libif-api.json`; frontend path types are generated to `apps/web/lib/generated/api-types.ts`.

Current implemented endpoints include:

- `POST /api/auth/register`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`
- `POST /api/auth/password-reset-requests`
- `POST /api/auth/password-resets`
- `POST /api/admin/books/intake`
- `GET /api/admin/books`
- `GET /api/categories`
- `GET /api/catalog/books`
- `GET /api/isbn/:isbn`

### `POST /api/admin/books/intake`

Multipart form fields:

- `file`: required PDF, max 200MB.
- `metadata`: JSON string:

```json
{
  "isbn": "9780132350884",
  "title": "Clean Code",
  "authors": ["Robert C. Martin"],
  "publisher": "Prentice Hall",
  "publishedYear": 2008,
  "categoryId": "category-id",
  "tags": ["software", "engineering"]
}
```

Success response includes `book.id`, `file.id`, and `processingJob.id`. The DB stores a private object key, not a public PDF URL.

## Verification

```bash
npm run openapi:generate
npm run lint
npm test
npm run build
npm run test:e2e -w apps/api
npm run test:worker -w apps/api
```

Run the background processor separately from the HTTP API:

```bash
npm run build -w apps/api
npm run start:worker -w apps/api
```

For a manual smoke test:

1. Start Docker services and run migrations/seeds.
2. Start the API, web app, and background worker.
3. Open `/sign-in` and sign in as `librarian@libif.local` using the seeded password.
4. Open `/admin/documents/new`.
5. Upload `apps/api/test/fixtures/worker/embedded-text.pdf` with valid metadata.
6. Confirm the worker reaches `PENDING_APPROVAL` and persists an extracted-text artifact.
7. Open `/admin/documents` and confirm the record exists.
8. Confirm `/catalog` does not show the document before publication.
9. Sign out, then confirm staff routes send anonymous users to `/session-expired`.

## Follow-up features

- Production password-reset email provider.
- OCR layout/compression enhancements beyond the current extracted-text artifact.
- Full catalog search and full-text OCR indexing.
- Staff/user administration, role changes, and account deactivation.
- Category reassignment/tag merge safeguards, management reports/CSV, and supported settings.
- Protected Reader accessibility decision and full manual responsive/network smoke evidence.
- Phase 8 integration hardening, accessibility/visual QA, release notes, and demo readiness.

## GitHub Actions CI notifications

Pull requests run the `CI` workflow, which installs npm workspaces, prepares `.env` from `.env.example`, then runs build and test jobs. When that workflow completes for a pull request, `CI Email Notification` sends the result to the PR author through SMTP.

Configure these repository secrets before expecting emails:

| Secret | Purpose |
|---|---|
| `SMTP_HOST` | SMTP server host. |
| `SMTP_PORT` | SMTP server port, usually `587` for STARTTLS or `465` for SSL. |
| `SMTP_USERNAME` | SMTP username. |
| `SMTP_PASSWORD` | SMTP password or app password. |
| `SMTP_FROM` | Sender address, for example `LIBIF CI <ci@example.com>`. |
| `SMTP_SECURE` | Optional: `starttls` (default), `ssl`, or `none`. |
| `CI_RESULTS_FALLBACK_EMAIL` | Optional fallback recipient if the PR author's public or commit email cannot be resolved. |

GitHub may hide user email addresses. The notifier first tries the PR author's public GitHub profile email, then a non-`noreply` commit author email, and skips sending if neither is available and no fallback is configured.
