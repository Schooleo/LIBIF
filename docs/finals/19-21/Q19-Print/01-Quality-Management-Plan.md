# SOFTWARE QUALITY MANAGEMENT PLAN — LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Document ID / Version | `LIBIF-QMP-[...]` / `[x.y]` |
| Product baseline | Release/tag `[ ]`, commit SHA `[ ]` |
| Owner / Approver | `[QA owner]` / `[PO + Tech Lead]` |
| Ngày hiệu lực / kỳ rà soát | `[ ]` / `[mỗi Sprint Review hoặc khi scope/risk đổi]` |
| Trạng thái | Draft / Reviewed / Approved / Superseded |

### Lịch sử thay đổi

| Version | Ngày | Người sửa | Nội dung | Người duyệt |
|---|---|---|---|---|
| | | | | |

## 1. Mục đích, phạm vi và đối tượng chất lượng

Mục đích: mô tả cách nhóm lập kế hoạch, bảo đảm (QA), kiểm soát (QC), đo lường và cải tiến chất lượng cho LIBIF.

| Entity | Trong phạm vi | Ngoài phạm vi |
|---|---|---|
| Product | PBI-01…16, AC-01…08, dữ liệu OCR/catalog, API/UI | Production HA/DR, pentest thương mại, cam kết chống sao chép tuyệt đối |
| Process | Scrum 5 Sprint, review, test, defect/change/configuration management | `[ ]` |
| Project | chất lượng deliverable, evidence, lịch và trách nhiệm | `[ ]` |
| Environment | local/CI/staging, Docker, test data | production 24/7 |

## 2. Tài liệu đầu vào và traceability

| Input | Baseline/version | Cách sử dụng | Owner |
|---|---|---|---|
| Project Vision & Scope | `[ ]` | stakeholder needs, in/out scope | PO |
| Product Backlog | `[ ]` | PBI và acceptance criteria | PO |
| Architecture | `[ ]` | quality attributes, components, technology | Tech Lead |
| SOW | `[ ]` | AC-01…08 và giới hạn | PM |
| Project Plan/Risk/Monitoring | `[ ]` | process, DoD, risk, metric | PM/QA |

## 3. Chính sách và mục tiêu chất lượng

> Mỗi mục tiêu phải có công thức, nguồn dữ liệu, tần suất, owner và ngưỡng. Các ngưỡng dưới đây là `PROPOSED`, chỉ thành baseline sau khi nhóm duyệt.

| ID | Đặc tính | Mục tiêu đo được | Phương pháp/nguồn | Ngưỡng đề xuất | Owner |
|---|---|---|---|---|---|
| QO-01 | Functional suitability | Must-have AC được pass | passed Must AC / executed Must AC | 100% trước release | QA/PO |
| QO-02 | Reliability | Không còn defect Critical; luồng chính không có blocker | defect tracker + regression | Critical open = 0 | QA |
| QO-03 | Performance efficiency | Search PBI-10 trên dataset baseline | p95 từ test log | < 2 giây | Backend/QA |
| QO-04 | Security | RBAC, object authorization, secret, encrypted storage, audit được kiểm chứng | security checklist/test | 100% control bắt buộc pass; Critical/High open = 0 | Security/QA |
| QO-05 | Maintainability | Code thay đổi đạt lint/type-check/review/test | CI + PR | 100% PR merge pass gate | Tech Lead |
| QO-06 | Data/content quality | Nội dung trước xuất bản được thủ thư đối soát | sampled records + approval log | 100% trang của tài liệu demo được duyệt; ghi riêng OCR raw accuracy | PO/QA |
| QO-07 | Usability | Đại diện người dùng hoàn thành kịch bản UAT | completed/attempted + feedback | `[nhóm duyệt]` | PO |
| QO-08 | Portability | Fresh install theo README/Docker Compose | clean-machine log | pass AC-08 | DevOps |

Lưu ý: “100% nội dung đã duyệt” không đồng nghĩa OCR tự động chính xác 100%; phải báo cáo riêng độ chính xác OCR thô và kết quả sau human review.

## 4. Tiêu chuẩn, quy ước và quality gates

| Gate | Bắt buộc | Bằng chứng |
|---|---|---|
| Commit/PR | định dạng, branch rule, link PBI/issue | PR URL/export |
| Static quality | ESLint + TypeScript type-check + formatter check | config + CI log |
| Review | ít nhất 01 reviewer độc lập; security-sensitive code có Tech Lead | approval + inspection record |
| Tests | affected unit/integration tests pass | test output |
| Coverage | baseline theo module; không giảm ngoài exception được duyệt | coverage report |
| Security | không hard-code secret; authn/authz, crypto, upload, audit checklist | scan/review/test evidence |
| Acceptance | AC pass trên staging và PO quyết định | test/UAT/feedback record |
| Release | DoD + exit criteria + open-risk acceptance | signed release decision |

Exception phải ghi: ID, rule/gate, lý do, phạm vi, risk, approver, expiry và remediation issue.

## 5. Hoạt động QA (phòng ngừa)

| Hoạt động | Khi nào | Người thực hiện | Output |
|---|---|---|---|
| Review requirement/AC theo INVEST và testability | refinement | PO+QA+Dev | comment/change |
| Threat/risk review cho upload, auth, crypto, session, audit | đầu Sprint/thiết kế đổi | Tech Lead+QA | risk/test update |
| Coding standard/tool configuration | Sprint 1; khi stack đổi | Tech Lead | config versioned |
| Test design trước/đồng thời coding | mỗi PBI | QA+Dev | cases/automation |
| CI gates và branch protection | liên tục | DevOps | run log |
| Retrospective/CAPA | cuối Sprint | cả nhóm | action owner/due date |

## 6. Hoạt động QC (phát hiện)

| Hoạt động | Scope | Sampling/coverage | Output |
|---|---|---|---|
| Static analysis/type check | source changed | 100% changed source | log |
| Code inspection | PR/risk-sensitive module | 100% critical modules; `[quy tắc khác]` | minutes/findings |
| Unit/integration/E2E/UAT | theo Test Plan | risk-based + traceability | results/report |
| Defect triage/retest/regression | mọi defect | theo severity | issue history |
| Document review | deliverables | 01 author + 01 reviewer | checklist/approval |

## 7. Vai trò và RACI

| Hoạt động | PO | Tech Lead | Dev | QA/DevOps | Customer rep |
|---|---:|---:|---:|---:|---:|
| Chốt quality objective/AC | A | C | C | R | C |
| Coding standards/architecture | C | A/R | R | C | I |
| Test plan/execution/report | C | C | R | A/R | I |
| Acceptance/UAT | A/R | C | I | C | R/C |
| Release quality decision | A | R | C | R | C |

## 8. Quản lý defect, thay đổi và cấu hình

- Workflow: New → Triaged → In Progress → Ready for Retest → Closed; Reopened/Won't Fix/Duplicate phải có lý do.
- Severity mô tả impact; priority mô tả thứ tự xử lý—không trộn hai khái niệm.
- Mọi test result phải gắn build/commit, environment, dataset và tool version.
- Thay đổi mục tiêu/ngưỡng/scope phải qua change record và cập nhật QMP/Test Plan/RTM tương ứng.

## 9. Báo cáo, audit và cải tiến

| Nhịp | Chỉ số tối thiểu | Người nhận | Trigger hành động |
|---|---|---|---|
| PR/CI | lint/type/test/coverage | Dev/Tech Lead | gate fail chặn merge |
| Hằng tuần | test progress, defect theo severity/age, blocked risks | team/PM | lệch ngưỡng → owner/action |
| Sprint Review | PBI Done, escaped/reopened defects, feedback | stakeholders | backlog/CAPA |
| Release | exit criteria, residual risk, open defects | PO/giảng viên | go/no-go |

## 10. Phương pháp hình thành và đánh giá QMP (dùng khi vấn đáp)

1. Thu thập Vision/SOW/Backlog/Architecture/risk/constraint và yêu cầu đề thi.
2. Xác định entity cần quản lý: product, process, project, environment.
3. Chọn attribute theo rủi ro và ISO/IEC 25010; chuyển thành metric có công thức/nguồn/ngưỡng/owner.
4. Chọn preventive controls (QA), detective controls (QC), quality gates và evidence.
5. Review chéo bởi PO–Tech Lead–QA; kiểm tra SMART, feasibility và traceability.
6. Pilot qua Sprint đầu; đối chiếu dữ liệu thật, defect escape và feedback; điều chỉnh bằng version/change record.
7. Đánh giá cuối: coverage của requirement, mức đạt objective, trend defect, audit sample và stakeholder acceptance.

### Checklist phê duyệt QMP

- [ ] Scope nhất quán Vision/SOW/Backlog; ngoài phạm vi được ghi rõ.
- [ ] Mỗi objective đo được và có nguồn dữ liệu/owner/tần suất/ngưỡng.
- [ ] QA khác QC; có cả phòng ngừa và phát hiện.
- [ ] Gate có evidence, exception và escalation.
- [ ] Mapping tới Test Plan/DoD/inspection/feedback đầy đủ.
- [ ] Reviewer ghi finding; finding đã đóng hoặc chấp nhận risk.

## 11. Phê duyệt

| Vai trò | Họ tên | Quyết định | Ngày | Chữ ký/link approval |
|---|---|---|---|---|
| PO | | | | |
| Tech Lead | | | | |
| QA Owner | | | | |

