# BÁO CÁO TÍNH KHẢ THI

## 1. Tóm tắt

Báo cáo được lập nhằm trả lời câu hỏi: **"Dự án có đáng đầu tư thực hiện không?"**

Nhóm đã phân tích **06 khía cạnh khả thi** dựa trên dữ liệu thực tế. Kết quả: cả 06 khía cạnh đều đạt mức **Khả thi** trở lên.

> **Khuyến nghị:** Phê duyệt quyết định **"GO"** — Chấp thuận khởi động dự án.

---

## 2. Bối cảnh & Mục tiêu

* Thư viện đại học và thư viện tỉnh/thành phố tại Việt Nam đang chịu áp lực chuyển đổi số rất lớn.
* Giải pháp hiện tại (thủ công, DSpace, Ex Libris Alma) đều không đáp ứng đồng thời: **số hóa có kiểm duyệt OCR** và **bảo vệ bản quyền số đa lớp**.
* **Mục tiêu báo cáo:** Đánh giá toàn diện thuận lợi và rủi ro → Cung cấp căn cứ ra quyết định **Làm tiếp hay Dừng lại** → Làm đầu vào cho Điều lệ dự án và Kế hoạch thực thi.

---

## 3. Dữ liệu Đầu vào

| STT | Nguồn dữ liệu | Nội dung đóng góp |
| :---: | :--- | :--- |
| **1** | Khảo sát thị trường & nghiệp vụ | Nhu cầu chuyển đổi số tại các trường đại học và thư viện tỉnh/thành phố. |
| **2** | Kết quả thực nghiệm PoC | Luồng OCR tiếng Việt bất đồng bộ bằng Tesseract.js, Redis/BullMQ, MinIO và PostgreSQL chạy được với dữ liệu thật. |
| **3** | Khảo sát Thủ thư | Phản hồi thực tế về giao diện đối soát hai màn hình. |
| **4** | Ước lượng nguồn lực | 10 tuần, 06 sinh viên ($15$ giờ/người/tuần), ngân sách tiền mặt 0 VNĐ. |
| **5** | Văn bản pháp lý | Luật Sở hữu trí tuệ, Luật An ninh mạng Việt Nam. |

---

## 4. Phân tích 06 Khía cạnh Khả thi

### 4.1 Kinh doanh
* Nhu cầu chuyển đổi số thư viện rất lớn; các giải pháp hiện tại không đáp ứng đồng thời OCR kiểm duyệt và bảo vệ bản quyền.
* Mô hình doanh thu linh hoạt: bán bản quyền đóng gói hoặc thu phí theo tài khoản.
* **Đánh giá:** **Khả thi cao.**

### 4.2 Kỹ thuật
* **Tesseract.js** mã nguồn mở với dữ liệu ngôn ngữ `vie+eng`, kết hợp worker Redis/BullMQ, chạy trong backend của nhóm.
* HTML5 Canvas, Web Crypto API hỗ trợ trình đọc mã hóa và chống tải file không cần plugin.
* PoC đã chứng minh worker có thể xử lý OCR tiếng Việt bất đồng bộ, lưu văn bản thật và dữ liệu theo từng trang (`LIBIF-Proof-Of-Concept.md`). Canvas DRM được đánh giá riêng trong tài liệu Kiến trúc.
* *Lưu ý:* Chống chụp màn hình trên Web chỉ đạt mức răn đe, không ngăn chặn $100\%$ thiết bị bên ngoài.
* **Đánh giá:** **Khả thi.**

### 4.3 Vận hành
* Quy trình mô phỏng đúng luồng truyền thống: Nhập kho → Biên mục → Kiểm tra → Phục vụ.
* Giao diện đối soát Side-by-side giúp thủ thư thao tác nhanh, không cần kỹ năng IT chuyên sâu.
* **Đánh giá:** **Khả thi cao.**

### 4.4 Tài chính

| Hạng mục | Cơ sở tính | Thành tiền (VNĐ) |
| :--- | :--- | ---: |
| Công sức 06 sinh viên | 900 giờ-người, không trả lương | 0 |
| Tesseract OCR | Mã nguồn mở, miễn phí | 0 |
| Production backend/database | Azure for Students | 0 |
| Production frontend | Vercel free tier | 0 |
| Staging access | Tailscale Funnel | 0 |
| Coding Agent | Subscription/free-tier sẵn có cho học tập | 0 |
| Tên miền, dữ liệu kiểm thử và phụ trợ | Subdomain/tài nguyên sẵn có | 0 |
| **Tổng ngân sách tiền mặt** |  | **0** |

* Toàn bộ phần mềm lõi và môi trường triển khai dùng mã nguồn mở, Azure for Students, Vercel, Tailscale Funnel và các free-tier sẵn có.
* **Đánh giá:** **Khả thi cao** — không phát sinh chi phí tiền mặt trong phạm vi đồ án học tập.

### 4.5 Tiến độ

| Sprint | Tuần | Mục tiêu | SP |
| :--- | :---: | :--- | ---: |
| Sprint 1 | 1 – 2 | Kiến trúc và luồng OCR cơ bản | 26 |
| Sprint 2 | 3 – 4 | Giao diện đối soát Side-by-side và phê duyệt | 28 |
| Sprint 3 | 5 – 6 | Mã hóa AES-256 và phân quyền truy cập | 29 |
| Sprint 4 | 7 – 8 | Tìm kiếm toàn văn, Canvas Reader và Watermark | 29 |
| Sprint 5 | 9 – 10 | Kiểm thử, nghiệm thu thực tế và đóng gói Docker | 24 |
|  |  | **Tổng** | **136** |

* Ưu tiên 13 tính năng bắt buộc (104 SP); 03 tính năng phụ (13 SP) là phạm vi co giãn nếu thiếu thời gian.
* **Đánh giá:** **Khả thi** — Cần kiểm soát tốc độ hoàn thành sau Sprint 1 & 2.

### 4.6 Pháp lý
* Tuân thủ Luật Sở hữu trí tuệ, Luật An ninh mạng Việt Nam.
* Có nhật ký hoạt động giúp thư viện giải trình minh bạch với cơ quan quản lý và chủ sở hữu bản quyền.
* Không cho phép xuất ngược file PDF gốc sau khi đã mã hóa vào kho số.
* **Đánh giá:** **Khả thi cao.**

---

## 5. Bảng Tổng hợp

| STT | Khía cạnh | Câu hỏi cốt lõi | Kết quả | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Kinh doanh | Thị trường có cần? | Nhu cầu lớn; thu phí linh hoạt. | **Khả thi cao** |
| **2** | Kỹ thuật | Có đủ công nghệ? | Luồng OCR tiếng Việt bất đồng bộ đã chạy được trong PoC; Canvas DRM có thiết kế kiến trúc riêng. | **Khả thi** |
| **3** | Vận hành | Thủ thư dùng được? | Side-by-side mô phỏng đúng thói quen, không cần đào tạo IT sâu. | **Khả thi cao** |
| **4** | Tài chính | Chi phí tầm tay? | 0 VNĐ tiền mặt nhờ Azure for Students, Vercel, Tailscale Funnel, mã nguồn mở và free-tier. | **Khả thi cao** |
| **5** | Tiến độ | 10 tuần làm kịp? | 136 SP / 5 Sprint; ưu tiên 13 tính năng bắt buộc. | **Khả thi** |
| **6** | Pháp lý | Vi phạm bản quyền? | Tuân thủ Luật Sở hữu trí tuệ; có nhật ký giải trình. | **Khả thi cao** |

---

## 6. Kết luận & Quyết định

Dự án khả thi về Kỹ thuật, Vận hành và Pháp lý. Trong phạm vi đồ án học tập, tổng ngân sách tiền mặt là 0 VNĐ nhờ Azure for Students, Vercel, Tailscale Funnel, Coding Agent subscription/free-tier và công nghệ mã nguồn mở. Các rủi ro chính được nhận diện và có phương án giảm thiểu.

> **QUYẾT ĐỊNH: Chấp thuận khởi động dự án (GO)**  
> Kết quả phân tích trở thành căn cứ để ký duyệt Điều lệ dự án (`LIBIF-Project-Charter.md`) và chuyển sang lập Kế hoạch thực thi.
