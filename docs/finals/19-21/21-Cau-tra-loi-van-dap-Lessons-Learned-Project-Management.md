# CÂU TRẢ LỜI VẤN ĐÁP CUỐI KỲ

> Tách từ `19-20-21-Cau-tra-loi-van-dap.md`. Nội dung dựa trên ba PDF lý thuyết và hồ sơ LIBIF trong workspace. Chỉ khẳng định kết quả thực hiện khi có bằng chứng thật.

# 21. LESSONS LEARNED REGISTER VÀ SOFTWARE PROJECT MANAGEMENT

## 21.1. Quá trình hình thành Lessons Learned Register

Lessons Learned Register không nên chờ đến cuối dự án mới viết. Nhóm tạo và cập nhật nó từ các sự kiện:

- Sprint Review/Retrospective.
- Risk/issue/change/defect triage.
- Sai lệch estimate, schedule, quality hoặc scope.
- Code inspection, test completion, customer feedback và incident.
- Milestone/release/project closure.

Quy trình:

1. **Collect facts**: sự kiện, thời điểm, evidence và impact; tách fact khỏi opinion.
2. **Describe outcome**: điều gì tốt, chưa tốt hoặc gây bất ngờ.
3. **Analyze cause**: Five Whys, fishbone, brainstorming/mute mapping hoặc force-field analysis.
4. **Formulate lesson** theo dạng điều kiện–hành động–kết quả, không chỉ “cần cố gắng hơn”.
5. **Convert to action**: owner, due date, priority và artifact/process cần thay đổi.
6. **Validate**: ở Sprint sau kiểm tra action có được áp dụng và metric có cải thiện không.
7. **Share/archive**: lưu trong knowledge repository để dự án sau tái sử dụng.

Trường tối thiểu: Lesson ID, date/source, category, context, event, impact, root cause, what worked/did not work, recommendation, action/owner/due date, target project/Sprint, evidence, validation result, status và approver.

## 21.2. Lessons Learned Register được đánh giá thế nào?

- **Specific và evidence-based**: có sự kiện/metric/record, không phải nhận xét chung.
- **Causal**: phân biệt triệu chứng và root cause.
- **Actionable**: nêu hành động, owner, thời hạn và nơi cập nhật.
- **Transferable**: nói rõ context/điều kiện để dự án khác biết khi nào áp dụng.
- **Balanced**: ghi cả practice hiệu quả để tiếp tục và vấn đề cần sửa.
- **Closed-loop**: action được theo dõi và validation ở Sprint/dự án sau.
- **Psychological safety**: tập trung hệ thống/quy trình, không biến retrospective thành nơi đổ lỗi cá nhân.

Với LIBIF, ví dụ một lesson hợp lệ phải là: “Vì OCR accuracy phụ thuộc chất lượng scan, từ Sprint kế tiếp dataset phải version hóa theo DPI/language và có ground truth; QA owner kiểm tra trước benchmark.” Câu “OCR cần tốt hơn” chưa phải lesson actionable.

## 21.3. Quản lý dự án là gì?

Theo bài giảng, quản lý dự án là việc áp dụng kiến thức, kỹ năng, công cụ và kỹ thuật vào các hoạt động dự án để đáp ứng yêu cầu dự án. Nó bao gồm lập kế hoạch, đưa kế hoạch vào thực hiện, đo tiến độ/hiệu suất; xác lập mục tiêu, nhận diện yêu cầu, cân bằng constraint và xem xét nhu cầu/kỳ vọng stakeholder.

## 21.4. Tại sao phát triển phần mềm cần quản lý?

Quản lý giúp dự án nằm trong cost, time và scope, đồng thời đạt yêu cầu chất lượng của khách hàng. Phần mềm khó quản lý vì sản phẩm phần lớn vô hình, specification/design không chính xác tuyệt đối như bản vẽ một số ngành kỹ thuật, phương pháp vẫn phụ thuộc nhiều vào con người và thay đổi xảy ra thường xuyên.

Quản lý tốt không loại bỏ mọi risk, issue hay surprise; nó cung cấp quy trình và trách nhiệm để nhận biết, ra quyết định và ứng phó. Nếu chỉ đạt time/cost/scope nhưng khách hàng không hài lòng thì dự án vẫn có thể thất bại.

## 21.5. Công việc quản lý và sản phẩm tương ứng

| Hoạt động quản lý | Công việc chính | Sản phẩm/record |
|---|---|---|
| Initiation | business need, feasibility, stakeholder, authority | Proposal/Business Case, Project Charter, Stakeholder Register |
| Scope/requirement | vision, boundary, requirement/change | Vision & Scope, SOW, Product Backlog/SRS, RTM, Change Log |
| Estimation/schedule/cost | effort, duration, resource, budget, milestone | Estimates, WBS/Sprint plan, schedule, cost baseline |
| Team/communication | role, RACI, meeting/report/escalation | Team Charter/RACI, Communication Plan, minutes/status report |
| Quality | objective, standard, QA/QC, metric | QMP, DoD, coding config, inspection/test/quality records |
| Risk/issue | identify, analyze, response, monitor | Risk Register, Issue Log, action/decision log |
| Development coordination | release/integration/dependency/impediment | Sprint/Release Plan, board, integration/configuration records |
| Test/defect | planning, execution, triage, acceptance | Test Plan/cases/results, Defect Log, Test Report, UAT record |
| Monitoring/control | planned–actual, forecast, corrective action | Dashboard, progress/variance/forecast report, change decision |
| Closure/improvement | acceptance, archive, handover, learning | Acceptance/closure report, release/handover, Lessons Learned Register |

Năm Process Groups của PMI có thể tóm tắt là Initiating, Planning, Executing, Monitoring & Controlling và Closing; chúng tương tác chứ không nhất thiết là năm giai đoạn tuyến tính tuyệt đối.

## 21.6. Có nhất thiết cần một người chỉ chuyên quản lý không?

**Không phải mọi nhóm đều bắt buộc có dedicated PM, nhưng mọi trách nhiệm quản lý bắt buộc phải có người thực hiện.**

- Nhóm nhỏ có thể phân phối trách nhiệm nếu mọi người chấp nhận “responsibility tax”: cùng duy trì kế hoạch, giao tiếp, risk, dependency và overall coherence.
- Dedicated PM hữu ích khi dự án có nhiều stakeholder, dependency, xung đột, compliance, chi phí hoặc rủi ro cao. PM giữ cái nhìn toàn cục, nối business với technical view và làm rõ quyết định.
- Nếu không có người shepherd overall effort, lợi ích cục bộ và thiên kiến cá nhân có thể làm lệch hướng; engineering–business factions có thể làm chậm tiến độ.
- Dedicated PM không được trở thành điểm phụ thuộc duy nhất. Quy trình, quyết định và knowledge phải được ghi lại.

Với nhóm LIBIF sáu sinh viên, có thể kết hợp Scrum Master/Technical Lead với điều phối dự án, nhưng RACI phải rõ và PO/QA/Dev vẫn tự chịu trách nhiệm chuyên môn; không thể giao “chất lượng” hoàn toàn cho PM.

## 21.7. Plan-driven và adaptive giống, khác nhau thế nào?

### Giống nhau

- Đều hướng tới đáp ứng requirement và cân bằng scope, time, cost, quality, risk và stakeholder needs.
- Đều cần mục tiêu, role, estimate, quality criteria, communication, monitoring và change decision.
- Đều dùng evidence để so actual với expectation và cần governance.

### Khác nhau

| Khía cạnh | Plan-driven/predictive | Adaptive/empirical |
|---|---|---|
| Cơ sở điều khiển | baseline chi tiết lập sớm | mục tiêu + backlog, học qua Increment |
| Requirement/change | ưu tiên ổn định, change control chính thức | chấp nhận thay đổi, reprioritize thường xuyên |
| Planning | nhiều upfront, horizon dài | rolling-wave, mỗi Sprint |
| Feedback | thường theo phase/milestone | liên tục qua review/test/retro |
| Đo tiến độ | hoàn thành phase/deliverable so plan | working Increment, Done items, outcome |
| Phù hợp | phạm vi ổn định, compliance/dependency cao | uncertainty cao, cần khám phá/feedback nhanh |
| Rủi ro chính | plan lỗi thời, feedback muộn | mất coherence/forecast nếu discipline yếu |

Cách phù hợp với LIBIF là hybrid có kiểm soát: Charter/SOW/quality/security baseline tương đối ổn định; còn implementation, estimate và ưu tiên Should Have thích ứng theo velocity/feedback sau mỗi Sprint.

## 21.8. Quan hệ giữa quản lý dự án và kỹ nghệ phần mềm

Bài giảng coi thực thi dự án phần mềm có hai thành phần:

- **Software engineering** thực hiện hoạt động kỹ thuật: specification, construction, integration, verification, validation và tạo sản phẩm được khách hàng chấp nhận.
- **Management** tạo điều kiện để kỹ thuật hoàn thành đúng thời gian, hiệu quả về chi phí, đúng mục tiêu và với ít defect: vision, estimate, coordination, conflict resolution, unexpected situations và workflow optimization.

Hai phần loosely coupled nhưng ảnh hưởng lẫn nhau và phải tailor cho nhau. Ví dụ chọn Scrum làm thay đổi cadence quản lý; kiến trúc OCR/Redis/MinIO làm thay đổi estimate, risk và test plan. Quản lý không thay thế kỹ thuật, và kỹ thuật tốt không tự giải quyết scope, stakeholder, cost hay coordination.

## 21.9. Tại sao công ty lớn cần PMO?

Khi tổ chức còn nhỏ, ad hoc management có chi phí thấp và linh hoạt, nhưng phụ thuộc mạnh vào cá nhân: mất người lãnh đạo có thể mất knowledge và làm dự án mất hướng. Khi số dự án và workload tăng, cách làm này khó mở rộng.

PMO giúp chuyển sang process-driven management bằng cách:

- Chuẩn hóa quy trình, template, metric, governance và project lifecycle.
- Cung cấp tool, knowledge repository, training và expert assistance.
- Điều phối portfolio, dependency, resource và priority giữa nhiều dự án.
- Tạo visibility và báo cáo nhất quán cho lãnh đạo.
- Audit/compliance, quality/risk assurance và escalation.
- Thu thập Lessons Learned, benchmark và continual improvement.
- Giảm person-dependency, tăng predictability và khả năng tái sử dụng tri thức.

Đánh đổi là chi phí và nguy cơ quan liêu. PMO tốt phải tailor mức kiểm soát theo quy mô/risk, hỗ trợ delivery thay vì chỉ yêu cầu biểu mẫu.

---

