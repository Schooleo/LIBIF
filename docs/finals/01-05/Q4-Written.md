# Q4-Written — Tài liệu Yêu cầu Phần mềm (Product Backlog) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình đầu vào → đầu ra, giải thích WHAT và WHY.

## Mô hình cần vẽ

    ┌─────────────────────────────────────────────┐
    │              ĐẦU VÀO (Inputs)               │
    │  • Vision & Scope (Gap Analysis +           │
    │    danh mục tính năng cấp cao)              │
    │  • Nhu cầu người dùng (thủ thư, độc giả,   │
    │    quản trị viên)                           │
    └──────────────────────┬──────────────────────┘
                           │ Agent tổng hợp
                           ▼
    ┌─────────────────────────────────────────────┐
    │         ĐẦU RA — Product Backlog            │
    │                                             │
    │  [CẤU TRÚC 5 EPICS / 16 PBIs]              │
    │  Epic 1: Số hóa & OCR     → PBI-01, 02, 03 │
    │  Epic 2: Kiểm duyệt       → PBI-04, 05, 06 │
    │  Epic 3: Xuất bản & Quyền → PBI-07, 08, 09 │
    │  Epic 4: Tìm kiếm & Canvas→ PBI-10..13     │
    │  Epic 5: Bảo mật & Nhật ký→ PBI-14, 15, 16 │
    │                     ↓                       │
    │  [MỖI PBI GỒM]                             │
    │  • User Story: Là... / Tôi muốn... / Để... │
    │  • Acceptance Criteria: Given-When-Then     │
    │  • Ưu tiên MoSCoW (Must/Should/Could/Won't) │
    │  • Phụ thuộc (Dependencies)                 │
    │                     ↓                       │
    │  [TỔNG KẾT]                                 │
    │  Must Have: 13 PBIs (81.25%)                │
    │  Should Have: 3 PBIs (18.75%)               │
    │  Chuỗi chính: PBI-01→02→04→05→07→11→14,16  │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
        Đầu vào cho Software Architecture
        và Sprint Planning

## Giải thích

1. **Đầu vào**
   - WHAT: Vision & Scope cung cấp 7 khoảng trống (Gap Analysis) và danh mục tính năng cấp cao đã được ưu tiên — đây là nguồn để phân rã thành Epics và PBIs. Nhu cầu người dùng bổ sung góc nhìn thực tế cho User Story.
   - WHY: Mọi PBI phải truy xuất nguồn gốc về một khoảng trống đã xác nhận — tránh xây tính năng không có căn cứ.

2. **Cấu trúc đầu ra — Mỗi PBI gồm 4 thành phần**
   - **User Story** ("Là... / Tôi muốn... / Để..."): xác định ai cần gì và mục đích kinh doanh. Ví dụ: "Là Thủ thư, Tôi muốn hệ thống tự động chạy Tesseract OCR ngầm, Để trích xuất văn bản mà không gián đoạn công việc khác."
   - **Acceptance Criteria** (Given-When-Then): tiêu chí nghiệm thu có thể kiểm thử được. Ví dụ: "Given file đã tải lên / When OCR hoàn tất / Then lưu văn bản thô và đổi trạng thái sang Chờ kiểm duyệt."
   - **Ưu tiên MoSCoW:** phân loại Must Have (bắt buộc để MVP chạy) / Should Have (nên có) / Could Have / Won't Have — bảo vệ tiến độ 10 tuần khi vận tốc chậm.
   - **Dependencies:** chuỗi phụ thuộc PBI-01→02→04→05→07→11 không thể đảo ngược, dùng để lập thứ tự Sprint.

3. **Tại sao cấu trúc này quan trọng?**
   - Dev biết code gì; QA biết test gì từ AC; PM theo dõi % PBIs Done; PO và khách hàng đọc được mà không cần biết kỹ thuật.

## Tại sao cần tạo tài liệu Product Backlog?

Backlog là nguồn sự thật duy nhất về những gì nhóm phải xây dựng. Thiếu Backlog, nhóm code theo ý cá nhân, QA không có tiêu chí kiểm thử và PM không thể đo tiến độ.

**Kết luận:** Backlog trả lời **"Làm gì cụ thể?"** với tiêu chí kiểm thử rõ ràng, thứ tự ưu tiên hợp lý và nguồn gốc truy xuất về Vision & Scope.
