# API Skeleton: Approval Module

Owner: Member C — Processing, Approval, and Notifications

Future runtime files:

- `apps/api/src/modules/approval/approval.module.ts`
- `apps/api/src/modules/approval/approval.controller.ts`
- `apps/api/src/modules/approval/approval.service.ts`
- `apps/api/src/modules/approval/dto/approval-queue-query.dto.ts`
- `apps/api/src/modules/approval/dto/approval-action.dto.ts`
- `apps/api/src/modules/approval/approval.service.spec.ts`
- `apps/api/test/approval.e2e-spec.ts`

Primary endpoints:

- `GET /approvals/queue`
- `GET /approvals/:id`
- `POST /approvals/:id/approve`
- `POST /approvals/:id/reject`
- `POST /approvals/:id/request-correction`
