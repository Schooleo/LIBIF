# CÂU TRẢ LỜI VẤN ĐÁP CUỐI KỲ

> Tách từ `19-20-21-Cau-tra-loi-van-dap.md`. Nội dung dựa trên ba PDF lý thuyết và hồ sơ LIBIF trong workspace. Chỉ khẳng định kết quả thực hiện khi có bằng chứng thật.

# 20. TEST PLAN

## 20.1. Trình bày quá trình hình thành Test Plan của nhóm

Test Plan được dẫn xuất từ QMP và test basis, không được viết độc lập với requirement. Quy trình phù hợp cho LIBIF:

1. Baseline Vision/SOW/Backlog/Architecture/QMP/DoD/risk.
2. Xác định mục tiêu, test items, in-scope/out-of-scope và constraint.
3. Phân tích product risk: authorization, encrypted storage, concurrent session, OCR/content approval, search, original URL, audit và fresh install.
4. Chọn test level/type/technique: static, unit, integration, E2E, security, performance, regression và UAT; kết hợp scripted với exploratory.
5. Lập requirement-risk-test traceability matrix.
6. Chọn environment, browser, services, tool version, dataset và expected oracle.
7. Xác định role, effort, schedule, deliverable, entry/exit và suspension/resumption criteria.
8. Định nghĩa defect workflow, severity, reporting và configuration management.
9. Review/pilot smoke hoặc high-risk cases, phê duyệt và baseline.
10. Trong thực thi, monitoring/control; cuối vòng tạo Test Report và archive evidence.

## 20.2. Các câu hỏi chính Test Plan phải trả lời

- Kiểm thử **cái gì** và không kiểm thử cái gì?
- Mục tiêu kiểm thử và quality risk cần giảm là gì?
- Dựa trên requirement/design/version nào?
- Chọn level, type, technique và mức automation nào, vì sao?
- Ai thực hiện, khi nào, cần effort/resource/tool nào?
- Môi trường, configuration và test data nào được dùng?
- Expected result/oracle lấy từ đâu?
- Khi nào được bắt đầu, tạm dừng, tiếp tục và kết thúc test?
- Defect được ghi nhận, phân loại, triage, retest và đóng thế nào?
- Theo dõi tiến độ/coverage/chất lượng bằng metric nào?
- Deliverable và evidence nào được lưu?
- Ai có quyền quyết định Go/No-Go và chấp nhận residual risk?

## 20.3. Đầu vào và các bước tạo Test Plan

### Đầu vào

- Project scope, SOW, PBI/user stories và AC.
- Architecture, interface/schema, deployment design và quality attributes.
- QMP, DoD, coding standards và release criteria.
- Risk register, estimation, schedule, staffing và environment constraint.
- Defect/history/lessons từ Sprint trước.
- Customer workflow, representative data và UAT expectation.

### Cách biến đầu vào thành plan

- Requirement cho biết cần xác minh hành vi nào.
- Architecture cho biết integration point và technical risk nào cần test.
- QMP cho quality objectives/threshold.
- Risk quyết định ưu tiên và độ sâu test.
- Resource/schedule quyết định scope automation và thứ tự thực thi.
- DoD/acceptance quyết định exit criteria.

Sau đó nhóm review để phát hiện requirement không testable, thiếu oracle, môi trường không khả thi hoặc coverage gap trước khi phê duyệt.

## 20.4. Test Plan được đánh giá thế nào?

Đánh giá theo năm nhóm tiêu chí:

1. **Correctness/consistency**: đúng build, scope, backlog, architecture và QMP.
2. **Completeness**: đủ scope, risk, strategy, levels/types, environment/data, roles/schedule, criteria, defect/configuration/reporting.
3. **Traceability/coverage**: mọi Must-have AC và high risk có test; test có expected result và evidence.
4. **Feasibility**: environment, tool, data, skill và thời gian thực sự sẵn có.
5. **Effectiveness**: khi áp dụng có tìm được defect quan trọng, hỗ trợ retest/regression và đưa ra release decision đáng tin không.

Kết thúc test, so planned với actual, kiểm tra deviations, requirement/risk coverage, open defect, exit criteria, residual risk và customer acceptance. Pass rate cao không đủ nếu high-risk cases chưa chạy hoặc nhiều test bị blocked/skipped.

## 20.5. Tại sao cần Test Plan?

- Tạo phạm vi và mục tiêu chung, tránh kiểm thử ngẫu nhiên hoặc bỏ sót.
- Ưu tiên effort theo risk thay vì chia đều cho mọi chức năng.
- Chuẩn bị sớm environment, data, tool và trách nhiệm.
- Xác định tiêu chí khách quan cho test completion/release.
- Tạo traceability và evidence cho defect, audit, customer acceptance.
- Cho phép theo dõi, kiểm soát và cập nhật khi dự án thay đổi.
- Giảm chi phí lỗi bằng cách phối hợp static review, unit, integration, E2E và UAT.

## 20.6. Test Plan được sử dụng và cập nhật thế nào?

- Dùng trong Sprint Planning để đưa test activity vào estimate và phân công.
- Dùng khi coding để developer biết unit/integration expectation và CI gate.
- Dùng khi test execution để chọn đúng build/environment/data, ghi kết quả và defect.
- Dùng trong daily/triage để so planned–actual, xử lý blocker và reprioritize theo risk.
- Dùng trong Sprint Review/UAT để chứng minh AC và ghi feedback.
- Dùng cuối release làm baseline cho Test Completion Report và Go/No-Go.

Test Plan được cập nhật khi scope/AC, architecture, risk, schedule, environment, dataset, tool hoặc build strategy thay đổi. Mọi thay đổi cần version, rationale, impact, approver và RTM update. Kết quả thực tế không được viết ngược vào Plan như thể đã được dự kiến; chúng thuộc execution record/Test Report.

## 20.7. Cách trình bày bộ bằng chứng câu 20

1. Test Plan có version và baseline.
2. Coding Standards: config thật + command + CI run trên commit.
3. Bug tracker: list view và defect detail có dữ liệu thật, expected/actual/evidence/history.
4. Unit Tests: command, commit, tool version, pass/fail/skip, duration, coverage và raw report.
5. Code inspection: scope/roles/findings/fix verification.
6. Test Report: planned–actual, RTM, defects, exit criteria, residual risks và conclusion.
7. Customer feedback: scenario/build/persona/feedback/disposition/xác nhận.

Mọi ảnh chụp cần truy ra artifact gốc; không dùng screenshot thay cho log hoặc record có thể kiểm tra.

---

