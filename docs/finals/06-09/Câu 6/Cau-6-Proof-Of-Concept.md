# CÂU 6: CHỨNG MINH Ý TƯỞNG (PROOF OF CONCEPT)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Chứng minh ý tưởng (Proof of Concept) của nhóm. (Sinh viên nộp kèm bản in giao diện thể hiện đầu vào và đầu ra khi chạy mã nguồn Chứng minh ý tưởng của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Chứng minh ý tưởng (Proof of Concept) là gì?
* Sản phẩm thử nghiệm kỹ thuật quy mô nhỏ, chứng minh giải pháp công nghệ cốt lõi/rủi ro cao nhất là **khả thi** trước khi triển khai toàn diện.
* **Khác Prototype:** PoC kiểm chứng **kỹ thuật bên trong**; Prototype kiểm chứng **giao diện bên ngoài**.

---

### B2. Các phương pháp chứng minh khả năng kỹ thuật?

| Phương pháp | Bản chất | Khi nào dùng |
|---|---|---|
| **PoC** | Viết mã chạy thực nghiệm | Kiểm chứng công nghệ cốt lõi *(Nhóm chọn)* |
| **Prototype** | Dựng giao diện tương tác | Kiểm chứng luồng thao tác người dùng |
| **Spike** | Nghiên cứu lý thuyết ngắn hạn | So sánh trước khi chọn công nghệ |
| **Benchmarking** | Đo đạc đối sánh hiệu năng | Đánh giá so với tiêu chuẩn ngành |

---

### B3. Nhóm chọn gì làm PoC và tại sao?
* **Sản phẩm:** Luồng **OCR tiếng Việt bất đồng bộ** cho PDF quét bằng **Tesseract.js + Redis/BullMQ + NestJS worker** với chi phí tiền mặt 0 VNĐ.
* **Lý do:** OCR là đầu vào của tìm kiếm và đối soát; tác vụ tốn CPU nên không thể giữ request tải lên chờ xử lý. PoC cần chứng minh worker nền có thể nhận job, OCR dữ liệu thật và lưu kết quả theo từng trang.

---

### B4. Đầu vào và các bước thực hiện PoC?
* **5 Đầu vào:** Product Backlog + Kiến trúc Pipe & Filter + PDF quét tiếng Việt + Tesseract.js `vie+eng` + Redis/MinIO/PostgreSQL.
* **5 Bước:** 1. Xác định rủi ro → 2. Tách API và worker → 3. Render trang PDF 200 DPI và OCR → 4. Lưu text + JSON theo trang → 5. Chạy kiểm thử tích hợp và đánh giá.

---

### B5. Tại sao cần PoC?
1. **Giảm rủi ro kỹ thuật** — phát hiện sớm hạn chế xử lý dấu tiếng Việt.
2. **Thuyết phục các bên** — mã nguồn và kiểm thử tích hợp cung cấp bằng chứng thực tế cho Product Owner và Giảng viên.
3. **Định hình kiến trúc** — cơ sở thiết kế Pipe & Filter và hàng chờ Redis/BullMQ.
4. **Hỗ trợ ước lượng** — căn cứ cam kết tiến độ 10 tuần.
5. **Tăng tự tin đội ngũ** — bài toán khó nhất đã giải quyết xong.

---

### B6. PoC đã dùng trong dự án thế nào?
* Đóng gói thành mô-đun Backend NestJS + hàng chờ **Redis/BullMQ** xử lý OCR ngầm.
* Dữ liệu văn bản theo trang dùng xây **Giao diện đối soát Side-by-side**.
* Nạp văn bản vào **PostgreSQL** (`tsvector`) phục vụ tìm kiếm toàn văn (Sprint 4).
* Định hướng kế hoạch Sprint và làm nền tảng tài liệu Kiến trúc, Ước lượng.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

```
[BÀI TOÁN KỸ THUẬT CỐT LÕI]
OCR tiếng Việt bất đồng bộ cho PDF quét bằng Tesseract.js + Redis/BullMQ (0 VNĐ)
                                │
                                ▼
[5 ĐẦU VÀO] ──► [5 BƯỚC THỰC HIỆN]
• Product Backlog                1. Xác định rủi ro OCR
• Kiến trúc Pipe & Filter        2. Tách API và worker nền
• PDF quét tiếng Việt            3. PDF -> ảnh 200 DPI -> Tesseract.js
• Tesseract.js vie+eng           4. Lưu text + JSON theo trang
• Redis/MinIO/PostgreSQL         5. Chạy kiểm thử tích hợp
                                │
                                ▼
[PHƯƠNG PHÁP ĐÁNH GIÁ]
• Job worker hoàn tất           • Kết quả OCR thật được lưu
• JSON giữ đúng số trang        • Job trùng chỉ xử lý một lần
• PDF lỗi thất bại an toàn      • Workspace tạm được dọn dẹp
                                │
                                ▼
[ỨNG DỤNG VÀO DỰ ÁN]
NestJS + Redis/BullMQ -> OCR text theo trang -> Side-by-side review -> PostgreSQL tsvector
```
