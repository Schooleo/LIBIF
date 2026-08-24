# Q11-Prepare — Chuẩn bị vấn đáp về Kế hoạch dự án (Project Plan)

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu khái niệm/quyết định của nhóm.
2. **Dẫn chứng LIBIF:** chỉ vào đúng mục trong `LIBIF-Project-Planning.md`.
3. **Giá trị quản lý:** nói rủi ro/bất định nào được giảm bớt hoặc phát hiện.

Điểm neo phải nhớ:

    6 đầu vào → W5HH → 15 mục Kế hoạch dự án → 05 Sprint → theo dõi & cập nhật
    Baseline: 136 SP | 10 tuần/05 Sprint | 900h (765h tập trung) | 0 VNĐ

    Đánh giá = đối chiếu W5HH
              + đối chiếu baseline Estimation
              + kiểm tra khả thi capacity (15h/tuần/người)
              + đủ 8 thành phần lý thuyết (schedule/resource/cost/quality/
                communication/risk/change-config/closure)
              + có ngưỡng theo dõi rõ ràng
              + phê duyệt 4 vai trò (PO/SM/Dev/GV)

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Kế hoạch dự án là gì?

**Trả lời:** 7 câu hỏi theo nguyên lý W5HH của Boehm: Why (lý do/mục tiêu), What (phạm vi/sản phẩm), When (tiến độ/milestone), Who (ai chịu trách nhiệm), Where (vị trí tổ chức), How (cách làm kỹ thuật lẫn quản trị), How much (cần bao nhiêu nguồn lực). LIBIF trả lời đủ 7 câu qua 15 mục của tài liệu.

### 2. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu là gì?

**Trả lời:** Đầu vào gồm 6 tài liệu: Project Charter, Vision & Scope, Product Backlog, Architecture, Proof of Concept, Project Estimation (baseline v3.0). Các bước: xác nhận baseline → xác định tiêu chí thành công → chọn Scrum + DoR/DoD → tổ chức nhóm và RACI → lập WBS → lập lịch 05 Sprint → phân bổ effort → lập chi phí → lập kế hoạch chất lượng/giao tiếp/rủi ro/thay đổi → thiết lập theo dõi → lập kế hoạch kết thúc → phê duyệt.

### 3. Tài liệu Kế hoạch dự án của nhóm đã được đánh giá thế nào?

**Trả lời:** Đối chiếu ngược với W5HH (đủ 7 câu chưa); đối chiếu số liệu với baseline trong tài liệu Ước lượng dự án (không tự bịa số); kiểm tra effort phân bổ có vượt capacity 15h/tuần/người không; kiểm tra đủ 8 thành phần kế hoạch theo lý thuyết; kiểm tra có ngưỡng/metric để phát hiện lệch tiến độ; và có xác nhận phê duyệt của 4 vai trò trước khi coi là baseline chính thức.

### 4. Tại sao cần tạo tài liệu Kế hoạch dự án?

**Trả lời:** Đây là "bản đồ dẫn đường" tích hợp toàn bộ hoạt động kỹ thuật và quản trị, giúp trả lời "làm được không, tốn bao nhiêu, khi nào xong" (theo slide Why Planning?). Nó giảm bất định, thiết lập niềm tin giữa các bên, giảm rủi ro, hỗ trợ ra quyết định tốt hơn và truyền đạt thông tin thống nhất cho cả nhóm lẫn giảng viên.

### 5. Tài liệu đã được sử dụng và cập nhật trong dự án như thế nào?

**Trả lời:** Mỗi Sprint Planning dùng phạm vi/milestone ở mục 6 làm input; Scrum Master cập nhật chỉ số theo dõi (mục 13) cuối mỗi Sprint; khi lệch ngưỡng (vd velocity dưới 24 SP/Sprint sau Sprint 2) áp dụng mục 6.3 để hoãn PBI co giãn; mọi thay đổi phạm vi/deadline đi qua quy trình mục 12.1 và được ghi vào issue/biên bản Review, không chỉ thống nhất bằng lời nói.

### 6. Một số mô hình không xác định rõ kết quả cuối cùng của dự án — vẫn cần Kế hoạch dự án không?

**Trả lời:** Có. Theo Agile Planning, việc lập kế hoạch (planning) quan trọng hơn một bản kế hoạch cố định (a plan); agile khuyến khích thay đổi nhưng vẫn cần "một kế hoạch đủ tốt" làm cơ sở ra quyết định. LIBIF dùng Scrum nhưng vẫn có Project Plan — chỉ khác là baseline được refine liên tục qua Backlog Refinement/Retrospective thay vì cố định một lần như waterfall.

### 7. Kế hoạch dự án khác gì với tài liệu Định nghĩa quy trình phát triển phần mềm?

**Trả lời:** Định nghĩa quy trình phát triển chọn và hiệu chỉnh mô hình phát triển chung (Scrum, các giai đoạn, vai trò tổng quát) — trả lời "nhóm dùng quy trình nào". Kế hoạch dự án áp dụng quy trình đó vào dự án cụ thể với số liệu baseline thật, người thật, lịch Sprint thật, rủi ro/chất lượng/giao tiếp cụ thể của LIBIF — trả lời "áp dụng quy trình đó cho dự án này ra sao, với số liệu gì".

### 8. W5HH áp dụng cụ thể vào LIBIF như thế nào?

**Trả lời:** Why → mục đích/mục tiêu (mục 1). What → baseline/WBS/tiêu chí thành công (mục 2, 5). When → lịch 05 Sprint và milestone (mục 6). Who/Where → tổ chức nhóm và RACI (mục 4). How → phương pháp Scrum, chất lượng, giao tiếp, thay đổi (mục 3, 9, 10, 12). How much → effort và chi phí (mục 7, 8).

### 9. Vì sao nhóm chọn Scrum 05 Sprint × 02 tuần?

**Trả lời:** Ràng buộc học phần cố định 10 tuần; backlog 16 PBI có mức ưu tiên MoSCoW nên cần phản hồi sớm và điều chỉnh linh hoạt. Scrum cho phép Review/Retro mỗi 2 tuần để phát hiện sớm lệch tiến độ, thay vì một kế hoạch waterfall cứng làm một lần từ đầu.

### 10. Baseline (136 SP, 900h, 0 VNĐ) trong Kế hoạch dự án lấy từ đâu?

**Trả lời:** Không tự đặt ra ở bước này; kế thừa nguyên từ `LIBIF-Project-Estimation.md` phiên bản 3.0. Kế hoạch dự án chỉ chuyển hóa baseline đó thành lịch trình, phân công và cơ chế kiểm soát cụ thể cho từng Sprint.

### 11. Nhóm quản lý sai lệch tiến độ ra sao?

**Trả lời:** Theo mục 6.3: velocity dưới 24 SP/Sprint sau Sprint 2 thì hoãn PBI-03/13/15 (phạm vi co giãn); thành viên thiếu trên 20% capacity thì phân công lại/pairing; Sprint Goal có nguy cơ thất bại thì Scrum Master xử lý impediment trong 24 giờ; không tính "hoàn thành một phần" — phần dở dang quay lại Product Backlog.

### 12. Ma trận RACI có ý nghĩa quản lý gì?

**Trả lời:** Làm rõ ai Accountable/Responsible/Consulted/Informed cho từng hoạt động, tránh chồng chéo hoặc bỏ sót trách nhiệm. Giảng viên chỉ giữ vai trò Informed (trừ khi thay đổi deadline/yêu cầu học phần thì mới là Accountable) — không thay thế Product Owner hay Scrum Master.

### 13. Vì sao chi phí tiền mặt bằng 0 VNĐ? Có nghĩa dự án không tốn nguồn lực không?

**Trả lời:** 0 VNĐ vì dùng Azure for Students, AI free-tier và tài nguyên sẵn có. Không có nghĩa là miễn phí về nguồn lực — dự án vẫn được quản lý bằng 900 giờ-người effort (mục 7), đây mới là "chi phí" chính của một dự án học phần.

### 14. Rủi ro liên quan đến việc dùng Coding Agent được quản lý ra sao?

**Trả lời:** Ghi nhận ở R-06 (phụ thuộc Coding Agent) và R-07 (vi phạm quy định học thuật) trong Risk Register; ứng phó bằng peer review bắt buộc, test đầy đủ, có phương án làm local, và công bố phạm vi sử dụng AI cùng đóng góp thành viên khi giảng viên yêu cầu (mục 12.3).

### 15. Ai phê duyệt Kế hoạch dự án và ý nghĩa của việc phê duyệt là gì?

**Trả lời:** 4 vai trò tại mục 15: Product Owner (xác nhận phạm vi/sản phẩm bàn giao), Scrum Master (xác nhận tiến độ/nguồn lực/cơ chế kiểm soát), đại diện nhóm phát triển (xác nhận capacity/Definition of Done), giảng viên (xác nhận phù hợp yêu cầu học phần). Việc này đảm bảo mọi bên đồng thuận baseline trước khi thực thi.

### 16. Kế hoạch dự án có phải tài liệu viết một lần rồi để đó không?

**Trả lời:** Không. Đây là tài liệu sống; khi baseline thay đổi được chấp thuận, Product Owner và Scrum Master phải cập nhật tài liệu hoặc lưu quyết định trong hồ sơ Sprint tương ứng — như dòng xác nhận cuối tài liệu đã nêu rõ.

## Điều không nên nói

- Không đồng nhất Kế hoạch dự án với Định nghĩa quy trình phát triển phần mềm — chúng trả lời hai câu hỏi khác nhau.
- Không nói làm Agile/Scrum thì không cần lập Kế hoạch dự án.
- Không nói chi phí 0 VNĐ nghĩa là dự án không tốn nguồn lực — vẫn có 900 giờ-người effort.
- Không nói baseline (SP, effort, thời gian) do nhóm tự nghĩ ra ở bước lập Kế hoạch — nó kế thừa từ tài liệu Ước lượng dự án.
- Không nói kế hoạch chỉ lập một lần đầu dự án rồi không cập nhật.
- Không kể công cụ nhóm chưa dùng thật (Jira, MS Project, Jenkins...) nếu bản in không thể hiện.