# Web Route Skeleton: Reader Library

Owner: Member A

Future runtime files:

- `apps/web/app/(reader)/library/page.tsx`
- `apps/web/app/(reader)/library/loading.tsx`
- `apps/web/app/(reader)/library/error.tsx`
- `apps/web/app/(reader)/catalogue/[id]/page.tsx`
- `apps/web/components/domain/reader/ReaderLibrary.tsx`
- `apps/web/components/domain/reader/ContinueReading.tsx`
- `apps/web/components/domain/reader/BookmarkButton.tsx`

Phase 7 completion contract:

- `/catalogue` exposes search/category/tag/sort/page/view URL state and links every result to `/catalogue/:id`.
- `/catalogue/:id` uses a direct published-only detail contract rather than scanning one list page.
- Detail and viewer entry hydrate persisted bookmark/progress state; optimistic bookmark failures roll back.
- Catalogue detail, viewer, library, history, and bookmarks agree after refresh.
