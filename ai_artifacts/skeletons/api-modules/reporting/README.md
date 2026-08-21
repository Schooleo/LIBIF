# API Skeleton: Reporting Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Future runtime files:

- `apps/api/src/modules/reporting/reporting.module.ts`
- `apps/api/src/modules/reporting/reporting.controller.ts`
- `apps/api/src/modules/reporting/reporting.service.ts`
- `apps/api/src/modules/reporting/dto/dashboard-summary.dto.ts`
- `apps/api/src/modules/reporting/dto/report-query.dto.ts`
- `apps/api/src/modules/reporting/reporting.service.spec.ts`
- `apps/api/test/reporting.e2e-spec.ts`

Primary endpoints:

- `GET /api/admin/dashboard/librarian?from&to`
- `GET /api/admin/dashboard/management?from&to`
- `GET /api/admin/reports/documents.csv?from&to`
- `GET /api/admin/reports/users.csv?from&to`
- `GET /api/admin/reports/activity.csv?from&to`
- `GET /api/admin/reports/reader-access.csv?from&to&risk`

Wave 5 status: all backend routes above are live with bounded UTC ranges, deterministic ordering, fixed headers, formula-neutralized CSV, safe projections, and Admin authorization where required. Generated-client/web integration remains deferred to D7-005.
