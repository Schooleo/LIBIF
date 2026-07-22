# Workflow State Machines

Generated: 2026-07-20 08:47:25Z

This document defines backend-owned workflow truth for later implementation. Names are canonical UI/domain states; adapters may map current database enums until migrations are planned.

## Authentication and password reset

- **States:** anonymous, credentials_submitted, authenticated, validation_failed, session_expired, reset_requested, reset_token_valid, reset_token_invalid, password_reset_completed, access_denied.
- **Commands:** register_reader, sign_in, sign_out, request_password_reset, reset_password, refresh_session, check_permission.
- **Events:** UserRegistered, UserSignedIn, PasswordResetRequested, PasswordResetCompleted, SessionExpired, AccessDeniedRecorded.
- **Transitions:** anonymous -> authenticated on valid registration/sign-in; anonymous -> validation_failed on invalid credentials; authenticated -> session_expired on expiry/revocation; authenticated -> anonymous on sign-out; reset_requested -> password_reset_completed on valid single-use token and accepted password.
- **API responses:** generated `SessionDto` with role/permissions and `persistent-cookie`/`development-header` strategy; uniform reset request message; reset completion result; NestJS forbidden/validation envelopes for access-denied screens.
- **Permissions:** anonymous can register/sign in/request reset; authenticated users can read own session; database-backed sessions are authoritative for protected routes; development headers require explicit non-production opt-in.

## Upload and file replacement

- **States:** idle, validating, validation_failed, uploading, accepted, storage_failed, queued_for_processing, replacement_requested, replacement_accepted, cancelled when supported.
- **Commands:** validate_pdf, create_upload, complete_upload, replace_pdf, cancel_upload.
- **Events:** PdfUploadAccepted, BookUploadedEvent, PdfReplacementAccepted, UploadValidationFailed.
- **Transitions:** idle -> validating -> uploading -> accepted -> queued_for_processing; replacement_requested -> replacement_accepted creates an auditable new file version, supersedes earlier active processing, and invalidates stale pending approval work.
- **API responses:** asynchronous accepted response with document id, file id, job id, current status, and status endpoint.
- **Permissions:** Librarian/Admin for intake and replacement; Reader never uploads PDFs.
- **Current implementation note:** Phase 5 intake/replacement/requeue uses authenticated API adapters and persisted queue handoff. Actual OCR consumption is not implemented until Phase 6.

## Metadata and ISBN enrichment

- **States:** metadata_empty, isbn_lookup_pending, isbn_found, isbn_not_found, metadata_draft, metadata_validated, submitted_for_review, metadata_rejected, metadata_corrected.
- **Commands:** lookup_isbn, save_metadata_draft, validate_metadata, submit_review, edit_metadata.
- **Events:** IsbnLookupRequested, IsbnMetadataResolved, MetadataSaved, MetadataSubmittedForReview.
- **Transitions:** metadata_empty -> isbn_lookup_pending -> isbn_found or isbn_not_found; metadata_draft -> submitted_for_review after required fields validate.
- **API responses:** lookup found/metadata/message; validation field errors; document metadata DTO.
- **Permissions:** Librarian/Admin can edit metadata; approvers can review; readers cannot mutate metadata.

## PDF processing

- **States:** queued, validating, compressing, performing_ocr, indexing, retrying, completed, failed, cancelled when supported.
- **Commands:** enqueue_processing, process_stage, retry_job, cancel_job when supported, get_status.
- **Events:** ProcessingJobQueued, PdfValidated, PdfCompressed, OcrTextExtracted, SearchIndexed, ProcessingJobCompleted, ProcessingJobFailed, ProcessingJobRetrying.
- **Transitions:** queued -> validating -> compressing -> performing_ocr -> indexing -> completed; recoverable failure -> retrying -> current stage; unrecoverable or max attempts -> failed.
- **API responses:** stable ProcessingJob DTO with stage progress, attempts, safe error message, trace id, retry history endpoint.
- **Permissions:** Librarian/Admin can view and retry; only system workers process stages.
- **Current implementation note:** Phase 5 persists jobs and guards manual simulated transitions. Phase 6 adds the system worker, durable OCR artifacts, explicit cancellation/supersession semantics, and retry lineage.

## Approval and correction

- **States:** pending_review, under_review, approved, approved_and_published, rejected, correction_requested, correction_in_progress, resubmitted.
- **Commands:** start_review, approve, approve_and_publish, reject, request_correction, return_to_editor, resubmit.
- **Events:** ApprovalStarted, DocumentApproved, DocumentPublished, DocumentRejected, CorrectionRequested, CorrectionResubmitted.
- **Transitions:** pending_review -> approved or rejected or correction_requested; correction_requested -> correction_in_progress -> resubmitted -> pending_review; approved -> published when publish command is accepted.
- **API responses:** document review DTO, decision result, audit entry, safe field/reason errors.
- **Permissions:** Approver/Admin for decisions; Librarian can correct/resubmit own assigned items depending on policy.
- **Current implementation note:** Phase 5 exposes only the current pending approval queue/detail foundation. Phase 6 implements decision, correction, resubmission, audit, and notification transitions.

## Protected reader access

- **States:** no_access, access_granted, reading_active, grant_expired, renewal_pending, renewal_failed, completed_reading.
- **Commands:** request_access_grant, renew_access_grant, save_progress, add_bookmark, remove_bookmark, record_history.
- **Events:** ReaderAccessGranted, ReaderAccessDenied, ReadingProgressSaved, BookmarkCreated, BookmarkRemoved.
- **Transitions:** no_access -> access_granted after policy pass; access_granted -> grant_expired after 15 minutes by default; grant_expired -> access_granted on renewal if still authorized.
- **API responses:** short-lived URL/grant payload, expiry timestamp, reader progress DTO; never expose storage credentials.
- **Permissions:** Reader with entitlement/role; NestJS policy is authoritative.

## Report export

- **States:** configuring, queued, running, completed, failed, expired, cancelled when supported.
- **Commands:** create_export, get_export_status, download_export, retry_export, cancel_export.
- **Events:** ReportExportRequested, ReportExportStarted, ReportExportCompleted, ReportExportFailed.
- **Transitions:** configuring -> queued -> running -> completed or failed; completed -> expired after retention window.
- **API responses:** accepted response with export job id/status endpoint; completed response with authorized download grant.
- **Permissions:** Manager/Admin or configured reporting permission.

## Category deletion/reassignment

- **States:** editable, delete_requested, deletion_blocked, reassignment_required, reassignment_preview, deleting, deleted.
- **Commands:** create_category, update_category, request_delete_category, preview_reassignment, reassign_and_delete.
- **Events:** CategoryCreated, CategoryUpdated, CategoryDeletionRequested, CategoryReassigned, CategoryDeleted.
- **Transitions:** delete_requested -> deleted if no dependents; delete_requested -> reassignment_required if dependents exist; reassignment_preview -> deleting -> deleted on transaction success.
- **API responses:** category tree DTO, dependent counts, reassignment preview, mutation result with audit id.
- **Permissions:** Admin/taxonomy manager.

## Tag merging

- **States:** active, duplicate_candidate, merge_preview, merge_confirmed, merging, merged.
- **Commands:** list_duplicates, preview_merge, merge_tags, rename_tag.
- **Events:** DuplicateTagsDetected, TagMergePreviewed, TagsMerged.
- **Transitions:** active -> duplicate_candidate -> merge_preview -> merged.
- **API responses:** duplicate groups, affected document counts, merge result.
- **Permissions:** Admin/taxonomy manager.

## Role change

- **States:** current_role, change_requested, confirmation_required, changed, change_rejected.
- **Commands:** preview_role_change, change_role.
- **Events:** UserRoleChanged.
- **Transitions:** current_role -> confirmation_required -> changed; invalid/self-lockout attempt -> change_rejected.
- **API responses:** user detail, role change preview, permission impact, audit id.
- **Permissions:** Admin; protect against removing the last admin or self-lockout.

## Account deactivation

- **States:** active, deactivation_requested, deactivated, reactivation_requested when supported, reactivated when supported.
- **Commands:** deactivate_account, reactivate_account when supported.
- **Events:** AccountDeactivated, AccountReactivated.
- **Transitions:** active -> deactivated with required reason/audit record.
- **API responses:** user status DTO, audit id, safe policy errors.
- **Permissions:** Admin; protect against deactivating the last admin or current own account unless explicitly allowed.
