# API Skeleton: Users Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Future runtime files:

- `apps/api/src/modules/users/users.module.ts`
- `apps/api/src/modules/users/users.controller.ts`
- `apps/api/src/modules/users/users.service.ts`
- `apps/api/src/modules/users/dto/user-list-query.dto.ts`
- `apps/api/src/modules/users/dto/update-user-role.dto.ts`
- `apps/api/src/modules/users/users.service.spec.ts`
- `apps/api/test/users.e2e-spec.ts`

Primary endpoints:

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id/role`
- `POST /users/:id/deactivate`
- `POST /users/:id/reactivate`

Foundation status:

- D7-000 now provides `User.status`, `deactivatedAt`, and append-only `UserAdministrationEvent` history.
- The endpoints remain non-live until D7-001/D7-002 add transactional guards, session revocation, authorization, and tests.
