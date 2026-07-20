# Phase 2 Plan — Next.js Shells, Route Groups, Auth Boundary, and Typed API Client

Created: 2026-07-20  
Mode: `$plan` direct  
Canonical artifact root: `ai_artifacts/`  
OMX mirror: `.omx/plans/plan-phase-2-shells-auth-boundary-api-client-2026-07-20.md`

## Requirements Summary

Phase 2 builds the application-frame and API-contract foundation that later screen batches will use. It should not implement full feature screens or deep domain workflows. The target outcomes are:

1. Replace the simple global web navigation with route-group-specific Reader, Admin, and Auth layout foundations.
2. Preserve current working routes and behavior while moving them into Next.js App Router route groups.
3. Represent authentication/session/permission boundaries on both frontend and backend without claiming production credential authentication is complete.
4. Introduce NestJS OpenAPI generation and annotate enough existing/new contracts to make the spec useful.
5. Replace scattered hand-written API calls with one typed API client surface generated from, or validated against, OpenAPI.
6. Update centralized `ai_artifacts/docs` as part of execution.

## Evidence and Current-State Anchors

- The project guide centralizes future planning under `ai_artifacts/` and identifies `ai_artifacts/plans/`, `ai_artifacts/docs/`, and `ai_artifacts/stitch_design/` as canonical artifact locations (`ai_artifacts/prompts/Agent_Prompt.md:5-20`).
- Phase 1 foundations are already present: Tailwind/PostCSS, tokens, shared UI primitives, layout primitives, domain foundations, component catalogue, and tests (`ai_artifacts/prompts/Agent_Prompt.md:47-57`).
- Phase 2 is explicitly defined as route-aware shells, route groups, auth boundary representation, and typed API-client/OpenAPI alignment (`ai_artifacts/prompts/Agent_Prompt.md:147-160`).
- Architecture docs say the current root layout still has simple global navigation and Phase 2 owns role-aware shells/route groups (`ai_artifacts/docs/architecture-alignment.md:27-32`).
- Architecture docs list OpenAPI/client gaps: hand-written frontend API client and no OpenAPI generation/decorators (`ai_artifacts/docs/architecture-alignment.md:82-91`).
- The current web route tree only has `/`, `/catalog`, `/admin/books`, and `/admin/books/new` (`ai_artifacts/docs/architecture-alignment.md:27-32`; `apps/web/app/layout.tsx:18-23`; `apps/web/app/page.tsx:3-11`; `apps/web/app/catalog/page.tsx:7-27`; `apps/web/app/admin/books/page.tsx:7-27`; `apps/web/app/admin/books/new/page.tsx:7-23`).
- The current root layout owns global navigation links directly (`apps/web/app/layout.tsx:14-27`), which should move into shells.
- Component inventory already reserves `AppShell`, `ReaderShell`, and `AdminShell` for application frames, with landmarks, skip link, mobile drawer, sidebar/header, nav items, user, breadcrumbs, and notifications (`ai_artifacts/docs/component-inventory.md:22-23`).
- UI decisions define Reader, Librarian, Administration, and Management navigation taxonomies (`ai_artifacts/docs/ui-decisions.md:48-89`).
- Route groups are a documented Next.js convention for organizing routes without changing the URL path, and can define shared layouts; route-group caveats include conflicting URL paths and full reloads between multiple root layouts when used that way (official Next.js route-group docs).
- Current web API calls are hand-written in `apps/web/lib/api.ts`, with direct string URLs and ad hoc error parsing (`apps/web/lib/api.ts:1-52`).
- Current API uses a global `/api` prefix, CORS credentials, and a global validation pipe (`apps/api/src/main.ts:6-13`).
- Current API modules are `DatabaseModule`, `StorageModule`, `ProcessingModule`, `BooksModule`, `CatalogModule`, `IsbnModule`, and `HealthModule`; there is no first-class Auth or Reader module yet (`apps/api/src/app.module.ts:1-26`; `ai_artifacts/docs/architecture-alignment.md:34-45`).
- Current implemented endpoints are `POST /api/admin/books/intake`, `GET /api/admin/books`, `GET /api/categories`, `GET /api/catalog/books`, `GET /api/isbn/:isbn`, and health (`ai_artifacts/docs/api-contracts.md:7-15`; `apps/api/src/modules/books/books.controller.ts:9-23`; `apps/api/src/modules/catalog/catalog.controller.ts:4-16`; `apps/api/src/modules/isbn/isbn.controller.ts:4-11`).
- Current DTOs are shared manually through `packages/shared/src/index.ts` (`packages/shared/src/index.ts:1-39`), while the API docs require OpenAPI to become the source of truth (`ai_artifacts/docs/api-contracts.md:1-5`, `ai_artifacts/docs/api-contracts.md:139-153`).
- API contract docs define the standard error envelope, paginated collection, asynchronous accepted response, and target DTO families (`ai_artifacts/docs/api-contracts.md:17-53`, `ai_artifacts/docs/api-contracts.md:139-149`).
- Prisma already has users and roles but no production session/auth flow (`apps/api/prisma/schema.prisma:12-16`, `apps/api/prisma/schema.prisma:34-42`; `apps/api/prisma/seed.ts:11-21`).
- The project has component/accessibility tests already configured with Vitest and jest-axe (`apps/web/tests/setup.ts:1-8`, `apps/web/tests/accessibility.spec.tsx:1-19`, `apps/web/tests/ui-components.spec.tsx:1-117`).

## Scope

### In Scope

- Next.js route groups: `(reader)`, `(admin)`, `(auth)`.
- Shell components: `AppShell`, `ReaderShell`, `AdminShell`, `Sidebar`, `TopBar`, `MobileNavDrawer`, `UserMenu`, `NotificationButton`, and supporting nav types.
- Moving existing pages into route groups without changing their public URL unless the screen matrix already calls for a canonical route update.
- Compatibility redirects where existing paths differ from docs, especially `/catalog` -> `/catalogue` if Phase 2 adopts the docs' canonical spelling.
- Frontend session boundary helpers: `getSession`, `requireSession`, `hasPermission`, role/permission types, and UX-level route gating.
- Backend Auth boundary scaffold: `AuthModule`, session DTOs, role/permission model, session endpoint, reusable guards/decorators for roles/permissions, and tests proving admin APIs deny insufficient roles.
- OpenAPI setup through NestJS Swagger and stable operation IDs/tags.
- OpenAPI-generated or OpenAPI-validated web client using `openapi-typescript` plus `openapi-fetch` unless execution-time dependency validation finds a better Node-compatible option.
- Migration of `apps/web/lib/api.ts` into typed server/browser adapters while preserving existing book intake/catalog/admin behavior.
- Docs updates in `ai_artifacts/docs/architecture-alignment.md`, `api-contracts.md`, `component-inventory.md`, `screen-matrix.md`, and `ui-decisions.md`.

### Out of Scope

- Full username/password login, registration, password reset, OAuth, production session store, or credential hardening. Those belong to Batch 1 unless separately approved.
- Full Reader personal-library features, protected PDF viewing, bookmarks, reading history, or access grants beyond boundary scaffolding.
- Deep Upload/Catalog/Processing module migration. Existing behavior should be preserved; deeper ownership migration is later batch work.
- New dashboard, approval, taxonomy, user-admin, reporting, or processing queue feature screens.
- Database schema changes unless a tiny, explicitly justified auth-boundary scaffold is unavoidable. Prefer using existing `User`/`UserRole` for Phase 2.

## Recommended Technical Direction

### Route groups and layouts

Use a top-level `apps/web/app/layout.tsx` only for HTML/body/font/global CSS. Move user-facing navigation into nested group layouts:

```text
apps/web/app/
├─ layout.tsx
├─ (reader)/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ catalogue/page.tsx
├─ catalog/page.tsx                 # compatibility redirect to /catalogue, if canonicalized
├─ (admin)/
│  ├─ layout.tsx
│  └─ admin/books/...               # preserves /admin/books URLs
└─ (auth)/
   ├─ layout.tsx
   ├─ access-denied/page.tsx
   └─ session-expired/page.tsx
```

Avoid multiple top-level root layouts unless intentionally accepted, because the official Next.js route-group docs warn that navigating between different root layouts triggers a full page reload and that route groups must not produce conflicting URL paths.

### Auth boundary

Implement a boundary, not full production auth:

- Define canonical roles and permissions in shared/domain code.
- Add `GET /api/auth/session` that returns an anonymous/session DTO using a documented development principal provider.
- Add NestJS guards/decorators for `@Roles()`/`@Permissions()` and apply them to admin endpoints that already exist.
- In non-production tests, allow a controlled header such as `x-libif-role` to prove guard behavior. In production, fail closed unless real session/cookie auth is added by Batch 1.
- Make UI route checks call the typed session client for UX gating, but continue to document that backend guards are the security boundary.

### API client and OpenAPI

Prefer `openapi-typescript` + `openapi-fetch` for Phase 2 because:

- OpenAPI TypeScript converts OpenAPI 3.0/3.1 schemas to TypeScript and supports type-safe fetching (official docs).
- `openapi-fetch` is a thin type-safe fetch wrapper over native fetch, with types inferred from OpenAPI paths and no manual typing (official docs).
- This approach is lighter than full codegen and matches the existing small API surface.

Reject Orval as the default for this phase unless dependency validation explicitly confirms compatibility with the repo's Node baseline. The repo currently requires Node `>=20.19.0` (`package.json:20-22`), and current Orval docs/search result indicate v8 requires newer Node; execution should avoid unnecessary toolchain churn.

## Acceptance Criteria

1. `apps/web/app/layout.tsx` no longer renders product navigation; it only handles global document concerns such as CSS/font metadata.
2. `apps/web/app/(reader)/layout.tsx`, `apps/web/app/(admin)/layout.tsx`, and `apps/web/app/(auth)/layout.tsx` exist and wrap their route groups with shared shell components.
3. Current working routes still render: `/`, `/admin/books`, `/admin/books/new`, and catalogue route compatibility (`/catalog` redirects or continues intentionally with documented rationale).
4. Reader and Admin navigation items come from typed config, not hard-coded anchor lists inside page files.
5. Admin shell includes sidebar/topbar landmarks, skip link, user menu placeholder backed by session data, and notification control placeholder backed by an explicit future integration note.
6. Reader shell includes content-first navigation, compact/mobile navigation behavior, and no alternate brand.
7. UX route gating exists for admin routes and access-denied/session-expired states, but docs explicitly state backend guards are authoritative.
8. `apps/api/src/modules/auth` exists with session DTO/service/controller and role/permission guard scaffolding.
9. Existing admin endpoints deny an insufficient role in tests and allow an authorized staff/admin role in tests.
10. Swagger/OpenAPI is configured in NestJS with stable operation IDs, tags, schemas, and JSON output reachable under the global `/api` prefix or generated by script.
11. Existing controllers/DTOs have enough Swagger decorators or plugin support for useful OpenAPI schemas, especially body/query/param/response/error shapes.
12. Web has generated OpenAPI path types committed under a clear generated location, with a script to regenerate them.
13. `apps/web/lib/api.ts` is replaced or reduced to thin typed wrappers over the generated/OpenAPI-validated client.
14. Separate server-side and browser-safe request adapters exist; upload progress remains safely wrapped if native fetch cannot preserve progress semantics.
15. No Next.js route/component accesses PostgreSQL, S3/MinIO, Redis, BullMQ, or Tesseract directly.
16. No raw design hex consumers or old legacy proof classes are reintroduced.
17. New shell and auth-boundary behavior is covered by component/unit/integration tests.
18. `npm run lint`, `npm test`, and `npm run build` pass after execution.
19. Centralized docs in `ai_artifacts/docs` are updated to reflect implemented paths, boundary limitations, and API-client decisions.
20. Phase 2 ends with a report and does not automatically start Batch 1 or feature-screen implementation.

## Implementation Steps

### Step 0 — Preflight and behavior lock

**Goal:** Ensure Phase 2 starts from the verified Phase 1 baseline and does not erase current behavior.

**Actions:**

1. Read this plan plus `ai_artifacts/prompts/Agent_Prompt.md`, `architecture-alignment.md`, `component-inventory.md`, `ui-decisions.md`, `screen-matrix.md`, and `api-contracts.md`.
2. Run baseline verification:
   - `npm run lint`
   - `npm test`
   - `npm run build`
3. Add route/API behavior tests before moving files:
   - Existing `/`, `/catalog`, `/admin/books`, `/admin/books/new` routes render expected headings or redirect intentionally.
   - Existing `BookIntakeForm` regression remains green (`apps/web/tests/book-intake.spec.tsx:1-39`).
   - Existing API intake/list/category/catalog/isbn tests remain green or are expanded.

**Expected files:**

- `apps/web/tests/*`
- `apps/api/src/**/*.spec.ts`
- `apps/api/test/**/*.e2e-spec.ts` if e2e coverage exists or is added.

**Acceptance:** Baseline test/build output is captured before route movement.

### Step 1 — Add shared navigation and shell foundations

**Goal:** Create reusable shells before moving pages.

**Actions:**

1. Extend `apps/web/components/layout/index.tsx`, or split it into focused files under `apps/web/components/layout/` if it becomes too large.
2. Add typed nav models:
   - `NavItem`
   - `WorkspaceShellProps`
   - `SessionSummary`
   - `NotificationSummary`
3. Implement:
   - `AppShell`
   - `ReaderShell`
   - `AdminShell`
   - `Sidebar`
   - `TopBar`
   - `MobileNavDrawer`
   - `UserMenu`
   - `NotificationButton`
   - `SkipLink`
4. Reuse Phase 1 primitives: `Button`, `IconButton`, `Badge`, `Drawer`, `Breadcrumbs`, `Tabs`, `PageHeader`, and `StatusBadge` from `apps/web/components/ui/index.ts:1-21` and `apps/web/components/layout/index.tsx:1-13`.
5. Add CSS classes to `apps/web/styles/components.css` only where semantic component classes are needed.

**Expected files:**

- `apps/web/components/layout/shells.tsx`
- `apps/web/components/layout/navigation.tsx`
- `apps/web/components/layout/types.ts`
- `apps/web/components/layout/index.ts`
- `apps/web/styles/components.css`
- `apps/web/tests/shells.spec.tsx`

**Acceptance:** Shell components render landmarks, nav labels, skip link, current page state, mobile drawer trigger, user menu, and notification button in tests.

### Step 2 — Restructure Next.js App Router route groups

**Goal:** Move navigation out of root layout and organize public URLs by experience without breaking current behavior.

**Actions:**

1. Simplify `apps/web/app/layout.tsx` so it keeps only global CSS/font/html/body concerns (`apps/web/app/layout.tsx:1-17`) and removes the hard-coded nav (`apps/web/app/layout.tsx:18-23`).
2. Create route groups:
   - `apps/web/app/(reader)/layout.tsx`
   - `apps/web/app/(admin)/layout.tsx`
   - `apps/web/app/(auth)/layout.tsx`
3. Move pages:
   - `apps/web/app/page.tsx` -> `apps/web/app/(reader)/page.tsx`.
   - `apps/web/app/catalog/page.tsx` -> `apps/web/app/(reader)/catalogue/page.tsx` if adopting docs' canonical spelling.
   - `apps/web/app/admin/books/page.tsx` -> `apps/web/app/(admin)/admin/books/page.tsx`.
   - `apps/web/app/admin/books/new/page.tsx` -> `apps/web/app/(admin)/admin/books/new/page.tsx`.
4. Add compatibility redirect for `/catalog` if page moves to `/catalogue`.
5. Add Auth result routes only as boundary states, not full Batch 1 forms:
   - `apps/web/app/(auth)/access-denied/page.tsx`
   - `apps/web/app/(auth)/session-expired/page.tsx`
6. Ensure no two route groups resolve to the same URL path.

**Expected files:**

- `apps/web/app/layout.tsx`
- `apps/web/app/(reader)/layout.tsx`
- `apps/web/app/(reader)/page.tsx`
- `apps/web/app/(reader)/catalogue/page.tsx`
- `apps/web/app/catalog/page.tsx`
- `apps/web/app/(admin)/layout.tsx`
- `apps/web/app/(admin)/admin/books/page.tsx`
- `apps/web/app/(admin)/admin/books/new/page.tsx`
- `apps/web/app/(auth)/layout.tsx`
- `apps/web/app/(auth)/access-denied/page.tsx`
- `apps/web/app/(auth)/session-expired/page.tsx`

**Acceptance:** Routes build without conflicts, current user-facing URLs still work or redirect intentionally, and route groups do not introduce alternate brands.

### Step 3 — Add backend Auth boundary scaffold

**Goal:** Represent session/permission boundaries on the authoritative backend before frontend gating relies on them.

**Actions:**

1. Add `AuthModule` and import it into `AppModule`, near existing modules (`apps/api/src/app.module.ts:1-26`).
2. Define session/permission DTOs:
   - `SessionDto`
   - `SessionUserDto`
   - `PermissionKey`
   - `RoleKey`
   - `AuthErrorDto`
3. Add `GET /api/auth/session`, aligning with target API contracts (`ai_artifacts/docs/api-contracts.md:57-65`).
4. Add a development principal provider for tests/local work:
   - Accepts controlled test headers only outside production.
   - Fails closed in production until real Batch 1 authentication exists.
5. Add reusable decorators/guards:
   - `@CurrentUser()`
   - `@Roles()`
   - `RolesGuard`
   - optional `@Permissions()` / `PermissionsGuard` if permissions are modeled in Phase 2.
6. Apply guards to existing admin endpoints:
   - `POST /api/admin/books/intake` (`apps/api/src/modules/books/books.controller.ts:13-18`)
   - `GET /api/admin/books` (`apps/api/src/modules/books/books.controller.ts:20-23`)
7. Keep public endpoints public:
   - `GET /api/categories` and `GET /api/catalog/books` (`apps/api/src/modules/catalog/catalog.controller.ts:8-16`)
   - ISBN lookup remains public or staff-gated by documented decision.
8. Do not implement production credential login/password reset in this phase.

**Expected files:**

- `apps/api/src/modules/auth/auth.module.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/dto/session.dto.ts`
- `apps/api/src/modules/auth/guards/roles.guard.ts`
- `apps/api/src/modules/auth/decorators/current-user.decorator.ts`
- `apps/api/src/modules/auth/decorators/roles.decorator.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/modules/books/books.controller.ts`
- `packages/shared/src/index.ts` or generated replacement types only if needed temporarily.

**Acceptance:** API tests prove anonymous/reader role cannot call admin endpoints, librarian/admin can call them, and public catalogue/category endpoints remain available.

### Step 4 — Configure NestJS OpenAPI

**Goal:** Make OpenAPI the contract source before broad frontend integration.

**Actions:**

1. Add `@nestjs/swagger` and required Swagger UI package to `apps/api`.
2. Configure Swagger in `apps/api/src/main.ts` after `setGlobalPrefix('api')` (`apps/api/src/main.ts:6-13`).
3. Use stable operation IDs, preferably `operationIdFactory: (_controller, method) => method`, because NestJS docs show custom operation ID generation through `SwaggerDocumentOptions`.
4. Configure Swagger setup with `useGlobalPrefix: true` or explicit JSON path so generated clients see `/api/...` paths correctly; NestJS docs define `useGlobalPrefix` and raw JSON/YAML options.
5. Annotate existing controllers/DTOs with tags, body/query/param/response decorators where automatic reflection is insufficient. NestJS docs note that route decorators are discovered, but DTO properties need `@ApiProperty()` or the Swagger plugin for visible schemas.
6. Add standard DTO schemas matching `api-contracts.md`:
   - error envelope (`ai_artifacts/docs/api-contracts.md:17-27`)
   - paginated collection (`ai_artifacts/docs/api-contracts.md:29-40`)
   - async accepted response (`ai_artifacts/docs/api-contracts.md:42-53`)
7. Add an OpenAPI export script that can run in CI without starting a long-lived server, or document/specify using the served JSON endpoint if simpler.

**Expected files:**

- `apps/api/src/main.ts`
- `apps/api/src/openapi.ts` or `apps/api/src/openapi/bootstrap-openapi.ts`
- `apps/api/src/modules/**/dto/*.ts`
- `apps/api/src/modules/**/**/*.controller.ts`
- `apps/api/package.json`
- `package-lock.json`
- `ai_artifacts/docs/api-contracts.md`

**Acceptance:** OpenAPI JSON is generated consistently, includes auth/session, current book/catalog/isbn endpoints, stable operation IDs, standard errors, and usable schemas.

### Step 5 — Generate and wrap typed frontend API client

**Goal:** Replace stringly typed endpoint calls with an OpenAPI-derived client while preserving current behavior.

**Actions:**

1. Add `openapi-typescript` as a dev dependency and `openapi-fetch` as a web/runtime dependency unless execution-time dependency validation chooses a better Node-compatible option.
2. Add scripts:
   - API: `openapi:generate` or `openapi:export`.
   - Web/root: `api-client:generate` that runs OpenAPI export and generates TypeScript path types.
3. Generate types into a clearly marked file, e.g.:
   - `apps/web/lib/api-client/generated/schema.d.ts`
4. Add typed clients:
   - `apps/web/lib/api-client/server.ts` for RSC/server calls with no browser-only secrets.
   - `apps/web/lib/api-client/browser.ts` for browser-safe interactive calls.
   - `apps/web/lib/api-client/errors.ts` for normalized error model.
5. Migrate existing wrappers from `apps/web/lib/api.ts:14-52` into typed wrapper functions using generated paths.
6. Keep XHR upload progress behind a typed wrapper if `openapi-fetch` cannot preserve progress events; validate request/response types from generated OpenAPI paths instead of hand-written assertions.
7. Remove or shrink old `apps/web/lib/api.ts` to a compatibility barrel.

**Expected files:**

- `apps/web/lib/api-client/generated/schema.d.ts`
- `apps/web/lib/api-client/server.ts`
- `apps/web/lib/api-client/browser.ts`
- `apps/web/lib/api-client/errors.ts`
- `apps/web/lib/api.ts`
- `apps/web/package.json`
- `apps/api/package.json`
- `package.json`
- `package-lock.json`

**Acceptance:** Current pages and `BookIntakeForm` use typed wrappers, route/server calls compile, browser upload still reports progress, and no page directly builds raw endpoint strings.

### Step 6 — Add frontend session helpers and UX route gating

**Goal:** Give shells and route groups a single source of session/permission truth for UX while backend guards remain authoritative.

**Actions:**

1. Add frontend auth helpers:
   - `apps/web/lib/auth/session.ts`
   - `apps/web/lib/auth/permissions.ts`
   - `apps/web/lib/auth/require-session.ts`
2. Fetch session via typed API client, not raw `fetch`.
3. Add role/permission-aware nav filtering for Reader/Admin shells.
4. In admin layout, call `requireSession({ roles: ['ADMIN', 'LIBRARIAN'] })` and render/redirect to access denied on insufficient role.
5. In reader layout, support public/anonymous session state for catalogue/home but preserve hooks for authenticated reader work later.
6. Keep route-level UX checks documented as non-security controls.

**Expected files:**

- `apps/web/lib/auth/session.ts`
- `apps/web/lib/auth/permissions.ts`
- `apps/web/lib/auth/require-session.ts`
- `apps/web/components/layout/*`
- `apps/web/app/(admin)/layout.tsx`
- `apps/web/app/(reader)/layout.tsx`
- `apps/web/app/(auth)/*`

**Acceptance:** Admin shell renders for staff/admin session, access-denied state renders for insufficient role in tests, Reader shell supports anonymous/public state, and backend tests still prove API enforcement.

### Step 7 — Migrate existing pages into shells without feature creep

**Goal:** Current proof UI benefits from shells/API client while keeping feature scope stable.

**Actions:**

1. Update imports after moving pages.
2. Keep page bodies focused on existing behavior:
   - Home uses Reader shell and shared `Card` (`apps/web/app/page.tsx:3-11`).
   - Catalogue page uses Reader shell and typed `fetchPublicBooks` wrapper (`apps/web/app/catalog/page.tsx:7-27`).
   - Admin books and intake use Admin shell and typed wrappers (`apps/web/app/admin/books/page.tsx:7-27`; `apps/web/app/admin/books/new/page.tsx:7-23`).
3. Do not implement full auth forms, reader history, dashboards, or admin taxonomy screens.
4. Ensure empty/error states remain inside route frames (`apps/web/app/admin/books/page.tsx:16-25`; `apps/web/app/catalog/page.tsx:16-25`).

**Expected files:** moved route files and updated imports only.

**Acceptance:** Visual/semantic behavior of current proof pages remains stable, now under correct shells.

### Step 8 — Expand tests and verification

**Goal:** Prove shell, boundary, and typed-client behavior.

**Actions:**

1. Web component tests:
   - Shell landmarks and nav labels.
   - Mobile drawer open/close.
   - User menu and notification control accessible names.
   - Access denied/session expired routes.
2. Web API-client tests:
   - Parses standard error envelope.
   - Calls generated paths for categories, admin books, public books, ISBN lookup.
   - Upload wrapper preserves progress and typed response.
3. API unit/e2e tests:
   - `GET /api/auth/session` shape.
   - Admin endpoint denies reader/anonymous and allows librarian/admin.
   - OpenAPI JSON includes expected paths and operation IDs.
4. Run targeted scans:
   - raw hex outside tokens/config/reference files.
   - legacy proof classes.
   - raw endpoint-string usage in route files/pages.
5. Run full verification:
   - `npm run lint`
   - `npm test`
   - `npm run build`

**Acceptance:** All verification passes and evidence is captured in the final report.

### Step 9 — Update centralized docs

**Goal:** Keep docs aligned, concise, and non-redundant.

**Actions:**

1. `ai_artifacts/docs/architecture-alignment.md`: mark Phase 2 shell/client/auth-boundary changes, remaining Auth/Reader production gaps, and any dependency decisions.
2. `ai_artifacts/docs/component-inventory.md`: update actual shell component paths and API notes.
3. `ai_artifacts/docs/api-contracts.md`: update OpenAPI source path, generated client path, session DTO, standard errors, and current endpoint coverage.
4. `ai_artifacts/docs/screen-matrix.md`: mark Phase 2 route-group/layout scaffolding status for shell/reference rows without marking feature batches complete.
5. `ai_artifacts/docs/ui-decisions.md`: add any navigation/shell responsive decisions discovered in implementation.
6. Avoid duplicating inventory/count facts outside `stitch-screen-index.md`.

**Acceptance:** A stale-phrase scan over `ai_artifacts/prompts`, `ai_artifacts/docs`, and `ai_artifacts/plans` returns no obsolete Phase 0/Phase 1 assumptions.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Route movement breaks current URLs. | Existing proof UI regresses. | Add route tests and compatibility redirect before deleting old paths. |
| Auth scaffold is mistaken for production auth. | Security misunderstanding. | Name and document it as a boundary scaffold; fail closed in production unless real auth exists; keep Batch 1 for credential flows. |
| Frontend UX gating becomes the only enforcement. | Authorization bypass risk. | Add backend guards and tests on admin endpoints; docs repeat backend is authoritative. |
| OpenAPI schemas are incomplete because DTO properties are not decorated. | Generated client becomes weak or unusable. | Use `@ApiProperty()` or Nest Swagger plugin; add OpenAPI JSON assertions. |
| Generated client churn disrupts current upload progress. | Intake UX regresses. | Keep upload progress in a typed wrapper using XHR where needed. |
| Route groups create conflicting paths. | Next build failure. | Move one route at a time; use Next route group caveat as a checklist; run build after moves. |
| Dependency choice conflicts with Node baseline. | Install/build failure. | Validate versions before install; prefer `openapi-typescript` + `openapi-fetch`; avoid Orval unless Node compatibility is confirmed. |
| Phase 2 expands into feature batches. | Scope creep. | Restrict new pages to shells/boundary states and current proof pages; defer Batch 1+ features. |

## Verification Plan

### Baseline before edits

- `npm run lint`
- `npm test`
- `npm run build`

### During implementation

- `npm test -w apps/web -- shell/auth/api-client tests`
- `npm test -w apps/api -- auth/openapi/controller tests`
- `npm run build -w apps/web` after route moves
- `npm run build -w apps/api` after OpenAPI/Auth changes

### Final verification

- `npm run lint`
- `npm test`
- `npm run build`
- OpenAPI generation command succeeds and generated file diff is intentional.
- Targeted scans:
  - `rg '#[0-9A-Fa-f]{3,8}' apps/web --glob '!apps/web/styles/tokens.css' --glob '!**/*.config.*' --glob '!node_modules/**' --glob '!.next/**'`
  - `rg 'className="(card|grid|dropzone|error|success)"' apps/web/app apps/web/components`
  - `rg 'fetch\(|XMLHttpRequest|/api/' apps/web/app apps/web/components` and verify route/components do not bypass the typed client.
- Optional manual responsive smoke at 375px, 768px, 1024px, and 1440px for Reader/Admin shells.

## Execution Handoff Guidance

Recommended workflow: `$ultragoal` for durable goal execution; add `$team` if parallelizing shell/API/backend lanes.

Suggested lanes if using Team + Ultragoal:

1. **Frontend shell lane** — `executor`, medium reasoning: layout components, route groups, page moves.
2. **Backend auth/OpenAPI lane** — `executor` or `architect`, high reasoning: AuthModule, guards, Swagger config, API tests.
3. **Typed client lane** — `dependency-expert` then `executor`, high/medium reasoning: dependency validation, generated client, wrappers.
4. **Verification/docs lane** — `test-engineer` + `writer`, medium/high reasoning: tests, scans, docs updates.

Launch hint examples:

```text
$ultragoal ai_artifacts/plans/plan-phase-2-shells-auth-boundary-api-client-2026-07-20.md
$team ai_artifacts/plans/plan-phase-2-shells-auth-boundary-api-client-2026-07-20.md
```

Use `$ralph` only if explicitly choosing a single-owner persistent verification/fix loop instead of parallel Team execution.

## Completion Report Requirements for Phase 2

Report:

1. Phase completed.
2. Stitch folders/screens inspected, if any.
3. Route groups and workflow states implemented.
4. Backend Auth/OpenAPI modules/controllers/DTOs/guards changed.
5. REST/OpenAPI contracts added or changed.
6. Shared shell/UI components reused.
7. New shell/auth/client components introduced.
8. Events/queues/storage affected, if any.
9. Design inconsistencies resolved.
10. Intentional deviations and rationale.
11. Responsive checks.
12. Accessibility checks.
13. Frontend test/build results.
14. Backend test/build results.
15. Mock/dev auth integrations still present.
16. Remaining issues and readiness for Batch 1 or other next batch.

## Official Reference Notes

- Next.js route groups organize routes without adding the group segment to the URL and support shared layouts, with caveats around conflicting paths and multiple root layouts.
- NestJS Swagger supports stable operation IDs and setup options including global-prefix/raw JSON behavior.
- NestJS Swagger discovers route decorators but DTO schemas need `@ApiProperty()` or the Swagger plugin for property visibility.
- OpenAPI TypeScript and openapi-fetch are suitable for lightweight generated path types plus type-safe fetch wrappers.
