# LIBIF
## Hệ thống Số hóa Thư viện Thông minh (Library Digitization & Document Management System)

---

# DANH SÁCH YÊU CẦU SẢN PHẨM & TIÊU CHÍ NGHIỆM THU
### (PRODUCT BACKLOG & ACCEPTANCE CRITERIA)

> Tài liệu tập hợp danh sách yêu cầu sản phẩm (Product Backlog) được ánh xạ trực tiếp từ quy trình nghiệp vụ thực tế của Thủ thư, Độc giả và Ban quản lý; chi tiết hóa các User Stories, Tiêu chí nghiệm thu (Acceptance Criteria) và Kế hoạch lộ trình Sprint.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh (Library Digitization System) |
| **Phiên bản** | v1.0 (Tài liệu Yêu cầu Sản phẩm & Nghiệm thu chuẩn hóa) |
| **Ngày lập** | Ngày 10 tháng 07 năm 2026 |
| **Tác giả** | Đội ngũ phát triển dự án LIBIF |

---

## 1. TỔNG QUAN PRODUCT BACKLOG

Product Backlog là tài liệu trung tâm tập hợp toàn bộ các yêu cầu chức năng dưới dạng User Stories (Câu chuyện người dùng), đóng vai trò làm kim chỉ nam cho đội ngũ phát triển trong suốt các chu kỳ Sprint. Tài liệu này được xây dựng dựa trên sự ánh xạ trực tiếp từ các "nút thắt" và quy trình thủ công của 03 nhóm người dùng tương tác chính: **Thủ thư (Librarian)**, **Độc giả (Borrower/Reader)** và **Ban quản lý (Management)**.

### 1.1 Cơ chế phân loại và cấu trúc yêu cầu

Mỗi hạng mục yêu cầu trong Backlog được cấu trúc chặt chẽ bao gồm:
- **User Story ID & Tên yêu cầu:** Mã định danh duy nhất để theo dõi mã nguồn và kịch bản kiểm thử (ví dụ: US-01, US-02...).
- **Mô tả User Story:** Cấu trúc tiêu chuẩn: *"Là [Vai trò], Tôi muốn [Hành động], Để [Lợi ích]"*.
- **Quy trình nghiệp vụ liên quan:** Liên kết trực tiếp tới bước quy trình thô ở hiện trạng cần cải tiến.
- **Tiêu chí nghiệm thu (Acceptance Criteria - AC):** Tập hợp các điều kiện kiểm thử kiểm chứng tính đúng đắn của tính năng dựa trên phương pháp định lượng cụ thể.

### 1.2 Định nghĩa hoàn thành chung (Definition of Done - DoD)

Một User Story chỉ được coi là hoàn tất ("Done") và sẵn sàng bàn giao khi đáp ứng đầy đủ các tiêu chuẩn chất lượng sau:
1. Mã nguồn được viết sạch, tuân thủ các tiêu chuẩn lập trình của đội ngũ và được Review chéo (Peer Review).
2. Đã hoàn thành kiểm thử Unit Test với độ bao phủ (Coverage) tối thiểu là **80%**.
3. Chạy thử nghiệm tích hợp trên môi trường Staging thành công, không có lỗi chặn (Blocker/Critical).
4. Được kiểm thử QA xác nhận đáp ứng đầy đủ tất cả các Tiêu chí nghiệm thu (AC) ghi trong tài liệu này.
5. Tài liệu hướng dẫn sử dụng và cập nhật API (nếu có) được hoàn thiện.

---

## 2. EPIC 1: SỐ HÓA & QUẢN LÝ TÀI LIỆU (DIGITIZATION)

Epic này tập trung vào các tính năng phục vụ cho quy trình đăng tải sách của **Thủ thư**, giải quyết vấn đề quản lý file rời rạc và nhập metadata thủ công.

### US-01: Tải lên file PDF sách đã quét (PDF Document Upload)
- **Mô tả:** Là một Thủ thư, tôi muốn kéo thả tệp tin PDF thô lên hệ thống, để lưu trữ tập trung tài liệu đã số hóa.
- **Quy trình liên quan:** Khắc phục bước "Quét sách & Lưu trữ" thủ công trên các ổ đĩa cá nhân/Google Drive rời rạc.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Giao diện kéo thả trực quan hỗ trợ tải lên file PDF có dung lượng tối đa lên đến **200MB**.
  - **AC2:** Hệ thống hiển thị thanh tiến độ tải lên theo thời gian thực (real-time progress bar) kèm theo phần trăm.
  - **AC3:** Hệ thống thực hiện kiểm định định dạng tệp tin. Nếu tệp tin không phải định dạng PDF, từ chối và báo lỗi rõ ràng.
  - **AC4:** Tệp tin sau khi tải lên thành công được lưu trữ an toàn trong Object Storage (MinIO/S3) và ghi nhận đường dẫn vào CSDL.

### US-02: Nhập Metadata thông minh qua mã ISBN (Smart Metadata Entry)
- **Mô tả:** Là một Thủ thư, tôi muốn nhập mã ISBN của sách để hệ thống tự động tìm kiếm và điền thông tin mô tả sách.
- **Quy trình liên quan:** Giải quyết nút thắt "Nhập dữ liệu thủ công dễ sai sót trên Excel".
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Giao diện cung cấp ô nhập mã ISBN có tích hợp đầu đọc mã vạch/barcode qua camera di động hoặc máy quét cầm tay.
  - **AC2:** Khi nhấn "Tra cứu", hệ thống gọi API Google Books. Nếu tìm thấy, tự động điền các trường: Tên sách, Tác giả, Nhà xuất bản, Năm xuất bản, Tóm tắt nội dung.
  - **AC3:** Nếu không tìm thấy, hệ thống hiển thị thông báo *"Không tìm thấy thông tin, vui lòng tự điền"* và cho phép nhập thủ công.
  - **AC4:** Thủ thư có thể lựa chọn phân loại Danh mục (Category) từ menu thả xuống và nhập thêm các từ khóa liên quan (Tags).

### US-03: Xử lý tối ưu hóa & OCR bất đồng bộ (Background OCR & Compression)
- **Mô tả:** Là một Thủ thư, tôi muốn hệ thống tự động nén dung lượng file PDF và chạy OCR để độc giả có thể tìm kiếm toàn văn.
- **Quy trình liên quan:** Khắc phục hạn chế sách thô dạng ảnh không thể tìm kiếm nội dung.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Tác vụ nén và OCR được thực hiện hoàn toàn bất đồng bộ thông qua hàng đợi Redis + BullMQ.
  - **AC2:** File PDF sau khi nén phải giảm dung lượng tối thiểu **40%** so với file thô ban đầu nhưng vẫn đảm bảo độ nét chữ đọc được.
  - **AC3:** Bộ quét OCR nhận diện chữ tiếng Việt có dấu chính xác tối thiểu **92%** đối với sách in tiêu chuẩn.
  - **AC4:** Trích xuất toàn bộ lớp văn bản (text layer) lưu vào CSDL PostgreSQL để phục vụ chỉ mục tìm kiếm (Full-text Search).

---

## 3. EPIC 2: TRA CỨU & ĐỌC TRỰC TUYẾN (DISCOVERY)

Epic này tập trung vào các tính năng phục vụ cho **Độc giả / Người mượn sách**, giúp tăng khả năng tự tiếp cận tri thức số mà không cần qua thủ quỹ hay thủ thư.

### US-04: Cổng tra cứu sách trực tuyến (Online Catalog Search)
- **Mô tả:** Là một Độc giả, tôi muốn tra cứu sách theo tên, tác giả, danh mục, tag để tìm sách mong muốn nhanh nhất.
- **Quy trình liên quan:** Giải quyết việc độc giả phải nhắn tin/email hỏi thủ thư xem sách đã số hóa chưa.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Cổng tra cứu có bộ lọc đa thuộc tính bên trái: lọc theo Danh mục, lọc theo Tags, lọc theo Năm xuất bản.
  - **AC2:** Kết quả tìm kiếm hiển thị dạng danh sách/lưới gồm ảnh bìa sách, tên sách, tác giả, mô tả ngắn và trạng thái.
  - **AC3:** Tốc độ trả về kết quả tìm kiếm danh mục dưới **1.5 giây** với cơ sở dữ liệu quy mô 10,000 cuốn sách.

### US-05: Tìm kiếm toàn văn nội dung sách (Full-text Search)
- **Mô tả:** Là một Độc giả, tôi muốn tìm kiếm một từ khóa xuất hiện bên trong các trang sách để nghiên cứu nội dung chuyên sâu.
- **Quy trình liên quan:** Tận dụng kết quả xử lý OCR bất đồng bộ ở US-03.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Ô tìm kiếm hỗ trợ chế độ chọn "Tìm kiếm trong nội dung sách" (Full-text search).
  - **AC2:** Kết quả tìm kiếm hiển thị tên sách kèm theo đoạn trích ngắn (snippet) chứa từ khóa được bôi đậm (highlight).
  - **AC3:** Khi nhấp vào kết quả, hệ thống mở trình xem sách trực tuyến và nhảy trực tiếp đến trang chứa từ khóa đó.

### US-06: Trình xem sách PDF trực tuyến bảo mật (Secure PDF Viewer)
- **Mô tả:** Là một Độc giả, tôi muốn đọc sách trực tuyến ngay trên trình duyệt web mà không cần tải file về máy.
- **Quy trình liên quan:** Giải quyết rò rỉ bản quyền và hạn chế độc giả tải tệp PDF về máy cá nhân.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Trình đọc xem sách hiển thị trực tiếp trên trình duyệt sử dụng thư viện Canvas động (ví dụ: PDF.js), không nhúng tệp gốc.
  - **AC2:** Vô hiệu hóa tính năng bấm chuột phải, vô hiệu hóa phím tắt F12, sao chép văn bản (Ctrl+C) và phím tắt in ấn (Ctrl+P).
  - **AC3:** Đường dẫn tệp tin PDF gốc được bảo mật qua liên kết tạm thời Presigned URL có thời hạn hết hiệu lực là **15 phút**.
  - **AC4:** Hệ thống tự động ghi nhớ trang đang đọc dở (bookmark tự động) để độc giả tiếp tục đọc trong lần đăng nhập sau.

---

## 4. EPIC 3: BÁO CÁO THỐNG KÊ & QUẢN TRỊ (MANAGEMENT)

Epic này giải quyết nhu cầu thống kê số liệu của **Ban quản lý** thư viện để đánh giá hiệu quả số hóa.

### US-07: Dashboard báo cáo hoạt động số hóa (Statistics Dashboard)
- **Mô tả:** Là một Quản lý Thư viện, tôi muốn xem biểu đồ thống kê về số sách số hóa, số lượt đọc, danh mục yêu thích để đánh giá.
- **Quy trình liên quan:** Khắc phục việc thủ thư đếm thủ công trên Excel để làm báo cáo cuối kỳ.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Dashboard hiển thị các chỉ số đo lường chính (KPIs): Tổng số sách đã số hóa, tổng số lượt đọc, tổng số độc giả đăng ký.
  - **AC2:** Cung cấp biểu đồ tròn phân tích tỷ lệ đọc giữa các Danh mục sách và biểu đồ đường thể hiện xu hướng đọc theo tuần/tháng.
  - **AC3:** Cho phép lọc số liệu thống kê theo khoảng thời gian tùy chọn (Date Picker) và xuất dữ liệu báo cáo ra file Excel.

### US-08: Quản lý quyền truy cập và kiểm duyệt (Librarian Approval Workflow)
- **Mô tả:** Là một Quản trị viên, tôi muốn kiểm duyệt chất lượng sách số hóa trước khi xuất bản lên cổng thông tin độc giả.
- **Quy trình liên quan:** Đảm bảo chất lượng sách số trước khi phát hành.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Sách sau khi tải lên và OCR xong ở trạng thái "Chờ phê duyệt" (Draft/Pending Approval) và chưa hiển thị với độc giả.
  - **AC2:** Thủ thư kiểm duyệt có thể xem trước (Preview) file PDF đã OCR, kiểm tra metadata và bấm "Phê duyệt" (Publish) hoặc "Từ chối".
  - **AC3:** Khi bị từ chối, hệ thống yêu cầu nhập lý do từ chối và chuyển trạng thái về "Cần chỉnh sửa" (Rejected).

### US-09: Quản lý Danh mục và thẻ Tags (Category & Tag Management)
- **Mô tả:** Là một Thủ thư, tôi muốn quản trị danh mục và tags của thư viện để cấu trúc kho sách số một cách khoa học.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC1:** Cung cấp màn hình quản trị danh mục dạng cây thư mục (Tree structure) hỗ trợ Thêm, Sửa, Xóa danh mục cha/con.
  - **AC2:** Hệ thống cảnh báo nếu thủ thư xóa một danh mục đang chứa sách số hóa bên trong, ngăn chặn mất mát liên kết dữ liệu.
  - **AC3:** Cung cấp màn hình quản lý tags từ khóa tập trung, cho phép gộp các tags trùng lặp để chuẩn hóa dữ liệu tìm kiếm.

---

## 5. PHÂN BỔ MỨC ĐỘ ƯU TIÊN VÀ LỘ TRÌNH PHÁT TRIỂN (SPRINT ROADMAP)

Để bàn giao sản phẩm đúng thời hạn 08 tuần, Product Backlog được phân bổ thứ tự ưu tiên dựa trên phương pháp **MoSCoW** (Must, Should, Could, Won't Have) và chia tách thành 4 Sprints phát triển (mỗi Sprint kéo dài 02 tuần):

| Thời Gian | Hạng Mục User Story | Mức Độ Ưu Tiên | Kết Quả Đạt Được (Milestone) |
|---|---|:---:|---|
| **Sprint 1** <br>*(Tuần 1-2)* | • US-01: Upload PDF <br>• US-02: Nhập Metadata <br>• Thiết lập khung dự án | **MUST HAVE** <br>*(Bắt buộc)* | Tính năng tải file và biểu mẫu nhập metadata sách hoàn chỉnh. |
| **Sprint 2** <br>*(Tuần 3-4)* | • US-03: OCR & Nén file <br>• US-04: Cổng Catalog <br>• Phân quyền người dùng | **MUST HAVE** <br>*(Bắt buộc)* | Quy trình chạy OCR dưới nền ổn định, cổng tra cứu sách trực tuyến hoạt động. |
| **Sprint 3** <br>*(Tuần 5-6)* | • US-05: Tìm kiếm nội dung <br>• US-06: Trình xem bảo mật <br>• US-08: Phê duyệt sách | **MUST HAVE / SHOULD** | Trình xem trực tuyến bảo mật chống tải, tìm kiếm toàn văn nội dung sách. |
| **Sprint 4** <br>*(Tuần 7-8)* | • US-07: Dashboard quản lý <br>• US-09: Quản trị tags/danh mục <br>• Kiểm thử QA & Sửa lỗi | **SHOULD HAVE / COULD** | Dashboard thống kê hoạt động số hóa, bàn giao hệ thống đã qua kiểm thử. |

---

## 6. KẾT LUẬN (CONCLUSION)

Tài liệu Product Backlog này đã liên kết chặt chẽ các nút thắt của hiện trạng nghiệp vụ thư viện thô sang các yêu cầu phần mềm chi tiết. Sự rõ ràng của các User Stories và tính định lượng của Tiêu chí nghiệm thu (Acceptance Criteria) đóng vai trò làm thước đo chính xác để đội ngũ phát triển và bộ phận QA phối hợp hiệu quả, đảm bảo bàn giao hệ thống số hóa thư viện chất lượng cao, đúng tiến độ 08 tuần đề ra.
