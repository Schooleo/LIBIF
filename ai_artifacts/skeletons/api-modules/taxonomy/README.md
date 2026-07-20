# API Skeleton: Taxonomy Module

Owner: Member D — Admin Operations, Reporting, Settings, and Integration

Future runtime files:

- `apps/api/src/modules/taxonomy/taxonomy.module.ts`
- `apps/api/src/modules/taxonomy/categories.controller.ts`
- `apps/api/src/modules/taxonomy/tags.controller.ts`
- `apps/api/src/modules/taxonomy/taxonomy.service.ts`
- `apps/api/src/modules/taxonomy/dto/category.dto.ts`
- `apps/api/src/modules/taxonomy/dto/tag.dto.ts`
- `apps/api/src/modules/taxonomy/taxonomy.service.spec.ts`
- `apps/api/test/taxonomy.e2e-spec.ts`

Primary endpoints:

- `GET /taxonomy/categories`
- `POST /taxonomy/categories`
- `PATCH /taxonomy/categories/:id`
- `DELETE /taxonomy/categories/:id`
- `GET /taxonomy/tags`
- `POST /taxonomy/tags`
- `PATCH /taxonomy/tags/:id`
- `POST /taxonomy/tags/:id/merge`
