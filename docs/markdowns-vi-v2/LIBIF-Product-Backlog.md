# YÊU CẦU SẢN PHẨM & BACKLOG (PRODUCT BACKLOG)

**Tên dự án:** Hệ thống Thư viện Số Thương mại & Quản lý Bản quyền Số (Commercial Digital Library System)  
**Tên tài liệu:** `docs/markdowns-vi-v2/LIBIF-Product-Backlog.md`  
**Nguồn chiếu chính (Source of Truth):** Tài liệu Tầm nhìn & Phạm vi Dự án (`docs/markdowns-vi-v2/LIBIF-Project-Vision-Scope.md`)  
**Ngôn ngữ tài liệu:** Tiếng Việt  
**Tình trạng:** Bản hoàn thiện chính thức (Approved Product Backlog)  

---

## 1. Tổng quan & Ma trận Nguồn gốc Yêu cầu (Traceability Matrix Summary)

Product Backlog này thương mại hóa các khả năng nghiệp vụ của hệ thống thư viện số, đảm bảo $100\%$ tính năng đều truy xuất nguồn gốc (Traceability) trực tiếp từ **Quy trình Vận hành Tương lai (Future-State Workflow)** và giải quyết các bài toán kinh doanh đã xác định trong tài liệu *Project Vision & Scope*.

### Tóm tắt Ma trận Vết (Workflow Step $\rightarrow$ Epic $\rightarrow$ Features):

| Bước Quy trình Tương lai (Future-State Step) | Epic Tương ứng | Danh mục Tính năng (Feature ID) | Số lượng PBIs |
| :--- | :--- | :--- | :---: |
| **Bước 1: Số hóa (Upload & Preprocessing)** | **Epic 1: Số hóa & Nhận dạng Văn bản** | FE-01: Quản lý Số hóa & OCR Tesseract | 2 |
| **Bước 2: Tesseract OCR ngầm** | **Epic 1: Số hóa & Nhận dạng Văn bản** | FE-01: Quản lý Số hóa & OCR Tesseract | 2 |
| **Bước 3: Kiểm duyệt Side-by-side UI** | **Epic 2: Kiểm duyệt & Biên mục Dữ liệu Số** | FE-02: Giao diện Đối soát Side-by-side | 3 |
| **Bước 4: Mã hóa & Phân quyền Xuất bản** | **Epic 3: Quản lý Xuất bản & Phân quyền Kho số** | FE-07: Phân quyền & Giới hạn Đọc đồng thời | 3 |
| **Bước 5: Khai thác An toàn (Canvas Reader)** | **Epic 4: Tra cứu & Trình đọc An toàn** | FE-03: Tìm kiếm Toàn văn<br>FE-04: HTML5 Canvas Reader An toàn | 4 |
| **Bảo vệ Đa lớp (Cross-cutting Security)** | **Epic 5: Giám sát, Bảo mật & Nhật ký** | FE-05: Watermarking Động<br>FE-06: Răn đe Chụp màn hình<br>FE-08: Nhật ký Hoạt động (Audit Trail) | 3 |

---

## 2. Chi tiết Product Backlog Theo Epics

---

### Epic 1: Số hóa & Nhận dạng Văn bản (Digitization & Tesseract OCR)
> **Mục tiêu:** Tự động hóa khâu tiếp nhận file quét và trích xuất chữ viết ngầm bằng Tesseract OCR Engine, giảm $70\%$ thời gian xử lý thủ công ban đầu.

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-01** |
| **Epic** | Epic 1: Số hóa & Nhận dạng Văn bản |
| **Feature Liên quan** | **FE-01: Quản lý Số hóa & OCR Tesseract** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** tải lên gói file ảnh (JPEG/PNG) hoặc PDF thô từ máy quét theo từng cuốn sách,<br>**Để** hệ thống khởi tạo hồ sơ số hóa và sẵn sàng cho tiến trình nhận dạng. |
| **Quy trình Nghiệp vụ** | Quy trình Số hóa & Tải tài liệu thô |
| **Bước Quy trình Tương lai** | **Bước 1: Số hóa (Upload & Preprocessing)** |
| **Giá trị Kinh doanh** | Chuẩn hóa dữ liệu tài liệu quét đầu vào, loại bỏ thao tác chia nhỏ file thủ công ngoài hệ thống. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | Không có |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** Thủ thư truy cập trang tiếp nhận tài liệu số hóa,<br>**When** kéo thả gói file PDF/Ảnh scan độ phân giải $\ge 300\text{ DPI}$ và bấm "Tải lên",<br>**Then** hệ thống kiểm tra định dạng, tạo mã hồ sơ tài liệu và hiển thị tiến trình tải lên $100\%$ thành công. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-02** |
| **Epic** | Epic 1: Số hóa & Nhận dạng Văn bản |
| **Feature Liên quan** | **FE-01: Quản lý Số hóa & OCR Tesseract** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** hệ thống tự động chạy tiền xử lý ảnh (Deskew/Denoise) và kích hoạt Tesseract OCR ngầm,<br>**Để** trích xuất lớp văn bản và tọa độ từ ngữ của từng trang sách mà không làm gián đoạn các công việc khác. |
| **Quy trình Nghiệp vụ** | Quy trình Tự động Trích xuất Chữ viết & Tạo chỉ mục |
| **Bước Quy trình Tương lai** | **Bước 2: Tesseract OCR ngầm** |
| **Giá trị Kinh doanh** | Tự động hóa trích xuất chữ viết $100\%$ ngầm, tiết kiệm nhân công nhập liệu và chuẩn bị dữ liệu cho khâu đối soát. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-01 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** file scan đã tải lên hệ thống thành công,<br>**When** tiến trình Tesseract OCR chạy ngầm hoàn tất,<br>**Then** hệ thống lưu trữ bản ghi kết quả OCR (văn bản thô + tọa độ bounding box từng từ) và đổi trạng thái tài liệu sang "Chờ kiểm duyệt". |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-03** |
| **Epic** | Epic 1: Số hóa & Nhận dạng Văn bản |
| **Feature Liên quan** | **FE-01: Quản lý Số hóa & OCR Tesseract** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** theo dõi danh sách các tác vụ OCR đang chạy và xem báo cáo tỷ lệ hoàn thành theo thời gian thực,<br>**Để** quản lý tiến độ số hóa kho sách của thư viện. |
| **Quy trình Nghiệp vụ** | Quy trình Giám sát Hàng chờ Tác vụ Số hóa |
| **Bước Quy trình Tương lai** | **Bước 2: Tesseract OCR ngầm** |
| **Giá trị Kinh doanh** | Cung cấp khả năng quản lý tiến độ minh bạch cho ban quản lý kho số. |
| **Độ Ưu tiên (MoSCoW)** | **Should Have** |
| **Phụ thuộc (Dependencies)** | PBI-02 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** thủ thư vào bảng điều khiển hàng chờ OCR,<br>**When** tác vụ OCR của tài liệu X gặp lỗi định dạng ảnh,<br>**Then** hệ thống hiển thị cảnh báo trạng thái "Lỗi xử lý", ghi nhận nhật ký lỗi và cho phép thủ thư bấm "Chạy lại (Retry)". |

---

### Epic 2: Kiểm duyệt & Biên mục Dữ liệu Số (Librarian Review & Cataloging)
> **Mục tiêu:** Cung cấp công cụ đối soát màn hình kép Side-by-side cho thủ thư, đảm bảo dữ liệu tri thức đạt độ chính xác $100\%$ trước khi xuất bản.

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-04** |
| **Epic** | Epic 2: Kiểm duyệt & Biên mục Dữ liệu Số |
| **Feature Liên quan** | **FE-02: Giao diện Đối soát Side-by-side** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** mở giao diện đối soát màn hình kép hiển thị ảnh gốc bên trái và văn bản OCR trích xuất bên phải,<br>**Để** dễ dàng so sánh dòng-theo-dòng và chỉnh sửa các từ bị OCR nhận dạng sai. |
| **Quy trình Nghiệp vụ** | Quy trình Đảm bảo Chất lượng Dữ liệu OCR |
| **Bước Quy trình Tương lai** | **Bước 3: Kiểm duyệt Side-by-side UI** |
| **Giá trị Kinh doanh** | Chuẩn hóa $100\%$ tri thức xuất bản, giải quyết bài toán sai lệch thông tin của OCR tự động. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-02 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** thủ thư mở tài liệu ở trạng thái "Chờ kiểm duyệt",<br>**When** nhấp chuột vào một dòng văn bản ở màn hình OCR bên phải,<br>**Then** màn hình ảnh scan bên trái tự động cuộn và highlight vùng ảnh chứa dòng chữ tương ứng. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-05** |
| **Epic** | Epic 2: Kiểm duyệt & Biên mục Dữ liệu Số |
| **Feature Liên quan** | **FE-02: Giao diện Đối soát Side-by-side** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** thực hiện thao tác Phê duyệt (Approve) hoặc Từ chối (Reject) sau khi hoàn tất đối soát,<br>**Để** xác nhận tài liệu đủ tiêu chuẩn chuyển sang bước xuất bản. |
| **Quy trình Nghiệp vụ** | Quy trình Phê duyệt Chất lượng Nội dung Số |
| **Bước Quy trình Tương lai** | **Bước 3: Kiểm duyệt Side-by-side UI** |
| **Giá trị Kinh doanh** | Kiểm soát quyền xuất bản tri thức, gắn trách nhiệm cá nhân của thủ thư phê duyệt. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-04 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** thủ thư hoàn tất chỉnh sửa trang sách cuối cùng,<br>**When** bấm nút "Phê duyệt Xuất bản",<br>**Then** hệ thống lưu vết thông tin người duyệt, thời gian duyệt và chuyển trạng thái tài liệu sang "Sẵn sàng Xuất bản". |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-06** |
| **Epic** | Epic 2: Kiểm duyệt & Biên mục Dữ liệu Số |
| **Feature Liên quan** | **FE-02: Giao diện Đối soát Side-by-side** |
| **Mô tả (User Story)** | **Là** Thủ thư,<br>**Tôi muốn** bổ sung dữ liệu biên mục thư viện (Tên sách, Tác giả, NXB, Năm XB, Từ khóa/Subject),<br>**Để** chuẩn hóa thông tin quản lý thư viện số. |
| **Quy trình Nghiệp vụ** | Quy trình Biên mục Tài liệu Số |
| **Bước Quy trình Tương lai** | **Bước 3: Kiểm duyệt Side-by-side UI** |
| **Giá trị Kinh doanh** | Tăng khả năng phân loại và tìm kiếm tài liệu theo chuẩn quản trị thư viện. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-05 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** giao diện biên mục tài liệu,<br>**When** thủ thư nhập đầy đủ các trường bắt buộc (Tên sách, Tác giả, ISBN/Mã phân loại) và bấm "Lưu biên mục",<br>**Then** hệ thống ghi nhận thông tin метаdữ liệu gắn liền với bản ghi tài liệu số. |

---

### Epic 3: Quản lý Xuất bản & Phân quyền Kho số (Digital Publishing & Access Control)
> **Mục tiêu:** Mã hóa lưu trữ tài liệu và thiết lập cơ chế phân quyền, hạn mức đọc đồng thời tuân thủ cam kết bản quyền với các NXB.

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-07** |
| **Epic** | Epic 3: Quản lý Xuất bản & Phân quyền Kho số |
| **Feature Liên quan** | **FE-07: Phân quyền & Giới hạn Đọc đồng thời** |
| **Mô tả (User Story)** | **Là** Thủ thư / Quản trị viên,<br>**Tôi muốn** hệ thống tự động mã hóa dữ liệu tài liệu đã duyệt bằng chuẩn AES-256 trước khi lưu kho xuất bản,<br>**Để** đảm bảo file gốc không thể bị truy cập trực tiếp từ hạ tầng máy chủ. |
| **Quy trình Nghiệp vụ** | Quy trình Mã hóa Lưu kho & Bảo tồn Tài sản Số |
| **Bước Quy trình Tương lai** | **Bước 4: Mã hóa & Phân quyền Xuất bản** |
| **Giá trị Kinh doanh** | Triệt tiêu rủi ro đánh cắp dữ liệu trực tiếp từ Server, đáp ứng tiêu chuẩn bảo mật cho thương mại. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-05 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** tài liệu được phê duyệt xuất bản,<br>**When** hệ thống chuyển file vào kho lưu trữ nội bộ,<br>**Then** toàn bộ nội dung file được mã hóa AES-256 và không thể mở được bằng các công cụ đọc PDF/Ảnh thông thường nếu không có khóa giải mã từ hệ thống. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-08** |
| **Epic** | Epic 3: Quản lý Xuất bản & Phân quyền Kho số |
| **Feature Liên quan** | **FE-07: Phân quyền & Giới hạn Đọc đồng thời** |
| **Mô tả (User Story)** | **Là** Thủ thư / Quản trị viên,<br>**Tôi muốn** cấu hình chính sách truy cập (Phân quyền theo nhóm người dùng: Sinh viên, Giảng viên, Độc giả ngoài) cho từng cuốn sách,<br>**Để** kiểm soát quyền đọc theo đúng đối tượng ủy quyền. |
| **Quy trình Nghiệp vụ** | Quy trình Cấu hình Chính sách Khai thác Tài liệu |
| **Bước Quy trình Tương lai** | **Bước 4: Mã hóa & Phân quyền Xuất bản** |
| **Giá trị Kinh doanh** | Đảm bảo tính tuân thủ pháp lý về phạm vi phân phối tài liệu số. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-07 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** cuốn sách A được cấu hình chỉ dành cho nhóm "Giảng viên",<br>**When** tài khoản nhóm "Sinh viên" truy cập vào cuốn sách A,<br>**Then** hệ thống từ chối quyền truy cập và hiển thị thông báo "Tài liệu không thuộc phạm vi truy cập của bạn". |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-09** |
| **Epic** | Epic 3: Quản lý Xuất bản & Phân quyền Kho số |
| **Feature Liên quan** | **FE-07: Phân quyền & Giới hạn Đọc đồng thời** |
| **Mô tả (User Story)** | **Là** Thủ thư / Quản trị viên,<br>**Tôi muốn** thiết lập hạn mức số lượng phiên đọc đồng thời (Concurrent Reading Limit) cho từng đầu sách,<br>**Để** tuân thủ hợp đồng hạn mức bản quyền đã ký với Nhà xuất bản. |
| **Quy trình Nghiệp vụ** | Quy trình Quản lý Hạn mức Bản quyền Số |
| **Bước Quy trình Tương lai** | **Bước 4: Mã hóa & Phân quyền Xuất bản** |
| **Giá trị Kinh doanh** | Giúp thư viện tự tin ký kết hợp đồng khai thác sách số với các NXB lớn. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-08 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** cuốn sách B được thiết lập hạn mức 3 lượt đọc đồng thời và hiện có 3 độc giả đang đọc,<br>**When** độc giả thứ 4 yêu cầu mở đọc cuốn sách B,<br>**Then** hệ thống chặn yêu cầu mở đọc và hiển thị thông báo "Sách đã đạt hạn mức đọc đồng thời, vui lòng quay lại sau". |

---

### Epic 4: Tra cứu & Trình đọc An toàn (Search & Secure Canvas Reader)
> **Mục tiêu:** Cung cấp trải nghiệm tìm kiếm toàn văn chính xác và trình đọc trực tuyến HTML5 Canvas mã hóa, triệt tiêu rủi ro tải file gốc.

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-10** |
| **Epic** | Epic 4: Tra cứu & Trình đọc An toàn |
| **Feature Liên quan** | **FE-03: Tìm kiếm Toàn văn (Full-text Search)** |
| **Mô tả (User Story)** | **Là** Độc giả,<br>**Tôi muốn** nhập từ khóa cần tra cứu vào thanh tìm kiếm toàn văn,<br>**Để** nhận được danh sách các cuốn sách và trang sách chính xác chứa từ khóa đó. |
| **Quy trình Nghiệp vụ** | Quy trình Tra cứu Tri thức Toàn văn |
| **Bước Quy trình Tương lai** | **Bước 5: Khai thác An toàn (Canvas Reader)** |
| **Giá trị Kinh doanh** | Tăng $90\%$ hiệu suất nghiên cứu và tìm kiếm tài liệu của độc giả. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-05 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả gõ từ khóa "Thư viện số",<br>**When** bấm nút "Tìm kiếm",<br>**Then** hệ thống trả về danh sách kết quả gồm Tên sách, Số trang chứa từ khóa và đoạn văn trích dẫn xem trước trong thời gian $< 2$ giây. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-11** |
| **Epic** | Epic 4: Tra cứu & Trình đọc An toàn |
| **Feature Liên quan** | **FE-04: HTML5 Canvas Reader An toàn** |
| **Mô tả (User Story)** | **Là** Độc giả được cấp quyền,<br>**Tôi muốn** đọc nội dung sách trực tiếp trên giao diện HTML5 Canvas mượt mà (lật trang, phóng to/thu nhỏ),<br>**Để** nghiên cứu tài liệu mà không cần cài đặt thêm phần mềm đọc PDF bên ngoài. |
| **Quy trình Nghiệp vụ** | Quy trình Đọc Sách Trực tuyến An toàn |
| **Bước Quy trình Tương lai** | **Bước 5: Khai thác An toàn (Canvas Reader)** |
| **Giá trị Kinh doanh** | Mang lại trải nghiệm đọc trực tuyến hiện đại, mượt mà trên trình duyệt Web tiêu chuẩn. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-07, PBI-08 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả mở xem cuốn sách A,<br>**When** trình đọc Canvas khởi tạo,<br>**Then** dữ liệu từng trang sách được giải mã ngầm trong bộ nhớ RAM và vẽ (render) lên Canvas mà không để lại đường link tải file PDF thô trên cây DOM. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-12** |
| **Epic** | Epic 4: Tra cứu & Trình đọc An toàn |
| **Feature Liên quan** | **FE-04: HTML5 Canvas Reader An toàn** |
| **Mô tả (User Story)** | **Là** Chủ sở hữu Bản quyền / Thư viện,<br>**Tôi muốn** hệ thống chặn toàn bộ các thao tác tải xuống (Block Download: chuột phải, lưu ảnh, F12, bắt link IDM),<br>**Để** triệt tiêu nguy cơ thất thoát file tài liệu gốc về máy cá nhân độc giả. |
| **Quy trình Nghiệp vụ** | Quy trình Chống Tải & Bảo vệ File Gốc |
| **Bước Quy trình Tương lai** | **Bước 5: Khai thác An toàn (Canvas Reader)** |
| **Giá trị Kinh doanh** | Bảo vệ $100\%$ bản quyền tài sản số, loại bỏ nguy cơ bị phát tán file gốc. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-11 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả đang mở đọc sách trên Canvas Reader,<br>**When** nhấp chuột phải hoặc bật công cụ bắt link IDM/Developer Tools,<br>**Then** menu chuột phải bị vô hiệu hóa và công cụ IDM không thể phát hiện hay tải về bất kỳ file `.pdf` hay `.png` nào của trang sách. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-13** |
| **Epic** | Epic 4: Tra cứu & Trình đọc An toàn |
| **Feature Liên quan** | **FE-03: Tìm kiếm Toàn văn (Full-text Search)** |
| **Mô tả (User Story)** | **Là** Độc giả đang đọc sách,<br>**Tôi muốn** nhảy trực tiếp đến trang chứa từ khóa tìm kiếm khi bấm vào kết quả tra cứu nội bộ cuốn sách,<br>**Để** định vị nhanh thông tin cần đọc trong sách. |
| **Quy trình Nghiệp vụ** | Quy trình Định vị Từ khóa Trong Trình đọc |
| **Bước Quy trình Tương lai** | **Bước 5: Khai thác An toàn (Canvas Reader)** |
| **Giá trị Kinh doanh** | Tối ưu trải nghiệm khai thác chi tiết nội dung cuốn sách. |
| **Độ Ưu tiên (MoSCoW)** | **Should Have** |
| **Phụ thuộc (Dependencies)** | PBI-10, PBI-11 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả chọn từ khóa "Bản quyền số" trong khung tìm kiếm nội bộ cuốn sách,<br>**When** nhấp vào kết quả ở trang 45,<br>**Then** Canvas Reader chuyển ngay tới trang 45 và highlight vị trí từ khóa "Bản quyền số". |

---

### Epic 5: Giám sát, Bảo mật & Nhật ký Hoạt động (Security Deterrence & Audit Logging)
> **Mục tiêu:** Nhúng Watermark động, làm mờ màn hình răn đe chụp ảnh và ghi vết nhật ký audit log phục vụ giải trình bản quyền.

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-14** |
| **Epic** | Epic 5: Giám sát, Bảo mật & Nhật ký |
| **Feature Liên quan** | **FE-05: Watermarking Động (Dynamic Watermark)** |
| **Mô tả (User Story)** | **Là** Chủ sở hữu Bản quyền / Thư viện,<br>**Tôi muốn** hệ thống tự động nhúng chìm Watermark chứa thông tin định danh độc giả (User ID, Mã thẻ, IP, Thời gian) đè chéo lên trang sách khi đọc,<br>**Để** răn đe và dễ dàng truy vết căn cước nếu độc giả cố tình chụp ảnh màn hình phát tán. |
| **Quy trình Nghiệp vụ** | Quy trình Răn đe Rò rỉ Nội dung Số |
| **Bước Quy trình Tương lai** | **Bảo vệ Đa lớp (Cross-cutting Security)** |
| **Giá trị Kinh doanh** | Tạo cơ chế răn đe tâm lý mạnh mẽ, ngăn chặn ý định cố tình phát tán lậu. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-11 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** tài khoản độc giả Nguyễn Văn A (ID: 12345, IP: 14.241.x.x) đang mở đọc sách,<br>**When** trang sách hiển thị trên Canvas Reader,<br>**Then** một lớp văn bản mờ chứa chuỗi "12345 - Nguyễn Văn A - 14.241.x.x - 27/07/2026 16:30" được vẽ chéo đè lên nội dung trang sách. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-15** |
| **Epic** | Epic 5: Giám sát, Bảo mật & Nhật ký |
| **Feature Liên quan** | **FE-06: Răn đe Chụp màn hình (Screenshot Blur)** |
| **Mô tả (User Story)** | **Là** Quản trị viên Bảo mật,<br>**Tôi muốn** màn hình đọc sách tự động làm mờ (Blur) ngay lập tức khi ứng dụng trình duyệt mất focus hoặc phát hiện thao tác phím chụp màn hình,<br>**Để** hạn chế việc dùng công cụ chụp ảnh màn hình tự động/bằng tay. |
| **Quy trình Nghiệp vụ** | Quy trình Chống Thu thập Màn hình Tự động |
| **Bước Quy trình Tương lai** | **Bảo vệ Đa lớp (Cross-cutting Security)** |
| **Giá trị Kinh doanh** | Tăng cường thêm một lớp rào cản kỹ thuật chống lại các phần mềm chụp ảnh màn hình. |
| **Độ Ưu tiên (MoSCoW)** | **Should Have** |
| **Phụ thuộc (Dependencies)** | PBI-11 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả đang mở màn hình đọc sách,<br>**When** độc giả nhấn phím `PrintScreen` hoặc chuyển sang tab trình duyệt khác (mất focus),<br>**Then** Canvas Reader lập tức áp dụng bộ lọc mờ (blur $100\%$) che phủ toàn bộ nội dung trang sách. |

---

| Thuộc tính PBI | Nội dung Chi tiết |
| :--- | :--- |
| **PBI ID** | **PBI-16** |
| **Epic** | Epic 5: Giám sát, Bảo mật & Nhật ký |
| **Feature Liên quan** | **FE-08: Nhật ký Hoạt động & Audit Trail** |
| **Mô tả (User Story)** | **Là** Quản trị viên Hệ thống,<br>**Tôi muốn** hệ thống tự động ghi nhật ký lịch sử chi tiết (Audit Log: Thời gian, ID người dùng, ID sách, Số trang đọc, Thời lượng xem, Địa chỉ IP),<br>**Để** theo dõi hành vi khai thác kho số và làm bằng chứng pháp lý khi xảy ra sự cố. |
| **Quy trình Nghiệp vụ** | Quy trình Ghi Vết Audit Log & Báo cáo Bản quyền |
| **Bước Quy trình Tương lai** | **Bảo vệ Đa lớp (Cross-cutting Security)** |
| **Giá trị Kinh doanh** | Cung cấp bằng chứng minh bạch phục vụ giải trình pháp lý bản quyền với cơ quan nhà nước và NXB. |
| **Độ Ưu tiên (MoSCoW)** | **Must Have** |
| **Phụ thuộc (Dependencies)** | PBI-11 |
| **Tiêu chí Chấp nhận (Acceptance Criteria)** | **Given** độc giả thực hiện bất kỳ hành vi mở sách, lật trang hay tìm kiếm,<br>**When** thao tác diễn ra,<br>**Then** hệ thống ghi một bản ghi log bất biến vào cơ sở dữ liệu nhật ký với đầy đủ thông tin `Timestamp, UserID, Action, ResourceID, PageNo, IPAddress`. |

---

## 3. Tổng kết Phân bổ Ưu tiên Product Backlog (MoSCoW Summary)

| Mức ưu tiên (MoSCoW) | Danh sách PBI IDs | Số lượng PBIs | Tỷ lệ % | Ý nghĩa Nghiệp vụ |
| :--- | :--- | :---: | :---: | :--- |
| **Must Have (Bắt buộc)** | PBI-01, PBI-02, PBI-04, PBI-05, PBI-06, PBI-07, PBI-08, PBI-09, PBI-10, PBI-11, PBI-12, PBI-14, PBI-16 | **13** | **$81.25\%$** | Yêu cầu cốt lõi để khởi chạy luồng nghiệm thu UAT và đưa hệ thống vào vận hành an toàn. |
| **Should Have (Nên có)** | PBI-03, PBI-13, PBI-15 | **3** | **$18.75\%$** | Các tính năng nâng cao trải nghiệm quản lý và răn đe bổ sung cho trình đọc. |
| **Could Have (Có thể có)** | Phù hợp cho phiên bản nâng cấp mở rộng (AI Tóm tắt, HTR) | **0** | **$0\%$** | Chuyển sang Phạm vi Tương lai (Future Scope). |
| **Won't Have (Chưa phát sinh)**| Các tính năng ngoài phạm vi (In ấn sách số, Dịch tự động) | **0** | **$0\%$** | Loại bỏ khỏi Backlog phiên bản này. |

---
> **Xác nhận:** Tài liệu Product Backlog (LIBIF-Product-Backlog.md) là căn cứ kỹ thuật chính thức được sử dụng để lập kế hoạch Sprint, ước tính độ phức tạp và xây dựng bộ test case nghiệm thu sản phẩm.
