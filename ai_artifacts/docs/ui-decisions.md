# UI Decisions

Last updated: 2026-07-20

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

Semantic success, warning, information, error-surface, and muted-surface tokens are implemented in `apps/web/styles/tokens.css`.

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
- Librarian Workspace and Administration use one shared `AdminShell`: the desktop sidebar is the sole primary navigation, while the top bar is reserved for workspace context, role/identity, notifications, and session utilities.
- On narrow screens, `AdminShell` replaces the desktop sidebar with a closed-by-default drawer driven by the same permission-aware navigation model; it does not restore a duplicate horizontal header menu.
- Navigation visibility follows real route permissions. Categories and Tags remain visible to Librarians because those routes intentionally provide read-only access; Admin-only mutation controls remain enforced inside the feature routes and APIs.
- Do not add placeholder destinations. Users, settings, security, analytics, and other future entries appear only when their routes and permissions are implemented.
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

---

## Phase 1 implementation update — 2026-07-20

- Canonical artifact root is `ai_artifacts/`; implementation references were updated to use `ai_artifacts/prompts/Agent_Prompt.md`, `ai_artifacts/docs/`, and `ai_artifacts/stitch_design/`.
- Token implementation files:
  - `apps/web/styles/tokens.css`
  - `apps/web/styles/base.css`
  - `apps/web/styles/components.css`
  - `apps/web/app/globals.css`
- Compiled Tailwind integration uses local PostCSS via `apps/web/postcss.config.mjs` and imports `tailwindcss` in `apps/web/app/globals.css`. This follows Tailwind's current Next.js/PostCSS guidance; no Tailwind CDN is used.
- Additional WCAG-conscious semantic tokens added:
  - `--color-success: #146C2E`
  - `--color-warning: #8A4B00`
  - `--color-info: #2457A6`
  - matching success/warning/info/error/muted surface tokens.
- Component catalogue decision: Storybook was not added in Phase 1 to avoid dependency/tooling sprawl. A non-production component catalogue was added at `apps/web/components/catalogue/ComponentCatalogue.tsx` to demonstrate required component states without creating a public route.
- Dialog/Drawer decision: Phase 1 foundations include unique labels, Escape close, focus entry, tab containment, body scroll lock, and focus restore. Full animation and route-specific command wiring remain later-phase work.

### Phase 1 acceptance fix update — 2026-07-20

- **Typography loading:** Be Vietnam Pro is now loaded through `next/font/google` in `apps/web/app/layout.tsx`; `apps/web/styles/tokens.css` maps `--font-sans` to `--font-be-vietnam-pro` with system fallbacks.
- **Status coverage:** `apps/web/components/ui/status/status-config.ts` covers the canonical dictionary from this document, including archived, upload idle/cancelled, processing compression/OCR/indexing, approval/correction, report export, category/tag actions, and stale notifications.
- **Overlay behavior:** `Dialog`, `ConfirmationDialog`, `DestructiveDialog`, and `Drawer` now share modal foundations with unique labels, Escape close, focus entry, tab containment, body scroll lock, and restore-focus cleanup. Full animation and route-level command wiring remain later-phase work.
- **Data tables:** `DataTable` exposes caller-controlled server-state props for page, page size, sort key/direction, filters, total row count, loading, and `onStateChange`; `Pagination` supports controlled `onPageChange`.
- **Catalogue coverage:** `ComponentCatalogue` is client-only and remains non-routed. It now demonstrates long content, narrow-container layout, controlled server-table state, canonical status variants, focus-visible states, and overlay triggers.
- **Test coverage:** Vitest covers canonical status entries, controlled table sorting/pagination, Dialog Escape + focus restore, Drawer modal close behavior, and catalogue responsive/overlay smoke checks. Jest-axe still runs against the catalogue.

## Phase 2 implementation update — 2026-07-20

- Route-group shells are implemented in `apps/web/app/(reader)`, `apps/web/app/(admin)`, and `apps/web/app/(auth)`.
- `apps/web/app/layout.tsx` no longer owns global navigation; `ReaderShell`, `AdminShell`, and `AuthShell` own workspace navigation and landmarks.
- `/catalogue` is the canonical reader catalogue route; `/catalog` remains as a compatibility redirect.
- Access-boundary routes `/access-denied` and `/session-expired` exist as Phase 2 shell/boundary states only; production sign-in and reset flows remain later Batch 1 work.
- Admin endpoints now require the backend development-header auth boundary outside production; frontend API helpers send controlled dev headers only when `NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH=true`, and production/default development behavior remains fail-closed until real credentials are implemented.
