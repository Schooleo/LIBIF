# Phase 7 Wave 5 — Member B Bulk-Action Preflight Decision & Scope Boundary

Date: 2026-07-23  
Owner: Member B — Document, Upload, and Catalog Management  
Task ID: `B7-005` (Weight: S=1)

## Executive Summary

Phase 7 Wave 5 prioritizes completing single-record risky taxonomy operations (category reassignment & deletion, tag duplicate detection & merging) with atomic database transactions and responsive UI reconciliation.

As mandated by Task `B7-005`, this document details the **Safe Bulk-Action Preflight Architecture** for bounded metadata-only operations and records the explicit **Phase 8 Deferral** for complex multi-record content mutations.

---

## Bounded Metadata Bulk-Action Preflight Rules

For any future or metadata-only bulk taxonomy operations (e.g., bulk tagging or bulk category re-assignment across multiple documents), the following preflight validation rules must be enforced:

1. **Max Batch Bounds**: Bulk operations must be capped at a maximum of **50 items per payload** to prevent database lock contention and long-running HTTP requests.
2. **Atomic Transaction Scope**: All mutations must run inside a single Prisma `$transaction`. If any item fail validation (e.g. invalid target category ID or non-existent document ID), the entire batch must abort and roll back.
3. **Role & Permission Preflight**: Only authenticated users with `ADMIN` role can execute bulk taxonomy reassignments. `LIBRARIAN` users are restricted to standard single-document intake forms.
4. **Metadata-Only Enforcement**: Bulk operations must only modify metadata foreign keys (`categoryId`, `BookTag` mappings). They must never touch document binary objects (`BookFile`), OCR artifacts, or processing states.
5. **Durable Audit Event**: Each bulk action must record an immutable audit fact with the actor ID, target item count, and previous/new taxonomy IDs.

---

## Explicit Phase 8 Deferral Decision

- **Implemented in Phase 7**:
  - Single-category deletion with zero documents/subcategories.
  - Single-category deletion with atomic document and subcategory reassignment (`reassign-and-delete`).
  - Single-tag deletion with atomic document detachment.
  - Single-tag merge (`sourceTagId` into `targetTagId`) with deduplicated document association transfer.
- **Deferred to Phase 8**:
  - Arbitrary multi-document checkbox selection and batch editing UI controls across search result tables.
  - Bulk processing requeue / bulk document publication workflows.

**Rationale**:
Deferring multi-document checkbox UI controls to Phase 8 keeps Phase 7 focused on P0 Reader POC stability and core Admin taxonomy safety without risking contract drift or UI regression across catalogue and search views.
