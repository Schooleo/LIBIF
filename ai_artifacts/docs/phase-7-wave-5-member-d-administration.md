# Phase 7 Wave 5 — Member D Administration Evidence

Date: 2026-07-23  
Owner: Member D — Users, Reporting, Settings, and Integration

## Scope completed

Wave 5 completes the backend/runtime portions of D7-001 through D7-004 without starting the D7-005 generated-client, staff-navigation, or phase-closure work.

### D7-001/D7-002 — user administration

- Existing Admin-only paginated user list and safe user/session/audit detail routes remain stable.
- `PATCH /api/admin/users/:userId/role` changes a role in a serializable transaction, requires a reason, revokes active sessions, and appends an immutable `ROLE_CHANGED` event.
- `POST /api/admin/users/:userId/deactivate` requires a reason, sets the account status/deactivation timestamp atomically, revokes active sessions, and appends an immutable `DEACTIVATED` event.
- `POST /api/admin/users/:userId/reactivate` requires a reason, restores the active-state invariant atomically, and appends an immutable `REACTIVATED` event.
- Administrators cannot change their own role or status.
- Active-administrator rows are locked inside serializable transactions; concurrent demotion/deactivation attempts cannot remove the last active administrator.
- Sign-in, persistent-cookie resolution, and development-header resolution reject deactivated persisted accounts. Existing cookies are revoked when a deactivated account is observed.

### D7-003 — management/security reporting and CSV

- `GET /api/admin/dashboard/librarian?from&to` now applies an inclusive-start/exclusive-end UTC range to recent documents and activity while retaining current inventory counts.
- `GET /api/admin/dashboard/management?from&to` returns bounded document/user/activity counts and Reader rate/scrape/high-risk totals.
- Admin-only synchronous CSV routes are live for:
  - `GET /api/admin/reports/documents.csv?from&to`
  - `GET /api/admin/reports/users.csv?from&to`
  - `GET /api/admin/reports/activity.csv?from&to`
  - the existing `GET /api/admin/reports/reader-access.csv?from&to&risk`
- Operations exports use fixed headers, deterministic `createdAt DESC, id DESC` ordering, a 1,000-row cap, UTF-8 CSV responses, full quoting, embedded newline/quote handling, null normalization, and spreadsheet-formula neutralization.
- Queries use a seven-day default and reject non-UTC, inverted, or greater-than-31-day ranges.
- Select projections exclude password hashes, session/reset tokens, IP/user-agent values, object keys, source content, and deployment secrets.

### D7-004 — supported settings boundary

- `GET /api/admin/settings/general` and `PATCH /api/admin/settings/general` are live and Admin-only.
- Only product-owned values are persisted: library name, support email, locale, Reader notice, updater, and timestamps.
- The response publishes read-only capability metadata only:
  - personalized pages use `private, no-store`;
  - scrape protection is reported configured only when Redis or the explicit non-production/test fallback is active;
  - watermark signing is reported `false` because current protected-page traces are opaque SHA-256 fingerprints, not HMAC-signed watermark claims;
  - deployment metadata is not editable.
- No signing material or exact rate/scrape thresholds are accepted, persisted, or returned.

## Ownership boundaries preserved

- No AccessModule authorization/detector decisions, RenderingModule internals, catalogue/taxonomy implementation, or notification behavior moved into Member D modules.
- No Prisma schema or Phase 7 migration change was required.
- `apps/api/openapi/libif-api.json`, `apps/web/lib/generated/api-types.ts`, staff navigation, and Admin feature pages remain unchanged. D7-005 is still the single approved contract-generation and navigation reconciliation point after Waves 5–6 freeze.

## Fresh verification

- Root lint: pass.
- API unit/integration tests: 32 suites, 171 tests passed.
- Web regression tests: 17 files, 67 tests passed.
- Shared/API/web production builds: pass.
- API e2e: 12 suites, 68 tests passed, including transactional user administration, concurrent last-admin protection, deactivated-auth enforcement, bounded reporting/CSV, and settings authorization/persistence.
- Worker OCR/privacy regression: 1 suite, 5 tests passed.
- Prisma validation and migration deployment status: pass; no pending migration.
- Idempotent seed: pass.
- `git diff --check`: pass.

## Remaining Phase 7 work

- Wave 5 work owned by Members A, B, and C proceeds independently.
- Wave 6 performs the cross-lane security/regression gate.
- D7-005 remains deferred to Wave 7: one OpenAPI/client refresh, staff navigation and Admin page reconciliation, final seed/docs evidence, and Phase 8 handoff.
