# Phase 8 Handoff

Date: 2026-07-24
Source phase: Phase 7 Waves 6–7 closure
Status: Ready after Phase 7 final verification

## Frozen Phase 7 baseline

Phase 8 starts from a working POC baseline:

- published catalogue discovery/detail with URL-backed search/category/tag/sort/page/view state;
- persisted bookmark/progress hydration;
- authorized server-rendered, individually watermarked page images drawn on canvas;
- explicit Reader denial on source-PDF token/stream/file routes;
- opaque session/trace fingerprints, append-only access facts, rate/concurrency/scrape controls, and deduplicated staff alerts;
- transactional taxonomy and user-administration safeguards;
- Admin users, management/security reporting, bounded CSV, and product settings pages;
- one reconciled OpenAPI/generated-client surface;
- infrastructure-backed OCR/worker privacy and reliability evidence.

Phase 8 must not replace the protected Reader with PDF.js, a native PDF embed, a source download shortcut, selectable OCR text, or an absolute screenshot-prevention claim.

## Phase 8 priorities

1. **Production deployment hardening**
   - package Poppler, OCR language data, and required image tools in the deployment image;
   - require Redis, PostgreSQL, MinIO/object storage, staff-source HMAC secret, and production-safe cookie settings;
   - exercise backup/restore and secret rotation.

2. **Watermark and audit operations**
   - decide whether production needs HMAC/signed watermark traces and key rotation beyond the current distinct opaque fingerprint;
   - define Reader-access event retention, aggregation, deletion, and incident trace-resolution procedures;
   - capacity-test page rendering, private base-cache sizing, audit volume, and detector thresholds.

3. **Browser, accessibility, and visual release QA**
   - run real-browser network inspection confirming no Reader source PDF/object key/OCR text and no personalized service-worker cache;
   - complete keyboard, screen-reader, compact-width, focus, contrast, and long-content testing across catalogue, viewer, Admin users/reports/settings, taxonomy, and notifications;
   - validate Vietnamese content/font rendering and watermark readability on representative PDFs.

4. **Security and abuse exercises**
   - test burst enumeration, parallel sessions, repeated invalid pages, Redis interruption, storage/render failure, alert deduplication, and recovery in a production-like environment;
   - document operator response for trace lookup, rate-limit false positives, account deactivation, and compromised staff-source access.

5. **Release/demo operations**
   - prepare a deterministic demo dataset and script using the Phase 7 seed scenarios;
   - capture production observability, runbooks, release checklist, and rollback criteria;
   - verify CSV download behavior through the deployed same-site/session topology.

## Explicit deferrals

- Absolute screenshot/camera prevention remains impossible and is not a goal.
- Asynchronous report-export jobs remain unnecessary until bounded synchronous CSV is proven insufficient.
- Full-text search, advanced taxonomy duplicate-review UI, and other new breadth require separate prioritization; they are not Phase 7 defects.
- Production watermark signing is a hardening decision, not a reason to misreport the current unsigned capability.

## Entry gate

Begin Phase 8 only from the verified Phase 7 closure commit, with generated contracts clean, migrations current, seed idempotent, root lint/unit/build/e2e/worker gates green, and no unresolved architect blocker.
