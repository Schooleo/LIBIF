# Web Route Skeleton: Reader Document Viewer

Owner: Member A

Future runtime files:

- `apps/web/app/(reader)/documents/[id]/view/page.tsx`
- `apps/web/app/(reader)/documents/[id]/view/loading.tsx`
- `apps/web/app/(reader)/documents/[id]/view/error.tsx`
- `apps/web/components/domain/reader/ProtectedDocumentViewer.tsx`
- `apps/web/components/domain/reader/ReadingProgressTracker.tsx`

Phase 7 completion contract:

- Replace the raw-PDF `<iframe>` and Reader download action with individually server-watermarked raster pages drawn on HTML `<canvas>`.
- Use one authoritative state for rendered page, real page count, navigation, keyboard controls, saved progress, loading, error, and retry.
- Hydrate bookmark/progress from persisted reader state.
- Do not add a selectable OCR/PDF text layer or expose source-PDF/object-key URLs.
- Describe canvas rendering as casual-copy deterrence, not absolute DRM or screenshot prevention.
- Expose stable rate-limit/retry states without revealing scrape thresholds or internal risk scores.
