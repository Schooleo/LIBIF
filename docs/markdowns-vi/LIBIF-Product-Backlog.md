# LIBIF
## Hệ thống Số hóa Thư viện & Quản lý Tài liệu Thông minh

---

# TÀI LIỆU PRODUCT BACKLOG & TIÊU CHÍ NGHIỆM THU

> Kho lưu trữ tập trung các yêu cầu sản phẩm được cấu trúc dưới dạng User Story ánh xạ trực tiếp đến quy trình vận hành thư viện thực tế dành cho Thủ thư, Độc giả và Ban Quản lý; chi tiết hóa các Tiêu chí Nghiệm thu (AC) định lượng, Định nghĩa Hoàn thành (DoD) và Lộ trình Sprint.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh |
| **Phiên bản** | v2.0 (Đã đồng bộ với Tesseract OCR vie & Điều lệ Dự án) |
| **Ngày tạo** | 19 tháng 07 năm 2026 |
| **Tác giả** | Đội ngũ Kỹ thuật & Sản phẩm LIBIF |

---

## 1. TỔNG QUAN PRODUCT BACKLOG

Product Backlog đóng vai trò là nguồn thông tin xác thực duy nhất (single source of truth) cho các yêu cầu chức năng, định hướng đội ngũ kỹ thuật trải qua 4 Sprint phát triển. Các yêu cầu giải quyết trực tiếp các điểm đau của ba nhóm người dùng chính: **Thủ thư**, **Độc giả/Người mượn sách** và **Ban Quản lý Thư viện**.

### 1.1 Cấu trúc Yêu cầu
Mỗi hạng mục trong Backlog bao gồm:
- **Mã ID & Tiêu đề User Story:** Định danh duy nhất dùng để theo dõi commit mã nguồn và kịch bản kiểm thử (ví dụ: US-01, US-02...).
- **Mô tả User Story:** Định dạng chuẩn: *"Với tư cách là [Vai trò], tôi muốn [Hành động], Để [Lợi ích]"*.
- **Bước Quy trình Ánh xạ:** Liên kết trực tiếp tới điểm nghẽn thủ công hiện tại.
- **Tiêu chí Nghiệm thu (Acceptance Criteria - AC):** Các điều kiện kiểm thử định lượng, có thể xác minh được.

### 1.2 Định nghĩa Hoàn thành (Definition of Done - DoD)
Một User Story chỉ được đánh giá là "Hoàn thành" (Done) khi đáp ứng đầy đủ:
1. Mã nguồn sạch, tuân thủ các tiêu chuẩn lập trình, được xác minh qua Đánh giá Mã nguồn (Peer Review).
2. Các bài kiểm thử đơn vị (Unit tests) hoàn tất với độ bao phủ mã nguồn (Code Coverage) tối thiểu **80%**.
3. Triển khai tích hợp thành công trên môi trường Staging và không còn lỗi mức Blocker/Critical.
4. Tất cả các Tiêu chí Nghiệm thu (AC) định lượng đã được bộ phận QA xác minh.
5. Tài liệu kỹ thuật và đặc tả API được cập nhật đầy đủ.

---

## 2. EPIC 1: SỐ HÓA & QUẢN LÝ TÀI LIỆU

Tập trung vào các tính năng cho thủ thư, giải quyết tình trạng lưu trữ tệp phân mảnh và nhập liệu dữ liệu tả thủ công.

### US-01: Tải lên PDF Thô Quét từ Sách (Upload PDF Document)
- **Mô tả:** Với tư cách là Thủ thư, tôi muốn kéo và thả các tệp PDF thô để tập trung hóa tài sản sách quét.
- **Quy trình Ánh xạ:** Loại bỏ việc lưu tệp thủ công trên ổ cứng cá nhân hoặc Google Drive phân mảnh.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Giao diện kéo-thả hỗ trợ tải lên tệp PDF có dung lượng lên tới **200MB**.
  - **AC2:** Hiển thị thanh tiến trình tải lên theo thời gian thực với tỷ lệ phần trăm.
  - **AC3:** Xác thực định dạng tệp, từ chối các tệp không phải PDF với thông báo lỗi rõ ràng.
  - **AC4:** Các tệp được tải lên được lưu trữ an toàn trong Object Storage (MinIO/S3) và đường dẫn được ghi lại trong cơ sở dữ liệu.

### US-02: Nhập Metadata Thông minh qua ISBN (Smart Metadata Entry)
- **Mô tả:** Với tư cách là Thủ thư, tôi muốn nhập mã ISBN để tự động điền dữ liệu tả của sách.
- **Quy trình Ánh xạ:** Giải quyết việc nhập liệu Excel thủ công dễ phát sinh lỗi.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Ô nhập liệu tích hợp máy quét mã vạch qua camera hoặc máy quét cầm tay.
  - **AC2:** Nhấp nút "Tra cứu" sẽ gọi Google Books API, tự động điền Tên sách, Tác giả, Nhà xuất bản, Năm xuất bản và Tóm tắt nội dung.
  - **AC3:** Hiển thị thông báo "Không tìm thấy thông tin, vui lòng nhập thủ công" nếu tra cứu ISBN thất bại.
  - **AC4:** Thủ thư có thể chọn Thể loại từ danh sách xổ xuống và nhập các Thẻ (Tags) tìm kiếm tùy chỉnh.

### US-03: OCR Nền Bất đồng bộ & Nén Tệp (Background OCR & Compression)
- **Mô tả:** Với tư cách là Thủ thư, tôi muốn hệ thống tự động nén tệp PDF và chạy OCR để tài liệu có thể tìm kiếm toàn văn.
- **Quy trình Ánh xạ:** Khắc phục tình trạng tệp PDF dạng ảnh thô không thể tìm kiếm.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Việc nén tệp và chạy OCR được thực thi bất đồng bộ thông qua hàng chờ Redis + BullMQ.
  - **AC2:** Tệp PDF sau khi nén giảm dung lượng ít nhất **40%** trong khi vẫn đảm bảo độ rõ nét khi đọc.
  - **AC3:** Công cụ **Tesseract OCR (`vie`)** nhận dạng dấu tiếng Việt với độ chính xác tối thiểu **92%** trên các sách in tiêu chuẩn.
  - **AC4:** Lớp văn bản trích xuất được lưu vào cơ sở dữ liệu PostgreSQL để đánh chỉ mục tìm kiếm toàn văn.

---

## 3. EPIC 2: TÌM KIẾM & ĐỌC TRỰC TUYẾN

Tập trung vào các tính năng dành cho độc giả, cho phép tự phục vụ truy cập tài liệu số.

### US-04: Tìm kiếm Danh mục Trực tuyến (Online Catalog Search)
- **Mô tả:** Với tư cách là Độc giả, tôi muốn tìm kiếm sách theo tên sách, tác giả, thể loại và các thẻ.
- **Quy trình Ánh xạ:** Loại bỏ việc sinh viên phải nhắn tin hỏi thủ thư để kiểm tra tình trạng sách.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Cổng tìm kiếm cung cấp bộ lọc đa thuộc tính bên trái (Thể loại, Thẻ, Năm xuất bản).
  - **AC2:** Kết quả hiển thị dưới dạng lưới/danh sách với ảnh bìa, tên sách, tác giả, tóm tắt và trạng thái.
  - **AC3:** Thời gian phản hồi truy vấn tìm kiếm dưới **1,5 giây** đối với danh mục 10.000 cuốn sách.

### US-05: Tìm kiếm Nội dung Toàn văn (Full-Text Search)
- **Mô tả:** Với tư cách là Độc giả, tôi muốn tìm từ khóa bên trong nội dung trang sách để phục vụ nghiên cứu sâu.
- **Quy trình Ánh xạ:** Tận dụng lớp văn bản OCR được tạo tự động từ US-03.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Thanh tìm kiếm có tùy chọn bật/tắt "Tìm bên trong nội dung sách".
  - **AC2:** Kết quả hiển thị tên sách kèm trích đoạn văn bản được làm nổi bật (highlight).
  - **AC3:** Nhấp vào trích đoạn sẽ mở trình xem trực tuyến và chuyển hướng trực tiếp đến đúng trang sách đó.

### US-06: Trình xem PDF DRM Trực tuyến An toàn (Secure PDF Viewer)
- **Mô tả:** Với tư cách là Độc giả, tôi muốn đọc sách trực tuyến ngay trên trình duyệt mà không cần tải tệp về.
- **Quy trình Ánh xạ:** Ngăn ngừa rò rỉ bản quyền và tải xuống trái phép về máy cục bộ.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Trình xem render một cách động bằng HTML5 Canvas (PDF.js), ẩn hoàn toàn các thẻ liên kết tệp thô.
  - **AC2:** Vô hiệu hóa menu chuột phải, F12 DevTools, sao chép văn bản (Ctrl+C) và phím tắt in (Ctrl+P).
  - **AC3:** Quyền truy cập PDF thô được bảo mật bằng AWS S3 Presigned URL tạm thời hết hạn trong **15 phút** (và < 60 giây ở môi trường thực tế).
  - **AC4:** Tự động đánh dấu trang đang đọc dở cho các lần truy cập tiếp theo.

---

## 4. EPIC 3: QUẢN LÝ & THỐNG KÊ PHÂN TÍCH

Tập trung vào các báo cáo thống kê quản lý thư viện.

### US-07: Dashboard Báo cáo Thống kê (Statistics Dashboard)
- **Mô tả:** Với tư cách là Quản lý Thư viện, tôi muốn xem các biểu đồ phân tích về số sách đã số hóa, tổng lượt đọc và các thể loại phổ biến.
- **Quy trình Ánh xạ:** Thay thế việc đếm thủ công trên Excel cho các báo cáo cuối kỳ.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Dashboard hiển thị các KPI chính: Tổng số sách số hóa, Tổng lượt đọc, Số độc giả đăng ký.
  - **AC2:** Biểu đồ tròn biểu diễn cơ cấu thể loại và biểu đồ đường thể hiện xu hướng đọc theo tuần/tháng.
  - **AC3:** Có bộ lọc theo khoảng thời gian và khả năng xuất dữ liệu ra tệp Excel.

### US-08: Phân quyền & Quy trình Phê duyệt (Librarian Approval Workflow)
- **Mô tả:** Với tư cách là Quản trị viên, tôi muốn xem xét các cuốn sách đã số hóa trước khi xuất bản cho độc giả.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Sách tải lên được chuyển sang trạng thái "Bản nháp/Chờ phê duyệt" sau khi hoàn tất OCR.
  - **AC2:** Quản trị viên xem trước tệp PDF OCR và dữ liệu tả, nhấp "Phê duyệt" (Xuất bản) hoặc "Từ chối".
  - **AC3:** Việc từ chối bắt buộc nhập lý do và chuyển trạng thái về "Cần chỉnh sửa".

### US-09: Quản lý Thể loại & Thẻ (Category & Tag Management)
- **Mô tả:** Với tư cách là Thủ thư, tôi muốn quản lý các thể loại và thẻ để phân loại tài sản số.
- **Tiêu chí Nghiệm thu (AC):**
  - **AC1:** Quản lý thể loại theo cấu trúc cây hỗ trợ Thêm/Sửa/Xóa thể loại cha và thể loại con.
  - **AC2:** Cảnh báo nếu xóa một thể loại đang chứa sách, ngăn ngừa hỏng liên kết dữ liệu.
  - **AC3:** Quản lý thẻ tập trung giúp gộp các thẻ tìm kiếm bị trùng lặp.

---

## 5. LỘ TRÌNH SPRINT & PHÂN BỔ ƯU TIÊN (MoSCoW)

| Mốc thời gian | Danh sách User Story | Mức ưu tiên MoSCoW | Sản phẩm Mốc Bàn giao |
|---|---|:---:|---|
| **Sprint 1** <br>*(Tuần 1-2)* | • US-01: Tải lên PDF <br>• US-02: Metadata Thông minh <br>• Cấu hình Framework | **MUST HAVE** | Biểu mẫu tải tệp hoạt động và tự động điền metadata. |
| **Sprint 2** <br>*(Tuần 3-4)* | • US-03: Tesseract OCR & Nén tệp <br>• US-04: Danh mục Trực tuyến <br>• Xác thực & RBAC | **MUST HAVE** | Hàng chờ OCR nền ổn định, cổng danh mục trực tuyến hoạt động. |
| **Sprint 3** <br>*(Tuần 5-6)* | • US-05: Tìm kiếm Toàn văn <br>• US-06: Trình xem DRM An toàn <br>• US-08: Duyệt Sách | **MUST HAVE / SHOULD** | Trình xem an toàn chống tải về, tìm kiếm trích đoạn nội dung toàn văn. |
| **Sprint 4** <br>*(Tuần 7-8)* | • US-07: Dashboard Quản lý <br>• US-09: Quản trị Thể loại/Thẻ <br>• Kiểm thử QA & Sửa lỗi | **SHOULD HAVE / COULD** | Báo cáo phân tích quản lý thời gian thực, bản build hoàn chỉnh đã qua kiểm thử. |
