# API Contracts

Last updated: 2026-07-22

OpenAPI is now generated for implemented endpoints at `apps/api/openapi/libif-api.json`, with frontend path types generated to `apps/web/lib/generated/api-types.ts`. This document records implemented endpoints plus target contract shapes needed by later Stitch screen batches.

## Current implemented endpoints

| Endpoint | Owner today | Consumer today | Notes |
|---|---|---|---|
| `POST /api/auth/register` | `AuthModule` | `apps/web/app/(auth)/register/page.tsx` | Creates reader account, hashes password, starts persisted session, and sets `libif_session`. |
| `POST /api/auth/sign-in` | `AuthModule` | `apps/web/app/(auth)/sign-in/page.tsx` | Validates email/password, starts persisted session, and sets `libif_session`. |
| `POST /api/auth/sign-out` | `AuthModule` | `apps/web/components/auth/SignOutButton.tsx` | Revokes current session and clears `libif_session`; idempotent for missing sessions. |
| `GET /api/auth/session` | `AuthModule` | `apps/web/lib/api-server.ts` and admin layout gating | Resolves database-backed session from `libif_session`; dev-header fallback requires explicit non-production opt-in. |
| `POST /api/auth/password-reset-requests` | `AuthModule` | `apps/web/app/(auth)/forgot-password/page.tsx` | Uniform public response; creates a hashed, expiring reset token for existing accounts and sends through the reset delivery port. |
| `POST /api/auth/password-resets` | `AuthModule` | `apps/web/app/(auth)/reset-password/page.tsx` | Consumes a valid reset token once, updates password hash, and revokes existing sessions. |
| `POST /api/admin/books/intake` | `BooksModule` | `apps/web/components/book-intake/BookIntakeForm.tsx` | Multipart `file` + JSON `metadata`; returns book/file/processingJob; guarded for Admin/Librarian. |
| `GET /api/admin/books` | `BooksModule` | `apps/web/app/(admin)/admin/books/page.tsx` | Admin list without production pagination/filter/sort yet; guarded for Admin/Librarian. |
| `GET /api/categories` | `CatalogModule` | Public catalogue compatibility consumers | Legacy public category list; staff metadata uses `TaxonomyModule`. |
| `GET /api/taxonomy/categories` | `TaxonomyModule` | Intake metadata and `/admin/categories` | Generated stable category options (`id`, `name`, `slug`, `parentId`); guarded for Admin/Librarian. |
| `POST /api/admin/categories` | `TaxonomyModule` | `/admin/categories` | Admin-only starter category creation with normalized name/slug and validated parent. |
| `PATCH /api/admin/categories/:id` | `TaxonomyModule` | `/admin/categories` | Admin-only starter category edit; rejects missing parents and parent cycles. |
| `GET /api/taxonomy/tags` | `TaxonomyModule` | Intake metadata and `/admin/tags` | Generated stable tag options (`id`, `name`, `slug`); guarded for Admin/Librarian. |
| `POST /api/admin/tags` | `TaxonomyModule` | `/admin/tags` | Admin-only starter tag creation with normalized name/slug. |
| `PATCH /api/admin/tags/:id` | `TaxonomyModule` | `/admin/tags` | Admin-only starter tag edit. |
| `GET /api/catalog/books` | `CatalogModule` | `apps/web/app/(reader)/catalogue/page.tsx` | Public published books only. |
| `GET /api/isbn/:isbn` | `IsbnModule` | `apps/web/components/book-intake/MetadataFields.tsx` | ISBN lookup proxy. |
| `GET /api/admin/dashboard/librarian` | `ReportingModule` | `apps/web/app/(admin)/admin/dashboard/page.tsx` | Phase 4 Member D dashboard summary; guarded for Admin/Librarian; returns no-migration counts for books, processing jobs, taxonomy, users, and recent books. |
| `GET /api/documents` | `DocumentsModule` | `/admin/documents` | Guarded staff document list with query/filter/page foundations. |
| `GET /api/documents/:id` | `DocumentsModule` | `/admin/documents/[id]` and edit route | Guarded document metadata, category/tags, file, job, and audit summary. |
| `PATCH /api/documents/:id/metadata` | `DocumentsModule` | `/admin/documents/[id]/edit` | Updates metadata using Member D category/tag options and records an audit event. |
| `POST /api/documents/:id/submit-processing` | `DocumentsModule` | document detail actions through `api-browser.ts` | Authenticated requeue handoff; supersedes earlier queued/running work, removes stale pending approval, creates one new job, and records the transition. Real OCR execution remains Phase 6. |
| `POST /api/documents/:id/replace-file` | `DocumentsModule` | document lifecycle panel through `api-browser.ts` | Authenticated multipart replacement; creates a new active file version and supersedes stale operational work. |
| `POST /api/uploads` | `UploadModule` | `/admin/documents/new` through `api-browser.ts` | Canonical authenticated Phase 5 multipart intake; browser requests target the Nest API origin rather than a relative Next.js route. |
| `GET /api/uploads/:id` | `UploadModule` | upload lifecycle UI | Returns persisted upload/file/job state. |
| `POST /api/uploads/:id/cancel` | `UploadModule` | upload lifecycle UI | Cancels eligible intake processing. |
| `POST /api/uploads/:id/retry` | `UploadModule` | upload lifecycle UI | Requeues an eligible failed intake. |
| `GET /api/admin/processing/jobs` | `ProcessingModule` | `/admin/processing` | Guarded current-work projection returning the latest processing job per document; deeper history remains a Phase 6 contract. |
| `GET /api/admin/processing/jobs/:id` and `/status` | `ProcessingModule` | `/admin/processing/[id]` | Job detail and polling-safe status projection. |
| `POST /api/admin/processing/jobs/:id/advance` | `ProcessingModule` | staff transition actions | Validated Phase 5 pipeline transition hook. |
| `POST /api/admin/processing/jobs/:id/retry` and `/cancel` | `ProcessingModule` | processing actions | Guarded retry/cancel foundations; retry history and real worker depth remain Phase 6. |
| `GET /api/admin/approvals` and `/:id` | `ApprovalModule` | `/admin/approvals` | Current pending queue/detail foundation; default queue requires document `PENDING_APPROVAL` and returns one latest pending review per document. Decision/correction commands remain Phase 6. |
| `GET /api/notifications` | `NotificationsModule` | `/admin/notifications` | Role-scoped API/UI foundation; runtime storage is still process-local and must migrate to Prisma in Phase 6. |
| `PATCH /api/notifications/:id/read` and `/read-all` | `NotificationsModule` | notification list actions | Updates process-local read state today; recipient ownership plus persistence are Phase 6 requirements. |
| `GET /api/access/documents/:documentId/decision` | `AccessModule` | reader detail/viewer routes | Reader-safe lifecycle/access decision. |
| `POST /api/access/documents/:documentId/view-token` and `/download-token` | `AccessModule` | protected reader controls | Short-lived authorized storage handoff. |
| `GET /api/reader/library`, `/history`, and `/bookmarks` | `ReaderModule` | reader personal-library routes | Persisted reader collections. |
| `POST/DELETE /api/reader/bookmarks[/:documentId]` and `PATCH /api/reader/progress/:documentId` | `ReaderModule` | reader actions/viewer | Persists bookmark and reading-progress state. |

## Standard error envelope

```json
{
  "code": "STABLE_ERROR_CODE",
  "message": "Safe user-facing message",
  "fieldErrors": { "field": ["error"] },
  "traceId": "request-or-domain-reference",
  "status": 400
}
```

## Standard paginated collection

```json
{
  "items": [],
  "page": { "number": 1, "size": 25, "totalItems": 0, "totalPages": 0 },
  "filters": {},
  "sort": { "field": "createdAt", "direction": "desc" }
}
```

Cursor pagination may replace page metadata for event streams or notifications when justified, but the client shape must stay typed and documented.

## Standard asynchronous accepted response

```json
{
  "resourceId": "document-id",
  "jobId": "job-id",
  "status": "queued",
  "statusEndpoint": "/api/admin/processing/jobs/job-id/status"
}
```

Use this shape for upload-triggered processing and long-running report exports. Do not hold HTTP requests open for OCR/export completion.

## Contract needs by batch

### Batch 1 — Authentication and access

Implemented in Phase 3. Current contracts are generated in OpenAPI for:

- `POST /api/auth/register`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`
- `POST /api/auth/password-reset-requests`
- `POST /api/auth/password-resets`

Deferred auth-adjacent contracts remain in Batch 6/7: user administration, role changes, account deactivation, MFA/OAuth, production email-provider configuration, and security settings.

### Batch 2 — Reader discovery and personal library

- `GET /api/catalog/books?q&page&filters&sort&view`
- `GET /api/catalog/search?q&scope&page&filters&sort`
- `POST /api/reader/books/{bookId}/access-grants`
- `GET/PATCH /api/reader/books/{bookId}/progress`
- `GET /api/reader/bookmarks`, `POST /api/reader/bookmarks`, `DELETE /api/reader/bookmarks/{id}`
- `GET /api/reader/continue-reading`
- `GET /api/reader/history`

### Batch 3 — Documents, upload, ISBN, and metadata

- `GET /api/taxonomy/categories` — Phase 5 D5-001 implemented staff category options for metadata forms.
- `GET /api/taxonomy/tags` — Phase 5 D5-001 implemented staff tag options for metadata forms.
- `GET /api/documents?page&filters&sort` — Phase 5 implemented.
- `GET /api/documents/{documentId}` — Phase 5 implemented.
- `GET /api/admin/documents/{documentId}/audit`
- `POST /api/uploads` — Phase 5 implemented canonical multipart intake.
- `POST /api/documents/{documentId}/replace-file` — Phase 5 implemented replacement foundation.
- `GET /api/isbn/{isbn}` or `POST /api/admin/isbn/lookups`
- `PATCH /api/documents/{documentId}/metadata` — Phase 5 implemented.
- `POST /api/documents/{documentId}/submit-processing` — Phase 5 implemented processing handoff; review submission remains Phase 6.

### Batch 4 — Processing queue and jobs

Phase 5 implements current queue/detail/status and guarded manual transition/retry/cancel foundations. Phase 6 replaces simulated advancement with a real worker and file-scoped retry history.

- `GET /api/admin/processing/jobs?page&filters&sort`
- `GET /api/admin/processing/jobs/{jobId}`
- `GET /api/admin/processing/jobs/{jobId}/status`
- `GET /api/admin/processing/jobs/{jobId}/retry-history`
- `POST /api/admin/processing/jobs/{jobId}/retry`
- Stable job status schema maps infrastructure to `queued`, `validating`, `compressing`, `performing_ocr`, `indexing`, `retrying`, `completed`, `failed`, `cancelled`.

### Batch 5 — Approval, correction, and notifications

Phase 5 implements current approval queue/detail plus notification API/UI shells. Notification persistence, decision commands, correction/resubmission, and fanout are Phase 6 work.

- `GET /api/admin/approvals?page&filters&sort`
- `GET /api/admin/approvals/{documentId}`
- `POST /api/admin/approvals/{documentId}/approve`
- `POST /api/admin/approvals/{documentId}/approve-and-publish`
- `POST /api/admin/approvals/{documentId}/reject`
- `POST /api/admin/approvals/{documentId}/request-correction`
- `GET /api/admin/documents/{documentId}/corrections`
- `POST /api/admin/documents/{documentId}/resubmit`
- `GET /api/admin/notifications?page&filters`
- `GET /api/admin/notifications/{notificationId}`
- `PATCH /api/admin/notifications/{notificationId}/read`

### Batch 6 — Taxonomy, tags, users, and risky actions

- `GET /api/taxonomy/categories` — implemented staff selector/management read.
- `POST /api/admin/categories` — implemented starter Admin-only create.
- `PATCH /api/admin/categories/{id}` — implemented starter Admin-only edit.
- `DELETE /api/admin/categories/{id}`
- `POST /api/admin/categories/{id}/reassign-and-delete`
- `GET /api/taxonomy/tags` — implemented staff selector/management read.
- `POST /api/admin/tags` — implemented starter Admin-only create.
- `PATCH /api/admin/tags/{id}` — implemented starter Admin-only edit.
- `GET /api/admin/tags/duplicates`
- `POST /api/admin/tags/merge-preview`
- `POST /api/admin/tags/merge`
- `GET /api/admin/users?page&filters&sort`
- `GET /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/role`
- `POST /api/admin/users/{userId}/deactivate`

### Batch 7 — Dashboards, reports, export, and settings

- `GET /api/admin/dashboard/librarian?dateRange` — Phase 4 Member D implements the base no-date-range summary response; date filtering remains deferred.
- `GET /api/admin/dashboard/management?dateRange`
- `GET /api/admin/reports/{reportId}/rows?page&filters&sort`
- `POST /api/admin/report-exports`
- `GET /api/admin/report-exports/{jobId}`
- `GET /api/admin/report-exports/{jobId}/status`
- `POST /api/admin/report-exports/{jobId}/retry`
- `GET/PATCH /api/admin/settings/general`
- `GET/PATCH /api/admin/settings/security`

## DTO families to generate/validate through OpenAPI

- Auth/session/user/permission DTOs.
- Document/book metadata DTOs with authors, categories, tags, file version summaries, and audit summaries.
- Catalogue search query/result DTOs with backend pagination, filters, sorting, and applied filter echo.
- Reader access grant DTO with expiry and no storage credentials.
- Processing job DTO with stage progress and safe failure details.
- Approval/correction command DTOs with required reason fields.
- Notification DTOs referencing domain entities and actions.
- Taxonomy/tag/user risky-action preview/result DTOs.
- Report/dashboard/export DTOs.

## OpenAPI implementation status

Phase 2 added NestJS Swagger setup, stable operation IDs, generated JSON at `apps/api/openapi/libif-api.json`, a dependency-free frontend path-map generator at `apps/web/scripts/generate-api-types.mjs`, OpenAPI-owned response aliases at `apps/web/lib/api-types.ts`, and split `openapi-fetch` transport adapters. Phase 3 added generated auth contracts, and Phase 4 added the dashboard summary. The Phase 5 Member D integration pass now regenerates one unified contract containing reader/access, document/upload, processing, approval, notification, and taxonomy endpoints from all four member lanes. Later phases must keep OpenAPI decorators and generated path types aligned whenever endpoints change.
