# API Skeleton: Users Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Implemented Wave 3 files:

- `apps/api/src/modules/users/users.module.ts`
- `apps/api/src/modules/users/users.controller.ts`
- `apps/api/src/modules/users/users.service.ts`
- `apps/api/src/modules/users/dto/user-list-query.dto.ts`
- `apps/api/src/modules/users/dto/user-response.dto.ts`
- `apps/api/src/modules/users/users.service.spec.ts`
- `apps/api/test/users.e2e-spec.ts`

Primary endpoints:

- `GET /api/admin/users` — live in Wave 3 backend slice
- `GET /api/admin/users/:userId` — live in Wave 3 backend slice
- `PATCH /api/admin/users/:id/role` — planned for D7-002
- `POST /api/admin/users/:id/deactivate` — planned for D7-002
- `POST /api/admin/users/:id/reactivate` — planned for D7-002

Foundation status:

- D7-000 now provides `User.status`, `deactivatedAt`, and append-only `UserAdministrationEvent` history.
- D7-001 is now live for safe Admin-only list/detail reads with bounded session/audit summaries.
- The tracked OpenAPI and generated web client intentionally remain unchanged until D7-005; this runtime slice is not generated-client-ready in Wave 3.
- D7-002 role/status mutations, deactivated-auth enforcement, and any admin web page remain pending.
