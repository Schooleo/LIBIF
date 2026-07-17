# LIBIF

This repository implements the first MVP vertical slice for **LIBIF**: **Digital Book Intake**.

A librarian can upload a scanned PDF, save metadata, assign category/tags, and create persistent book/file/job records. The feature covers:

- **Frontend:** Next.js admin intake form, upload progress, ISBN lookup, admin list, public catalog proof.
- **Backend:** NestJS modular API for intake, categories/catalog, ISBN lookup, storage, and processing queue scaffold.
- **Database:** PostgreSQL schema via Prisma for books, files, authors, categories, tags, users, and processing jobs.
- **Storage/queue:** MinIO-compatible private object storage and Redis/BullMQ queue producer boundary.

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

API runs on `http://localhost:3001` and web runs on the Next.js dev port.

Seed users are development-only:

- `admin@libif.local`
- `librarian@libif.local`

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

## API contract

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
npm run lint
npm test
npm run test:e2e
npm run build
```

For a manual smoke test:

1. Start Docker services and run migrations/seeds.
2. Open `/admin/books/new`.
3. Upload `apps/api/test/fixtures/sample.pdf` and metadata.
4. Confirm the success panel shows `PENDING_PROCESSING` and a queued processing job.
5. Open `/admin/books` and confirm the record exists.
6. Confirm `/catalog` does not show pending books.

## Follow-up features

- OCR/compression workers for queued processing jobs.
- Approval workflow from pending to published/rejected.
- Secure PDF reader with presigned URLs and reading-progress mutation.
- Full catalog search and full-text OCR indexing.
- Management dashboard metrics.
