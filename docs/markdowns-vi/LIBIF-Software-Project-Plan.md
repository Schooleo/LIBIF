# LIBIF
## Hệ thống Số hóa Thư viện & Quản lý Tài liệu Thông minh

---

# KẾ HOẠCH DỰ ÁN PHẦN MỀM (SPP) & ĐỀ XUẤT CÔNG VIỆC (SOW)

> Kế hoạch Dự án Phần mềm Chi tiết trình bày Tóm tắt Điều hành, Đề xuất Công việc (SOW) Chính thức, Các Cột mốc Dự án, Điều khoản Hợp đồng Giá Cố định Linh hoạt (Agile Fixed-Price), Kế hoạch Đảm bảo Chất lượng (QA) và Quản trị Rủi ro.

---

| Trường | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh |
| **Loại tài liệu** | Kế hoạch Dự án Phần mềm & Đề xuất Công việc (SOW) |
| **Trạng thái** | Đã phê duyệt v2.0 (Căn chỉnh theo Dự thảo Dự án & Đề xuất) |
| **Ngày** | 19 tháng 07, 2026 |
| **Tác giả** | Quản lý Dự án & Ban Quản trị |

---

## 1. TÓM TẮT ĐIỀU HÀNH

**Kế hoạch Dự án Phần mềm LIBIF (SPP)** thiết lập khung thực thi để triển khai nền tảng số hóa thư viện tự động trong khung thời gian **Agile 8 tuần** (19/07/2026 – 13/09/2026). Kế hoạch đảm bảo sự cân bằng giữa tính chặt chẽ về mặt kỹ thuật và kiểm soát rủi ro tài chính theo mô hình **Hợp đồng Giá Cố định Agile 2 Giai đoạn**, đảm bảo tiến độ bàn giao có thể dự đoán được đồng thời duy trì chất lượng phần mềm cao.

---

## 2. ĐỀ XUẤT CÔNG VIỆC (SOW)

### 2.1 Mục đích & Định nghĩa của Đề xuất Công việc (SOW)
Tài liệu **Đề xuất Công việc (SOW)** đóng vai trò là cơ sở hợp đồng chính thức giữa Bên giao dự án (Hội đồng Điều hành / Ban Quản lý Thư viện) và Đội ngũ Phát triển (6 Sinh viên Kỹ thuật). Tài liệu định nghĩa rõ ràng mục đích, phạm vi ranh giới, các sản phẩm bàn giao cụ thể, thời hạn thực hiện và các điều kiện nghiệm thu chính thức nhằm ngăn chặn tình trạng phình scope (scope creep) và đồng bộ hóa kỳ vọng giữa các bên.

### 2.2 Thời gian Thực hiện & Địa điểm Làm việc
- **Thời gian Thực hiện:** 8 Tuần (19/07/2026 – 13/09/2026).
- **Địa điểm Chính:** Khoa Công nghệ Thông tin, Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM (Mô hình kết hợp từ xa & phòng lab tại cơ sở).

### 2.3 Các Sản phẩm Bàn giao Trong Phạm vi (In-Scope Deliverables)
1. **Cổng Số hóa dành cho Quản trị viên (Admin Digitization Portal):** Tải lên tệp PDF bằng kéo-thả, tự động trích xuất thông tin sách (metadata) qua ISBN Google Books API, và quản lý danh mục/thẻ theo cấu trúc cây (tree-structure).
2. **Tuyến Xử lý Bất đồng bộ (Background Processing Pipeline):** Nén tệp PDF bất đồng bộ và trích xuất toàn văn tự động **Tesseract OCR (`vie`)** thông qua hàng chờ nhiệm vụ Redis + BullMQ.
3. **Cổng Tra cứu dành cho Độc giả (Reader Discovery Portal):** Tìm kiếm danh mục trực tuyến, lọc đa thuộc tính (danh mục, thẻ, năm xuất bản), và tìm kiếm trích đoạn từ khóa toàn văn.
4. **Trình đọc An toàn Canvas DRM:** Trình xem an toàn trực tiếp trên trình duyệt tích hợp lớp phủ watermark động theo thông tin sinh viên (MSSV + IP + Dấu thời gian), kiểm soát chống sao chép, chống in và chống tải về.
5. **Bảng Điều khiển Phân tích Quản lý (Management Analytics Dashboard):** Phân tích thời gian thực theo dõi lượt đọc, danh sách sách hàng đầu, khung giờ đọc cao điểm và xuất báo cáo file Excel.

### 2.4 Các Mục Nằm Ngoài Phạm vi (Out-of-Scope Items)
- Ứng dụng di động bản địa (Native mobile applications) cho iOS/Android (chỉ hỗ trợ Web Responsive).
- Tích hợp trực tiếp với các giao thức phần cứng thư viện truyền thống (SIP2/Z39.50).
- Chức năng mua bán sách điện tử (e-commerce e-book) thương mại có trả phí.

### 2.5 Điều khoản Nghiệm thu & Quản trị
Các sản phẩm bàn giao chỉ được nghiệm thu chính thức khi đáp ứng đầy đủ **Định nghĩa Hoàn thành (Definition of Done - DoD)**:
- 100% đánh giá mã nguồn (Peer Review) được thông qua.
- Đạt mức **Bao phủ Mã nguồn (Code Coverage) tối thiểu 80%** đối với unit test.
- Đã xác minh Tiêu chí Nghiệm thu (Acceptance Criteria - AC) định lượng bởi Trưởng nhóm QA.
- Có chữ ký xác nhận nghiệm thu UAT chính thức từ Bên giao dự án.

---

## 3. CỘT MỐC DỰ ÁN & TIẾN ĐỘ

```
Tuần 1-2         Tuần 3-4         Tuần 5-6         Tuần 7-8
[CỘT MỐC 1]  ──► [CỘT MỐC 2]  ──► [CỘT MỐC 3]  ──► [CỘT MỐC 4]
Tải lên & Meta   Tesseract & Cat  Tìm kiếm & DRM   Dashboard & QA
```

| Cột mốc | Ngày mục tiêu | Sản phẩm bàn giao chính | Chỉ số Hiệu suất Chính (KPI) |
|---|:---:|---|---|
| **M1: Tiếp nhận & Metadata** | Tuần 2 (31/07) | Thiết lập Framework, Tải lên PDF (US-01), Trích xuất Metadata qua API ISBN (US-02). | Tải lên thành công file PDF 200MB & 80% metadata được điền tự động. |
| **M2: OCR & Xử lý** | Tuần 4 (14/08) | Tuyến xử lý Tesseract OCR (US-03), Cổng Danh mục Trực tuyến (US-04), Xác thực/Phân quyền RBAC. | Xử lý OCR bất đồng bộ dưới 5s/trang & thời gian phản hồi tìm kiếm danh mục < 1.5s. |
| **M3: Khám phá & Bảo mật**| Tuần 6 (28/08) | Tìm kiếm toàn văn (US-05), Trình đọc DRM Canvas (US-06), Phê duyệt (US-08). | Không rò rỉ tải file & chuyển đến đúng vị trí trích đoạn từ khóa toàn văn. |
| **M4: Phân tích & Bàn giao**| Tuần 8 (13/09) | Bảng điều khiển Dashboard (US-07), Quản lý Danh mục/Thẻ (US-09), Bàn giao QA E2E. | 100% Chữ ký nghiệm thu UAT & triển khai thành công trên môi trường sản xuất. |

---

## 4. MÔ HÌNH HỢP ĐỒNG GIÁ CỐ ĐỊNH AGILE

Để đồng bộ hóa cơ chế động lực giữa các bên liên quan và đội ngũ kỹ thuật, dự án áp dụng mô hình **Hợp đồng Giá Cố định Agile 2 Giai đoạn**:

- **Giai đoạn 1 (Cơ sở Sprint 1-2):** Phạm vi và chi phí cố định dành cho các tính năng cốt lõi: Tiếp nhận, Lưu trữ và Động cơ Tesseract OCR.
- **Giai đoạn 2 (Tính linh hoạt Sprint 3-4):** Tổng chi phí cố định (**90.500.000 VNĐ**) đi kèm quyền hoán đổi Story Point linh hoạt cho các tính năng phụ dựa trên phản hồi đánh giá giữa kỳ.

---

## 5. KẾ HOẠCH ĐẢM BẢO CHẤT LƯỢNG (QA) & QUẢN TRỊ RỦI RO

### 5.1 Chiến lược Đảm bảo Chất lượng
- **Đánh giá Mã nguồn (Code Review):** Bắt buộc 100% Peer Review trước khi gộp (merge) Pull Request.
- **Unit Testing:** Bắt buộc đạt **Bao phủ Mã nguồn (Code Coverage) tối thiểu 80%** được thực thi qua Jest/Vitest.
- **Tự động hóa CI/CD:** Tuyến xử lý Tích hợp Tự động (CI) chạy linter, unit test và quét bảo mật trên mỗi commit.

### 5.2 Kiểm soát Rủi ro Cốt lõi
- **Rủi ro Độ chính xác OCR:** Triển khai tiền xử lý nhị phân hóa hình ảnh (binarization), phân ngưỡng (thresholding) và lọc độ tương phản để duy trì độ chính xác dấu tiếng Việt > 92% trên các sách in cũ.
- **Rủi ro Tải Trọng Máy chủ:** Tách biệt tác vụ xử lý OCR nặng sang các container worker độc lập chạy hậu trường qua hàng chờ Redis để đảm bảo tính ổn định tuyệt đối cho Web Server.
