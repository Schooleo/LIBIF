# LIBIF
## Hệ thống Số hóa Thư viện Thông minh (Library Digitization & Document Management System)

---

# BÁO CÁO TÌNH TRẠNG & KIỂM SOÁT TIẾN ĐỘ DỰ ÁN
### (SOFTWARE PROJECT MONITORING AND CONTROL REPORT)

> Báo cáo đánh giá tình trạng tiến độ thực tế, chi phí, quản lý rủi ro và khối lượng công việc hoàn thành tại **Cột mốc giữa kỳ (Tuần 4 / 8)** của dự án LIBIF. Sử dụng phương pháp Quản lý Giá trị Thu được (Earned Value Management - EVM), biểu đồ Burn-down chart và sự hỗ trợ phân tích của Trợ lý AI.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh (Library Digitization System) |
| **Kỳ báo cáo** | Báo cáo Tiến độ Giữa kỳ (Mid-term Status Report) — **Tuần 4 / 8** |
| **Ngày lập** | Ngày 20 tháng 07 năm 2026 |
| **Người thực hiện** | Antigravity AI Assistant & Project Manager |
| **Trạng thái Dự án** | 🟢 **ĐÚNG TIẾN ĐỘ & TRONG NGÂN SÁCH (ON TRACK & WITHIN BUDGET)** |

---

## 1. TỔNG QUAN TÌNH TRẠNG THỰC HIỆN DỰ ÁN (EXECUTIVE SUMMARY)

Đến hết **Sprint 2 (Tuần 4)**, dự án LIBIF đã hoàn thành đúng hạn 100% các hạng mục công việc cốt lõi của giai đoạn 1, bao gồm:
- **Sprint 1 (Tuần 1-2):** Đã hoàn tất khung dự án, tính năng Upload PDF (US-01) và Nhập Metadata tự động qua ISBN API (US-02).
- **Sprint 2 (Tuần 3-4):** Đã thử nghiệm nghiệm thu thành công Hàng đợi xử lý bất đồng bộ VietOCR Worker Queue & Nén file (US-03), Cổng tra cứu sách trực tuyến Catalog (US-04) và Hệ thống Phân quyền JWT Auth.

```
TIẾN ĐỘ DỰ ÁN THEO THỜI GIAN (WEEK 1 - WEEK 8)
[████████████████████████████████                    ] 50% Hoàn thành (4/8 Tuần)
└───────────────┬───────────────────┘└────────────────────────────────┘
    GIAI ĐOẠN 1: CORE ENGINE (ĐÃ ĐẠT)     GIAI ĐOẠN 2: ADVANCED & SECURITY (TIẾP THEO)
```

---

## 2. ĐÁNH GIÁ CHỈ SỐ EVM & CHI PHÍ THỰC TẾ (EARNED VALUE MANAGEMENT)

Để đo lường định lượng chính xác hiệu quả tiến độ và ngân sách, nhóm áp dụng kỹ thuật **Earned Value Management (EVM)** tại mốc Tuần 4 với tổng ngân sách phát triển (BAC - Budget at Completion) là **90.500.000 VNĐ** (cho 6 nhân sự trong 8 tuần).

### 2.1 Bảng tính chỉ số EVM tại Tuần 4

| Chỉ số EVM | Tên viết tắt | Giá trị Tính toán (VNĐ / Chỉ số) | Công thức / Ý nghĩa |
|---|:---:|:---:|---|
| **Budget at Completion** | **BAC** | **90.500.000 VNĐ** | Tổng ngân sách dự kiến của dự án |
| **Planned Value** | **PV** | **45.250.000 VNĐ** | Giá trị kế hoạch phải đạt tại Tuần 4 (50% BAC) |
| **Earned Value** | **EV** | **47.060.000 VNĐ** | Giá trị thực tế công việc đã hoàn thành (~52% BAC) |
| **Actual Cost** | **AC** | **41.200.000 VNĐ** | Chi phí thực tế đã chi trả cho 4 tuần đầu |
| **Cost Variance** | **CV** | **+5.860.000 VNĐ** | `EV - AC` (> 0: Tiết kiệm chi phí) |
| **Schedule Variance** | **SV** | **+1.810.000 VNĐ** | `EV - PV` (> 0: Vượt tiến độ kế hoạch) |
| **Cost Performance Index** | **CPI** | **1.14** | `EV / AC` (> 1.0: Hiệu quả chi phí tốt) |
| **Schedule Performance Index**| **SPI** | **1.04** | `EV / PV` (> 1.0: Tiến độ nhanh hơn kế hoạch 4%) |
| **Estimate at Completion** | **EAC** | **79.385.964 VNĐ** | `BAC / CPI` (Dự báo tổng chi phí khi hoàn thành dự án) |

> 🟢 **Nhận xét chỉ số:** Với **CPI = 1.14** và **SPI = 1.04**, dự án đang hoạt động cực kỳ hiệu quả. Tiến độ nhanh hơn kế hoạch **4%** và tiết kiệm được **14% chi phí thù lao nhân sự** nhờ sự hỗ trợ đắc lực của công cụ AI Coding Assistants giúp giảm bớt thời gian sửa lỗi (debugging).

---

## 3. BIỂU ĐỒ BURN-DOWN CHART VÀ KHỐI LƯỢNG CÔNG VIỆC (SPRINT BURN-DOWN)

### 3.1 Biểu đồ Burn-down Story Points (Sprint 1 - Sprint 4)

```
Story Points
 80 ┼ ─── Ideal Burn-down
    │ ╲  *** Actual Progress
 60 ┼───*──────────────────────────────────────
    │    ╲ *
 40 ┼─────╲──*─────────────────────────────────
    │      ╲  * (Tuần 4: 36 Points còn lại)
 20 ┼───────╲───░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    │        ╲  ░░░ (Dự báo Sprint 3 & 4)
  0 ┴─────────┴──────────┴──────────┴──────────
   Sprint 0    Sprint 1   Sprint 2   Sprint 3   Sprint 4
               (Tuần 2)   (Tuần 4)   (Tuần 6)   (Tuần 8)
```

### 3.2 Bảng theo dõi tiến độ chi tiết từng User Story

| Mã US | Tên User Story | Khối lượng (Story Points) | Trạng thái thực tế | Ghi chú & Đội ngũ phụ trách |
|---|---|:---:|:---:|---|
| **US-01** | Upload PDF sách thô | 5 SP | 🟢 Complete (Done) | Backend Dev + MinIO Storage |
| **US-02** | Nhập Metadata qua ISBN | 5 SP | 🟢 Complete (Done) | Frontend Engineer (Google Books API) |
| **US-03** | Processing & VietOCR | 13 SP | 🟢 Complete (Done) | AI Specialist + Redis BullMQ Queue |
| **US-04** | Cổng tra cứu Catalog | 8 SP | 🟢 Complete (Done) | Frontend & Backend Engineers |
| **US-05** | Tìm kiếm nội dung Full-text | 8 SP | 🟡 In Progress (50%) | Đã xong Indexing, đang nối API Viewer |
| **US-06** | Trình xem bảo mật DRM Canvas | 13 SP | 🟡 In Progress (40%) | Đã xong PoC, đang đóng gói UI |
| **US-07** | Dashboard Thống kê | 8 SP | ⚪ Pending | Đã lên kịch bản, làm trong Sprint 4 |
| **US-08** | Duyệt sách (Approval) | 5 SP | ⚪ Pending | Làm trong Sprint 3 |
| **US-09** | Quản lý Tags & Category | 5 SP | ⚪ Pending | Làm trong Sprint 4 |

---

## 4. QUẢN LÝ RỦI RO VÀ HÀNH ĐỘNG KHẮC PHỤC (RISK REGISTER & CONTINGENCY)

| Mã Rủi ro | Mô tả Rủi ro | Mức độ Tác động | Khả năng xảy ra | Hành động Kiểm soát & Khắc phục |
|---|---|:---:|:---:|---|
| **R-01** | File PDF quét chất lượng kém làm giảm độ chính xác OCR | High | Medium | Thêm bộ lọc tiền xử lý ảnh (Binarization & Contrast adjust) trước khi đưa vào VietOCR. |
| **R-02** | Trình duyệt Safari di động bị chậm khi render Canvas nặng | Medium | Medium | Áp dụng lazy-loading render từng trang Canvas thay vì render toàn bộ file. |
| **R-03** | Vấn đề pháp lý bản quyền tài liệu sách giáo trình | High | Low | Cấu hình mặc định trạng thái sách là `Internal Read Only`, bắt buộc đăng nhập SSO trường. |

---

## 5. KẾ HOẠCH HÀNH ĐỘNG CHO SPRINT 3 (TUẦN 5-6)

Dựa trên kết quả theo dõi tiến độ Tuần 4, nhóm thiết lập các ưu tiên hành động trọng tâm cho Sprint 3:
1. **Hoàn thiện US-05 (Full-text Search Snippet):** Nối chỉ mục PostgreSQL tsvector với giao diện hiển thị kết quả tìm kiếm kèm highlight từ khóa.
2. **Hoàn thiện US-06 (DRM Canvas Reader Component):** Đóng gói UI đọc sách chính thức, áp dụng Dynamic Watermark mờ mang thông tin tài khoản đọc.
3. **Hoàn thiện US-08 (Librarian Approval Workflow):** Xây dựng trang quản trị phê duyệt sách trước khi xuất bản công khai.

> **ĐÁNH GIÁ TỔNG THỂ CỦA AI ASSISTANT:** Dự án LIBIF đang giữ vững nhịp độ phát triển mượt mà. Rủi ro về mặt kỹ thuật đã được triệt tiêu qua bước PoC. Dự án hoàn toàn đủ khả năng nghiệm thu đúng hạn vào cuối Tuần 8.
