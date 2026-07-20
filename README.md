# LIBIF

LIBIF is a TypeScript monorepo for an integrated digital-library application. The current development build includes the first MVP vertical slice plus the Phase 1–3 platform foundations:

- **Frontend:** Next.js App Router, shared design tokens/components, reader/admin/auth shells, digital book intake, public catalogue proof, and authentication screens.
- **Backend:** NestJS modular API for auth/access, intake, categories/catalog, ISBN lookup, private storage, and processing-queue producer boundary.
- **Database:** PostgreSQL via Prisma for users, sessions, password reset tokens, books, files, authors, categories, tags, and processing jobs.
- **Contracts:** OpenAPI generation plus generated frontend API path types.
- **Storage/queue:** MinIO-compatible private object storage and Redis/BullMQ queue scaffold.

## Current dev progress

| Phase | Status | Notes |
|---|---|---|
| Phase 1 — Design tokens/shared components | Complete | Semantic CSS tokens, shared UI primitives, layout shells, domain foundations, component tests. |
| Phase 2 — Route shells/auth boundary/API client | Complete | Reader/Admin/Auth route groups, admin gating, OpenAPI generation, typed API adapters. |
| Phase 3 — Authentication/access | Complete | Register, sign-in/out, DB-backed sessions, HTTP-only cookie, password reset flow, standard error envelope, auth routes. |

Next likely product direction is Reader discovery/personal-library work unless staff/user administration is prioritized first.

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
```

API runs on `http://localhost:3001` and web runs on the Next.js dev port, usually `http://localhost:3000`.

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
| `make dev` | Start all workspace dev servers. |
| `make api` | Start only the NestJS API dev server. |
| `make web` | Start only the Next.js web dev server. |
| `make verify` | Run lint, unit/component tests, e2e tests, and build. |
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
```

For a manual smoke test:

1. Start Docker services and run migrations/seeds.
2. Open `/sign-in` and sign in as `librarian@libif.local` using the seeded password.
3. Open `/admin/books/new`.
4. Upload `apps/api/test/fixtures/sample.pdf` and metadata.
5. Confirm the success panel shows `PENDING_PROCESSING` and a queued processing job.
6. Open `/admin/books` and confirm the record exists.
7. Confirm `/catalog` does not show pending books.
8. Sign out, then confirm staff routes send anonymous users to `/session-expired`.

## Follow-up features

- Production password-reset email provider.
- Reader discovery and personal library.
- Secure PDF reader with presigned URLs and reading-progress mutation.
- Upload/Catalog module deepening and document metadata workflows.
- OCR/compression workers and processing status endpoints.
- Approval workflow from pending to published/rejected.
- Full catalog search and full-text OCR indexing.
- Staff/user administration, role changes, and account deactivation.
- Management dashboard metrics.

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
