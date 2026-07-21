# API Skeleton: Processing Module

Owner: Member C — Processing, Approval, and Notifications

Current runtime files exist under `apps/api/src/modules/processing/**`; use this skeleton for future Phase 5/6 expansion boundaries.

Future/expanded runtime files:

- `apps/api/src/modules/processing/processing.module.ts`
- `apps/api/src/modules/processing/processing.controller.ts`
- `apps/api/src/modules/processing/processing.service.ts`
- `apps/api/src/modules/processing/processing.queue.ts`
- `apps/api/src/modules/processing/events/book-uploaded.event.ts`
- `apps/api/src/modules/processing/dto/processing-job.dto.ts`
- `apps/api/src/modules/processing/dto/update-processing-state.dto.ts`
- `apps/api/src/modules/processing/processing.service.spec.ts`
- `apps/api/test/processing.e2e-spec.ts`

Primary endpoints:

- `GET /processing/jobs`
- `GET /processing/jobs/:id`
- `POST /processing/jobs/:id/retry`
- `POST /processing/jobs/:id/cancel`

Primary responsibilities:

- Own processing job transition validation, retry/cancel semantics, stage/progress DTOs, and queue/worker boundaries.
- Consume document/upload events from Member B through exported services/events; do not edit upload internals unless explicitly coordinated.
