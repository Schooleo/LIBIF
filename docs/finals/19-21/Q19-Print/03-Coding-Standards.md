# BẢN IN NỘP KÈM — CẤU HÌNH CODING STANDARDS VÀ QUALITY GATE (DÙNG CHUNG CÂU 19–20)

## 1. Phạm vi và trạng thái bằng chứng

Đây là cấu hình thực tế đang được version-control trong repository. CI áp dụng lint/build/test theo workspace; mọi secret và dữ liệu thật bị loại khỏi bản in. Repository không có formatter hoặc coverage threshold riêng được ghi nhận, nên không tuyên bố hai gate đó đã được cấu hình.

| Hạng mục | Cấu hình thực tế | Trạng thái |
|---|---|---|
| ESLint | `eslint.config.mjs` dùng `typescript-eslint`; ignore `node_modules`, `dist`, `.next`, `coverage` | Đã cấu hình |
| TypeScript | API/web build chạy trong workspace scripts | Đã cấu hình |
| API lint | `eslint "src/**/*.ts" "test/**/*.ts" "prisma/**/*.ts" "prisma.config.ts"` | Đã cấu hình |
| Web lint | `eslint "app/**/*.{ts,tsx}" "components/**/*.{ts,tsx}" "lib/**/*.ts"` | Đã cấu hình |
| Unit/component test | Jest cho API; Vitest cho web | Đã cấu hình |
| Formatter/coverage threshold | Không tìm thấy config threshold chính thức trong repository | Chưa chứng minh |

## 2. Nội dung cấu hình ESLint

```js
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '.next/**', 'coverage/**'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
);
```

Ý nghĩa quản lý: cấu hình dùng chung giúp các workspace có cùng baseline; `no-unused-vars` là lỗi chặn lint, còn `no-explicit-any` được nới vì một số boundary hiện hữu cần kiểu linh hoạt. Đây là quyết định trade-off đã thể hiện trong code, không phải cam kết “mọi lỗi chất lượng đều được lint bắt”.

## 3. Các lệnh quality gate

```json
{
  "lint": "npm run lint --workspaces --if-present",
  "test": "npm run test --workspaces --if-present",
  "build": "npm run build --workspaces --if-present",
  "test:e2e": "npm run test:e2e -w apps/api",
  "test:worker": "npm run test:worker -w apps/api"
}
```

Makefile gom các gate thành:

```text
verify: lint test test-e2e test-worker build
```

CI tách API và web thành các job lint, build, test; API có thêm e2e và worker integration. Sprint 5 report ghi nhận các gate thực tế: 192 API tests, 96 web tests, 12 API e2e suites/73 tests, worker 5/5, lint và build đạt ở mốc PR #34.

## 4. Quy tắc review liên quan

1. Không merge code nếu quality gate tương ứng thất bại.
2. Thay đổi phải gắn với PBI/PR và có người khác xem xét.
3. Code nhạy cảm về authorization, source-file, watermark, audit và concurrency phải có test negative hoặc evidence phù hợp.
4. Không đưa secret, token, dữ liệu cá nhân hay PDF có bản quyền vào evidence.
5. Khi phát hiện gap, ghi rõ là gap và đưa vào backlog/hardening; không sửa trạng thái thành Done hồi tố.

**Giới hạn:** repository có lịch sử PR và CI, nhưng không có biên bản review chính thức hoặc persisted review discussion cho mọi PR. Vì vậy tài liệu này chứng minh cấu hình và pipeline, không tự thay thế biên bản thanh tra mã nguồn.

## Nguồn bằng chứng

- `eslint.config.mjs`
- `package.json`, `apps/api/package.json`, `apps/web/package.json`
- `Makefile`
- `.github/workflows/api-ci.yml`, `.github/workflows/web-ci.yml`
- `ai_artifacts/sprints/sprint-2026-07-24.md`
