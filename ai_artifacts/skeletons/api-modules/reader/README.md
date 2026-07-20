# API Skeleton: Reader Module

Owner: Member A — Reader Experience and Access

Future runtime files:

- `apps/api/src/modules/reader/reader.module.ts`
- `apps/api/src/modules/reader/reader.controller.ts`
- `apps/api/src/modules/reader/reader.service.ts`
- `apps/api/src/modules/reader/dto/reader-library-query.dto.ts`
- `apps/api/src/modules/reader/dto/reader-library-item.dto.ts`
- `apps/api/src/modules/reader/dto/reading-progress.dto.ts`
- `apps/api/src/modules/reader/dto/bookmark.dto.ts`
- `apps/api/src/modules/reader/reader.service.spec.ts`
- `apps/api/test/reader.e2e-spec.ts`

Primary endpoints:

- `GET /reader/library`
- `GET /reader/history`
- `GET /reader/bookmarks`
- `POST /reader/bookmarks`
- `DELETE /reader/bookmarks/:documentId`
- `PATCH /reader/progress/:documentId`
