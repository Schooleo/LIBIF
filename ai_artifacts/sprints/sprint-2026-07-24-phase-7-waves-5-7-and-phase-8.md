# Daily Sprint Completion — 2026-07-24

## Sprint overview

| Field | Result |
|---|---|
| Timebox | 2026-07-24, one calendar day |
| Scope | Phase 7 Waves 5–7 completion; Phase 8 hardening increment |
| Status | Phase 7 complete; Phase 8 sprint closed with a partially accepted phase increment |
| Sprint goal | Finish the administration/security closure, then make the POC demonstrable and locally deployable without overstating production readiness. |

## Phase 7 Wave 5 — Remaining member slices

### Member C — notification and approval polish

[PR #22](https://github.com/Schooleo/LIBIF/pull/22), merged 00:36 ICT:

- database-side notification pagination and read/unread filters;
- keyboard-operable filter tabs and pagination;
- `aria-live` unread-count announcements;
- confirmation dialog for high-impact approve-and-publish;
- unit, integration, and accessibility tests.

### Member A — Reader accessibility and resilience

[PR #23](https://github.com/Schooleo/LIBIF/pull/23), merged 00:43 ICT:

- screen-reader status/error messages for bookmarks and page state;
- focusable canvas and visible focus treatment;
- responsive/touch layout improvements;
- truthful protection language and casual-copy deterrence;
- automated accessibility tests;
- Makefile/CI worker commands and onboarding documentation improvements.

### Member B — Transactional taxonomy operations

[PR #24](https://github.com/Schooleo/LIBIF/pull/24), merged 06:37 ICT:

- category impact analysis, safe reassignment, and deletion;
- descendant/cycle prevention;
- tag impact analysis, deletion, and merge;
- atomic relationship transfer and duplicate prevention;
- confirmation/reassignment/merge UI with live impact metrics;
- 16/16 taxonomy tests, 67/67 web tests, and clean workspace lint.

## Phase 7 Wave 6 — Cross-lane security and regression gate

Commit [`6122520`](https://github.com/Schooleo/LIBIF/commit/61225206b903f831c0fdecd58deee3b7f5696b1f) closed the security and catalogue gates:

- session cookies are hashed before detector/audit persistence;
- repeated deliveries receive distinct opaque traces resolving to exact audit events;
- renderer/watermark dependency failure returns stable fail-closed `503`;
- browser adapters preserve structured `429` retry metadata;
- public taxonomy filters expose published scope only;
- catalogue search/filter/sort/page/view state is URL-backed;
- committed rate/scrape facts create deterministic, deduplicated, content-safe staff alerts;
- public detail tests prove unpublished `404` and omission of storage/source metadata.

The gate revalidated:

- Reader/staff authorization and source-PDF denial;
- rate/concurrency/scrape enforcement and normal sequential usability;
- render-confirmed progress/bookmark hydration;
- safe public catalogue/detail DTOs;
- transactional taxonomy behavior;
- real Poppler rendering and watermark traces;
- user lifecycle, reporting, settings, seed idempotency, and Worker/OCR privacy.

## Phase 7 Wave 7 — D7-005 closure

Commit [`b9af0c1`](https://github.com/Schooleo/LIBIF/commit/b9af0c1cc520e903baba839e67ef4c615f9b3cc5) and closure docs commit [`145c93d`](https://github.com/Schooleo/LIBIF/commit/145c93d35cc93ab5c54295fb2f1aa3b1a7bca613) completed:

- one approved post-freeze OpenAPI/generated-client refresh;
- removal of temporary untyped route calls;
- Admin `/users`, user detail, management, Reader-access report, and general-settings pages;
- role-scoped staff sidebar/mobile navigation and direct-route guards;
- two-Reader/two-session/two-trace deterministic seed evidence and a safe deduplicated risk alert;
- reconciled plans, contracts, architecture, progress docs, and Phase 8 handoff.

[PR #25](https://github.com/Schooleo/LIBIF/pull/25) merged the complete Phase 7 closure at 08:47 ICT.

### Phase 7 Sprint Review

Final closure evidence:

- all six migrations applied and seed rerun idempotently;
- root lint passed;
- 33 API suites / 188 tests;
- 22 web files / 90 tests;
- shared/API/web production builds, including all five new Admin routes;
- 12 API e2e suites / 73 tests;
- worker/OCR 1 suite / 5 infrastructure-backed scenarios;
- live cookie-authenticated public, Reader, watermark, source-denial, Admin-data, and Admin-page smoke;
- generated-path, session-cookie, canvas/no-source, and diff scans.

**Phase 7 completion decision: accepted.** The protection claim remains truthful: controlled delivery, deterrence, attribution, auditing, and scrape resistance—not absolute DRM or screenshot prevention.

## Phase 8 hardening and demo increment

Phase 8 began after the 08:47 closure. The following work was merged before the daily sprint ended:

### Reader/rendering and API correctness

- [PR #26](https://github.com/Schooleo/LIBIF/pull/26): preserved raster pixels during watermark composition, improved diagonal watermark geometry, and added PNG/WebP regression tests.
- [PR #27](https://github.com/Schooleo/LIBIF/pull/27): correctly transformed catalogue `page` and `pageSize` query values to integers.

### Delivery, documentation, seed, and local runtime

- [PR #28](https://github.com/Schooleo/LIBIF/pull/28): split API/web CI with path filters, SHA/dev image publication, and tag-only CD requiring main ancestry; validated with `actionlint`, contract assertions, service tests/builds, worker tests, and Docker smoke.
- [PR #29](https://github.com/Schooleo/LIBIF/pull/29): merged the updated project documents. Its review contains the repository’s only non-empty PR review message: “Very detailed documents!”
- Direct follow-up `9b896c7` removed duplicated documentation and repaired Prisma migration consistency before demo seeding.
- [PR #30](https://github.com/Schooleo/LIBIF/pull/30): seeded catalogue PDFs/object storage, improved Reader/auth presentation, and added Gmail-compatible reset-email delivery with tests.
- [PR #31](https://github.com/Schooleo/LIBIF/pull/31): added a self-contained local Compose stack for migrations, seed, API, worker, web, Nginx, and persistent Tailscale ingress.

### Runtime and workflow recovery

- [PR #32](https://github.com/Schooleo/LIBIF/pull/32): added SVG support for watermark composition, internal Docker API routing for Admin SSR, and authenticated Reader/Admin smoke; API/web builds/lint and 90 web tests passed.
- [PR #33](https://github.com/Schooleo/LIBIF/pull/33): preserved seeded workflow status, recovered pending approvals, improved ISBN layout, added Staff↔Reader navigation, strengthened headings, and made audit history readable; 191 API tests, 93 web tests, lint, and builds passed.
- Direct follow-ups `d3b7fa0` and `4710095` separated seed execution from local startup and preserved local authentication after API recreation.

### Search and review completion

- [PR #34](https://github.com/Schooleo/LIBIF/pull/34), merged 15:33 ICT:
  - indexed successful extracted/OCR text in PostgreSQL without querying MinIO on public requests;
  - added a migration and legacy reindex command;
  - enabled protected canvas review inside approval pages without Reader bookmark/progress writes;
  - standardized primary-button hover behavior;
  - passed 192 API tests, 96 web tests, API/web lint/builds, local migration/reindex, and a live `MapReduce` content-search smoke.

The PR noted one explicit gap: no local pending-approval row existed for a manual review-page walkthrough, so that mode had component-test and production-build evidence but no manual visual acceptance.

## Phase 8 completion assessment

### Accepted in this sprint

- local, reproducible POC deployment;
- service-aware CI/CD foundations;
- deterministic demo documents and SMTP-backed reset delivery;
- critical watermark, SSR, navigation, audit, and workflow repairs;
- full-text catalogue search over processed text;
- protected approval-review canvas.

### Not yet complete against the Phase 8 handoff

No repository evidence closes these original priorities:

- production backup/restore and secret rotation;
- production watermark-signing/key-rotation decision;
- Reader-access retention, aggregation, deletion, and trace-resolution procedures;
- render/cache/audit/detector capacity tests;
- comprehensive real-browser network, keyboard, screen-reader, compact-width, contrast, long-content, Vietnamese-font, and watermark-readability QA;
- production-like abuse/recovery exercises for Redis/storage/render interruption and alert false positives;
- observability, operator runbooks, release checklist, rollback criteria, and deployed same-site CSV verification.

**Phase 8 decision: sprint closed, phase partially accepted.** The completed POC increment is real; the unresolved production-operability work remains carry-over.

## Retrospective

What worked:

- Phase 7’s explicit handoff made post-closure defects easy to classify as hardening rather than hidden feature incompleteness;
- local Compose and deterministic seed data enabled end-to-end smoke testing;
- the final sprint increased automated coverage from the Phase 7 closure baseline to 192 API and 96 web tests.

What must improve:

- production readiness needs operational evidence, not only local Docker success;
- visual/browser acceptance should use prepared workflow records so review pages can be walked manually;
- release/security tasks need a separately approved plan rather than being inferred from feature PRs.

## Next phase backlog — proposed Phase 9 / Phase 8 carry-over

No repository-approved Phase 9 plan exists. The following backlog is a direct carry-over from the unclosed Phase 8 handoff:

1. Prove production backup/restore, secret rotation, dependency packaging, and fail-closed configuration.
2. Decide and implement watermark trace signing/key rotation if required.
3. Define access-event retention and incident trace-resolution runbooks.
4. Capacity-test rendering, caches, audit volume, detectors, and CSV paths.
5. Run the full real-browser accessibility, privacy, visual, Vietnamese-content, and abuse/recovery matrix.
6. Add observability, operator procedures, release/rollback checklists, and production-like deployment verification.
7. Create deterministic pending-approval seed state and complete the manual review-canvas acceptance walkthrough.
