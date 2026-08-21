# Phase 7 Waves 6–7 Closure Evidence

Date: 2026-07-24
Owner: Member D — cross-lane security gate and D7-005 integration
Status: Complete

## Closure result

Phase 7 is frozen with the Reader POC path, administration backend, Admin web surfaces, generated contracts, deterministic seed data, and canonical documentation aligned. No Reader route returns a source PDF, object key, extracted OCR text, or a selectable text layer. Protected pages are authorized individually, server-rendered, personalized, audited, delivered `private, no-store`, and drawn by the web viewer on one canvas.

The security gate found and corrected integration defects before closure:

- raw `libif_session` cookie values are SHA-256 fingerprinted before detector/audit use and persistence;
- every repeated page delivery receives a distinct random-backed 64-character opaque trace that resolves to the exact persisted `PAGE_SERVED` event;
- renderer/watermark dependency failure produces a stable fail-closed `503` and a bounded high-risk dependency-denial audit attempt;
- the browser adapter preserves `statusCode` and `retryAfterSeconds` from stable `429` responses for the viewer countdown;
- public catalogue category/tag filters use the public endpoints, are scoped to published books, and do not enumerate draft-only taxonomy;
- catalogue grid/list state is URL-backed alongside search/category/tag/sort/page;
- committed `RATE_LIMITED` and `SCRAPE_SUSPECTED` facts at LOW/MEDIUM/HIGH risk create deterministic, deduplicated, content-safe staff alerts;
- published detail e2e proof now verifies that unpublished records return `404` and reader responses omit storage/source metadata.

## Wave 6 gate by lane

### Member A — access and Reader

- Reader/staff authorization and unpublished non-leakage remain enforced.
- Detector, audit, renderer, and watermark failures fail closed.
- Normal sequential page access stays usable; abusive request, invalid-page, and parallel-session patterns return stable denials.
- The viewer renders raster pages on canvas with real manifest totals, render-confirmed progress, hydrated bookmark state, retry countdown, and no iframe/embed/object/download control.
- Reader source view/download/stream/file routes remain explicitly role-denied.

### Member B — catalogue and taxonomy

- Published direct detail is reader-safe; draft/missing detail returns the same `404` boundary.
- Search, category, public tags, sort, page, and grid/list view are URL state, and catalogue records open canonical detail routes.
- Category impact/delete/reassign and tag impact/delete/merge retain transaction and role tests.
- Public DTO assertions exclude object keys, buckets, checksums, filenames, and staff-only file records.

### Member C — rendering and alerts

- Poppler real-PDF fixtures and page-bound tests remain green.
- Same-scope page requests generate distinct trace fingerprints, and response traces resolve to exact audit events.
- Only unwatermarked base derivatives are cached; personalized outputs remain request-scoped and no-store.
- File replacement invalidates version-scoped derivatives.
- All committed rate/scrape facts use safe deterministic deduplication for active staff recipients.

### Member D — administration, privacy, and regression

- The single Phase 7 migration remains current; no closure schema change was required.
- User lifecycle/last-admin/session-revocation invariants, bounded UTC reporting, formula-safe CSV, and settings secret boundaries remain green.
- Seed data is idempotent and now includes two Readers, two opaque session fingerprints, two distinct served-page traces, the full risk ladder, and one safe Admin risk alert.
- Worker/OCR tests continue to prove identifier-only Redis payloads, private object/workspace handling, no plaintext database preview, real embedded/scanned extraction, duplicate-delivery safety, and cleanup.

## D7-005 integration closure

The approved contract refresh ran once after the Wave 6 route fixes:

- `apps/api/openapi/libif-api.json`
- `apps/web/lib/generated/api-types.ts`

The generated specification now includes the protected manifest/page routes, published catalogue detail, public tags, Reader state, Admin users/commands, management/Reader-security reporting and CSV routes, taxonomy operations, and general settings.

Temporary Phase 7 `as any` route calls were removed. Admin web closure adds:

- `/admin/users`
- `/admin/users/[id]`
- `/admin/management`
- `/admin/reports/reader-access` (risk-alert deep-link alias)
- `/admin/settings/general`

The shared staff sidebar/mobile drawer exposes Users, Management & Reports, and General Settings only to Admins; Librarians retain their existing workspace and read-only taxonomy access. Each new Admin page also runs a server-side role guard before its protected data fetch, so direct Librarian URL access redirects to the access-denied route instead of rendering an API failure inside a successful page.

## Truthful protection boundary

LIBIF implements controlled delivery, deterrence, attribution, auditing, and scrape resistance—not absolute DRM or screenshot prevention. The current watermark trace is a distinct opaque fingerprint linked to a persisted audit event; deployment metadata truthfully reports that cryptographic watermark signing is not configured. Production signing/key rotation, retention policy, and capacity sizing are Phase 8 hardening work, not hidden Phase 7 claims.

## Verification record

The final post-cleanup gate runs:

```bash
npx dotenv -e .env -- npx prisma validate --config apps/api/prisma.config.ts
npm run prisma:generate -w apps/api
npx dotenv -e .env -- npx prisma migrate status --config apps/api/prisma.config.ts
npm run db:seed -w apps/api
npm run lint
npm test
npm run build
npm run test:e2e -w apps/api -- --runInBand
npm run test:worker -w apps/api
git diff --check
```

Targeted closure evidence additionally covers public catalogue detail/tags, access trace-to-audit resolution, session fingerprint privacy, renderer/watermark fail-closed behavior, structured 429 retry propagation, Admin routes/actions, role-scoped navigation, settings capability truthfulness, and generated contract presence.

Final pre-review evidence:

- Prisma schema valid; generated client current; all 6 migrations applied; seed rerun idempotently.
- Root lint passed.
- Unit/component: 33 API suites / 188 tests and 22 web files / 90 tests passed.
- Shared/API/web production builds passed and emitted all five new Admin routes.
- API e2e: 12 suites / 73 tests passed.
- Infrastructure-backed worker/OCR: 1 suite / 5 scenarios passed.
- Live cookie-authenticated smoke returned public tags/detail, Reader state/manifest, a watermarked WebP page with `private, no-store` plus a 64-character trace, Reader source-token `403`, Admin users/management/settings data, and HTTP `200` for every new Admin page.
- Generated-path, source-helper, session-cookie persistence, canvas/no-source, and `git diff --check` scans passed.

## Stop condition

Wave 7 is complete when the final verification table above is green, architect review approves the integrated boundary, the changed-file deslop pass introduces no regression, and the Phase 8 handoff remains limited to release hardening rather than unfinished Phase 7 functionality.
