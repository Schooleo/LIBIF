# API Contracts

Last updated: 2026-07-23

This document records the current runtime HTTP contract through Phase 7 Wave 4. The tracked `apps/api/openapi/libif-api.json` and `apps/web/lib/generated/api-types.ts` intentionally remain at the Wave 2 freeze until D7-005 performs one unified refresh; controller/service code and tests are authoritative for later live routes.

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
| `GET /api/access/documents/:documentId/manifest` | `AccessModule` | Protected Reader canvas | Returns safe page count/dimensions after authorization and records the viewer-open event. |
| `GET /api/access/documents/:documentId/pages/:pageNumber` | `AccessModule` | Protected Reader canvas | Returns one authorized server-watermarked raster page with private/no-store headers, bounded enforcement, and trace audit. |
| `POST /api/access/documents/:documentId/view-token` | `AccessModule` | Staff internal viewer | Staff-only; returns a short-lived HMAC-bound `{ token, expiresAt, url }` for inline source-file viewing. |
| `POST /api/access/documents/:documentId/download-token` | `AccessModule` | Staff internal download | Staff-only; returns a short-lived HMAC-bound `{ token, expiresAt, url }` for source-file download. |
| `GET /api/access/documents/:documentId/stream?token=...` | `AccessModule` | Staff internal viewer | Staff-only source PDF stream after role, document, purpose, expiry, and signature validation. |
| `GET /api/access/documents/:documentId/file?token=...` | `AccessModule` | Staff internal download | Staff-only source PDF attachment after role, document, purpose, expiry, and signature validation. |
| `GET /api/reader/library` | `ReaderModule` | Reader library route | Returns `ReaderLibraryResponseDto` with filtered items plus reading/bookmark counts. |
| `GET /api/reader/history` | `ReaderModule` | Reader history route | Returns published books with persisted last-read ordering. |
| `GET /api/reader/bookmarks` | `ReaderModule` | Reader bookmarks route | Returns published bookmarked books. |
| `GET /api/reader/documents/:documentId/state` | `ReaderModule` | Catalogue detail and protected viewer | Returns published-only bookmark and progress state for one document. |
| `POST /api/reader/bookmarks` | `ReaderModule` | Reader bookmark actions | Accepts `{ documentId }`; idempotent save. |
| `DELETE /api/reader/bookmarks/:documentId` | `ReaderModule` | Reader bookmark actions | Idempotent removal by document ID. |
| `PATCH /api/reader/progress/:documentId` | `ReaderModule` | Reader viewer actions | Upserts reading progress and auto-maps completion at 100%. |
| `GET /api/catalog/books` | `CatalogModule` | Public catalogue routes | Returns published books only. |
| `GET /api/catalog/books/:documentId` | `CatalogModule` | Public catalogue detail | Returns one published-only public detail projection without scanning a list page. |
| `GET /api/categories` | `CatalogModule` | Legacy catalogue compatibility | Public category list compatibility surface. |
| `GET /api/taxonomy/categories` | `TaxonomyModule` | Staff document forms and category manager | Staff selector list of `{ id, name, slug, parentId }`. |
| `POST /api/admin/categories` | `TaxonomyModule` | Category manager | Admin-only category creation. |
| `PATCH /api/admin/categories/:id` | `TaxonomyModule` | Category manager | Admin-only category update with cycle prevention. |
| `GET /api/taxonomy/tags` | `TaxonomyModule` | Staff document forms and tag manager | Staff selector list of `{ id, name, slug }`. |
| `POST /api/admin/tags` | `TaxonomyModule` | Tag manager | Admin-only tag creation. |
| `PATCH /api/admin/tags/:id` | `TaxonomyModule` | Tag manager | Admin-only tag update. |
| `GET /api/admin/dashboard/librarian` | `ReportingModule` | Admin dashboard | Returns generated timestamp, book counts, processing-job counts, taxonomy counts, user counts, recent books, grouped workflow activity counts, and a bounded newest-first activity feed. |
| `GET /api/admin/reports/reader-access` | `ReportingModule` | Admin security reporting | Returns bounded UTC/risk-filtered audit summaries with opaque event/document aliases, a masked reader label, and no raw internal identifiers. |
| `GET /api/admin/reports/reader-access.csv` | `ReportingModule` | Admin security export | Returns the same bounded safe projection as synchronous formula-safe CSV. |
| `GET /api/admin/users` | `UsersModule` | Admin user management | Returns a paginated, filterable safe account summary without password/session secrets. |
| `GET /api/admin/users/:userId` | `UsersModule` | Admin user detail | Returns safe account/session aggregates and bounded immutable administration history. |
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
  "token": "v1.view.<expiry-ms>.<nonce>.<hmac-signature>",
  "expiresAt": "2026-07-23T10:00:00.000Z",
  "url": "/api/access/documents/document-id/stream?token=v1.view..."
}
```

Source tokens are staff-only, purpose-specific, bound to the authenticated staff user and document, and require `LIBIF_SOURCE_ACCESS_TOKEN_SECRET` in production.

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
- Live Phase 7 routes include `GET /api/catalog/books/:documentId`, `GET /api/reader/documents/:documentId/state`, `GET /api/access/documents/:documentId/manifest`, and `GET /api/access/documents/:documentId/pages/:pageNumber`.
- The page route returns an authorized, bounded, individually server-watermarked raster image with private/no-store caching and never returns object keys, source-PDF bytes/URLs, or extracted OCR text. The web viewer draws it on canvas without a selectable text layer and persists progress only after a page renders successfully.
- Every successful/denied page attempt produces a bounded `ReaderAccessEvent`; Redis-backed rate/concurrency/scrape enforcement returns stable `429` + `Retry-After` where applicable and emits committed risk facts for deduplicated staff alerts.
- Admin-only security projections are live at `GET /api/admin/reports/reader-access?from&to&risk` and `GET /api/admin/reports/reader-access.csv`; both enforce a bounded UTC range, safe projections, and deterministic ordering.
- Reader access to the source-file token, stream, and file routes is denied by explicit role policy. Retained source-file access is staff-only and uses a short-lived HMAC token bound to staff user, document, purpose, and expiry.
- `LIBIF_SOURCE_ACCESS_TOKEN_SECRET` is required in production. Protected-page rate thresholds are deployment-owned environment configuration; production fails closed when Redis is unavailable unless the explicit in-memory development override is enabled.
- Live Admin user routes are `GET /api/admin/users` and `GET /api/admin/users/:userId`; these expose only safe account, session, and administration-audit projections.
- Waves 3–4 intentionally do not refresh `apps/api/openapi/libif-api.json` or `apps/web/lib/generated/api-types.ts`. Runtime-live Phase 7 routes remain unavailable to generated-client consumers until D7-005 performs the single cross-lane contract refresh.

## Deferred or absent endpoint families

These routes are not implemented in the current runtime code and must not be treated as live contracts:

- Dedicated correction history/resubmission endpoints such as `/api/admin/documents/{documentId}/corrections` or `/resubmit`.
- Category deletion/reassignment endpoints.
- Tag duplicate-detection or merge endpoints.
- User role-change and account-deactivation endpoints.
- General management dashboard/export and general-settings endpoints. The Reader-access report and bounded CSV routes are live; product-settings persistence is implemented, but the settings route remains gated on a tested deployment-capability source.

The approved contract sources are `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md`, `ai_artifacts/docs/phase-7-wave-1-2-foundation-contract-freeze.md`, and `ai_artifacts/docs/phase-7-wave-4-p0-integration.md`. Controllers and tests are the runtime evidence until D7-005 performs the deferred unified OpenAPI/client refresh.
