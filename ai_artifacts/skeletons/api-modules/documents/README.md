# API Skeleton: Documents Module

Owner: Member B — Document, Upload, and Catalog Management

Future runtime files:

- `apps/api/src/modules/documents/documents.module.ts`
- `apps/api/src/modules/documents/documents.controller.ts`
- `apps/api/src/modules/documents/documents.service.ts`
- `apps/api/src/modules/documents/dto/document-list-query.dto.ts`
- `apps/api/src/modules/documents/dto/document-detail.dto.ts`
- `apps/api/src/modules/documents/dto/update-document-metadata.dto.ts`
- `apps/api/src/modules/documents/documents.service.spec.ts`
- `apps/api/test/documents.e2e-spec.ts`

Primary endpoints:

- `GET /documents`
- `GET /documents/:id`
- `PATCH /documents/:id/metadata`
- `POST /documents/:id/submit-processing`
- `POST /documents/:id/replace-file`
