# LIBIF Agent Guide

This guide is the onboarding and execution contract for future coding agents and new team members working on LIBIF. It explains where the project artifacts live, how to use the design references, and how to continue implementation without reintroducing one-off UI, duplicated architecture, or stale assumptions.

## 1. Canonical artifact locations

All AI-produced planning and design-reference artifacts are centralized under `ai_artifacts/`.

| Path | Purpose |
|---|---|
| `ai_artifacts/prompts/Agent_Prompt.md` | This guide; read it before planning or implementation work. |
| `ai_artifacts/docs/stitch-screen-index.md` | Inventory of the Stitch design export and reference artifacts. |
| `ai_artifacts/docs/screen-matrix.md` | Screen-to-route/workflow/module mapping. |
| `ai_artifacts/docs/architecture-alignment.md` | Current architecture, gaps, module boundaries, and migration strategy. |
| `ai_artifacts/docs/ui-decisions.md` | Canonical visual, terminology, status, responsive, and component decisions. |
| `ai_artifacts/docs/component-inventory.md` | Shared component contracts and current implementation inventory. |
| `ai_artifacts/docs/workflow-state-machines.md` | Workflow states, commands, events, permissions, and response expectations. |
| `ai_artifacts/docs/api-contracts.md` | Current and target API/OpenAPI contract notes by batch. |
| `ai_artifacts/plans/` | Approved execution plans by phase. |
| `ai_artifacts/stitch_design/` | Read-only Stitch screenshots, generated HTML, and reference design notes. |

Root `docs/` contains original source/product PDFs. Do not put new AI working docs there unless a human explicitly asks for product-facing documentation in that location.

## 2. How to use the Stitch export

Treat `ai_artifacts/stitch_design/` as a read-only reference library.

- Screenshot output is the primary visual reference.
- `code.html` is secondary and useful for structure, copy, and asset hints.
- `DESIGN.md` reference folders provide product/design-language guidance, not routes.
- Generated Tailwind classes, CDN imports, page-local styles, and repeated markup are not production architecture.
- Do not edit, move, rename, or delete files inside `ai_artifacts/stitch_design/`.
- Do not copy whole generated pages into application routes.
- Do not re-litigate screen counts during normal feature work. Use `stitch-screen-index.md` and `screen-matrix.md` as the source of truth unless files are added, removed, or renamed.

## 3. Current implementation baseline

The repository is a TypeScript monorepo with:

- `apps/web`: Next.js App Router application.
- `apps/api`: NestJS modular monolith.
- `packages/shared`: shared TypeScript DTO/types package.
- PostgreSQL via Prisma.
- S3/MinIO-compatible object storage.
- Redis/BullMQ queue infrastructure.

Phase 1 foundations are already in place in `apps/web`:

- Tailwind/PostCSS setup via `apps/web/postcss.config.mjs` and `apps/web/app/globals.css`.
- Semantic tokens/base/component CSS in `apps/web/styles/`.
- Shared UI primitives under `apps/web/components/ui/`.
- Layout primitives under `apps/web/components/layout/`.
- Domain foundations under `apps/web/components/domain/`.
- A non-routed component catalogue at `apps/web/components/catalogue/ComponentCatalogue.tsx`.
- Component/accessibility tests under `apps/web/tests/`.

Do not rebuild these foundations from scratch. Extend them when a later batch needs a missing variant or domain-specific component.

## 4. Non-negotiable architecture rules

### Application architecture

- Keep LIBIF as an integrated enterprise web application with Reader Portal and Librarian/Admin experiences.
- Keep one NestJS backend application and one coordinated deployment boundary.
- Keep one physical PostgreSQL database.
- Preserve module boundaries through services, DTOs, repositories, policies, and internal events.
- Do not split admin, reader, processing, reporting, or upload into separate backend services without an approved architecture plan.

### Frontend

- Use Next.js, React, TypeScript, and the App Router.
- Use React Server Components by default; add Client Components only for browser-only interaction/state/effects.
- Use shared components and semantic tokens; do not create page-local button/input/dialog/table/card/status implementations.
- Do not use Tailwind CDN or runtime CSS imports.
- Do not use raw design hex values in consumers; tokens belong in `apps/web/styles/tokens.css`.
- Do not scatter raw `fetch` calls through page components once typed API-client work begins.

### Backend and integrations

- Use NestJS REST APIs for browser-facing communication.
- Keep business rules in backend modules, not React components.
- Do not let Next.js access PostgreSQL, S3/MinIO, Redis, BullMQ, or Tesseract directly.
- Use private object storage; the frontend must never receive storage credentials.
- Protected reading must go through authorized API access grants/presigned URLs with short lifetimes.
- Long-running work uses asynchronous acceptance plus status queries, not blocking HTTP requests.

## 5. Canonical product and design decisions

Use **LIBIF** as the product brand everywhere.

Workspace labels:

- Reader Portal
- Librarian Workspace
- Administration
- Management Analytics

Core visual decisions live in `ai_artifacts/docs/ui-decisions.md`. Current foundations include:

- Be Vietnam Pro typography loaded through `next/font/google`.
- Semantic color, spacing, radius, border, elevation, breakpoint, motion, z-index, and focus tokens.
- 8px base spacing rhythm.
- 8px controls, 12px panels/dialogs, 4px tags/checkboxes.
- Border-only static cards.
- Shared overlay shadow for dialogs, drawers, menus, and popovers.
- One H1 per route and ordered H2/H3 hierarchy.
- Status text plus icon/shape; never color-only.

## 6. Documentation maintenance rules

Before implementing a phase or batch, read the relevant docs in this order:

1. `Agent_Prompt.md`
2. The approved plan in `ai_artifacts/plans/`
3. `architecture-alignment.md`
4. `screen-matrix.md`
5. `component-inventory.md`
6. `ui-decisions.md`
7. `workflow-state-machines.md` and `api-contracts.md` when contracts or workflows are touched

When implementation changes decisions or contracts:

- Update the smallest relevant document section.
- Prefer replacing stale text over appending contradictory notes.
- Avoid repeating the same audit caveat in multiple docs.
- Keep screen-count/inventory details in `stitch-screen-index.md` only.
- Keep route/workflow/module mappings in `screen-matrix.md` only.
- Keep visual/token/status decisions in `ui-decisions.md` only.
- Keep component APIs and implementation paths in `component-inventory.md` only.
- Keep API shape details in `api-contracts.md` only.

## 7. Phase and batch workflow

Work architecture-first and component-first.

For every phase or feature batch:

1. Confirm scope from the approved plan and screen matrix.
2. Inspect only the relevant Stitch folders for the current batch.
3. Confirm required shared primitives/domain components already exist; extend them before composing routes.
4. Define or verify typed view models, DTOs, API contracts, permissions, and workflow states before integration.
5. Compose routes from shared components.
6. Keep loading, empty, error, success, permission, filtered, and responsive states in the same route model where they represent one workflow.
7. Update docs as part of the batch, not afterward as a separate cleanup.
8. Stop and report at the end of the phase/batch; do not automatically start the next one.

## 8. Implementation batches

Use the batch assignments in `screen-matrix.md` as the source of truth.

1. Authentication and access.
2. Reader discovery and personal library.
3. Documents, upload, ISBN, and metadata.
4. Processing queue and jobs.
5. Approval, correction, and notifications.
6. Taxonomy, tags, users, and risky actions.
7. Dashboards, reports, export, and settings.
8. Cross-screen integration and hardening.

Phase 2 is the next foundation phase after Phase 1: role-aware shells, route groups, authentication/authorization boundary representation, and typed API-client/OpenAPI alignment.

## 9. Accessibility and interaction requirements

- Exactly one H1 per route.
- Every form control has a visible label or explicit accessible name.
- Icon-only actions require accessible names.
- Buttons have explicit `type`.
- Dialogs/drawers support focus entry, tab containment, Escape handling where safe, restore focus, and background scroll lock.
- Menus, tabs, trees, tables, drawers, and steppers support keyboard operation.
- Errors use `aria-invalid`, `aria-describedby`, and suitable live regions.
- Status is never communicated by color alone.
- Progress uses semantic progressbar attributes.
- Meet WCAG AA contrast and visible-focus requirements.

## 10. Quality gates

A phase or batch is not complete while it contains:

- horizontal overflow or clipped content,
- placeholder navigation,
- duplicated shared-component implementations,
- direct Next.js access to PostgreSQL, S3/MinIO, Redis, BullMQ, or Tesseract,
- duplicated backend business rules in React,
- invalid or undefined design tokens,
- raw design hex values outside token/config/reference files,
- inaccessible controls,
- console/debug statements,
- failed frontend or backend tests,
- failed web or API production builds,
- untracked mock data that is not documented behind a service interface,
- undocumented architecture deviations.

Run the smallest useful verification for the change, then broaden as risk increases. Standard implementation batches should include lint, tests, production build, targeted accessibility checks, and any relevant API/e2e checks.

## 11. Required completion report

After every phase or batch, report:

1. Phase or batch completed.
2. Stitch folders/screens inspected.
3. Routes and workflow states implemented.
4. Backend modules/controllers/DTOs/policies/events changed.
5. REST/OpenAPI contracts added or changed.
6. Shared components reused.
7. New shared components introduced.
8. Internal events, queues, workers, or object-storage integrations affected.
9. Design inconsistencies resolved.
10. Intentional deviations from Stitch and rationale.
11. Responsive checks completed.
12. Accessibility checks completed.
13. Frontend test/build results.
14. Backend test/build results.
15. Mocked integrations still present.
16. Remaining issues and readiness for the next phase or batch.
