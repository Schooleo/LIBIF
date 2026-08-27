# HIẾN CHƯƠNG DỰ ÁN (PROJECT CHARTER)
## LIBIF — Hệ thống Quản lý Tài liệu & Số hóa Thư viện Thông minh

---

> **Loại tài liệu:** Hiến chương Dự án Chính thức  
> **Trạng thái:** Đã phê duyệt v1.0  
> **Ngày lập:** 19 tháng 7 năm 2026  
> **Bên Tài trợ Dự án:** Ban Giám hiệu & Ban Quản lý Thư viện Khoa, Khoa KH&KT Máy tính — HCMUS  
> **Quản lý Dự án / Kiến trúc sư Trưởng:** PM & System Architect (Trưởng nhóm Kỹ thuật)  
> **Đường dẫn Mục tiêu:** `docs/markdowns-vi/Project-Charter.md`  

---

## 1. UỶ QUYỀN DỰ ÁN & MỤC ĐÍCH

### 1.1 Tóm tắt Dành cho Lãnh đạo & Phê duyệt Chính thức
**Hiến chương Dự án** này phê duyệt chính thức việc khởi động dự án **LIBIF (Hệ thống Quản lý Tài liệu & Số hóa Thư viện Thông minh)**. Hiến chương trao quyền cho Quản lý Dự án và đội ngũ kỹ sư 6 thành viên được phân bổ nguồn lực tài chính đã duyệt, sử dụng hạ tầng phần cứng của nhà trường, và thực thi lộ trình phát triển MVP trong 8 tuần.

### 1.2 Nhu cầu Chiến lược đối với Hoạt động
Như đã trình bày chi tiết trong [Project-Proposal.md](./Project-Proposal.md) và [LIBIF-Vision-Scope.md](./LIBIF-Vision-Scope.md), quy trình số hóa thư viện thủ công gây ra những sự yếu kém nghiêm trọng trong vận hành:
- **Tổn thất Nhân lực:** Thủ thư lãng phí 375–500 giờ cho mỗi 500 cuốn sách vào việc quét thủ công, đổi tên tệp và nhập dữ liệu Excel.
- **Tổn thất Khả năng Truy cập:** Sinh viên phải chờ 24–72 giờ để nhận được tài liệu học phần số hóa.
- **Tổn thất Bản quyền:** Phân phối PDF không kiểm soát qua email/Zalo tạo ra các rủi ro pháp lý về sở hữu trí tuệ.

LIBIF thay thế các nút thắt này bằng một đường ống tự động tích hợp **Tesseract OCR tiếng Việt (`vie`)** mã nguồn mở, tự động thu thập siêu dữ liệu ISBN thông minh, và trình đọc **DRM Canvas Reader** trên trình duyệt.

---

## 2. MỤC TIÊU DỰ ÁN & TIÊU CHÍ THÀNH CÔNG

| Danh mục Mục tiêu | Định lượng Mục tiêu SMART | Phương pháp Xác minh |
|---|---|---|
| **Hiệu quả Vận hành** | Giảm **70%** thời gian biên mục thủ công của thủ thư (< 5 phút/cuốn). | Đo đạc thời gian thực tế trong kiểm thử UAT ở Sprint 1-2. |
| **Tốc độ Truy cập của Sinh viên** | Cung cấp khả năng đọc trực tuyến 24/7 tức thì (< 2 giây tải trang tìm kiếm). | Đo đạc chỉ số hiệu năng qua kiểm thử tải (load testing). |
| **Bảo mật Bản quyền** | **0 tệp PDF gốc bị lộ** trong cây DOM hoặc tab network; 100% hiển thị qua Canvas. | Kiểm tra bảo mật thâm nhập & DevTools inspector. |
| **Độ chính xác OCR** | Đạt **> 92% độ chính xác** trên văn bản in tiếng Việt có dấu. | Lấy mẫu kiểm định chất lượng trên các trang quét thử nghiệm. |
| **Kiểm soát Ngân sách** | Hoàn thành MVP trong giới hạn ngân sách nhân công một lần **90.500.000 VNĐ**. | Theo dõi chi phí hàng tuần theo Earned Value Management (EVM). |

---

## 3. BÊN TÀI TRỢ DỰ ÁN & THẨM QUYỀN QUẢN LÝ

### 3.1 Vai trò Bên Tài trợ & Hạn mức Thẩm quyền
- **Bên Tài trợ Dự án (Ban Giám hiệu / Ban Quản lý Thư viện):**
  - Nắm thẩm quyền cuối cùng về phê duyệt hiến chương dự án, thay đổi phạm vi và giải ngân ngân sách.
  - Phê duyệt kiểm thử tiếp nhận người dùng (UAT) cuối cùng và triển khai hệ thống vận hành chính thức (go-live).
  - Giải quyết các vướng mắc liên phòng ban (ví dụ: tuân thủ pháp lý bản quyền, quyền truy cập máy chủ CNTT).

- **Quản lý Dự án (PM / Kiến trúc sư Trưởng Hệ thống):**
  - Được ủy quyền quản lý chi phí nhân công MVP **90.500.000 VNĐ** và ngân sách vận hành cloud AWS **~1.2M – 2.0M VNĐ/tháng**.
  - Được ủy quyền phân công nhiệm vụ, thực thi tiêu chuẩn mã nguồn, và quản lý các vòng lặp Sprint hàng ngày cho 6 thành viên kỹ sư.
  - Được ủy quyền phê duyệt các quyết định thiết kế kỹ thuật (ví dụ: kiến trúc Modular Monolith, cấu hình hàng đợi Redis/BullMQ).

---

## 4. NGÂN SÁCH CẤP CAO & PHÂN BỔ NGUỒN LỰC

### 4.1 Ngân sách Nhân công Phát triển (8 Tuần / 6 Kỹ sư)

| Vai trò | Số lượng | Chi phí Tháng / Người | Tổng Ngân sách Phân bổ (2 Tháng) |
|---|:---:|:---:|:---:|
| PM / Kiến trúc sư Hệ thống (Trưởng nhóm) | 1 | 10.000.000 VNĐ | **20.000.000 VNĐ** |
| Kỹ sư Backend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** |
| Chuyên gia AI / OCR | 1 | 8.500.000 VNĐ | **17.000.000 VNĐ** |
| Kỹ sư Frontend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** |
| Nhà thiết kế UI/UX & Viết Tài liệu | 1 | 5.500.000 VNĐ | **11.000.000 VNĐ** |
| Kỹ sư QA / Kiểm thử | 1 | 5.250.000 VNĐ | **10.500.000 VNĐ** |
| **TỔNG NGÂN SÁCH NHÂN CÔNG ĐƯỢC DUYỆT** | **6** | — | **90.500.000 VNĐ** |

### 4.2 Ngân sách Hạ tầng Vận hành Đám mây
- **Mục tiêu Hosting:** AWS EC2 / MinIO Object Storage / Managed PostgreSQL.
- **Chi phí Vận hành Ước tính:** **~1.200.000 – 2.000.000 VNĐ/tháng** (~70.440.000 VNĐ/năm), tiết kiệm hơn 80% so với phần mềm thương mại doanh nghiệp.

---

## 5. LỊCH TRÌNH CÁC CỘT MỐC CHÍNH

Dự án tuân thủ chu kỳ phát hành Agile/Scrum trong 8 tuần:

```
[ Tuần 1-2: Sprint 1 ] → [ Tuần 3-4: Sprint 2 ] → [ Tuần 5-6: Sprint 3 ] → [ Tuần 7-8: Sprint 4 ]
PDF Ingest & ISBN        Async OCR & Catalog     DRM Canvas Reader       Dashboard & UAT
```

| Mã Cột mốc | Tuần Mục tiêu | Kết quả Đầu ra Chính & Sản phẩm Đạt được |
|:---:|:---:|---|
| **M1** | Cuối Tuần 2 | Hoàn thành Cổng tiếp nhận; Tải lên PDF kéo-thả (US-01) & API Auto-fill ISBN (US-02) sẵn sàng. |
| **M2** | Cuối Tuần 4 | Tích hợp hàng đợi tiến trình Tesseract OCR (US-03); Cổng Tìm kiếm Danh mục Trực tuyến (US-04) vận hành. |
| **M3** | Cuối Tuần 6 | Đã xác minh tính năng Tìm kiếm đoạn trích toàn văn (US-05) & Trình đọc an toàn DRM Canvas Reader (US-06). |
| **M4** | Cuối Tuần 8 | Bảng điều khiển Thống kê Quản lý (US-07), Kiểm định Bảo mật E2E, và Ký duyệt UAT Cuối cùng. |

---

## 6. MA TRẬN QUẢN TRỊ RACI

Để đảm bảo trách nhiệm vận hành rõ ràng và loại bỏ sự mơ hồ về vai trò, các kết quả của dự án được ánh xạ bằng **Mô hình RACI** tiêu chuẩn:
- **R — Responsible (Người Thực hiện):** Vai trò thực hiện hoạt động để đạt được kết quả.
- **A — Accountable (Người Phê duyệt):** Vai trò duy nhất có thẩm quyền phê duyệt cuối cùng và chịu trách nhiệm tối cao (Chỉ có DUY NHẤT một chữ 'A' cho mỗi hoạt động).
- **C — Consulted (Người Tham vấn):** Chuyên gia cung cấp ý kiến đóng góp quan trọng trước khi thực hiện.
- **I — Informed (Người Nhận thông tin):** Các bên liên quan được cập nhật tiến độ và hoàn thành cột mốc.

### 6.1 Ma trận RACI Chi tiết Kết quả

| Hoạt động Dự án / Kết quả | Bên Tài trợ | PM / Kiến trúc sư | Kỹ sư Backend | Chuyên gia AI/OCR | Kỹ sư Frontend | UI/UX & Viết bài | Kỹ sư QA | Cán bộ Pháp chế | Đội CNTT |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Hiến chương Dự án & Giải ngân Ngân sách** | **A** | R | I | I | I | I | I | C | C |
| **Kiến trúc Hệ thống & Thiết kế CSDL** | I | **A/R** | C | C | C | I | I | I | C |
| **Kéo-thả Tiếp nhận PDF & Lưu trữ (US-01)** | I | A | **R** | I | C | C | C | I | I |
| **Tự động điền Siêu dữ liệu ISBN (US-02)** | I | A | **R** | I | C | C | C | I | I |
| **Đường ống Tesseract OCR Bất đồng bộ (US-03)** | I | A | C | **R** | I | I | C | I | I |
| **API Tìm kiếm Danh mục Trực tuyến (US-04/05)** | I | A | **R** | C | C | I | C | I | I |
| **Trình đọc An toàn DRM Canvas Reader (US-06)** | I | A | C | I | **R** | C | C | **C** | I |
| **Giao diện Dashboard Thống kê (US-07)** | C | A | C | I | **R** | C | C | I | I |
| **Hệ thống Thiết kế UI/UX & Tài liệu** | I | A | I | I | C | **R** | I | I | I |
| **Kiểm thử Đơn vị, E2E & Bảo mật** | I | A | C | C | C | I | **R** | C | I |
| **Triển khai Docker & Hạ tầng** | I | A | C | C | I | I | C | I | **R** |
| **Ký duyệt Kiểm thử Tiếp nhận (UAT)** | **A** | R | I | I | I | C | R | C | I |

---

## 7. RỦI RO, GIẢ ĐỊNH & RÀO CẢN DỰ ÁN

### 7.1 Rào cản Chính của Dự án
1. **Lịch trình Cố định:** Thời gian phát triển nghiêm ngặt trong 8 tuần để bàn giao MVP.
2. **Ngân sách Cố định:** Mức trần chi phí nhân công 90.5M VNĐ.
3. **Không dùng Plugin Desktop Cục bộ:** Bảo vệ DRM phải hoạt động hoàn toàn bên trong trình duyệt web tiêu chuẩn mà không yêu cầu cài đặt phần mềm máy khách.

### 7.2 Bảng Quản lý Rủi ro Cấp cao

| Yếu tố Rủi ro | Tác động | Khả năng | Chiến lược Giảm thiểu |
|---|:---:|:---:|---|
| **Độ chính xác OCR thấp trên Sách cũ** | Cao | Trung bình | Tích hợp tiền xử lý hình ảnh (ảnh xám, phân ngưỡng, chỉnh nghiêng) và cho phép thủ thư ghi đè sửa siêu dữ liệu thủ công. |
| **Nút thắt Bộ nhớ Máy chủ khi xử lý OCR** | Cao | Thấp | Chuyển công việc OCR nặng sang hàng đợi tiến trình chạy ngầm bất đồng bộ Redis + BullMQ. |
| **Sự Kháng cự từ Nhân viên Thư viện** | Trung bình | Trung bình | Thiết kế giao diện không cần đào tạo với tính năng kéo-thả và 1-click tự động điền ISBN. |
| **Trách nhiệm Pháp lý Vi phạm Bản quyền** | Nghiêm trọng | Thấp | Thực thi hiển thị Canvas HTML5, URL presigned S3 hết hạn nhanh (< 60s), và chèn watermark sinh viên động. |

---

## 8. PHÊ DUYỆT CHÍNH THỨC & KÝ TÊN

Bằng việc ký tên dưới đây, Bên Tài trợ Dự án và Quản lý Dự án chính thức phê duyệt **Hiến chương Dự án** này, cho phép phân bổ nguồn lực và triển khai phạm vi dự án LIBIF ngay lập tức.

```
__________________________________          __________________________________
TS. Đại diện Bên Tài trợ Dự án              PM & Kiến trúc sư Trưởng Hệ thống
Khoa KH&KT Máy tính — HCMUS                 Đội ngũ Kỹ thuật LIBIF
Ngày: 19 tháng 7 năm 2026                   Ngày: 19 tháng 7 năm 2026
```
