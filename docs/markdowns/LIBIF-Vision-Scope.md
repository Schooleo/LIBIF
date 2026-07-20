# LIBIF
## Hệ thống Số hóa Thư viện Thông minh (Library Digitization & Document Management System)

---

# TÀI LIỆU TẦM NHÌN & PHẠM VI DỰ ÁN
### (PROJECT VISION & SCOPE)

> Tài liệu phân tích hiện trạng và quy trình nghiệp vụ thủ công của Thủ thư, Độc giả và Ban quản lý; đề xuất các tính năng cốt lõi và định hình trạng thái tương lai cho hệ thống Số hóa Thư viện.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh (Library Digitization System) |
| **Phiên bản** | v1.0 (Phân tích quy trình thủ công chi tiết) |
| **Ngày lập** | Ngày 10 tháng 07 năm 2026 |
| **Tác giả** | Nhóm phát triển dự án LIBIF |

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

Hệ thống Số hóa Thư viện ra đời nhằm giải quyết nhu cầu chuyển đổi kho sách vật lý đồ sộ của các trường đại học, viện nghiên cứu và thư viện cộng đồng thành các tài liệu số hóa (e-books, PDFs) có khả năng tra cứu, quản lý và đọc trực tuyến dễ dàng. Hệ thống không chỉ lưu trữ các tệp tin mà còn chuẩn hóa quy trình đăng tải của thủ thư, tự động xử lý nội dung tệp tin bằng công nghệ nhận dạng ký tự quang học (OCR) để nâng cao khả năng tra cứu và trải nghiệm học tập của độc giả.

### 1.1 Ý tưởng cốt lõi

Quy trình bắt đầu từ việc quét vật lý các quyển sách sang định dạng PDF thô. Thủ thư tải các file PDF này lên hệ thống và điền biểu mẫu thông tin sách (metadata bao gồm tên sách, danh mục, từ khóa/tags, mã ISBN, tác giả...). Hệ thống sau đó tự động hóa việc lưu trữ, tối ưu hóa tệp tin và cung cấp cổng tra cứu trực tuyến toàn văn cho độc giả.

---

## 2. TẦM NHÌN DỰ ÁN (PROJECT VISION)

Trở thành nền tảng quản lý tài liệu số hóa thư viện toàn diện, tin cậy và thông minh. **LIBIF** hướng tới việc xóa bỏ khoảng cách địa lý và vật lý, giúp tri thức trong các cuốn sách giấy cổ, quý hiếm hoặc tài liệu học thuật được bảo tồn lâu dài và phân phối rộng rãi dưới dạng số hóa bảo mật.

### 2.2 Chu trình số hóa khép kín của hệ thống

Hệ thống bao trùm toàn bộ các bước trong chuỗi giá trị số hóa thư viện:

```
[SCAN]        →  [UPLOAD]    →  [METADATA]   →  [PROCESS]      →  [ACCESS]
(Quét sách)     (Tải file)     (Ghi nhận)      (Xử lý & OCR)    (Độc giả đọc)
```

---

## 3. KHẢO SÁT HIỆN TRẠNG & QUY TRÌNH THỦ CÔNG (CURRENT STATES)

Quy trình quản lý và tiếp cận sách chưa số hóa hoặc số hóa tự phát hiện nay bộc lộ nhiều hạn chế nghiêm trọng đối với tất cả các bên tham gia:

### 3.1 Quy trình của Thủ thư (Librarian Workflow)

- **Quét sách & Lưu trữ:** Thủ thư dùng máy quét cầm tay hoặc máy quét phẳng chuyên dụng để quét từng trang sách giấy thành file PDF. File PDF này sau đó được lưu thủ công trên máy tính cá nhân của thủ thư hoặc tải lên Google Drive cá nhân/thư viện.
- **Quản lý thông tin (Metadata):** Thủ thư ghi nhận các thông tin bổ trợ như danh mục, mã ISBN, tác giả, tag từ khóa vào một file Excel quản lý riêng biệt hoặc sổ tay vật lý. Không có liên kết trực tiếp giữa thông tin này và file PDF đã quét.
- **Hỗ trợ độc giả:** Khi độc giả yêu cầu đọc tài liệu, thủ thư phải tìm kiếm tên sách trong file Excel, sau đó tìm file PDF tương ứng trên thư mục Google Drive rồi gửi qua email/Zalo cho độc giả.
- **⚠️ Hạn chế / Nỗi đau:** File PDF lưu trữ rời rạc, dễ thất lạc. Việc nhập liệu thủ công thông tin sách trên Excel tốn thời gian và dễ sai sót. Không có cơ chế kiểm duyệt chất lượng file tự động.

### 3.2 Quy trình của Độc giả / Người mượn sách (Borrower Workflow)

- **Yêu cầu tài liệu:** Độc giả phải đến trực tiếp thư viện hoặc gửi email/tin nhắn cho thủ thư để hỏi xem sách đã được số hóa chưa.
- **Tiếp cận & Đọc sách:** Độc giả chờ thủ thư phản hồi, nhận file PDF đính kèm qua email hoặc link tải xuống. Độc giả phải tải file về thiết bị cá nhân để đọc bằng phần mềm đọc PDF riêng.
- **⚠️ Hạn chế / Nỗi đau:** Độc giả bị động, phụ thuộc vào thời gian phản hồi của thủ thư. Không thể tìm kiếm trực tuyến. Tải file về máy làm tốn dung lượng lưu trữ cá nhân và vi phạm quy định bản quyền, dễ bị phát tán trái phép.

### 3.3 Quy trình của Ban Quản lý Thư viện (Management Workflow)

- **Báo cáo & Đánh giá:** Cuối kỳ, ban quản lý yêu cầu thủ thư tổng hợp số liệu để báo cáo về hiệu quả số hóa, số lượt mượn/đọc và danh sách tài liệu mới số hóa.
- **⚠️ Hạn chế / Nỗi đau:** Số liệu thống kê không chính xác do thủ thư đếm thủ công, báo cáo chậm trễ, không phản ánh đúng nhu cầu đọc thực tế của độc giả.

---

## 4. ĐỀ XUẤT TÍNH NĂNG TỪ KHẢO SÁT HIỆN TRẠNG

Dựa trên những khó khăn thực tế của các nhóm người dùng, các tính năng của hệ thống số hóa thư viện được xây dựng trực tiếp nhằm khắc phục các hạn chế đó:

| Khó Khăn Quy Trình Thủ Công | Tính Năng Tương Ứng Trên Hệ Thống |
|---|---|
| File PDF lưu trữ phân tán, mất liên kết với thông tin quản lý. | **Hệ thống quản lý tài liệu tập trung (DMS):** Upload file PDF liên kết trực tiếp với bản ghi dữ liệu sách. |
| Nhập thông tin danh mục, tag, ISBN thủ công trên Excel dễ sai sót. | **Biểu mẫu điền Metadata thông minh:** Hỗ trợ tự động điền thông tin tác giả, nhà xuất bản bằng cách tra cứu API Google Books qua ISBN. |
| Độc giả không tự tra cứu được sách số, phụ thuộc hoàn toàn vào thủ thư. | **Cổng tra cứu trực tuyến (Online Catalog):** Tìm kiếm sách nâng cao theo tên, tác giả, danh mục, tag và tìm kiếm nội dung (Full-text search). |
| Độc giả phải tải file PDF về máy cá nhân, tăng nguy cơ vi phạm bản quyền. | **Trình đọc PDF trực tuyến bảo mật (In-App PDF Viewer):** Đọc sách trực tuyến chống copy văn bản, chống download trái phép. |
| Ban quản lý thiếu số liệu chính xác để đánh giá hiệu quả số hóa. | **Mô-đun Báo cáo & Thống kê tự động:** Thống kê lượt đọc, thời gian đọc trung bình, danh mục sách phổ biến theo thời gian thực. |

---

### 4.2 SO SÁNH QUY TRÌNH NGHIỆP VỤ (WORKFLOW LEVEL) VỚI CÁC ĐỐI THỦ CẠNH TRANH

| Bước Nghiệp vụ | Quy trình Thủ công Hiện tại | Quy trình trên DSpace / Koha / Vebrary | Quy trình Tương lai trên **LIBIF** |
|---|---|---|---|
| **1. Tiếp nhận & Tải file** | Lưu file PDF thô vào ổ đĩa local/Google Drive cá nhân. | Tải file lên hệ thống mã nguồn mở qua giao diện quản trị phức tạp nhiều bước. | **Kéo-thả PDF thô lên Web Portal Admin**; hệ thống tự đẩy vào hàng đợi nén & lưu S3 an toàn. |
| **2. Nhập Metadata** | Ghi thủ công tên sách, tác giả, ISBN vào file Excel rời rạc. | Nhập thủ công theo chuẩn MARC21/Dublin Core phức tạp, tốn thời gian đào tạo. | **Quét/Nhập mã ISBN**: Hệ thống tự động gọi Google Books API điền 80% metadata. |
| **3. Xử lý OCR & Nén file** | Không có OCR. File dạng ảnh nặng, không tìm kiếm được text. | Phụ thuộc vào plugin bên ngoài (Batch OCR), cấu hình phức tạp, dễ gây quá tải server. | **Chạy tự động Pipe & Filter VietOCR Worker Queue** dưới nền; nén 50% dung lượng, tạo searchable text layer. |
| **4. Tra cứu & Đọc sách** | Độc giả phải hỏi thủ thư; nhận file qua email/Zalo. | Tra cứu qua OPAC, tải file PDF về máy local để đọc (dễ thất thoát bản quyền). | **Cổng Catalog trực tuyến**: Độc giả tìm kiếm toàn văn (Full-text) & đọc trực tiếp qua **DRM Canvas Reader** chống copy/download. |
| **5. Báo cáo & Giám sát** | Đếm thủ công số lượt mượn sách, báo cáo chậm trễ. | Thống kê lượt download file cơ bản, thiếu biểu đồ hành vi chi tiết. | **Dashboard thời gian thực**: Thống kê tự động tổng lượt đọc, thời gian đọc, danh mục yêu thích và xuất file Excel. |

---

### 4.3 SO SÁNH QUY TRÌNH NGHIỆP VỤ VỚI VIỆC KẾT HỢP CÁC CÔNG CỤ CÓ SẴN

| Bước Nghiệp vụ | Phương án Kết hợp (Nextcloud + Paperless-ngx + Google Drive) | Quy trình Tối ưu hóa trên **LIBIF** |
|---|---|---|
| **Quản lý & Lưu trữ File** | Phải cấu hình Sync 3 dịch vụ khác nhau; dữ liệu phân tán, dễ lỗi phân quyền. | **Một nền tảng duy nhất (All-in-one)**: Quản lý file PDF, Metadata, OCR và Phân quyền tập trung. |
| **Quy trình OCR Tiếng Việt** | Paperless-ngx dùng Tesseract OCR cơ bản; độ chính xác chữ tiếng Việt có dấu thấp (< 80%). | **Tích hợp VietOCR Deep Learning Model**: Độ chính xác chữ có dấu > 94%, xử lý tiếng Việt chuyên sâu. |
| **Bảo mật & DRM Sách số** | Google Drive / Nextcloud cho phép người dùng download file gốc hoặc xem qua Viewer mặc định. | **DRM Canvas Reader độc quyền**: Vẽ Canvas động, chặn chuột phải/phím tắt, Watermark mờ thông tin người đọc. |
| **Chi phí Vận hành & Bảo trì** | Cần đội ngũ IT riêng để duy trì, cập nhật và tích hợp 3 phần mềm rời rạc. | **Mô hình Modular Monolith tinh gọn**: Triển khai 1-Click với Docker, chi phí bảo trì tối ưu. |

---

## 5. TRẠNG THÁI TƯƠNG LAI (FUTURE STATE)

- **Quy trình của Thủ thư:** Chỉ cần quét sách thành PDF, đăng tải lên hệ thống qua trang admin. Hệ thống tự động tối ưu dung lượng và chạy OCR nhận diện văn bản. Thủ thư quét mã vạch/ISBN, hệ thống tự động điền các trường metadata, thủ thư chỉ cần bổ sung danh mục và tags.
- **Quy trình của Độc giả:** Truy cập cổng portal thư viện số trực tuyến, tự do tra cứu sách theo nhu cầu. Nhấp vào sách để đọc trực tuyến ngay lập tức với công nghệ PDF viewer bảo mật, thực hiện bookmark trang và ghi chú trực tiếp.
- **Quy trình của Ban quản lý:** Truy cập dashboard quản trị để theo dõi trực quan các chỉ số hoạt động của thư viện số hóa, dễ dàng đưa ra quyết định mua sắm hoặc số hóa tiếp theo.

---

## 6. PHẠM VI DỰ ÁN MVP (PROJECT SCOPE)

### 6.1 Nằm trong phạm vi phát triển (In-Scope for MVP)

- ✅ **Xác thực & phân quyền:** 03 nhóm người dùng gồm Thủ thư (Librarian), Độc giả (Reader), và Quản trị viên (Admin).
- ✅ **Tải lên tài liệu PDF:** Trang quản trị hỗ trợ thủ thư kéo thả tệp tin PDF thô lên máy chủ lưu trữ.
- ✅ **Nhập Metadata thông minh:** Form điền thông tin sách tích hợp API tra cứu mã ISBN của Google Books.
- ✅ **Cơ chế xử lý PDF nền:** Hàng đợi xử lý file tự động chạy nén hình ảnh và OCR ngôn ngữ Tiếng Việt/Tiếng Anh.
- ✅ **Cổng thông tin độc giả:** Giao diện web tìm kiếm sách, lọc theo danh mục, tag, năm xuất bản.
- ✅ **Trình đọc trực tuyến:** Tích hợp trình xem tài liệu trực tuyến, chặn chuột phải copy và chặn tải file trực tiếp.
- ✅ **Báo cáo thống kê cơ bản:** Đếm số lượt đọc sách, số trang đã đọc, sách được yêu thích nhất.

### 6.2 Ngoài phạm vi phát triển (Out-of-Scope)

- ❌ Ứng dụng di động (Mobile App native) cho iOS/Android (chỉ làm Web responsive).
- ❌ Tích hợp với hệ thống quản lý sách vật lý hiện tại của thư viện qua các giao thức cổ điển (như SIP2/Z39.50).
- ❌ Tự động nhận dạng và phân loại sách bằng AI dựa trên nội dung tệp tin (trừ ISBN API).
- ❌ Hệ thống thanh toán mua sách số trực tuyến.

---

## 7. YÊU CẦU HỆ THỐNG CỐT LÕI (REQUIREMENTS)

### 7.1 Yêu cầu chức năng tiêu biểu

- **FR1 (PDF Process Queue):** Hệ thống phải xếp hàng và xử lý bất đồng bộ các file PDF tải lên để không gây nghẽn kết nối của thủ thư.
- **FR2 (Full-text Search):** Hệ thống phải hỗ trợ tìm kiếm từ khóa xuất hiện bên trong nội dung sách đã được OCR.
- **FR3 (Copyright Protection):** Trình đọc PDF trực tuyến phải che giấu URL thật của tệp tin lưu trữ và vô hiệu hóa các lệnh tải tệp thông dụng.

### 7.2 Yêu cầu phi chức năng tiêu biểu

- **Tính sẵn sàng (Availability):** Hệ thống hoạt động ổn định **99.9%** thời gian để phục vụ nhu cầu đọc sách 24/7 của độc giả.
- **Hiệu năng xử lý PDF:** Hệ thống phải xử lý OCR và nén file PDF trung bình dưới **5 giây/trang sách** trong môi trường hàng đợi.

---

## 8. KẾ HOẠCH TRIỂN KHAI & KẾT LUẬN

Dự án được phân bổ trong **08 tuần phát triển Agile**. Với việc phân định rõ quy trình thủ công và thiết lập các tính năng tương ứng giải quyết triệt để nút thắt của Thủ thư và Độc giả, hệ thống số hóa thư viện hứa hẹn sẽ:

- Tối ưu hóa việc quản lý tri thức.
- Nâng tầm trải nghiệm người dùng học tập.
- Tiết kiệm **70% thời gian** xử lý thủ tục giấy tờ của thư viện.

---

*DÙNG CHO NỘI BỘ LIBIF — Trang 1 / 6*
