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
- Phase 7 target: `GET /access/documents/:documentId/manifest`
- Phase 7 target: `GET /access/documents/:documentId/pages/:pageNumber`
- Current compatibility endpoints: view/download tokens plus raw stream/file delivery; Reader use is removed or denied during Phase 7.

Notes:

- Centralize reader/admin/librarian access decisions here.
- Do not expose raw storage credentials to the web app.
- Render bounded page images server-side and authorize every manifest/page request.
- Do not deliver source-PDF bytes, object keys, or OCR plaintext to Reader viewers.
- Canvas rendering is copy deterrence, not absolute DRM or screenshot prevention.
