# BÁO CÁO ƯỚC LƯỢNG THỜI GIAN, TÀI NGUYÊN VÀ CHI PHÍ DỰ ÁN LIBIF
### *(SOFTWARE PROJECT ESTIMATION REPORT)*

---

> **Dự án:** LIBIF — Hệ thống Số hóa Thư viện Thông minh (*Library Digitization & Document Management System*)  
> **Phân loại:** Báo cáo Ước lượng Kỹ thuật & Chi phí Dự án Phần mềm  
> **Trạng thái:** Bản chính thức v1.0  
> **Ngày lập:** 20 tháng 07 năm 2026  
> **Đội ngũ thực hiện:** 6 sinh viên năm 4, Khoa Công nghệ Thông tin — HCMUS (kết hợp Trợ lý AI Copilot Pro & Antigravity AI)  

---

## 1. GIỚI THIỆU & CƠ SỞ ƯỚC LƯỢNG

Tài liệu này trình bày kết quả ước lượng toàn diện về **Thời gian (Schedule/Duration)**, **Tài nguyên (Resources)** và **Chi phí (Cost/Budget)** cho dự án **LIBIF**. Tất cả các ước lượng được tính toán dựa trên mô hình phân rã công việc thực tế, kết hợp ứng dụng trợ lý AI năm 2026 nhằm tối ưu hóa năng suất phát triển phần mềm.

### 1.1 Khái niệm & Định nghĩa Chỉ số

*   **Effort (Công sức):** Số đơn vị lao động cần thiết để hoàn thành một công việc (tính bằng *man-hours*, *man-days* hoặc *man-weeks*).
*   **Duration (Thời lượng):** Tổng số chu kỳ làm việc thực tế (workdays/workweeks) để hoàn tất công việc, không bao gồm ngày nghỉ.
*   **Elapsed Time (Thời gian trôi qua):** Tổng thời gian lịch thực tế từ lúc bắt đầu đến khi kết thúc (bao gồm cả ngày nghỉ, thời gian chờ đợi bất đồng bộ).
*   **AI Acceleration Factor (Hệ số tăng tốc từ AI):** Trong năm 2026, việc áp dụng trợ lý AI (GitHub Copilot Pro, Antigravity AI) giúp giảm **25% – 35% Effort** đối với các tác vụ viết mã chuẩn hóa (boilerplate, CRUD API, viết Unit Test, tạo mockups).

---

## 2. WORK BREAKDOWN STRUCTURE (WBS) & DANH SÁCH CÔNG VIỆC

Cấu trúc phân rã công việc (WBS) của dự án LIBIF được chi tiết hóa thành các gói công việc (Work Packages):

```
WBS 1.0: KHỞI ĐỘNG & THIẾT KẾ KIẾN TRÚC (TUẦN 1 - 2)
  ├── 1.1 Phân tích Yêu cầu Chi tiết & Thống nhất API Contract
  ├── 1.2 Thiết kế CSDL (Database Schema: PostgreSQL & Redis)
  ├── 1.3 Thiết lập Hạ tầng Dev Cloud AWS (EC2 Spot, S3) & Dockerizing
  ├── 1.4 Thiết lập Luồng CI/CD (GitHub Actions)
  └── 1.5 Thiết kế UI/UX Wireframes & Design System (Figma)

WBS 2.0: PHÁT TRIỂN CORE MVP - DIGITIZATION & DISCOVERY (TUẦN 3 - 5)
  ├── 2.1 Backend Auth, Upload Service (PDF Document Upload)
  ├── 2.2 Integration Google Books API & ISBN Barcode Scanner
  ├── 2.3 Worker Queue Engine & Fine-tune VietOCR/PaddleOCR
  ├── 2.4 Frontend Librarian Admin Portal & Upload Interface
  ├── 2.5 Online Catalog Portal & Multi-attribute Search
  ├── 2.6 Full-text Search Engine Indexing (PostgreSQL TSVector)
  └── 2.7 Secure Canvas DRM PDF Viewer Interface

WBS 3.0: PHÁT TRIỂN NÂNG CAO - MANAGEMENT & SECURITY (TUẦN 5 - 7)
  ├── 3.1 DRM Security Layer (AWS Presigned URLs, Disable F12/Copy)
  ├── 3.2 Librarian Approval Workflow
  ├── 3.3 Management Dashboard & Statistics Export Excel
  ├── 3.4 Category Tree & Tag Management
  └── 3.5 Integration Testing & Performance Optimization (Stress Test k6)

WBS 4.0: UAT, BÀN GIAO & TRIỂN KHAI (TUẦN 7 - 8)
  ├── 4.1 Đánh giá OCR Accuracy & Tinh chỉnh Model (≥ 93%)
  ├── 4.2 Tổ chức User Acceptance Testing (UAT) với Thủ thư & Sinh viên
  ├── 4.3 Sửa lỗi UI/UX & Fix Bugs sau UAT
  ├── 4.4 Deploy Production lên AWS Cloud chính thức
  └── 4.5 Viết User Manual, Đóng gói Codebase & Bàn giao Tài khoản
```

---

## 3. ƯỚC LƯỢNG EFFORT & DURATION (KỸ THUẬT PERT THREE-POINT ESTIMATION)

Áp dụng phương pháp **Ước lượng 3 điểm (PERT Beta Distribution)**:
$$\text{Effort PERT } (t_E) = \frac{t_O + 4t_M + t_P}{6}$$
Trong đó:
*   $t_O$: Optimistic (Kịch bản lạc quan)
*   $t_M$: Most Likely (Kịch bản khả thi nhất)
*   $t_P$: Pessimistic (Kịch bản bi quan)

Sau khi tính $t_E$, áp dụng **Hệ số tăng tốc AI** ($\text{Effort thực tế} = t_E \times (1 - \text{AI Factor})$).

### Bảng Chi tiết Ước lượng Effort & Duration cho từng WBS (Tính bằng Man-Days):

| WBS | Tên Công việc / Module | $t_O$ | $t_M$ | $t_P$ | $t_E$ (PERT) | AI Factor | Effort Thực tế (Man-days) | Phân công Nhân sự chính | Duration (Ngày) |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|---|:---:|
| **1.1** | Phân tích SRS & API Contract | 3 | 4 | 7 | 4.33 | 10% | **3.9** | PM/Architect | 4 |
| **1.2** | Thiết kế CSDL (Postgres & Redis) | 2 | 3 | 5 | 3.17 | 20% | **2.5** | PM + Backend Dev | 3 |
| **1.3** | Setup AWS Dev Cloud & Docker | 2 | 3 | 6 | 3.33 | 25% | **2.5** | PM (DevOps Lead) | 3 |
| **1.4** | Setup CI/CD GitHub Actions | 1 | 2 | 4 | 2.17 | 30% | **1.5** | PM (DevOps Lead) | 2 |
| **1.5** | UI/UX Design System & Mockups | 4 | 6 | 9 | 6.17 | 25% | **4.6** | UI/UX Designer | 5 |
| **2.1** | Upload PDF & S3 Storage | 3 | 5 | 8 | 5.17 | 30% | **3.6** | Backend Dev | 4 |
| **2.2** | ISBN Metadata Google Books | 2 | 4 | 7 | 4.17 | 30% | **2.9** | Backend Dev | 3 |
| **2.3** | OCR Worker Queue & VietOCR | 6 | 9 | 15 | 9.50 | 20% | **7.6** | AI/OCR Specialist | 8 |
| **2.4** | Admin Portal Upload Interface | 4 | 6 | 10 | 6.33 | 35% | **4.1** | Frontend Dev | 5 |
| **2.5** | Catalog Search Interface | 4 | 6 | 9 | 6.17 | 35% | **4.0** | Frontend Dev | 5 |
| **2.6** | Full-text Search Indexing | 3 | 5 | 9 | 5.33 | 25% | **4.0** | AI Specialist + Backend | 4 |
| **2.7** | DRM Canvas Reader UI | 5 | 8 | 13 | 8.33 | 30% | **5.8** | Frontend Dev | 6 |
| **3.1** | Presigned URL & Anti-Download DRM | 3 | 5 | 8 | 5.17 | 25% | **3.9** | Backend + Frontend | 4 |
| **3.2** | Approval Workflow | 2 | 4 | 6 | 4.00 | 30% | **2.8** | Backend + Frontend | 3 |
| **3.3** | Dashboard & Export Excel | 3 | 5 | 8 | 5.17 | 35% | **3.4** | Frontend + UI/UX | 4 |
| **3.4** | Category Tree & Tag Management | 2 | 3 | 6 | 3.33 | 35% | **2.2** | Frontend + Backend | 3 |
| **3.5** | Integration Test & k6 Stress Test | 4 | 6 | 10 | 6.33 | 25% | **4.7** | QA / Tester | 5 |
| **4.1** | Evaluate OCR Accuracy (≥ 93%) | 3 | 4 | 7 | 4.33 | 20% | **3.5** | QA + AI Specialist | 4 |
| **4.2** | Tổ chức UAT với Thủ thư & SV | 3 | 4 | 6 | 4.17 | 10% | **3.8** | QA + UI/UX Designer | 4 |
| **4.3** | Fix Bugs & Polish UI sau UAT | 4 | 6 | 10 | 6.33 | 30% | **4.4** | Cả nhóm 6 người | 5 |
| **4.4** | Triển khai Production AWS | 2 | 3 | 5 | 3.17 | 25% | **2.4** | PM (Lead) | 2 |
| **4.5** | Viết Manual & Bàn giao Hệ thống | 3 | 5 | 8 | 5.17 | 30% | **3.6** | UI/UX (Tech Writer) | 4 |
| **TỔNG**| **Toàn bộ Dự án LIBIF** | | | | **108.1**| | **81.7 Man-days** | **Đội ngũ 6 nhân sự** | **8 Tuần (40 ngày làm việc)** |

> 💡 **Nhận xét về Effort & Duration:**  
> - Tổng Effort PERT ban đầu là **108.1 Man-days**. Nhờ ứng dụng AI Copilot Pro & Antigravity AI, Effort thực tế giảm xuống còn **81.7 Man-days**.  
> - Với 6 thành viên làm việc song song trong 40 ngày làm việc (8 tuần x 5 ngày/tuần = 240 Man-days tổng năng lực), tải công việc trung bình là **~34% năng lực tối đa**, đảm bảo đội ngũ sinh viên vừa học tập vừa hoàn thành dự án chất lượng cao mà không bị quá tải.

---

## 4. CƠ CẤU PHÂN RÃ TÀI NGUYÊN (RESOURCE BREAKDOWN STRUCTURE - RBS)

Cơ cấu phân rã tài nguyên dự án LIBIF phân loại chi tiết theo **Con người (Human Resources)** và **Hạ tầng/Công cụ (Infrastructure & Tools)**:

```
RBS: TÀI NGUYÊN DỰ ÁN LIBIF
 ├── 1. TÀI NGUYÊN CON NGƯỜI (6 Thành viên)
 │     ├── 1.1 PM / System Architect (Lead): Quản lý tiến độ, CI/CD, Core API, DevOps
 │     ├── 1.2 Backend Engineer: API Catalog, S3 Integration, Presigned URLs
 │     ├── 1.3 AI / OCR Specialist: Fine-tune VietOCR/PaddleOCR, Redis Worker, Full-text Search
 │     ├── 1.4 Frontend Engineer: Web Portal (Admin/Reader), DRM Canvas Reader
 │     ├── 1.5 UI/UX Designer & Tech Writer: Wireframes, Design System, User Manual
 │     └── 1.6 QA / Tester: Test Plan, Automation Integration Test, OCR Accuracy Evaluation, UAT
 └── 2. HẠ TẦNG & CÔNG CỤ (Infrastructure & Software Tools)
       ├── 2.1 Công cụ AI Trợ lực: 6 x GitHub Copilot Pro Licenses
       ├── 2.2 Môi trường Dev Cloud: AWS EC2 (Spot Instance) & AWS S3
       ├── 2.3 Môi trường Production Cloud: AWS EC2 t3.medium, t3.large, AWS S3 Standard
       └── 2.4 Dịch vụ Phụ trợ: Redis Cloud, Namecheap Domain, SSL Let's Encrypt
```

### 4.1 Ma trận Phân công Trách nhiệm (RACI Matrix)

| WBS / Giai đoạn | PM (Lead) | Backend Dev | AI Specialist | Frontend Dev | UI/UX & Tech Writer | QA / Tester |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Khởi động & Kiến trúc (Tuần 1-2)** | **A / R** | C | C | C | R | C |
| **Phát triển Core MVP (Tuần 3-5)** | A | **R** | **R** | **R** | C | C |
| **DRM Reader & Full-text Search** | A | R | **R** | **R** | C | C |
| **Dashboard & Management (Tuần 5-7)**| A | R | C | **R** | R | **R** |
| **UAT, Production & Bàn giao (Tuần 8)**| **A / R** | C | C | C | **R** | **R** |

*(Ghi chú: **R** = Responsible - Người thực hiện; **A** = Accountable - Người chịu trách nhiệm chính; **C** = Consulted - Người được tham vấn; **I** = Informed - Người được thông báo).*

---

## 5. ƯỚC LƯỢNG CHI PHÍ & DỰ TOÁN NGÂN SÁCH (COST BASELINE & BUDGET)

Chi phí nhân lực (*Effort costs*) là yếu tố chiếm tỷ trọng chủ đạo trong ngân sách dự án phần mềm.

### 5.1 Ngân sách Phát triển Một lần (One-Time Development Budget - 8 Tuần)

#### A. Chi phí Nhân lực (Direct Labor Costs):
*Tính toán thù lao hỗ trợ cho 6 sinh viên trong 2 tháng phát triển MVP:*

| STT | Vai trò | Số lượng | Mức hỗ trợ / tháng | Tổng chi phí (2 tháng / 8 tuần) |
|:---:|---|:---:|:---:|:---:|
| 1 | PM / System Architect (Lead) | 1 | 9.000.000 VNĐ | **18.000.000 VNĐ** |
| 2 | Backend Engineer | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** |
| 3 | AI / OCR Specialist | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** |
| 4 | Frontend Engineer | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** |
| 5 | UI/UX Designer & Tech Writer | 1 | 6.000.000 VNĐ | **12.000.000 VNĐ** |
| 6 | QA / Tester | 1 | 5.000.000 VNĐ | **10.000.000 VNĐ** |
| **TỔNG**| **Cộng Chi phí Nhân lực** | **6** | | **85.000.000 VNĐ** |

#### B. Chi phí Công cụ & Hạ tầng Phát triển (Development Tools & Cloud):

| Hạng mục | Giải pháp / Cấu hình | Công thức tính | Tổng chi phí (8 tuần) |
|---|---|---|:---:|
| Phí trợ lý AI | GitHub Copilot Pro | 250.000 VNĐ/tháng × 6 người × 2 tháng | **3.000.000 VNĐ** |
| AWS Dev Cloud | EC2 Spot Instances & S3 Test | Ước tính hạ tầng chạy thử nghiệm dev | **2.500.000 VNĐ** |
| **TỔNG** | **Cộng Chi phí Công cụ & Dev Cloud** | | **5.500.000 VNĐ** |

👉 **TỔNG CHI PHÍ PHÁT TRIỂN GỐC (BASE DEVELOPMENT COST):** **90.500.000 VNĐ**

---

### 5.2 Phân tích Dự phòng Rủi ro (Reserve Analysis / Buffer Effort)

Để ứng phó với các rủi ro kỹ thuật phát sinh (sự cố hạ tầng, điều chỉnh yêu cầu phát sinh, kéo dài thời gian kiểm thử), dự án áp dụng **Quỹ dự phòng rủi ro (Contingency Reserve) 15%**:

$$\text{Dự phòng phát triển} = 90.500.000 \text{ VNĐ} \times 15\% = \mathbf{13.575.000 \text{ VNĐ}}$$

👉 **TỔNG NGÂN SÁCH PHÁT TRIỂN BAO GỒM DỰ PHÒNG:** **104.075.000 VNĐ**

---

### 5.3 Ngân sách Vận hành Hằng năm (Recurring Operating Budget)

Ngân sách duy trì hệ thống chạy thực tế trên môi trường Production sau khi bàn giao:

#### A. Hạ tầng AWS Cloud Production (Hằng tháng):
- Web Server (AWS EC2 t3.medium: 2 vCPU, 4GB RAM): **770.000 VNĐ/tháng**
- OCR Worker (AWS EC2 t3.large: 2 vCPU, 8GB RAM): **1.540.000 VNĐ/tháng**
- Object Storage (AWS S3 Standard 50GB ban đầu): **30.000 VNĐ/tháng**
- Redis Cloud & Domain/SSL: **30.000 VNĐ/tháng**
- *Cộng chi phí hạ tầng Cloud:* **2.370.000 VNĐ/tháng** ($\rightarrow$ **28.440.000 VNĐ/năm**)

#### B. Bản quyền AI & Phí Bảo trì Hằng năm:
- Bản quyền GitHub Copilot Pro cho đội ngũ bảo trì (6 người × 250k × 12 tháng): **18.000.000 VNĐ/năm**
- Phí công tác bảo trì, backup & hỗ trợ kỹ thuật (10 giờ/tháng × 250k/giờ): **30.000.000 VNĐ/năm**

👉 **TỔNG NGÂN SÁCH VẬN HÀNH NĂM ĐẦU (RECURRING BUDGET YEAR 1):** **76.440.000 VNĐ/năm**  
👉 **Dự phòng vận hành (15% Contingency):** **11.466.000 VNĐ/năm**

---

## 6. KẾT LUẬN & KHUYẾN NGHỊ

1. **Tính Khả thi Cao:** Với quy mô 6 nhân sự và việc áp dụng trợ lý AI năm 2026, dự án LIBIF rút ngắn Effort thực tế xuống **81.7 Man-days**, hoàn toàn khả thi trong tiến độ **8 tuần (40 ngày làm việc)**.
2. **Tối ưu Ngân sách:** Tổng chi phí phát triển MVP chỉ **90.500.000 VNĐ** (chưa bao gồm dự phòng) và chi phí vận hành cloud cứng chỉ **~2.37M VNĐ/tháng**, mang lại tỷ suất hoàn vốn (ROI) vượt trội so với việc mua phần mềm thương mại đắt đỏ (100M - 1B VNĐ).
3. **Quản lý Tiến độ:** Cần tuân thủ chặt chẽ các mốc Milestone (M0 – M5) và thực hiện san bằng tài nguyên (Resource Leveling) ở Giai đoạn 2 và 3 để tránh nghẽn luồng xử lý OCR và DRM Reader.
