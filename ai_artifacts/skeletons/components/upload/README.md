# Component Skeleton: upload

Owner: Member B — Document, Upload, and Catalog Management

Future runtime files:

- `apps/web/components/domain/upload/UploadWorkflow.tsx`
- `apps/web/components/domain/upload/UploadLifecyclePanel.tsx`
- `apps/web/components/domain/upload/FileReplacementPanel.tsx`
- `apps/web/components/domain/upload/UploadValidationSummary.tsx`

Primary responsibilities:

- Compose shared UI primitives for PDF upload, validation, replacement, retry/cancel, and lifecycle feedback.
- Consume document/upload APIs only through the web API adapter layer.
- Do not own taxonomy selector internals; consume Member D taxonomy components/contracts.
