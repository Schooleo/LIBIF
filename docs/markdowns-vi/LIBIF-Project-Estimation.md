# LIBIF
## Hệ thống Số hóa Thư viện & Quản lý Tài liệu Thông minh

---

# TÀI LIỆU ƯỚC LƯỢNG DỰ ÁN PHẦN MỀM

> Tài liệu ước lượng chi tiết bao gồm Cấu trúc Phân chia Công việc (WBS), Phương pháp Ước lượng PERT 3 điểm, Hệ số Tăng tốc bởi AI, Cấu trúc Phân chia Nguồn lực (RBS), Ma trận RACI và Tổng Ngân sách Dự án.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh |
| **Phiên bản** | v2.0 (Đã đồng bộ với Tesseract OCR vie & Điều lệ Dự án) |
| **Ngày tạo** | 19 tháng 07 năm 2026 |
| **Tác giả** | Quản lý Dự án & Kiến trúc sư trưởng |

---

## 1. CẤU TRÚC PHÂN CHIA CÔNG VIỆC (WBS)

Phạm vi công việc của dự án được chia nhỏ thành 5 Gói Công việc (Work Packages - WPs) chính:

- **WP1: Quản trị Dự án & Cấu hình Kiến trúc** (Kiến trúc hệ thống, CI/CD, DB Schema).
- **WP2: Mô-đun Số hóa & Dữ liệu tả** (Tải lên PDF thô, tích hợp Google Books ISBN API).
- **WP3: Quy trình OCR Nền & Xử lý** (Hàng chờ Redis BullMQ, Tesseract OCR (`vie`) Worker, tạo PDF tìm kiếm được).
- **WP4: Tìm kiếm cho Độc giả & Trình xem DRM An toàn** (Cổng Danh mục, Tìm kiếm toàn văn, Trình xem DRM Canvas).
- **WP5: Phân tích Quản trị & Nghiệm thu QA** (Phân tích Dashboard, kiểm thử UAT, Triển khai).

---

## 2. ƯỚC LƯỢNG PERT & HỆ SỐ TĂNG TỐC BỞI AI

Ước lượng nỗ lực áp dụng **Phương pháp Ước lượng PERT 3 điểm** ($E = \frac{O + 4M + P}{6}$), được hiệu chỉnh bởi **Hệ số Tăng tốc bởi AI ($\alpha$)** nhờ việc tích hợp GitHub Copilot và Trợ lý AI Antigravity.

$$\text{Nỗ lực Sau Hiệu chỉnh} = E \times (1 - \alpha)$$

| Gói Công việc (WP) | Lạc quan (O) | Khả thi nhất (M) | Bi quan (P) | Nỗ lực PERT (E) | Hệ số AI ($\alpha$) | Nỗ lực Sau Hiệu chỉnh |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **WP1: Cấu hình & Hạ tầng** | 3 ngày | 5 ngày | 8 ngày | 5,17 ngày | 30% | **3,62 ngày** |
| **WP2: Tải lên & Metadata** | 5 ngày | 8 ngày | 12 ngày | 8,17 ngày | 35% | **5,31 ngày** |
| **WP3: Hàng chờ Tesseract OCR** | 8 ngày | 12 ngày | 18 ngày | 12,33 ngày | 40% | **7,40 ngày** |
| **WP4: Độc giả & DRM** | 7 ngày | 10 ngày | 15 ngày | 10,33 ngày | 35% | **6,71 ngày** |
| **WP5: Dashboard & QA** | 4 ngày | 7 ngày | 10 ngày | 7,00 ngày | 40% | **4,20 ngày** |
| **TỔNG NỖ LỰC** | **27 ngày** | **42 ngày** | **63 ngày** | **43,00 ngày** | **~36%** | **27,24 ngày** |

---

## 3. CẤU TRÚC PHÂN CHIA NGUỒN LỰC (RBS) & MA TRẬN RACI

### 3.1 Cấu trúc Phân chia Nguồn lực (6 Thành viên)
- **1 Quản lý Dự án / Kiến trúc sư trưởng** (Quản trị dự án, kiến trúc, CI/CD, API cốt lõi).
- **1 Lập trình viên Backend** (Cơ sở dữ liệu, tích hợp S3, API Xác thực & Bảo mật).
- **1 Kỹ sư Chuyên môn AI / OCR** (Tối ưu quy trình Tesseract OCR `vie`, hàng chờ BullMQ worker).
- **1 Lập trình viên Frontend** (Cổng Danh mục, Trình xem DRM Canvas, Dashboard).
- **1 Thiết kế UI/UX & Viết Tài liệu Kỹ thuật** (Phác thảo UI, hệ thống thiết kế, hướng dẫn sử dụng).
- **1 Kỹ sư Kiểm thử QA** (Unit tests, kịch bản E2E, kiểm thử bảo mật).

### 3.2 Ma trận RACI

| Nhiệm vụ / Sản phẩm | PM / Kiến trúc sư | Lập trình Backend | Kỹ sư AI | Lập trình Frontend | UI/UX / Tài liệu | Kỹ sư QA |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Kiến trúc Hệ thống** | **A / R** | C | C | C | I | I |
| **Tải PDF lên & S3** | A | **R** | C | C | I | I |
| **Hàng chờ Tesseract OCR Worker** | A | C | **R** | I | I | C |
| **Trình xem DRM Canvas** | A | C | I | **R** | C | C |
| **Dashboard Quản trị** | A | C | I | **R** | C | I |
| **Kiểm thử QA & UAT** | A | I | I | I | I | **R** |

---

## 4. ƯỚC LƯỢNG TỔNG NGÂN SÁCH DỰ ÁN

### 4.1 Ngân sách Nhân công Phát triển (MVP 8 tuần)

| Vai trò | Số lượng | Chi phí Tháng / Người | Tổng Chi phí (2 Tháng) |
|---|:---:|:---:|:---:|
| PM / Kiến trúc sư Hệ thống (Trưởng nhóm) | 1 | 10.000.000 VNĐ | **20.000.000 VNĐ** |
| Lập trình viên Backend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** |
| Kỹ sư Chuyên môn AI / OCR | 1 | 8.500.000 VNĐ | **17.000.000 VNĐ** |
| Lập trình viên Frontend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** |
| Thiết kế UI/UX & Viết Tài liệu Kỹ thuật | 1 | 5.500.000 VNĐ | **11.000.000 VNĐ** |
| Kỹ sư Kiểm thử QA | 1 | 5.250.000 VNĐ | **10.500.000 VNĐ** |
| **TỔNG CHI PHÍ NHÂN CÔNG** | **6** | — | **90.500.000 VNĐ** |

### 4.2 Hạ tầng & Dự phòng Rủi ro
- **Hạ tầng Đám mây (Phát triển & Kiểm thử):** **3.500.000 VNĐ** (AWS EC2, S3, Redis).
- **Dự phòng Rủi ro (15%):** **14.100.000 VNĐ**.
- **TỔNG NGÂN SÁCH DỰ ÁN ƯỚC LƯỢNG:** **108.100.000 VNĐ** (Chi phí nhân công trực tiếp: **90,5 triệu VNĐ**).
