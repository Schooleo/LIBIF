# CÂU TRẢ LỜI VẤN ĐÁP CUỐI KỲ

> Tách từ `19-20-21-Cau-tra-loi-van-dap.md`. Nội dung dựa trên ba PDF lý thuyết và hồ sơ LIBIF trong workspace. Chỉ khẳng định kết quả thực hiện khi có bằng chứng thật.

# 19. SOFTWARE QUALITY MANAGEMENT PLAN

## 19.1. Trình bày quá trình hình thành tài liệu QMP của nhóm

Nhóm hình thành QMP theo chuỗi logic của bài giảng:

`Chọn đối tượng → chọn đặc tính → định nghĩa metric → chọn cách đo → đặt yêu cầu/ngưỡng → lập kế hoạch QA/QC → thu thập bằng chứng → đánh giá và cải tiến`.

Áp dụng cho LIBIF:

1. **Chọn các entity cần quản lý chất lượng**:
   - Sản phẩm: Web UI, API, mã nguồn, dữ liệu OCR/biên mục, tài liệu mã hóa, audit log.
   - Quy trình: refinement, coding, review, testing, defect/change management và Scrum.
   - Dự án: deliverable, tiến độ, mức đạt phạm vi và mức hài lòng stakeholder.
   - Con người/môi trường: năng lực nhóm, CI/staging, Docker, PostgreSQL, Redis, MinIO và Tesseract.
2. **Thu thập yêu cầu** từ Vision & Scope, Product Backlog PBI-01–PBI-16, tiêu chí AC-01–AC-08 trong SOW, kiến trúc và risk register.
3. **Chọn đặc tính quan trọng**, ví dụ correctness/functional suitability, reliability, efficiency, security/integrity, usability, maintainability, testability và portability.
4. **Chuyển đặc tính trừu tượng thành metric**, chẳng hạn tỷ lệ test case đạt, số defect theo severity, search response time, coverage, tỷ lệ acceptance criteria đạt và customer satisfaction.
5. **Định nghĩa chuẩn so sánh**. Theo bài giảng, nếu không có requirement/baseline/standard thì không thể kết luận có chất lượng. Ví dụ LIBIF đặt search dưới 2 giây theo PBI-10, không còn lỗi Critical trước release theo SOW, và toàn bộ Must-have AC phải đạt trước nghiệm thu.
6. **Xác định biện pháp QA và QC**: Coding Standards, DoD, CI gates, peer review và đào tạo để phòng ngừa; inspection, static analysis, testing, defect tracking và UAT để phát hiện.
7. **Phân vai, lịch, bằng chứng và cơ chế thay đổi** trong QMP; review bởi PO, Tech Lead và QA trước khi baseline.
8. **Dùng dữ liệu Sprint để hiệu chỉnh** metric/ngưỡng và ghi version history, thay vì coi QMP là tài liệu viết một lần.

## 19.2. Các câu hỏi chính QMP phải trả lời

Một QMP tốt phải trả lời được:

1. Chất lượng của **đối tượng nào** được quản lý: product, process, project, people hay environment?
2. Những **đặc tính chất lượng nào** quan trọng và vì sao chúng phù hợp nhu cầu kinh doanh, người dùng và kỹ thuật?
3. Mỗi đặc tính được biểu diễn bằng **attribute/metric nào**?
4. **Đo như thế nào**, bằng công cụ/dữ liệu nào, ở môi trường nào và tần suất nào?
5. **Chuẩn/ngưỡng chấp nhận** là gì?
6. Ai chịu trách nhiệm thực hiện, review, phê duyệt và xử lý sai lệch?
7. Hoạt động **QA phòng ngừa** và **QC phát hiện** gồm những gì?
8. Sản phẩm nào cần review, inspection, test hoặc customer acceptance?
9. Finding/defect được báo cáo, sửa, retest và đóng thế nào?
10. Bằng chứng được quản lý phiên bản, lưu giữ và truy xuất thế nào?
11. Khi requirement, risk hoặc baseline thay đổi thì QMP được cập nhật ra sao?

## 19.3. Đầu vào và các bước tạo QMP

### Đầu vào

- Business problem, mục tiêu và customer expectations.
- Project Charter, Vision & Scope và SOW.
- Product Backlog, user story, acceptance criteria và Definition of Ready.
- Architecture, technology stack và quality attributes.
- Project Plan, estimation, schedule, resource constraint và Risk Register.
- Tiêu chuẩn/quy ước tổ chức, Coding Standards, DoD và quy định học phần.
- Dữ liệu lịch sử: defect, velocity, review finding, test result và feedback nếu đã có.

### Các bước

1. Baseline đầu vào và giải quyết các điểm mâu thuẫn.
2. Lập stakeholder-quality-needs matrix.
3. Chọn entity và đặc tính chất lượng.
4. Định nghĩa metric, công thức, nguồn dữ liệu, owner, tần suất và threshold.
5. Chọn standards, practices, review, tests, tools và quality gates.
6. Thiết kế quy trình problem reporting/corrective action, record retention, training, risk và change control.
7. Review tính đầy đủ, khả thi, đo được và traceability.
8. Approve/baseline; triển khai thử trong Sprint; cập nhật theo dữ liệu thực tế.

## 19.4. QMP được đánh giá như thế nào?

Không đánh giá QMP chỉ bằng việc “đủ mục lục”. Cần đánh giá ở ba tầng:

1. **Đánh giá chất lượng tài liệu**:
   - Đúng: không mâu thuẫn với SOW/Backlog/Architecture.
   - Đủ: có purpose, reference, management, documentation, standards/metrics, reviews, tests, corrective action, tools, records, training, risk và change history như khung IEEE 730 được bài giảng giới thiệu.
   - Rõ và đo được: metric có công thức, nguồn, owner và threshold.
   - Traceable: quality objective liên kết tới requirement/risk/test/evidence.
2. **Đánh giá tính khả thi của kế hoạch**:
   - Công cụ, nhân lực, dữ liệu và lịch có thực hiện được trong 5 Sprint không?
   - Chi phí kiểm soát có tương xứng với risk không? Bài giảng nhấn mạnh mục tiêu là chất lượng chấp nhận được với chi phí phù hợp, không phải chất lượng cao nhất bằng mọi giá.
3. **Đánh giá hiệu lực khi áp dụng**:
   - CI gate có ngăn code không đạt chuẩn?
   - Inspection có tìm được lỗi sớm?
   - Defect/rework/escaped defect có giảm?
   - AC, DoD, customer feedback và release criteria có được đáp ứng?
   - Finding từ audit/review có corrective action và được đóng?

Kết quả đánh giá phải dẫn tới một quyết định: Approved, Approved with actions hoặc Rework; không chỉ là nhận xét miệng.

## 19.5. Tại sao cần QMP?

- Chuyển khái niệm “phần mềm tốt” từ cảm tính thành yêu cầu đo được.
- Tạo hiểu biết chung giữa customer, PO, developer, QA và quản lý.
- Phòng ngừa lỗi sớm, giảm rework và maintenance cost.
- Cung cấp tiêu chí khách quan cho Done, acceptance và release.
- Bảo đảm customer satisfaction, không chỉ hoàn thành scope/time/cost.
- Xác định trách nhiệm, công cụ, records và cách xử lý sai lệch.
- Hỗ trợ audit, học lại từ dữ liệu và continual improvement.

## 19.6. QMP được sử dụng và cập nhật thế nào trong dự án?

QMP được dùng xuyên suốt:

- **Refinement/Planning**: kiểm tra AC có testable; nhận diện quality risk; ước lượng hoạt động review/test.
- **Development**: áp dụng Coding Standards, unit test, CI/CD và code review.
- **Trước khi chuyển Done**: kiểm tra DoD và evidence.
- **Test/triage**: phân severity, quyết định retest/regression và theo dõi metric.
- **Sprint Review/UAT**: so sánh Increment với AC và thu customer feedback.
- **Release**: đối chiếu quality objectives, exit criteria và residual risk để Go/No-Go.
- **Retrospective**: dùng Five Whys, fishbone hoặc force-field analysis để tạo improvement action.

QMP cần tăng version khi thay đổi scope, architecture, risk, metric, threshold, tool, role hoặc acceptance process. Mỗi thay đổi ghi lý do, impact, approver và ngày hiệu lực. Không hạ threshold hồi tố chỉ để biến kết quả fail thành pass.

## 19.7. McCall và ISO 9126 hỗ trợ kiểm soát chất lượng thế nào?

Hai mô hình cung cấp một “từ điển chất lượng”, giúp nhóm không chỉ kiểm tra chức năng mà còn xem xét các thuộc tính phi chức năng.

### McCall

McCall nêu các yếu tố như correctness, reliability, efficiency, integrity, usability, maintainability, testability, flexibility, portability, reusability và interoperability. Với LIBIF:

- Correctness: upload/OCR/search/RBAC đúng specification.
- Integrity: người không có quyền không đọc được tài liệu.
- Efficiency: search đáp ứng ngưỡng thời gian.
- Maintainability/testability: module rõ, lint/type-check/test/review được.
- Portability: cài lại được bằng Docker/README.

### ISO 9126

ISO 9126 tổ chức chất lượng thành sáu nhóm: Functionality, Reliability, Usability, Efficiency, Maintainability và Portability, kèm các subcharacteristics. Nó giúp lập checklist có cấu trúc và map requirement → characteristic → metric → test.

### Giá trị và giới hạn

- Giá trị: tạo thuật ngữ thống nhất, kiểm tra độ đầy đủ của requirement, chọn metric và test phù hợp.
- Giới hạn: mô hình không tự cung cấp threshold chung cho mọi dự án. Nhóm vẫn phải chọn đặc tính và ngưỡng theo stakeholder, context, risk và cost. Không nên đo tất cả thuộc tính chỉ để “đủ mô hình”.

## 19.8. Định tính khác định lượng thế nào?

| Tiêu chí | Định tính | Định lượng |
|---|---|---|
| Dạng dữ liệu | Mô tả, nhận xét, category | Số, count, ratio, time, cost |
| Ví dụ LIBIF | giao diện khó hiểu; workflow hợp lý; khách hàng Satisfied/Neutral/Dissatisfied | search p95 1,8 giây; 48/50 test pass; 2 defect High |
| Ưu điểm | Giải thích nguyên nhân, cảm nhận và context | So sánh với baseline, theo dõi xu hướng |
| Hạn chế | Có tính chủ quan, khó tổng hợp | Có thể tạo cảm giác chính xác giả nếu metric/mẫu đo sai |

Hai loại bổ sung nhau. Ví dụ rating usability bằng số cho biết mức độ, còn phỏng vấn/quan sát giải thích vì sao người dùng gặp khó khăn.

## 19.9. Đo chất lượng sản phẩm, quy trình và con người

Áp dụng năm bước của bài giảng: entity → characteristic → metric → evaluation method → requirement/baseline.

### Sản phẩm

- Correctness: số/tỷ lệ AC hoặc test case pass.
- Reliability: failure count, mean time between failures hoặc recovery result.
- Defect density: defect trên LOC/module/function point, nhưng phải ghi cách tính size.
- Efficiency: response time, CPU, RAM với workload xác định.
- Usability: task completion, learning time và feedback định tính.
- Maintainability: complexity, review findings, time sửa lỗi, regression impact.

### Quy trình

- Planned/actual activities và work products.
- Cycle time, review coverage, defect removal trước test, reopen rate.
- Số rework do specification không khớp kết quả.
- Tỷ lệ action retrospective hoàn thành.
- Chỉ số phải dùng để cải tiến quy trình, không dùng đơn lẻ để quy trách nhiệm cá nhân.

### Dự án

- Deliverables achieved/planned.
- Schedule/cost variance, scope completion và customer satisfaction.
- Risk exposure, change/issue aging và mức hoàn thành objective.

### Con người

- Kinh nghiệm phù hợp lĩnh vực, training/skill coverage, khả năng cộng tác và mức hài lòng.
- Có thể dùng tự đánh giá, peer feedback và competency matrix kết hợp số năm kinh nghiệm/training completion.
- Không dùng LOC, số commit hay số defect cá nhân như thước đo chất lượng độc lập vì dễ bị thao túng và không phản ánh teamwork/độ khó.

## 19.10. Hạn chế tài liệu dự án sai yêu cầu khách hàng

- Elicit requirement qua interview/workshop/observation và mô hình quy trình thực tế.
- Dùng prototype, story map, use case, Given–When–Then và glossary để giảm hiểu khác nhau.
- Baseline requirement và duy trì traceability tới mục tiêu/AC/test.
- Review tài liệu có customer/PO và người thực hiện; ghi comment, action và approval.
- Demo sớm, customer tests/UAT và feedback report; chuyển feedback thành defect/backlog/change ID.
- Quản lý version/change; cập nhật tất cả tài liệu bị ảnh hưởng.
- Dùng checklist về correctness, completeness, consistency, clarity, feasibility và testability.

## 19.11. Hạn chế mã nguồn sai thiết kế

- Architecture/design review và ghi các quyết định quan trọng.
- Chia module, API contract, schema và dependency rule rõ ràng.
- Coding Standards về format, file layout, error handling, event và logging.
- Static analysis, type-check, build gate và architecture tests nếu có.
- Pull request và code inspection đối chiếu diff với PBI, AC, design và risk.
- Simple Design: phù hợp người đọc, communicative, factored và minimal.
- Phát hiện code smells như Divergent Change, Shotgun Surgery, Time Dependency, Half-Baked Object rồi refactor có regression test.
- Không cho merge khi finding Critical/Major chưa đóng hoặc chưa có risk acceptance.

## 19.12. Hạn chế phần mềm hoạt động sai yêu cầu khách hàng

- Acceptance criteria testable và test design từ sớm.
- Unit tests, integration tests, E2E tests và exploratory scenarios với zero/one/many, too big/small, CRUD, sai datatype và malicious input.
- Tích hợp tests vào CI/CD để phát hiện regression trên mỗi thay đổi.
- Risk-based testing ưu tiên RBAC, mã hóa, concurrency, OCR và audit của LIBIF.
- Test trên dữ liệu/môi trường đại diện; xác định expected result/oracle trước khi chạy.
- Defect tracking, triage, fix, retest và regression có traceability.
- Customer thực hiện UAT vì customer tests vừa kiểm chứng vừa là phương tiện giao tiếp.
- Chỉ Done khi Increment đạt DoD và ở trạng thái production-ready theo mức phạm vi của dự án.

---

