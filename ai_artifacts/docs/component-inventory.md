# Component Inventory

Last updated: 2026-07-22

This file combines the original component contract inventory with the current implementation locations. Treat the tables below as the component source of truth for future phases.

| Component | Responsibility | Public API sketch | Variants / sizes | Accessibility contract | Responsive behavior | Owning location | Consuming screens |
|---|---|---|---|---|---|---|---|
| Button | Trigger primary and secondary actions | `variant`, `size`, `loading`, `icon`, `children` | primary, secondary, ghost, destructive, link; sm/md/lg/icon | explicit `type`, disabled/loading semantics, visible focus | touch target >= 44px on mobile | `apps/web/components/ui` | all forms, dialogs, toolbars |
| IconButton | Icon-only actions | `ariaLabel`, `icon`, `variant`, `size` | 16/20/24 icon slots | required accessible name and tooltip where useful | preserves target size | `apps/web/components/ui` | shells, tables, reader controls |
| FormField | Field wrapper | `label`, `description`, `error`, `required`, `controlId` | default, error, disabled | owns `aria-invalid` and `aria-describedby` | full-width in narrow layouts | `apps/web/components/ui/forms` | auth, metadata, settings, taxonomy, users |
| TextInput / PasswordInput / Textarea / Select | Standard form controls | standard value/change props | default, disabled, error | visible label through FormField | stack on mobile | `apps/web/components/ui/forms` | auth, metadata, settings |
| FileDropzone | PDF upload control | `accept`, `maxSize`, `onFile`, `error` | default, dragging, disabled, error | keyboard file selection and error live region | full-width and thumb-safe | `apps/web/components/ui/forms` | upload_pdf_default, replace_pdf |
| FilterBar / FilterDrawer | Filtering/search controls | filters, sort, active count, submit/reset | inline, drawer, compact | labelled controls and keyboard drawer | drawer below tablet | `apps/web/components/ui/forms` | catalogue, documents, processing, reports |
| Card / Panel | Static surfaces | padding, tone, heading slot | default, compact, metric | semantic region when titled | adapts padding | `apps/web/components/ui/surfaces` | dashboards, details, home |
| Dialog / ConfirmationDialog / DestructiveDialog | Modal decisions | open, title, description, actions | confirmation, destructive, form | focus trap, Escape policy, restore focus | max width and scroll containment | `apps/web/components/ui/overlays` | approval, rejection, category, tag, user actions |
| Drawer | Side panel details/actions | open, side, title, children | detail, filter, export | focus management and labelled heading | bottom/full-screen on mobile | `apps/web/components/ui/overlays` | filters, processing detail, export options |
| EmptyState / ResultState / InlineAlert | Feedback and terminal states | title, message, action, tone | empty, success, error, warning, info | live region where state changes | centered but not viewport-trapped | `apps/web/components/ui/feedback` | auth results, catalog empty, jobs, exports |
| StatusBadge / DocumentStatusBadge / UserRoleBadge | Status/role communication | status enum, label override | neutral, info, success, warning, error | not color-only; text visible | wraps without clipping | `apps/web/components/ui` + `domain` | documents, processing, users, approvals |
| DataTable | Server-backed tabular data | columns, rows, page, sort, selection | selectable, compact, loading | table semantics, sortable headers, keyboard row actions | horizontal strategy without clipping | `apps/web/components/ui/data` | documents, processing, approvals, users, reports |
| Pagination | Page navigation | page, pageSize, total/cursor, onChange | page, cursor | labelled nav and current page | compact controls on mobile | `apps/web/components/ui/data` | catalogue, lists, reports |
| AppShell / ReaderShell / AdminShell | Application frames | nav items, user, role, utilities | reader, admin, management | landmarks, skip link, one H1 in page content; one primary nav source per viewport | Reader header navigation; staff desktop sidebar with utility-only topbar; staff mobile drawer from one permission-aware model | `apps/web/components/layout` | all route groups |
| Breadcrumbs / Tabs / PageHeader | Page hierarchy | items, active tab, actions | default, compact | ordered nav/list semantics | wraps predictably | `apps/web/components/layout` | admin details, settings, reports |
| DocumentCard / DocumentRow | Document summary | document view model, actions | grid card, list row, compact | title/author semantics, action labels | grid/list switch by route state | `apps/web/components/domain/documents` | catalogue, bookmarks, admin docs |
| DocumentMetadataSummary | Metadata details | document metadata DTO | compact, full | description list semantics | stacks fields | `apps/web/components/domain/documents` | details, approval, ISBN result |
| AuditTimeline / Timeline | Ordered events | events, density | audit, retry, reading | ordered list/time semantics | single column on mobile | `apps/web/components/domain` | audit history, retrying history, user detail |
| UploadWorkflow | Upload vertical flow | current step, upload state, job id | default, replacement | progress semantics and error live region | single-column mobile | `apps/web/components/domain/upload` | upload, replace PDF |
| ProcessingStageStepper | Pipeline progress | stages, current stage, status | horizontal, vertical | current step announced, not color-only | vertical on narrow screens | `apps/web/components/domain/processing` | upload result, processing jobs |
| ProcessingJobSummary | Job details | job DTO | active, completed, failed | safe error copy and trace id | drawer/page variants | `apps/web/components/domain/processing` | processing queue/job screens |
| JobStatusPoller | Integration behavior for bounded polling | endpoint, terminal states, interval, children | active job, export job | restrained live announcements | stops on unmount/hidden | `apps/web/components/domain/processing` | processing, exports |
| ApprovalDecisionPanel | Review decision UI | document, allowed actions, onDecision | approve, publish, reject, correction | explicit buttons and reason field labels | stacks actions | `apps/web/components/domain/approval` | approval screens |
| CorrectionRequestPanel | Correction details/editing | correction DTO, editable | read, edit, resubmit | labelled reason/details | responsive text wrapping | `apps/web/components/domain/approval` | correction screens |
| CategoryTree | Hierarchical taxonomy | nodes, selected, onSelect | picker, manager, reassignment | tree keyboard support | collapses to drawer/picker | `apps/web/components/domain/taxonomy` | categories, metadata form |
| CategorySelector | Controlled document category selection | `categories`, `value`, `onChange`, labels/errors/disabled | optional category | visible label, described-by/error semantics | full-width select on narrow layouts | `apps/web/components/domain/taxonomy` | document metadata forms |
| TagSelector | Controlled document tag selection | `tags`, `value`, `onChange`, labels/disabled | checkbox multi-select, empty | labelled fieldset, explicit empty status | wraps options through shared cluster layout | `apps/web/components/domain/taxonomy` | document metadata forms |
| CategoryManager | Starter category list/create/edit surface | `categories`, `canManage` | Admin editable, Librarian read-only | labelled form/table, accessible edit actions, error alert | shared table wrapping and stacked form | `apps/web/components/domain/taxonomy` | `/admin/categories` |
| TagManager | Starter tag list/create/edit surface | `tags`, `canManage` | Admin editable, Librarian read-only | labelled form/table, accessible edit actions, error alert | shared table wrapping and stacked form | `apps/web/components/domain/taxonomy` | `/admin/tags` |
| NotificationItem | Notification summary/action | notification DTO, action slot | list, detail, action-required | role/status text, button labels | no horizontal clipping | `apps/web/components/domain/notifications` | notifications |
| ReaderBookCard | Reader-facing book card | book, progress, actions | home, bookmark, history | title/author/access labels | responsive card grid | `apps/web/components/domain/reader` | reader home, bookmarks |
| ProtectedPdfViewer | Protected reader UI | accessGrant, book, progress callbacks | compact, full | keyboard controls, no security claims from UI deterrents | controls adapt to viewport | `apps/web/components/domain/reader` | secure reader |
| ChartCard / KpiCard / MetricCard | Reporting visuals | title, value/data, loading | chart, KPI, metric | text alternatives/data table link | preserves skeleton dimensions | `apps/web/components/domain/reports` | dashboards, reports |

## Remaining UI migration notes

- `apps/web/app/layout.tsx` now owns only root document/font setup; role-aware navigation lives in `ReaderShell`, `AdminShell`, and `AuthShell`. The staff shell follows the Stitch application-shell model: desktop primary navigation is sidebar-only, the topbar is contextual/utility-only, and mobile reuses the same destinations in a drawer.
- `apps/web/components/book-intake/*` now uses shared primitives; later upload/catalog batches should move deeper domain behavior behind Upload/Catalog contracts without duplicating UI primitives.

---

## Phase 1 implementation update — 2026-07-20

Implemented shared foundations are now located under the existing Next.js structure:

| Area | Implemented paths | Notes |
|---|---|---|
| Token/base styles | `apps/web/styles/tokens.css`, `apps/web/styles/base.css`, `apps/web/styles/components.css`, `apps/web/app/globals.css` | Semantic CSS variables, Tailwind import, base focus policy, component classes. |
| Shared utility | `apps/web/lib/classnames.ts` | Small dependency-free class composition helper. |
| Actions | `apps/web/components/ui/actions/Button.tsx`, `apps/web/components/ui/actions/IconButton.tsx` | Explicit button type, loading/disabled semantics, accessible icon button label. |
| Indicators | `apps/web/components/ui/indicators/*`, `apps/web/components/ui/status/status-config.ts` | Badge, StatusBadge, Avatar, Divider, Tooltip, Spinner, Skeleton, ProgressBar, Stepper. |
| Forms | `apps/web/components/ui/forms/*` | FormField owns labels/descriptions/errors/control ids/ARIA; includes text/password/search/date inputs, textarea, select, checkbox/radio/switch, FileDropzone, filters. |
| Surfaces/feedback | `apps/web/components/ui/surfaces/Card.tsx`, `apps/web/components/ui/feedback/feedback.tsx` | Card, Panel, MetricCard, SelectableCard, InlineAlert, EmptyState, ResultState, Toast. |
| Overlays | `apps/web/components/ui/overlays/overlays.tsx` | Dialog/ConfirmationDialog/DestructiveDialog/Drawer foundations with labels, Escape close, focus entry/trap, scroll lock, and focus restore. |
| Layout and shells | `apps/web/components/layout/index.tsx` | PageHeader, Breadcrumbs, Tabs, AppShell, ReaderShell, session-backed AdminShell, AuthShell, AccessBoundaryCard. |
| Data display | `apps/web/components/ui/data/DataTable.tsx` | DataTable, table toolbar, bulk actions, row/column helpers, pagination, description list, timeline, chart/KPI cards. |
| Domain foundations | `apps/web/components/domain/**` | DocumentCard/Row/StatusBadge/MetadataSummary, AuditTimeline, UploadWorkflow, ProcessingStageStepper, ProcessingJobSummary, UserRoleBadge. |
| Catalogue | `apps/web/components/catalogue/ComponentCatalogue.tsx` | Non-routed isolated component catalogue fallback instead of Storybook. |
| Tests | `apps/web/tests/ui-components.spec.tsx`, `apps/web/tests/book-intake.spec.tsx` | Component semantics and intake regression coverage. |

Current proof UI migrated to shared primitives:

- `apps/web/app/(reader)/page.tsx`
- `apps/web/app/(reader)/catalogue/page.tsx`
- `apps/web/app/catalog/page.tsx` compatibility redirect
- `apps/web/app/(admin)/admin/books/new/page.tsx`
- `apps/web/app/(admin)/admin/books/page.tsx`
- `apps/web/app/(auth)/access-denied/page.tsx`
- `apps/web/app/(auth)/session-expired/page.tsx`
- `apps/web/components/book-intake/BookIntakeForm.tsx`
- `apps/web/components/book-intake/CategoryTagFields.tsx`
- `apps/web/components/book-intake/MetadataFields.tsx`
- `apps/web/components/book-intake/PdfDropzone.tsx`

Deferred from Phase 1 and Phase 2 by design:

- Production sign-in/register/password reset UI, protected PDF viewer, approval/correction panels, category tree management, notification item, reader book card, and job polling behavior remain batch-specific/domain-deepening work unless required by the next batch.

Automated accessibility and shell coverage:

- `apps/web/tests/shells-auth.spec.tsx` covers shell landmarks/navigation and dev auth header behavior.
- `apps/web/tests/accessibility.spec.tsx` renders the non-routed component catalogue and checks it with `jest-axe`.
- `apps/web/tests/setup.ts` registers the `toHaveNoViolations` matcher.

### Phase 1 acceptance fix inventory — 2026-07-20

| Area | Implemented update | Verification anchor |
|---|---|---|
| Typography | Loaded Be Vietnam Pro via `next/font/google` and mapped the token variable into `--font-sans`. | `apps/web/app/layout.tsx`, `apps/web/styles/tokens.css` |
| Status badges | Expanded canonical `statusConfig` to every Phase 1 dictionary state. | `apps/web/components/ui/status/status-config.ts`, `apps/web/tests/ui-components.spec.tsx` |
| Overlays | Added Escape close, focus entry/trap, scroll lock, and focus restore to Dialog/Drawer foundations. | `apps/web/components/ui/overlays/overlays.tsx`, overlay Vitest cases |
| Data table | Added controlled server-state contract for pagination, sort, filters, row count, loading, and state changes while preserving static table use. | `apps/web/components/ui/data/DataTable.tsx`, DataTable Vitest cases |
| Catalogue | Added narrow-container, long-content, focus-visible, overlay, and controlled data examples without creating public routes. | `apps/web/components/catalogue/ComponentCatalogue.tsx`, catalogue axe/smoke tests |

---

## Phase 3 auth/access implementation update — 2026-07-20

| Area | Implemented paths | Notes |
|---|---|---|
| Auth forms | `apps/web/components/auth/AuthForms.tsx` | Composes shared `Card`, `FormField`, `TextInput`, `PasswordInput`, `Button`, `InlineAlert`, and `ResultState` for sign-in, registration, forgot-password, and reset-password states. |
| Sign-out action | `apps/web/components/auth/SignOutButton.tsx` | Client-side sign-out affordance for authenticated shells; calls the generated auth API wrapper and returns to `/sign-in`. |
| Auth routes | `apps/web/app/(auth)/sign-in/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`, `reset-password/completed/page.tsx` | Batch 1 screens implemented with existing AuthShell and shared primitives; no new design tokens or one-off form controls. |
| Auth tests | `apps/web/tests/auth-forms.spec.tsx` | Covers registration validation, sign-in error state, uniform reset-request success, and reset-token API error display. |

Deferred auth UI/component work remains in later batches: user administration, role changes, account deactivation, security settings, OAuth/MFA/passkeys, and production email-provider configuration screens.

---

## Phase 5 taxonomy selector update — 2026-07-22

`CategorySelector` and `TagSelector` provide controlled, persistence-agnostic taxonomy inputs under `apps/web/components/domain/taxonomy/`; the existing intake form now consumes them while preserving its current tag-name payload contract. `CategoryManager` and `TagManager` add Admin create/edit plus Librarian read-only states. D5-004 generated the typed web adapters used by these routes and components.
