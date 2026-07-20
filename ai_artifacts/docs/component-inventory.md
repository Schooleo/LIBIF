# Component Inventory

Generated: 2026-07-20 08:47:25Z

Phase 0 inventory only. Components listed here are candidates/contracts for Phase 1+; this pass does not implement them.

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
| AppShell / ReaderShell / AdminShell | Application frames | nav items, user, breadcrumbs, notifications | reader, admin, management | landmarks, skip link, one H1 in page content | mobile drawer and desktop sidebar/header | `apps/web/components/layout` | all route groups |
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
| TagSelector | Tag selection/merge input | selected, options, create/merge hooks | multi-select, merge | combobox/listbox semantics | wraps chips | `apps/web/components/domain/taxonomy` | tags, metadata |
| NotificationItem | Notification summary/action | notification DTO, action slot | list, detail, action-required | role/status text, button labels | no horizontal clipping | `apps/web/components/domain/notifications` | notifications |
| ReaderBookCard | Reader-facing book card | book, progress, actions | home, bookmark, history | title/author/access labels | responsive card grid | `apps/web/components/domain/reader` | reader home, bookmarks |
| ProtectedPdfViewer | Protected reader UI | accessGrant, book, progress callbacks | compact, full | keyboard controls, no security claims from UI deterrents | controls adapt to viewport | `apps/web/components/domain/reader` | secure reader |
| ChartCard / KpiCard / MetricCard | Reporting visuals | title, value/data, loading | chart, KPI, metric | text alternatives/data table link | preserves skeleton dimensions | `apps/web/components/domain/reports` | dashboards, reports |

## Current one-off UI to migrate later

- `apps/web/app/globals.css` global `.card`, `.grid`, `button`, `input`, and raw color styles should become semantic tokens and shared components in Phase 1.
- `apps/web/app/layout.tsx` global nav should become role-aware shells in Phase 2.
- `apps/web/components/book-intake/*` should be decomposed/reused through shared form, upload, metadata, category/tag, progress, and result components.
