# API Contracts

Last updated: 2026-07-20

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
| `GET /api/categories` | `CatalogModule` | `apps/web/app/(admin)/admin/books/new/page.tsx` | Category list. |
| `GET /api/catalog/books` | `CatalogModule` | `apps/web/app/(reader)/catalogue/page.tsx` | Public published books only. |
| `GET /api/isbn/:isbn` | `IsbnModule` | `apps/web/components/book-intake/MetadataFields.tsx` | ISBN lookup proxy. |

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

- `GET /api/admin/documents?page&filters&sort`
- `GET /api/admin/documents/{documentId}`
- `GET /api/admin/documents/{documentId}/audit`
- `POST /api/admin/uploads/pdf`
- `POST /api/admin/documents/{documentId}/files/replacements`
- `GET /api/isbn/{isbn}` or `POST /api/admin/isbn/lookups`
- `PATCH /api/admin/documents/{documentId}/metadata`
- `POST /api/admin/documents/{documentId}/submit-review`

### Batch 4 — Processing queue and jobs

- `GET /api/admin/processing/jobs?page&filters&sort`
- `GET /api/admin/processing/jobs/{jobId}`
- `GET /api/admin/processing/jobs/{jobId}/status`
- `GET /api/admin/processing/jobs/{jobId}/retry-history`
- `POST /api/admin/processing/jobs/{jobId}/retry`
- Stable job status schema maps infrastructure to `queued`, `validating`, `compressing`, `performing_ocr`, `indexing`, `retrying`, `completed`, `failed`, `cancelled`.

### Batch 5 — Approval, correction, and notifications

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

- `GET /api/admin/categories/tree`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `POST /api/admin/categories/{id}/reassign-and-delete`
- `GET /api/admin/tags?page&filters&sort`
- `GET /api/admin/tags/duplicates`
- `POST /api/admin/tags/merge-preview`
- `POST /api/admin/tags/merge`
- `GET /api/admin/users?page&filters&sort`
- `GET /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/role`
- `POST /api/admin/users/{userId}/deactivate`

### Batch 7 — Dashboards, reports, export, and settings

- `GET /api/admin/dashboard/librarian?dateRange`
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

Phase 2 added NestJS Swagger setup, stable operation IDs, generated JSON at `apps/api/openapi/libif-api.json`, a dependency-free frontend path-map generator at `apps/web/scripts/generate-api-types.mjs`, OpenAPI-owned response aliases at `apps/web/lib/api-types.ts`, and split `openapi-fetch` transport adapters in `apps/web/lib/api-server.ts` and `apps/web/lib/api-browser.ts`. Phase 3 added generated auth request/response DTOs and cookie-aware frontend calls. Later phases must keep OpenAPI decorators and generated path types aligned whenever endpoints change.
