# LIBIF
## Hệ thống Quản lý Tài liệu & Số hóa Thư viện Thông minh

---

# BÁO CÁO GIÁM SÁT VÀ KIỂM SOÁT DỰ ÁN PHẦN MỀM

> Báo cáo trạng thái đánh giá tiến độ thực tế, chi phí, quản trị rủi ro, và khối lượng công việc đã hoàn thành tại **Cột mốc Giữa kỳ (Tuần 4 / 8)** áp dụng Earned Value Management (EVM), biểu đồ Sprint Burn-down, và phân tích hỗ trợ bởi AI.

---

| Trường Thông tin | Nội dung |
|---|---|
| **Tên Dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh |
| **Kỳ Báo cáo** | Báo cáo Trạng thái Giữa kỳ — **Tuần 4 / 8** |
| **Ngày lập** | 20 tháng 7 năm 2026 |
| **Người thực hiện** | Trợ lý AI Antigravity & Quản lý Dự án |
| **Trạng thái Dự án** | 🟢 **ĐÚNG TIẾN ĐỘ & TRONG NGÂN SÁCH** |

---

## 1. TÓM TẮT DÀNH CHO LÃNH ĐẠO

Tính đến **cuối Sprint 2 (Tuần 4)**, dự án LIBIF đã hoàn thành 100% các sản phẩm cốt lõi Giai đoạn 1 đúng lịch trình:
- **Sprint 1 (Tuần 1-2):** Khởi tạo khung dự án, tải lên PDF thô (US-01), tự động điền siêu dữ liệu ISBN thông minh (US-02).
- **Sprint 2 (Tuần 3-4):** Hàng đợi Tesseract OCR Bất đồng bộ Chạy ngầm & Nén (US-03), Cổng Tìm kiếm Danh mục Trực tuyến (US-04), và Phân quyền Xác thực JWT Auth/RBAC.

```
DÒNG THỜI GIAN TIẾN ĐỘ DỰ ÁN (TUẦN 1 - TUẦN 8)
[████████████████████████████████                    ] 50% Hoàn thành (4/8 Tuần)
└───────────────┬───────────────────┘└────────────────────────────────┘
    GIAI ĐOẠN 1: LÕI HỆ THỐNG (ĐÃ HOÀN THÀNH)   GIAI ĐOẠN 2: NÂNG CAO & BẢO MẬT (TIẾP THEO)
```

---

## 2. THEO DÕI CHI PHÍ VÀ CÔNG SỨC

LIBIF là đồ án học tập nên baseline chi phí tiền mặt bằng **0 VNĐ**. Nhóm sử dụng Coding Agent subscription/free-tier, Azure for Students và Vercel cho production, Tailscale Funnel cho staging, cùng các công cụ mã nguồn mở. Công sức sinh viên được theo dõi bằng giờ-người, không quy đổi thành chi phí lương giả định.

### 2.1 Tình trạng chi phí tại Tuần 4

| Chỉ số | Giá trị | Ý nghĩa |
|---|:---:|---|
| **Ngân sách tiền mặt cơ sở** | **0 VNĐ** | Không dự kiến phát sinh giao dịch tiền mặt trong phạm vi đồ án |
| **Chi phí tiền mặt thực tế** | **0 VNĐ** | Các môi trường và công cụ đang dùng thuộc free-tier/tài nguyên học tập |
| **Chi phí tiền mặt cam kết** | **0 VNĐ** | Không có hợp đồng hoặc dịch vụ trả phí đã cam kết |
| **Dự báo hoàn thành** | **0 VNĐ** | Tiếp tục dùng các lựa chọn miễn phí hiện tại |
| **Công sức** | Theo dõi bằng giờ-người | Dùng để cân bằng tải và tái ước lượng, không quy đổi thành lương |

Vì BAC và AC tiền mặt đều bằng 0, các chỉ số chi phí EVM như CPI hoặc CV không có ý nghĩa toán học cho đồ án này. Tiến độ được đánh giá bằng Story Points, velocity, burndown và Sprint Goal; effort được đánh giá bằng planned/actual hours.

---

## 3. BIỂU ĐỒ SPRINT BURN-DOWN & THEO DÕI KHỐI LƯỢNG CÔNG VIỆC

### 3.1 Burn-down Theo Story Points (Sprint 1 - Sprint 4)

```
Story Points
 80 ┼ ─── Burn-down Kế hoạch
    │ ╲  *** Tiến độ Thực tế
 60 ┼───*──────────────────────────────────────
    │    ╲ *
 40 ┼─────╲──*─────────────────────────────────
    │      ╲  * (Tuần 4: Còn lại 36 Points)
 20 ┼───────╲───░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    │        ╲  ░░░ (Dự báo Sprint 3 & 4)
  0 ┴─────────┴──────────┴──────────┴──────────
    Sprint 0    Sprint 1   Sprint 2   Sprint 3   Sprint 4
                (Tuần 2)   (Tuần 4)   (Tuần 8)   (Tuần 8)
```

### 3.2 Nhập nhật Trạng thái User Story

| Mã US | Tiêu đề User Story | Story Points | Trạng thái Thực tế | Người Thực hiện |
|---|---|:---:|:---:|---|
| **US-01** | Tải lên PDF thô | 5 SP | 🟢 Hoàn thành (Done) | Backend Dev + MinIO Storage |
| **US-02** | Siêu dữ liệu thông minh qua ISBN | 5 SP | 🟢 Hoàn thành (Done) | Kỹ sư Frontend (Google Books API) |
| **US-03** | Xử lý & Tesseract OCR | 13 SP | 🟢 Hoàn thành (Done) | Chuyên gia AI + Redis BullMQ Queue |
| **US-04** | Cổng Danh mục Trực tuyến | 8 SP | 🟢 Hoàn thành (Done) | Kỹ sư Frontend & Backend |
| **US-05** | Tìm kiếm Nội dung Toàn văn | 8 SP | 🟡 Đang Thực hiện (50%) | Đã đánh chỉ mục, đang nối API Viewer |
| **US-06** | Trình đọc DRM Canvas Reader | 13 SP | 🟡 Đang Thực hiện (40%) | Đã có thiết kế kiến trúc, đang đóng gói UI |
| **US-07** | Dashboard Thống kê | 8 SP | ⚪ Chờ Thực hiện | Lập kế hoạch cho Sprint 4 |
| **US-08** | Quy trình Phê duyệt Sách | 5 SP | ⚪ Chờ Thực hiện | Lập kế hoạch cho Sprint 3 |
| **US-09** | Quản lý Thẻ & Danh mục | 5 SP | ⚪ Chờ Thực hiện | Lập kế hoạch cho Sprint 4 |

---

## 4. SỔ TAY RỦI RO & HÀNH ĐỘNG DỰ PHÒNG

| Mã Rủi ro | Mô tả | Tác động | Khả năng | Hành động Kiểm soát & Giảm thiểu |
|---|---|:---:|:---:|---|
| **R-01** | Chất lượng scan kém làm giảm độ chính xác Tesseract OCR | Cao | Trung bình | Bổ sung bộ lọc nhị phân hóa & tương phản hình ảnh trước khi OCR. |
| **R-02** | Trình duyệt Safari di động bị giật khi render Canvas nặng | Trung bình | Trung bình | Triển khai lazy render Canvas theo từng trang thay vì render toàn bộ tài liệu cùng lúc. |
| **R-03** | Tuân thủ pháp lý bản quyền giáo trình | Cao | Thấp | Thực thi trạng thái mặc định `Chỉ đọc Nội bộ` yêu cầu đăng nhập SSO của trường. |

---

## 5. KẾ HOẠCH HÀNH ĐỘNG CHO SPRINT 3 (TUẦN 5-6)

1. **Hoàn thành US-05 (Đoạn trích Tìm kiếm Toàn văn):** Nối chỉ mục `tsvector` PostgreSQL với giao diện tìm kiếm để làm nổi bật từ khóa.
2. **Hoàn thành US-06 (Component DRM Canvas Reader):** Đóng gói giao diện reader chính thức với chèn watermark người dùng động.
3. **Hoàn thành US-08 (Quy trình Phê duyệt Sách):** Xây dựng giao diện phê duyệt của thủ thư trước khi xuất bản sách cho độc giả.

> **ĐÁNH GIÁ TỔNG THỂ:** PoC OCR đã giảm rủi ro của luồng xử lý tài liệu nền. Các rủi ro còn lại về tiến độ, bảo mật trình đọc và chất lượng dữ liệu vẫn phải được theo dõi trong các Sprint tiếp theo.
