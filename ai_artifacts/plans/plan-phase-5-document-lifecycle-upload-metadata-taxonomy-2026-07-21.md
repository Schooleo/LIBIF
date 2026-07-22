# Phase 5 Plan — Document Lifecycle, Upload, Metadata, and Taxonomy Integration

Date: 2026-07-21  
Planning mode: `$plan` direct  
Phase owner / integration lane: Member D unless the team assigns a separate integrator

## Requirements Summary

Phase 5 turns the merged Phase 4 foundations into a usable librarian/admin document lifecycle: upload or replace a PDF, edit metadata, categorize/tag it, submit it to processing, expose lifecycle status, and keep reader access constrained to published/authorized documents.

This plan uses the canonical backlog and skeleton map rather than inventing new ownership boundaries:

- The backlog defines Phase 5 as document lifecycle, upload, metadata, and taxonomy integration (`ai_artifacts/docs/team_backlog_80_90_completion.md:228-264`).
- Merge-conflict prevention requires one owner per backend module/route subtree, phase-batched Prisma changes, and one phase-end OpenAPI/client regeneration (`ai_artifacts/docs/team_backlog_80_90_completion.md:157-170`).
- AI agents must work inside member lanes and avoid Prisma/generated/shared-UI churn unless explicitly assigned (`ai_artifacts/prompts/Agent_Prompt.md:153-188`).
- Skeleton maps already define the expected future module/route/component files for documents, upload, taxonomy, and reader viewer (`ai_artifacts/skeletons/api-modules/documents/README.md`, `ai_artifacts/skeletons/api-modules/upload/README.md`, `ai_artifacts/skeletons/api-modules/taxonomy/README.md`, `ai_artifacts/skeletons/web-routes/admin-documents/README.md`, `ai_artifacts/skeletons/web-routes/reader-document-viewer/README.md`).

## Current Progress Baseline

Completed and merged before Phase 5:

- Phase 4 reader/access/catalog/processing/notification/dashboard foundations are merged (`ai_artifacts/docs/progress_checklist.md:87-103`).
- Admin/librarian dashboard summary exists and Phase 4 full verification passed (`ai_artifacts/docs/progress_checklist.md:94-103`).
- Dev seeded accounts exist for Admin, Librarian, and Reader (`ai_artifacts/docs/progress_checklist.md:23-34`).
- Reader and notification modules currently exist but still contain temporary in-memory state that must move to Prisma-backed persistence in Phase 5/6 (`apps/api/src/modules/reader/reader.service.ts`, `apps/api/src/modules/notifications/notifications.service.ts`).

Schema foundation completed for this plan:

- Migration `20260721114643_phase5_domain_foundations` adds persisted `ReadingProgress`, `Bookmark`, `Notification`, `BookAuditEvent`, and `ApprovalReview` models plus `BookFile` version/status and `ProcessingJob` progress fields (`apps/api/prisma/schema.prisma:34-75`, `apps/api/prisma/schema.prisma:159-176`, `apps/api/prisma/schema.prisma:216-314`).
- Agent guidance now says schema/migration work is normally locked, but missing accepted persistence must be resolved through the schema-foundation owner instead of bypassing it with hidden in-memory state (`ai_artifacts/prompts/Agent_Prompt.md:161-188`).

## Phase 5 Acceptance Criteria

1. A Librarian can create/upload or inspect a document, edit metadata, set category/tags, and submit it into processing.
2. Document lifecycle state is visible in admin screens: uploaded/pending processing, processing, awaiting approval, published, rejected/restricted where applicable.
3. Reader document detail and viewer handoff use the Access API and show safe fallback states for unpublished, processing, rejected, restricted, unavailable, or missing documents.
4. Processing job records are created/updated from upload/document events and expose stage/progress/timestamps through DTOs.
5. Category/tag selectors use Member D taxonomy APIs and do not duplicate taxonomy fetch/update logic in Member B screens.
6. Reader bookmarks/progress and notifications no longer rely on undocumented module-local in-memory state when the feature is claimed complete.
7. OpenAPI/API types are regenerated once at phase integration, not in every lane PR.
8. Validation passes: `npm run openapi:generate`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e -w apps/api`, and `git diff --check` unless a non-product blocker is documented.

## Phase 5 Lane Boundaries

### Member A — Reader Experience and Access

**Primary lane:** reader document detail/viewer handoff and reader fallback states.

Owned files/directories:

- `apps/api/src/modules/reader/**`
- `apps/api/src/modules/access/**`
- `apps/web/app/(reader)/**`
- `apps/web/components/domain/reader/**`
- Reader/access tests

Do not edit directly:

- Document/upload admin APIs owned by Member B.
- Processing transition internals owned by Member C.
- Taxonomy management APIs owned by Member D.
- Prisma schema/migrations unless explicitly assigned by phase lead.

#### Member A tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| A5-001 | Protected viewer route completion | `/documents/[id]/view` requests an access decision before rendering PDF/download handoff | `apps/web/app/(reader)/documents/[id]/view/page.tsx`, `apps/web/components/domain/reader/ProtectedDocumentViewer.tsx`, `apps/api/src/modules/access/**` | Access service tests; reader role e2e allowed/denied cases |
| A5-002 | Reader document-detail fallback states | Reader sees processing/rejected/restricted/unavailable states without leaking admin fields | `apps/web/app/(reader)/catalogue/[id]/page.tsx`, `apps/web/components/domain/reader/**` | Web build; route smoke; DTO contract check |
| A5-003 | Persist reading progress | Replace temporary progress map with `ReadingProgress` upsert/read queries | `apps/api/src/modules/reader/reader.service.ts`, reader DTO tests | Unit tests for create/update/read/filter history |
| A5-004 | Persist bookmarks | Replace temporary bookmark map with `Bookmark` create/delete/list queries | `apps/api/src/modules/reader/reader.service.ts` | Unit/e2e tests for idempotent add/remove |

#### Member A stop condition

Stop when reader viewer/detail pages depend only on Access/Reader APIs, have clear fallback states, and reader state persists across API service instances/database reseeds where expected.

### Member B — Document, Upload, and Catalog Management

**Primary lane:** document management contracts, upload lifecycle, metadata edit screens, and books-to-documents boundary.

Owned files/directories:

- `apps/api/src/modules/documents/**`
- `apps/api/src/modules/upload/**`
- `apps/api/src/modules/books/**` only for migrating existing intake behavior behind document/upload concepts
- `apps/api/src/modules/catalog/**` only for document/catalog DTO split and filters
- `apps/web/app/(admin)/admin/documents/**`
- `apps/web/app/(admin)/admin/books/**` only for compatibility/redirect language
- `apps/web/components/domain/documents/**`
- `apps/web/components/domain/upload/**`
- Document/upload/catalog tests

Do not edit directly:

- Reader route behavior beyond consuming public DTOs.
- Processing internals beyond invoking exported enqueue/status APIs.
- Taxonomy CRUD internals beyond consuming selectors/endpoints.
- Generated OpenAPI/API types until integration PR.

#### Member B tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| B5-001 | Create DocumentsModule contracts | Admin/librarian can list, view, and update document metadata through explicit `/documents` APIs | `apps/api/src/modules/documents/documents.module.ts`, `documents.controller.ts`, `documents.service.ts`, DTOs from skeleton | Controller/service tests; authz tests |
| B5-002 | Admin documents screens | `/admin/documents`, detail, edit, and new/upload routes exist with loading/empty/error states | `apps/web/app/(admin)/admin/documents/**`, `apps/web/components/domain/documents/**` | Web build; smoke route; form validation |
| B5-003 | Upload lifecycle hardening | Upload records file metadata, validates PDF, handles cancel/retry/replacement states, and stores active/replaced file version | `apps/api/src/modules/upload/**`, `apps/api/src/modules/books/**`, `apps/web/components/domain/upload/**` | Upload e2e; replacement-path unit/e2e tests |
| B5-004 | Metadata edit integration | Metadata form updates title/subtitle/description/publisher/year/language/category/tags without breaking public catalog | documents DTOs, catalog mapper, admin form components | Mapper tests; API contract tests |
| B5-005 | Books vs documents language boundary | New admin lifecycle screens use “document”; existing `/admin/books` remains compatibility or clearly scoped catalog/intake route | admin routes/docs/API labels | Web smoke; docs update in one place |

#### Member B stop condition

Stop when librarian/admin can upload or select a document, edit metadata, assign taxonomy, and submit it to processing without touching database manually.

### Member C — Processing, Approval, and Notifications

**Primary lane:** upload/document event consumption, processing lifecycle transitions, and notification persistence touchpoints needed by Phase 5.

Owned files/directories:

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

Do not edit directly:

- Documents/upload APIs except through exported event/service contracts coordinated with Member B.
- Reader UI beyond notification consumption contracts.
- Taxonomy APIs.
- Prisma schema/migrations unless explicitly assigned by phase lead.

#### Member C tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| C5-001 | Processing transition service | Jobs can move queued -> running/processing stage -> pending approval/succeeded/failed with progress fields | `apps/api/src/modules/processing/processing.service.ts`, DTOs, tests | Transition unit tests; invalid transition tests |
| C5-002 | Upload/document event hook | Upload/document submission creates or updates processing job records from Member B contracts | `processing.queue.ts`, `events/**`, integration tests | Upload-to-processing e2e |
| C5-003 | Processing admin status | Admin processing UI displays stage/progress/error/timestamps from backend | admin processing route/components | Web build; API contract test |
| C5-004 | Persist notification basics | Replace module-local notification array with Prisma `Notification` reads/writes for Phase 5 status/action messages | `apps/api/src/modules/notifications/**` | Notification persistence tests |
| C5-005 | Approval handoff shell | When processing completes, document enters awaiting approval using `ApprovalReview` foundation; full approval actions can remain Phase 6 if documented | `apps/api/src/modules/approval/**`, processing service | Service tests; documented Phase 6 handoff |

#### Member C stop condition

Stop when processing state is not just visual: upload/document events create/update real jobs, admin sees current status from API, and notification records persist.

### Member D — Taxonomy, Schema Foundation, Integration, and Phase Closure

**Primary lane:** taxonomy APIs/selectors, schema ownership, OpenAPI regeneration, integration docs/checklists, and merge hygiene.

Owned files/directories:

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/**` for this phase only
- `apps/api/src/modules/taxonomy/**`
- `apps/api/src/modules/reporting/**` only for dashboard/read-model integration touchups
- `apps/web/app/(admin)/admin/categories/**`
- `apps/web/app/(admin)/admin/tags/**`
- `apps/web/components/domain/taxonomy/**`
- `ai_artifacts/**` phase docs/checklists/plans
- Generated OpenAPI/API types at phase integration only

Do not edit directly:

- Member A/B/C feature implementation internals except conflict resolution or integration wiring explicitly requested by phase lead.
- Shared UI primitives unless a separate cross-team primitive PR is opened.

#### Member D tasks

| ID | Task | Expected result | Suggested implementation files | Validation |
|---|---|---|---|---|
| D5-000 | Schema foundation | Phase 5/6 persistence gaps are modeled before feature lanes rely on ad hoc state | `apps/api/prisma/schema.prisma`, migration `20260721114643_phase5_domain_foundations` | `prisma validate`; migration apply; client generate |
| D5-001 | Taxonomy read APIs | Admin/document forms can fetch categories/tags with stable DTOs | `apps/api/src/modules/taxonomy/**` | Taxonomy service/controller tests |
| D5-002 | Taxonomy selector components | Member B document forms can consume selectors without owning taxonomy internals | `apps/web/components/domain/taxonomy/**`, adapters in `apps/web/lib/api-*` | Web build; selector tests where feasible |
| D5-003 | Starter category/tag admin routes | Basic list/create/edit surfaces exist or are documented as Phase 7 if deferred | `apps/web/app/(admin)/admin/categories/**`, `apps/web/app/(admin)/admin/tags/**` | Web smoke; role gate |
| D5-004 | Phase integration PR | Resolve conflicts, regenerate OpenAPI/API types once, update docs/checklists, run full verification | generated OpenAPI/API type files, `ai_artifacts/docs/**` | Full command set in Verification section |

#### Member D stop condition

Stop when taxonomy can be consumed by document metadata, all feature lanes merge cleanly, generated contracts match backend, and the Phase 5 completion checklist states remaining Phase 6/7 gaps.

## Merge Order

Use this order to reduce conflicts and unblock dependencies:

1. **D5-000 schema-foundation PR first.** Merge migration `20260721114643_phase5_domain_foundations` before feature branches. Every member rebases on it. No other member edits Prisma in Phase 5.
2. **D5-001 taxonomy read contract.** Merge early if Member B needs category/tag selectors or DTOs. Keep it additive.
3. **B5 backend document/upload contracts.** Merge backend APIs/tests before web surfaces; this defines the contracts A/C consume.
4. **C5 processing/notification backend integration.** Merge after B backend exposes upload/document submission hooks.
5. **A5 reader viewer/detail fallback.** Merge after B/C contracts are stable enough to avoid duplicating availability logic.
6. **B5 admin document/upload UI.** Merge after backend contracts and taxonomy read endpoints are available.
7. **D5 taxonomy selector/admin UI.** Merge with or immediately before B UI, depending on selector dependency.
8. **C5 admin processing/notification UI.** Merge after C backend contract.
9. **D5-004 final integration PR.** Regenerate OpenAPI/API types once, resolve remaining conflicts, update checklist/docs, and run full verification.

If two PRs touch the same generated file, route both through the final D integration PR instead of merging generated outputs from feature branches.

## Agent Rules for Phase 5

Every AI agent prompt must include:

```text
You are Member [A/B/C/D] implementing Phase 5 task [ID].

Read first:
- ai_artifacts/prompts/Agent_Prompt.md
- ai_artifacts/docs/team_backlog_80_90_completion.md
- ai_artifacts/plans/plan-phase-5-document-lifecycle-upload-metadata-taxonomy-2026-07-21.md
- relevant ai_artifacts/skeletons/**/README.md files

Edit only:
- [exact owned directories/files]

Do not edit:
- other member lanes
- shared UI primitives unless assigned a separate primitive PR
- Prisma schema/migrations unless assigned D5-000/schema-owner work
- generated OpenAPI/client files unless assigned D5-004/integration work
- unrelated docs

Schema rule:
- Use migration 20260721114643_phase5_domain_foundations as the persistence baseline.
- If a required persisted field/model is still missing, report it to Member D/integrator before implementing.
- Do not hide required persistence behind private in-memory maps, module-local arrays, or undocumented mocks.

Validation required:
- Run the smallest targeted tests for your lane.
- Report commands run, results, and known gaps.
```

Agent behavior constraints:

- Keep DTO changes additive unless the task explicitly includes a breaking contract change.
- Prefer existing UI primitives and domain components; do not create duplicate card/table/badge/button implementations.
- Keep business rules in NestJS services/policies; React components should consume API state only.
- Do not access PostgreSQL/S3/Redis/BullMQ/Tesseract from Next.js.
- Do not copy Stitch HTML wholesale; use screenshots for layout and shared components for implementation.
- Update only the smallest relevant docs section.

## Skeletons to Use in Phase 5

### Member A skeletons

- `ai_artifacts/skeletons/api-modules/reader/README.md`
- `ai_artifacts/skeletons/api-modules/access/README.md`
- `ai_artifacts/skeletons/web-routes/reader-document-viewer/README.md`
- `ai_artifacts/skeletons/web-routes/reader-library/README.md`
- `ai_artifacts/skeletons/components/reader/README.md`

### Member B skeletons

- `ai_artifacts/skeletons/api-modules/documents/README.md`
- `ai_artifacts/skeletons/api-modules/upload/README.md`
- `ai_artifacts/skeletons/web-routes/admin-documents/README.md`
- `ai_artifacts/skeletons/components/documents/README.md`
- `ai_artifacts/skeletons/components/upload/README.md`

### Member C skeletons

- `ai_artifacts/skeletons/api-modules/processing/README.md`
- `ai_artifacts/skeletons/api-modules/approval/README.md`
- `ai_artifacts/skeletons/api-modules/notifications/README.md`
- `ai_artifacts/skeletons/web-routes/admin-processing/README.md`
- `ai_artifacts/skeletons/web-routes/admin-approvals/README.md`
- `ai_artifacts/skeletons/web-routes/admin-notifications/README.md`
- `ai_artifacts/skeletons/components/processing/README.md`
- `ai_artifacts/skeletons/components/approval/README.md`
- `ai_artifacts/skeletons/components/notifications/README.md`

### Member D skeletons

- `ai_artifacts/skeletons/api-modules/taxonomy/README.md`
- `ai_artifacts/skeletons/web-routes/admin-taxonomy-users/README.md`
- `ai_artifacts/skeletons/components/taxonomy/README.md`
- `ai_artifacts/skeletons/components/reporting/README.md` only for dashboard/read-model integration touchups

## Phase 5 Implementation Steps

1. **Schema baseline and docs preflight**
   - Merge/apply D5-000.
   - Run `npx prisma validate --schema apps/api/prisma/schema.prisma` and `npm run prisma:generate -w apps/api`.
   - Ensure every member rebases before implementation.

2. **Contract-first backend lanes**
   - Member D: taxonomy read/list contracts.
   - Member B: documents/upload APIs and metadata DTOs.
   - Member C: processing transition/notification persistence contracts.
   - Member A: reader/access persistence and viewer eligibility contracts.

3. **Frontend lanes after backend contracts**
   - Member B composes admin document/upload screens.
   - Member D supplies taxonomy selector/domain components.
   - Member C expands processing/notification admin surfaces.
   - Member A completes reader detail/viewer fallback states.

4. **Integration pass**
   - Resolve route/API naming drift between `books`, `catalog`, `documents`, and `upload`.
   - Regenerate OpenAPI/API types once.
   - Update `progress_checklist.md`, `api-contracts.md`, and any relevant skeleton README only where behavior changed.

5. **Verification and closure**
   - Run the full Phase 5 verification suite.
   - Record known Phase 6/7 deferrals: full approval correction loop, user management, settings, exports, worker implementation depth, and full-text search if not completed.

## Verification Plan

Minimum per lane:

- Member A: reader/access service tests; reader e2e allowed/denied cases; web build route smoke.
- Member B: document/upload service/controller tests; upload validation/replacement e2e; web build route smoke.
- Member C: processing transition unit tests; notification persistence tests; upload-to-processing integration/e2e.
- Member D: Prisma validate/generate; taxonomy tests; integration docs; full command suite.

Phase-end commands:

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

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Multiple members edit Prisma or generated clients | Merge conflicts and drift | D owns schema/generated files; feature lanes consume committed schema baseline |
| Reader/notification state remains in memory | Data loss and false completion claims | A/C migrate to `ReadingProgress`, `Bookmark`, and `Notification` before claiming done |
| Document/upload/catalog naming drifts | Confusing APIs and duplicated UI | B owns boundary; D integration PR reconciles docs/contracts |
| Processing state machine grows too large | Phase 5 stalls | Phase 5 implements submit/job/status bridge; deeper approval/correction/retry can move to Phase 6 if documented |
| Taxonomy selector and taxonomy CRUD collide | Cross-lane UI/API conflicts | D ships read/selectors early; full risky taxonomy actions remain Phase 7 if needed |
| Stitch screens copied wholesale | UI inconsistency and inaccessible markup | Use screenshots as reference, shared primitives for implementation |

## End-of-Phase Result

At the end of Phase 5, the app should demonstrate this flow from seeded accounts:

1. Librarian signs in.
2. Librarian opens admin documents/upload flow.
3. Librarian uploads a PDF, sees validation/state feedback, edits metadata, and assigns category/tags.
4. Librarian submits the document into processing and sees status move into processing/awaiting approval.
5. Reader searches or opens the document detail and sees the correct access state; published/authorized content reaches the protected viewer handoff, while unpublished/restricted content shows a safe fallback.
6. Admin/librarian can verify taxonomy/status/audit/notification records exist through APIs or admin surfaces.

Phase 5 is complete when the above flow works without manual database edits and the full verification suite passes or has only explicitly documented non-product blockers.

## Completion Record — 2026-07-22

- Member A and Member B were merged into `dev`, followed by Member C after resolving the canonical intake navigation regression.
- Member D then merged the complete Phase 5 `dev` baseline, preserved each lane's module/route ownership, and reconciled the shared staff shell.
- The canonical staff workflow now uses `/admin/documents`, `/admin/documents/new`, processing/approval/notification routes, and Member D category/tag selectors. `/admin/books` remains explicitly legacy.
- The phase-end OpenAPI/client generation contains the integrated reader/access, document/upload, processing, approval, notification, reporting, and taxonomy modules.
- Phase-end verification passed: Prisma validate/generate, OpenAPI/client generation, root lint, 15 API suites/68 tests, 11 web files/49 tests, root production builds, 6 API e2e suites/24 tests, and `git diff --check`.
- Full worker execution and retry history, approval decision commands, correction/resubmission, and notification fanout remain the documented Phase 6 target. Risky taxonomy deletion/reassignment/merge remains Phase 7.
