# Team Backlog for 80-90% Application Completion

## Purpose

This backlog turns the current LIBIF foundation into a coordinated, AI-agent-friendly delivery plan for a four-person team. It is intentionally organized by ownership lanes so each member can run fast with AI agents while reducing merge conflicts.

Target outcome: reach roughly 80-90% product completion, meaning the main reader, librarian/admin, processing, access-control, reporting, and operational flows are implemented, integrated, tested, and documented enough for a realistic demo and final hardening cycle.

## Requirements Summary

- Build a practical 80-90% completion roadmap for the entire LIBIF application.
- Organize work for four team members using AI agents for rapid implementation.
- Separate work by module, route subtree, and component domain to reduce merge conflicts.
- Define phases, member responsibilities, expected results, end-of-phase outcomes, validation, and stop conditions.
- Provide skeleton planning maps for all major remaining modules/features without adding build-impacting placeholder runtime files.

## Acceptance Criteria

- The backlog identifies four clear ownership lanes with primary file/directory boundaries.
- Each phase states what every member does, what is expected, and what the end-of-phase application should demonstrate.
- Detailed tasks are grouped by module/feature with expected result, main files, and validation.
- Merge-conflict prevention rules and branch/PR strategy are explicit.
- AI-agent assignment guidance is included so implementation agents receive bounded scopes.
- Skeleton artifacts exist for future API modules, web routes, and domain components needed for high completion.
- The canonical plan is stored in `ai_artifacts/docs`, with an OMX workflow pointer under `.omx/plans`.

## Implementation Steps

1. Use Phase 4 to establish reader library/access and catalog contracts.
2. Use Phase 5 to complete document lifecycle, upload, metadata editing, and taxonomy integration.
3. Use Phase 6 to complete processing, approval, correction, and notification workflows.
4. Use Phase 7 to fill admin operations, user management, reporting, settings, and reader polish.
5. Use Phase 8 for integration hardening, e2e, accessibility, visual QA, docs, and demo readiness.

## Risks and Mitigations

- Risk: Prisma/schema conflicts across lanes. Mitigation: one migration owner per phase and integration PR after feature branches.
- Risk: Shared UI primitive conflicts. Mitigation: feature lanes use domain components; shared primitives require separate small PRs.
- Risk: Generated OpenAPI/client churn. Mitigation: regenerate once at phase end by the integrator.
- Risk: AI agents over-edit unrelated files. Mitigation: every task prompt includes explicit edit and no-edit scopes.
- Risk: Backend/frontend contract drift. Mitigation: contract tests, OpenAPI generation, and phase-end integration PR.

## Current Baseline

Completed foundation from earlier phases:

- Shared tokens and UI primitives exist for web work.
- Main route shells and navigation structure exist.
- Backend API foundation, OpenAPI generation, auth cookies, sessions, password reset, role checks, and seeded role accounts exist.
- Core intake/catalog/backend modules exist in early form.
- Current docs are centralized under `ai_artifacts/docs`.

Primary remaining product gaps:

- Reader library, protected document access, reading progress, bookmarks, and document viewer flows.
- Upload/catalog/document-management boundary deepening.
- Processing worker/status/retry lifecycle and approval/correction workflow.
- Notifications, taxonomy/tag management, user management, settings, dashboards, and reports.
- Cross-feature integration hardening, accessibility, visual QA, and e2e coverage.

## Team Lanes and File Ownership

Use these lanes as default branch and PR boundaries. A member may review another lane, but should not directly modify another lane's owned files unless explicitly coordinated in a short integration PR.

### Member A — Reader Experience and Access

Owns reader-facing flows and protected access behavior.

Primary ownership:

- `apps/api/src/modules/reader/**`
- `apps/api/src/modules/access/**`
- `apps/web/app/(reader)/**`
- `apps/web/components/domain/reader/**`
- `apps/web/components/reader/**`
- Reader-specific tests in API and web apps

Shared touchpoints:

- Reads auth/session state from Auth APIs; do not redesign auth.
- Consumes catalog/document DTOs from Member B.
- Consumes notification APIs from Member C.

### Member B — Document, Upload, and Catalog Management

Owns the librarian document-management surface and catalog data contract.

Primary ownership:

- `apps/api/src/modules/upload/**`
- `apps/api/src/modules/catalog/**`
- `apps/api/src/modules/documents/**`
- `apps/api/src/modules/books/**` only when migrating existing book-intake code into document/catalog concepts
- `apps/web/app/(admin)/admin/books/**`
- `apps/web/app/(admin)/admin/documents/**`
- `apps/web/components/book-intake/**`
- `apps/web/components/domain/documents/**`
- `apps/web/components/domain/upload/**`
- Document/catalog/upload tests

Shared touchpoints:

- Coordinates taxonomy fields with Member D.
- Emits processing jobs/status records consumed by Member C.
- Provides document access metadata consumed by Member A.

### Member C — Processing, Approval, and Notifications

Owns background processing lifecycle, review queues, correction loop, and notification delivery.

Primary ownership:

- `apps/api/src/modules/processing/**`
- `apps/api/src/modules/approval/**`
- `apps/api/src/modules/notifications/**`
- `apps/web/app/(admin)/admin/processing/**`
- `apps/web/app/(admin)/admin/approvals/**`
- `apps/web/app/(admin)/admin/notifications/**`
- `apps/web/components/domain/processing/**`
- `apps/web/components/domain/approval/**`
- `apps/web/components/domain/notifications/**`
- Processing/approval/notification tests

Shared touchpoints:

- Receives document events from Member B.
- Sends reader/admin notification data to Member A and Member D.
- Coordinates admin audit views with Member D.

### Member D — Admin Operations, Taxonomy, Reporting, Settings, and Integration

Owns operational admin features and end-of-phase integration tasks.

Primary ownership:

- `apps/api/src/modules/taxonomy/**`
- `apps/api/src/modules/users/**`
- `apps/api/src/modules/reporting/**`
- `apps/api/src/modules/settings/**`
- `apps/web/app/(admin)/admin/categories/**`
- `apps/web/app/(admin)/admin/tags/**`
- `apps/web/app/(admin)/admin/users/**`
- `apps/web/app/(admin)/admin/reports/**`
- `apps/web/app/(admin)/admin/settings/**`
- `apps/web/components/domain/taxonomy/**`
- `apps/web/components/domain/users/**`
- `apps/web/components/domain/reporting/**`
- `apps/web/components/domain/settings/**`
- Cross-feature docs/checklists and final OpenAPI regeneration at phase boundaries

Shared touchpoints:

- Coordinates role-policy changes with auth foundation.
- Coordinates taxonomy DTOs with Member B.
- Owns final merge hygiene and generated contract updates for each phase.

## Merge-Conflict Prevention Rules

1. One owner per backend module directory.
2. One owner per Next route subtree.
3. Shared primitives in `apps/web/components/ui/**` require a small separate PR and should not be changed inside feature PRs unless unavoidable.
4. Prisma schema changes must be batched per phase. Pick one migration owner before implementation starts.
5. Generated OpenAPI and generated client/types should be regenerated only once near the end of each phase by Member D or an assigned integrator.
6. Do not rename route groups, module roots, or common DTOs in parallel with feature work.
7. Use additive DTO fields first; remove or rename fields only in a dedicated integration PR.
8. Each PR must include tests or a written validation gap.
9. Each AI agent should receive a file ownership boundary and must not edit outside it without explicit task scope.
10. Docs updates should target this backlog, `progress_checklist.md`, or the relevant feature doc section; avoid duplicate status summaries across many files.

## Branch and PR Strategy

Recommended branch naming:

- `feat/p4-reader-access-member-a`
- `feat/p4-catalog-documents-member-b`
- `feat/p4-processing-approval-member-c`
- `feat/p4-admin-ops-member-d`

Recommended merge order per phase:

1. Data model/migration PR, if any.
2. Backend module contracts and tests.
3. Frontend feature surfaces.
4. Integration PR with OpenAPI regeneration, generated clients, docs, e2e, and visual checks.

## Phase Roadmap

### Phase 4 — Reader Library and Catalog Access Foundation

Goal: make the reader-facing product feel real while hardening catalog search and access boundaries.

Member A tasks:

- Implement `ReaderModule` and reader dashboard data endpoints.
- Build reader library page, continue-reading area, and document detail entry points.
- Add protected access API surface for view/download eligibility.

Member B tasks:

- Expand catalog search/filter/sort/pagination contracts.
- Normalize document/book listing DTOs for reader and admin consumption.
- Ensure public reader catalog data excludes admin-only fields.

Member C tasks:

- Add lightweight processing-status read model consumed by reader/admin views.
- Prepare notification event contracts for document availability events.

Member D tasks:

- Add admin dashboard summary shells fed by real counts where available.
- Regenerate OpenAPI/contracts after backend surfaces stabilize.
- Update `progress_checklist.md` and route/API inventory.

Expected end-of-phase result:

- Readers can sign in, browse/search catalog, open document detail pages, see library/availability states, and receive clear access-denied/session-expired behavior.
- Admin dashboard has basic real counts.
- API contracts are generated and documented.

Validation:

- Unit tests for reader/access/catalog services.
- API e2e tests for reader role access boundaries.
- Web build and lint pass.
- Smoke test seeded reader account against reader routes.

### Phase 5 — Document Lifecycle, Upload, Metadata, and Taxonomy Integration

Goal: make librarian/admin document intake and metadata management usable end-to-end.

Member A tasks:

- Connect reader document detail to the protected viewer/download handoff.
- Add reader fallback states for unavailable, processing, rejected, and restricted documents.

Member B tasks:

- Implement document list/detail/edit APIs and admin screens.
- Deepen upload flow: file metadata, validation, replacement/cancel path, and intake result states.
- Clarify `books` versus `documents` boundary and migrate UI language where appropriate.

Member C tasks:

- Trigger processing jobs from upload/document events.
- Surface status transitions from uploaded to processing to awaiting approval.

Member D tasks:

- Implement category/tag selectors and starter taxonomy management APIs.
- Ensure document edit forms consume taxonomy data without owning taxonomy internals.

Expected end-of-phase result:

- Librarians can upload a document, edit metadata, categorize/tag it, submit it into processing, and see lifecycle state.
- Readers see correct availability states but do not access unpublished/restricted content.

Validation:

- API tests for upload/document validation and role policies.
- E2e tests for admin upload-to-processing happy path.
- Web form validation tests where feasible.
- No direct frontend access to storage credentials.

### Phase 6 — Processing, Approval, Correction Loop, and Notifications

Goal: make the core operational workflow explicit, retryable, and visible.

Canonical comprehensive execution plan: `ai_artifacts/plans/plan-phase-6-processing-approval-correction-notifications-2026-07-22.md`.

Phase 6 entry note: Phase 5 now has authenticated intake/replacement/requeue handoffs and current-work queue projections, but no BullMQ worker consumes OCR jobs and `NotificationsService` remains process-local despite the Prisma model. Worker/OCR truth and notification persistence are early Phase 6 gates.

Member A tasks:

- Add reader notifications/read states for newly available or corrected documents.
- Add bookmarks and reading progress persistence if the viewer foundation is stable.

Member B tasks:

- Add metadata correction/resubmission screens after approval rejection.
- Ensure document detail shows processing and approval history.

Member C tasks:

- Implement processing job state machine, retry/cancel controls, and status endpoints.
- Implement approval queue, approve/reject/request-correction actions, and notification fanout.
- Add notification list/read/action APIs.

Member D tasks:

- Add admin audit/activity summaries for processing and approval actions.
- Integrate notifications into admin navigation/header if applicable.

Expected end-of-phase result:

- A librarian/admin can track processing, retry failed jobs, approve or reject processed documents, request corrections, and notify affected users.
- Readers and admins see relevant notifications.

Validation:

- State-machine tests for processing and approval transitions.
- Authorization e2e tests for admin/librarian/reader boundaries.
- Notification persistence tests.
- Regression tests for auth session behavior.

### Phase 7 — Admin Operations, Users, Reporting, and Settings

Goal: fill operational gaps needed for a near-complete admin product.

Member A tasks:

- Polish reader library filters, history, bookmarks, and empty/loading/error states.
- Add reader-facing accessibility and responsive checks.

Member B tasks:

- Finish taxonomy integration in document search and admin filters.
- Add bulk document actions only if the single-document lifecycle is stable.

Member C tasks:

- Finish notification center UI and read/unread behavior.
- Add scheduled or event-driven notification hooks where needed.

Member D tasks:

- Implement user management list/detail/role changes/deactivation with confirmation flows.
- Implement category/tag management, merge/reassign safeguards, and risky-action confirmations.
- Implement dashboards, report endpoints, export stubs/CSV, and settings screens.

Expected end-of-phase result:

- Admins can manage users, categories, tags, reports, and key settings.
- Librarians/admins can operate the document lifecycle without database access.
- Reader experience has realistic account-specific state.

Validation:

- User-management authorization tests.
- Taxonomy CRUD and reassignment tests.
- Report endpoint tests using seeded/dev data.
- Web e2e smoke over reader, librarian, and admin accounts.

### Phase 8 — Integration Hardening, QA, Accessibility, and Demo Readiness

Goal: convert feature-complete surfaces into a stable 80-90% application.

Member A tasks:

- Reader e2e coverage, responsive pass, accessibility fixes, and viewer smoke tests.

Member B tasks:

- Admin document-management e2e coverage and data validation fixes.

Member C tasks:

- Processing/approval/notification e2e coverage and retry/error-state hardening.

Member D tasks:

- Full OpenAPI regeneration, docs update, seeded scenario refresh, build/lint/test/e2e orchestration, release notes, and demo script.

Expected end-of-phase result:

- Main user journeys work from seeded accounts.
- Known gaps are documented and intentionally deferred.
- The app is suitable for a high-confidence demo and final polish sprint.

Validation:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run openapi:generate`
- API e2e suite
- Seeded-account smoke test
- Manual or automated visual/a11y pass for primary screens

## Detailed Backlog

### Reader and Access Lane

| ID | Task | Expected Result | Main Files | Validation |
| --- | --- | --- | --- | --- |
| RDR-001 | Create ReaderModule read model | Reader dashboard/library data can be fetched by authenticated readers | `apps/api/src/modules/reader/**` | service tests, reader role e2e |
| RDR-002 | Reader library page | Reader sees borrowed/available/recent documents | `apps/web/app/(reader)/library/**`, `components/domain/reader/**` | web build, smoke route |
| RDR-003 | Reader catalog detail | Reader can open a document detail page from catalogue | `apps/web/app/(reader)/catalogue/[id]/**` | route smoke, API contract check |
| RDR-004 | Access eligibility API | Access decisions are centralized and role-aware | `apps/api/src/modules/access/**` | role-boundary tests |
| RDR-005 | Protected viewer shell | Reader gets a controlled viewer/download handoff | `apps/web/app/(reader)/documents/[id]/view/**` | e2e access allowed/denied |
| RDR-006 | Bookmarks | Reader can save/remove bookmarks | reader module + reader components | unit/e2e bookmark tests |
| RDR-007 | Reading progress/history | Reader progress persists and powers continue-reading | reader module + viewer state | persistence tests |
| RDR-008 | Reader notification integration | Reader sees availability/correction notices | reader + notifications API consumer | notification e2e |

### Document, Upload, and Catalog Lane

| ID | Task | Expected Result | Main Files | Validation |
| --- | --- | --- | --- | --- |
| DOC-001 | DocumentModule contracts | Documents have explicit list/detail/edit APIs | `apps/api/src/modules/documents/**` | controller/service tests |
| DOC-002 | Admin document list/detail | Librarian/admin can inspect document records | `apps/web/app/(admin)/admin/documents/**` | web build, e2e smoke |
| DOC-003 | Metadata edit forms | Metadata can be edited with validation | document components/forms | form validation tests |
| DOC-004 | Upload lifecycle hardening | Upload has validation, cancel/retry states, and clear feedback | `apps/api/src/modules/upload/**`, upload UI | API/e2e tests |
| DOC-005 | ISBN/manual metadata enrichment | Intake can prefill metadata and allow correction | existing ISBN/book-intake surfaces | unit tests |
| DOC-006 | Catalog public/admin split | Reader catalog hides admin fields; admin catalog shows lifecycle | catalog module + DTOs | contract tests |
| DOC-007 | Pagination/filter/sort | Catalog and admin tables handle realistic library volume | catalog/doc APIs + tables | API tests |
| DOC-008 | File replacement path | Librarian can replace failed/incorrect uploads safely | upload/document modules | e2e replacement path |

### Processing, Approval, and Notifications Lane

| ID | Task | Expected Result | Main Files | Validation |
| --- | --- | --- | --- | --- |
| PRC-001 | Processing state machine | Jobs have explicit states and allowed transitions | `apps/api/src/modules/processing/**` | transition tests |
| PRC-002 | Processing worker entrypoint | Processing can run via a controlled service/job runner | processing module | unit/smoke tests |
| PRC-003 | Retry/cancel controls | Failed/stuck jobs can be recovered safely | processing API + admin UI | e2e retry/cancel |
| PRC-004 | Processing status UI | Admins see queue, progress, errors, and actions | admin processing routes/components | web e2e |
| APR-001 | Approval queue | Processed items require review before publication | `apps/api/src/modules/approval/**` | API tests |
| APR-002 | Approve/reject/correction actions | Reviewers can publish, reject, or request metadata/file corrections | approval API/UI | state tests, e2e |
| NTF-001 | Notification persistence | Notifications are stored with recipient, type, status, and payload | `apps/api/src/modules/notifications/**` | service tests |
| NTF-002 | Notification UI | Users see read/unread actionable notices | web notification components/routes | e2e smoke |

### Admin Operations, Taxonomy, Reporting, and Settings Lane

| ID | Task | Expected Result | Main Files | Validation |
| --- | --- | --- | --- | --- |
| TAX-001 | Category CRUD | Admins manage category hierarchy | `apps/api/src/modules/taxonomy/**`, admin category routes | API/e2e tests |
| TAX-002 | Tag CRUD/merge | Admins manage tags and merge duplicates | taxonomy module + tag UI | merge tests |
| TAX-003 | Reassignment safeguards | Deleting taxonomy nodes requires reassignment or safe blocking | taxonomy module | destructive-action tests |
| USR-001 | User list/detail | Admins can inspect users and roles | `apps/api/src/modules/users/**`, admin users routes | authz tests |
| USR-002 | Role changes | Admin can update roles with confirmation and audit trail | users module/UI | role-boundary tests |
| USR-003 | Deactivation/session handling | Disabled users lose access safely | users + auth/session integration | e2e disabled login/session |
| RPT-001 | Dashboard metrics | Admin sees counts and operational status | `apps/api/src/modules/reporting/**`, dashboard | report tests |
| RPT-002 | CSV/export reports | Basic exports exist for documents/users/activity | reporting module/UI | export tests |
| SET-001 | Settings screens | Admin settings are visible and safely persisted or clearly stubbed | `apps/api/src/modules/settings/**`, settings routes | API/UI tests |

### Cross-Cutting Integration Lane

| ID | Task | Expected Result | Main Files | Validation |
| --- | --- | --- | --- | --- |
| QA-001 | Seeded scenario refresh | Seed data covers admin/librarian/reader journeys | `apps/api/prisma/seed.ts` | `npm run db:seed` |
| QA-002 | OpenAPI/client regeneration | Web and docs match backend contracts | generated OpenAPI/client files | `npm run openapi:generate` |
| QA-003 | Route/API inventory update | Docs stay current without duplicating implementation detail | `ai_artifacts/docs/**` | doc review |
| QA-004 | E2e smoke matrix | Primary journeys are tested by role | e2e suites | API/web e2e |
| QA-005 | Accessibility pass | Key pages meet basic keyboard/label/contrast expectations | web components/routes | a11y checklist |
| QA-006 | Error-state normalization | Empty/loading/error/access-denied states are consistent | web components + API errors | visual/manual smoke |
| QA-007 | Final demo script | Team can demo core journeys in stable order | `ai_artifacts/docs/demo_script.md` | dry run |

## AI Agent Task Prompt Template

Use this shape when assigning tasks to individual agents:

```text
You are implementing [TASK-ID] in the LIBIF repo.

Scope:
- Only edit: [owned directories/files].
- Do not edit: shared UI primitives, Prisma schema, generated OpenAPI/client files, or other member lanes unless explicitly listed.

Goal:
- [Expected user-visible/backend result].

Acceptance:
- [Specific behavior].
- [Specific tests/validation].
- Update only the relevant doc/checklist section if behavior changes.

Constraints:
- Preserve existing auth/session behavior.
- Prefer existing components/utilities before adding abstractions.
- Keep DTO changes additive unless this task explicitly includes a breaking contract update.
```

## Definition of Done for Each Feature PR

- Feature works for the appropriate seeded role account.
- Role and access boundaries are tested or explicitly documented as a validation gap.
- Lint/type/build impact is checked before handoff.
- New API behavior has service/controller tests or e2e coverage.
- New web route has loading, empty, error, and access-denied behavior where relevant.
- Docs/checklist are updated only where they add new information.
- PR description states owned directories, shared touchpoints, verification commands, and known gaps.

## 80-90% Completion Stop Condition

The application can be considered 80-90% complete when these journeys work without direct database intervention:

1. Admin signs in, sees dashboard, manages users/taxonomy/settings/reports.
2. Librarian signs in, uploads a document, edits metadata, submits processing, handles correction, and sees approval result.
3. Admin/librarian approves or rejects processed content with notifications emitted.
4. Reader signs in, searches catalog, opens detail, accesses available content, saves bookmarks/progress, and sees notifications.
5. Seeded accounts can exercise the demo path after a fresh setup.
6. Lint, tests, build, OpenAPI generation, and e2e smoke pass or have a documented non-product blocker.
