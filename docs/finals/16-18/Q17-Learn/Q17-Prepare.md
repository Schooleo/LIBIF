# Câu 17 — Chuẩn bị vấn đáp

## 1. Vì sao nhóm chọn Scrum và Trello?

**Trả lời:** Scrum phù hợp vì công việc được chia thành Sprint, PBI và Increment để kiểm tra sớm. Trello trực quan hóa trạng thái và owner; Sprint report, PR và test là bằng chứng bổ sung.

**Bằng chứng:** Ảnh `Trello_Task.png`, Sprint register 20–24/07/2026.

**Ý nghĩa:** Có thể phát hiện phụ thuộc và carry-over sớm.

**Cảnh báo:** 17 card `Done` không đồng nghĩa 17 PBI accepted.

## 2. Nhóm phân công thế nào và ai chịu trách nhiệm?

**Trả lời:** Leader là Member D — Lê Nguyễn Nhật Trường. Nhóm phân công theo module/lane, ghi owner, deadline, acceptance criteria và bằng chứng; Sprint 2 có bốn lane Reader/access, catalogue, processing/notification, dashboard/integration.

**Bằng chứng:** Sprint 2 completion report và kế hoạch cập nhật.

**Ý nghĩa:** Giảm chồng chéo nhưng vẫn phải kiểm soát điểm tích hợp.

**Cảnh báo:** Báo cáo Sprint dùng nhãn Member A–D; chỉ Member D được nhóm xác nhận là leader.

## 3. Dữ liệu nào dùng để theo dõi?

**Trả lời:** Dùng trạng thái card, start/finish, PR/commit, test, blocker, change request và actual effort. PDF time tracking ghi 31 entries, tổng 68 giờ 10 phút; đây là effort, không phải Story Point.

**Bằng chứng:** `Report_Time_tracking.pdf` và Sprint reports.

**Ý nghĩa:** So sánh thực tế với kế hoạch và phát hiện effort creep.

**Cảnh báo:** Không suy ra velocity nếu chưa có SP accepted theo Sprint.

## 4. Agent được kiểm soát ra sao?

**Trả lời:** Agent hỗ trợ breakdown, scaffold, test và tài liệu. Thành viên review diff, chạy lint/build/test/e2e hoặc smoke và chịu trách nhiệm nghiệm thu; Agent không tự xác nhận Done.

**Bằng chứng:** Project Estimation, Sprint closure gates.

**Ý nghĩa:** Tăng tốc nhưng giữ accountability.

**Cảnh báo:** Không nói Agent tự quản lý dự án.

## 5. Phân biệt scope creep và effort creep?

**Trả lời:** Scope creep là phạm vi/yêu cầu tăng ngoài baseline; effort creep là công sức tăng dù phạm vi có thể giữ nguyên. Scope change cần Change Request và đánh giá SP, deadline, Sprint Goal; effort creep cần rà time entry, blocker, tái ước lượng hoặc chia lại task.

**Bằng chứng:** Project Planning/Monitoring và time report.

**Ý nghĩa:** Chọn đúng biện pháp kiểm soát.

**Cảnh báo:** Không tự đặt số liệu lệch effort khi chưa có baseline tương ứng.

## 6. Khi Sprint chưa đạt thì xử lý thế nào?

**Trả lời:** Giữ deadline Sprint, ghi nguyên nhân, chia nhỏ hoặc giản lược, đưa phần chưa đạt về Product Backlog rồi tái ưu tiên. Không đổi deadline để biến việc dở dang thành Done.

**Bằng chứng:** Agile Monitoring slide và carry-over Sprint 5.

**Ý nghĩa:** Bảo vệ tính minh bạch của forecast.

## 7. Burndown và status report phải chứng minh gì?

**Trả lời:** Burndown biểu diễn work còn lại theo thời gian; baseline của LIBIF là 136 SP với ideal remaining 110, 82, 53, 24, 0. Tài liệu 04 có bảng giả lập để luyện cách tính scope change/carry-over, nhưng actual accepted SP của nhóm vẫn chưa được xác nhận. Status report phải nêu scope %, effort/chi phí, issue, change, risk, backlog và deliverable.

**Bằng chứng:** `03`, `04`, `05` trong bộ hồ sơ in.

**Ý nghĩa:** Báo cáo hỗ trợ quyết định, không làm đẹp tiến độ.

## 8. Tình trạng cuối kỳ hiện tại là gì?

**Trả lời:** Phase 7 được ghi nhận hoàn tất; Phase 8 chỉ có increment hardening được chấp nhận một phần. Backup/restore, secret rotation, retention/trace, capacity, browser/accessibility, abuse/recovery, observability và release/rollback còn carry-over.

**Bằng chứng:** Sprint 5 report và status report.

**Ý nghĩa:** Nên báo trạng thái Amber/partially accepted, không báo hoàn thành toàn bộ.
