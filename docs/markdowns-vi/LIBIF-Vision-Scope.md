# LIBIF
## Hệ thống Số hóa Thư viện & Quản lý Tài liệu Thông minh

---

# TÀI LIỆU TẦM NHÌN & PHẠM VI DỰ ÁN

> Phân tích toàn diện hiện trạng thủ công, từ đó suy ra các tính năng cốt lõi của hệ thống, thiết lập quy trình vận hành tự động tương lai và so sánh quy trình nghiệp vụ với quy trình thủ công, giải pháp doanh nghiệp thương mại và bộ công cụ tự dựng (DIY Stack).

---

| Trường | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Intelligent Library Digitization & Document Management System |
| **Loại tài liệu** | Project Vision & Scope Document (Tầm nhìn & Phạm vi Dự án) |
| **Trạng thái** | Phê duyệt v3.0 (Cấu trúc Hiện trạng/Tương lai & So sánh Quy trình) |
| **Ngày tạo** | 19 tháng 7, 2026 |
| **Đội ngũ phát triển** | 6 Sinh viên năm cuối, Khoa Khoa học & Kỹ thuật Máy tính — HCMUS |
| **Hỗ trợ kỹ thuật** | Antigravity AI Assistant · GitHub Copilot |

---

## 1. TỔNG QUAN & TẦM NHÌN DỰ ÁN

Hệ thống Số hóa Thư viện **LIBIF** giải quyết thách thức cấp thiết của các thư viện khoa/bộ môn trong việc chuyển đổi bộ sưu tập sách giấy thành tài sản số an toàn, có thể tìm kiếm (e-books, PDF). Hệ thống tự động hóa quy trình tải lên của thủ thư, xử lý nội dung bằng công cụ **Tesseract OCR (`vie`)** mã nguồn mở, quản lý danh mục tập trung và cung cấp cổng đọc trực tuyến an toàn cho độc giả.

### 1.1 Tuyên bố Tầm nhìn Cốt lõi
Trở thành một nền tảng quản lý số hóa thư viện toàn diện, bảo mật cao và tối ưu chi phí. **LIBIF** hướng tới xóa bỏ rào cản học tập vật lý, bảo tồn tài liệu học thuật quý hiếm và bảo vệ sở hữu trí tuệ, đồng thời thiết lập tiêu chuẩn chuyển đổi số cơ bản cho các cơ sở giáo dục.

### 1.2 Mục tiêu Chiến lược & Tác động
1. **Hiệu năng Vận hành:** Giảm **70%** thời gian nhập liệu thủ công của thủ thư, cắt giảm thời gian xử lý mỗi cuốn sách từ 45–60 phút xuống nạp tệp 1-click tự động.
2. **Truy cập Tức thì cho Sinh viên:** Xóa bỏ thời gian chờ thụ động, chuyển thời gian tiếp cận tài liệu từ **24–72 giờ** xuống truy cập tự phục vụ 24/7 tức thì.
3. **Bảo vệ Bản quyền:** Ngăn chặn rò rỉ PDF thô và phát tán tệp trái phép qua Zalo/Telegram nhờ DRM Canvas trên trình duyệt và Dấu chìm Động (MSSV + IP + Thời gian).
4. **Hiệu quả Kinh tế:** Duy trì chi phí vận hành đám mây dưới **~1,2 triệu – 2,0 triệu VNĐ/tháng** (~70,44 triệu VNĐ/năm), tiết kiệm hơn 80% so với phần mềm doanh nghiệp thương mại.

---

## 2. PHÂN TÍCH HIỆN TRẠNG (CURRENT STATE) & CÁC TÍNH NĂNG SUY RA

### 2.1 Hiện trạng: Quy trình Số hóa Thủ công
Hiện tại, các thư viện khoa đang vận hành một quy trình thủ công rời rạc và dễ phát sinh lỗi:
1. **Quét & Đặt tên Tệp Thủ công:** Nhân viên quét từng trang sách trên máy quét phẳng và đặt tên tệp PDF thủ công trên ổ cứng máy tính cục bộ.
2. **Nhập dữ liệu Excel Rời rạc:** Metadata (tên sách, tác giả, nhà xuất bản, ISBN) được gõ thủ công vào các tệp Excel cục bộ mà không có chuẩn hóa hay xác thực dữ liệu.
3. **Không có Xử lý OCR:** Tệp PDF sau khi quét chỉ là dạng ảnh tĩnh, khiến sinh viên và nghiên cứu sinh không thể tìm kiếm nội dung bên trong.
4. **Phân phối qua Nhắn tin Ad-hoc:** Sinh viên nhắn tin cho thủ thư qua Zalo/Email để xin tệp; thủ thư phải tìm kiếm trong ổ cứng máy tính tới 30 phút để tìm, đính kèm và gửi file PDF thô.
5. **Rò rỉ Bản quyền & Mù Mờ Chỉ số:** Tệp PDF thô gửi đi bị sao chép tự do trên mạng xã hội; ban quản lý hoàn toàn không có thông tin về chỉ số đọc hay tần suất sử dụng.

### 2.2 Suy ra các Tính năng Cốt lõi của Hệ thống LIBIF từ Bất cập Hiện trạng
Từ những điểm đau, tổn thất và lỗ hổng của hiện trạng thủ công, các tính năng cốt lõi của hệ thống **LIBIF** được suy ra trực tiếp:

| Bất cập Hiện trạng Thủ công | Tác động Vận hành & Tổn thất | Tính năng Hệ thống LIBIF Suy ra | Chỉ số Mục tiêu Tác động |
|---|---|---|---|
| Tệp PDF rải rác cục bộ, đặt tên tệp thủ công | Phân mảnh dữ liệu, thất thoát tài sản tài liệu | **Quản lý Tài sản Tập trung (DMS):** Lưu trữ S3 an toàn liên kết với bản ghi Postgres. | Đánh chỉ mục tập trung 100% |
| Nhập liệu Excel thủ công (15–20 phút/sách) | Thất thoát lao động, tỷ lệ lỗi nhập liệu cao | **Biểu mẫu Metadata Thông minh (US-02):** Tự động điền tên, tác giả, NXB qua Google Books ISBN API. | Giảm 80% thời gian nhập liệu |
| PDF dạng ảnh tĩnh không có lớp văn bản | Sinh viên không thể tìm kiếm nội dung trong sách | **Hàng chờ Tesseract OCR Bất đồng bộ (US-03):** Redis + BullMQ tạo lớp văn bản tiếng Việt (`vie`). | Độ phủ OCR toàn văn 100% |
| Sinh viên chờ thụ động qua Zalo/Email (24–72h) | Thất thoát truy cập, ảnh hưởng trực tiếp việc học | **Cổng Khám phá Trực tuyến (US-04, US-05):** Tìm kiếm danh mục & trích đoạn toàn văn 24/7. | Truy cập tự phục vụ 24/7 tức thì |
| Tải PDF thô qua email gây vi phạm bản quyền | Thất thoát bản quyền, rủi ro pháp lý cho nhà trường | **DRM Canvas Reader & Dynamic Watermark (US-06):** Render Canvas, presigned URL (< 60s), chống copy & chèn MSSV+IP. | 0% lộ PDF thô & truy vết 100% leak |
| Quản lý danh sách email thủ công | Gánh nặng quản trị lớn khi thêm email sinh viên | **Tích hợp SSO Trường (US-00):** Tự động hóa phân quyền đồng bộ với Single Sign-On trường & dữ liệu môn học. | Tự động hóa truy cập độc giả |
| Theo dõi mượn trên giấy / 0% chỉ số đọc | Không thể giải trình ngân sách mua sắm sách | **Dashboard Phân tích Thời gian thực (US-07):** Thống kê tự động tổng lượt đọc, thể loại hot, khung giờ peak. | Xuất báo cáo chỉ bằng 1 cú nhấp |

---

## 3. TRẠNG THÁI TƯƠNG LAI (FUTURE STATE) & QUY TRÌNH TỰ ĐỘNG HÓA

### 3.1 Trạng thái Tương lai: Quy trình Tự động hóa Toàn diện
Ở **Trạng thái Tương lai** mục tiêu, LIBIF chuyển đổi toàn bộ vòng đời số hóa thành một quy trình tự động hóa 5 bước thống nhất và an toàn:

```
[1. QUÉT SÁCH GIẤY]  →  [2. KÉO-THẢ TẢI LÊN]  →  [3. METADATA THÔNG MINH]  →  [4. HÀNG CHỜ OCR BẤT ĐỒNG BỘ]  →  [5. DRM CANVAS READER]
  (Máy quét phẳng)         (Nạp PDF thô)            (Tự động điền ISBN)            (Tesseract vie)             (Truy cập 24/7 an toàn)
```

1. **Bước 1 (Nạp tệp):** Thủ thư tải tệp PDF quét thô lên Trang Quản trị LIBIF chỉ bằng 1 thao tác kéo-thả.
2. **Bước 2 (Metadata):** Thủ thư quét hoặc nhập mã ISBN; hệ thống tự động điền 80% dữ liệu tả qua Google Books API.
3. **Bước 4 (OCR Bất đồng bộ & Nén):** Hệ thống đưa PDF vào hàng chờ nền Redis + BullMQ, chạy Tesseract OCR (`vie`) với tiền xử lý grayscale/thresholding và nén tệp > 50% mà không làm treo máy chủ web.
4. **Bước 4 (Xuất bản & Đánh chỉ mục):** Metadata tài liệu và lớp văn bản tìm kiếm được xuất bản lên Cổng Khám phá Trực tuyến với phân quyền theo vai trò.
5. **Bước 5 (Khám phá & Đọc Tự phục vụ An toàn):** Sinh viên tìm thấy tài liệu tức thì 24/7, đọc trực tiếp qua Trình xem DRM Canvas có phủ dấu chìm động (MSSV + IP + Thời gian), ngăn chặn hoàn toàn việc tải tệp PDF thô.

---

## 4. SO SÁNH QUY TRÌNH NGHIỆP VỤ

### 4.1 So sánh 1: Quy trình LIBIF Tương lai vs Quy trình Thủ công Hiện tại

| Bước Quy trình | Quy trình Thủ công Hiện tại | Quy trình LIBIF Trạng thái Tương lai | Cải tiến Vận hành |
|---|---|---|---|
| **Nạp tệp & Lưu trữ** | Ổ cứng cục bộ / Thư mục Google Drive cá nhân. | Lưu trữ đối tượng AWS S3 tập trung liên kết dữ liệu Postgres. | Xóa bỏ thất thoát tệp & lưu trữ phân mảnh. |
| **Nhập Metadata** | Gõ thủ công tên sách, tác giả, NXB vào Excel. | Quét/Nhập ISBN 1-click tự động điền qua Google Books API. | Giảm thời gian biên mục từ 20 phút xuống < 2 phút. |
| **Xử lý OCR** | Không có. PDF dạng ảnh không thể tìm kiếm. | Hàng chờ Tesseract OCR (`vie`) bất đồng bộ tự động với Redis + BullMQ. | Cho phép tìm kiếm từ khóa toàn văn. |
| **Khám phá & Truy cập** | Sinh viên nhắn thủ thư; chờ 24–72 giờ nhận PDF qua email/Zalo. | Tìm kiếm danh mục & đọc DRM trực tuyến tự phục vụ 24/7 tức thì. | Chuyển thời gian chờ từ 24–72h thành tức thì. |
| **Bảo mật & Bản quyền** | Gửi PDF thô qua email; bị sao chép tự do trên mạng xã hội. | Render HTML5 Canvas, URL hết hạn (< 60s), chống copy & phủ dấu chìm động. | Ngăn tải PDF thô & truy vết chụp màn hình. |
| **Phân tích Sử dụng** | Sổ theo dõi mượn thủ công; báo cáo giấy chậm trễ. | Dashboard phân tích thời gian thực theo dõi lượt đọc, giờ peak, thể loại. | Cung cấp dữ liệu ra quyết định chỉ bằng 1-click. |

---

### 4.2 So sánh 2: Quy trình LIBIF Tương lai vs Quy trình Đối thủ (Doanh nghiệp & Thương mại)

| Khía cạnh Quy trình | Hệ thống Mã nguồn mở (DSpace / Koha) | Phần mềm Thương mại Doanh nghiệp (Vebrary - Lạc Việt / Libol - Tinh Vân) | Quy trình LIBIF Trạng thái Tương lai |
|---|---|---|---|
| **Phạm vi & Mục tiêu Chính** | Lưu trữ luận văn Open Access (DSpace) hoặc quản lý mượn trả sách giấy (Koha). Áp dụng tại ĐHQG, Bách Khoa, Đà Lạt. | Quản lý thư viện chuẩn quốc tế (MARC21, Z39.50) cho các thư viện trung tâm đại học lớn. | Quản lý tài liệu số & đọc giáo trình an toàn cấp Khoa/Bộ môn. |
| **Nạp tệp & Biên mục** | Giao diện nạp phức tạp; yêu cầu PDF đã OCR sẵn. Gánh nặng máy chủ Solr/Tomcat. | Nhập thủ công nặng nề và các bước biên mục MARC21 phức tạp. | **Nạp tệp 1-Click**: Kéo-thả PDF + tự động điền ISBN & hàng chờ Tesseract OCR. |
| **Bảo mật & DRM** | ❌ **Không có DRM chống copy**: Chỉ kiểm soát đăng nhập; PDF tải về bị phát tán tự do. | ❌ Phân quyền phức tạp; thiếu DRM Canvas trên trình duyệt và dấu chìm động. | 🟢 **DRM Canvas + Dynamic Watermark**: Chặn tải về, chèn MSSV + IP để truy vết chụp màn hình. |
| **Chi phí & Gánh nặng** | Chi phí bảo trì IT mức trung bình. | ❌ **Chi phí rất cao**: 125M – 1,25 tỷ VNĐ/năm chi phí bản quyền và bảo trì. | 🟢 **ROI cao**: ~1,2M – 2,0M VNĐ/tháng chi phí đám mây; không tốn phí bản quyền cao. |

---

### 4.3 So sánh 3: Quy trình LIBIF Tương lai vs Các Công cụ Ad-Hoc / Google Drive & Email

| Vấn đề / Khía cạnh Quy trình | Google Drive / Email / Công cụ Ad-Hoc | Quy trình LIBIF Trạng thái Tương lai |
|---|---|---|
| **Kiểm soát Phân phối** | ❌ Tệp bị sao chép tự do & phát tán qua mạng xã hội | ✅ Đọc an toàn qua HTML5 Canvas trên trình duyệt, URL hết hạn (< 60s), không lộ PDF thô |
| **Tìm kiếm Toàn văn** | ❌ Chỉ tìm kiếm theo tên tệp; PDF dạng ảnh không thể tìm kiếm | ✅ Tìm kiếm từ khóa toàn văn OCR bên trong nội dung tài liệu với làm nổi bật trích đoạn |
| **Tốc độ Truy cập** | ❌ Phụ thuộc vào sự hiện diện của thủ thư (chờ đợi 24–72h) | ✅ Cổng tìm kiếm & đọc tài liệu tự phục vụ 24/7 tức thì |
| **Báo cáo Sử dụng** | ❌ Không có chỉ số đo lường hoặc theo dõi độc giả | ✅ Dashboard phân tích thời gian thực theo dõi tổng lượt đọc, giờ peak và thể loại |
| **Tuân thủ Bản quyền** | ❌ Không có biện pháp kỹ thuật; gây rủi ro pháp lý cho nhà trường | ✅ Bảo vệ DRM kỹ thuật tích hợp với đóng dấu chìm động (MSSV + IP + Thời gian) |

---

## 5. PHẠM VI DỰ ÁN MVP & LỘ TRÌNH SPRINT

### 5.1 Nằm trong Phạm vi MVP 8 tuần
- ✅ **Xác thực & SSO Trường (US-00):** Tích hợp Single Sign-On trường đại học & 3 vai trò — Thủ thư, Độc giả, Quản trị viên.
- ✅ **Nạp tệp PDF (US-01):** Tải lên PDF bằng kéo-thả vào lưu trữ đối tượng S3.
- ✅ **Metadata ISBN Thông minh (US-02):** Tích hợp Google Books API tự động điền.
- ✅ **Hàng chờ Tesseract OCR Bất đồng bộ (US-03):** Quy trình worker nền với Redis + BullMQ.
- ✅ **Tìm kiếm Danh mục Trực tuyến (US-04):** Bộ lọc đa thuộc tính (thể loại, thẻ, năm xuất bản).
- ✅ **Tìm kiếm Nội dung Toàn văn (US-05):** Tìm từ khóa bên trong lớp văn bản OCR.
- ✅ **Trình xem DRM Canvas & Dấu chìm Động (US-06):** Render Canvas trên trình duyệt, presigned URL hết hạn (< 60s), chống copy/in và phủ dấu chìm MSSV + IP + Thời gian.
- ✅ **Phân tích Quản lý (US-07):** Dashboard thống kê tổng lượt đọc và tình hình sử dụng thể loại.
- ✅ **Quy trình Duyệt của Quản trị viên (US-08):** Quy trình thủ thư xem xét và xuất bản tài liệu.
- ✅ **Quản trị Thể loại & Thẻ (US-09):** Quản lý cấu trúc cây danh mục phân cấp.

### 5.2 Nằm ngoài Phạm vi MVP
- ❌ Ứng dụng di động Native (iOS/Android — Chỉ hỗ trợ Web Responsive).
- ❌ Tích hợp các giao thức thư viện truyền thống (SIP2/Z39.50).
- ❌ Tự động phân loại sách bằng AI ngoài ISBN API.
- ❌ Cổng thanh toán thương mại điện tử.

---

## 6. YÊU CẦU HỆ THỐNG CỐT LÕI

### 6.1 Yêu cầu Chức năng Chính
- **FR1 (Hàng chờ PDF Bất đồng bộ):** Tách rời công đoạn xử lý OCR nặng bằng hàng chờ Redis + BullMQ worker để ngăn lỗi 504 timeout.
- **FR2 (Tìm kiếm Toàn văn):** Tìm kiếm từ khóa bên trong các lớp văn bản được tạo bởi OCR và làm nổi bật trích đoạn.
- **FR3 (Bảo vệ Bản quyền & DRM):** Trình xem DRM phải render các trang PDF dưới dạng điểm ảnh canvas, ẩn URL thô, chặn hành vi tải/sao chép và chèn dấu chìm động (MSSV, IP, Thời gian).
- **FR4 (Quản lý Truy cập Trường):** Tích hợp xác thực với Single Sign-On (SSO) trường đại học và dữ liệu môn học.

### 6.2 Yêu cầu Phi chức năng Chính
- **Độ sẵn sàng (Availability):** Khả năng hoạt động **99,9%** để hỗ trợ sinh viên học tập 24/7.
- **Hiệu năng (Performance):** Xử lý OCR & nén tệp nền đạt mức trung bình **< 5 giây/trang**.
- **Chi phí Vận hành Thấp:** Chạy trên máy chủ ảo đám mây (Cloud VM) tiêu chuẩn với mức phí **~1,2 triệu – 2,0 triệu VNĐ/tháng**.

---

## 7. KẾT LUẬN

Tài liệu **Tầm nhìn & Phạm vi Dự án** cập nhật xác định rõ ràng các điểm nghẽn của Hiện trạng thủ công và suy ra tất cả các tính năng cốt lõi của hệ thống LIBIF để đạt được Trạng thái Tương lai tự động hóa. Bằng cách cung cấp các so sánh quy trình nghiệp vụ toàn diện đối với quy trình thủ công, giải pháp doanh nghiệp thương mại và bộ công cụ tự dựng DIY, LIBIF chứng minh hiệu quả đầu tư (ROI) vượt trội, độ bảo mật DRM mạnh mẽ và tính khả thi kỹ thuật cao cho công tác số hóa thư viện đại học.
