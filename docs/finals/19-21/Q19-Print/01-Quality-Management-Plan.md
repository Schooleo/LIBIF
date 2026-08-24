# BẢN IN NỘP KÈM — KẾ HOẠCH QUẢN LÝ CHẤT LƯỢNG PHẦN MỀM LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Mã tài liệu / phiên bản | `LIBIF-QMP-1.0` |
| Đường cơ sở sản phẩm | `dev@82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34, 24/07/2026 |
| Ngày lập / kỳ rà soát | 24/08/2026 / sau mỗi Sprint hoặc khi phạm vi, rủi ro thay đổi |
| Người phụ trách | Nhóm LIBIF; chưa có QA chuyên trách được ghi riêng |
| Người phê duyệt | Chưa ghi nhận chữ ký/phê duyệt chính thức |
| Trạng thái | Bản rà soát nội bộ; chưa phải baseline đã phê duyệt |

### Lịch sử thay đổi

| Phiên bản | Ngày | Nội dung | Người duyệt |
|---|---|---|---|
| 1.0 | 24/08/2026 | Chuẩn hóa mục tiêu, quality gate, bằng chứng Sprint và các khoảng trống nghiệm thu | Chưa ghi nhận |

## 1. Mục đích và phạm vi

QMP quy định cách nhóm **bảo đảm chất lượng (QA)**, **kiểm soát chất lượng (QC)**, đo lường, lưu bằng chứng và cải tiến chất lượng cho LIBIF. QMP áp dụng cho sản phẩm prototype, quy trình phát triển và hồ sơ bàn giao của 05 Sprint.

| Đối tượng | Trong phạm vi | Ngoài phạm vi ở baseline này |
|---|---|---|
| Sản phẩm | PBI-01…PBI-16, AC-01…AC-08, OCR/biên mục, API, web Reader, audit | HA/DR production, chống sao chép tuyệt đối, pentest thương mại |
| Quy trình | Scrum accelerated, PR/CI, test, review, quản lý lỗi/rủi ro/thay đổi | Scrum minutes và PO sign-off chưa có trong repository |
| Môi trường | Local Docker Compose, CI, test infrastructure và dữ liệu seed | Cam kết vận hành 24/7, backup/restore production |

## 2. Tài liệu đầu vào và truy vết

| Đầu vào | Bằng chứng/phiên bản | Cách sử dụng |
|---|---|---|
| Vision & Scope | [`LIBIF-Project-Vision-Scope.md`](../../../markdowns-vi-v2/LIBIF-Project-Vision-Scope.md) | Xác định mục tiêu, stakeholder, trong/ngoài phạm vi |
| Product Backlog | [`LIBIF-Product-Backlog.md`](../../../markdowns-vi-v2/LIBIF-Product-Backlog.md) | Truy vết PBI-01…PBI-16 và priority |
| SOW | [`LIBIF-Statement-Of-Work.md`](../../../markdowns-vi-v2/LIBIF-Statement-Of-Work.md) | Truy vết AC-01…AC-08 và deliverable |
| Architecture | [`LIBIF-Architecture.md`](../../../markdowns-vi-v2/LIBIF-Architecture.md) | Chọn thuộc tính chất lượng và rủi ro kỹ thuật |
| Project Planning/Monitoring | [`LIBIF-Project-Planning.md`](../../../markdowns-vi-v2/LIBIF-Project-Planning.md), [`LIBIF-Project-Monitoring.md`](../../../markdowns-vi-v2/LIBIF-Project-Monitoring.md) | Chu kỳ Sprint, DoD, chỉ số và kiểm soát sai lệch |
| Risk plan | [`LIBIF-Software-Risk-Management-Plan.md`](../../16-18/Q18-Prints/LIBIF-Software-Risk-Management-Plan.md) | Xác định risk owner, trigger và phương án dự phòng |
| Evidence thực thi | [Sprint 5 report](../../../../ai_artifacts/sprints/sprint-2026-07-24-phase-7-waves-5-7-and-phase-8.md) | Đối chiếu kế hoạch với kết quả thực tế và gap |

## 3. Chính sách và mục tiêu chất lượng

Các ngưỡng có chữ **Đề xuất** chỉ trở thành baseline sau khi nhóm/PO phê duyệt. Không ghi nhận một mục tiêu là “đạt” nếu repository không có execution record tương ứng.

| Mã | Đặc tính | Mục tiêu và cách đo | Kết quả/bằng chứng hiện có |
|---|---|---|---|
| QO-01 | Phù hợp chức năng | 100% Must-have AC được chạy và đạt trước phát hành (Đề xuất) | 11 PBI có evidence đang ở Review; chưa có acceptance sign-off cuối |
| QO-02 | Tin cậy | Critical/High còn mở = 0 (Đề xuất) | Có security/regression gates; chưa có defect register đầy đủ |
| QO-03 | Hiệu năng | Search p95 trên dataset baseline < 2 giây (Đề xuất) | Có live content-search smoke; p95 chưa được ghi |
| QO-04 | Bảo mật | Authz, source denial, watermark, audit, fail-closed đạt | Có gate và test evidence; production hardening còn carry-over |
| QO-05 | Bảo trì | Lint, type/build/test gate đạt trên PR | CI workflows, root lint và build được ghi là đạt |
| QO-06 | Chất lượng dữ liệu | Nội dung xuất bản được con người đối soát | Chưa có biên bản UAT/đối soát khách hàng trong repository |
| QO-07 | Khả dụng | Đại diện người dùng hoàn thành kịch bản UAT | Chưa có UAT record; chưa chốt ngưỡng |
| QO-08 | Khả chuyển | Fresh install theo README/Compose đạt | Có local Compose và Docker smoke; production deployment chưa được chứng minh |

## 4. Quality standards và quality gates

| Gate | Quy tắc thực tế | Evidence |
|---|---|---|
| Mã nguồn/PR | Thay đổi đi qua PR; PR #14–#34 có lịch sử merge | Git history và Sprint reports |
| Static quality | ESLint cho shared/API/web; TypeScript build | [`eslint.config.mjs`](../../../../eslint.config.mjs), `.github/workflows/api-ci.yml`, `web-ci.yml` |
| Test | API Jest, web Vitest, API e2e, worker integration | Sprint 5: 192 API, 96 web; e2e 12 suites/73 tests; worker 5/5 |
| Security/privacy | Authz, source-PDF denial, watermark, audit, fail-closed | Cross-workstream gate trong Sprint 5 |
| Acceptance | PBI chỉ chuyển Done khi có acceptance evidence | Board hiện ghi 11 PBI ở Review, 0 PBI Done |
| Release | DoD, test report, residual risk và PO decision | Chưa đủ bằng chứng cho production release |

Ngoại lệ phải ghi rõ phạm vi, lý do, rủi ro, người chấp thuận, thời hạn và action ID. Hiện chưa có exception record chính thức.

## 5. Hoạt động QA và QC

| Hoạt động | Loại | Thời điểm | Bằng chứng/kết quả |
|---|---|---|---|
| Baseline backlog, SOW, architecture, risk | QA | Trước và trong Sprint | Tài liệu kế hoạch + PBI traceability |
| Contract freeze và bounded workstreams | QA | Sprint 4–5 | Sprint 4 report; giảm xung đột tích hợp |
| ESLint/build/test gates | QC | Mỗi PR/CI | Workflow và test counts được ghi trong Sprint reports |
| Authorization/privacy/rendering regression | QC | Sprint 5 | Gate đóng bằng commit `6122520` |
| OCR worker integration | QC | Sprint 4–5 | 5/5 infrastructure-backed scenarios |
| Review/Retrospective và CAPA | QA | Cuối Sprint | Có retrospective trong Sprint reports; action production-hardening còn carry-over |

## 6. Vai trò và trách nhiệm

| Công việc | PO/đại diện yêu cầu | Tech Lead/leader | Developer | QA/DevOps | Người dùng |
|---|---|---|---|---|---|
| Chốt scope/AC | A/R | C | C | C | C |
| Architecture/coding standard | C | A/R | R | C | I |
| Test plan/execution/report | C | C | R | A/R | I |
| UAT/acceptance | A/R | C | I | C | R/C |
| Go/no-go | A | R | C | R | C |

Biên bản khởi động xác nhận leader là **Lê Nguyễn Nhật Trường** và nhóm có 06 thành viên. Biên bản đó chưa ghi phân công QA/PO chuyên trách, nên không suy đoán tên cho các vai trò còn lại.

## 7. Quản lý lỗi, thay đổi và cấu hình

- Lỗi phải có mã, build/commit, môi trường, dữ liệu, bước tái hiện, expected/actual, severity, priority, owner và trạng thái.
- GitHub repository hiện **không có Issues**; các thẻ trên board là PBI/review, không được gọi là defect.
- Thay đổi scope/quality threshold phải cập nhật Product Backlog, QMP, Test Plan và RTM.
- Evidence phải gắn với commit/build, môi trường, thời điểm, executor và phiên bản dữ liệu.
- Không trình bày prototype deterrence như DRM/chống chụp màn hình tuyệt đối.

## 8. Phương pháp hình thành, đánh giá và cập nhật

`Vision/SOW/Backlog/Architecture/Risk → quality objectives → QA/QC gates → evidence → review/retrospective → cập nhật baseline`

1. Thu thập yêu cầu, AC, constraint, kiến trúc và rủi ro.
2. Chọn thuộc tính chất lượng theo rủi ro; chuyển thành metric có nguồn dữ liệu, owner, tần suất và ngưỡng.
3. Tách preventive QA khỏi detective QC; xác định evidence bắt buộc.
4. Pilot bằng các Sprint thực tế; đối chiếu test count, gate, risk và acceptance.
5. Đánh giá sai lệch, cập nhật QMP bằng revision/change record.

### Kết quả đánh giá hiện tại

QMP **đủ làm baseline quản lý prototype**, vì đã liên kết scope, risk, DoD, CI/test và evidence. QMP **chưa đủ để kết luận phát hành production**, vì chưa có p95 search, UAT/feedback, defect register hoàn chỉnh, browser/accessibility matrix và production-operability evidence. Đây là kết luận có giới hạn, phù hợp với Sprint 5: POC increment thực tế nhưng hardening chỉ được chấp nhận một phần.

### Checklist phê duyệt

| Tiêu chí | Trạng thái |
|---|---|
| Scope nhất quán Vision/SOW/Backlog | Đạt ở mức tài liệu |
| Mỗi objective có metric/owner/ngưỡng | Một số mục còn Đề xuất |
| Có QA và QC | Đạt ở mức quy trình |
| Gate có evidence | Đạt một phần; thiếu raw artifacts/UAT |
| Mapping QMP–Test Plan–DoD–inspection–feedback | Có khung; inspection/UAT chính thức còn thiếu |
| Reviewer/approver và risk acceptance | Chưa có chữ ký chính thức |
