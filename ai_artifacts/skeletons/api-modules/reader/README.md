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
- `apps/api/src/modules/reader/dto/reader-document-state.dto.ts` — Phase 7 contract frozen
- `apps/api/src/modules/reader/reader.service.spec.ts`
- `apps/api/test/reader.e2e-spec.ts`

Primary endpoints:

- `GET /reader/library`
- `GET /reader/history`
- `GET /reader/bookmarks`
- Phase 7 target: `GET /reader/documents/:documentId/state`
- `POST /reader/bookmarks`
- `DELETE /reader/bookmarks/:documentId`
- `PATCH /reader/progress/:documentId`

Phase 7 notes:

- The one-document state read hydrates `bookmarked` and saved progress on catalogue detail and viewer entry.
- Bookmark writes remain idempotent; refreshes must show persisted state rather than component defaults.
- Progress uses the protected page manifest's real page count and updates only after a page renders successfully.
- The state DTO exists, but the one-document state controller/service behavior remains a Wave 3 task.
