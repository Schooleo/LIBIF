# API Skeleton: Secure Rendering Module

Phase 7 owner: Member C — Secure Rendering, Alerts, and Notifications

Runtime contract frozen in Wave 2:

- `apps/api/src/modules/rendering/protected-page-renderer.port.ts`

Remaining planned runtime files:

- `apps/api/src/modules/rendering/rendering.module.ts`
- `apps/api/src/modules/rendering/poppler-page-renderer.adapter.ts`
- `apps/api/src/modules/rendering/page-watermark.service.ts`
- `apps/api/src/modules/rendering/rendering.service.spec.ts`
- rendering/storage integration tests

Exported contract:

- `ProtectedPageRenderer.renderBasePage({ bookFileId, bucket, objectKey, pageNumber, profile })`
- `ProtectedPageRenderer.composeWatermark({ basePage, maskedReaderLabel, occurredAt, documentId, pageNumber, traceId })`

Boundaries:

- Member C owns Poppler execution, page/profile bounds, private base-derivative caching, server-burned watermark composition, and file-replacement invalidation.
- Member A's `AccessModule` owns authorization, active-file lookup, audit events, rate/concurrency decisions, and HTTP delivery.
- The renderer never returns OCR text, storage credentials, or a source-PDF URL to the browser.
- Unwatermarked bases may be cached only under private file-version-scoped keys. Personalized pages are composed per request and delivered with `private, no-store`.
- The watermark contains a masked reader label and opaque trace, not secrets or raw internal identifiers.
- The frozen port is not a renderer implementation and does not make protected page delivery live.
