# Plan: Phase 1 — Design Tokens and Shared Components

**Date:** 2026-07-20  
**Mode:** `$plan` direct mode  
**Canonical artifact root:** `ai_artifacts/`  
**Source prompt:** `ai_artifacts/prompts/Agent_Prompt.md`  
**Phase 0 docs:** `ai_artifacts/docs/`  
**Execution boundary:** Plan only. Do not implement Phase 1 in this planning pass.  
**Stop condition for execution:** Stop after Phase 1 design foundations, shared components, component demonstrations/tests, docs updates, and verification pass. Do not start Phase 2 route-shell/auth/API-client work.

---

## 1. Context Update

The user centralized AI artifacts under `ai_artifacts/`. Future work should use:

- `ai_artifacts/prompts/Agent_Prompt.md` for the canonical implementation prompt.
- `ai_artifacts/docs/*.md` for Phase 0 architecture, UI, component, API, workflow, and screen-matrix documentation.
- `ai_artifacts/stitch_design/` for read-only Stitch references.
- `ai_artifacts/plans/` for new planning artifacts.

Root `docs/` currently contains original PDF source docs only, not the Phase 0 markdown audit docs.

---

## 2. Evidence Summary

| Evidence | Source |
|---|---|
| Phase 1 must build shared frontend foundations before full route screens. | `ai_artifacts/prompts/Agent_Prompt.md:394-397` |
| Phase 1 requires semantic color, typography, spacing, radius, border, elevation, breakpoint, motion, z-index, focus, and icon-size foundations. | `ai_artifacts/prompts/Agent_Prompt.md:398-414` |
| Phase 1 requires shared actions/indicators, forms, surfaces/feedback, navigation, data display, and domain components. | `ai_artifacts/prompts/Agent_Prompt.md:416-532` |
| Phase 1 must add Storybook or an isolated component catalogue and demonstrate key states. | `ai_artifacts/prompts/Agent_Prompt.md:534-547` |
| Phase 1 exit criteria require no raw design hex values in consumers, no duplicate common controls, keyboard support, accessible form relationships, responsive component rendering, component tests/a11y checks, and no complete feature route bypassing shared components. | `ai_artifacts/prompts/Agent_Prompt.md:549-559` |
| Current UI decisions define LIBIF brand, canonical color tokens, Be Vietnam Pro, spacing/radius/elevation rules, navigation taxonomy, responsive rules, status dictionary, terminology, and Stitch deviations. | `ai_artifacts/docs/ui-decisions.md:5-141` |
| Current component inventory identifies shared component contracts and notes current one-off UI to migrate later. | `ai_artifacts/docs/component-inventory.md:7-44` |
| Current app structure uses Next.js App Router under `apps/web/app`, components under `apps/web/components`, and tests under `apps/web/tests`; preserve this structure. | `ai_artifacts/docs/architecture-alignment.md:7-12`; `ai_artifacts/docs/architecture-alignment.md:27-32` |
| Current `apps/web/app/globals.css` has raw hex values, hard-coded radii/shadow, global button/input/card/nav/dropzone styles. | `apps/web/app/globals.css:1-14` |
| Current root layout has a global nav; Phase 1 may introduce component primitives and a component catalogue but must not start Phase 2 route-shell migration. | `apps/web/app/layout.tsx:6-19`; `ai_artifacts/prompts/Agent_Prompt.md:563-570` |
| Current intake UI uses page-local/global classes (`card`, `grid`, `dropzone`) and native controls directly, creating Phase 1 migration targets. | `apps/web/components/book-intake/BookIntakeForm.tsx:62-79`; `apps/web/components/book-intake/MetadataFields.tsx:15-44`; `apps/web/components/book-intake/PdfDropzone.tsx:15-30` |
| Current tests use Vitest + Testing Library and should be extended for component behavior. | `apps/web/tests/book-intake.spec.tsx:1-39`; `apps/web/vitest.config.ts:1-8` |
| Current web package has no Tailwind, Storybook, a11y testing, or component-catalog dependencies. | `apps/web/package.json:11-31` |

---

## 3. Requirements Summary

Phase 1 tokens/shared components plan: Phase 1 should establish a production-ready frontend design foundation for LIBIF before route batches continue. The work should introduce semantic design tokens, compiled Tailwind integration, accessible shared primitives, shared form/surface/feedback/data/navigation/domain component foundations, and an isolated component catalogue. Existing intake pages may be lightly migrated only where necessary to prove shared components and remove duplicate raw control implementations; full feature-screen work remains out of scope.

### In scope

1. Establish semantic CSS-variable design tokens and expose them through compiled Tailwind.
2. Replace raw global CSS colors/radii/shadows with semantic token definitions and base element policy.
3. Add Be Vietnam Pro typography support and semantic text utility/component patterns.
4. Create shared UI primitive folders and exports under the existing `apps/web/components` structure.
5. Implement high-reuse components first: Button, IconButton, Badge/StatusBadge, Spinner, Skeleton, ProgressBar, FormField, TextInput, PasswordInput, SearchInput, Textarea, Select, Checkbox, Card, Panel, InlineAlert, EmptyState, ResultState, basic Dialog/Drawer foundations, Pagination, DescriptionList, Timeline, and a minimal DataTable shell.
6. Create focused domain foundations needed by current and upcoming batches: FileDropzone, DocumentStatusBadge, DocumentMetadataSummary, UploadWorkflow, ProcessingStageStepper, ProcessingJobSummary, UserRoleBadge.
7. Add an isolated component catalogue. Preferred execution path: Storybook as dev-only tooling because no existing catalogue exists. If implementation policy rejects new dev dependencies, use a non-production component harness plus tests as a fallback and record the deviation.
8. Add component tests for core interactive/accessibility behavior.
9. Update centralized artifact docs in `ai_artifacts/docs/` to reflect implemented component APIs and any token decisions.
10. Keep `ai_artifacts/stitch_design/` read-only.

### Out of scope

- Phase 2 route groups, role-aware app shells, auth boundary, and generated API client.
- Full implementation of any Stitch feature route.
- Backend module changes, database migrations, OpenAPI generation, queues/workers, object storage, or auth policy implementation.
- Pixel-perfect screen cloning or visual regression against all 82 Stitch screens.
- New runtime UI dependencies beyond React/Next unless explicitly justified by the existing prompt and recorded.

---

## 4. Acceptance Criteria

1. `apps/web/app/globals.css` defines semantic CSS variables for canonical LIBIF colors, success/warning/info tokens, typography, spacing, radii, borders, elevation, breakpoints, motion, z-index, and focus-visible policy; consumers no longer need raw design hex values.
2. Tailwind is compiled locally and configured to expose semantic token names; Tailwind CDN is not used anywhere.
3. `apps/web/components/ui/` contains reusable action/indicator, form, surface/feedback, overlay, and data-display primitives with index exports.
4. `apps/web/components/domain/` contains the Phase 1 domain foundations listed in this plan without duplicating page-local controls.
5. `FormField` owns visible label, required indicator, description, validation error, stable control id, `aria-invalid`, and `aria-describedby` behavior.
6. Buttons and icon buttons require explicit type/accessibility contracts; icon-only actions require an accessible name.
7. Status components never communicate status by color alone and support the canonical status dictionary from `ai_artifacts/docs/ui-decisions.md:106-118`.
8. Dialog/Drawer foundations include focus-management strategy, Escape behavior policy, labelled title/description, background scroll handling, and restore-focus behavior; if full focus-trap implementation is deferred due to dependency policy, the gap is explicitly documented and tests cover available behavior.
9. DataTable foundation is server-pagination/sort/filter-ready and does not introduce client-only production filtering as the default.
10. Existing intake UI is either migrated to shared primitives or has a documented temporary compatibility gap; no second local Button/Input/Card/Dialog/Table implementation remains in changed code.
11. Component catalogue demonstrates default, hover/focus where automatable, disabled, loading, error, empty, long-content, permission-restricted, and narrow-container states for relevant components.
12. Component tests cover at least: Button disabled/loading/type behavior, FormField ARIA relationships, InlineAlert live/role behavior, FileDropzone keyboard/file selection contract, StatusBadge text+semantic status, ProgressBar semantics, and one responsive/narrow-container rendering smoke test.
13. `ai_artifacts/docs/component-inventory.md` is updated with actual component file paths and public API details after implementation.
14. `ai_artifacts/docs/ui-decisions.md` is updated with any additional semantic success/warning/info token values and any intentional deviations.
15. Verification passes: `npm run lint`, `npm test`, `npm run build`; if added, Storybook/component-catalog build and accessibility checks also pass.
16. No complete feature route implementation starts, and Phase 2 shell/auth/API-client work is not started.

---

## 5. Implementation Steps

### Step 1 — Reconfirm artifact paths and baseline

**Goal:** Prevent future work from reading stale root-level artifact paths.

- Read `ai_artifacts/prompts/Agent_Prompt.md`, `ai_artifacts/docs/ui-decisions.md`, `ai_artifacts/docs/component-inventory.md`, and `ai_artifacts/docs/architecture-alignment.md`.
- Confirm `ai_artifacts/stitch_design/` still has 82 first-level folders.
- Confirm current web files and scripts:
  - `apps/web/app/globals.css`
  - `apps/web/app/layout.tsx`
  - `apps/web/components/book-intake/*`
  - `apps/web/tests/*`
  - `apps/web/package.json`
- Record in the execution report that `ai_artifacts/` is canonical.

**Expected edits:** none.

### Step 2 — Add token infrastructure and compiled Tailwind

**Goal:** Establish the design foundation required by Phase 1 before component work.

- Add local Tailwind/PostCSS configuration for the existing Next.js app:
  - `apps/web/tailwind.config.ts` or framework-appropriate equivalent.
  - `apps/web/postcss.config.mjs` if needed.
  - `apps/web/styles/tokens.css` for semantic CSS variables.
  - `apps/web/styles/base.css` for reset/base/focus policy.
  - Update `apps/web/app/globals.css` to import token/base/component-layer CSS and remove hard-coded global component styles.
- Add dev dependencies only for compiled Tailwind/tooling required by the prompt; do not add runtime component libraries.
- Define tokens from `ai_artifacts/docs/ui-decisions.md:15-46`:
  - color tokens including canonical colors plus success/warning/info with WCAG AA contrast,
  - typography tokens for Be Vietnam Pro,
  - spacing scale based on 8px,
  - radius, border, elevation, breakpoint, motion, z-index,
  - focus-visible outline/ring policy.
- Ensure application code consumes semantic token names, not raw hex values.

**Expected edits:** `apps/web/package.json`, lockfile, `apps/web/tailwind.config.ts`, `apps/web/postcss.config.mjs`, `apps/web/styles/*`, `apps/web/app/globals.css`.

### Step 3 — Build foundational utilities and shared exports

**Goal:** Give all component families a consistent implementation surface.

- Add utility helpers without adding dependencies unless necessary:
  - `apps/web/lib/classnames.ts` for class composition.
  - `apps/web/components/ui/types.ts` for common size/tone/status types.
  - `apps/web/components/ui/index.ts` barrel exports.
- Define status metadata map from `ai_artifacts/docs/ui-decisions.md:106-118`:
  - `apps/web/components/ui/status/status-config.ts`.
- Add test helpers for component rendering:
  - `apps/web/tests/test-utils.tsx` if useful.

**Expected edits:** `apps/web/lib/classnames.ts`, `apps/web/components/ui/**`, `apps/web/tests/test-utils.tsx`.

### Step 4 — Implement actions and indicators

**Goal:** Remove duplicated button/status/progress patterns before forms and routes consume them.

- Implement:
  - `Button`
  - `IconButton`
  - `Badge`
  - `StatusBadge`
  - `Avatar`
  - `Divider`
  - `Spinner`
  - `Skeleton`
  - `ProgressBar`
  - `Stepper`
- Defer complex tooltip behavior if it would require a runtime dependency; provide a simple accessible `Tooltip` wrapper or document a Phase 1 gap.
- Add tests for disabled/loading buttons, icon accessible names, progress semantics, status text/icon behavior, and skeleton non-interactive semantics.

**Expected edits:** `apps/web/components/ui/actions/*`, `apps/web/components/ui/indicators/*`, `apps/web/tests/ui-actions-indicators.spec.tsx`.

### Step 5 — Implement forms and upload control foundations

**Goal:** Centralize form accessibility and eliminate local input/dropzone patterns.

- Implement:
  - `FormField`
  - `TextInput`
  - `PasswordInput`
  - `SearchInput`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `RadioGroup`
  - `Switch`
  - `DateInput` initially; defer `DateRangePicker` if date-range UX is not yet required by current code.
  - `FileDropzone`
  - `FilterBar` / `FilterDrawer` foundations.
- Do not add React Hook Form unless execution explicitly chooses schema-driven form refactoring; current forms can use controlled fields for Phase 1.
- Migrate `apps/web/components/book-intake/PdfDropzone.tsx` to wrap or re-export the shared `FileDropzone`, or replace its usage in `BookIntakeForm` with the shared component.
- Add tests for ARIA relationships, validation messaging, required indicators, file accept/max-size messaging, and keyboard file input access.

**Expected edits:** `apps/web/components/ui/forms/*`, `apps/web/components/book-intake/PdfDropzone.tsx`, `apps/web/components/book-intake/MetadataFields.tsx`, `apps/web/components/book-intake/CategoryTagFields.tsx`, `apps/web/tests/ui-forms.spec.tsx`, existing `apps/web/tests/book-intake.spec.tsx` as needed.

### Step 6 — Implement surfaces, feedback, overlays, and simple layout primitives

**Goal:** Replace `.card`, `.error`, `.success`, and ad hoc feedback with shared components.

- Implement:
  - `Card`, `Panel`, `MetricCard`, `SelectableCard`
  - `InlineAlert`, `Toast` foundation, `EmptyState`, `ResultState`
  - `Dialog`, `ConfirmationDialog`, `DestructiveDialog`, `Drawer`
  - `PageHeader`, `Breadcrumbs`, `Tabs`
- Keep full `AppShell`, `AdminShell`, `ReaderShell`, `Sidebar`, `TopBar`, `MobileNavDrawer`, `UserMenu`, and `NotificationButton` as shell foundations only if they do not trigger Phase 2 route migration. Otherwise stub contracts and document that implementation belongs to Phase 2.
- Migrate current pages/components off global `.card`, `.error`, and `.success` where it proves the primitives without expanding feature scope.

**Expected edits:** `apps/web/components/ui/surfaces/*`, `apps/web/components/ui/feedback/*`, `apps/web/components/ui/overlays/*`, `apps/web/components/layout/*`, selected current pages/components.

### Step 7 — Implement data-display foundations

**Goal:** Establish reusable table/list/detail primitives before admin/catalogue batches.

- Implement:
  - `DataTable`
  - `TableToolbar`
  - `BulkActionBar`
  - `ColumnHeader`
  - `RowActions`
  - `Pagination`
  - `DescriptionList`
  - `Timeline`
  - `ChartCard`
  - `KpiCard`
- DataTable should accept externally controlled pagination/sort/filter state and avoid embedding production client-only filtering.
- Add tests for table headers, row actions, empty state, pagination labels, and keyboard-triggered row actions.

**Expected edits:** `apps/web/components/ui/data/*`, `apps/web/components/domain/reports/*`, `apps/web/tests/ui-data.spec.tsx`.

### Step 8 — Implement Phase 1 domain component foundations

**Goal:** Provide reusable domain building blocks without implementing full feature routes.

- Implement minimal contract-faithful components:
  - `DocumentCard`
  - `DocumentRow`
  - `DocumentStatusBadge`
  - `DocumentMetadataSummary`
  - `AuditTimeline`
  - `UploadWorkflow`
  - `ProcessingStageStepper`
  - `ProcessingJobSummary`
  - `UserRoleBadge`
- For components whose full data contracts depend on later API work, use typed view-model props local to the component and document the later API-client contract dependency.
- Do not implement `ProtectedPdfViewer`, `JobStatusPoller`, `ApprovalDecisionPanel`, `CorrectionRequestPanel`, `CategoryTree`, `TagSelector`, `NotificationItem`, or `ReaderBookCard` beyond skeletal contracts unless they are needed to remove duplication in current code; these can remain Phase 1B/Batch-specific candidates.

**Expected edits:** `apps/web/components/domain/*`, `apps/web/tests/domain-components.spec.tsx`.

### Step 9 — Add isolated component catalogue

**Goal:** Demonstrate component states required by Phase 1 without implementing feature screens.

Preferred path:

- Add Storybook as dev-only tooling and create stories colocated with components or under `apps/web/stories`.
- Demonstrate relevant states: default, hover/focus where feasible, disabled, loading, error, empty, long-content, permission-restricted, and narrow-container.
- Add a Storybook build/check script if practical.

Fallback path if dependency policy blocks Storybook:

- Create a non-production component catalogue harness under `apps/web/components/catalogue` plus test-rendered examples, not a public product route.
- Document the deviation in `ai_artifacts/docs/ui-decisions.md` and `ai_artifacts/docs/component-inventory.md`.

**Expected edits:** `apps/web/.storybook/*`, `apps/web/stories/*` or non-routed component catalogue files, `apps/web/package.json` scripts.

### Step 10 — Migrate current intake proof surfaces narrowly

**Goal:** Prove components are usable while avoiding Phase 2 or full screen work.

- Replace local/global UI classes in current intake proof pages with shared components only where safe:
  - `apps/web/app/admin/books/new/page.tsx`
  - `apps/web/app/admin/books/page.tsx`
  - `apps/web/app/catalog/page.tsx`
  - `apps/web/components/book-intake/*`
- Preserve existing behavior and API calls.
- Keep current routes; do not create new auth/reader/admin route groups.
- Update existing tests to reflect accessible names and component output.

**Expected edits:** current pages/components/tests only; no backend changes.

### Step 11 — Update centralized artifact docs

**Goal:** Keep `ai_artifacts/` as the current source of truth.

- Update `ai_artifacts/docs/component-inventory.md` with actual implemented component paths and API notes.
- Update `ai_artifacts/docs/ui-decisions.md` with final success/warning/info values, token file locations, Storybook/catalogue decision, and any intentional deviations.
- If DataTable or domain components rely on later API contracts, add notes to `ai_artifacts/docs/api-contracts.md` only if contract assumptions changed.
- Do not move artifacts out of `ai_artifacts/`.

**Expected edits:** selected `ai_artifacts/docs/*.md`.

### Step 12 — Verification and completion report

**Goal:** Prove Phase 1 completion with fresh evidence.

Run:

```bash
npm run lint
npm test
npm run build
```

If Storybook is added, also run its static build or test command. Add targeted checks:

```bash
# no raw hex values in changed consumers, excluding token definition files and ai_artifacts/stitch_design
rg '#[0-9A-Fa-f]{3,8}' apps/web --glob '!styles/tokens.css' --glob '!**/*.config.*'

# no remaining global component class usage in changed consumer files
rg 'className="(card|grid|dropzone|error|success)"' apps/web/app apps/web/components
```

Completion report must use the 16-point format from `ai_artifacts/prompts/Agent_Prompt.md:1049-1067` and explicitly state that Phase 2 was not started.

---

## 6. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Phase 1 scope is large enough to sprawl into route/shell work. | Keep route migration limited to proving shared components on existing proof pages; defer route groups and role-aware shells to Phase 2. |
| Adding Tailwind/Storybook introduces dependency churn. | Add only dev/build tooling required by the prompt; avoid runtime UI libraries; document any fallback if dependency policy blocks Storybook. |
| Dialog/Drawer focus behavior is hard without a focus-trap dependency. | Prefer native `dialog` plus tests where acceptable, or explicitly justify one small accessibility dependency; document gaps if deferred. |
| Migrating current intake UI can accidentally change behavior. | Keep existing API calls and tests; run current `book-intake` tests before and after migration. |
| Raw global CSS classes may remain in consumers. | Add targeted `rg` checks for raw hex and old global class names. |
| Component APIs may overfit future screens. | Start from Phase 0 component inventory and implement minimal, typed, reusable props; avoid speculative feature-specific props. |
| Component catalogue could become a public route. | Prefer Storybook; if using a fallback harness, keep it non-routed or clearly dev-only. |
| Accessibility checks may be incomplete if no a11y tooling exists. | At minimum test ARIA relationships and keyboard behavior with Testing Library; add automated a11y tooling only if dependency policy allows. |

---

## 7. Verification Steps

1. Confirm artifact context:
   - `find ai_artifacts/stitch_design -mindepth 1 -maxdepth 1 -type d | wc -l` returns `82`.
   - `test -f ai_artifacts/docs/component-inventory.md` and `test -f ai_artifacts/docs/ui-decisions.md` pass.
2. Confirm TypeScript/lint/tests/build:
   - `npm run lint` passes.
   - `npm test` passes.
   - `npm run build` passes.
3. Confirm component tests cover the Phase 1 primitives listed in Acceptance Criteria 12.
4. Confirm no raw hex values remain in app/component consumers outside token/config files.
5. Confirm no duplicated local Button/Input/Card/Dialog/Table implementations remain in changed files.
6. Confirm no source files under `apps/api/`, `apps/api/prisma/`, or backend modules were changed unless purely incidental generated outputs occurred and were reverted.
7. Confirm `ai_artifacts/docs/component-inventory.md` and `ai_artifacts/docs/ui-decisions.md` reflect actual implementation decisions.
8. Confirm the completion report states Phase 1 only and does not claim Phase 2 route-shell/auth/API-client completion.

---

## 8. Suggested Execution Handoff

Recommended default: `$ralph` for a persistent single-owner Phase 1 implementation/verification loop, because this phase touches many shared files and needs careful regression verification.

Parallelization can help if using `$team`, with disjoint lanes:

- **Lane 1 — tokens/build tooling:** `apps/web/styles/*`, Tailwind/PostCSS config, global CSS.
- **Lane 2 — UI primitives/forms:** `apps/web/components/ui/actions`, `indicators`, `forms`, tests.
- **Lane 3 — surfaces/data/domain foundations:** `apps/web/components/ui/surfaces`, `feedback`, `data`, `apps/web/components/domain`, tests.
- **Lane 4 — catalogue/docs verification:** Storybook or component harness plus `ai_artifacts/docs` updates and final checks.

Use `$ultragoal` if you want durable goal-led tracking across multiple Phase 1 subtasks; use Team + Ultragoal only if you want parallel execution evidence checkpointed into a durable ledger.
