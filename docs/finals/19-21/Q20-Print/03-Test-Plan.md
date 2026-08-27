# BẢN IN NỘP KÈM — KẾ HOẠCH KIỂM THỬ TỔNG THỂ LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| ID / phiên bản | `LIBIF-TP-1.0` |
| Test basis | Product Backlog, SOW, Architecture, QMP và DoD trong bộ tài liệu câu 19–20 |
| SUT baseline | `dev@82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34, 24/07/2026 |
| Môi trường | CI Node 22; local Docker Compose với PostgreSQL, Redis, MinIO; API/web/worker |
| Người phụ trách/phê duyệt | Nhóm LIBIF; chưa ghi nhận test lead/approver chính thức |
| Test window | Sprint 1–5; mốc evidence gần nhất 24/07/2026 |
| Trạng thái | Kế hoạch đã hoàn thiện; execution/UAT report còn incomplete |

## 1. Mục tiêu và phạm vi

Mục tiêu là xác minh PBI-01…PBI-16 và AC-01…AC-08 theo rủi ro, cung cấp bằng chứng cho quyết định phát hành. Kế hoạch không chứng minh phần mềm “không có lỗi”.

| Hạng mục | Trong phạm vi | Ngoài phạm vi hoặc chưa có evidence |
|---|---|---|
| Web/API | upload, OCR, review, approval, catalogue, search, Reader, audit | full production traffic |
| Services/data | PostgreSQL, Redis/BullMQ, MinIO, worker/OCR, migrations/seed | HA/DR, backup/restore production |
| Security | authn/authz, source denial, upload, watermark, audit, rate/concurrency, fail-closed | pentest/certification thương mại |
| Compatibility | automated UI/accessibility và live smoke đã ghi | full real-browser/compact-width/Vietnamese-font matrix |

## 2. Test basis và oracle

| Basis | Cách dùng |
|---|---|
| [`LIBIF-Product-Backlog.md`](../../../markdowns-vi-v2/LIBIF-Product-Backlog.md) | PBI, priority, dependency |
| [`LIBIF-Statement-Of-Work.md`](../../../markdowns-vi-v2/LIBIF-Statement-Of-Work.md) | AC-01…AC-08 và boundary prototype |
| [`LIBIF-Architecture.md`](../../../markdowns-vi-v2/LIBIF-Architecture.md) | API/data/security/processing expectations |
| QMP/DoD | Quality objectives, gates và evidence cần lưu |
| Sprint reports/PBI traceability | Đối chiếu execution thực tế và gap; không thay thế acceptance |

Expected result phải đến từ AC, state transition, access matrix, ground truth hoặc oracle được ghi trước; không sửa oracle theo actual result.

## 3. Chiến lược dựa trên rủi ro

| Risk | Dạng thất bại | Kiểm thử | Mức độ evidence hiện tại |
|---|---|---|---|
| TR-01 | Sai authorization làm lộ sách | positive/negative/object-level access | Có security/e2e evidence |
| TR-02 | Lưu trữ/crypto xử lý sai | storage, tamper, secret/source inspection | Có privacy/security evidence; chưa có production key-rotation |
| TR-03 | Race condition vượt concurrent limit | N và N+1 concurrent requests | Có Redis controls/tests; capacity boundary chưa đủ |
| TR-04 | OCR sai nhưng được publish | worker, retry, review-before-publish, ground truth | Có worker scenarios; chưa có UAT/accuracy benchmark đầy đủ |
| TR-05 | Search sai hoặc chậm | relevance + raw timings/percentiles | Có live smoke; p95 chưa ghi |
| TR-06/07 | Source URL/audit/watermark sai | DOM/network/direct-object/action-to-log checks | Có gate evidence |
| TR-08 | Fresh install thất bại | clean Compose/README rehearsal | Có local Compose/Docker smoke; production chưa chứng minh |

## 4. Levels, types và techniques

| Level/type | Kỹ thuật/công cụ | Evidence đã ghi nhận |
|---|---|---|
| Static | ESLint, TypeScript build, review/checklist | Root lint/build passed ở Sprint 5 |
| Unit/component | Jest API, Vitest web, boundary/decision cases | 192 API tests, 96 web tests ở mốc hardening |
| Integration | DB/Redis/MinIO/OCR/API contracts | Worker integration 5/5; e2e 12 suites/73 tests |
| E2E/regression | business journey, access, Reader, catalogue | Có API e2e và live smoke |
| Security | misuse/negative cases, source denial, fail-closed | Có cross-workstream security gate |
| Performance | workload/boundary, raw timing/percentile | Chưa có báo cáo p95/capacity hoàn chỉnh |
| UAT | manual business scenarios | Chưa có customer/proxy-user record |

## 5. Traceability matrix tối thiểu

| AC | Risk | Test/evidence | Trạng thái |
|---|---|---|---|
| AC-01 | TR-04 | worker/OCR/approval evidence; Sprint 4–5 | Có evidence kỹ thuật; UAT chưa có |
| AC-02 | TR-01/02 | authz, private storage, source boundary | Có evidence; PBI acceptance chưa ký |
| AC-03 | TR-03 | Redis concurrency tests | Có evidence; capacity test còn thiếu |
| AC-04 | TR-05 | catalogue/content search smoke | Có smoke; p95 chưa ghi |
| AC-05 | — | canvas Reader/accessibility tests | Có automated evidence; browser matrix thiếu |
| AC-06 | TR-06/07 | watermark, audit, source denial | Có security gate |
| AC-07 | all | test counts, regression/security gates | Có gate; defect register đầy đủ chưa có |
| AC-08 | TR-08 | local Compose, Docker smoke | Có local evidence; production runbook thiếu |

## 6. Dữ liệu và môi trường

| Thành phần | Baseline thực tế | Ghi chú |
|---|---|---|
| Runtime | Node 22 trong CI; root yêu cầu Node >=20.19.0 | packageManager `npm@11.6.2` |
| Services | PostgreSQL, Redis, MinIO, API, web, worker | Docker Compose/local CI |
| Test data | seed PDFs, embedded-text, scanned Vietnamese, corrupt PDF fixtures | Không dùng secret/PII trong evidence |
| Browser | UI component/accessibility tests và live smoke | Full browser/version/viewport matrix chưa được ghi |
| Config | `.env.example`/Compose; secret values redacted | Không in secret thật |

## 7. Entry, exit, suspend/resume

### Entry criteria

- Test basis, build, environment và test data được định danh.
- Smoke test đạt và critical dependency sẵn sàng.
- Case có expected result/oracle và reviewer.

### Exit criteria đề xuất

- 100% Must-have AC đã thực hiện và đạt.
- High/Critical còn mở bằng 0; residual risk được PO chấp nhận bằng văn bản.
- Regression, security subset và fresh install đạt.
- Test Report, RTM, defect export và raw evidence hoàn tất.

### Suspend/resume

Suspend khi build không testable, môi trường/data sai baseline hoặc smoke fail. Resume khi root cause được sửa, build mới có định danh và smoke đạt; phải ghi rõ test chạy lại.

## 8. Quản lý lỗi và báo cáo

Mỗi defect cần mã, title, build/env/data, precondition, steps, expected/actual, evidence, reproducibility, severity, priority, owner, status, linked PBI/test, fix SHA và retest result. GitHub repository hiện không có Issues; do đó chưa có defect export thực tế để điền vào Test Report.

Triage phải tách **severity** (mức ảnh hưởng) khỏi **priority** (thứ tự xử lý). Không dùng riêng pass rate để kết luận; phải xem coverage, risk, blocked/skipped và lỗi còn mở.

## 9. Phương pháp hình thành và đánh giá

`Test basis → risk analysis → scope/level/type → environment/data/oracle → entry/exit → execute/triage/retest → report/residual risk`

Kế hoạch được hình thành bằng cách bắt đầu từ AC và risk, sau đó chọn test level/technique, người phụ trách, evidence và tiêu chí kết thúc. Đánh giá cuối phải so sánh kế hoạch với thực tế; baseline hiện tại có execution kỹ thuật đáng kể nhưng chưa đủ UAT, p95, browser matrix, defect log và production hardening để gọi là hoàn tất phát hành.

