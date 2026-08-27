# Q5-Prepare — Chuẩn bị vấn đáp về Kiến trúc Phần mềm

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu quyết định kiến trúc hoặc thành phần cụ thể.
2. **Dẫn chứng LIBIF:** chỉ đúng module/layer trong bản in Architecture.
3. **Giá trị quản lý:** nói rủi ro hoặc lợi ích kỹ thuật được quyết định này giải quyết.

Điểm neo phải nhớ:

    ĐẦU VÀO: Product Backlog (16 PBIs) + Proof of Concept OCR + Ràng buộc (6 SV / 10 tuần / 0 VNĐ)
         ↓
    ĐẦU RA — Software Architecture gồm:
      Kiến trúc tổng thể: Modular Monolith (không Microservices)
        ↓
      Luồng dữ liệu: Pipe & Filter 5 bước + Human-in-the-loop
        ↓
      Bảo mật DRM: Zero-Download Canvas 4 lớp
        ↓
      Tech Stack: Next.js / NestJS / PostgreSQL / Redis+BullMQ / MinIO / Tesseract / Docker
        ↓
      Thuộc tính chất lượng: Bảo mật / Tương thích hạ tầng / Hiệu năng / Mở rộng

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Kiến trúc là gì?

**Trả lời:** Năm câu hỏi: (1) Đầu vào của kiến trúc là gì? (2) Kiến trúc tổng thể theo mô hình nào? (3) Luồng dữ liệu chạy như thế nào? (4) Bảo mật bản quyền được triển khai thế nào? (5) Các thuộc tính chất lượng được đảm bảo ra sao?

**LIBIF:** Đầu vào — Backlog 16 PBIs + PoC + ràng buộc; Modular Monolith; Pipe & Filter 5 bước; Zero-Download DRM 4 lớp; 4 thuộc tính chất lượng.

### 2. Tại sao chọn Modular Monolith thay vì Microservices?

**Trả lời:** Modular Monolith phù hợp 6 sinh viên, 10 tuần và ngân sách tiền mặt 0 VNĐ vì triển khai đơn giản qua Docker trên hạ tầng học tập/free-tier, gọi hàm nội bộ hiệu năng cao, ranh giới module sạch và có thể tách thành Microservices khi quy mô lớn.

**Microservices** quá phức tạp — thêm độ trễ RPC và chi phí hạ tầng không cần thiết cho bản mẫu.

### 3. Pipe & Filter Pipeline của LIBIF gồm những bước nào?

**Trả lời:** 5 bước: (1) Upload — tiếp nhận file, kiểm tra định dạng, lưu tạm MinIO; (2) OCR ngầm — Tesseract qua Redis + BullMQ, trích xuất văn bản và bounding box; (3) Đối soát — thủ thư kiểm tra và sửa lỗi trên giao diện kép; (4) Mã hóa AES-256 và lưu MinIO; (5) Index toàn văn vào PostgreSQL tsvector.

**Điểm đặc biệt:** Bước đối soát là Human-in-the-loop bắt buộc — thủ thư phải phê duyệt trước khi mã hóa.

### 4. Zero-Download Canvas DRM 4 lớp là gì?

**Trả lời:**
- Lớp 1 (MinIO Vault): File mã hóa AES-256-GCM theo chunk, không tồn tại dạng PDF mở trên server.
- Lớp 2 (Signed Token): Backend không cấp Presigned URL. Cấp Single-use Token TTL 30s và stream byte mã hóa qua API.
- Lớp 3 (RAM Decrypt): Web Crypto API giải mã trên RAM, vẽ lên HTML5 Canvas. DOM không chứa img/embed/Blob URL.
- Lớp 4 (Active Deterrence): Watermark "UserID + IP + Timestamp", Screenshot Blur, Block F12/IDM, Audit Log bất biến.

### 5. Tại sao MinIO được chọn làm Encrypted Vault?

**Trả lời:** MinIO là object storage chuẩn S3 tự host (self-hosted), nhóm đã có sẵn và không tốn thêm chi phí. Quan trọng hơn, không cấp Presigned URL ra ngoài — backend kiểm soát hoàn toàn luồng truy cập file mã hóa.

### 6. Tại sao Redis + BullMQ được dùng cho OCR?

**Trả lời:** OCR Tesseract tốn thời gian (vài giây đến vài phút tùy tài liệu). BullMQ tách luồng OCR khỏi HTTP request của người dùng — thủ thư không bị chờ; OCR chạy nền và báo trạng thái khi xong. Redis Lock cũng được dùng để đếm phiên đọc đồng thời.

### 7. PostgreSQL tsvector phục vụ tìm kiếm như thế nào?

**Trả lời:** Văn bản OCR sau khi chuẩn hóa được nạp vào cột tsvector trong PostgreSQL 16. Khi độc giả tìm kiếm, query dùng toàn văn index để tìm tài liệu và trang chứa từ khóa trong < 2 giây.

### 8. Tài liệu kiến trúc được sử dụng và cập nhật trong dự án như thế nào?

**Trả lời:** Kiến trúc được phê duyệt trước Sprint 1 để nhóm làm việc song song. Code Review kiểm tra PR có tuân thủ ranh giới module không. Cập nhật khi có quyết định kỹ thuật mới với lý do ghi rõ. Đính kèm trong bộ bàn giao để đội vận hành hiểu cách bảo trì.

### 9. Các Thuộc tính Chất lượng của kiến trúc LIBIF là gì?

**Trả lời:** Bốn thuộc tính: (1) Bảo mật — triệt tiêu 100% khả năng bắt link file gốc bằng IDM/F12; (2) Tương thích hạ tầng sẵn có — 100% tái sử dụng; (3) Hiệu năng — giải mã RAM < 50ms/trang, tìm kiếm < 2 giây; (4) Khả năng mở rộng — Redis BullMQ tách OCR khỏi HTTP.

### 10. Proof of Concept có vai trò gì trong kiến trúc?

**Trả lời:** PoC xác nhận PDF quét có thể được đưa vào Redis/BullMQ, xử lý OCR tiếng Việt ở worker nền và lưu văn bản thật theo từng trang. Kết quả này xác nhận tính khả thi của Pipe & Filter, đồng thời cung cấp dữ liệu cho đối soát và tìm kiếm; Canvas DRM được đánh giá như một quyết định kiến trúc riêng.

## Điều không nên nói

- Không nói Microservices là kiến trúc "tốt hơn" — với ràng buộc dự án, Modular Monolith là lựa chọn đúng.
- Không nói MinIO là cloud storage — MinIO là object storage tự host (self-hosted), không phụ thuộc AWS S3.
- Không nói Presigned URL MinIO được cấp cho client — đây là vi phạm nguyên tắc Zero-Download.
- Không nói Tesseract chạy đồng bộ trên HTTP request — OCR chạy nền qua hàng chờ Redis BullMQ.
- Không nói kiến trúc đảm bảo chống sao chép tuyệt đối — trình duyệt không thể ngăn chụp bằng thiết bị bên ngoài.
