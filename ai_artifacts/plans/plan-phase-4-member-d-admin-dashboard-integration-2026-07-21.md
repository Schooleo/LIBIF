# Phase 4 Plan — Member D Admin Dashboard and Integration

Mode: `$plan` direct mode  
Owner lane: **Member D — Admin Operations, Taxonomy, Reporting, Settings, and Integration**  
Canonical backlog: `ai_artifacts/docs/team_backlog_80_90_completion.md`  
Planned date: 2026-07-21

## Requirements Summary

Member D's Phase 4 work should support the team-wide Phase 4 goal — reader library and catalog access foundation — without taking over Member A/B/C implementation lanes.

Member D scope for Phase 4:

1. Add a minimal reporting/dashboard read layer that can feed an admin dashboard with real counts available from the existing schema.
2. Add an admin dashboard route/shell that uses shared primitives and exposes counts/status summaries.
3. Handle phase-end integration responsibilities: generated contracts, typed web API adapter updates, and docs/checklist updates after backend surfaces stabilize.
4. Avoid taxonomy CRUD, user management, report exports, and settings implementation in Phase 4 except as read-only counts or future navigation placeholders if explicitly needed.

## Repo Analysis Evidence

- The agent guide requires future agents to read the backlog and skeleton map before implementation (`ai_artifacts/prompts/Agent_Prompt.md:119-129`) and to stay inside the assigned member lane (`ai_artifacts/prompts/Agent_Prompt.md:142-184`).
- Member D owns reporting, taxonomy, users, settings, related admin routes/components, and cross-feature docs/OpenAPI integration (`ai_artifacts/docs/team_backlog_80_90_completion.md:130-155`).
- Phase 4 assigns Member D only dashboard summary shells, OpenAPI/contracts regeneration, and route/API inventory updates (`ai_artifacts/docs/team_backlog_80_90_completion.md:209-213`).
- Phase 4 expected result includes basic real admin counts and generated/documented API contracts (`ai_artifacts/docs/team_backlog_80_90_completion.md:215-226`).
- Merge rules say generated OpenAPI/client updates should happen once near phase end, by Member D or an integrator (`ai_artifacts/docs/team_backlog_80_90_completion.md:157-168`).
- Current API module registration happens in `AppModule.imports`, which already imports Auth, Storage, Processing, Books, Catalog, ISBN, and Health modules (`apps/api/src/app.module.ts:12-26`).
- Current admin route protection allows only `ADMIN` and `LIBRARIAN` in the admin layout (`apps/web/app/(admin)/layout.tsx:9-14`).
- Current admin navigation only links to admin books, new intake, and public catalogue (`apps/web/components/layout/index.tsx:81-85`), so dashboard navigation is missing.
- Existing server API adapter pattern is `fetchX()` in `apps/web/lib/api-server.ts`, using OpenAPI path calls and cookie/dev-auth headers (`apps/web/lib/api-server.ts:1-38`).
- Existing API type aliases are centralized in `apps/web/lib/api-types.ts` (`apps/web/lib/api-types.ts:1-13`) and exports are centralized in `apps/web/lib/api.ts` (`apps/web/lib/api.ts:1-3`).
- Existing Prisma data can support a no-migration dashboard: `User`, `Book`, `Category`, `Tag`, and `ProcessingJob` models already exist (`apps/api/prisma/schema.prisma:34-45`, `apps/api/prisma/schema.prisma:77-101`, `apps/api/prisma/schema.prisma:131-168`).
- Existing status enums can power dashboard status cards without adding schema: `BookStatus` and `ProcessingJobStatus` are already defined (`apps/api/prisma/schema.prisma:18-32`).
- Existing books/catalog services already demonstrate Prisma aggregation source data and mapping style (`apps/api/src/modules/books/books.service.ts:149-172`, `apps/api/src/modules/catalog/catalog.service.ts:13-29`).
- Existing Swagger DTO style uses `@ApiProperty` classes (`apps/api/src/modules/catalog/dto/catalog-response.dto.ts:1-75`).
- Existing role guard pattern uses `@UseGuards(RolesGuard)` plus `@Roles(...)` (`apps/api/src/modules/books/books.controller.ts:16-20`, `apps/api/src/modules/auth/roles.guard.ts:12-20`).
- Current seeded accounts include admin, librarian, and reader roles, enabling dashboard role-boundary smoke tests (`apps/api/prisma/seed.ts:13-27`).
- Root verification scripts include lint, test, build, OpenAPI generation, e2e, migration, and seed commands (`package.json:11-19`).

## Scope Boundary

### In scope for Member D Phase 4

Backend:

- `apps/api/src/modules/reporting/**`
- `apps/api/src/app.module.ts` to register `ReportingModule`
- `apps/api/test/reporting.e2e-spec.ts`

Frontend:

- `apps/web/app/(admin)/admin/dashboard/**`
- `apps/web/components/domain/reporting/**`
- `apps/web/components/domain/index.ts` additive export only
- `apps/web/lib/api-server.ts`, `apps/web/lib/api-types.ts`, `apps/web/lib/api.ts` for dashboard API adapter exports
- `apps/web/components/layout/index.tsx` only for the minimal admin nav addition, ideally in the final integration commit/PR

Generated/contracts/docs:

- `apps/api/openapi/libif-api.json`
- `apps/web/lib/generated/api-types.ts`
- `ai_artifacts/docs/api-contracts.md`
- `ai_artifacts/docs/screen-matrix.md`
- `ai_artifacts/docs/progress_checklist.md`

### Out of scope for Member D Phase 4

- Member A reader module/access/document viewer implementation.
- Member B catalog/document/upload implementation except consuming stable countable data.
- Member C processing read model, approval, notification implementation except counting existing `ProcessingJob` rows.
- Taxonomy CRUD routes and UI.
- User-management list/detail/role/deactivation flows.
- Report export jobs and CSV downloads.
- Settings persistence/screens.
- Prisma schema changes unless the whole phase explicitly designates Member D as migration owner.

## Acceptance Criteria

1. Admin dashboard backend exists under `ReportingModule` and is registered in `AppModule`.
2. A protected dashboard endpoint returns real counts derived from existing Prisma models, with no required migration.
3. Dashboard endpoint is accessible to `ADMIN` and `LIBRARIAN`, and forbidden to `READER`/anonymous users.
4. Dashboard DTOs are Swagger-decorated and appear in regenerated OpenAPI.
5. Web server adapter fetches dashboard data through generated OpenAPI paths, not raw page-local `fetch`.
6. `/admin/dashboard` renders a dashboard summary with loading/error/empty-safe UI behavior and one H1.
7. Admin navigation links to the dashboard without removing existing books/intake/catalogue links.
8. Docs/checklists are updated only in the relevant sections and avoid duplicating already-centralized status.
9. Member D does not edit other member lanes except the explicitly listed integration touchpoints.
10. Verification evidence includes targeted reporting tests plus at least lint, build, OpenAPI generation, and API e2e or documented blocker.

## Proposed Dashboard Contract

Prefer this Phase 4 contract because it aligns with the existing admin dashboard targets while staying small:

- `GET /api/admin/dashboard/librarian`
  - Roles: `ADMIN`, `LIBRARIAN`
  - Query: optional `dateRange` can be ignored initially or accepted as a future-compatible DTO field.
  - Response: `LibrarianDashboardSummaryDto`

Suggested response shape:

```ts
type LibrarianDashboardSummaryDto = {
  generatedAt: string;
  books: {
    total: number;
    published: number;
    pendingProcessing: number;
    processing: number;
    pendingApproval: number;
    rejected: number;
  };
  processingJobs: {
    queued: number;
    running: number;
    succeeded: number;
    failed: number;
  };
  taxonomy: {
    categories: number;
    tags: number;
  };
  users: {
    admins: number;
    librarians: number;
    readers: number;
    total: number;
  };
  recentBooks: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
};
```

Contract notes:

- Use existing `BookStatus` and `ProcessingJobStatus` enum values rather than inventing dashboard-only status strings.
- Use `count`/`groupBy` Prisma reads where practical.
- Keep this read-only. No Phase 4 dashboard writes.
- Do not include protected file/storage URLs.

## Implementation Steps

### Step D4-001 — Create ReportingModule skeleton as runtime code

Files:

- `apps/api/src/modules/reporting/reporting.module.ts`
- `apps/api/src/modules/reporting/reporting.controller.ts`
- `apps/api/src/modules/reporting/reporting.service.ts`
- `apps/api/src/modules/reporting/dto/librarian-dashboard-summary.dto.ts`
- `apps/api/src/modules/reporting/reporting.service.spec.ts`
- `apps/api/test/reporting.e2e-spec.ts`
- `apps/api/src/app.module.ts`

Tasks:

1. Create `ReportingModule` importing/using `DatabaseModule`/`PrismaService` as existing modules do.
2. Register `ReportingModule` in `AppModule.imports`.
3. Add `ReportingController` at `@Controller('admin/dashboard')`.
4. Protect the controller or handler with `@UseGuards(RolesGuard)` and `@Roles('ADMIN', 'LIBRARIAN')`.
5. Add `GET /librarian` handler returning `LibrarianDashboardSummaryDto`.

Expected result:

- Backend compiles with a protected dashboard summary endpoint.

### Step D4-002 — Implement real count aggregation with no migration

Files:

- `apps/api/src/modules/reporting/reporting.service.ts`
- `apps/api/src/modules/reporting/dto/librarian-dashboard-summary.dto.ts`
- `apps/api/src/modules/reporting/reporting.service.spec.ts`

Tasks:

1. Count books by `BookStatus`.
2. Count processing jobs by `ProcessingJobStatus`.
3. Count categories and tags.
4. Count users by `UserRole`.
5. Return a short recent-books list ordered by `createdAt desc`.
6. Fill absent status buckets with `0` so the frontend does not branch on missing keys.

Expected result:

- Dashboard counts are deterministic and safe on an empty database.

### Step D4-003 — Add targeted backend tests

Files:

- `apps/api/src/modules/reporting/reporting.service.spec.ts`
- `apps/api/test/reporting.e2e-spec.ts`

Tasks:

1. Unit-test empty counts return all buckets as zero.
2. Unit-test grouped counts map into the DTO shape correctly.
3. E2e-test admin/librarian access is allowed.
4. E2e-test reader or unauthenticated access is forbidden.

Expected result:

- Role boundaries and aggregation behavior are proven before UI work depends on the endpoint.

### Step D4-004 — Generate contracts and add web API adapters

Files:

- `apps/api/openapi/libif-api.json`
- `apps/web/lib/generated/api-types.ts`
- `apps/web/lib/api-types.ts`
- `apps/web/lib/api-server.ts`
- `apps/web/lib/api.ts`

Tasks:

1. Run `npm run openapi:generate` after the backend endpoint is stable.
2. Add a `LibrarianDashboardSummaryDto` alias in `apps/web/lib/api-types.ts`.
3. Add `fetchLibrarianDashboardSummary()` to `apps/web/lib/api-server.ts` using the generated path.
4. Export the fetcher and type from `apps/web/lib/api.ts`.

Expected result:

- The dashboard page can use typed adapters and avoid page-local raw fetch calls.

### Step D4-005 — Build the admin dashboard route and domain component

Files:

- `apps/web/app/(admin)/admin/dashboard/page.tsx`
- `apps/web/components/domain/reporting/DashboardMetrics.tsx`
- `apps/web/components/domain/reporting/index.ts`
- `apps/web/components/domain/index.ts`
- `apps/web/components/layout/index.tsx` only for an additive Dashboard nav link

Tasks:

1. Create a server-rendered `/admin/dashboard` page under the existing protected admin layout.
2. Fetch dashboard data using `fetchLibrarianDashboardSummary()`.
3. Render KPI cards for books, processing jobs, taxonomy, and users using existing `Card`, `Badge`/`StatusBadge`, `InlineAlert`, `EmptyState`, and layout primitives.
4. Render a recent-books summary list with accessible headings and no color-only status.
5. Add an admin navigation item for Dashboard without removing existing links.

Expected result:

- Admins and librarians can open `/admin/dashboard` and see real backend counts.

### Step D4-006 — Phase-end integration and docs pass

Files:

- `ai_artifacts/docs/api-contracts.md`
- `ai_artifacts/docs/screen-matrix.md`
- `ai_artifacts/docs/progress_checklist.md`
- optionally `.omx/plans/plan-phase-4-member-d-admin-dashboard-integration-2026-07-21.md` if execution notes are needed

Tasks:

1. Update API docs with `GET /api/admin/dashboard/librarian` once implemented.
2. Mark `/admin/dashboard` status in the screen matrix.
3. Update progress checklist with Member D Phase 4 result and verification evidence.
4. Note any cross-lane dependency waiting on Member A/B/C.
5. Re-run OpenAPI generation only once after backend routes from the phase are stable.

Expected result:

- Phase 4 integration evidence is centralized and ready for other team members to merge around.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Endpoint path drift between skeletons and docs | Use `GET /api/admin/dashboard/librarian` for Phase 4 because `api-contracts.md` and `screen-matrix.md` already describe that target; update skeleton/docs during execution if the team wants `/api/reporting/dashboard` instead. |
| Member D accidentally expands into Phase 7 work | Treat taxonomy/users/settings/report exports as counts only in Phase 4; CRUD and settings screens stay out of scope. |
| OpenAPI churn conflicts with A/B/C branches | Delay OpenAPI/client regeneration until Member D integration pass or after backend route names stabilize. |
| Dashboard tests require seeded data | Unit-test aggregation with mocks; e2e can assert shape/access and tolerate zero counts. |
| Existing shared layout nav is a cross-cutting file | Keep `apps/web/components/layout/index.tsx` edit to one additive Dashboard nav item in the integration step. |
| Counts become expensive later | Phase 4 can use straightforward counts; Phase 7 can add date ranges/caching/report tables if needed. |

## Verification Steps

Targeted backend:

```bash
npm run test -w apps/api -- reporting
npm run test:e2e -w apps/api -- reporting
```

Contract generation:

```bash
npm run openapi:generate
```

Standard checks:

```bash
npm run lint
npm test
npm run build
```

Manual/role smoke:

1. Seed dev accounts if needed with `npm run db:seed`.
2. Sign in as `admin@libif.local` and visit `/admin/dashboard`.
3. Sign in as `librarian@libif.local` and visit `/admin/dashboard`.
4. Sign in as `reader@libif.local` and confirm `/admin/dashboard` redirects to `/access-denied` through the existing admin layout.

## Handoff Guidance for AI Agents

Use this prompt for a Member D implementation agent:

```text
You are Member D implementing Phase 4 dashboard/integration work.

Read first:
- ai_artifacts/prompts/Agent_Prompt.md
- ai_artifacts/docs/team_backlog_80_90_completion.md
- ai_artifacts/skeletons/api-modules/reporting/README.md
- ai_artifacts/skeletons/web-routes/admin-reports-settings/README.md
- ai_artifacts/plans/plan-phase-4-member-d-admin-dashboard-integration-2026-07-21.md

Edit only:
- apps/api/src/modules/reporting/**
- apps/api/src/app.module.ts
- apps/api/test/reporting.e2e-spec.ts
- apps/web/app/(admin)/admin/dashboard/**
- apps/web/components/domain/reporting/**
- apps/web/components/domain/index.ts
- apps/web/lib/api-server.ts
- apps/web/lib/api-types.ts
- apps/web/lib/api.ts
- generated OpenAPI/client files only during the integration step
- relevant ai_artifacts docs only during the docs step

Do not edit:
- Member A reader/access files
- Member B catalog/documents/upload files
- Member C processing/approval/notification files, except read-only consumption of existing ProcessingJob counts through Prisma
- Prisma schema/migrations unless phase leadership explicitly assigns Member D as migration owner
- shared UI primitives

If dashboard behavior needs data that only Member A/B/C can provide, expose the missing dependency in the completion report and keep the implementation inside Member D's lane.
```

## Stop Condition

Stop Member D Phase 4 when:

- `GET /api/admin/dashboard/librarian` exists, is protected, and returns real no-migration counts.
- `/admin/dashboard` renders those counts through typed API adapters.
- OpenAPI/client generation has been run after backend stabilization.
- Relevant docs/checklist have been updated.
- Verification commands have passed or any blocker is documented with exact failing output.
