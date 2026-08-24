# Câu 12 — Phát biểu công việc (Statement of Work) của LIBIF

## Sơ đồ cần vẽ (quá trình hình thành SOW)

    7 tài liệu đầu vào:
    Charter, Vision&Scope, Product Backlog,
    Architecture, PoC, Project Estimation, Project Planning
                        │
                        ▼
            B1. Mục đích & bối cảnh                              [Purpose]
                        │
                        ▼
            B2. Mục tiêu công việc                               [Objectives]
                        │
                        ▼
            B3. Phạm vi công việc [Product Backlog]              [Scope of work]
                        │
                        ▼
            B4. Sản phẩm bàn giao                                [Deliverables schedule]
                        │
                        ▼
            B5. Tiêu chí chấp nhận                               [Acceptance criteria]
                        │
                        ▼
            B6. Lịch trình & Milestone                          [Period of performance]
                        │
                        ▼
            B7. Nguồn lực, phân công, ngân sách                 [Specialized requirements]
                        │
                        ▼
            B8. Giả định/Phụ thuộc/Ràng buộc, Trách nhiệm các bên, [Assumptions,
                Quy trình nghiệm thu, Quản lý thay đổi              Change management]
                        │
                        ▼
            B9. Quyền sở hữu & AI, Điều kiện hoàn tất             [Applicable standards]

    ⇒ Kết quả: LIBIF-Statement-Of-Work.md — thỏa thuận phạm vi công việc học phần

## Giải thích ngắn (WHAT / WHY cho từng bước)

1. **Mục đích & bối cảnh**
   - WHAT: SOW là "bản mô tả chính thức các yêu cầu tối thiểu cần thực hiện" (tham chiếu Slide 06: *WHAT, not HOW*); LIBIF nêu rõ đây là thỏa thuận phục vụ quản lý/đánh giá học phần, không phải hợp đồng thương mại.
   - WHY: Tránh hiểu nhầm về tính pháp lý; xác lập đúng vai trò của tài liệu trong bối cảnh đồ án.

2. **Mục tiêu công việc**
   - WHAT: Mục tiêu sản phẩm (MVP số hóa–kiểm duyệt–xuất bản–tìm kiếm–đọc an toàn) và mục tiêu học tập (thực hành Scrum, quản lý phạm vi/tiến độ/rủi ro, dùng AI có trách nhiệm).
   - WHY: Trả lời **Objectives of the work** trong mô hình SOW của slide.

3. **Phạm vi công việc**
   - WHAT: 8 gói công việc (WP-01→08) ánh xạ tới 16 PBI + 3 enabler; bảng chức năng có mức ưu tiên Must/Should; phạm vi co giãn 13 SP (PBI-03, 13, 15); danh sách rõ ràng "ngoài phạm vi" (không SLA, không pentest chuyên nghiệp, không mobile app...).
   - WHY: Trả lời **Scope of work**; ranh giới rõ giúp tránh scope creep và là cơ sở đánh giá "đủ/chưa đủ" cuối kỳ.

4. **Sản phẩm bàn giao**
   - WHAT: DEL-01 (tài liệu khởi tạo) → DEL-08 (báo cáo & demo cuối kỳ), mỗi deliverable có nội dung tối thiểu, hình thức và thời hạn cụ thể.
   - WHY: Trả lời **Deliverables schedule**; biến "sẽ làm gì" thành "sẽ nộp gì, khi nào, dạng gì" — đo lường được.

5. **Tiêu chí chấp nhận**
   - WHAT: AC-01→08 cho sản phẩm (luồng end-to-end, mã hóa, giới hạn phiên, tìm kiếm, Canvas Reader, không lộ URL gốc, không lỗi Critical, cài đặt được) và PM-AC-01→06 cho quản lý dự án (có baseline, có 5 Sprint bằng chứng, có theo dõi đóng góp, có Risk/Issue/Change record, có tái ước tính, dùng AI đúng quy định); có mục riêng nêu rõ giới hạn của tiêu chí bảo mật.
   - WHY: Trả lời **Acceptance criteria**; là ranh giới khách quan giữa "Done" và "chưa Done", tránh tranh cãi cảm tính lúc nghiệm thu.

6. **Lịch trình & Milestone**
   - WHAT: 5 Sprint/Milestone G1→G5 lấy đúng từ `LIBIF-Project-Planning.md`, có deadline cứng cuối tuần 10.
   - WHY: Trả lời **Period of performance**; SOW không tạo lịch mới mà cam kết hóa lịch đã có trong Kế hoạch dự án.

7. **Nguồn lực & Ngân sách**
   - WHAT: 6 vai trò với trách nhiệm chính, 900h danh nghĩa/765h tập trung, ngân sách 0 VNĐ (Azure for Students, AI free-tier).
   - WHY: Trả lời phần **Specialized requirements**; xác nhận ai làm gì và bằng nguồn lực nào, khớp với Ước lượng dự án.

8. **Trách nhiệm, nghiệm thu, thay đổi**
   - WHAT: Trách nhiệm của nhóm sinh viên/PO/Scrum Master/Giảng viên (Sec. 11); quy trình nghiệm thu 8 bước từ owner tự kiểm tra đến giảng viên đánh giá (Sec. 12); bảng thẩm quyền xử lý 6 loại thay đổi (Sec. 13).
   - WHY: Trả lời **Change management process**; đảm bảo mọi thay đổi phạm vi có ghi nhận chính thức, không "thỏa thuận miệng".

9. **Quyền sở hữu/AI, điều kiện hoàn tất, ký xác nhận**
   - WHAT: Quy định về bản quyền dữ liệu mẫu, minh bạch sử dụng Coding Agent (Sec. 14); điều kiện SOW được coi là hoàn tất (Sec. 15); 4 vai trò ký xác nhận phạm vi (Sec. 16).
   - WHY: Trả lời **Applicable standards**; SOW chỉ đóng khi đủ điều kiện khách quan, không tự động hết hạn theo thời gian

## SOW khác gì Đề xuất dự án và Ước lượng dự án về thời gian/chi phí?

| Tài liệu | Vai trò về thời gian/chi phí | Độ chính xác |
| :--- | :--- | :--- |
| **Đề xuất dự án (Proposal)** | Ước lượng sơ bộ ban đầu để thuyết phục "có nên làm hay không" | Thấp nhất — như Rough Order of Magnitude, có thể sai lệch nhiều lần |
| **Ước lượng dự án (Estimate)** | Ước lượng kỹ thuật dựa trên WBS/backlog để tạo baseline (136 SP, 900h, 0 VNĐ) | Trung bình — vẫn có thể tái ước tính khi có thêm thông tin |
| **Phát biểu công việc (SOW)** | **Không tạo số liệu mới** — lấy đúng baseline từ Estimate/Planning rồi **cam kết hóa** thành lịch trình (Sec. 7), ngân sách (Sec. 9) chính thức để nghiệm thu | Cao nhất về tính cam kết — là con số "đóng băng" dùng làm căn cứ đánh giá, thay đổi phải qua quy trình Change Request |
