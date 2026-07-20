# UI Decisions

Generated: 2026-07-20 08:47:25Z

## Canonical brand and workspace naming

- Product brand: **LIBIF** everywhere.
- Workspace labels are secondary context:
  - Reader Portal
  - Librarian Workspace
  - Administration
  - Management Analytics
- Do not create alternate brands from Stitch page titles or generated HTML.

## Canonical design tokens

| Token | Value | Use |
|---|---:|---|
| `--color-navigation` | `#0B2F2D` | Primary navigation surfaces |
| `--color-action-primary` | `#103C35` | Primary actions |
| `--color-secondary` | `#0C6668` | Links, secondary actions, focus accents |
| `--color-interactive-hover` | `#138A8A` | Hover states and progress |
| `--color-page-background` | `#F7F9F8` | App background |
| `--color-surface` | `#FFFFFF` | Cards, panels, dialogs |
| `--color-border` | `#D9E1DE` | Borders and dividers |
| `--color-text-primary` | `#151C27` | Main text |
| `--color-text-secondary` | `#414846` | Secondary text |
| `--color-error` | `#BA1A1A` | Errors and destructive states |

Add semantic success, warning, and information tokens with WCAG AA contrast during Phase 1.

## Typography and spacing

- Typeface: Be Vietnam Pro.
- Base spacing rhythm: 8px.
- Control radius: 8px.
- Large panel/dialog radius: 12px.
- Tags and checkboxes radius: 4px.
- Full pills only for statuses, avatars, and suitable segmented controls.
- One H1 per route; ordered H2/H3 hierarchy.

## Elevation and surface rules

- Static cards are border-only.
- Use one shared overlay shadow for dialogs, drawers, menus, and popovers.
- Avoid page-local arbitrary shadows, radii, spacing, and inline style attributes.

## Navigation taxonomy

### Reader Portal

- Home
- Catalogue
- Full-text Search
- Bookmarks
- Continue Reading
- Reading History
- Account

### Librarian Workspace

- Dashboard
- Documents
- Upload / New Intake
- Processing Queue
- Approval Queue
- Notifications

### Administration

- Categories
- Tags
- Users
- General Settings
- Security & Sessions

### Management Analytics

- Management Dashboard
- Reports
- Exports
- Drill-down Tables

## Shell decisions

- Reader Portal uses `ReaderShell` with content-first navigation and compact mobile drawer.
- Librarian Workspace and Administration use `AdminShell` with sidebar, top bar, breadcrumbs, user menu, and notification control.
- Management Analytics may reuse `AdminShell` unless permissions/navigation materially differ.
- Route groups should separate experiences without changing brand identity.

## Responsive rules

- Validate at approximately 375px, 768px, 1024px, and 1440px in implementation phases.
- Compact navigation states are responsive variants of shells, not separate routes.
- Tables require responsive overflow strategy without hidden clipped content.
- Drawer/modal content must fit narrow containers and restore focus.

## Component variant rules

- Buttons: primary, secondary, ghost, destructive, link; small, medium, large, icon.
- Inputs: label, description, required indicator, error, `aria-invalid`, `aria-describedby` owned by `FormField`.
- Status badges: text + icon or shape; never color-only.
- Dialogs: confirmation and destructive variants share anatomy, CTA order, focus trap, escape policy, and audit-language support.
- Tables: backend pagination/filter/sort by default; client-only filtering only for explicitly local small data.

## Status dictionary

| Domain | Canonical statuses |
|---|---|
| Book/document | draft, pending_processing, processing, pending_approval, published, rejected, correction_requested, archived when supported |
| Upload | idle, validating, uploading, accepted, validation_failed, failed, cancelled |
| Processing | queued, validating, compressing, performing_ocr, indexing, retrying, completed, failed, cancelled when supported |
| Approval/correction | pending_review, approved, approved_and_published, rejected, correction_requested, correction_in_progress, resubmitted |
| Report export | queued, running, completed, failed, expired, cancelled when supported |
| Category action | editable, delete_blocked, reassignment_required, deleting, deleted |
| Tag action | active, duplicate_candidate, merge_preview, merging, merged |
| User account | active, invited, suspended, deactivated |
| Notification | unread, read, action_required, action_completed, stale |

## Terminology decisions

- Use “Catalogue” for reader discovery routes to match Stitch folder naming, but API paths may remain `/catalog` where already implemented until a route/API migration is planned.
- Use “Document” in staff workflows and “Book” in reader-facing copy where the object is a published readable item.
- Treat “Reject” and “Request Correction” as distinct commands.
- Use “Approve and Publish” only when publication happens in the same command; otherwise use “Approve”.

## Intentional deviations from Stitch

- Generated Tailwind CDN imports and page-local styles are ignored for production architecture.
- Repeated generated markup becomes shared components before route composition.
- Material Symbol text cannot be the only accessible label.
- Placeholder links must become real routes, real external links, or buttons.
- Screens that are states, overlays, or responsive variants are not implemented as independent models.

## Unresolved product questions for later phases

1. Whether public catalogue metadata is fully anonymous or partially institution-authenticated.
2. Whether Management Analytics requires a distinct shell beyond permission-filtered admin navigation.
3. Whether report export files expire and what retention period applies.
4. Whether category deletion is always reassignment-first or can be blocked by policy.
5. Whether processing cancellation is supported in MVP.
