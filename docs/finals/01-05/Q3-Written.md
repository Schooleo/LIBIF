# Q3-Written — Tài liệu Điều lệ Dự án (Project Charter) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình đầu vào → đầu ra, giải thích WHAT và WHY.

## Mô hình cần vẽ

    ┌─────────────────────────────────────────────┐
    │              ĐẦU VÀO (Inputs)               │
    │  • Project Proposal đã phê duyệt            │
    │  • Project Vision & Scope đã phê duyệt      │
    └──────────────────────┬──────────────────────┘
                           │ Agent tổng hợp
                           ▼
    ┌─────────────────────────────────────────────┐
    │         ĐẦU RA — Project Charter            │
    │                                             │
    │  [VAI TRÒ các bên liên quan]                │
    │  GV: Người cho phép khởi động               │
    │  PO (TV-01): Quản lý phạm vi & backlog      │
    │  TL (TV-02): Scrum Master / Kỹ thuật        │
    │  TV-03 → TV-06: Dev, QA, DevOps             │
    │  TT: Đại diện thủ thư                       │
    │  SV: Đại diện sinh viên                     │
    │                     ↓                       │
    │  [MA TRẬN RACI]                             │
    │  R — Người trực tiếp thực hiện              │
    │  A — Người chịu trách nhiệm giải trình      │
    │      (mỗi công việc chỉ có đúng 1 chữ A)    │
    │  C — Người được tham vấn trước quyết định   │
    │  I — Người được thông báo kết quả           │
    │                     ↓                       │
    │  [MA TRẬN ẢNH HƯỞNG & QUYỀN LỢI]            │
    │  Ảnh hưởng cao / Quyền lợi cao:             │
    │    → Phối hợp chặt (GV, PO, TL)             │
    │  Ảnh hưởng cao / Quyền lợi thấp:            │
    │    → Duy trì hài lòng (Chủ sở hữu nội dung) │
    │  Ảnh hưởng thấp / Quyền lợi cao:            │
    │    → Thông tin thường xuyên (TV-03..06,     │
    │      đại diện thủ thư, sinh viên)           │
    │  Ảnh hưởng thấp / Quyền lợi thấp:           │
    │    → Theo dõi (Nhà cung cấp công cụ)        │
    │                     ↓                       │
    │  + Mục tiêu & Tiêu chí thành công           │
    │  + Mốc thực hiện M1–M5 (10 tuần)            │
    │  + Ràng buộc & Giả định                     │
    │  + Phân cấp quyền quyết định                │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
        Đầu vào cho Product Backlog và Sprint Planning

## Giải thích

1. **Đầu vào**

   - WHAT: Cần cả Proposal (mục tiêu, phạm vi, chi phí, rủi ro) và Vision & Scope (As-Is/To-Be, In/Out-Scope) để có đủ thông tin phân công trách nhiệm và lập mốc.
   - WHY: Charter không tự nghĩ ra mục tiêu — nó cụ thể hóa và ủy quyền những gì đã được đồng thuận trong 2 tài liệu trước.
2. **Vai trò các bên liên quan**

   - WHAT: 10 bên tham gia được xác định rõ vai trò: GV là người cho phép khởi động; PO quản lý ưu tiên và backlog; TL điều phối kỹ thuật; TV-03 đến TV-06 thực hiện phát triển và QA; TT và SV góp ý nghiệp vụ.
   - WHY: Mỗi người biết mình phải làm gì và khi nào cần được hỏi — tránh chồng chéo hoặc bỏ sót.
3. **Ma trận RACI**

   - WHAT: Mỗi công việc được gán R (thực hiện), A (giải trình — chỉ 1 người), C (tham vấn), I (thông báo).
   - WHY: Nguyên tắc quan trọng nhất: **mỗi hàng chỉ có đúng 1 chữ A** — nếu có 2 A thì không ai chịu trách nhiệm thật sự. RACI loại bỏ tình trạng "ai cũng làm một chút mà không ai chịu trách nhiệm cuối cùng".
4. **Ma trận Ảnh hưởng & Quyền lợi**

   - WHAT: Phân nhóm stakeholder theo 2 trục: mức ảnh hưởng (cao/thấp) và quyền lợi (cao/thấp) → 4 chiến lược tương tác khác nhau.
   - WHY: Giúp nhóm biết cần đầu tư giao tiếp nhiều nhất với ai (phối hợp chặt: GV, PO, TL) và ai chỉ cần thông báo định kỳ.

## Tại sao cần tạo tài liệu Project Charter?

Charter là văn bản chính thức xác lập mục tiêu, phân công trách nhiệm (RACI) và quyền quyết định. Không có Charter, nhóm không có căn cứ chung khi có xung đột ưu tiên hay cần từ chối yêu cầu vượt phạm vi.

**Kết luận:** Charter trả lời **"Ai làm gì? Khi nào? Ai có quyền quyết định?"** để nhóm vận hành có kỷ luật trong 10 tuần.
