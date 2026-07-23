# API Skeleton: Settings Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Future runtime files:

- `apps/api/src/modules/settings/settings.module.ts`
- `apps/api/src/modules/settings/settings.controller.ts`
- `apps/api/src/modules/settings/settings.service.ts`
- `apps/api/src/modules/settings/dto/settings.dto.ts` — Phase 7 contract frozen
- `apps/api/src/modules/settings/settings.service.spec.ts`
- `apps/api/test/settings.e2e-spec.ts`

Primary endpoints:

- `GET /settings`
- `PATCH /settings`

Foundation status:

- `SystemSettings` now persists only product-owned library name, support email, locale, and Reader notice.
- Watermark secrets and exact rate/scrape thresholds stay deployment-managed; the frozen response exposes only safe configured/not-configured metadata.
- No settings route is live until D7-004 implements authorization, service behavior, and tests.
