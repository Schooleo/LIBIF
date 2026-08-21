# Phase 7 Wave 4 — P0 Reader Integration

Date: 2026-07-23

Status: implemented; full repository closure evidence is recorded below after verification

## Result

Wave 4 integrates the protected Reader POC across the Access, Rendering, Reader, Notification, and Reporting boundaries. A Reader receives individually authorized raster pages rather than the source PDF. Each page is server-watermarked, drawn onto one canvas, and coupled to persisted Reader state and bounded access telemetry.

This design provides access control, deterrence, traceability, and scrape detection. It does not claim absolute DRM or screenshot prevention.

## Integrated boundaries

### Protected delivery

- `GET /api/access/documents/:documentId/manifest` resolves a published active file and returns bounded page metadata.
- `GET /api/access/documents/:documentId/pages/:pageNumber` authorizes, rate-checks, renders, watermarks, audits, and returns one private/no-store raster page.
- Reader roles cannot obtain source-file view/download tokens or use source stream/file routes.
- Staff source-file access uses a short-lived HMAC token bound to the staff user, document, purpose, and expiry.
- Production requires `LIBIF_SOURCE_ACCESS_TOKEN_SECRET`.

### Enforcement and audit

- Redis Lua operations provide atomic page-rate, impossible-rate, concurrent-session, and invalid-probe checks.
- Redis keys hash user/document/session scope; thresholds are deployment-owned environment values.
- Production fails closed when Redis is unavailable unless the explicit development in-memory override is enabled.
- Viewer opens, successful pages, denials, rate limits, and scrape suspicion are persisted as bounded `ReaderAccessEvent` facts.
- HTTP errors retain stable machine codes; `429` responses include `Retry-After`.

### Canvas and Reader state

- The viewer has one current-page owner and draws the returned image to canvas without a selectable text layer.
- Buttons, keyboard navigation, and page jumps share the same state transition and save path.
- Failed image loads show a retry state and do not persist progress.
- Progress is saved only after a successful canvas draw.
- The backend validates browser-reported totals against the protected renderer page count.
- Published-only document state hydrates bookmark and progress controls.

### Alerts and reporting

- Committed high-risk scrape facts create deterministic, deduplicated alerts for active Admin/Librarian recipients.
- Alert payloads contain safe event/window data and exclude page content and raw user/document identifiers.
- Admin-only Reader-access JSON and CSV routes enforce a maximum 31-day UTC range, bounded page size, deterministic ordering, opaque event/document aliases, masked reader labels, and formula-safe CSV cells.
- Development seed data provides deterministic normal, denial, rate-limit, and scrape-suspicion events plus a real private PDF object for the published sample book.

## Configuration

| Variable | Purpose |
|---|---|
| `LIBIF_SOURCE_ACCESS_TOKEN_SECRET` | Required production secret for staff source-file HMAC tokens |
| `LIBIF_ALLOW_IN_MEMORY_READER_LIMITS` | Explicit non-production fallback when Redis is unavailable |
| `READER_PAGE_RATE_LIMIT_PER_MIN` | Normal protected-page request threshold |
| `READER_IMPOSSIBLE_RATE_PER_MIN` | Impossible-reading-rate threshold |
| `READER_MAX_CONCURRENT_SESSIONS` | Per reader/document concurrent-session threshold |
| `READER_MAX_INVALID_PROBES` | Invalid page-probe threshold |

## Scope deliberately deferred

- The unified OpenAPI and generated frontend client refresh remains D7-005.
- Wave 5 owns remaining user role/status administration, risky taxonomy workflows, broader reports/settings, and notification polish.
- The explicit accessible-rendition product decision and full manual responsive/network browser evidence remain later security/closure gates.
- No UI or documentation promises absolute prevention of screenshots or extraction from an authorized endpoint.

## Verification evidence

- Targeted API gate: 16 suites / 103 tests across access, Reader, rendering, notifications, reporting, and catalogue.
- Targeted protected Reader/catalogue web gate: 2 files / 5 tests.
- Targeted integration gate: access, Reader, reporting, and reporting seed — 4 suites / 24 tests.
- Full unit gate: 32 API suites / 166 tests and 17 web files / 67 tests.
- Full API e2e gate: 11 suites / 58 tests.
- Worker/OCR privacy regression: 1 suite / 5 infrastructure-backed scenarios.
- Root lint and production builds pass.
- Prisma validate/migration status pass; seed succeeds twice with stable rows and a real private PDF object.
- Manual cookie-authenticated network smoke returns published detail/state/manifest and a watermarked WebP page with `private, no-store`; the Reader source download-token route returns `403`. The opt-in development-header path resolves the seeded Reader account and returns the protected manifest without a foreign-key failure.
- Static scans find no Reader PDF iframe/embed/object/download compatibility, plaintext Reader surface, merge markers, focused tests, schema/migration drift, or tracked OpenAPI/generated-client churn.
- Thorough architect review approved the integrated result after safe report aliases and documentation reconciliation.
- Changed-files-only anti-slop cleanup removed a broad database-error swallow and preserved only the tested fail-closed audit fallback; all post-cleanup regressions pass.

## Wave 5 handoff

The Wave 4 verification and review gates are green. Wave 5 may start; protected Reader contracts are regression-only surfaces unless a failing gate identifies an integration defect.
