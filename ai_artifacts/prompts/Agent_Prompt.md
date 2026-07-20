# Coding Agent Prompt — Architecture-Aligned LIBIF Stitch Implementation

You are the lead full-stack implementation agent responsible for converting the LIBIF Stitch export into a coherent, production-quality Library Digitization and Document Management System.

The repository contains, or will contain, a root-level folder named:

```text
stitch_design/
```

This folder contains **82 first-level Stitch screen folders**. Each screen folder may contain a rendered screenshot, generated HTML/Tailwind, and related design artifacts.

Treat `stitch_design/` as a **read-only design reference**:

- The screenshot is the primary visual reference.
- Generated HTML is a secondary source for structure, copy, and asset hints.
- Generated Tailwind classes, page-local styles, CDN imports, and repeated markup are not production architecture.
- Never edit, move, rename, or delete files inside `stitch_design/`.
- Do not copy whole generated pages into application routes.

Your implementation workflow is **architecture-first, component-first, and batch-by-batch**. Build reusable foundations and domain components before composing screens. Complete and validate one focused feature batch before beginning another.

---

## 1. Non-negotiable system architecture

Implement the UI and integrations within this architecture. Do not replace it with Vite, Express, microservices, Firebase, a client-only application, or a separate database per feature.

### Application type

LIBIF is an integrated enterprise web application with two major user experiences:

1. **Reader Portal** — outward-facing responsive web experience for discovery and protected online reading.
2. **Librarian/Admin Panel** — internal web experience for uploads, metadata, processing, review, administration, and reporting.

### Overall architecture

Use a **Modular Monolith** for the backend:

- One NestJS backend application and one coordinated deployment boundary for business APIs.
- Clear module boundaries in source code.
- One physical PostgreSQL database.
- Module-owned application services, repositories, DTOs, policies, and tests.
- No direct repository access across module boundaries.
- Cross-module coordination occurs through exported application services or internal domain/application events.
- Keep the Processing module ready to run workers separately later without redesigning domain contracts.

### Frontend

Use **Next.js with React and TypeScript**:

- Use the App Router when creating a new frontend.
- Use React Server Components by default.
- Add Client Components only where browser state, effects, or interaction require them.
- Use server rendering for reader discovery and other content-heavy routes where it improves first load and shareability.
- Use nested layouts and route groups for auth, reader, and administration experiences.
- Use strict TypeScript.
- Use compiled Tailwind CSS and semantic CSS variables/tokens. Never use the Tailwind CDN.
- Preserve an existing sound Next.js structure rather than migrating solely to match an example folder layout.

### Backend

Use **NestJS with Node.js and TypeScript**:

- Keep one modular monolith application.
- Expose synchronous user interactions through REST over HTTP.
- Publish internal events for long-running background work.
- Generate and maintain OpenAPI documentation from NestJS controllers and DTOs.
- Frontend code must consume a typed API client generated from, or validated against, the OpenAPI contract.
- Do not duplicate backend business rules inside React components.

### Database and search

Use **PostgreSQL**:

- Store relational document metadata, users, permissions, workflow records, audit records, and job references.
- Use the repository's existing PostgreSQL access layer and migration system.
- Do not introduce or replace an ORM as part of UI implementation without an explicit repository requirement.
- Use `pg_trgm`-backed search behavior for the catalogue as defined by the architecture.
- Keep search, filtering, sorting, and pagination authoritative on the backend for production data sets.

### File storage

Use **AWS S3 or MinIO-compatible object storage**:

- Store PDFs and generated processing artifacts in private buckets/containers.
- The Next.js frontend must never access storage credentials.
- Uploads and reader access are authorized through NestJS APIs.
- Protected reading uses short-lived presigned URLs with a default lifetime of **15 minutes**.
- Never persist presigned URLs in local storage, analytics payloads, logs, or long-lived application state.

### Processing and OCR

Use a **Pipe-and-Filter pipeline** coordinated with **Redis and BullMQ**:

```text
Validation -> Compression -> OCR Text -> Search Indexing
```

- Each stage is an independently testable processor/worker.
- Use Tesseract OCR for OCR execution.
- Upload completion emits `BookUploadedEvent` or the repository's equivalent internal event.
- An event handler creates/enqueues the processing job.
- Long-running processing must not block the upload HTTP request.
- Return an immediate accepted response containing the document/job identifier.
- BullMQ owns retries and background execution. The architecture expects up to three automatic retries for recoverable failures.
- The frontend must never connect directly to Redis or BullMQ.
- The frontend obtains processing status through REST. Use bounded polling unless the repository already provides a supported real-time transport.

### Hybrid communication model

Use:

- **Request-response REST** for login, registration, search, catalogue browsing, metadata operations, protected-reader authorization, user actions, and status queries.
- **Internal event-driven communication** for upload-triggered processing, OCR completion, indexing completion, notifications, and other background side effects.

Do not expose the internal event bus as a browser integration.

### Security boundaries

- NestJS authorization guards and policies are the security boundary.
- Next.js route checks improve UX but do not replace API authorization.
- Use secure, HTTP-only authentication/session cookies when compatible with the existing repository.
- Do not expose storage keys, internal queue details, stack traces, or raw infrastructure errors.
- Canvas-based PDF rendering and UI deterrents may reduce casual copying, but they are not security controls. Authorization, private object storage, and expiring URLs remain mandatory.

---

## 2. Repository layout rules

First inspect the actual repository. Preserve an existing sound workspace structure.

When the repository has no application scaffolding, initialize this workspace shape:

```text
/
├─ apps/
│  ├─ web/                         # Next.js application
│  │  └─ src/
│  │     ├─ app/
│  │     │  ├─ (auth)/
│  │     │  ├─ (reader)/
│  │     │  └─ (admin)/
│  │     ├─ components/
│  │     │  ├─ ui/
│  │     │  ├─ layout/
│  │     │  └─ domain/
│  │     ├─ features/
│  │     ├─ lib/
│  │     └─ styles/
│  └─ api/                         # NestJS modular monolith
│     └─ src/
│        ├─ modules/
│        │  ├─ auth/
│        │  ├─ upload/
│        │  ├─ catalog/
│        │  ├─ reader/
│        │  └─ processing/
│        ├─ infrastructure/
│        │  ├─ database/
│        │  ├─ object-storage/
│        │  ├─ queue/
│        │  ├─ events/
│        │  └─ ocr/
│        └─ common/
├─ packages/
│  ├─ ui/                          # optional shared UI package if workspace tooling supports it
│  ├─ api-client/                  # generated/validated OpenAPI client
│  └─ config/                      # shared lint/TypeScript configuration
├─ docs/
├─ stitch_design/                  # read-only 80-screen source
└─ infrastructure/                 # local Postgres/Redis/MinIO configuration when needed
```

Do not create a separate backend service for every screen or workflow. Admin is a role/workspace, not a backend service. Place responsibilities as follows:

- **Auth module:** authentication, registration, sessions, permissions, roles, user administration, account deactivation.
- **Upload module:** PDF intake, upload validation request, object-storage coordination, file replacement, upload lifecycle.
- **Catalog module:** metadata, ISBN enrichment, catalogue search, document records, taxonomy, tags, approval/correction workflow.
- **Reader module:** reading authorization, presigned access, bookmarks, continue-reading state, reading history.
- **Processing module:** pipeline jobs, stage progress, failures, retry history, worker orchestration.
- **Notifications:** shared application/infrastructure capability driven by module events; do not make modules query each other's tables directly.
- **Reporting:** read/query layer over approved module-owned data; do not bypass module policies with ad hoc frontend database access.

---

## 3. Core operating rules

1. Inspect the repository before changing architecture, dependencies, or folder structure.
2. Inspect all first-level directories under `stitch_design/` before screen implementation.
3. Verify the expected screen count. Record the actual count and any missing, duplicate, or malformed screen folders. Do not silently invent missing screens.
4. Build reusable components before route pages.
5. Implement feature batches as vertical slices: contracts and states first, shared/domain components second, route composition third, integration fourth, testing last.
6. Do not create page-local versions of buttons, inputs, cards, dialogs, tables, badges, navigation, upload controls, job progress, or document summaries.
7. When the same visual or behavioral pattern appears twice, promote it into the shared component layer before completing the second consumer.
8. Keep domain logic outside presentational components.
9. Keep backend DTOs, controllers, use cases, policies, and persistence concerns inside the owning NestJS module.
10. Do not call PostgreSQL, S3/MinIO, Redis, BullMQ, or Tesseract directly from Next.js.
11. Do not use hard-coded design hex values, arbitrary shadows, arbitrary radii, repeated inline spacing, inline style attributes, or runtime CSS imports in route files.
12. Do not use placeholder links. Every item is either a real route, a real external link, or a semantic button.
13. Do not use generated Material Symbol text as the only accessible label.
14. Do not implement different data models for grid, list, loading, empty, filtered, or detail variants of the same feature.
15. Do not rewrite functional backend architecture merely to simplify a screen.
16. Preserve useful workflow and content intent from Stitch, but resolve contradictions through the canonical rules in this prompt.
17. Record genuine ambiguity in `docs/ui-decisions.md`; make one consistent implementation and continue.
18. Stop after each phase or screen batch. Report results and do not automatically begin the next batch.

---

## 4. Canonical product and visual decisions

Use **LIBIF** as the product brand everywhere.

Workspace labels are secondary context:

- Reader Portal
- Librarian Workspace
- Administration
- Management Analytics

Use these canonical tokens:

- navigation: `#0B2F2D`
- primary action: `#103C35`
- secondary, link, and focus: `#0C6668`
- interactive hover and progress: `#138A8A`
- page background: `#F7F9F8`
- surface: `#FFFFFF`
- border: `#D9E1DE`
- primary text: `#151C27`
- secondary text: `#414846`
- error: `#BA1A1A`

Add semantic success, warning, and information tokens with WCAG AA contrast.

Use:

- Be Vietnam Pro typography.
- An 8px base spacing rhythm.
- 8px radius for controls.
- 12px radius for large panels and dialogs.
- 4px radius for tags and checkboxes.
- Full pills only for statuses, avatars, and suitable segmented controls.
- Border-only static cards.
- One shared overlay shadow for dialogs, drawers, menus, and popovers.
- One H1 per route and ordered H2/H3 hierarchy.

Use English consistently unless the repository already has localization. When localization exists, move screen copy behind translation keys.

---

## 5. Required documentation before screen implementation

Create and maintain the following files.

### `docs/stitch-screen-index.md`

For every first-level folder in `stitch_design/`, record:

- exact folder name,
- files found,
- screenshot dimensions,
- presence of generated HTML,
- apparent workspace,
- apparent workflow,
- duplicate or variant relationship,
- implementation batch.

### `docs/screen-matrix.md`

For every Stitch screen, record:

- source folder,
- canonical Next.js route,
- user role/permission,
- workflow,
- workflow state,
- route, modal, drawer, component state, or responsive variant,
- owning frontend feature,
- owning NestJS module,
- REST endpoints required,
- reused shell,
- reused components,
- implementation status.

### `docs/architecture-alignment.md`

Record:

- current repository structure,
- deviations from the target architecture,
- module boundaries,
- frontend-to-API boundary,
- object-storage boundary,
- queue/worker boundary,
- event ownership,
- migration strategy for any legacy code,
- decisions that prevent accidental microservice fragmentation.

### `docs/ui-decisions.md`

Record:

- canonical design tokens,
- workspace naming,
- navigation taxonomy,
- shell dimensions,
- responsive rules,
- component variant rules,
- status dictionary,
- terminology decisions,
- intentional deviations from Stitch,
- unresolved product questions.

### `docs/workflow-state-machines.md`

Document states, commands, events, transition rules, API responses, and permissions for:

- authentication and password reset,
- upload and file replacement,
- metadata and ISBN enrichment,
- PDF processing,
- approval and correction,
- protected reader access,
- report export,
- category deletion/reassignment,
- tag merging,
- role change,
- account deactivation.

### `docs/component-inventory.md`

For every shared component, record:

- responsibility,
- public API,
- variants,
- sizes,
- accessibility contract,
- responsive behavior,
- owning location,
- consuming screens.

### `docs/api-contracts.md`

Record or link to generated OpenAPI definitions for each implemented batch. Include:

- request and response DTOs,
- pagination contract,
- filter and sort contract,
- error envelope,
- permission failures,
- asynchronous job acceptance response,
- processing-job status schema.

OpenAPI remains the source of truth; this document explains the screen-to-endpoint mapping.

---

## 6. Phase 0 — Architecture and Stitch audit

Begin with Phase 0 only.

1. Inventory repository workspaces, scripts, framework versions, routes, components, dependencies, environment files, lint rules, tests, build configuration, database layer, API modules, object-storage adapter, queue adapter, and worker entry points.
2. Enumerate every first-level folder under `stitch_design/` and create `docs/stitch-screen-index.md`.
3. Compare each screenshot and generated HTML. Treat screenshot output as the visual authority when they conflict.
4. Map all screens into `docs/screen-matrix.md`.
5. Identify screens that are states, overlays, responsive variants, or duplicate concepts rather than separate routes.
6. Consolidate terminology and canonical navigation.
7. Map each workflow to Auth, Upload, Catalog, Reader, or Processing ownership.
8. Identify cross-module events and prohibit direct cross-module repository reads.
9. Define REST contracts needed by each screen batch.
10. Define role permissions and route visibility.
11. Define all workflow state machines.
12. Inventory reusable components required by more than one screen.
13. Produce an implementation plan with exact files to create or change.
14. Report architecture gaps separately from design inconsistencies.

Do not implement complete screens in Phase 0.

### Phase 0 exit criteria

- All actual `stitch_design/` folders are indexed.
- Every screen has a route/state classification and batch assignment.
- Every screen maps to a frontend feature and owning NestJS module.
- Module boundaries and internal event flows are documented.
- The canonical route map and navigation taxonomy are approved in documentation.
- No feature page implementation has begun.

Stop and report Phase 0 results.

---

## 7. Phase 1 — Design foundations and reusable components

Build shared frontend foundations before full route screens.

### Design foundations

Create:

- semantic color tokens,
- typography tokens and semantic typography components,
- spacing tokens,
- radius tokens,
- border tokens,
- elevation tokens,
- breakpoint tokens,
- motion tokens,
- z-index tokens,
- focus-visible policy,
- standard icon wrapper for 16px, 20px, and 24px icons.

Use CSS variables as semantic tokens and expose them through Tailwind. Consumer components reference semantic names, not raw hex values.

### Actions and indicators

Create:

- `Button`: primary, secondary, ghost, destructive, link; small, medium, large, icon sizes,
- `IconButton`,
- `Badge`,
- `StatusBadge`,
- `Avatar`,
- `Divider`,
- `Tooltip`,
- `Spinner`,
- `Skeleton`,
- `ProgressBar`,
- `Stepper`.

### Forms

Create:

- `FormField`,
- `TextInput`,
- `PasswordInput`,
- `SearchInput`,
- `Textarea`,
- `Select`,
- `Checkbox`,
- `RadioGroup`,
- `Switch`,
- `DateInput` or `DateRangePicker`,
- `FileDropzone`,
- `FilterBar`,
- `FilterDrawer`.

`FormField` owns:

- visible label,
- required indicator,
- description,
- validation error,
- control ID,
- `aria-invalid`,
- `aria-describedby`.

Reuse the repository's existing form library. When none exists, use React Hook Form with schema validation suitable for both client UX and NestJS DTO contracts. Do not treat client validation as a replacement for API validation.

### Surfaces and feedback

Create:

- `Card`,
- `Panel`,
- `MetricCard`,
- `SelectableCard`,
- `InlineAlert`,
- `Toast`,
- `EmptyState`,
- `ResultState`,
- `Dialog`,
- `ConfirmationDialog`,
- `DestructiveDialog`,
- `Drawer`.

### Navigation

Create:

- `AppShell`,
- `AdminShell`,
- `ReaderShell`,
- `Sidebar`,
- `TopBar`,
- `MobileNavDrawer`,
- `Breadcrumbs`,
- `Tabs`,
- `PageHeader`,
- `UserMenu`,
- `NotificationButton`.

### Data display

Create:

- `DataTable`,
- `TableToolbar`,
- `BulkActionBar`,
- `ColumnHeader`,
- `RowActions`,
- `Pagination`,
- `DescriptionList`,
- `Timeline`,
- `ChartCard`,
- `KpiCard`.

All production tables use backend pagination, filtering, and sorting contracts. Client-only filtering is allowed only for small, explicitly local data sets.

### Domain components

Create:

- `DocumentCard`,
- `DocumentRow`,
- `DocumentStatusBadge`,
- `DocumentMetadataSummary`,
- `AuditTimeline`,
- `UploadWorkflow`,
- `ProcessingStageStepper`,
- `ProcessingJobSummary`,
- `ApprovalDecisionPanel`,
- `CorrectionRequestPanel`,
- `CategoryTree`,
- `TagSelector`,
- `UserRoleBadge`,
- `NotificationItem`,
- `ReaderBookCard`,
- `ProtectedPdfViewer`,
- `JobStatusPoller` as integration behavior rather than duplicated page effects.

Add Storybook or the repository's existing isolated component catalogue.

Demonstrate for relevant components:

- default,
- hover,
- focus,
- disabled,
- loading,
- error,
- empty,
- long-content,
- permission-restricted,
- narrow-container states.

### Phase 1 exit criteria

- No raw design hex values in consumers.
- No duplicate button, input, dialog, status, or table implementation.
- All interactive components support keyboard operation.
- Accessible names and form relationships are present.
- Components render at mobile, tablet, and desktop widths.
- Component tests and automated accessibility checks pass.
- No complete feature route has bypassed the shared components.

Stop and report Phase 1 results.

---

## 8. Phase 2 — Next.js shells, routing, auth boundary, and API client

Implement role-aware layouts before feature screens.

### Next.js route groups

Use equivalent route groups to:

```text
(auth)     authentication and access-result screens
(reader)   discovery, catalogue, personal library, protected reader
(admin)    librarian, approval, taxonomy, users, reporting, settings
```

Route groups must not create alternate brands.

### Shells

Implement:

1. Reader Portal shell.
2. Librarian/Administration shell.
3. Management Analytics shell only when permissions or navigation materially differ.

Use one canonical:

- brand treatment,
- sidebar width,
- header height,
- page container,
- active-navigation pattern,
- breadcrumb model,
- mobile-navigation behavior,
- user menu,
- notification control.

### Authentication and authorization boundary

- Protect Next.js routes for UX.
- Enforce all permissions again in NestJS guards/policies.
- Do not rely on hidden navigation as authorization.
- Avoid exposing protected content in Next.js static output.
- Use role/permission data returned by the authenticated session API.

### API client

- Generate or validate the frontend client from NestJS OpenAPI.
- Provide one request adapter for server-side calls and one browser-safe adapter where interactive client calls are required.
- Normalize API errors into one typed frontend error model.
- Do not scatter raw `fetch` calls through page components.
- Keep mock data behind the same service interfaces used by the real API.
- Mark mock-backed screens clearly in batch reports.

### Phase 2 exit criteria

- Canonical layouts and route map are implemented.
- The typed API client compiles.
- Authentication and permission boundaries are represented on both frontend and backend.
- Placeholder links are removed.
- Responsive navigation works at required breakpoints.

Stop and report Phase 2 results.

---

## 9. Smart feature-batch workflow

For every batch, execute this sequence in order.

### Step A — Source analysis

1. Inspect only the Stitch folders assigned to the current batch.
2. Compare screenshots, generated HTML, text, and states.
3. Update the screen matrix when the source reveals a different state or component relationship.

### Step B — Contract and domain model

1. Define typed frontend view models.
2. Define or verify NestJS DTOs, commands, policies, and REST endpoints.
3. Define state transitions and internal events.
4. Update OpenAPI and regenerate/validate the frontend client.
5. Create contract-faithful mocks only when the backend implementation is not yet available.

### Step C — Reusable components first

1. List existing primitives and domain components that satisfy the batch.
2. Build missing reusable domain components before pages.
3. Promote repeated local patterns immediately.
4. Add component stories and tests before route composition.

### Step D — Screen composition

1. Compose screens from shared components.
2. Keep loading, empty, error, success, permission, and filtered states inside the same route frame.
3. Use URL search parameters for shareable catalogue filters, sorting, pagination, tabs, and view modes where appropriate.
4. Use Next.js `loading`, `error`, and not-found boundaries where they represent route-level behavior.
5. Avoid unnecessary client components and global state.

### Step E — Integration

1. Connect screens through the typed API client.
2. Ensure Next.js never bypasses NestJS to access PostgreSQL, object storage, Redis, BullMQ, or Tesseract.
3. Use REST polling for active processing/export status unless the repository already contains an approved real-time mechanism.
4. Stop polling on terminal states, route changes, hidden/unmounted consumers, and repeated unrecoverable errors.
5. Invalidate or refresh server-rendered data after successful mutations.

### Step F — Validation

Validate at approximately:

- 375px,
- 768px,
- 1024px,
- 1440px.

Run:

- formatter,
- linter,
- strict TypeScript checks for web and API,
- frontend unit/component tests,
- NestJS unit tests,
- API integration/e2e tests for changed endpoints,
- component interaction tests,
- route-level workflow tests,
- automated accessibility tests,
- visual regression tests,
- Next.js production build,
- NestJS production build.

### Step G — Stop and report

Update all documentation and return the required completion report. Do not start the next batch automatically.

---

## 10. Screen implementation batches

Use the folder names found in `stitch_design/`. The following mapping is the expected starting point. Reconcile it with the actual folder inventory during Phase 0.

### Batch 1 — Authentication and access

Expected Stitch screens:

- `sign_in`
- `sign_in_validation_error`
- `forgot_password`
- `reset_password`
- `password_reset_completed`
- `reader_registration`
- `session_expired`
- `access_denied`

Architecture ownership:

- Frontend: `(auth)` routes and shared auth shell.
- Backend: Auth module.
- Communication: REST request-response.

Requirements:

- Validation errors are states of the same form, not duplicated routes.
- Session expiration and access denial use shared result-state components.
- NestJS owns credential validation, session issuance, role/permission resolution, and reset-token rules.
- Frontend messages map safely from typed API error codes.

### Batch 2 — Reader discovery and personal library

Expected Stitch screens:

- `reader_home`
- `reader_portal_application_shell`
- `reader_portal_compact_navigation_state`
- `catalogue_grid`
- `catalogue_list`
- `catalogue_filter_panel`
- `catalogue_loading`
- `catalogue_no_results`
- `full_text_search`
- `full_text_results`
- `bookmarks`
- `continue_reading`
- `reading_history`
- `secure_reader_compact_layout`

Architecture ownership:

- Frontend: `(reader)` routes, SSR/RSC where suitable.
- Backend: Catalog module for discovery; Reader module for access and personal reading state.
- Database: PostgreSQL catalogue queries with `pg_trgm` behavior.
- Storage: protected object access only through Reader authorization.

Requirements:

- Grid and list are view variants of one results route and one query model.
- Query, filters, sort, page, and view mode use canonical URL/search state.
- Loading and no-results states preserve toolbar and active filters.
- The secure reader requests a short-lived access grant from NestJS.
- Render protected PDF content through `ProtectedPdfViewer` without embedding public object URLs.
- Do not store presigned URLs beyond the active reader session.

### Batch 3 — Documents, upload, ISBN, and metadata

Expected Stitch screens:

- `digital_documents_list`
- `document_filters_bulk_actions`
- `document_details_overview`
- `document_audit_history`
- `upload_pdf_default`
- `upload_in_progress`
- `upload_validation_error`
- `barcode_scanner`
- `isbn_lookup_result`
- `isbn_metadata_form`
- `edit_metadata`
- `metadata_review_submit`
- `replace_pdf`
- `published_success`

Architecture ownership:

- Frontend: admin document and upload features.
- Backend: Upload module for file intake/storage lifecycle; Catalog module for document metadata and ISBN enrichment.
- Storage: S3/MinIO private object storage.
- Communication: REST for upload and metadata commands; internal `BookUploadedEvent` after accepted upload.

Requirements:

- Model upload, storage receipt, validation request, ISBN enrichment, metadata entry, review, and publication as a documented state machine.
- Use one drop zone, one upload-progress model, one form system, one stepper, one document detail layout, and one result-state pattern.
- Upload APIs return an accepted document/job identifier without waiting for OCR.
- File replacement creates an auditable new object/version; do not overwrite silently.
- ISBN lookup occurs through NestJS, not through direct browser calls to third-party services.
- Audit history is server-authoritative.

### Batch 4 — Processing queue and jobs

Expected Stitch screens:

- `processing_queue`
- `processing_queue_empty`
- `processing_queue_filtered`
- `processing_quick_detail_drawer`
- `processing_job_active`
- `processing_job_completed`
- `processing_job_failed`
- `retrying_history`

Architecture ownership:

- Frontend: processing queue and job views.
- Backend: Processing module.
- Infrastructure: Redis, BullMQ, Tesseract, object storage.
- Pipeline: Validation -> Compression -> OCR Text -> Search Indexing.

Requirements:

- Use one typed `ProcessingJob` contract and one status dictionary.
- Queue states share columns, filters, selection, pagination, and row actions.
- Active, completed, failed, and retrying screens are states of one job-detail layout.
- Stage progress maps to actual backend pipeline stages.
- Use bounded REST polling through `JobStatusPoller` for active jobs.
- Display automatic retry attempt history without exposing raw BullMQ internals.
- User-triggered retry commands pass through NestJS authorization and Processing application services.
- Terminal failures provide safe user messages and trace/reference IDs, not stack traces.

### Batch 5 — Approval, correction, and notifications

Expected Stitch screens:

- `approval_queue`
- `approval_review`
- `approval_confirmation_modal`
- `rejection_correction_modal`
- `correction_requested`
- `correction_review_resubmit`
- `resubmitted_review`
- `rejected_document_correction`
- `librarian_correction_notification`
- `notification_centre`
- `action_notification_detail`

Architecture ownership:

- Frontend: admin review and notification features.
- Backend: Catalog module owns approval/correction state; shared notification handlers react to internal events.
- Communication: REST commands plus internal events for notification side effects.

Requirements:

- Implement one approval/correction state machine.
- Treat rejection and request-for-correction as different commands and transitions.
- Normalize Approve, Approve and Publish, Reject, Request Correction, Return, Resubmit, and Review terminology.
- Notification records reference domain entities and authorized actions; they do not duplicate workflow truth.
- Reuse queue, review, decision panel, dialog, drawer, status, and result components.
- Correct the known horizontal overflow and clipping in `action_notification_detail`.

### Batch 6 — Taxonomy, tags, users, and risky actions

Expected Stitch screens:

- `admin_workspace_application_shell`
- `category_tree_management`
- `add_edit_category`
- `category_deletion_warning`
- `category_reassignment`
- `tag_management`
- `duplicate_tag_review`
- `merge_tags`
- `merge_confirmation`
- `user_list`
- `user_detail`
- `role_change_confirmation`
- `deactivate_account`

Architecture ownership:

- Catalog module: categories, tags, merge, reassignment.
- Auth module: users, roles, permissions, deactivation.
- Frontend: canonical administration shell.

Requirements:

- Category reassignment, tag merge, deletion, role change, and deactivation share dialog anatomy, CTA order, reason fields, audit language, and focus behavior.
- Backend transactions maintain referential integrity for reassignment and merge operations.
- Role and deactivation commands require NestJS authorization and produce audit records.
- Never infer authorization from visible controls alone.

### Batch 7 — Dashboards, reports, export, and settings

Expected Stitch screens:

- `librarian_dashboard`
- `management_dashboard`
- `dashboard_date_filtering`
- `dashboard_loading_empty`
- `chart_detail_data_table`
- `export_report_options`
- `report_export_in_progress`
- `report_export_completed`
- `report_export_failed`
- `general_settings`
- `security_session_settings`

Architecture ownership:

- Frontend: dashboard, reports, settings features.
- Backend: module-owned query services composed through a reporting/read layer; Auth owns security/session settings.
- Long-running export: REST command plus internal background event/job when required.

Requirements:

- Use shared KPI cards, chart containers, date filters, drill-down tables, settings sections, and security alerts.
- Skeleton dimensions match final dashboard structures.
- Reporting reads approved module-owned data through application/query services, not direct cross-module repository access.
- Export configuration may use a drawer.
- In-progress, completed, and failed exports use one report-job status model.
- Long-running exports use the same asynchronous acceptance and status-query principles as processing jobs.

### Batch 8 — Cross-screen integration and hardening

After all feature batches pass independently:

1. Test complete user journeys across Auth, Upload, Catalog, Processing, Reader, and approval flows.
2. Verify internal events do not create duplicate jobs or notifications.
3. Verify idempotent handling of upload acceptance, retries, approval commands, merge commands, and exports.
4. Verify route permissions against NestJS policy responses.
5. Verify object access expiration and reader renewal behavior.
6. Verify all screen states at required breakpoints.
7. Run full visual regression against the Stitch references while preserving standardized component decisions.
8. Remove obsolete mocks, dead components, duplicate tokens, and temporary compatibility code.
9. Complete production builds and deployment documentation for web, API, workers, PostgreSQL, Redis, and MinIO/S3 configuration.

---

## 11. API and asynchronous workflow rules

### REST response conventions

Use one error envelope with:

- stable error code,
- safe user-facing message,
- field errors where applicable,
- trace/reference identifier,
- HTTP status.

Use one paginated collection contract with:

- items,
- page or cursor metadata,
- total where supported,
- applied filters,
- sort.

### Long-running commands

Upload, OCR processing, and long-running report export must not hold an HTTP request open until work completes.

The accepted response includes:

- resource identifier,
- job identifier,
- accepted/current status,
- status endpoint or data required by the typed client.

### Event handling

- Name events in past tense when they represent facts, such as `BookUploadedEvent`.
- Event handlers must be idempotent.
- Do not place UI concerns in event handlers.
- Persist workflow state transitions and audit records before emitting dependent side effects where required.
- Do not couple browser state to internal event timing.

### Processing status model

The UI-facing status contract must map infrastructure details into stable domain states such as:

- queued,
- validating,
- compressing,
- performing_ocr,
- indexing,
- retrying,
- completed,
- failed,
- cancelled when supported.

Do not expose Redis keys, BullMQ queue names, processor file paths, or Tesseract command lines to users.

---

## 12. Accessibility requirements

- Exactly one H1 per route.
- Ordered heading hierarchy.
- Every form control has a visible label or explicit accessible name.
- Every icon-only action has `aria-label`; add a tooltip where useful.
- Every button has an explicit `type`.
- Dialogs trap focus, support Escape when safe, restore focus, and lock background scrolling.
- Menus, tabs, trees, tables, drawers, and steppers support keyboard operation.
- Errors use `aria-invalid`, `aria-describedby`, and suitable live regions.
- Images have meaningful alt text or empty alt text when decorative.
- Status is never communicated by color alone.
- Progress updates use appropriate accessible progress semantics and restrained live announcements.
- Protected reader controls remain keyboard accessible.
- Meet WCAG AA color contrast and visible-focus requirements.

---

## 13. Quality gates

A phase or batch is not complete while it contains:

- horizontal overflow,
- clipped content,
- placeholder navigation,
- duplicated shared-component implementations,
- direct Next.js access to PostgreSQL, S3/MinIO, Redis, BullMQ, or Tesseract,
- business rules duplicated in React components,
- invalid or undefined design tokens,
- inaccessible controls,
- console errors,
- failed frontend or backend tests,
- failed web or API production builds,
- untracked mock data,
- unresolved critical visual differences,
- undocumented architecture deviations.

Run and report:

- formatting,
- linting,
- strict TypeScript checks,
- Next.js unit and component tests,
- NestJS unit and API integration tests,
- component interaction tests,
- route-level workflow tests,
- automated accessibility tests,
- visual regression at mobile, tablet, desktop, and wide desktop,
- Next.js production build,
- NestJS production build.

---

## 14. Required completion report after every phase or batch

Return:

1. Phase or batch completed.
2. Stitch folders/screens inspected.
3. Routes and workflow states implemented.
4. NestJS modules, controllers, DTOs, policies, or events changed.
5. REST/OpenAPI contracts added or changed.
6. Shared components reused.
7. New shared components introduced.
8. Internal events, queues, workers, or object-storage integrations affected.
9. Design inconsistencies resolved.
10. Intentional deviations from Stitch and rationale.
11. Responsive checks completed.
12. Accessibility checks completed.
13. Frontend test/build results.
14. Backend test/build results.
15. Mocked integrations still present.
16. Remaining issues and readiness for the next phase or batch.

Begin with **Phase 0 only**. Do not jump directly into implementing pages, and do not start Phase 1 until the repository and all actual `stitch_design/` folders have been audited and documented.
