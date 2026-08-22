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
* **Sản phẩm:** Mô-đun **OCR Tiếng Việt 300 DPI** bằng **Tesseract + OpenCV** ($0$ VNĐ).
* **Lý do:** OCR là đầu vào của toàn bộ luồng (OCR hỏng → cả hệ thống dừng) + Tiếng Việt có dấu phức tạp + Ảnh scan dễ nghiêng/nhiễu cần tiền xử lý + Cần tọa độ Bounding Box cho Side-by-side + Chứng minh mã nguồn mở đủ tốt.

---

### B4. Đầu vào và các bước thực hiện PoC?
* **5 Đầu vào:** Product Backlog + Đề xuất dự án + Kiến trúc Pipe & Filter + 20 trang scan mẫu + Tesseract/OpenCV.
* **5 Bước:** 1. Xác định mục tiêu → 2. Cài đặt môi trường → 3. Lập trình chuỗi xử lý (Ảnh → Tiền xử lý → OCR → Text & BBox) → 4. Thử nghiệm trên 20 trang → 5. Đánh giá & đóng gói báo cáo.

---

### B5. Tại sao cần PoC?
1. **Giảm rủi ro kỹ thuật** — phát hiện sớm hạn chế xử lý dấu tiếng Việt.
2. **Thuyết phục các bên** — số liệu đo đạc thực tế cho Product Owner và Giảng viên.
3. **Định hình kiến trúc** — cơ sở thiết kế Pipe & Filter và hàng chờ Redis/BullMQ.
4. **Hỗ trợ ước lượng** — căn cứ cam kết tiến độ 10 tuần.
5. **Tăng tự tin đội ngũ** — bài toán khó nhất đã giải quyết xong.

---

### B6. PoC đã dùng trong dự án thế nào?
* Đóng gói thành mô-đun Backend NestJS + hàng chờ **Redis/BullMQ** xử lý OCR ngầm.
* Dữ liệu Bounding Box dùng xây **Giao diện đối soát Side-by-side** (Sprint 2).
* Nạp văn bản vào **PostgreSQL** (`tsvector`) phục vụ tìm kiếm toàn văn (Sprint 4).
* Định hướng kế hoạch Sprint và làm nền tảng tài liệu Kiến trúc, Ước lượng.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

```
[BÀI TOÁN KỸ THUẬT CỐT LÕI]
OCR Tiếng Việt từ ảnh scan 300 DPI bằng Tesseract Engine + OpenCV (0 VNĐ)
                                │
                                ▼
[5 ĐẦU VÀO] ──► [5 BƯỚC THỰC HIỆN]
• Backlog (PBI-01, 02, 04)      1. Xác định mục tiêu
• Đề xuất dự án (Mục 6.2)       2. Cài đặt môi trường
• Kiến trúc Pipe & Filter       3. Lập trình chuỗi: Ảnh -> Tiền xử lý -> OCR -> Text & BBox
• 20 trang scan mẫu 300 DPI     4. Thử nghiệm trên 20 trang mẫu
• Tesseract + OpenCV            5. Đánh giá & lập báo cáo
                                │
                                ▼
[PHƯƠNG PHÁP ĐÁNH GIÁ]
• Độ chính xác ký tự            • Tốc độ xử lý 
• Khớp Bounding Box             • Nhận dạng dấu tiếng Việt
• Tiền xử lý ảnh                • Hàng chờ Redis
                                │
                                ▼
[ỨNG DỤNG VÀO DỰ ÁN]
Chuyển giao vào NestJS + Redis/BullMQ -> Xây Side-by-side UI -> Nạp PostgreSQL tsvector (Sprint 1-3)
```
