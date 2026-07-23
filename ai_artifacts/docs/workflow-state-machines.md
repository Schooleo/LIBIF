# Workflow State Machines

Last updated: 2026-07-23

This document records current runtime workflow truth from the merged Phase 6 code. Workflow ownership comes from Prisma enums, transactional service logic, and the current NestJS module boundaries. Endpoint paths and payload shapes belong in `api-contracts.md`.

## Authentication and password reset

- **States:** anonymous, authenticated, validation_failed, session_expired, reset_requested, reset_token_valid, reset_token_invalid, password_reset_completed, access_denied.
- **Commands:** register_reader, sign_in, sign_out, request_password_reset, reset_password, read_session.
- **Events:** UserRegistered, UserSignedIn, UserSignedOut, PasswordResetRequested, PasswordResetCompleted, SessionRevoked.
- **Transitions:**
  - anonymous -> authenticated on successful registration or sign-in.
  - authenticated -> anonymous on sign-out.
  - authenticated -> session_expired when the persisted session is revoked or expires.
  - reset_requested -> password_reset_completed only through a valid unused token.
- **Ownership:** `AuthService` owns registration, sign-in, sign-out, session resolution, password-reset token issuance, and token consumption.
- **Notes:** persisted `UserSession` rows are authoritative for protected routes; development-header auth remains opt-in and non-production only.

## Staff intake, upload lifecycle, and file replacement

- **Document states:** DRAFT, PENDING_PROCESSING, PROCESSING, PENDING_APPROVAL, CORRECTION_REQUIRED, PUBLISHED, REJECTED.
- **File states:** ACTIVE, REPLACED, REJECTED.
- **Commands:** create_upload, get_upload_state, cancel_upload, retry_upload, replace_file, submit_processing.
- **Events:** UploadCreated, FileStored, ProcessingQueued, UploadCancelled, FileReplaced, ProcessingResubmitted.
- **Transitions:**
  - New intake creates one `Book` in `PENDING_PROCESSING`, one `BookFile` in `ACTIVE`, and one `ProcessingJob` in `QUEUED`.
  - `replace_file` marks prior active files as `REPLACED`, creates a new active version, supersedes queued/running jobs plus pending reviews, and creates one new queued job.
  - `submit_processing` reuses the active file, supersedes queued/running jobs plus pending reviews, and creates one new queued job.
  - `cancel_upload` only cancels queued intake work; it does not delete the book or file record.
  - `retry_upload` creates a new queued job for the latest file and returns the document to `PENDING_PROCESSING`.
- **Ownership:** `UploadService` owns initial intake plus upload cancel/retry; `DocumentsService` owns active-file replacement, metadata-preserving resubmission, and supersession of stale work.

## Metadata editing and correction loop

- **Review states used by correction:** PENDING, CORRECTION_REQUESTED, SUPERSEDED, APPROVED, REJECTED.
- **Commands:** update_metadata, request_correction, replace_file, submit_processing.
- **Events:** MetadataUpdated, CorrectionRequested, CorrectionSuperseded, ProcessingRequeued.
- **Transitions:**
  - Staff metadata edits do not change workflow state by themselves.
  - `request_correction` changes the active review to `CORRECTION_REQUESTED` and the document to `CORRECTION_REQUIRED`.
  - Correction work is completed by reusing existing document commands: metadata patch, optional file replacement, then `submit_processing`.
  - New processing requests supersede pending reviews before the next review round is created.
- **Ownership:** `ApprovalService` opens the correction state; `DocumentsService` owns the repair and resubmission path.
- **Notes:** there is no separate correction-only resource or dedicated resubmission workflow object in the current code.

## Processing worker and job lineage

- **Job statuses:** QUEUED, RUNNING, SUCCEEDED, FAILED, CANCELLED, SUPERSEDED.
- **Stage strings currently emitted:** validating, performing_ocr, indexing, completed, failed, cancelled, superseded, queued.
- **Commands:** list_jobs, get_job, get_job_status, get_job_history, retry_job, cancel_job.
- **Events:** ProcessingStarted, TextExtractionCompleted, ArtifactPersisted, ProcessingCompleted, ProcessingFailed, ProcessingCancelled, ProcessingSuperseded, ProcessingRetried.
- **Transitions:**
  - `QUEUED -> RUNNING` when the worker claims the job and moves the document to `PROCESSING`.
  - `RUNNING -> SUCCEEDED` after extracted text is persisted and a review round is created.
  - `RUNNING -> FAILED` on processing exceptions; the document returns to `PENDING_PROCESSING`.
  - `QUEUED|RUNNING -> CANCELLED` through staff cancellation.
  - `QUEUED|RUNNING -> SUPERSEDED` when a newer submit/replacement request invalidates stale work.
  - `FAILED -> new QUEUED job` through retry lineage; the old job remains historical and the new job points back with `retryOfJobId`.
- **Ownership:**
  - `ProcessingQueue` owns queue publication.
  - `ProcessingProcessor` owns worker execution, stage/progress mutation, artifact persistence, and approval-review creation on success.
  - `ProcessingService` owns read models, retry, cancel, and history projection.
- **Notes:** the claim is atomic, duplicate deliveries skip after the first claim, and cancellation/replacement state is rechecked before artifact and approval side effects. Artifacts are file/job-scoped through `ProcessingArtifact`; success persists one `EXTRACTED_TEXT` artifact with `EMBEDDED_TEXT` or real `OCR` metadata, while corrupt/unreadable PDFs fail without synthetic text.

## Approval, rejection, publication, and superseded review rounds

- **Review statuses:** PENDING, APPROVED, REJECTED, CORRECTION_REQUESTED, SUPERSEDED.
- **Commands:** list_reviews, get_review, approve_review, approve_and_publish, reject_review, request_correction.
- **Events:** ApprovalRequired, ReviewApproved, ReviewPublished, ReviewRejected, CorrectionRequested, ReviewSuperseded.
- **Transitions:**
  - Successful processing creates exactly one new `PENDING` review round for the processed file/job pair.
  - `PENDING -> APPROVED`, `REJECTED`, or `CORRECTION_REQUESTED` is final.
  - Pending reviews can also be moved to `SUPERSEDED` when newer file/job work replaces them.
- **Ownership:** `ApprovalService` owns decision transitions, book-status updates, and audit records; `NotificationsService` owns decision fanout after the transaction commits.
- **Current implementation note:** both `approve_review` and `approve_and_publish` currently set the document status to `PUBLISHED`. The difference today is audit wording and notification destination, not lifecycle state.

## Notifications and recipient read state

- **Persisted statuses:** UNREAD, READ, ARCHIVED.
- **Commands:** create_notification, list_notifications, get_unread_count, mark_notification_read, mark_all_notifications_read.
- **Events currently fanned out:** ApprovalRequired, creator-approved notice, creator-published notice, creator-rejected notice, and CorrectionRequested.
- **Transitions:**
  - New notifications are stored as `UNREAD`.
  - Recipient read actions move `UNREAD -> READ`.
  - `ARCHIVED` exists in schema only; no runtime command currently emits that transition.
- **Ownership:** `NotificationsService` owns Prisma persistence, recipient scoping, unread counts, and read-state mutation.
- **Notes:** notifications are now durable across process restarts; service methods enforce recipient ownership for single-item read actions.

## Reader access, protected file delivery, and personal collections

- **Access decision states:** access_granted, access_denied.
- **Reader-visible document states:** DRAFT, PENDING_PROCESSING, PROCESSING, PENDING_APPROVAL, CORRECTION_REQUIRED, PUBLISHED, REJECTED.
- **Commands:** get_access_decision, create_view_token, create_download_token, stream_document, download_document, list_library, list_history, list_bookmarks, add_bookmark, remove_bookmark, update_progress.
- **Events:** AccessGranted, AccessDenied, BookmarkAdded, BookmarkRemoved, ProgressUpdated.
- **Transitions:**
  - Readers are allowed only for `PUBLISHED` documents.
  - Admins and librarians are allowed to access unpublished documents through the same access boundary.
  - Bookmark and reading-progress records apply only to published-library reads.
- **Ownership:** `AccessService` owns reader/staff access decisions plus protected file delivery; `ReaderService` owns library, bookmarks, and reading progress.
- **Notes:** current token generation is request-time and short-lived by convention; browser code consumes protected stream/download URLs rather than direct storage credentials.

## Dashboard and reporting read model

- **Read-model groups:** book status counts, processing job status counts, taxonomy counts, user role counts, recent books, grouped workflow activity counts, and the ten most recent processing/approval/correction audit facts.
- **Commands:** get_librarian_dashboard_summary.
- **Ownership:** `ReportingService` owns read-only aggregation over module-owned tables.
- **Notes:** activity rows are newest-first, document-scoped projections over `BookAuditEvent`; the reporting module does not own workflow commands. Successful worker completion emits both `PROCESSING_COMPLETED` and `APPROVAL_REQUESTED`.
