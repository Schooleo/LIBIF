# LIBIF Progress Checklist

Last updated: 2026-07-23

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
- [x] Phase 6 processing/OCR worker, approval/correction, durable notifications, reader publication/access integration, and reporting activity closure.

## Seeded local accounts

Run `make db-seed` or `npm run db:seed` after migrations.

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@libif.local` | `admin libif dev passphrase` | Full current role permissions. |
| Librarian | `librarian@libif.local` | `librarian libif dev passphrase` | Staff intake/admin book access. |
| Reader | `reader@libif.local` | `reader libif dev passphrase` | Reader role and catalogue/library permission baseline. |

Development-header auth remains available only with explicit local opt-in through `LIBIF_ENABLE_DEV_AUTH=true` and `NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH=true`.

## Verified command set for latest completed phase

Latest Phase 6 closure verification:

- [x] `npx prisma validate --schema apps/api/prisma/schema.prisma`
- [x] `npm run prisma:generate -w apps/api`
- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test` — 15 API suites/82 tests and 15 web files/62 tests.
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api` — 7 suites/30 tests.
- [x] `npm run test:worker -w apps/api` — 1 suite/5 infrastructure-backed scenarios.
- [x] `git diff --check`
- [x] Phase 6 closure committed in `c807bbc` (`fix: make Phase 6 worker closure trustworthy`).

Historical Phase 4 integration verification:

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
- [x] Phase 5 closure fixes verified after authenticated intake/replacement/requeue repair and current-work queue de-duplication: 72 API unit tests, 54 web tests, 24 API e2e tests, lint, builds, and `git diff --check`.

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
- [x] Approval APIs: current pending queue/detail foundations with one current review row per document.
- [x] Notification persistence: recipient-scoped Prisma reads/writes, unread count, read state, and staff/reader UI integration.

## Remaining high-level work

- [ ] Production password-reset email provider.
- [x] Reader module and reader discovery/personal library foundations from Phase 4.
- [x] Protected document decision/token handoff and persisted reading progress/bookmarks integration.
- [x] Upload/Documents boundary and document metadata workflow foundation.
- [x] Processing worker implementation and retry history, including real PDF extraction/OCR, exact lineage, duplicate-delivery protection, and infrastructure-backed tests.
- [x] Approval decision/correction loop and persisted notifications, including approve/reject/request-correction, resubmission reuse, publication fanout, and recipient ownership.
- [ ] Taxonomy risky actions (delete/reassign/merge), user administration, role changes, and deactivation. Starter category/tag list/create/edit is complete.
- [ ] Dashboards, reports, exports, and settings. Phase 4 Member D completed the base dashboard summary only; report exports/settings remain deferred.
- [ ] Reader POC completion: functional catalogue discovery/detail, server-rendered user/session-watermarked pages drawn on canvas, integrated real-page progress, no Reader raw-PDF/download surface, correct bookmark hydration, durable access auditing, and scrape/rate/concurrency enforcement.
- [ ] Cross-screen integration hardening and responsive/visual QA.

## Next execution target

Phase 6 is verified and committed. The canonical next plan is `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md`, mirrored under `.omx/plans/` with Member D PRD/test-spec artifacts. Phase 7 treats Reader POC completion as P0: catalogue discovery/detail, server-rendered watermarked pages on canvas, integrated real-page progress, removal of Reader raw-PDF/download paths, persisted bookmark hydration, durable access events, and scrape/rate/concurrency enforcement. Existing user administration, taxonomy safeguards, date-filtered reporting, bounded CSV, supported settings, and notification/document polish remain in scope.

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
- [x] Member C: persisted processing transitions, current approval queue/detail, notification API/UI foundations, and staff workflow surfaces; the Phase 5 notification-storage handoff was resolved in Phase 6.
- [x] Member D: schema foundation, taxonomy reads and starter management, reusable selectors, role-aware staff shell, unified OpenAPI/client regeneration, and phase closure.
- [x] Canonical `/admin/documents/new` intake and Member D taxonomy selectors are used by the Phase 5 workflow; `/admin/books` is compatibility-only and no longer appears in primary staff navigation or staff sign-in routing.
- [x] Intake, replacement, and requeue browser mutations use the authenticated API boundary; replacement/requeue supersede stale work, and processing/approval queue projections show one current row per document while history remains available through lifecycle records.
- [x] Integrated verification passed: Prisma validate/generate, unified OpenAPI/client generation, root lint, 15 API suites/72 tests, 13 web files/54 tests, root production builds, 6 API e2e suites/24 tests, and `git diff --check`.
- [x] The Phase 5 notification persistence gap was transferred to Phase 6 and is now resolved by Prisma-backed recipient-scoped notification reads/writes.

## Phase 6 planning

- [x] Comprehensive Phase 6 plan written to `ai_artifacts/plans/plan-phase-6-processing-approval-correction-notifications-2026-07-22.md` and mirrored under `.omx/plans/`.
- [x] D6-000 schema/OCR-lineage foundation: migration `20260722062955_phase6_processing_foundation`, exact file/job/review lineage, explicit terminal states, retry numbering/self-reference, durable artifact metadata, current-work constraints, generated contracts, and isolated Phase 5 backfill verification.
- [x] D6-000 verification: Prisma validate/generate/migrate/status, OpenAPI/client generation, 72 API unit tests, and 7 API e2e suites/28 tests including four migration/backfill constraint scenarios.
- [x] C6 worker closure completed: isolated worker bootstrap, atomic duplicate claim, active-file cancellation/supersession guards, real embedded-text/Vietnamese OCR extraction, safe corrupt-PDF failure, retry/history, approval commands, and durable notification fanout.
- [x] B6 correction/resubmission and document workflow history are merged through the existing document edit/replace/requeue commands.
- [x] A6 publication visibility and reader notification integration are merged.
- [x] D6-001 contract registry reconciliation, D6-002 activity reporting, D6-003 staff unread-count integration, and D6-004 generated contract refresh are implemented.
- [x] Phase 6 worker/OCR closure gate now proves Redis delivery, MinIO input/output, PostgreSQL state, duplicate delivery, cancellation, supersession, embedded extraction, scanned Vietnamese OCR, and corrupt failure without synthetic success.

### Phase 6 Member D verification — 2026-07-23

- [x] D6-000 isolated migration/backfill/constraint e2e: 4/4 passed with PostgreSQL running.
- [x] Reporting unit tests: 4/4 passed.
- [x] Reporting e2e: 3/3 passed.
- [x] Dashboard/staff-shell targeted web tests: 18/18 passed.
- [x] Generated OpenAPI/client contracts include activity DTOs, notification unread-count/action/read fields, access `CORRECTION_REQUIRED`, and string date-time fields.
- [x] Full non-worker repository gate: Prisma validate/generate, root lint, 15 API unit suites/82 tests, 15 web files/62 tests, root production builds, 7 API e2e suites/30 tests, and `git diff --check`.
- [x] `npm run test:worker -w apps/api`: 1 suite / 5 infrastructure-backed scenarios passed.
- [x] Phase 6 closure re-verification: OpenAPI/client generation, Prisma validation/generation/migration status, lint, 15 API unit suites/82 tests, 15 web files/62 tests, API/web builds, 7 API e2e suites/30 tests, 1 worker suite/5 scenarios, and `git diff --check` passed.
- [x] Phase 6 OCR privacy hardening migration `20260723050000_phase6_ocr_privacy_hardening` purges legacy `textPreview` values; new worker artifacts keep plaintext only in the private derived object.
- [x] Redis processing payloads/logs contain IDs only, OCR object keys are resolved from PostgreSQL, temporary files use private permissions, and abandoned OCR workspaces are cleaned on worker startup.
- [x] POC privacy smoke: paused-queue inspection proved an identifier-only Redis payload, the uploaded fixture reached `PENDING_APPROVAL`, artifact metadata was null, the MinIO bucket denied anonymous policy reads, and no OCR temp directory remained.
- [x] Post-hardening verification: root lint, 17 API suites/86 tests, 15 web files/62 tests, API/web builds, 7 API e2e suites/31 tests, 1 worker suite/5 scenarios, migration status, Make dev supervision probes, privacy scans, and `git diff --check` passed.

## Phase 7 planning

- [x] Canonical team plan written to `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md` and mirrored under `.omx/plans/`.
- [x] Member D Ralph prerequisites written to `.omx/plans/prd-phase-7-member-d.md` and `.omx/plans/test-spec-phase-7-member-d.md`.
- [x] Repository audit confirmed the current catalogue lacks functional detail navigation/state, the viewer embeds and downloads the raw PDF, its page tracker is disconnected and hard-coded, and detail/viewer bookmark controls default to unsaved.
- [x] Phase 7 locks a server-authorized raster-page/HTML-canvas viewer boundary and explicitly rejects native PDF embedding, Reader source-file download, selectable OCR text, and false absolute-DRM claims.
- [x] Validated research recorded at `ai_artifacts/research/document-drm-and-screenshot-prevention-2026-07-23.md`; Phase 7 now requires server-burned traceable watermarks, append-only Reader access events, Redis-backed scrape/rate/concurrency controls, and deduplicated staff alerts.
- [x] Phase 7 workload is explicitly balanced by planning points: A=11 access/viewer, B=11 catalogue/taxonomy, C=10 rendering/alerts, D=12 schema/users/reporting/settings/integration.
- [x] Phase 7 locks one D7-000 schema migration, transactional user/taxonomy safeguards, bounded synchronous CSV instead of a second worker subsystem, and explicit persisted-versus-deployment-managed settings boundaries.
- [x] Wave 1 / D7-000 implemented in `20260723143000_phase7_administration_reader_security_foundation`: active/deactivated accounts, immutable user-administration events, bounded append-only Reader access facts, and typed singleton settings.
- [x] Wave 1 isolated PostgreSQL proof passes 1 suite / 5 tests, including backfill, audit immutability, non-content Reader columns, event constraints, and singleton settings.
- [x] Wave 2 frozen code contracts cover public catalogue detail, Reader state, manifest/429 shapes, `ProtectedPageRenderer`, committed risk facts, Reader-access reporting, and product-owned settings.
- [x] Wave 1–2 evidence and ownership handoffs are recorded in `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`.
- [x] Wave 1–2 full regression: migration deploy/status and seed, empty Prisma diff, root lint, 20 API suites/91 tests, 15 web files/62 tests, API/web/shared builds, 8 API e2e suites/36 tests, worker suite/5 scenarios, OpenAPI/client generation, and `git diff --check`.
- [x] The canonical plan now dispatches every member by Wave 1–7 with task IDs, dependency gates, handoffs, current focus, and explicit cross-lane stop boundaries.
- [x] Member C's Wave 3 C7-001/C7-002 renderer baseline is merged into `dev` and this branch; root `AppModule` still does not import `RenderingModule`, which remains an Access-owned integration handoff.
- [x] Member D Wave 3 users backend is live at `GET /api/admin/users` and `GET /api/admin/users/:userId`; D7-004 product-settings persistence and normalization are implemented without generated-client churn.
- [x] The Wave 3 contract exception is explicit: runtime users routes are not generated-client-ready, and the unchanged OpenAPI/client hashes preserve D7-005 as the single cross-lane refresh.
- [ ] `GET/PATCH /api/admin/settings/general` remains gated on Member A's tested watermark-signing and scrape-protection capability source; no hard-coded or inferred capability state is published.
- [ ] Reader page/detail/state routes remain pending; no protected Reader manifest/raster route is marked live yet.
- [x] Member D Wave 3 regression: root lint; 29 API suites/124 tests; 15 web files/62 tests; API/web/shared builds; 9 API e2e suites/41 tests; worker OCR/privacy suite/5 scenarios; Prisma validate/status; unchanged schema, migrations, rendering, OpenAPI, and generated client; `git diff --check`; architect approval; and post-cleanup re-verification.

### Phase 4 Member D verification

- [x] `npm run openapi:generate`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run test:e2e -w apps/api`
- [x] Architect verification approved after adding route loading UI and dashboard-specific web tests.
- [x] Ralph deslop pass completed on changed files; post-deslop regression remained green.

## Phase 6 Member B progress

- [x] Added `ApprovalReviewSummaryDto` to `document-detail.dto.ts`.
- [x] Extended `DocumentDetailResponseDto` with `processingHistory`, `approvalHistory`, and `latestApprovalReview`.
- [x] Updated `listDocuments` and `getDocumentDetail` queries to fetch full `approvalReviews` and all `jobs` (removed `take: 1`).
- [x] `mapDocumentDetail` populates `processingHistory`, `approvalHistory`, and `latestApprovalReview`.
- [x] `submitProcessing` audit message distinguishes resubmission from first-time queuing.
- [x] Added `ApprovalHistoryTimeline` and `CorrectionNotice` to `components/domain/documents/documents.tsx`.
- [x] `DocumentMetadataForm` accepts and renders `correctionNotice` prop.
- [x] `/admin/documents/[id]` shows `CorrectionNotice` banner and `ApprovalHistoryTimeline` when correction is required.
- [x] `/admin/documents/[id]/edit` passes `correctionNotice` through `EditDocumentClient` to `DocumentMetadataForm`.

### Phase 6 Member B verification

- [x] `npm test -w apps/api` — 44/44 passed, 13 suites (including 2 new approval/resubmission tests).
- [x] `npm run lint` — clean.
- [x] `npm run build` — all workspaces build cleanly.
- [x] OpenAPI/client regeneration completed by Member D Phase 6 integration.
