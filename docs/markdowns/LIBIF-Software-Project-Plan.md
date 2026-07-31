# BẢN KẾ HOẠCH DỰ ÁN PHẦN MỀM LIBIF
### *(SOFTWARE PROJECT PLAN - SPP)*

---

> **Dự án:** LIBIF — Hệ thống Số hóa Thư viện Thông minh (*Library Digitization & Document Management System*)  
> **Phân loại:** Kế hoạch Quản lý & Triển khai Dự án Phần mềm  
> **Trạng thái:** Bản chính thức v1.0  
> **Ngày lập:** 20 tháng 07 năm 2026  
> **Đội ngũ thực hiện:** 6 sinh viên năm 4 Khoa CNTT — HCMUS (PM/Architect, Backend, AI/OCR Specialist, Frontend, UI/UX & Tech Writer, QA/Tester)  

---

## 1. TỔNG QUAN DỰ ÁN (EXECUTIVE SUMMARY)

Hệ thống **LIBIF** được phát triển nhằm giải quyết triệt để nút thắt quản lý thư viện giấy thủ công tại Khoa Công nghệ Thông tin — HCMUS. Hệ thống giúp tự động hóa quy trình số hóa sách (PDF Upload & OCR tiếng Việt), tập trung hóa kho tri thức số và cung cấp cổng đọc trực tuyến bảo mật chống rò rỉ bản quyền (DRM Canvas Reader).

Bản kế hoạch này định hình toàn bộ luồng quản lý, triển khai kỹ thuật, quản lý tiến độ, ngân sách và đảm bảo chất lượng cho **8 tuần phát triển Agile** của nhóm 6 nhân sự kết hợp các công cụ lập trình trợ lý AI năm 2026.

---

## 2. STATEMENT OF WORK (SOW - BÁO CÁO PHÁT BIỂU CÔNG VIỆC)

Statement of Work (SOW) quy định chính thức phạm vi, sản phẩm bàn giao và điều kiện nghiệm thu giữa bên đặt hàng và đội ngũ phát triển.

### 2.1 Mục đích & Mục tiêu Công việc (Purpose & Objectives)
*   Xây dựng hệ thống quản lý tài liệu số hóa **LIBIF** giúp tự động hóa khâu số hóa, nâng cao khả năng tiếp cận tri thức cho sinh viên và bảo mật bản quyền tác phẩm.

### 2.2 Phạm vi Công việc (Scope of Work)

| Hạng mục | Nằm trong Phạm vi (IN-SCOPE) | Nằm ngoài Phạm vi (OUT-OF-SCOPE) |
|---|---|---|
| **Người dùng & Xác thực** | Phân quyền 03 vai trò (Thủ thư, Độc giả, Admin) | Ứng dụng di động Native (chỉ làm Web Responsive) |
| **Số hóa & OCR** | Tải lên PDF, nén file, OCR tiếng Việt/Anh bất đồng bộ | Tự động phân loại nội dung sách bằng AI học sâu |
| **Tra cứu & Tìm kiếm** | Tra cứu danh mục, lọc đa thuộc tính, Tìm kiếm toàn văn (Full-text) | Tích hợp hệ thống quản lý thư viện vật lý cổ điển (SIP2/Z39.50) |
| **Bảo mật & Đọc online** | Trình đọc Canvas Reader, chặn copy/paste, Presigned URL | Hệ thống thanh toán mua sách số trực tuyến |
| **Quản trị & Thống kê** | Approval Workflow, Dashboard đo lường lượt đọc, xuất Excel | Quản lý kho sách giấy vật lý tại kệ |

### 2.3 Tiến độ Bàn giao Sản phẩm (Deliverables Schedule & Milestones)

| Mốc Milestone | Thời gian | Sản phẩm Bàn giao (Deliverables) | Tiêu chí Kiểm chứng |
|:---:|:---:|---|---|
| **M0: Khởi động** | Tuần 1 | SRS Document, API Contract, DB Schema, CI/CD Pipeline | Codebase khởi tạo trên GitHub, CI/CD pass build |
| **M1: Base Framework**| Tuần 3 | Core Auth API, Upload Service, Design System Figma | Upload PDF thành công lên AWS S3 |
| **M2: OCR & Search** | Tuần 5 | Pipeline VietOCR chạy hàng đợi Redis, Full-text Search Engine | OCR nhận diện chữ tiếng Việt dấu chuẩn ≥ 92% |
| **M3: DRM Reader** | Tuần 6 | Trình đọc Canvas Reader, Presigned URLs, Approval Workflow | Không thể tải file PDF gốc bằng F12 / Network Tab |
| **M4: UAT Ready** | Tuần 7 | Bản chạy Staging hoàn chỉnh, Báo cáo Test Case, UAT Sign-off | Biên bản nghiệm thu thử nghiệm UAT của Thủ thư |
| **M5: Launch** | Tuần 8 | Deploy Production AWS Cloud, User Manual, Bàn giao Mã nguồn | Hệ thống hoạt động mượt mà trên tên miền trường |

### 2.4 Tiêu chí Nghiệm thu (Acceptance Criteria & Definition of Done)
*   **Chất lượng Mã nguồn:** 100% code được review chéo, đạt độ bao phủ Unit Test (Coverage) $\ge 80\%$.
*   **Hiệu năng Xử lý (NFR):** Tốc độ phản hồi tra cứu catalog $< 1.5$ giây với CSDL 10,000 sách; Tốc độ xử lý OCR $< 5$ giây/trang sách.
*   **Bảo mật:** Không rò rỉ URL S3 gốc; đường dẫn Presigned URL hết hạn sau 15 phút; vô hiệu hóa thao tác F12, Ctrl+C, Ctrl+P trên Canvas Reader.
*   **Bàn giao:** Đầy đủ User Manual cho Thủ thư và tài liệu hướng dẫn vận hành cho kỹ thuật viên.

### 2.5 Quy trình Quản lý Thay đổi (Change Management Process)
1.  **Yêu cầu Thay đổi (CR):** Mọi yêu cầu phát sinh ngoài Scope phải được ghi nhận bằng văn bản Change Request (CR).
2.  **Đánh giá Tác động:** PM tiến hành đánh giá tác động của CR tới Tiến độ (Schedule) và Ngân sách (Budget).
3.  **Phê duyệt:** Nếu CR làm kéo dài tiến độ quá 3 ngày hoặc phát sinh chi phí $> 5\%$, phải có sự đồng ý của Trưởng Khoa / Ban Quản lý Thư viện trước khi thực hiện.

---

## 3. CHIẾN LƯỢC HỢP ĐỒNG PHẦN MỀM (SOFTWARE CONTRACT STRATEGY)

Mô hình **Hợp đồng Giá cố định Linh hoạt (Agile Fixed-Price Contract)** được lựa chọn để đảm bảo kiểm soát ngân sách và tiến độ dự án.

### 3.1 Cơ chế Hợp đồng 2 Giai đoạn (Two-Phase Contract)

```
GIAI ĐẠN 1: FIXED-PRICE DISCOVERY & ARCHITECTURE (Tuần 1 - 2)
  ├── Phạm vi: Chốt yêu cầu chi tiết (SRS), Thiết kế Kiến trúc & UI Mockups
  └── Kết quả: Biên bản chốt Scope chuẩn & Mô hình MVP chính thức

GIAI ĐẠN 2: FIXED-PRICE IMPLEMENTATION & DELIVERY (Tuần 3 - 8)
  ├── Phạm vi: Phát triển Core MVP, Tích hợp OCR, DRM Reader, UAT & Deploy
  └── Thanh toán: Theo các Mốc Milestone (M1, M3, M5)
```

### 3.2 Điều khoản Thanh toán & Nghĩa vụ (Payment Terms & Liabilities)
*   **Tổng Giá trị Hợp đồng (Giai đoạn MVP):** **90.500.000 VNĐ** *(Chưa bao gồm thuế VAT/phí quản lý)*.
*   **Lịch Thanh toán theo Mốc (Payment Schedule):**
    1.  *Tạm ứng Đợt 1 (Ký hợp đồng & M0):* **20%** (18.100.000 VNĐ)
    2.  *Thanh toán Đợt 2 (Hoàn thành M2 - OCR & Search):* **40%** (36.200.000 VNĐ)
    3.  *Thanh toán Đợt 3 (Hoàn thành M5 - Bàn giao & Deploy):* **40%** (36.200.000 VNĐ)
*   **Phạt Trễ hạn (Delay Penalty):** Trễ hạn do lỗi chủ quan của nhóm phát triển phạt 0.5% giá trị hợp đồng/ngày trễ (tối đa không quá 5%).
*   **Bảo hành & Hỗ trợ kỹ thuật (Warranty):** Bảo hành miễn phí lỗi hệ thống (Bug fixes) trong vòng **03 tháng** sau khi bàn giao chính thức.

---

## 4. KẾ HOẠCH ĐẢM BẢO CHẤT LƯỢNG (QUALITY ASSURANCE PLAN)

Kế hoạch Đảm bảo Chất lượng quy định tiêu chuẩn kiểm thử và tiêu chí kiểm chứng hệ thống LIBIF trước khi nghiệm thu:

*   **Unit Testing:** Sử dụng Jest (Frontend) và PyTest/Mocha (Backend), duy trì coverage $\ge 80\%$.
*   **Integration & Security Testing:** Kiểm thử luồng phân quyền JWT, Presigned URL expiration (15 phút), kiểm thử khả năng chống cào dữ liệu (Anti-scraping).
*   **Performance Testing:** Sử dụng công cụ `k6` mô phỏng 200 người đọc truy cập đồng thời (Concurrent Users), đảm bảo thời gian tải trang dưới 2 giây.
*   **Đánh giá OCR Accuracy:** Thử nghiệm trên tập mẫu 50 đầu sách thực tế tại thư viện HCMUS, đo lường chỉ số CER (Character Error Rate) và WER (Word Error Rate) đạt độ chính xác $\ge 93\%$.

---

## 5. KẾT LUẬN

Bản Kế hoạch Dự án Phần mềm **LIBIF** tập trung toàn bộ vào tài liệu **Statement of Work (SOW)**, chiến lược **Hợp đồng Giá cố định** và **Kế hoạch Đảm bảo Chất lượng (QA Plan)**.

Với lịch trình 8 tuần được kiểm soát chặt chẽ, cơ cấu 6 nhân sự chuyên môn hóa kết hợp trợ lý AI năm 2026, dự án cam kết bàn giao đúng tiến độ, đảm bảo chất lượng kỹ thuật cao nhất và tối ưu hóa ngân sách đầu tư cho nhà trường.
