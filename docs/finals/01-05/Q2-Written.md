# Q2-Written — Tài liệu Tầm nhìn và Phạm vi Dự án (Vision & Scope) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình đầu vào → đầu ra, giải thích WHAT và WHY.

## Mô hình cần vẽ

    ┌─────────────────────────────────────────────┐
    │              ĐẦU VÀO (Inputs)               │
    │  • Project Proposal đã được phê duyệt       │
    └──────────────────────┬──────────────────────┘
                           │ Agent tổng hợp
                           ▼
    ┌─────────────────────────────────────────────┐
    │      ĐẦU RA — Vision & Scope                │
    │                                             │
    │  [As-Is — Hiện trạng]                       │
    │  Thủ thư: xử lý rời rạc bằng nhiều công cụ │
    │  Sinh viên: tìm theo nhan đề, nhận PDF      │
    │                     ↓ Gap Analysis          │
    │  [To-Be — Tương lai]                        │
    │  Thủ thư: Tải lên → OCR → Đối soát         │
    │           → Phê duyệt → Xuất bản            │
    │  Sinh viên: Tìm toàn văn → Chọn đúng trang │
    │             → Kiểm tra quyền → Đọc Canvas   │
    │                     ↓                       │
    │  [Phạm vi sản phẩm]                         │
    │  In-Scope: OCR, đối soát, mã hóa, phân     │
    │    quyền, Canvas, watermark, audit log      │
    │  Out-of-Scope: máy quét, bản quyền nội      │
    │    dung, ứng dụng di động, vận hành thật    │
    │                     ↓                       │
    │  [Tính năng ưu tiên]                        │
    │  Bắt buộc: OCR / Đối soát / Mã hóa /       │
    │    Canvas / Watermark / Audit log           │
    │  Nên có: Theo dõi hàng chờ / Nhảy trang /  │
    │    Screenshot blur                          │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
              Đầu vào cho Product Backlog

## Giải thích

1. **Đầu vào**

   - WHAT: Chỉ cần Project Proposal đã phê duyệt — Proposal cung cấp bài toán, mục tiêu và phạm vi sơ bộ để Agent mở rộng thành As-Is/To-Be và Gap Analysis.
   - WHY: Vision & Scope là bước làm rõ "làm gì" từ "tại sao làm" của Proposal, nên cần Proposal làm nền.
2. **Luồng As-Is và To-Be**

   - **As-Is (hiện trạng):** thủ thư dùng nhiều công cụ rời; sinh viên không tìm được toàn văn; tệp đã tải khó truy vết.
   - **To-Be (tương lai):** OCR chạy nền, đối soát song song, phân quyền tập trung, độc giả tìm và đọc qua Canvas.
   - WHY: Vẽ 2 luồng giúp nhóm thấy rõ khoảng cách cần lấp đầy, không xây tính năng "cho vui".
3. **Gap Analysis — Từ khoảng trống đến tính năng**

   - Bản quét không tìm được nội dung → **Tesseract OCR + tìm kiếm toàn văn**
   - Nhận dạng và sửa lỗi rời rạc → **Hàng chờ OCR + đối soát song song**
   - Thiếu bước kiểm soát trước xuất bản → **Phê duyệt / Từ chối + biên mục**
   - Chia sẻ trực tiếp tệp gốc → **Mã hóa AES-256 + Canvas Reader**
   - Bản sao khó truy nguồn → **Dynamic Watermark + Audit log**
   - WHY: Mỗi tính năng phải truy xuất về một khoảng trống thực tế — tránh xây tính năng không ai cần.
4. **In-Scope / Out-of-Scope**

   - Ghi rõ để tránh scope creep: bất kỳ yêu cầu nào không trong In-Scope đều cần quyết định chính thức trước khi thực hiện.

## Tại sao cần tạo tài liệu Vision & Scope?

Vision & Scope là cầu nối giữa lý do tồn tại (Proposal) và danh sách tính năng cụ thể (Backlog). Không có tài liệu này, nhóm không có căn cứ từ chối yêu cầu ngoài phạm vi và không biết tại sao mỗi tính năng tồn tại.

**Kết luận:** Vision & Scope trả lời **"Làm gì?"** và **"Không làm gì?"** để bảo vệ nhóm khỏi scope creep và giúp Product Backlog có nguồn gốc rõ ràng.
