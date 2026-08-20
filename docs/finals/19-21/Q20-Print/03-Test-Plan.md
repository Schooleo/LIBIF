# MASTER TEST PLAN — LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| ID / Version | `LIBIF-TP-[ ]` / `[ ]` |
| Test basis baseline | Backlog `[ ]`; SOW `[ ]`; Architecture `[ ]`; QMP `[ ]` |
| SUT build | Release/tag `[ ]`; commit `[ ]`; image digest `[ ]` |
| Owner / Approver | `[ ]` / `[ ]` |
| Test window | `[start]` – `[end]` |

## 1. Mục tiêu và phạm vi

- Xác minh PBI-01…16 và AC-01…08 theo risk.
- Cung cấp bằng chứng đủ cho quyết định release, không nhằm chứng minh phần mềm “không có lỗi”.

| Test item | In scope | Out of scope/rationale |
|---|---|---|
| Web UI/API | upload, review/catalog, publish, search, reader, audit | `[ ]` |
| Services/data | OCR, PostgreSQL, Redis concurrency, MinIO encrypted object | production HA/DR |
| Security | authn/authz, object access, upload, secrets, crypto use, original-URL exposure, audit | professional pentest/certification |
| Compatibility | `[browser/version/viewport]` | `[ ]` |

## 2. Test basis và assumptions

| Basis ID | Version/link | Test implications | Gap/decision |
|---|---|---|---|
| PBI/AC | | | |
| Architecture/API/schema | | | |
| QMP/DoD | | | |
| Risk register | | | |
| OWASP ASVS subset | | | |

## 3. Risk-based strategy

Điểm risk đề xuất: `Likelihood (1–5) × Impact (1–5)`. Nhóm chốt ngưỡng ưu tiên và ghi rationale.

| Risk ID | Failure mode | L | I | Score | Test response | Level/type | Owner |
|---|---|---:|---:|---:|---|---|---|
| TR-01 | Sai authorization làm lộ sách | | | | positive/negative/object-level access | integration/security | |
| TR-02 | Key/nonce/crypto xử lý sai hoặc file lưu plaintext | | | | storage inspection, decrypt/tamper cases | integration/security | |
| TR-03 | Race condition vượt hạn mức đọc | | | | concurrent requests at N/N+1 | integration/performance | |
| TR-04 | OCR sai nhưng được xuất bản | | | | golden dataset + human approval workflow | functional/data | |
| TR-05 | Search sai trang hoặc p95 ≥ 2s | | | | relevance + timed dataset | integration/performance | |
| TR-06 | Original file URL bị lộ | | | | DOM/network/direct-object checks | security | |
| TR-07 | Audit thiếu/sai/tiết lộ nhạy cảm | | | | action-to-log reconciliation | integration/security | |
| TR-08 | Fresh install thất bại | | | | clean environment rehearsal | portability | |

## 4. Test levels, types và techniques

| Level/type | Mục tiêu | Technique | Automation/tool | Exit evidence |
|---|---|---|---|---|
| Static review | lỗi requirement/design/code sớm | checklist/inspection | ESLint/type-check/manual | log/minutes |
| Unit | branch/business logic cô lập | equivalence/boundary/decision | Jest `[verify]` | JUnit/console/coverage |
| Integration | DB/Redis/MinIO/OCR/API contracts | state transition/error guessing | `[ ]` | report/log |
| E2E | critical user journeys | scenario/decision table | `[ ]` | run/video/screenshot |
| Security | threat/control verification | misuse/negative cases + ASVS subset | `[ ]` | checklist/results |
| Performance | search/concurrency/OCR timing | workload/boundary | `[ ]` | raw timings/percentiles |
| UAT | fitness for librarian/reader | business scenario | manual | signed feedback |

## 5. Traceability matrix (RTM)

| PBI/AC | Risk | Test case IDs | Execution IDs | Defect IDs | Final status/evidence |
|---|---|---|---|---|---|
| AC-01 | TR-04 | | | | |
| AC-02 | TR-01/02 | | | | |
| AC-03 | TR-03 | | | | |
| AC-04 | TR-05 | | | | |
| AC-05 | | | | | |
| AC-06 | TR-06/07 | | | | |
| AC-07 | all | | | | |
| AC-08 | TR-08 | | | | |

## 6. Test environment và configuration

| Thành phần | Version/config | Endpoint/resource | Evidence |
|---|---|---|---|
| OS/CPU/RAM | | | |
| Browser | | | |
| Node/package lock | | | |
| App containers | | | |
| PostgreSQL/Redis/MinIO/Tesseract | | | |
| Feature flags/secrets source | redacted | | |

Mọi execution record phải đủ: build/commit, environment ID, test data version, time, executor và tool version.

## 7. Test data

| Dataset ID/version | Nội dung | Expected oracle | Quyền sử dụng/privacy | Reset/cleanup |
|---|---|---|---|---|
| OCR-GOLD-[ ] | tài liệu tiếng Việt 300 DPI + ground truth | CER/WER hoặc field accuracy | | |
| RBAC-[ ] | users/roles/books | access matrix | synthetic | |
| SEARCH-[ ] | indexed pages/queries | expected book/page | | |
| LOAD-[ ] | sessions N/N+1 | allowed/blocked count | synthetic | |

Không dùng dữ liệu cá nhân thật nếu không cần; ảnh evidence phải che token, secret, full IP và nội dung có bản quyền.

## 8. Entry, exit, suspension và resumption criteria

### Entry

- [ ] Test basis reviewed; build deployable; environment/data versioned.
- [ ] Smoke test pass; critical dependency available; cases reviewed.

### Exit (baseline đề xuất cần duyệt)

- [ ] 100% Must-have AC executed và pass.
- [ ] Planned high-risk tests executed; Critical/High open = 0.
- [ ] Regression, security subset và AC-08 fresh install pass.
- [ ] Mọi remaining defect/risk được PO chấp nhận bằng văn bản.
- [ ] Test Report + RTM + evidence archive hoàn tất.

### Suspension / resumption

Suspend khi build không testable, environment/data sai baseline, smoke fail, hoặc blocker làm kết quả mất tin cậy. Resume khi root cause được sửa, build mới định danh và smoke pass; ghi phần test cần chạy lại.

## 9. Defect management

- Severity: Critical (lộ dữ liệu/mất toàn bộ luồng), High (Must feature hỏng/không workaround), Medium (ảnh hưởng có workaround), Low (nhỏ/cosmetic). Nhóm phải phê duyệt định nghĩa cụ thể.
- Trường bắt buộc: ID, title, build/env, precondition/data, steps, expected, actual, evidence, reproducibility, severity, priority, owner, status, linked PBI/test, fix commit, retest result.
- Triage `[lịch]`; disagreement do `[vai trò]` quyết định; reopened defect giữ lịch sử.

## 10. Deliverables, lịch và trách nhiệm

| Deliverable/activity | Owner | Planned | Actual | Status/link |
|---|---|---|---|---|
| Plan/cases/data | | | | |
| Environment/smoke | | | | |
| Unit/integration/E2E/security/UAT | | | | |
| Defect triage/retest/regression | | | | |
| Test Report/archive | | | | |

## 11. Monitoring, control và reporting

Theo dõi: planned/executed/pass/fail/blocked; requirement/risk coverage; defects theo severity/status/age/reopen; automation stability; coverage trend. Không dùng “pass rate cao” một mình để kết luận chất lượng—phải đối chiếu risk, test coverage và open defects.

## 12. Phương pháp hình thành và đánh giá Test Plan (dùng khi vấn đáp)

1. Baseline test basis; tìm ambiguity/gap.
2. Xác định test items, constraints, stakeholders và quality objectives.
3. Product-risk analysis, ưu tiên phạm vi/levels/types/techniques.
4. Chọn environment, representative data và oracle.
5. Ước lượng effort/lịch/role; định nghĩa entry/exit/suspension.
6. Review traceability và feasibility; pilot smoke/high-risk cases.
7. Trong thực thi: monitoring/control, triage/retest/regression và versioning.
8. Đánh giá cuối bằng exit criteria, RTM completeness, defect/residual-risk analysis và stakeholder approval.

## 13. Phê duyệt

| Vai trò | Họ tên | Quyết định | Ngày | Link/chữ ký |
|---|---|---|---|---|
| QA/Test Lead | | | | |
| Tech Lead | | | | |
| PO | | | | |

