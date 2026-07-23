# Phase 6 Plan — Processing Worker, Approval, Correction, and Notifications

Date: 2026-07-22  
Planning mode: `$plan` direct  
Phase owner / integration lane: Member D unless the team assigns a separate integrator

## Requirements Summary

Phase 6 turns the Phase 5 lifecycle foundations into a real operational workflow: a queued PDF is processed by an independently runnable worker, OCR output is persisted, retry/cancel/supersession behavior is auditable, reviewers can approve/reject/request correction, librarians can correct and resubmit, and affected users receive persisted actionable notifications.

This plan consumes rather than rebuilds the Phase 5 contracts:

- The canonical backlog assigns Phase 6 to processing, approval, correction, and notification completion (`ai_artifacts/docs/team_backlog_80_90_completion.md:265-300`).
- The detailed backlog already identifies processing state, worker, retry/cancel, status UI, approval queue/actions, and notification persistence/UI as `PRC-001` through `NTF-002` (`ai_artifacts/docs/team_backlog_80_90_completion.md:404-415`).
- The processing queue currently produces BullMQ `book-uploaded` jobs but has no consumer (`apps/api/src/modules/processing/processing.queue.ts:6-25`).
- Current processing advancement is a guarded manual simulation that moves queued jobs to OCR and then directly to completion (`apps/api/src/modules/processing/processing.service.ts:48-133`).
- Approval currently provides only current queue/detail reads (`apps/api/src/modules/approval/approval.controller.ts:17-31`).
- The Prisma `Notification` model exists, but `NotificationsService` still stores records in a process-local array (`apps/api/prisma/schema.prisma:268-284`; `apps/api/src/modules/notifications/notifications.service.ts:5-47`).
- Recent Phase 5 closure fixes route intake, replacement, and requeue mutations through the authenticated API boundary; replacement/requeue supersede older active work, clear stale pending approvals, and expose only the latest operational job/review per document.

## Phase 5 Entry Baseline

The following are stable inputs to Phase 6 and must not be reimplemented:

- Canonical staff document intake is `/admin/documents/new`; legacy `/admin/books` remains compatibility-only and is absent from primary staff navigation.
- `DocumentsService` and `UploadService` validate/store PDFs, create file versions, create processing jobs, and enqueue `BookUploadedEvent` payloads.
- `ProcessingJob` persists status, stage, progress, attempts, safe error details, and lifecycle timestamps.
- Processing queue/detail/actions and approval queue foundations exist under `/admin/processing`, `/admin/processing/[id]`, and `/admin/approvals`.
- Replacement and manual requeue supersede earlier queued/running work and remove stale pending approvals before creating new work.
- Approval queue reads are current-work projections: only documents in `PENDING_APPROVAL` appear, with one latest pending review per document.
- Reader access, bookmarks, reading progress, document metadata/file versions, audit events, taxonomy, authentication, and role guards are already persisted.
- Full verification at Phase 5 closure passes: root lint, 72 API unit tests, 54 web tests, root production builds, and 24 API e2e tests.

## Phase 6 Scope

### In scope

1. A real BullMQ worker entry point and deterministic processing orchestrator.
2. PDF validation, text extraction/OCR, persisted output artifacts, progress, failure, cancellation, supersession, and retry lineage.
3. Removal of manual `advance` as a production workflow control; retain it only behind an explicit development/test gate if still needed.
4. Approval detail plus approve, approve-and-publish, reject, and request-correction commands.
5. Librarian correction and resubmission flow for metadata and/or replacement PDF.
6. Database-backed notifications, read state, authorized action links, and event-driven fanout.
7. Reader availability/notification updates after publication or correction outcomes.
8. Processing, approval, correction, notification, and audit history surfaces aligned with Stitch references.
9. One Phase 6 schema foundation migration, one integration-time OpenAPI/client regeneration, and one phase-end verification pass.

### Out of scope

- Category deletion/reassignment and tag duplicate/merge workflows (Phase 7).
- User administration, role changes, account deactivation, settings, management analytics, and report exports (Phase 7).
- Production email/SMS/push providers; Phase 6 persists in-app notifications and defines a delivery port only.
- Distributed microservices or separate databases. The worker remains part of the NestJS modular-monolith codebase and coordinated deployment boundary.
- Advanced OCR model training, handwriting recognition, semantic search, ranking tuning, or document-layout AI.
- Permanent removal of `BooksModule`; that remains a dedicated compatibility migration.

## Phase 6 Acceptance Criteria

1. With PostgreSQL, Redis, and MinIO running, uploading or requeuing a valid PDF creates exactly one current processing job for the active file version and a worker consumes it without a manual transition command.
2. The worker records monotonic stage/progress updates for validation, text extraction/OCR, and indexing/finalization, then finishes in `SUCCEEDED`, `FAILED`, `CANCELLED`, or `SUPERSEDED` without leaving the document in an impossible status.
3. Digital PDFs use text extraction first; scanned/low-text PDFs use the approved OCR adapter. OCR output is persisted against the exact `BookFile` version and never attached to a superseded file.
4. Retry creates or records explicit lineage, never retries a superseded file version, respects a bounded attempt policy, and exposes retry history through API/UI.
5. Cancellation/supersession prevents a queued payload from mutating document, approval, or notification state after it becomes obsolete.
6. Successful processing creates exactly one pending approval round for the processed file version.
7. Authorized reviewers can approve, approve-and-publish, reject, or request correction; commands are idempotent or reject repeated/stale decisions with stable errors.
8. Correction requests require a reason and requested changes, move the document into a correction state, and notify the responsible staff member.
9. A librarian can update requested metadata and/or replace the PDF, resubmit, and create a new auditable processing/review round without duplicate queue entries.
10. Publication makes the document reader-eligible through existing Access/Catalog contracts and produces persisted notifications without exposing unpublished files.
11. Notifications survive API restarts, are recipient-scoped, enforce ownership on read actions, and expose safe typed action links.
12. OpenAPI JSON and frontend generated types match all new commands/read models.
13. Phase-end validation passes: Prisma validate/generate/migration, OpenAPI generation, lint, unit tests, builds, API e2e, worker integration tests, web accessibility/smoke tests, and `git diff --check`.

## Locked Architecture Decisions

### Worker process boundary

- Add a dedicated worker bootstrap in the API workspace, for example `apps/api/src/worker.main.ts`, using the same Nest modules/configuration but no HTTP listener.
- Add `start:worker`/`dev:worker` scripts and a Docker Compose worker service after the runtime image exists.
- Keep queue production in `ProcessingQueue`; add a BullMQ consumer/processor under `apps/api/src/modules/processing/**`.
- The worker must load the authoritative `ProcessingJob` and active `BookFile` before every irreversible stage and exit without side effects when status/file version is cancelled or superseded.

### OCR dependency decision gate

- Implement an `OcrEngine` port and a deterministic fake for tests before choosing the runtime adapter.
- Preferred runtime path: native `pdftotext` for digital text extraction, then Tesseract OCR for scanned/low-text pages through a controlled process adapter.
- Before adding binaries/packages, Member C must record supported OS/container versions, Vietnamese and English language packs, timeout/memory limits, licensing, and failure mapping. No frontend or route handler may spawn OCR processes.
- If the native toolchain cannot be made reproducible in the project runtime, stop the OCR adapter slice and use the port with a documented integration blocker; do not falsely mark simulated advancement as OCR completion.

### Persistence and lineage

- A Phase 6 schema migration must associate each processing job and approval round with the exact `BookFile` version.
- Retry history must be queryable without overloading a mutable `attempts` counter; use explicit retry lineage/attempt records or a well-defined self-reference.
- Add explicit terminal semantics for cancellation/supersession rather than encoding them indefinitely as generic failures.
- Persist extracted text/artifact metadata with checksum, language, page count, and source file identity. Search indexing may remain a bounded finalization adapter, but successful processing must prove durable output exists.
- Enforce one current processing job and one current pending approval round per document/file through transactional invariants and database constraints where PostgreSQL/Prisma supports them.

### Event and notification boundary

- Events are past-tense facts carrying IDs, not mutable UI payloads.
- Processing completion invokes exported approval/notification services or internal events; modules must not reach across boundaries with ad hoc table reads.
- Notification actions store an allowlisted route/entity reference, not arbitrary external URLs.
- Reader notifications are emitted only after publication/access eligibility is committed.

## Phase 6 Lane Boundaries

### Member A — Reader Experience and Access

**Primary lane:** reader-visible availability transitions and notification consumption after approval/publication.

Owned files/directories:

- `apps/api/src/modules/reader/**`
- `apps/api/src/modules/access/**`
- `apps/web/app/(reader)/**`
- `apps/web/components/domain/reader/**`
- Reader/access tests

Do not edit directly:

- Processing/approval/notification mutation internals owned by Member C.
- Document correction mutations owned by Member B.
- Prisma schema/migrations or generated clients until the integration handoff.

#### Member A tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| A6-001 | Reader publication refresh | Existing reader catalogue/detail/access decisions reflect publish/reject/correction outcomes without stale authorization | `apps/api/src/modules/access/**`, `apps/api/src/modules/reader/**` | Access policy unit tests; reader e2e before/after publish |
| A6-002 | Reader notification consumption | Reader receives and reads persisted document-available notices through typed adapters | reader API consumers/routes, notification domain component reuse | Recipient isolation tests; web interaction tests |
| A6-003 | Safe notification actions | Reader notification action opens only authorized catalogue/viewer destinations and rechecks access | reader notification/action components | Invalid/stale action test; access-denied e2e |
| A6-004 | Reader lifecycle regressions | Processing/correction/rejected documents remain unavailable; published document becomes available after committed approval | reader/access tests | State matrix unit/e2e coverage |

#### Member A stop condition

Stop when reader-visible access changes only from committed backend lifecycle state, notifications are persisted and recipient-scoped, and no notification link bypasses AccessModule.

### Member B — Document, Upload, and Correction

**Primary lane:** correction requests, metadata/PDF repair, resubmission, and document-level workflow history.

Owned files/directories:

- `apps/api/src/modules/documents/**`
- `apps/api/src/modules/upload/**`
- `apps/web/app/(admin)/admin/documents/**`
- `apps/web/components/domain/documents/**`
- `apps/web/components/domain/upload/**`
- Document/upload/correction tests

Do not edit directly:

- Worker and approval decision internals owned by Member C.
- Reader access behavior owned by Member A.
- Prisma schema/migrations unless D6-000 explicitly assigns a coordinated change.

#### Member B tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| B6-001 | Correction read contract | Document detail exposes current correction request, requested fields/file action, review round, and audit history | document DTO/service/controller additions | Service/controller contract tests |
| B6-002 | Correction workspace | `/admin/documents/[id]/corrections` presents requested changes and safe metadata/PDF correction actions | admin document routes and domain panels | Web states/accessibility tests |
| B6-003 | Transactional resubmission | Resubmit validates correction state, uses active file/version, supersedes stale work, and creates one new processing round | documents/upload services and DTOs | Unit/e2e correction-resubmit tests |
| B6-004 | Document history | Detail shows file versions, processing attempts, approval rounds, correction reasons, actors, and timestamps without mixing current queue state with history | document detail DTO/UI, `AuditTimeline` | Projection tests; web smoke |
| B6-005 | Legacy compatibility boundary | Keep `/admin/books` compatibility isolated and document removal prerequisites; do not revive it in navigation or new workflows | legacy routes/docs only | Redirect/compatibility tests |

#### Member B stop condition

Stop when a correction request can be understood, repaired, and resubmitted from the canonical document workflow with exact file/review lineage and no cross-module business rules in React.

### Member C — Processing, Approval, and Notifications

**Primary lane:** actual worker execution, transition policy, approval decisions, notification persistence/fanout, and their staff UI.

Owned files/directories:

- `apps/api/src/modules/processing/**`
- `apps/api/src/modules/approval/**`
- `apps/api/src/modules/notifications/**`
- `apps/api/src/worker.main.ts`
- `apps/web/app/(admin)/admin/processing/**`
- `apps/web/app/(admin)/admin/approvals/**`
- `apps/web/app/(admin)/admin/notifications/**`
- `apps/web/components/domain/processing/**`
- `apps/web/components/domain/approval/**`
- `apps/web/components/domain/notifications/**`
- Processing/approval/notification tests

Do not edit directly:

- Upload/storage persistence except through exported Member B contracts.
- Reader UI/access policy beyond exported events/DTOs consumed by Member A.
- Prisma schema/migrations unless coordinated with D6-000.
- Shared UI primitives unless a missing primitive is separately assigned.

#### Member C tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| C6-001 / PRC-001 | Authoritative transition policy | One service/policy validates queued/running/stage/terminal/retry/cancel/supersede transitions | processing service/policy and DTOs | Table-driven transition tests |
| C6-002 / PRC-002 | Worker entry point | BullMQ worker consumes `book-uploaded`, checks authoritative job/file state, and runs the processing orchestrator | `worker.main.ts`, processing processor/orchestrator | Worker smoke with Redis; idempotency tests |
| C6-003 | Text extraction/OCR adapter | Digital extraction plus OCR fallback produces durable file-version-scoped text/artifact metadata | processing ports/adapters; storage integration | Fixture tests for text/scanned/corrupt PDFs; timeout tests |
| C6-004 / PRC-003 | Retry, cancel, and history | Retry/cancel operate on eligible current jobs, preserve lineage, and never revive superseded files | processing service/controller/history DTO | Unit/e2e retry/cancel/supersede tests |
| C6-005 / PRC-004 | Live processing UI | Queue supports current-work filters; detail polls boundedly and renders real stages, attempts, errors, terminal outcomes, and history | processing routes/components | Vitest/accessibility; polling cleanup test |
| C6-006 / APR-001 | Approval review detail | Review route loads document metadata, active processed file, OCR summary, prior rounds, and allowed commands | approval service/DTO; approval `[id]` route | API/web contract tests |
| C6-007 / APR-002 | Approval commands | Approve, publish, reject, and request-correction enforce roles, state, reason rules, file/review freshness, audit, and idempotency | approval controller/service/action DTO | Transition/auth e2e tests |
| C6-008 / NTF-001 | Notification persistence | Replace process-local array with Prisma reads/writes and recipient ownership checks | notifications service/controller | Restart/persistence and cross-user denial tests |
| C6-009 / NTF-002 | Notification fanout/UI | Processing, approval, correction, resubmission, and publication events create deduplicated actionable notices | notification service/events/routes/components | Event integration and web interaction tests |

#### Member C stop condition

Stop when a worker—not a human transition button—processes queued PDFs, every terminal path is persisted and auditable, approval/correction commands are guarded, and notifications survive restart without leaking across recipients.

### Member D — Schema Foundation, Audit Read Models, and Integration

**Primary lane:** Phase 6 schema migration ownership, cross-lane event/DTO integration, audit/activity projections, generated contracts, documentation, and merge hygiene.

Owned files/directories:

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/**` for the single Phase 6 foundation migration
- `apps/api/src/modules/reporting/**` for activity/read-model touchups only
- Admin navigation/header notification integration when it consumes Member C contracts
- `apps/api/openapi/libif-api.json`
- `apps/web/lib/generated/api-types.ts`
- `ai_artifacts/**` Phase 6 docs/checklists/plans

Do not edit directly:

- Member A/B/C feature internals except conflict resolution or explicitly assigned integration wiring.
- Shared UI primitives unless separately approved.
- OCR/process adapters owned by Member C.

#### Member D tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| D6-000 | Schema and migration foundation | File-scoped jobs/reviews, explicit terminal semantics, retry lineage, OCR artifact persistence, and constraints exist before feature work | Prisma schema plus one migration | Prisma validate/migrate/generate; data backfill test |
| D6-001 | Event/contract registry | Cross-lane events and command/result DTO ownership are documented before parallel implementation | Phase 6 plan, workflow/API docs | Contract review; no duplicate event shapes |
| D6-002 | Audit/activity summary | Dashboard/document projections expose processing/approval/correction activity without owning commands | reporting read model and DTO | Projection/unit tests |
| D6-003 | Staff notification integration | Header/sidebar badge or count consumes Member C notification contract without duplicating navigation | layout integration only | Role/responsive/accessibility tests |
| D6-004 | Phase integration PR | Merge lanes in order, resolve shared module imports, regenerate OpenAPI/client once, update artifacts, and run full verification | generated files and canonical docs | Complete phase command set |

#### Member D stop condition

Stop when the migration and generated contracts are authoritative, all lanes merge without ownership drift, audit/read-model integration is verified, and Phase 7 gaps are explicitly recorded.

## Phase 6 Merge Order

1. **D6-000 schema-foundation PR.** Add/backfill file/review lineage, explicit terminal statuses, retry lineage, and OCR artifact persistence. Every lane rebases on it.
2. **C6-001 transition/event contracts.** Stabilize state policy and event payloads without enabling the worker yet.
3. **C6-008 notification persistence.** Remove the in-memory service early so all later fanout is durable.
4. **C6-002/C6-003 worker and OCR adapters.** Land worker/orchestrator plus deterministic fixtures before UI claims real progress.
5. **C6-004 retry/cancel/history.** Complete operational recovery against actual worker behavior.
6. **C6-006/C6-007 approval detail/actions.** Consume successful processing artifacts and file-scoped review rounds.
7. **B6 correction/resubmission.** Consume approval correction contracts and enqueue a new file-scoped processing round.
8. **A6 reader availability/notifications.** Consume committed publication and persisted notification behavior.
9. **C6 staff UI deepening.** Polling, filters, approval decisions, notification actions, and history after backend contracts stabilize.
10. **D6-002/D6-003 read-model and shell integration.** Add activity summaries and notification count without command ownership.
11. **D6-004 final integration PR.** Regenerate OpenAPI/client once, update artifacts, execute end-to-end phase verification, and record Phase 7 handoff.

Generated contracts and Prisma files must not be independently regenerated/edited across member branches. Route generated-file conflicts through D6-004.

## Agent Rules for Phase 6

Every implementation prompt must include:

```text
You are Member [A/B/C/D] implementing Phase 6 task [ID].

Read first:
- ai_artifacts/prompts/Agent_Prompt.md
- ai_artifacts/docs/team_backlog_80_90_completion.md
- ai_artifacts/plans/plan-phase-6-processing-approval-correction-notifications-2026-07-22.md
- relevant ai_artifacts/skeletons/**/README.md files
- relevant Phase 6 Stitch screenshots/code.html as read-only references

Edit only:
- [exact owned directories/files]

Do not edit:
- other member lanes
- shared UI primitives unless explicitly assigned
- Prisma schema/migrations unless assigned D6-000
- generated OpenAPI/client files unless assigned D6-004
- unrelated docs

Worker rule:
- Queue consumers must re-read authoritative job/file state before side effects.
- Never report OCR success unless durable output for the exact active file version exists.
- Never access Redis, storage, OCR binaries, or PostgreSQL from Next.js.

Validation required:
- Run targeted unit/integration tests for the assigned lane.
- Report exact commands, results, and known environment/toolchain gaps.
```

## Skeletons and Stitch References

### Member A

- `ai_artifacts/skeletons/api-modules/access/README.md`
- `ai_artifacts/skeletons/api-modules/reader/README.md`
- `ai_artifacts/skeletons/web-routes/reader-document-viewer/README.md`
- `ai_artifacts/skeletons/components/reader/README.md`
- Stitch: `action_notification_detail`, `librarian_correction_notification`, `published_success`

### Member B

- `ai_artifacts/skeletons/api-modules/documents/README.md`
- `ai_artifacts/skeletons/api-modules/upload/README.md`
- `ai_artifacts/skeletons/web-routes/admin-documents/README.md`
- `ai_artifacts/skeletons/components/documents/README.md`
- `ai_artifacts/skeletons/components/upload/README.md`
- Stitch: `correction_requested`, `correction_review_resubmit`, `rejected_document_correction`, `replace_pdf`, `resubmitted_review`

### Member C

- `ai_artifacts/skeletons/api-modules/processing/README.md`
- `ai_artifacts/skeletons/api-modules/approval/README.md`
- `ai_artifacts/skeletons/api-modules/notifications/README.md`
- `ai_artifacts/skeletons/web-routes/admin-processing/README.md`
- `ai_artifacts/skeletons/web-routes/admin-approvals/README.md`
- `ai_artifacts/skeletons/web-routes/admin-notifications/README.md`
- `ai_artifacts/skeletons/components/processing/README.md`
- `ai_artifacts/skeletons/components/approval/README.md`
- `ai_artifacts/skeletons/components/notifications/README.md`
- Stitch: `processing_queue*`, `processing_job_*`, `processing_quick_detail_drawer`, `retrying_history`, `approval_queue`, `approval_review`, `approval_confirmation_modal`, `rejection_correction_modal`, `notification_centre`

### Member D

- `ai_artifacts/skeletons/api-modules/reporting/README.md`
- `ai_artifacts/skeletons/components/reporting/README.md`
- Existing `AdminNavigation` and staff shell contracts only for notification-count integration

## Implementation Sequence

1. **Preflight and dependency decision**
   - Validate the Phase 5 database and run the complete baseline suite.
   - Approve the native OCR/runtime toolchain and container support before adding dependencies.
   - Define sample fixtures: digital-text PDF, scanned Vietnamese PDF, corrupt PDF, oversized PDF, and superseded replacement.

2. **Schema and contract foundation**
   - Apply D6-000 and backfill existing jobs/reviews to their best-known active file version with an explicit migration report.
   - Generate Prisma client only; defer OpenAPI/client regeneration to integration.
   - Freeze event names, DTO ownership, and terminal-state mapping.

3. **Durable notification and processing core**
   - Replace notification in-memory storage.
   - Implement transition policy, worker bootstrap, processor, OCR/text adapter, idempotency checks, and durable artifacts.
   - Prove restart, duplicate delivery, stale payload, cancellation, and supersession behavior.

4. **Approval and correction commands**
   - Add file-scoped approval rounds and guarded decisions.
   - Add correction read/resubmit contracts and transactional audit/notification fanout.
   - Prove repeated/stale commands cannot publish or create duplicate pending work.

5. **UI integration**
   - Replace manual production advancement with bounded polling and real job state.
   - Build approval detail/actions, correction/resubmission, retry history, and actionable notifications using shared primitives and Stitch references.
   - Keep current queue projections separate from document/job/review history.

6. **Reader and reporting integration**
   - Refresh reader access/catalog state after publication.
   - Add safe reader notifications and staff activity/read-model summaries.

7. **Integration and closure**
   - Merge in the declared order.
   - Regenerate OpenAPI/client once.
   - Run the full Phase 6 command set and an actual upload-to-OCR-to-approval/correction scenario.
   - Update progress, architecture, API, screen, component, workflow, and backlog artifacts with evidence rather than planned claims.

## Verification Plan

### Per-lane minimums

- Member A: access policy state matrix; reader notification ownership/action tests; publish visibility e2e.
- Member B: correction DTO/service/controller tests; metadata-only and PDF-replacement resubmission e2e; document history projection tests.
- Member C: transition table tests; worker unit/integration tests; OCR fixture tests; duplicate-delivery/idempotency; retry/cancel/supersede e2e; approval command/auth tests; notification restart/ownership tests; UI interaction/accessibility tests.
- Member D: Prisma validate/migration/backfill/generate; reporting projections; navigation notification-count accessibility; generated contract diff review; full phase suite.

### Phase-end commands

```bash
npx prisma validate --schema apps/api/prisma/schema.prisma
npm run prisma:generate -w apps/api
npm run openapi:generate
npm run lint
npm test
npm run build
npm run test:e2e -w apps/api
git diff --check
```

Add a reproducible worker integration command before Phase 6 implementation closes, for example:

```bash
npm run test:worker -w apps/api
```

The worker gate must exercise Redis queue delivery, MinIO input/output, PostgreSQL state, duplicate delivery, cancellation, supersession, and at least one deterministic OCR fixture. A mocked `advance` endpoint is not acceptable evidence of OCR integration.

### Required end-to-end scenarios

1. Digital PDF upload -> worker extraction -> persisted artifact -> pending approval -> publish -> reader access/notification.
2. Scanned Vietnamese PDF upload -> OCR fallback -> persisted artifact -> approval.
3. Corrupt PDF -> failed job with safe error -> eligible retry or final failure.
4. Replace PDF while queued/running -> old payload cannot mutate state -> new file/version succeeds.
5. Request correction -> librarian metadata/PDF repair -> resubmit -> new processing/review round -> approve/publish.
6. Unauthorized Reader/other staff cannot run processing/approval commands or read another user's notification.
7. API/worker restart preserves jobs, approval rounds, correction state, and notification read state.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Native OCR/PDF binaries differ across developer/CI/runtime environments | Pipeline passes locally but cannot deploy | Approve/version the toolchain first; containerize; add startup health diagnostics and fixture smoke tests |
| BullMQ delivers a job more than once | Duplicate artifacts, approvals, or notifications | Idempotency key per job/file/stage; transactional transition guards; duplicate-delivery tests |
| Replacement/cancel races with a running worker | Old file publishes or creates approval | Re-read job/file state before each side effect; explicit superseded/cancelled terminal states; file-scoped constraints |
| OCR consumes excessive CPU/memory/time | API degradation or stuck workers | Dedicated worker process, concurrency limits, per-job timeout, page/file caps, safe failure mapping |
| Notification persistence remains falsely documented | Lost notices after restart | Make NTF-001 an early merge gate and add restart/ownership tests |
| Approval and correction commands drift across modules | Impossible lifecycle states | One approval transition policy; exported events/services; state table tests; no React business rules |
| Schema backfill cannot identify exact historical file | Incorrect lineage | Deterministic best-known backfill with a fail-loud migration guard when a job/review cannot be mapped; never attach it silently |
| Manual `advance` remains usable in production | False OCR success | Remove it or guard it behind explicit non-production configuration; e2e asserts production denial |
| Full-text indexing expands Phase 6 uncontrollably | Phase stalls | Persist OCR artifacts and a bounded indexing adapter; defer advanced search/ranking to a separately planned slice |

## Phase 6 End Result

At Phase 6 completion:

1. A librarian uploads or replaces a PDF and does not manually advance processing.
2. A real worker validates and extracts/OCRs the exact active file version, persists output, and reports truthful progress/failure.
3. Staff can inspect current jobs separately from retry/history records and safely retry or cancel eligible work.
4. A reviewer can approve/publish, reject, or request correction with required reasons and audit evidence.
5. A librarian can correct and resubmit without duplicate jobs or approval rows.
6. Notifications are persisted, recipient-scoped, actionable, and survive restart.
7. Readers gain access only after publication and see relevant availability notifications.
8. Generated contracts and canonical artifacts accurately describe what is implemented and what remains for Phase 7.

Phase 6 is not complete if OCR is simulated, notifications remain process-local, stale queue payloads can mutate newer file versions, approval decisions are UI-only, or the correction loop requires manual database edits.

## D6-000 Implementation Record — 2026-07-22

D6-000 is complete on the Phase 5 Member D integration PR and is the mandatory base for the remaining Phase 6 lanes.

- Migration `20260722062955_phase6_processing_foundation` deterministically normalizes file versions, maps legacy jobs to their best-known source file, numbers attempts, links retry/supersession lineage, maps reviews to successful jobs/files, and fails loudly when safe mapping is impossible.
- `ProcessingJobStatus` now distinguishes `CANCELLED` and `SUPERSEDED`; `ApprovalReviewStatus` preserves superseded rounds; `BookStatus` includes `CORRECTION_REQUIRED` for the correction loop.
- `ProcessingArtifact` persists derived-object identity, checksum, language, page count, extraction method, and exact job/file ownership. This is storage metadata only; no OCR worker is claimed.
- Partial unique indexes enforce one active file, one current queued/running job, and one pending approval per document. Composite foreign keys prevent jobs, reviews, or artifacts from crossing file/document lineage.
- Range/self-reference constraints protect file versions, progress, attempt/round numbers, artifact sizes/pages, and direct retry/supersession self-links.
- Intake, replacement, requeue, cancellation, manual transition, dashboard counts, DTOs, OpenAPI, and frontend generated types were updated to consume the new foundation without implementing later Member A/B/C commands.
- Verification includes an isolated migration test that creates a Phase 5 schema, seeds stale/duplicate lifecycle rows, applies D6-000, verifies the backfill, and proves uniqueness, foreign-key, and range constraints.

## D6-001 through D6-004 Integration Record — 2026-07-23

Member D completed the integration-owned Phase 6 surfaces:

- D6-001 reconciled live workflow ownership, endpoint contracts, and architecture boundaries in the canonical docs without introducing a separate event bus.
- D6-002 extended the existing librarian dashboard with read-only grouped processing/approval/correction counts and ten newest `BookAuditEvent` rows; unit, API e2e, web rendering, empty-state, and axe coverage were added.
- D6-003 integrated the recipient-scoped unread count into the single shared desktop/mobile staff navigation with zero/high-count and failure-fallback coverage.
- D6-004 corrected Swagger/runtime shape drift for unread count, date-time fields, and `CORRECTION_REQUIRED`; regenerated the OpenAPI JSON and frontend path types; and removed the temporary raw-fetch integration in favor of the generated client.
- D6-000 re-verification passed all four isolated migration/backfill/constraint scenarios after PostgreSQL was started.
- Fresh non-worker integration verification passed Prisma validation/generation, root lint, 15 API unit suites/82 tests, 15 web files/62 tests, production builds, 7 API e2e suites/30 tests, and `git diff --check`.

## Worker/OCR Closure Record — 2026-07-23

The remaining Phase 6 blockers are resolved:

- `worker.main.ts` now boots an isolated `WorkerModule`; the HTTP `AppModule` no longer starts a BullMQ consumer.
- The processor atomically claims a queued job, rejects mismatched lineage, rechecks cancellation/replacement state around side effects, uses job-scoped artifact keys, and emits `APPROVAL_REQUESTED` only after durable success.
- `PdftotextOcrEngineAdapter` validates PDFs with Poppler, returns embedded text when present, renders scanned pages for local Tesseract.js Vietnamese/English OCR, and fails corrupt or unreadable input without synthetic success.
- `npm run test:worker -w apps/api` exercises real Redis queue delivery, MinIO source/artifact objects, PostgreSQL lifecycle state, duplicate delivery, cancelled payloads, replaced-file supersession, embedded text, scanned Vietnamese OCR, and corrupt-PDF failure.
- CI has a dedicated worker-integration job that starts the Docker Compose infrastructure, installs Poppler, and runs the same gate.

Phase 6 closure is now supported by reproducible worker evidence rather than a mocked advance endpoint.
