# API Skeleton: Settings Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Implemented Wave 3 files:

- `apps/api/src/modules/settings/settings.service.ts`
- `apps/api/src/modules/settings/dto/settings.dto.ts` — Phase 7 contract frozen
- `apps/api/src/modules/settings/settings.service.spec.ts`

Planned after the capability handoff:

- `apps/api/src/modules/settings/settings.module.ts`
- `apps/api/src/modules/settings/settings.controller.ts`
- `apps/api/test/settings.e2e-spec.ts`

Primary endpoints:

- `GET /api/admin/settings/general` — planned after the capability handoff
- `PATCH /api/admin/settings/general` — planned after the capability handoff

Foundation status:

- `SystemSettings` now persists only product-owned library name, support email, locale, and Reader notice.
- Watermark secrets and exact rate/scrape thresholds stay deployment-managed; the frozen response exposes only safe configured/not-configured metadata.
- D7-004 product-settings persistence and input normalization are implemented and tested independently.
- The controller remains non-live until Member A lands a tested source for watermark-signing and scrape-protection capability facts; Member D does not hard-code or infer those facts.
- Admin settings web pages and generated-client reconciliation remain deferred to D7-005.
