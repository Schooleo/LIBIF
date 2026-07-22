# LIBIF Progress Checklist

Last updated: 2026-07-22

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
- [x] Phase 4 reader/access/catalog/processing/notification/dashboard foundations.
- [x] Phase 5 schema foundation for reader state, notifications, approvals, audit events, processing progress, and file version/status metadata.

## Seeded local accounts

Run `make db-seed` or `npm run db:seed` after migrations.

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@libif.local` | `admin libif dev passphrase` | Full current role permissions. |
| Librarian | `librarian@libif.local` | `librarian libif dev passphrase` | Staff intake/admin book access. |
| Reader | `reader@libif.local` | `reader libif dev passphrase` | Reader role and catalogue/library permission baseline. |

Development-header auth remains available only with explicit local opt-in through `LIBIF_ENABLE_DEV_AUTH=true` and `NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH=true`.

## Verified command set for latest completed phase

Latest full Phase 4 integration verification passed after merging member lanes:

- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] `git diff --check`
- [x] Merge conflicts resolved and committed in `0bb9679` (`Integrate Phase 4 member lanes without contract drift`).

Latest Phase 5 planning/schema preflight:

- [x] Prisma migration `20260721114643_phase5_domain_foundations` created/applied locally.
- [x] `npx prisma validate --schema apps/api/prisma/schema.prisma`
- [x] `npm run prisma:generate -w apps/api`
- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] `npm run db:seed`
- [x] `git diff --check`
- [x] Comprehensive Phase 5 plan written to `ai_artifacts/plans/plan-phase-5-document-lifecycle-upload-metadata-taxonomy-2026-07-21.md` and mirrored under `.omx/plans/`.

## Current implemented route/API coverage

- [x] `/`
- [x] `/catalogue`
- [x] `/catalog` compatibility redirect
- [x] `/admin/books`
- [x] `/admin/books/new`
- [x] `/admin/documents`
- [x] `/admin/documents/[id]`
- [x] `/admin/documents/[id]/edit`
- [x] `/admin/documents/new`
- [x] `/admin/processing` and `/admin/processing/[id]`
- [x] `/admin/approvals`
- [x] `/admin/notifications`
- [x] `/admin/categories`
- [x] `/admin/tags`
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
- [x] Taxonomy APIs: staff category/tag reads plus Admin-only starter create/edit contracts.
- [x] Document/upload APIs: list, detail, metadata update, upload, replacement, and submit-to-processing contracts.
- [x] Processing APIs: queue/detail/status plus guarded advance, retry, and cancel transition foundations.
- [x] Approval/notification APIs: approval queue/detail and persisted notification list/read operations.

## Remaining high-level work

- [ ] Production password-reset email provider.
- [x] Reader module and reader discovery/personal library foundations from Phase 4.
- [x] Protected document decision/token handoff and persisted reading progress/bookmarks integration.
- [x] Upload/Documents boundary and document metadata workflow foundation.
- [ ] Processing worker implementation and retry history. Phase 5 completed persisted transition/status/retry/cancel foundations; deeper worker execution remains Phase 6.
- [ ] Full approval decision/correction loop. Phase 5 completed approval queue/detail and persisted notification read workflows; decision commands and correction/resubmission remain Phase 6.
- [ ] Taxonomy risky actions (delete/reassign/merge), user administration, role changes, and deactivation. Starter category/tag list/create/edit is complete.
- [ ] Dashboards, reports, exports, and settings. Phase 4 Member D completed the base dashboard summary only; report exports/settings remain deferred.
- [ ] Cross-screen integration hardening and responsive/visual QA.

## Next recommended planning target

Phase 5 member lanes are integrated on the Member D closure branch. The next planning target is **Phase 6 — Processing, Approval, Correction Loop, and Notifications** from `ai_artifacts/docs/team_backlog_80_90_completion.md`. Phase 6 should deepen worker execution, approval decisions, correction/resubmission, retry history, and notification fanout without rebuilding the Phase 5 document, taxonomy, access, or persistence foundations.

## 80-90% Completion Team Backlog

- Added `ai_artifacts/docs/team_backlog_80_90_completion.md` as the canonical four-member backlog for remaining high-completion work.
- Added `ai_artifacts/skeletons/` planning skeletons that map future API modules, web route subtrees, and domain components without introducing build-impacting placeholder code.

## Phase 4 merged progress

- [x] Member A (Reader & Access): Reader module, library/history/bookmarks routes, access decisions, and protected document viewer foundations.
- [x] Member B (Catalog & Document DTOs): Expanded catalog search/filter/sort/pagination contracts (`q`, `categoryId`, `tagIds`, `page`, `pageSize`, `sort`), split public reader vs admin DTOs (`mapPublicBook`, `mapAdminBook`), unit test coverage, and regenerated OpenAPI/API types.
- [x] Member C (Processing, Approval, Notifications): Processing status surfaces, approval queue shell, notification API/UI foundations, and related tests.
- [x] Member D (Dashboard & Reporting): Added `ReportingModule` with guarded `GET /api/admin/dashboard/librarian`, `/admin/dashboard` with real-count cards, loading/error/empty states, generated OpenAPI/API types, and dashboard-specific tests.

## Phase 5 planning/schema foundation

- [x] Added Prisma models/enums for `ReadingProgress`, `Bookmark`, `Notification`, `BookAuditEvent`, `ApprovalReview`, `BookFileStatus`, `ReadingProgressStatus`, `NotificationType`, `NotificationStatus`, `ApprovalReviewStatus`, and `BookAuditAction`.
- [x] Added `BookFile.version`, `BookFile.status`, `BookFile.updatedAt`, and processing progress/timestamp fields.
- [x] Updated `Agent_Prompt.md` to clarify that schema changes are normally locked, but approved missing persistence must go through the migration owner instead of being bypassed.
- [x] Wrote the comprehensive Phase 5 plan with member sections, lanes, merge order, agent rules, and skeleton references.

## Phase 5 Member D progress

- [x] D5-000 schema foundation completed before feature-lane work.
- [x] D5-001 taxonomy read APIs implemented at `GET /api/taxonomy/categories` and `GET /api/taxonomy/tags` with stable DTO projections and Admin/Librarian role guards.
- [x] D5-001 targeted API unit tests, API build/lint, and taxonomy e2e authorization coverage pass.
- [x] D5-002 controlled `CategorySelector` and `TagSelector` components implemented with interaction and automated accessibility coverage.
- [x] D5-002 typed server/browser adapters generated and the existing intake metadata form consumes Member D category/tag options through reusable selectors.
- [x] D5-003 `/admin/categories` and `/admin/tags` provide loading/error/empty, Librarian read-only, and Admin create/edit states; risky delete/reassign/merge remains Phase 7.
- [x] D5-004 generated OpenAPI/API types, reconciled navigation/routes/contracts/docs, and completed Member D cross-lane intake integration.
- [x] D5-004 full verification passed: Prisma validate/generate, generated OpenAPI/client types, root lint, 12 API suites/47 tests, 10 web files/46 tests, root production builds, 6 API e2e suites/24 tests, and `git diff --check`.
- [x] Ralph THOROUGH architect verification approved; changed-files deslop and the complete post-deslop regression suite passed.

Member D Phase 5 is complete and integrated with the merged Member A/B/C lanes; full taxonomy deletion/reassignment/merge safeguards remain Phase 7.

## Phase 5 integrated result

- [x] Member A: persisted reader progress/bookmarks plus protected document decision/viewer fallback integration.
- [x] Member B: document list/detail/edit, PDF upload/replacement, metadata, and submit-to-processing foundations.
- [x] Member C: persisted processing transitions, approval queue/detail, notification list/read behavior, and staff workflow surfaces.
- [x] Member D: schema foundation, taxonomy reads and starter management, reusable selectors, role-aware staff shell, unified OpenAPI/client regeneration, and phase closure.
- [x] Canonical `/admin/documents/new` intake and Member D taxonomy selectors are used by the Phase 5 document workflow; `/admin/books` remains an explicit legacy route.
- [x] Integrated verification passed: Prisma validate/generate, unified OpenAPI/client generation, root lint, 15 API suites/68 tests, 11 web files/49 tests, root production builds, 6 API e2e suites/24 tests, and `git diff --check`.

### Phase 4 Member D verification

- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] Architect verification approved after adding route loading UI and dashboard-specific web tests.
- [x] Ralph deslop pass completed on changed files; post-deslop regression remained green.
