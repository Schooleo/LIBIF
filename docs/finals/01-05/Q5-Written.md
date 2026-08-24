# Q5-Written — Tài liệu Kiến trúc Phần mềm (Software Architecture) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình đầu vào → đầu ra, giải thích WHAT và WHY.

## Mô hình cần vẽ

    ┌─────────────────────────────────────────────┐
    │              ĐẦU VÀO (Inputs)               │
    │  • Product Backlog (16 PBIs — yêu cầu kỹ   │
    │    thuật và nghiệp vụ đã xác nhận)          │
    └──────────────────────┬──────────────────────┘
                           │ Agent quyết định kiến trúc
                           ▼
    ┌─────────────────────────────────────────────┐
    │      ĐẦU RA — Software Architecture         │
    │                                             │
    │  [KIẾN TRÚC TỔNG THỂ]                       │
    │  Modular Monolith (NestJS)                  │
    │  ← không chọn Microservices vì quá phức tạp │
    │  cho nhóm nhỏ và tiến độ 10 tuần            │
    │                     ↓                       │
    │  [LUỒNG DỮ LIỆU — Pipe & Filter]            │
    │  Upload → OCR (Redis BullMQ) →              │
    │  Đối soát (Human-in-the-loop) →             │
    │  AES-256 MinIO → Index PostgreSQL           │
    │                     ↓                       │
    │  [BẢO MẬT DRM — Zero-Download 4 lớp]        │
    │  L1: MinIO Vault (file mã hóa AES-256)      │
    │  L2: Signed Token TTL 30s (không Presigned) │
    │  L3: RAM Decrypt → HTML5 Canvas (no DOM)    │
    │  L4: Watermark + Blur + Block F12 + AuditLog│
    │                     ↓                       │
    │  [TECH STACK]                               │
    │  Next.js / NestJS / PostgreSQL 16 /         │
    │  Redis+BullMQ / MinIO / Tesseract / Docker  │
    │                     ↓                       │
    │  [THUỘC TÍNH CHẤT LƯỢNG]                    │
    │  Bảo mật / Tương thích hạ tầng /            │
    │  Hiệu năng (<50ms render, <2s tìm kiếm) /   │
    │  Khả năng mở rộng                           │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
        Định hướng kỹ thuật cho toàn Sprint
        và là căn cứ cho Code Review / Security Review

## Giải thích

1. **Đầu vào**

   - WHAT: Product Backlog (16 PBIs) cung cấp yêu cầu kỹ thuật cụ thể — mỗi quyết định kiến trúc phải giải quyết ít nhất một PBI.
   - WHY: Kiến trúc không được tự nghĩ ra — mỗi quyết định phải có lý do từ yêu cầu hoặc ràng buộc thực tế.
2. **Quyết định kiến trúc tổng thể — Modular Monolith**

   - WHAT: Toàn bộ backend NestJS chạy cùng một tiến trình nhưng chia module rõ ràng (Auth, OCR, Review, DRM, Search, Audit).
   - WHY: Phù hợp ràng buộc 6 sinh viên, 10 tuần và chi phí tiền mặt 0 VNĐ — triển khai đơn giản qua Docker trên hạ tầng học tập/free-tier, gọi hàm nội bộ hiệu năng cao, ranh giới module sẵn sàng tách thành Microservices khi cần mở rộng.
3. **Luồng dữ liệu — Pipe & Filter với Human-in-the-loop**

   - WHAT: Upload → OCR nền (Redis BullMQ) → Đối soát bắt buộc (thủ thư) → AES-256 MinIO → Index PostgreSQL.
   - WHY: Bước đối soát là điểm kiểm soát chất lượng bắt buộc — không thể bỏ qua, không thể tự động hóa hoàn toàn vì đòi hỏi phán đoán của con người.
4. **Bảo mật DRM — Zero-Download 4 lớp**

   - WHAT: Lớp 1 — file mã hóa AES-256 trong MinIO; Lớp 2 — Signed Token TTL 30s thay Presigned URL; Lớp 3 — giải mã trên RAM, vẽ lên Canvas, DOM không có img/Blob; Lớp 4 — Watermark, blur, block F12/IDM, audit log.
   - WHY: Mỗi lớp chặn một vectơ tấn công riêng — kết hợp lại tạo rào cản đủ mạnh để giảm nguy cơ rò rỉ file gốc.
5. **Thuộc tính chất lượng (Quality Attributes)**

   - Bảo mật, tương thích hạ tầng sẵn có (100% tái sử dụng), hiệu năng (render <50ms/trang, tìm kiếm <2s), khả năng mở rộng (BullMQ tách OCR khỏi HTTP).

## Tại sao cần tạo tài liệu Kiến trúc Phần mềm?

Kiến trúc định hướng kỹ thuật để toàn nhóm làm việc song song mà không xung đột. Proof of Concept xác nhận luồng OCR tiếng Việt bất đồng bộ trước khi nhóm mở rộng quy trình số hóa — tránh phát hiện vấn đề chí mạng ở tuần 9–10.

**Kết luận:** Kiến trúc trả lời **"Làm bằng cách nào?"** và đảm bảo mọi quyết định kỹ thuật đều có căn cứ từ yêu cầu sản phẩm và ràng buộc thực tế.
