# Phase 7 Plan — Reader POC Completion and Admin Operations

Date: 2026-07-23
Planning mode: repository-grounded execution plan
Phase owner / integration lane: Member D
Implementation status: Waves 1–2 complete; Wave 3 parallel P0 implementation is next

## Target Result and Stop Condition

Phase 7 must close the reader-facing POC gaps before expanding administrative breadth. The completed phase must deliver:

1. A usable catalogue with search/filter/pagination, clickable records, and a canonical detail view backed by a real detail contract.
2. One integrated reader viewer that draws server-rendered, user/session-watermarked page images onto an HTML canvas, drives real page navigation/progress, and never embeds or offers the source PDF to Reader users.
3. Correct persisted bookmark state on catalogue detail, viewer, library, history, and bookmark surfaces.
4. Durable reader-access auditing, bounded rate/concurrency controls, and scrape detection make bulk extraction observable and enforceable without claiming absolute DRM or screenshot prevention.
5. The already-planned administration goals: safe user administration, risky taxonomy commands, date-filtered reporting and bounded CSV, and supported settings.
6. OpenAPI/client contracts, seed data, navigation, canonical docs, and the full verification suite aligned with the implemented result.

Stop only when every **P0 Reader POC Gate** below passes, the admin acceptance criteria assigned for Phase 7 pass, generated artifacts match the runtime, and unresolved work is explicitly moved to Phase 8 rather than hidden behind placeholder UI or hard-coded state.

## Authoritative Inputs

- Team scope: `ai_artifacts/docs/team_backlog_80_90_completion.md`
- Architecture: `ai_artifacts/docs/architecture-alignment.md`
- Route inventory: `ai_artifacts/docs/screen-matrix.md`
- API registry: `ai_artifacts/docs/api-contracts.md`
- Workflow rules: `ai_artifacts/docs/workflow-state-machines.md`
- Validated security research: `ai_artifacts/research/document-drm-and-screenshot-prevention-2026-07-23.md`
- Reader planning skeletons:
  - `ai_artifacts/skeletons/api-modules/access/README.md`
  - `ai_artifacts/skeletons/api-modules/reader/README.md`
  - `ai_artifacts/skeletons/api-modules/rendering/README.md`
  - `ai_artifacts/skeletons/web-routes/reader-document-viewer/README.md`
  - `ai_artifacts/skeletons/web-routes/reader-library/README.md`
- Admin planning skeletons:
  - `ai_artifacts/skeletons/api-modules/users/README.md`
  - `ai_artifacts/skeletons/api-modules/taxonomy/README.md`
  - `ai_artifacts/skeletons/api-modules/reporting/README.md`
  - `ai_artifacts/skeletons/api-modules/settings/README.md`
- Waves 1–2 implementation record:
  - `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`

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
- D7-000 now provides account lifecycle state, append-only user-administration and Reader-access facts, and typed singleton settings through one verified Phase 7 migration.
- Wave 2 code contracts are frozen for public catalogue detail, Reader document state, protected manifest/rate-limit responses, `ProtectedPageRenderer`, committed risk facts, Reader-access reporting, and safe general settings. Their planned HTTP routes remain absent until their owning Wave 3/P1 tasks implement controllers.

## Priority and Scope

### P0 — Reader POC completion

- Catalogue discovery UI and canonical detail contract.
- Server-authorized page manifest and raster-page delivery.
- Server-burned per-user/session/page watermarks and HTML canvas rendering with integrated navigation/progress.
- Removal of Reader raw-PDF/download paths and false DRM claims.
- Durable access auditing, rate/concurrency limits, scrape detection, staff alerts, and revocation evidence.
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

### Validated security position

- Absolute DRM and screenshot prevention are not technically achievable for visible documents on user-controlled hardware. Phase 7 implements controlled delivery, attributable deterrence, and abuse detection.
- Canvas alone is not DRM. Client-side PDF.js is rejected for the protected Reader path because it transfers renderable PDF bytes to the browser.
- The source PDF remains private. Reader callers receive only safe manifest data and individually watermarked raster pages.
- Managed browser, native capture controls, rights-managed PDF, or virtual-desktop enforcement are optional deployment tiers documented by the research artifact, not baseline browser guarantees.

### Catalogue and reader state

- Add `GET /api/catalog/books/:documentId` for one published, reader-safe metadata record. It must return 404 for missing/unpublished records to public/Reader callers and must not expose object keys, processing internals, or staff audit fields.
- Keep list filtering/pagination on `GET /api/catalog/books`; the web route must encode search, category, tags, sort, view, and page in URL state.
- Add `GET /api/reader/documents/:documentId/state` for authenticated personalized state: `{ bookmarked, progress }`. Access eligibility remains authoritative in `AccessModule`.
- Catalogue cards/rows link to canonical `/catalogue/:documentId`. `/catalog` remains compatibility-only and must redirect without becoming a second implementation.
- Catalogue detail loads the detail, reader state, and access decision directly; it must not scan the first list page.

### Raster rendering, watermark, and canvas boundary

- Replace the raw-PDF iframe with server-side raster page delivery. A new modular `RenderingModule`, owned by Member C, wraps Poppler page rendering and exports a narrow renderer contract to `AccessModule`; it must not boot a queue consumer or expose OCR text.
- Add an authorized manifest route that returns only safe viewer data such as document ID, page count, dimensions/aspect ratios, and supported zoom bounds.
- Add an authorized page route, for example `GET /api/access/documents/:documentId/pages/:pageNumber`, that validates the current session/role and current document state on every request before returning an image.
- Do not return storage credentials, object keys, source-PDF URLs, or extracted OCR text to Reader callers.
- Reader UI must not show a download control. Any staff-only source-file download remains an explicit separately authorized staff capability, not a Reader viewer feature.
- Member C may cache a private, unwatermarked raster base keyed by immutable `bookFileId + page + renderProfile`. Personalized output must never use a shared/public cache.
- Every served Reader page is watermarked server-side before delivery. The watermark includes a masked reader identifier, UTC timestamp, document/page reference, and opaque signed trace ID or QR code. The trace resolves to an audit record without exposing internal IDs or secrets in the bitmap.
- Watermark placement/opacity must remain readable without obscuring the document; multiple safe positions may be varied to make simple cropping harder. The watermark is deterrence and attribution, not screenshot prevention.
- The browser draws the returned watermarked bitmap into `<canvas>`. Do not add a selectable text layer or deliver the source PDF to PDF.js.
- Page number, total pages, next/previous controls, keyboard navigation, loading/error/retry state, and reading progress must share one authoritative viewer state.
- Persist progress only after the corresponding page successfully renders; initialize from saved progress and clamp it to the manifest page count.
- Personalized responses use `Cache-Control: private, no-store`; service workers must not cache them. Logs stay identifier-only and never record content, watermark PII, object keys, or signed URLs.

### Access auditing and scrape detection

- D7-000 adds an append-only `ReaderAccessEvent` model with bounded event types: `VIEWER_OPENED`, `PAGE_SERVED`, `PAGE_DENIED`, `RATE_LIMITED`, and `SCRAPE_SUSPECTED`.
- Minimum event fields are user, book, active file, optional page, occurred-at time, opaque session/trace fingerprint, decision/risk code, and bounded JSON metadata. Do not persist source content, object keys, full URLs, raw cookies/tokens, or raw IP/user-agent values.
- `AccessModule` owns authorization, synchronous audit writes, per-user/session/document counters, and the allow/deny decision. Successful Reader page delivery fails closed when authorization, watermark composition, or its required audit record cannot be established.
- Redis-backed sliding-window/concurrency limits detect page enumeration, impossible reading rate, excessive parallel requests, repeated out-of-range probes, and concurrent-session abuse. Thresholds are deployment-managed and may be exposed only as safe read-only settings metadata.
- A denied request returns a stable `429` with `Retry-After` when rate-limited, or the existing safe authorization/not-found response for other failures. Detection never reveals the threshold or internal risk score to the Reader.
- `NotificationsModule` consumes only committed `RATE_LIMITED`/`SCRAPE_SUSPECTED` facts to notify authorized staff without duplicating page content or sensitive identifiers.
- `ReportingModule` owns read-only access/security summaries. Phase 7 includes a bounded Admin-only reader-access report and CSV projection; it does not make raw high-volume audit records public.
- Retention and aggregation are documented before production rollout. The POC may persist each served page for proof, but production sizing must define partitioning/retention rather than assuming indefinite storage.

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
4. The viewer contains an HTML `<canvas>` renderer and no PDF `<iframe>`, `<embed>`, `<object>`, source-PDF URL, Reader download button, client-side PDF.js source path, or selectable OCR/plain-text layer.
5. Reader network responses contain safe manifest data and individually server-watermarked page images, not the source PDF, unwatermarked personalized response, OCR text, or storage object key.
6. Page navigation changes the rendered page; saved progress uses the actual manifest page count and resumes at the saved page.
7. Direct requests for page zero, an out-of-range page, an unpublished book, an unauthorized user, or an expired/invalid authorization context fail safely.
8. Detail/viewer/library/history/bookmarks display the same persisted bookmark state after refresh, and failed optimistic updates roll back.
9. Every successful page response maps to a durable access event and an opaque watermark trace; audit records contain no document content, secrets, raw tokens, object keys, or raw IP/user-agent values.
10. Rate/concurrency limits return stable denials, record `RATE_LIMITED`/`SCRAPE_SUSPECTED`, and produce deduplicated staff alerts; normal sequential reading is not falsely blocked.
11. UI copy describes protection as controlled, traceable canvas rendering/copy deterrence and does not claim absolute DRM or screenshot prevention.
12. Reader POC tests include authorization, watermark uniqueness/traceability, audit writes, rate/concurrency boundaries, scrape alerts, catalogue/detail states, canvas interactions, bookmark hydration, progress integration, and manual browser network inspection.

### Administration and integration criteria

13. Only Admins can administer users, mutate roles/status, execute risky taxonomy commands, view management/security analytics, export user data, or change settings.
14. Role/status changes require a reason, create immutable audit records, revoke sessions transactionally, and protect the current/last active Admin.
15. Deactivated users cannot sign in, resolve old sessions, or receive reset tokens; reactivation requires a new sign-in.
16. Category reassignment/delete and tag merge are atomic, reject invalid targets, and preserve associations exactly once.
17. Date filters use inclusive-start/exclusive-end UTC; CSV is authorized, capped, escaped, formula-safe, and deterministically ordered.
18. General settings persist in PostgreSQL; deployment-managed secrets, watermark signing material, and scrape thresholds are clearly read-only.
19. Prisma validation/migration/generation, seed, lint, unit tests, builds, API e2e, worker regression, reader browser smoke, accessibility tests, and `git diff --check` pass.

## Lane Boundaries and Tasks

### Workload model

- Weights are planning points: `S=1`, `M=2`, `L=3`. They indicate comparative effort, not elapsed days.
- Planned totals are Member A `11`, Member B `11`, Member C `10`, and Member D `12`. Member D carries phase integration but no longer owns taxonomy implementation or page-rendering internals.
- One member owns each write surface. Cross-lane work happens through frozen DTO/service ports and explicit handoffs; no member edits another lane's implementation to “help.”
- P0 contract freeze and D7-000 land first. After that, A/B/C implementation streams and D administration streams may proceed in parallel.

### Wave-by-wave member focus

Members work only in the current wave unless the dependency and handoff named below are complete. A task may begin early when marked parallel, but it is counted complete only at the wave gate. Contract producers fix their own surfaces; consumers do not patch another lane to unblock themselves.

| Wave | Status / gate | Member A focus | Member B focus | Member C focus | Member D focus |
|---|---|---|---|---|---|
| 1 — Foundation | **Complete.** Migration deployed, seeded, and proven in isolation. | Review access-event needs; no schema edits. | Review catalogue metadata needs; no schema edits. | Review file/version needs; no schema edits. | **D7-000 complete:** account lifecycle, immutable administration facts, bounded `ReaderAccessEvent`, typed singleton settings, migration/seed/tests. |
| 2 — Contract freeze | **Complete.** Frozen shapes are recorded in `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`. | Freeze manifest, page-delivery, stable 429, Reader-state, audit-write, and committed-risk shapes. | Freeze `PublicBookDetailDto` and published-only lookup semantics. | Freeze `ProtectedPageRenderer`, render profiles, image result, watermark input, and trace fingerprint. | Freeze Prisma enums/models, Reader-access report DTOs, safe settings DTOs, handoff matrix, and canonical documentation. |
| 3 — Parallel P0 build | **Complete.** Published catalogue/detail, renderer, users-read, and settings-persistence prerequisites are merged. | A7-001/A7-004/A7-002/A7-003 implementation supplied the protected delivery, enforcement, canvas, and state inputs. | B7-001/B7-002 supplied published-only detail and catalogue discovery/navigation. | C7-001/C7-002 supplied the renderer/cache/watermark baseline. | D7-001 read routes and D7-004 persistence are live; generated-client/web closure remains deferred to D7-005. |
| 4 — P0 integration | **Complete.** Protected Reader, committed-risk alerts, Reader-access reporting/CSV, and deterministic seed evidence are integrated; full closure evidence is recorded in `ai_artifacts/docs/phase-7-wave-4-p0-integration.md`. | Integrated B/C outputs; Reader source-PDF routes are denied; canvas/state and end-to-end enforcement are live. | Catalogue/detail defects required by the Reader path are reconciled; the lane now enters regression-only support. | **C7-003 complete:** committed high-risk facts create deduplicated, safe staff alerts. | Reader-access **D7-003** projection/CSV and trace/risk seed scenarios are live without moving allow/deny ownership into Reporting. |
| 5 — Parallel P1 administration | **Active.** Member D's backend lane is complete; other member slices continue independently. | Reader regression, accessibility, and integration fixes only; no new administration scope. | **B7-003 → B7-004 → B7-005**; risky taxonomy transactions, UI reconciliation, then documented bulk-action decision. | **C7-004**; notification/read-state and approval-confirmation polish. | **Complete:** D7-001/D7-002 user reads and transactional role/status commands, D7-003 bounded dashboards/CSV, and D7-004 settings routes/capability metadata; evidence is in `ai_artifacts/docs/phase-7-wave-5-member-d-administration.md`. |
| 6 — Cross-lane security gate | All P0/P1 task tests must be green; failures return to the owning lane. | Prove authorization, fail-closed audit/detectors, sequential-reading allowance, canvas/state behavior, and Reader PDF/download denial. | Prove published-only detail, catalogue navigation, taxonomy atomicity, and no unsafe metadata exposure. | Prove real-PDF bounds, unique watermark/trace resolution, private cache isolation/invalidation, and alert deduplication. | Prove migration/status invariants, reporting/CSV safety, settings boundaries, full regression, worker/OCR privacy, and evidence reconciliation. |
| 7 — Phase closure | Starts only after Wave 6 evidence is accepted. | Freeze Reader routes and provide final smoke evidence. | Freeze catalogue/taxonomy routes and provide final smoke evidence. | Freeze renderer/notification routes and provide final smoke evidence. | **D7-005:** one OpenAPI/client regeneration, module/navigation/seed/docs reconciliation, final verification, and Phase 8 handoff. |

#### Current member instruction

- **Member A:** Wave 5 is Reader regression/accessibility/integration-fix support only; do not add administration scope.
- **Member B:** begin B7-003, then B7-004/B7-005 after the named taxonomy handoffs and transaction tests.
- **Member C:** begin C7-004 notification/read-state and approval-confirmation polish; preserve Wave 4 alert deduplication.
- **Member D:** Wave 5 backend work is complete. Preserve the frozen runtime contracts and support regressions only until the Wave 6 gate; keep generated-client refresh, staff navigation/Admin-page reconciliation, and full phase closure in D7-005.

### Member A — Reader Session, Access, and Viewer

Owned scope: `apps/api/src/modules/reader/**`, `apps/api/src/modules/access/**`, `apps/web/app/(reader)/**`, `apps/web/components/domain/reader/**`, and reader/access tests. Member A consumes, but does not implement, Member C's renderer.

| ID | Weight | Task | Expected result | Validation |
|---|---:|---|---|---|
| A7-001 | M | Protected page contract | Session-guarded manifest/page APIs call the renderer port and remove Reader raw-PDF/download access | Access unit/e2e; role and response-header assertions |
| A7-002 | L | Integrated canvas reader | One canvas controls watermarked page rendering, keyboard navigation, real totals, retry states, and progress | Vitest canvas mocks; browser smoke |
| A7-003 | M | Bookmark/progress hydration | Detail/viewer initialize from persisted state and remain consistent across reader routes | Reader API + web interaction tests |
| A7-004 | M | Audit and scrape enforcement | Access writes required events, applies Redis rate/concurrency rules, returns stable denials, and emits committed risk facts | Boundary/concurrency/fail-closed tests |
| A7-005 | M | Truthful responsive accessibility | No raw-download/false-DRM copy; controls work at compact widths with visible focus and an explicit accessible-rendition decision | DOM/axe/responsive/manual network checks |

Handoff: A freezes `ProtectedPageRenderer` input/output needs with C and access-event DTOs with D before controllers merge. Stop when A's P0 gates pass without importing Poppler/OCR internals.

### Member B — Catalogue, Taxonomy, and Document Metadata

Owned scope: `apps/api/src/modules/catalog/**`, `apps/api/src/modules/documents/**`, `apps/api/src/modules/taxonomy/**`, reader-safe catalogue DTOs, `/admin/categories`, `/admin/tags`, admin document routes, and their tests. This is an explicit Phase 7 transfer of risky taxonomy implementation from Member D.

| ID | Weight | Task | Expected result | Validation |
|---|---:|---|---|---|
| B7-001 | M | Public catalogue detail | Direct published-only lookup replaces first-page list scanning | Mapper/service/e2e tests |
| B7-002 | L | Catalogue discovery | Search/category/tag/sort/page/view URL state drives existing contracts and every record opens canonical detail | Query/route/browser tests |
| B7-003 | L | Risky taxonomy transactions | Impact preview, safe category delete/reassign, and tag duplicate/merge commands preserve associations atomically | Transaction/auth/concurrency tests |
| B7-004 | M | Taxonomy/document UI reconciliation | Confirmation UI and catalogue/document surfaces refresh without stale category/tag labels | Contract/a11y/web tests |
| B7-005 | S | Bulk-action decision | Bounded metadata-only bulk work receives a written safe preflight or an explicit Phase 8 deferral | Preflight plus tests/deferral |

Handoff: B publishes catalogue-detail DTOs to A and taxonomy contract changes to D for the single generated-client refresh. Stop without adding bulk processing/approval/publication commands.

### Member C — Secure Rendering, Alerts, and Notifications

Owned scope: new `apps/api/src/modules/rendering/**`, rendering/storage tests, `apps/api/src/modules/notifications/**`, notification routes/components, and approval confirmation polish. C may touch processing only for private derivative invalidation hooks, not for Reader authorization.

| ID | Weight | Task | Expected result | Validation |
|---|---:|---|---|---|
| C7-001 | L | Bounded Poppler renderer | `RenderingModule` exports `ProtectedPageRenderer`, validates page/profile bounds, and produces raster bases without OCR text | Unit/integration tests with real PDFs |
| C7-002 | L | Server-burned watermark/cache lifecycle | Every personalized page has a unique traceable watermark; base derivatives stay private/file-version scoped and invalidate on replacement | Pixel/trace/cache/replacement tests |
| C7-003 | M | Risk-alert notification integration | Committed scrape/rate facts produce deduplicated staff notifications without content or sensitive identifiers | Notification integration tests |
| C7-004 | M | Notification/approval polish | Read/unread pagination and risky approval confirmations improve without broadening Phase 6 transitions | API/web/a11y tests |

Handoff: C exports only the renderer port/result and consumes only committed risk facts. Stop without owning access decisions, raw Reader routes, or schema migration files.

### Member D — Schema, Users, Reporting, Settings, and Integration

Owned scope: the single Phase 7 migration; `users`, `reporting`, and `settings` modules/routes; reader-security reporting projections; staff navigation; generated contracts; seed integration; canonical docs. D coordinates taxonomy contracts but Member B owns taxonomy implementation.

| ID | Weight | Backlog | Task | Expected result |
|---|---:|---|---|---|
| D7-000 | L | Foundation | Schema/migration/seed | User deactivation/admin audit, `ReaderAccessEvent`, and typed settings persist before dependent work |
| D7-001 | M | USR-001 | User list/detail | Admin-only paginated users and safe detail/session/audit summaries |
| D7-002 | L | USR-002/003 | Role/status commands | Transactional commands with self/last-admin guards, session revocation, and immutable events |
| D7-003 | M | RPT-001/002 | Operations/security reporting | UTC dashboards plus bounded safe document/user/activity/reader-access CSV and scrape summaries |
| D7-004 | S | SET-001 | Settings | Persisted product settings and safe read-only deployment security/watermark/rate metadata |
| D7-005 | S | Integration | Phase closure | Module/nav wiring, contract generation, seed scenarios, research/docs reconciliation, and full verification |

Handoff: D lands D7-000 before A writes audit events, publishes reporting/settings DTOs, then performs one unified OpenAPI/client refresh after A/B/C contracts freeze. Stop only when P0 reader gates and P1 administration goals have fresh evidence.

### Cross-lane handoff matrix

| Producer | Consumer | Frozen handoff | Ownership rule |
|---|---|---|---|
| Member D | Member A | `ReaderAccessEvent` schema/enums/indexes and generated Prisma client | A writes events through AccessModule; D does not implement page controllers |
| Member B | Member A | Public catalogue detail DTO and published-only lookup semantics | A consumes detail/state; no list scanning or B-file edits |
| Member C | Member A | `ProtectedPageRenderer` port, bounded raster result, watermark trace result | A never imports Poppler, cache, or watermark implementation classes |
| Member A | Member C | Committed `RATE_LIMITED`/`SCRAPE_SUSPECTED` fact shape | C creates alerts only after committed facts; no duplicate detector |
| Member A | Member D | Access event/risk semantics and seeded security scenarios | D owns read-only reporting projections, not allow/deny logic |
| Members A/B/C | Member D | Frozen OpenAPI DTO/route surface | D regenerates shared clients once; feature lanes never hand-edit generated files |

If a handoff shape changes after freeze, its producer updates tests and notifies every listed consumer before merge. Shared-file conflict or ownership expansion returns to Member D integration instead of being resolved by silent cross-lane edits.

## Phase 7 Contract Outline

### Reader catalogue/state

- `GET /api/catalog/books` — existing paged/filtered published list.
- `GET /api/catalog/books/:documentId` — new published reader-safe detail.
- `GET /api/reader/documents/:documentId/state` — persisted bookmark/progress state.
- Existing bookmark mutation and progress routes remain stable.

### Protected canvas viewing

- Replace the Reader use of `POST .../view-token` plus raw `GET .../stream` with an authorized manifest/page-image contract.
- `GET /api/access/documents/:documentId/manifest` — safe page metadata.
- `GET /api/access/documents/:documentId/pages/:pageNumber` — authorized, individually watermarked raster response.
- Reader access to `POST .../download-token` and `GET .../file` is removed or denied by explicit role policy; staff source-file download, if retained, receives a separate documented contract.
- Rate-limit responses use stable `429` + `Retry-After`; authorization/not-found responses remain non-leaking.

### Reader security audit/reporting

- `ReaderAccessEvent` persists bounded viewer/page/denial/rate/scrape facts and opaque watermark traces.
- `GET /api/admin/reports/reader-access?from&to&risk` returns an Admin-only bounded summary/projection.
- `GET /api/admin/reports/reader-access.csv?from&to&risk` follows the same CSV authorization, escaping, formula-safety, ordering, and row-cap rules as other exports.

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

1. **D7-000 foundation — complete** — one migration for user administration, `ReaderAccessEvent`, and settings; Prisma generation and isolated migration proof.
2. **P0 contract freeze — complete** — A defines access/event needs, B freezes catalogue detail, C freezes `ProtectedPageRenderer`, and D freezes audit/reporting DTOs. Frozen shapes are recorded in `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`.
3. **Parallel P0 implementation — complete** — catalogue detail/discovery, bounded rendering/watermark/cache, access/audit/rate enforcement/canvas, and users/settings foundations are merged.
4. **P0 integration gate — complete** — protected Reader, committed-risk alerts, Reader-access reporting, and seeded trace/risk scenarios are integrated.
5. **Parallel P1 implementation — active** — Member D users/reporting/settings backend is complete; B taxonomy, C notification polish, and A regression support continue in their owned lanes.
6. **Cross-lane security gate — next after Wave 5** — real-PDF rendering, watermark uniqueness/trace resolution, fail-closed audit, rate/concurrency/scrape behavior, source-PDF denial, and OCR privacy regression.
7. **D7-005 closure** — one OpenAPI/client regeneration, navigation/seed/docs reconciliation, full repository verification, and Phase 8 handoff.

Do not merge a raw-PDF iframe or Reader download compatibility shortcut as an interim “canvas” solution.

## Verification Strategy

### Targeted reader gates

```bash
npm test -w apps/api -- access reader catalog
npm test -w apps/api -- rendering notifications reporting
npm test -w apps/web -- catalogue ProtectedDocumentViewer BookmarkButton ReadingProgressTracker
npm run test:e2e -w apps/api -- --runInBand
```

Add browser/manual evidence that:

1. catalogue search/filter/page/detail works with a record beyond page one;
2. the viewer DOM contains canvas and no PDF iframe/embed/object/download action;
3. network responses expose image/manifest data rather than the source PDF/object key;
4. two users/sessions receive visibly and cryptographically distinct watermarks for the same page, and each trace resolves to the correct audit record;
5. navigation renders the selected page and persists/resumes real progress;
6. an already-bookmarked record is shown as saved on detail and viewer after refresh;
7. normal sequential reading stays allowed while burst enumeration, excessive concurrency, repeated invalid pages, and parallel sessions trigger stable denials/audits/deduplicated alerts;
8. denied/unpublished/out-of-range requests fail without content leakage;
9. Reader raw stream/download endpoints are absent or role-denied, and no service worker/browser cache retains personalized pages.

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
| Personalized watermark leaks identity | Privacy/safety risk | Use masked identifier plus opaque trace; document policy/retention and avoid secrets/internal IDs |
| Shared cache returns another user's watermark | Cross-user privacy leak | Cache only private unwatermarked bases; compose per request; send `private, no-store` |
| Audit or Redis failure creates an unmonitored path | Bulk exfiltration risk | Fail closed for Reader page delivery outside explicit local-only test fixtures |
| Scrape threshold blocks legitimate readers | Accessibility/usability harm | Seed realistic thresholds, use `Retry-After`, test sequential/assistive workflows, and provide reviewed recovery |
| Per-page audit grows without bound | Cost/operations risk | Define bounded metadata, indexes, retention, aggregation, and production sizing before rollout |
| Stale page derivatives survive file replacement | Wrong/version-leaking content | Scope cache keys to file/version and invalidate on replacement |
| Bookmark defaults hide persisted state | Incorrect user trust signal | Add one-document state read and hydrate all entry routes |
| Catalogue detail scans one list page | Valid books appear missing | Add direct published-only detail endpoint |
| Admin breadth delays the POC | Demo-critical failure | Treat reader gates as P0 and allow independent P1 work only after contract freeze |
| Phase 7 destabilizes Phase 6 OCR | Regression | Keep full API/web/worker and privacy gates at closure |

## Phase 7 End Result

At completion, a Reader can discover a book, open a real detail page, see correct saved state, and read individually watermarked authorized pages through an integrated canvas without receiving a native PDF viewer, source-PDF download action, or selectable OCR text. Page access is durably traceable, bulk scraping is rate/concurrency controlled and alertable, and protection language remains truthful about screenshot/camera limits. Admins also gain the planned user, taxonomy, reporting/CSV, and supported-settings operations.

## Planning Completion Check

- [x] Reported catalogue, viewer, copy/download, progress, and bookmark problems are grounded in current code.
- [x] Reader POC completion is the P0 phase gate.
- [x] Canvas rendering uses server-authorized raster pages rather than client delivery of the source PDF.
- [x] Validated DRM research is recorded and consumed by the plan.
- [x] Server-burned watermarks, access auditing, rate/concurrency controls, scrape detection, and staff alerts have explicit ownership and tests.
- [x] Security limitations and truthful UI language are explicit.
- [x] Existing user/taxonomy/reporting/settings goals are preserved.
- [x] A/B/C/D ownership, weighted workload, write boundaries, handoffs, merge order, contracts, risks, and verification are explicit.
- [x] Wave 1 D7-000 is implemented as one migration with seed integration, database constraints, append-only triggers, and isolated PostgreSQL proof.
- [x] Wave 2 code contracts and handoff ownership are frozen and recorded without falsely claiming planned routes as live.
- [x] Wave 1–2 regression passes: empty Prisma diff, migration/seed, lint, 20 API suites/91 tests, 15 web files/62 tests, builds, 8 API e2e suites/36 tests, worker suite/5 scenarios, OpenAPI/client generation, and diff checks.
- [x] Wave 3 parallel P0 implementation is merged across catalogue/detail, protected access, renderer, canvas/state, users-read, and settings-persistence prerequisites.
- [x] Wave 4 P0 integration is complete: no Reader source-PDF route, server-watermarked raster pages on canvas, persisted state, Redis-backed enforcement, bounded audits, deduplicated staff alerts, Reader-access report/CSV, and deterministic seed evidence.
- [ ] Wave 5 parallel administration is next; Wave 6 security verification and D7-005 contract/docs closure remain gated.
