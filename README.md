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

### Production deployment

LIBIF supports two production layouts:

1. **One Linux VPS:** `docker-compose.production.yml` keeps the Next.js frontend, NestJS API, BullMQ OCR worker, PostgreSQL, authenticated persistent Redis, MinIO, migrations, and a Caddy HTTPS edge together. Copy `.env.production.example` to the ignored `.env.production`, replace every placeholder, point `LIBIF_HOSTNAME` at the VPS, then run `make production-config` and `make production-up`. Only ports 80/443 are published; Caddy automatically provisions and renews the public certificate. See the [free VPS comparison and production runbook](docs/deployment/free-vps.md).
2. **Vercel frontend + Azure backend:** deploy the frontend to Vercel and keep the API, OCR worker, PostgreSQL, Redis, MinIO, migrations, and API HTTPS edge on one Azure Linux VM. `docker-compose.azure.yml` disables the VPS web edge and selects the backend-only model. Bicep provisions the VM and a GitHub OIDC identity; semantic release tags in the strict `vMAJOR.MINOR.PATCH` form (for example, `v1.2.3`) publish matching GHCR images and deploy only after the API and web quality gates pass. Release tags must point to commits already contained in `main`. See the [Azure for Students deployment guide](docs/deployment/azure-students.md).

Vercel supports NestJS, but LIBIF uses Vercel for the Next.js frontend only. The NestJS API and BullMQ OCR worker remain on a container platform with PostgreSQL, Redis, MinIO-compatible private storage, Poppler, and ImageMagick. The worker is a persistent queue consumer and the document pipeline can exceed Vercel Function request, bundle, and payload limits, so adapting only the HTTP controller surface to serverless functions would not produce a complete LIBIF backend deployment.

Create one Vercel project with `apps/web` as its Root Directory and keep **Include source files outside of the Root Directory** enabled so the web workspace can use `packages/shared`. `apps/web/vercel.json` selects Next.js, builds the web workspace from the monorepo root, and disables Vercel's automatic `main` deployment. Preview branches may still use Vercel Git deployments.

The `Production` GitHub Actions workflow is the only automated Vercel/Azure production deployment path. Create and push a strict semantic release tag from a validated `main` commit—for example, `git tag v1.2.3 && git push origin v1.2.3`. The workflow rejects tags with suffixes such as `v1.2.3-beta.1` and tags whose commits are not contained in `main`. It then calls the complete API and web CI workflows—including lint, unit/component tests, API end-to-end tests, worker integration, and production builds—before deploying the tagged frontend to Vercel and the identically tagged backend images to Azure.

Configure these GitHub Actions secrets:

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel access token used by the production workflow. |
| `VERCEL_ORG_ID` | Vercel account or team ID that owns the web project. |
| `VERCEL_WEB_PROJECT_ID` | Vercel project ID for the `apps/web` project. |

Configure `NEXT_PUBLIC_API_BASE_URL` and `INTERNAL_API_BASE_URL` in the Vercel project's Production environment to the externally hosted API URL. Use frontend and API custom hostnames under the same registrable domain (for example, `library.example.edu` and `api.example.edu`) so the API's secure `SameSite=Lax` session cookie remains same-site; a default `*.vercel.app` hostname paired with an unrelated API domain will not preserve credentialed browser sessions. On the API host, set `LIBIF_WEB_BASE_URL` to the production frontend origin and add only intentional preview origins to `LIBIF_CORS_ORIGINS`.

### Self-hosted pre-production staging

`docker-compose.staging.yml` is the presentation and acceptance-test environment. It runs PostgreSQL, authenticated Redis, MinIO, migrations, the API, OCR worker, web app, Nginx, and a persistent Tailscale sidecar on one self-hosted machine. Successful `main` CI publishes the application images only under the full Git commit SHA. `make staging-up` selects the newest successful `main` SHA, verifies that all three GHCR artifacts exist, pins `.env.staging`, pulls those exact images, and starts without a local build. Tailscale Funnel terminates public HTTPS at the node's `*.ts.net` address and forwards only to Nginx's loopback listener; Docker publishes no host ports, and Nginx routes `/api` and web traffic through one browser origin.

Create the private staging environment and replace every placeholder:

```bash
cp .env.staging.example .env.staging
chmod 600 .env.staging
editor .env.staging

# Requires authenticated `gh` and read access to the GHCR packages. This
# replaces the SHA placeholder with the newest complete main release.
make staging-pin-main
make staging-config
make staging-up
make staging-funnel
```

`LIBIF_STAGING_BASE_URL` must exactly match the Funnel origin, normally `https://<TAILSCALE_HOSTNAME>.<tailnet-name>.ts.net`. The tailnet must have MagicDNS, HTTPS certificates, and the Funnel node attribute enabled. Funnel makes staging publicly reachable, so development-header authentication stays disabled, infrastructure credentials and demonstration passwords are required, and only synthetic/non-sensitive documents should be loaded.

```bash
# Optional presentation dataset and page/catalogue indexes.
make staging-seed

# Maintenance for data that already exists in staging.
make staging-reindex-search
make staging-backfill-page-search

# Stop containers while retaining staging and Tailscale identity volumes.
make staging-down
```

Tailscale owns certificate issuance and HTTPS; the former private CA, custom `libif.local.com` mapping, and certificate-export workflow are no longer part of the staging design. See the [self-hosted staging runbook](docs/deployment/staging.md) for Funnel policy, preparation, validation, and teardown.

Image promotion is branch-specific: `dev` publishes only the moving `latest` API, migration, and web tags for a self-hosted development-testing environment; `main` publishes only full-SHA staging tags; semantic Git tags publish only versioned production release tags. Each namespace has one writer, and staging or production Compose paths never reference `latest`.

## Seeded development accounts

`make staging-seed` populates staging with demonstration accounts, documentation PDFs, catalogue search text, and page-level Reader/Approval search data. It reads unique passwords from `.env.staging`; the fixed passwords below remain only as defaults for the non-public developer database created by `make db-seed` / `npm run db:seed`. New processing jobs create page-level data automatically. Run `make staging-backfill-page-search` for PDFs processed before page search was added, or `make staging-reindex-search` to rebuild only the public catalogue projection.

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
| `make staging-config` | Validate the private staging environment, Funnel origin, and Compose model. |
| `make staging-pin-main` | Pin staging to the newest successful `main` SHA whose complete image set exists in GHCR. |
| `make staging-up` | Pull and start the newest successful `main` SHA behind Tailscale Funnel. |
| `make staging-funnel` | Show the active public Funnel route. |
| `make staging-seed` | Migrate, seed presentation accounts/documents, and index staging search data. |
| `make staging-reindex-search` | Rebuild the staging public-catalogue search projection. |
| `make staging-backfill-page-search` | Build page-level search data for existing staging PDFs. |
| `make staging-down` | Stop staging without deleting persistent data or Tailscale identity. |
| `make production-config` | Validate the production Compose file and private environment without starting services. |
| `make production-up` | Build and start the single-host production stack, then wait for health checks. |
| `make production-down` | Stop the production stack without deleting persistent volumes. |
| `make production-logs` | Follow production container logs. |
| `make production-ps` | Show production container and health status. |
| `make azure-config` | Validate the Azure backend-only Compose configuration and private environment. |
| `make azure-down` | Stop the Azure backend stack without deleting persistent volumes. |
| `make azure-logs` | Follow Azure backend container logs. |
| `make azure-ps` | Show Azure backend container and health status. |
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

## GitHub Actions CI and notifications

Pull requests run the API and web CI workflows. Pushes to `dev` run the same gates and publish integration container images. Pushing a valid `vMAJOR.MINOR.PATCH` tag for a commit contained in `main` invokes both workflows through the `Production` workflow and deploys the frontend to Vercel only after every required job succeeds. When `AZURE_DEPLOY_ENABLED=true`, the same tagged revision also publishes backend images under the release tag and full commit SHA, then deploys the release-tagged images to the Azure VM through GitHub OIDC. When either CI workflow completes for a pull request, `CI Email Notification` sends the result to the PR author through SMTP.

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
