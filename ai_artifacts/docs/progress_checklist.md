# LIBIF Progress Checklist

Last updated: 2026-07-21

This checklist is the concise current-state tracker for future agents and team members. Detailed design, screen, workflow, and contract notes remain in the other `ai_artifacts/docs/` files.

## Completed foundations

- [x] Centralized AI artifacts under `ai_artifacts/`.
- [x] Phase 0 artifact/document inventory and Stitch screen classification.
- [x] Phase 1 design tokens, base styles, shared UI primitives, layout primitives, and domain component foundations.
- [x] Phase 1 component/accessibility regression tests.
- [x] Phase 2 Reader/Admin/Auth route groups and role-aware shells.
- [x] Phase 2 admin session gating and opt-in development auth headers.
- [x] Phase 2 OpenAPI generation and generated frontend API path types.
- [x] Phase 2 split server/browser API adapters.
- [x] Phase 3 production auth/access foundation.
- [x] Phase 3 database-backed sessions and password-reset tokens.
- [x] Phase 3 auth screens: sign-in, register, forgot password, reset password, reset completed, access denied, session expired.
- [x] Phase 3 standard API error envelope.
- [x] Phase 3 seeded usable dev accounts for Admin, Librarian, and Reader.

## Seeded local accounts

Run `make db-seed` or `npm run db:seed` after migrations.

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@libif.local` | `admin libif dev passphrase` | Full current role permissions. |
| Librarian | `librarian@libif.local` | `librarian libif dev passphrase` | Staff intake/admin book access. |
| Reader | `reader@libif.local` | `reader libif dev passphrase` | Reader role and catalogue/library permission baseline. |

Development-header auth remains available only with explicit local opt-in through `LIBIF_ENABLE_DEV_AUTH=true` and `NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH=true`.

## Verified command set for latest completed phase

Latest full Ralph verification for Phase 3 passed:

- [x] `npm exec -w apps/api -- dotenv -e ../../.env -- prisma migrate deploy --schema prisma/schema.prisma`
- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] Architect verification approved after fixes.

## Current implemented route/API coverage

- [x] `/`
- [x] `/catalogue`
- [x] `/catalog` compatibility redirect
- [x] `/admin/books`
- [x] `/admin/books/new`
- [x] `/admin/dashboard`
- [x] `/sign-in`
- [x] `/register`
- [x] `/forgot-password`
- [x] `/reset-password`
- [x] `/reset-password/completed`
- [x] `/access-denied`
- [x] `/session-expired`
- [x] Auth APIs: register, sign-in, sign-out, session, reset request, reset completion.
- [x] Intake/catalog APIs: admin intake, admin books, categories, public catalog books, ISBN lookup.
- [x] Reporting API: admin/librarian dashboard summary counts.

## Remaining high-level work

- [ ] Production password-reset email provider.
- [ ] Reader module and reader discovery/personal library flows.
- [ ] Protected PDF access grants and reading progress.
- [ ] Upload/Catalog boundary deepening for document metadata workflows.
- [ ] Processing workers and processing status/retry endpoints.
- [ ] Approval, correction, and notifications workflows.
- [ ] Taxonomy/tag management, user administration, role changes, and deactivation.
- [ ] Dashboards, reports, exports, and settings. Phase 4 Member D completed the base dashboard summary only; report exports/settings remain deferred.
- [ ] Cross-screen integration hardening and responsive/visual QA.

## Next recommended planning target

Phase 4 member work has been merged into `dev`; next recommended execution phase is **Phase 5 — Document Lifecycle, Upload, Metadata, and Taxonomy Integration**. Keep Phase 4 follow-ups limited to integration hardening or bug fixes unless the team reopens a member lane.

## 80-90% Completion Team Backlog

- Added `ai_artifacts/docs/team_backlog_80_90_completion.md` as the canonical four-member backlog for remaining high-completion work.
- Added `ai_artifacts/skeletons/` planning skeletons that map future API modules, web route subtrees, and domain components without introducing build-impacting placeholder code.

## Phase 4 merged progress

- [x] Member A (Reader & Access): Reader module, library/history/bookmarks routes, access decisions, and protected document viewer foundations.
- [x] Member B (Catalog & Document DTOs): Expanded catalog search/filter/sort/pagination contracts (`q`, `categoryId`, `tagIds`, `page`, `pageSize`, `sort`), split public reader vs admin DTOs (`mapPublicBook`, `mapAdminBook`), unit test coverage, and regenerated OpenAPI/API types.
- [x] Member C (Processing, Approval, Notifications): Processing status surfaces, approval queue shell, notification API/UI foundations, and related tests.
- [x] Member D (Dashboard & Reporting): Added `ReportingModule` with guarded `GET /api/admin/dashboard/librarian`, `/admin/dashboard` with real-count cards, loading/error/empty states, generated OpenAPI/API types, and dashboard-specific tests.

### Phase 4 Member D verification

- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] Architect verification approved after adding route loading UI and dashboard-specific web tests.
- [x] Ralph deslop pass completed on changed files; post-deslop regression remained green.
