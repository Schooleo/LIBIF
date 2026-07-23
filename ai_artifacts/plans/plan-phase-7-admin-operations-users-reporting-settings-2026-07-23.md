# Phase 7 Plan — Reader POC Completion and Admin Operations

Date: 2026-07-23
Planning mode: repository-grounded execution plan
Phase owner / integration lane: Member D
Implementation status: ready for execution; implementation evidence must be added from fresh Phase 7 work

## Target Result and Stop Condition

Phase 7 must close the reader-facing POC gaps before expanding administrative breadth. The completed phase must deliver:

1. A usable catalogue with search/filter/pagination, clickable records, and a canonical detail view backed by a real detail contract.
2. One integrated reader viewer that renders authorized page images onto an HTML canvas, drives real page navigation/progress, and never embeds or offers the source PDF to Reader users.
3. Correct persisted bookmark state on catalogue detail, viewer, library, history, and bookmark surfaces.
4. Truthful content-protection language: canvas/page rendering deters casual copying and removes the native PDF toolbar/text layer, but it is not advertised as absolute DRM or screenshot prevention.
5. The already-planned administration goals: safe user administration, risky taxonomy commands, date-filtered reporting and bounded CSV, and supported settings.
6. OpenAPI/client contracts, seed data, navigation, canonical docs, and the full verification suite aligned with the implemented result.

Stop only when every **P0 Reader POC Gate** below passes, the admin acceptance criteria assigned for Phase 7 pass, generated artifacts match the runtime, and unresolved work is explicitly moved to Phase 8 rather than hidden behind placeholder UI or hard-coded state.

## Authoritative Inputs

- Team scope: `ai_artifacts/docs/team_backlog_80_90_completion.md`
- Architecture: `ai_artifacts/docs/architecture-alignment.md`
- Route inventory: `ai_artifacts/docs/screen-matrix.md`
- API registry: `ai_artifacts/docs/api-contracts.md`
- Workflow rules: `ai_artifacts/docs/workflow-state-machines.md`
- Reader planning skeletons:
  - `ai_artifacts/skeletons/api-modules/access/README.md`
  - `ai_artifacts/skeletons/api-modules/reader/README.md`
  - `ai_artifacts/skeletons/web-routes/reader-document-viewer/README.md`
  - `ai_artifacts/skeletons/web-routes/reader-library/README.md`
- Admin planning skeletons:
  - `ai_artifacts/skeletons/api-modules/users/README.md`
  - `ai_artifacts/skeletons/api-modules/taxonomy/README.md`
  - `ai_artifacts/skeletons/api-modules/reporting/README.md`
  - `ai_artifacts/skeletons/api-modules/settings/README.md`

## Repository-Grounded Entry Baseline

### Confirmed reader gaps

- `/catalogue` calls `fetchPublicBooks()` with an empty query and renders non-linked `DocumentCard` records. Existing backend pagination/filter/sort contracts are not exposed in the route.
- `/catalogue/[id]` loads the entire first catalogue page and finds the requested ID in memory. It has no authoritative public detail endpoint and initializes `BookmarkButton` with its default `false` state.
- `/documents/[id]/view` repeats the list-and-find lookup for the title and passes no persisted bookmark or reading-progress state into the viewer.
- `ProtectedDocumentViewer` obtains a raw PDF stream URL, embeds it with `<iframe>`, and exposes a `Download PDF` action. The native viewer permits download and text-layer selection when present.
- `ReadingProgressTracker` defaults to 100 pages and updates a separate page number without controlling the embedded PDF page.
- The UI currently claims watermark/DRM protection although it does not apply a watermark or DRM control. Phase 7 must remove unverifiable security claims.
- Bookmark writes are idempotent in `ReaderService`, and library/bookmark responses already contain state, but catalogue detail and viewer routes do not load that state.

### Stable inputs to extend

- Phase 6 is complete with an isolated BullMQ worker, private OCR artifact handling, exact file/job/review lineage, approval/correction commands, persisted notifications, reader publication/access integration, and reporting activity summaries.
- `CatalogModule` already supports published-only list filtering, category/tag filters, pagination, and deterministic sorting.
- `AccessModule` already owns access decisions and active-file resolution; it remains the owner of protected content delivery.
- `ReaderModule` already owns idempotent bookmark writes and persisted reading progress.
- `AuthModule`, `TaxonomyModule`, and `ReportingModule` remain the established owners for authentication, taxonomy, and read-only operational metrics.
- The Prisma `User` model still lacks deactivation and user-administration audit state; no persisted settings model exists.

## Priority and Scope

### P0 — Reader POC completion

- Catalogue discovery UI and canonical detail contract.
- Server-authorized page manifest and raster-page delivery.
- HTML canvas viewer with integrated navigation and progress.
- Removal of Reader raw-PDF/download paths and false DRM claims.
- Persisted bookmark/progress hydration and cross-route consistency.

### P1 — Existing Phase 7 administration goals

- `USR-001` user list/detail.
- `USR-002` guarded role changes.
- `USR-003` account deactivation/reactivation.
- `TAX-001/002/003` category delete/reassign and tag merge safeguards.
- `RPT-001` date-filtered dashboard/management summaries.
- `RPT-002` bounded safe CSV exports.
- `SET-001` persisted general settings and read-only deployment-managed security settings.
- Notification, document-filter, responsive, and accessibility polish in existing ownership lanes.

### Out of scope

- Claims of absolute DRM, screenshot prevention, or protection against a determined user inspecting delivered pixels/network traffic.
- Full-text OCR indexing/search, selectable OCR text overlays, semantic search, or ranking.
- Delivering the source PDF to a Reader-side PDF.js worker and calling that secure; the raw PDF would still reach the browser.
- A new microservice, database, general-purpose policy engine, or report-export worker.
- Production email/SMS/push providers.
- Editing deployment secrets or security TTLs from the browser.
- Phase 8 release hardening, exhaustive visual QA, and final demo scripting.

## Locked Reader Architecture

### Catalogue and reader state

- Add `GET /api/catalog/books/:documentId` for one published, reader-safe metadata record. It must return 404 for missing/unpublished records to public/Reader callers and must not expose object keys, processing internals, or staff audit fields.
- Keep list filtering/pagination on `GET /api/catalog/books`; the web route must encode search, category, tags, sort, view, and page in URL state.
- Add `GET /api/reader/documents/:documentId/state` for authenticated personalized state: `{ bookmarked, progress }`. Access eligibility remains authoritative in `AccessModule`.
- Catalogue cards/rows link to canonical `/catalogue/:documentId`. `/catalog` remains compatibility-only and must redirect without becoming a second implementation.
- Catalogue detail loads the detail, reader state, and access decision directly; it must not scan the first list page.

### Canvas rendering boundary

- Replace the raw-PDF iframe with server-side raster page delivery. Reuse the installed Poppler boundary to render an active PDF page to a bounded PNG/JPEG response or a private cached derivative.
- Add an authorized manifest route that returns only safe viewer data such as document ID, page count, dimensions/aspect ratios, and supported zoom bounds.
- Add an authorized page route, for example `GET /api/access/documents/:documentId/pages/:pageNumber`, that validates the current session/role and current document state on every request before returning an image.
- Do not return storage credentials, object keys, source-PDF URLs, or extracted OCR text to Reader callers.
- Reader UI must not show a download control. Any staff-only source-file download remains an explicit separately authorized staff capability, not a Reader viewer feature.
- The browser draws the returned page bitmap into `<canvas>`. Do not add a selectable text layer. Apply a session-aware visual watermark only if it can be tested and described truthfully.
- Page number, total pages, next/previous controls, keyboard navigation, loading/error/retry state, and reading progress must share one authoritative viewer state.
- Persist progress only after the corresponding page successfully renders; initialize from saved progress and clamp it to the manifest page count.
- Cache headers must prevent shared/public caching of protected page images. Logs must stay identifier-only and never record content or signed URLs.

### Bookmark consistency

- Server-rendered catalogue detail and viewer entry routes must pass the persisted `bookmarked` value to `BookmarkButton`.
- Bookmark add/remove remains idempotent. Optimistic UI must roll back on failure and reconcile all visible counters/cards.
- Returning to catalogue detail or viewer after a refresh must show the database state, not a component default.
- Tests must cover already-bookmarked, not-bookmarked, add, remove, repeated add/remove, failed mutation rollback, and cross-route refresh.

## Acceptance Criteria

### P0 Reader POC Gates

1. A Reader can search/filter/page through the catalogue and open every visible record through `/catalogue/:id`.
2. Detail loading uses a dedicated detail contract; a book beyond list page one remains directly viewable.
3. Unpublished/missing books do not leak metadata or content through catalogue detail, manifest, or page routes.
4. The viewer contains an HTML `<canvas>` renderer and no PDF `<iframe>`, `<embed>`, `<object>`, source-PDF URL, Reader download button, or selectable OCR/plain-text layer.
5. Reader network responses for the viewing flow contain page images/manifest data, not the source PDF or storage object key.
6. Page navigation changes the rendered page; saved progress uses the actual manifest page count and resumes at the saved page.
7. Direct requests for page zero, an out-of-range page, an unpublished book, an unauthorized user, or an expired/invalid authorization context fail safely.
8. Detail/viewer/library/history/bookmarks display the same persisted bookmark state after refresh, and failed optimistic updates roll back.
9. UI copy describes the protection as controlled canvas rendering/copy deterrence and does not claim DRM or screenshot prevention.
10. Reader POC tests include service/controller authorization, catalogue/detail route states, canvas interactions, bookmark hydration, progress integration, and a manual browser network inspection.

### Administration and integration criteria

11. Only Admins can administer users, mutate roles/status, execute risky taxonomy commands, view management analytics, export user data, or change settings.
12. Role/status changes require a reason, create immutable audit records, revoke sessions transactionally, and protect the current/last active Admin.
13. Deactivated users cannot sign in, resolve old sessions, or receive reset tokens; reactivation requires a new sign-in.
14. Category reassignment/delete and tag merge are atomic, reject invalid targets, and preserve associations exactly once.
15. Date filters use inclusive-start/exclusive-end UTC; CSV is authorized, capped, escaped, formula-safe, and deterministically ordered.
16. General settings persist in PostgreSQL; deployment-managed secrets and security values are clearly read-only.
17. Prisma validation/migration/generation, seed, lint, unit tests, builds, API e2e, worker regression, reader browser smoke, accessibility tests, and `git diff --check` pass.

## Lane Boundaries and Tasks

### Member A — Reader Experience and Access

Owned scope: `apps/api/src/modules/reader/**`, `apps/api/src/modules/access/**`, `apps/web/app/(reader)/**`, `apps/web/components/domain/reader/**`, and reader/access tests.

| ID | Task | Expected result | Validation |
|---|---|---|---|
| A7-001 | Canvas viewer contract and delivery | Authorized manifest/page-image APIs replace raw Reader PDF delivery | Access unit/e2e; content-type/cache/header assertions |
| A7-002 | Integrated canvas reader | One canvas controls rendering, page navigation, keyboard actions, real totals, retry states, and progress | Vitest canvas mocks; browser smoke |
| A7-003 | Bookmark/progress hydration | Detail/viewer initialize from persisted state and remain consistent across reader routes | Reader API + web interaction tests |
| A7-004 | Reader security truthfulness | Reader download/raw stream UI is removed and copy-protection copy is accurate | DOM assertions; manual network inspection |
| A7-005 | Responsive/accessibility pass | Reader POC works at compact widths with visible focus, labels, headings, and non-color status cues | axe + responsive smoke |

Stop when all P0 Reader POC Gates pass. Do not move canvas rendering to the client by downloading the source PDF.

### Member B — Documents, Upload, and Catalogue

Owned scope: `apps/api/src/modules/documents/**`, `apps/api/src/modules/catalog/**`, reader-safe catalogue DTOs, admin document routes, and document/catalog tests.

| ID | Task | Expected result | Validation |
|---|---|---|---|
| B7-001 | Public catalogue detail contract | Direct, published-only detail lookup replaces list scanning | Mapper/service/e2e tests |
| B7-002 | Catalogue discovery integration | Search/category/tag/sort/page/view URL state drives existing list contracts; records link to details | Query/route tests; browser smoke |
| B7-003 | Taxonomy mutation refresh | Catalogue/document surfaces refresh safely after category reassignment or tag merge | Contract/web tests |
| B7-004 | Optional safe bulk metadata | Implement only after written lifecycle preflight; otherwise record deferral | Transaction/auth tests or explicit deferral |

Stop when catalogue discovery/detail is functional and reader-safe. Do not add bulk processing/approval/publication commands.

### Member C — Processing, Approval, and Notifications

Owned scope remains processing, approval, notification modules/routes, and their tests.

| ID | Task | Expected result | Validation |
|---|---|---|---|
| C7-001 | Page-derivative lifecycle support | If caching raster pages, derivatives remain private, file-version scoped, and invalidated on replacement | Storage/worker integration tests |
| C7-002 | Notification-center polish | Recipient-scoped filters, mark-one/mark-all, pagination, and actionable states | API/web tests |
| C7-003 | Event-hook and approval confirmation audit | Notifications follow committed state; risky actions show consequences without changing Phase 6 transitions | Integration/a11y tests |

Stop without exposing OCR text or private object keys to the viewer. Prefer on-demand bounded rendering if derivative persistence is unnecessary for the POC.

### Member D — Admin Operations and Integration

Owned scope includes the single Phase 7 migration, `users`, `taxonomy`, `reporting`, and `settings` modules/routes, staff navigation, generated contracts, seed integration, and canonical docs.

| ID | Backlog | Task | Expected result |
|---|---|---|---|
| D7-000 | Foundation | Schema/migration/seed foundation | Deactivation, administration audit, and typed singleton settings persist before dependent work |
| D7-001 | USR-001 | User list/detail | Admin-only paginated users and safe detail/session/audit summaries |
| D7-002 | USR-002/003 | Role/status commands | Transactional role/status changes with self/last-admin guards and session revocation |
| D7-003 | TAX-001/002/003 | Risky taxonomy completion | Impact preview, safe delete/reassign, and tag merge with atomic safeguards |
| D7-004 | RPT-001 | Dashboard/management metrics | UTC date filters and Admin-only management summary |
| D7-005 | RPT-002 | CSV exports | Bounded, authorized, safely serialized document/user/activity exports |
| D7-006 | SET-001 | Settings | Persisted supported settings and read-only deployment configuration |
| D7-007 | Integration | Reader POC and phase closure | P0 gate coordination, module/nav wiring, OpenAPI/client generation, seed scenarios, docs, and full verification |

Stop when D7 tasks pass and the integrated P0 reader gates have fresh evidence. Administrative completeness cannot be used to waive a failing reader POC gate.

## Phase 7 Contract Outline

### Reader catalogue/state

- `GET /api/catalog/books` — existing paged/filtered published list.
- `GET /api/catalog/books/:documentId` — new published reader-safe detail.
- `GET /api/reader/documents/:documentId/state` — persisted bookmark/progress state.
- Existing bookmark mutation and progress routes remain stable.

### Protected canvas viewing

- Replace the Reader use of `POST .../view-token` plus raw `GET .../stream` with an authorized manifest/page-image contract.
- `GET /api/access/documents/:documentId/manifest` — safe page metadata.
- `GET /api/access/documents/:documentId/pages/:pageNumber` — authorized raster page response.
- Reader access to `POST .../download-token` and `GET .../file` is removed or denied by explicit role policy; staff source-file download, if retained, receives a separate documented contract.

### Users

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `POST /api/admin/users/:id/deactivate`
- `POST /api/admin/users/:id/reactivate`

### Taxonomy

- Existing reads/create/edit remain stable.
- Impact, unused-leaf delete, category reassign-and-delete, duplicate-tag review, and tag merge endpoints remain as previously planned.

### Reporting/settings

- Date-filtered librarian/management dashboard endpoints.
- Bounded documents/users/activity CSV endpoints.
- General settings GET/PATCH plus read-only security/deployment metadata.

## Merge Order

1. D7-000 schema/migration foundation.
2. A7/B7 contract freeze for catalogue detail, reader state, manifest/page images, and Reader download policy.
3. B7 catalogue detail/discovery implementation.
4. A7 protected page delivery, canvas viewer, bookmark/progress integration.
5. C7 private derivative support if the agreed viewer design needs persisted caches.
6. D7 user/settings, taxonomy, reporting/export work; independent slices may proceed in parallel after D7-000.
7. C7 notification/approval polish and remaining B7 document filters.
8. D7-007 generated artifacts, seeded browser scenarios, canonical docs, and full verification.

Do not merge a raw-PDF iframe or Reader download compatibility shortcut as an interim “canvas” solution.

## Verification Strategy

### Targeted reader gates

```bash
npm test -w apps/api -- access reader catalog
npm test -w apps/web -- catalogue ProtectedDocumentViewer BookmarkButton ReadingProgressTracker
npm run test:e2e -w apps/api -- --runInBand
```

Add browser/manual evidence that:

1. catalogue search/filter/page/detail works with a record beyond page one;
2. the viewer DOM contains canvas and no PDF iframe/embed/object/download action;
3. network responses expose image/manifest data rather than the source PDF/object key;
4. navigation renders the selected page and persists/resumes real progress;
5. an already-bookmarked record is shown as saved on detail and viewer after refresh;
6. denied/unpublished/out-of-range requests fail without content leakage.

### Full phase gate

```bash
npm run prisma:validate -w apps/api
npm run prisma:generate -w apps/api
npm run db:migrate:status -w apps/api
npm run db:seed -w apps/api
npm run openapi:generate
npm run lint
npm test
npm run build
npm run test:e2e -w apps/api -- --runInBand
npm run test:worker -w apps/api
git diff --check
```

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Client-side PDF.js still downloads the PDF | Source remains recoverable | Deliver server-rendered page images, not source bytes |
| Canvas is marketed as absolute DRM | False security expectation | Use copy-deterrence language and document screenshot/network limits |
| Raster rendering causes resource exhaustion | Availability risk | Validate page bounds, cap DPI/dimensions/concurrency, cache privately where justified |
| Stale page derivatives survive file replacement | Wrong/version-leaking content | Scope cache keys to file/version and invalidate on replacement |
| Bookmark defaults hide persisted state | Incorrect user trust signal | Add one-document state read and hydrate all entry routes |
| Catalogue detail scans one list page | Valid books appear missing | Add direct published-only detail endpoint |
| Admin breadth delays the POC | Demo-critical failure | Treat reader gates as P0 and allow independent P1 work only after contract freeze |
| Phase 7 destabilizes Phase 6 OCR | Regression | Keep full API/web/worker and privacy gates at closure |

## Phase 7 End Result

At completion, a Reader can discover a book, open a real detail page, see correct saved state, and read authorized pages through an integrated canvas experience without receiving a native PDF viewer, source-PDF download action, or selectable OCR text. Admins also gain the planned user, taxonomy, reporting/CSV, and supported-settings operations. Phase 8 can then focus on integration hardening, visual/accessibility QA, final e2e coverage, release notes, and demo readiness rather than repairing core POC behavior.

## Planning Completion Check

- [x] Reported catalogue, viewer, copy/download, progress, and bookmark problems are grounded in current code.
- [x] Reader POC completion is the P0 phase gate.
- [x] Canvas rendering uses server-authorized raster pages rather than client delivery of the source PDF.
- [x] Security limitations and truthful UI language are explicit.
- [x] Existing user/taxonomy/reporting/settings goals are preserved.
- [x] A/B/C/D ownership, merge order, contracts, risks, and verification are explicit.
- [ ] Implementation evidence will be appended only after Phase 7 execution begins.
