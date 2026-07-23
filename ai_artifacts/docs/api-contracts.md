# API Contracts

Last updated: 2026-07-23

This document records the current runtime HTTP contract from the merged Phase 6 code. Member D regenerated `apps/api/openapi/libif-api.json` and `apps/web/lib/generated/api-types.ts` from the frozen Phase 6 DTOs on 2026-07-23; controller/service code remains authoritative if later feature changes introduce drift.

## Runtime implemented endpoints

| Endpoint | Owner | Primary consumer | Current contract notes |
|---|---|---|---|
| `POST /api/auth/register` | `AuthModule` | Auth register page | Creates a reader account, starts a persisted session, and sets `libif_session`. |
| `POST /api/auth/sign-in` | `AuthModule` | Auth sign-in page | Validates credentials, starts a persisted session, and sets `libif_session`. |
| `POST /api/auth/sign-out` | `AuthModule` | Sign-out button | Revokes the current session and clears `libif_session`. |
| `GET /api/auth/session` | `AuthModule` | Shell/session loaders | Returns `SessionDto` with authenticated state, user, permissions, and strategy. |
| `POST /api/auth/password-reset-requests` | `AuthModule` | Forgot-password page | Always returns a safe public response; creates a hashed expiring token only for existing users. |
| `POST /api/auth/password-resets` | `AuthModule` | Reset-password page | Consumes a valid token once, updates the password hash, and revokes existing sessions. |
| `POST /api/uploads` | `UploadModule` | `/admin/documents/new` | Multipart `file` + stringified `metadata`; creates the document, first file version, and first queued processing job. |
| `GET /api/uploads/:id` | `UploadModule` | Upload lifecycle UI | Returns `UploadResultDto` with current book/file/job snapshot. |
| `POST /api/uploads/:id/cancel` | `UploadModule` | Upload lifecycle UI | Cancels queued intake work and returns `{ success, message }`. |
| `POST /api/uploads/:id/retry` | `UploadModule` | Upload lifecycle UI | Creates a new queued job for the latest upload file and returns `UploadResultDto`. |
| `GET /api/documents` | `DocumentsModule` | Staff document index | Returns `PagedDocumentListResponseDto` with `items`, `totalCount`, `page`, `pageSize`, and `totalPages`. |
| `GET /api/documents/:id` | `DocumentsModule` | Staff detail and edit views | Returns document metadata, all file versions, processing history, approval history, and audit history. |
| `PATCH /api/documents/:id/metadata` | `DocumentsModule` | Staff edit route | Updates document metadata, authors, and tags, then returns the refreshed detail DTO. |
| `POST /api/documents/:id/submit-processing` | `DocumentsModule` | Staff detail/edit actions | Supersedes queued/running jobs and pending reviews, requeues the active file, and returns refreshed detail data. |
| `POST /api/documents/:id/replace-file` | `DocumentsModule` | Staff detail/edit actions | Multipart replacement of the active PDF; creates a new active file version and queued job, then returns refreshed detail data. |
| `GET /api/admin/processing/jobs` | `ProcessingModule` | `/admin/processing` | Returns one latest job per book as a latest-job summary projection; not paginated today. |
| `GET /api/admin/processing/jobs/:id` | `ProcessingModule` | `/admin/processing/[id]` | Returns `ProcessingJobResponseDto` for one job. |
| `GET /api/admin/processing/jobs/:id/status` | `ProcessingModule` | Polling/detail UI | Returns only the current job status string. |
| `GET /api/admin/processing/jobs/:id/history` | `ProcessingModule` | Processing detail/history UI | Returns `{ current, history }`, where `history` is the full book-level job lineage ordered newest-first. |
| `POST /api/admin/processing/jobs/:id/retry` | `ProcessingModule` | Processing actions | Retries only `FAILED` jobs by creating a new queued descendant job with `retryOfJobId`. |
| `POST /api/admin/processing/jobs/:id/cancel` | `ProcessingModule` | Processing actions | Cancels non-terminal jobs and returns the refreshed job DTO. |
| `GET /api/admin/approvals` | `ApprovalModule` | `/admin/approvals` | Default queue returns current pending reviews; optional `status` query can fetch non-pending historical states. |
| `GET /api/admin/approvals/:id` | `ApprovalModule` | `/admin/approvals/[id]` | `:id` is an approval review ID, not a document ID. |
| `POST /api/admin/approvals/:id/approve` | `ApprovalModule` | Approval decision UI | Accepts optional `{ comment }`; currently marks the review `APPROVED` and the document `PUBLISHED`. |
| `POST /api/admin/approvals/:id/approve-and-publish` | `ApprovalModule` | Approval decision UI | Accepts optional `{ comment }`; currently also marks the review `APPROVED` and the document `PUBLISHED`. |
| `POST /api/admin/approvals/:id/reject` | `ApprovalModule` | Approval decision UI | Requires `{ reason }`; marks the review `REJECTED` and the document `REJECTED`. |
| `POST /api/admin/approvals/:id/request-correction` | `ApprovalModule` | Approval decision UI | Requires `{ reason, requestedChanges }`; marks the review `CORRECTION_REQUESTED` and the document `CORRECTION_REQUIRED`. |
| `GET /api/notifications` | `NotificationsModule` | Staff and reader notification pages | Returns recipient-scoped notification records newest-first. |
| `GET /api/notifications/unread-count` | `NotificationsModule` | Staff-shell/read-model consumers | Returns `{ "count": number }` for the current user. |
| `PATCH /api/notifications/:id/read` | `NotificationsModule` | Notification list actions | Marks one notification as read; enforces recipient ownership. |
| `PATCH /api/notifications/read-all` | `NotificationsModule` | Notification list actions | Marks all unread notifications for the current user as read. |
| `GET /api/access/documents/:documentId/decision` | `AccessModule` | Reader and staff document routes | Returns allow/deny plus current document status and safe reason text. |
| `POST /api/access/documents/:documentId/view-token` | `AccessModule` | Reader/staff viewer actions | Returns `{ token, expiresAt, url }` for inline viewing. |
| `POST /api/access/documents/:documentId/download-token` | `AccessModule` | Reader/staff download actions | Returns `{ token, expiresAt, url }` for attachment download. |
| `GET /api/access/documents/:documentId/stream?token=...` | `AccessModule` | Reader/staff viewer | Streams the active PDF inline after token validation. |
| `GET /api/access/documents/:documentId/file?token=...` | `AccessModule` | Reader/staff download | Streams the active PDF as an attachment after token validation. |
| `GET /api/reader/library` | `ReaderModule` | Reader library route | Returns `ReaderLibraryResponseDto` with filtered items plus reading/bookmark counts. |
| `GET /api/reader/history` | `ReaderModule` | Reader history route | Returns published books with persisted last-read ordering. |
| `GET /api/reader/bookmarks` | `ReaderModule` | Reader bookmarks route | Returns published bookmarked books. |
| `POST /api/reader/bookmarks` | `ReaderModule` | Reader bookmark actions | Accepts `{ documentId }`; idempotent save. |
| `DELETE /api/reader/bookmarks/:documentId` | `ReaderModule` | Reader bookmark actions | Idempotent removal by document ID. |
| `PATCH /api/reader/progress/:documentId` | `ReaderModule` | Reader viewer actions | Upserts reading progress and auto-maps completion at 100%. |
| `GET /api/catalog/books` | `CatalogModule` | Public catalogue routes | Returns published books only. |
| `GET /api/categories` | `CatalogModule` | Legacy catalogue compatibility | Public category list compatibility surface. |
| `GET /api/taxonomy/categories` | `TaxonomyModule` | Staff document forms and category manager | Staff selector list of `{ id, name, slug, parentId }`. |
| `POST /api/admin/categories` | `TaxonomyModule` | Category manager | Admin-only category creation. |
| `PATCH /api/admin/categories/:id` | `TaxonomyModule` | Category manager | Admin-only category update with cycle prevention. |
| `GET /api/taxonomy/tags` | `TaxonomyModule` | Staff document forms and tag manager | Staff selector list of `{ id, name, slug }`. |
| `POST /api/admin/tags` | `TaxonomyModule` | Tag manager | Admin-only tag creation. |
| `PATCH /api/admin/tags/:id` | `TaxonomyModule` | Tag manager | Admin-only tag update. |
| `GET /api/admin/dashboard/librarian` | `ReportingModule` | Admin dashboard | Returns generated timestamp, book counts, processing-job counts, taxonomy counts, user counts, recent books, grouped workflow activity counts, and a bounded newest-first activity feed. |
| `POST /api/admin/books/intake` | `BooksModule` | Legacy compatibility UI | Legacy intake surface kept for compatibility; primary staff flow uses `/api/uploads`. |
| `GET /api/admin/books` | `BooksModule` | Legacy compatibility UI | Legacy list surface kept for compatibility. |
| `GET /api/isbn/:isbn` | `IsbnModule` | Metadata form | ISBN lookup proxy. |
| `GET /api/health` | `HealthModule` | Infra/ops | Health response. |

## Shared runtime response shapes

### Error envelope

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Safe user-facing message",
  "fieldErrors": { "field": ["error"] },
  "traceId": "request-or-domain-reference",
  "status": 400
}
```

Source of truth: `apps/api/src/common/http-error.filter.ts`.

### Upload result shape

```json
{
  "book": { "id": "book-id", "title": "Document title", "status": "PENDING_PROCESSING" },
  "file": { "id": "file-id", "originalFilename": "file.pdf", "sizeBytes": "12345" },
  "processingJob": { "id": "job-id", "status": "QUEUED" }
}
```

### Document list shape

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### Processing history shape

```json
{
  "current": { "id": "job-id", "status": "RUNNING" },
  "history": [{ "id": "job-id", "status": "RUNNING" }]
}
```

### Notification unread-count shape

```json
{
  "count": 3
}
```

### Protected access token shape

```json
{
  "token": "view_document-id_timestamp",
  "expiresAt": "2026-07-23T10:00:00.000Z",
  "url": "/api/access/documents/document-id/stream?token=view_document-id_timestamp"
}
```

## Workflow-specific contract notes

### Processing contracts

- Job status is enum-backed: `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `SUPERSEDED`.
- Stage is a free string currently emitted as `queued`, `validating`, `performing_ocr`, `indexing`, `completed`, `failed`, `cancelled`, or `superseded`.
- Retry lineage is explicit through `attemptNumber` and `retryOfJobId`.
- Current list output is the latest job per book; full history requires `GET /api/admin/processing/jobs/:id/history`.

### Approval contracts

- Approval resources are keyed by review ID.
- Review DTOs include `bookFileId`, `processingJobId`, `round`, `status`, `reason`, `requestedChanges`, `decidedAt`, and `supersededAt`.
- Correction requests currently reuse existing document edit, replace-file, and submit-processing commands rather than a dedicated correction endpoint family.

### Notification contracts

- Notification DTOs are recipient-scoped and currently expose `id`, `recipientId`, `type`, `title`, `body`, `payload`, `actionHref`, `isRead`, `readAt`, and `createdAt`.
- Runtime read state is backed by Prisma `Notification.status`; clients consume boolean `isRead` in the DTO.

### Reader access contracts

- Reader access decisions can deny on `CORRECTION_REQUIRED`; the generated access-decision enum includes that state.
- View/download token routes return application URLs, not storage-provider credentials.
- Stream and file delivery always resolve the active file version for the document at request time.
- The current Reader viewer still receives the source PDF through the application stream and exposes the download-token route. This is a documented Phase 7 P0 gap, not the target content-protection design.
- Frozen Phase 7 code contracts cover `GET /api/catalog/books/:documentId`, `GET /api/reader/documents/:documentId/state`, `GET /api/access/documents/:documentId/manifest`, and `GET /api/access/documents/:documentId/pages/:pageNumber`. The DTO/port shapes exist, but these routes remain non-live until their owning controllers and tests land.
- The planned Reader page route returns an authorized, bounded, individually server-watermarked raster image with private/no-store caching and never returns object keys, source-PDF bytes/URLs, or extracted OCR text. The web viewer draws it on canvas without a selectable text layer.
- Every successful/denied page attempt produces a bounded `ReaderAccessEvent`; Redis-backed rate/concurrency/scrape enforcement returns stable `429` + `Retry-After` where applicable and emits committed risk facts for deduplicated staff alerts.
- Planned Admin-only security projections are `GET /api/admin/reports/reader-access?from&to&risk` and the bounded `.csv` equivalent.
- Reader access to source-file download is removed or denied by explicit role policy. Any retained staff download is a separate staff-authorized contract.
- Live Admin user routes are `GET /api/admin/users` and `GET /api/admin/users/:userId`; these expose only safe account, session, and administration-audit projections.
- Wave 3 intentionally does not refresh `apps/api/openapi/libif-api.json` or `apps/web/lib/generated/api-types.ts`. These runtime-live routes are unavailable to generated-client consumers until D7-005 performs the single cross-lane contract refresh.

## Deferred or absent endpoint families

These routes are not implemented in the current runtime code and must not be treated as live contracts:

- Dedicated correction history/resubmission endpoints such as `/api/admin/documents/{documentId}/corrections` or `/resubmit`.
- Category deletion/reassignment endpoints.
- Tag duplicate-detection or merge endpoints.
- User role-change and account-deactivation endpoints.
- Management dashboard, report-export, and general-settings endpoints. The product-settings persistence service is implemented, but the route remains gated on Member A's tested deployment-capability handoff.
- Published catalogue detail, one-document reader state, and protected manifest/raster-page endpoints.

The approved contract sources are `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md` and `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`. Frozen TypeScript/Prisma shapes are not live endpoint evidence; controllers, tests, and regenerated OpenAPI remain required.
