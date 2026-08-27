# CÂU 6: CHỨNG MINH Ý TƯỞNG (PROOF OF CONCEPT)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Chứng minh ý tưởng (Proof of Concept) của nhóm. (Sinh viên nộp kèm bản in giao diện thể hiện đầu vào và đầu ra khi chạy mã nguồn Chứng minh ý tưởng của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Chứng minh ý tưởng (Proof of Concept) là gì?
* Là sản phẩm làm thử nghiệm nhỏ để chứng minh **công nghệ khó và rủi ro nhất có làm được thật hay không** trước khi đầu tư làm toàn bộ dự án.
* **Khác Prototype:** PoC kiểm tra **kỹ thuật bên trong** (mã nguồn có chạy được không); Prototype kiểm tra **giao diện bên ngoài** (người dùng bấm thử thế nào).

---

### B2. Các phương pháp chứng minh khả năng kỹ thuật?

| Phương pháp | Bản chất dễ hiểu | Khi nào dùng |
|---|---|---|
| **PoC** | Viết mã chạy thử nghiệm thật | Kiểm tra công nghệ cốt lõi *(Nhóm chọn)* |
| **Prototype** | Dựng giao diện tương tác bấm thử | Kiểm tra luồng thao tác người dùng |
| **Spike** | Đọc tài liệu, nghiên cứu ngắn hạn | Tìm hiểu so sánh trước khi chọn thư viện |
| **Benchmarking** | Đo đạc đối sánh hiệu năng | So sánh tốc độ với phần mềm khác |

---

### B3. Nhóm chọn bài toán gì làm PoC và tại sao?
* **Sản phẩm PoC:** Luồng **nhận dạng chữ (OCR) tiếng Việt chạy ngầm** cho file PDF scan bằng **Tesseract.js + Redis/BullMQ** (chi phí 0 VNĐ).
* **Lý do chọn:** Xử lý OCR rất nặng và tốn thời gian. Nếu để người dùng tải file lên rồi đứng chờ xử lý thì web sẽ bị đơ (treo request). Nhóm làm PoC để chứng minh việc **đẩy file vào hàng đợi và cho worker chạy ngầm dưới nền** là hoàn toàn mượt mà và khả thi.

---

### B4. Đầu vào và các bước thực hiện PoC của nhóm?
* **5 Đầu vào:** Yêu cầu Backlog + Kiến trúc tách luồng + File PDF scan tiếng Việt + Thư viện Tesseract.js `vie+eng` + Hạ tầng (Redis, MinIO, PostgreSQL).
* **5 Bước thực hiện:** 
  1. *Nhận diện rủi ro:* Nhận thấy OCR dễ làm treo server nếu chạy trực tiếp.
  2. *Tách luồng:* Tách riêng API nhận file và Worker chạy ngầm bằng hàng đợi Redis.
  3. *Lập trình OCR:* Cắt PDF thành ảnh 200 DPI và dùng Tesseract.js đọc chữ tiếng Việt.
  4. *Lưu kết quả:* Lưu nội dung chữ và cấu trúc JSON theo từng trang vào MinIO/PostgreSQL.
  5. *Đánh giá thực tế:* Chạy kiểm thử tự động với file PDF thật để đo đạc kết quả.

---

### B5. Phương pháp đánh giá PoC của nhóm thế nào?
Nhóm đánh giá bằng mã nguồn chạy thật qua lệnh `make test-worker` với **6 tiêu chí cơ bản**:
1. **Job worker hoàn tất:** Tải file lên là chạy ngầm xong mượt mà, web không bị đơ/lag.
2. **Kết quả OCR thật được lưu:** Đọc ra chữ tiếng Việt có dấu thật, không dùng chữ giả lập (hardcode).
3. **JSON giữ đúng số trang:** Tách đúng chữ của từng trang (trang 1, trang 2) để sau này đối soát.
4. **Job trùng chỉ xử lý một lần:** Bấm tải lên 2 lần thì hệ thống chỉ chạy OCR đúng 1 lần, không tốn tài nguyên.
5. **PDF lỗi thất bại an toàn:** Gặp file PDF hỏng thì báo lỗi an toàn, không sập server và không tạo file rác.
6. **Workspace tạm được dọn dẹp:** Nhận dạng xong tự động xóa sạch ảnh tạm, không làm tràn ổ cứng.

---

### B6. Tại sao cần làm sản phẩm PoC?
1. **Tránh rủi ro kỹ thuật:** Biết sớm công nghệ có chạy được không, tránh làm gần xong mới phát hiện lỗi.
2. **Thuyết phục Giảng viên và PO:** Có mã nguồn chạy thật và số liệu kiểm thử rõ ràng để phê duyệt.
3. **Làm chuẩn cho kiến trúc:** Định hình luồng xử lý ngầm bằng Redis/BullMQ cho các Sprint sau.
4. **Tự tin cam kết tiến độ:** Bài toán khó nhất đã làm được thì nhóm an tâm hoàn thành trong 10 tuần.

---

### B7. Sản phẩm PoC được dùng tiếp trong dự án như thế nào?
* Đưa thẳng mô-đun worker vào backend NestJS để xử lý tài liệu thật.
* Dữ liệu chữ tách theo từng trang được dùng để làm **Giao diện đối soát Side-by-side** cho thủ thư (Sprint 2).
* Nạp chữ nhận dạng vào **PostgreSQL** để phục vụ tính năng tìm kiếm toàn văn (Sprint 4).

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

```
[BÀI TOÁN KỸ THUẬT CỐT LÕI]
OCR tiếng Việt chạy ngầm cho PDF scan bằng Tesseract.js + Redis/BullMQ (0 VNĐ)
                                │
                                ▼
[5 ĐẦU VÀO] ──► [5 BƯỚC THỰC HIỆN]
• Product Backlog                1. Nhận diện rủi ro treo server
• Kiến trúc tách luồng           2. Tách API và Worker chạy ngầm
• File PDF scan tiếng Việt       3. PDF -> Cắt ảnh 200 DPI -> Tesseract.js
• Tesseract.js vie+eng           4. Lưu văn bản + JSON theo từng trang
• Redis / MinIO / PostgreSQL     5. Chạy kiểm thử tích hợp tự động
                                │
                                ▼
[6 TIÊU CHÍ ĐÁNH GIÁ]
• Job worker chạy ngầm hoàn tất   • Lưu đúng văn bản chữ tiếng Việt thật
• JSON lưu đúng cấu trúc số trang • Chống chạy trùng lặp tác vụ
• Báo lỗi an toàn khi file hỏng   • Tự động dọn dẹp ảnh tạm trên ổ cứng
                                │
                                ▼
[ỨNG DỤNG VÀO DỰ ÁN]
Đưa vào Backend NestJS -> Làm giao diện đối soát Side-by-side -> Nạp PostgreSQL tìm kiếm
```
