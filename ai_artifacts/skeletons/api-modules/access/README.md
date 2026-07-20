# API Skeleton: Access Module

Owner: Member A — Reader Experience and Access

Future runtime files:

- `apps/api/src/modules/access/access.module.ts`
- `apps/api/src/modules/access/access.controller.ts`
- `apps/api/src/modules/access/access.service.ts`
- `apps/api/src/modules/access/dto/access-decision.dto.ts`
- `apps/api/src/modules/access/dto/protected-document-url.dto.ts`
- `apps/api/src/modules/access/access.service.spec.ts`
- `apps/api/test/access.e2e-spec.ts`

Primary endpoints:

- `GET /access/documents/:documentId/decision`
- `POST /access/documents/:documentId/view-token`
- `POST /access/documents/:documentId/download-token`

Notes:

- Centralize reader/admin/librarian access decisions here.
- Do not expose raw storage credentials to the web app.
