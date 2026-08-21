# Phase 7 Waves 1–2 — Foundation and Contract Freeze

Date: 2026-07-23
Status: implemented and repository-verified

## Wave 1 — D7-000 foundation

The single Phase 7 migration is:

- `apps/api/prisma/migrations/20260723143000_phase7_administration_reader_security_foundation/migration.sql`

It adds:

- `User.status` and `User.deactivatedAt`, with existing users backfilled to `ACTIVE` and a database check that prevents contradictory lifecycle state;
- append-only `UserAdministrationEvent` facts for role changes, deactivation, and reactivation;
- append-only `ReaderAccessEvent` facts for viewer opens, served/denied pages, rate limiting, and suspected scraping;
- bounded risk/reason enums, positive page constraints, unique SHA-256 trace fingerprints, and reporting-oriented indexes;
- a typed singleton `SystemSettings` record for product-owned values only;
- database triggers that reject updates and deletes of both audit tables.

`ReaderAccessEvent` deliberately has no JSON/content column and no storage key, source URL, token, OCR text, raw IP, or raw user-agent field. `sessionId` and `bookFileId` are retained as immutable facts rather than foreign keys so session/file lifecycle cleanup cannot rewrite or delete historical access evidence.

Users and books referenced by immutable audit facts are not hard-deleted; account administration uses deactivation and preserves actor/target history.

`apps/api/prisma/seed.ts` idempotently creates the `default` settings singleton without overwriting an administrator's existing settings.

Migration proof lives in `apps/api/test/phase7-foundation.e2e-spec.ts` and covers:

- existing-user backfill;
- lifecycle consistency;
- append-only enforcement;
- valid and invalid Reader event shapes;
- the explicit non-content audit column allowlist;
- settings singleton and value constraints.

## Wave 2 — frozen contracts

These code contracts are frozen before feature controllers are implemented:

| Producer | Consumer | Frozen code surface |
|---|---|---|
| Member D | Member A | Prisma `ReaderAccessEvent` enums/model plus `apps/api/src/modules/access/contracts/reader-access.contract.ts` |
| Member B | Member A/web | `PublicBookDetailDto` in `packages/shared/src/index.ts` and `PublicBookDetailResponseDto` |
| Member C | Member A | `apps/api/src/modules/rendering/protected-page-renderer.port.ts` |
| Member A | Member C | `CommittedReaderRiskFact` with committed event ID and no raw reader identity |
| Member A | Web | protected manifest, page descriptor, stable 429 DTO, and Reader document-state DTO |
| Member D | Reporting/settings | bounded Reader-access report query/response DTOs and safe general-settings DTOs |

### Protected rendering boundary

`ProtectedPageRenderer` accepts an internal active-file reference, bounded page/profile input, masked reader label, request time, and opaque trace. It returns image bytes, dimensions, page counts, and a trace fingerprint. It never returns OCR text, object-storage credentials, object keys, or a source-PDF URL.

Only private unwatermarked base pages may be cached. Personalized responses use the frozen `private, no-store` policy.

### Reporting and settings boundary

Reader-access reporting is Admin-only when implemented, uses inclusive-start/exclusive-end UTC ranges, caps page size at 200, and projects a masked reader label rather than a raw account identifier. The settings contract persists only library name, support email, locale, and Reader notice. Watermark signing material and exact scrape/rate thresholds remain deployment-managed and are represented only by safe configured/not-configured metadata.

## Ownership after the freeze

- Member A implements access authorization, required audit writes, Redis detectors, page HTTP delivery, canvas integration, bookmark state, and progress.
- Member B implements published-only catalogue detail/discovery and later taxonomy work.
- Member C implements the renderer, private base cache, watermark composition, and committed-risk notifications.
- Member D implements user administration, security reporting/CSV, settings runtime, generated-client integration, and final verification.

Changing a frozen shape requires the producer to update this document, its tests, and every listed consumer. No lane may silently import another lane's implementation classes.

## Verification evidence

- Prisma format, validation, and generation: passed.
- Migration deploy/status and idempotent seed: passed; the development database reports all six migrations applied.
- Prisma datasource-to-schema diff: empty.
- Root lint: passed.
- API unit tests: 20 suites / 91 tests passed.
- Web tests: 15 files / 62 tests passed.
- API e2e: 8 suites / 36 tests passed.
- Worker/OCR privacy regression: 1 suite / 5 scenarios passed.
- Shared, API, and web production builds: passed.
- OpenAPI/client regeneration: passed without adding non-live Wave 3 routes.
- Phase 7 isolated migration suite: 1 suite / 5 tests passed.
- `git diff --check`: passed.

Wave 3 may begin only from these frozen contracts. No new Reader manifest/page route is claimed as live by this checkpoint.

## Next execution focus

The canonical plan's **Wave-by-wave member focus** table is the task dispatch source. Wave 3 is next:

- Member A: A7-001/A7-004 first, A7-003 in parallel, then A7-002/A7-005.
- Member B: B7-001 then B7-002.
- Member C: C7-001/C7-002 are already merged; Wave 3 only fixes renderer integration defects until committed risk facts unblock C7-003.
- Member D: the D7-001 backend read slice is live and D7-004 product-settings persistence is implemented; the settings route remains gated while shared client regeneration stays deferred to D7-005.

Members must not begin Wave 4 integration until the Wave 3 producer tests and handoffs named in the plan pass.
