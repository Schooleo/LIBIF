# KẾ HOẠCH QUẢN LÝ DỰ ÁN (PROJECT MANAGEMENT PLAN)
## HỆ THỐNG THƯ VIỆN SỐ & QUẢN LÝ BẢN QUYỀN SỐ (LIBIF / CDLS)

> **Học phần:** Quản lý Dự án Phần mềm – GV. TS. Ngô Huy Biên (2026)  
> **Mã tài liệu:** `LIBIF-Project-Planning` | **Phiên bản:** 1.0 (Kế hoạch chính thức)  
> **Nhóm thực hiện:** Nhóm 06 sinh viên | **Phương pháp:** Scrum (05 Sprint × 02 tuần)

---

### BẢNG THÔNG TIN KẾ HOẠCH VÀ BASELINE THAM CHIẾU

| Thuộc tính | Giá trị cam kết / Baseline |
| :--- | :--- |
| **Tên dự án** | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| **Thời gian thực hiện** | 10 tuần học (05 Sprint, mỗi Sprint 02 tuần) |
| **Quy mô nhóm** | 06 sinh viên (có Coding Agent hỗ trợ kỹ thuật) |
| **Mức cam kết cá nhân** | 15 giờ / sinh viên / tuần (Tổng cộng: 90 giờ/tuần cả nhóm) |
| **Tổng Effort danh nghĩa** | **900 giờ-người** (6 SV × 15h × 10 tuần) |
| **Effort tập trung sản phẩm** | **765 giờ-người** (sau khi trừ 15% hội họp và gián đoạn học tập) |
| **Tổng quy mô Backlog** | **136 Story Points** (117 SP tính năng + 19 SP Enablers) |
| **Phạm vi cam kết (MoSCoW)** | **13 Must Have (104 SP)**; **03 Should Have (13 SP co giãn)** |
| **Ngân sách tiền mặt** | **8.800.000 VNĐ** (đã bao gồm 10% dự phòng rủi ro) |
| **Mục tiêu cuối cùng** | Bàn giao MVP hoạt động được, bộ tài liệu và demo trước cuối tuần 10 |

---

### 1. MỤC TIÊU VÀ TIÊU CHÍ THÀNH CÔNG DỰ ÁN

| Mã | Tiêu chí thành công | Chỉ số / Điều kiện nghiệm thu |
| :--- | :--- | :--- |
| **SC-01** | **Hoàn thành phạm vi cốt lõi** | Toàn bộ 13 PBI Must Have được demo hoạt động trọn vẹn trên môi trường Staging. |
| **SC-02** | **Increment cài đặt được** | Hệ thống cài đặt thành công qua Docker Compose hoặc tài liệu hướng dẫn README. |
| **SC-03** | **Minh chứng vận hành Scrum** | Có đầy đủ Sprint Goal, Sprint Backlog, biên bản Review, Retro và Velocity từng Sprint. |
| **SC-04** | **Chất lượng kiểm thử** | Không còn lỗi Critical; bộ test cốt lõi (Unit/Integration) pass 100%. |
| **SC-05** | **Đúng hạn học phần** | Toàn bộ mã nguồn, tài liệu, slide và demo hoàn tất vào cuối tuần 10. |
| **SC-06** | **Đóng góp minh bạch** | Lịch sử commit, Pull Request, Review và bảng chấm công thể hiện sự đóng góp đồng đều. |
| **SC-07** | **Sử dụng AI có trách nhiệm** | Mã do Coding Agent hỗ trợ đều được thành viên hiểu, giải thích được và qua Peer Review. |

---

### 2. WORK BREAKDOWN STRUCTURE (WBS) – CẤU TRÚC PHÂN RÃ CÔNG VIỆC

| WBS ID | Gói công việc | Phạm vi PBIs / Enablers | Sản phẩm đầu ra chính | Phụ trách chính |
| :---: | :--- | :--- | :--- | :--- |
| **1.0** | **Quản lý dự án** | Cross-cutting toàn bộ | Bộ tài liệu quản lý, Sprint Backlog, biên bản họp, Risk/Issue/Change log | TV-01 (PO), TV-02 (SM) |
| **2.0** | **Nền tảng kỹ thuật** | **EN-01** | Khung kiến trúc, Auth/RBAC nền, Database Schema, Docker Compose, CI/CD | TV-02 (Tech Lead), TV-06 |
| **3.0** | **Số hóa và OCR** | **PBI-01, 02, 03** | API Upload, BullMQ OCR queue, Tesseract Engine, UI theo dõi tiến độ | TV-03 (Backend/OCR Dev) |
| **4.0** | **Kiểm duyệt & Biên mục**| **PBI-04, 05, 06** | Giao diện đối soát Side-by-side, workflow phê duyệt, form biên mục | TV-04 (Frontend Dev) |
| **5.0** | **Xuất bản & Phân quyền** | **PBI-07, 08, 09** | Module mã hóa AES-256, MinIO Vault, RBAC tài liệu, Redis session lock | TV-02, TV-03 |
| **6.0** | **Tìm kiếm & Trình đọc** | **PBI-10 đến 15** | PostgreSQL Search, HTML5 Canvas Reader, Watermark, Blur, Chặn tải | TV-04, TV-05 (Security Dev) |
| **7.0** | **Audit & Kiểm thử** | **PBI-16, EN-02** | Module Audit Trail, bộ Unit/Integration/E2E tests, báo cáo kiểm thử | TV-05, TV-06 (QA Dev) |
| **8.0** | **Bàn giao học phần** | **EN-03** | Hướng dẫn sử dụng, slide thuyết trình, kịch bản demo, báo cáo tổng kết | TV-01, TV-06 |

---

### 3. KẾ HOẠCH TIẾN ĐỘ 05 SPRINT VÀ CÁC MỐC MILESTONE

```
[Tuần 1-2: Sprint 1] ──> [Tuần 3-4: Sprint 2] ──> [Tuần 5-6: Sprint 3] ──> [Tuần 7-8: Sprint 4] ──> [Tuần 9-10: Sprint 5]
   (Mốc G1: Nền tảng)       (Mốc G2: Giữa kỳ)        (Mốc G3: DRM/Phiên)     (Mốc G4: Đủ tính năng)     (Mốc G5: Bàn giao)
```

| Sprint | Tuần | Mục tiêu chính (Sprint Goal) | Phạm vi PBIs | Quy mô | Milestone & Điều kiện đạt mốc |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **Sprint 1** | 1-2 | Khởi tạo nền tảng & Luồng OCR cơ bản | EN-01, PBI-01, PBI-02 | **26 SP** | **Mốc G1:** Repo Git, CI/CD, Upload & OCR chạy mẫu |
| **Sprint 2** | 3-4 | Hoàn thành nghiệp vụ kiểm duyệt & biên mục | PBI-03, PBI-04, PBI-05, PBI-06 | **28 SP** | **Mốc G2:** Demo luồng Thủ thư; Báo cáo giữa kỳ |
| **Sprint 3** | 5-6 | Xuất bản an toàn & Kiểm soát truy cập | PBI-07, PBI-08, PBI-09, PBI-16 | **29 SP** | **Mốc G3:** Mã hóa AES, RBAC, Redis limit, Audit |
| **Sprint 4** | 7-8 | Tra cứu toàn văn & Đọc sách an toàn | PBI-10, PBI-11, PBI-14, PBI-15 | **29 SP** | **Mốc G4:** Full-text Search, Canvas Reader, Watermark |
| **Sprint 5** | 9-10 | Tích hợp, kiểm thử toàn diện & Nộp bài | PBI-12, PBI-13, EN-02, EN-03 | **24 SP** | **Mốc G5:** Code Freeze, Test Report, Demo cuối kỳ |
| **TỔNG** | **10 tuần** | **Hoàn thiện trọn vẹn hệ thống MVP** | **16 PBIs + 3 EN** | **136 SP** | **Velocity trung bình: ~27.2 SP/Sprint** |

---

### 4. CƠ CẤU TỔ CHỨC NHÓM VÀ MA TRẬN PHÂN CÔNG TRÁCH NHIỆM (RACI)

#### 4.1 Phân công vai trò chính và kiêm nhiệm
- **TV-01:** Product Owner / Business Analyst (Kiêm nhiệm: UI/UX, Demo Coordinator) - Capacity: 15h/tuần.
- **TV-02:** Scrum Master / Technical Lead (Kiêm nhiệm: Backend Developer) - Capacity: 15h/tuần.
- **TV-03:** Backend / OCR Developer (Kiêm nhiệm: Data Engineer) - Capacity: 15h/tuần.
- **TV-04:** Frontend Developer (Kiêm nhiệm: UI/UX Design) - Capacity: 15h/tuần.
- **TV-05:** Frontend / Security Developer (Kiêm nhiệm: Backend Support) - Capacity: 15h/tuần.
- **TV-06:** QA / DevOps Engineer (Kiêm nhiệm: Documentation Coordinator) - Capacity: 15h/tuần.

#### 4.2 Ma trận RACI rút gọn
*(R = Responsible - Thực hiện; A = Accountable - Chịu trách nhiệm; C = Consulted - Tham vấn; I = Informed - Nhận thông tin)*

| Hoạt động quản lý & kỹ thuật | PO/BA (TV-01) | SM/Tech Lead (TV-02) | Dev Team (TV-03,04,05) | QA/DevOps (TV-06) | Giảng viên |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Quản lý Product Backlog & Ưu tiên** | **A / R** | C | C | C | I |
| **Lập kế hoạch Sprint & Điều phối Scrum** | C | **A / R** | R | R | I |
| **Kiến trúc & Quyết định kỹ thuật** | C | **A** | R | C | I |
| **Phát triển mã nguồn tính năng** | C | R | **A / R** | R | I |
| **Kiểm thử & Quản lý chất lượng** | C | C | R | **A / R** | I |
| **Tài liệu & Báo cáo học phần** | **A** | C | R | R | I |
| **Phê duyệt thay đổi Deadline / Học phần**| C | R | C | C | **A** |
| **Demo và Nghiệm thu cuối kỳ** | **A / R** | R | R | R | I |

---

### 5. QUY TRÌNH QUẢN LÝ CHẤT LƯỢNG VÀ LUỒNG CÔNG VIỆC

#### 5.1 Luồng trạng thái công việc (Workflow)
$$\text{Product Backlog} \longrightarrow \text{Ready} \longrightarrow \text{In Progress} \longrightarrow \text{Code Review} \longrightarrow \text{Testing} \longrightarrow \text{Done}$$

- **Quy tắc WIP:** Mỗi thành viên không nhận quá 02 task ở trạng thái `In Progress`.
- **Quy tắc Review:** Mọi Pull Request bắt buộc phải có ít nhất 01 thành viên khác duyệt trước khi merge.
- **Xử lý lỗi:** Lỗi mức Critical/High được ưu tiên xử lý trước các tính năng mới trong Sprint.

#### 5.2 Definition of Ready (DoR) – Tiêu chuẩn sẵn sàng
Một PBI chỉ được đưa vào Sprint Planning khi:
1. Có User Story rõ ràng và Tiêu chí chấp nhận (Acceptance Criteria) cụ thể.
2. Đã xác định rõ phụ thuộc kỹ thuật, dữ liệu test mẫu và wireframe/giao diện liên quan.
3. Toàn nhóm đã thông qua ước lượng Story Points (bằng Planning Poker).
4. Kích thước PBI vừa vặn để hoàn thành trong 1 Sprint (không vượt quá 13 SP).

#### 5.3 Definition of Done (DoD) – Tiêu chuẩn hoàn thành
Một PBI chỉ được tính là hoàn thành khi:
1. Toàn bộ Acceptance Criteria đã được kiểm tra trên môi trường Staging/Demo.
2. Mã nguồn đã qua Peer Review và vượt qua kiểm tra Lint/Build tự động trên CI/CD.
3. Có Unit/Integration Test tương ứng; không còn lỗi Critical hoặc High mở.
4. Có đầy đủ xử lý ngoại lệ, logging và cập nhật tài liệu kỹ thuật/hướng dẫn liên quan.
5. Product Owner chính thức nghiệm thu và chấp nhận trong buổi Sprint Review.
6. Thành viên phụ trách có khả năng giải thích thiết kế và mã nguồn (kể cả phần có AI hỗ trợ).

---

### 6. KẾ HOẠCH QUẢN LÝ RỦI RO CHÍNH (RISK REGISTER)

| Mã | Rủi ro nhận diện | Mức độ | Kế hoạch phòng ngừa và ứng phó | Người phụ trách |
| :--- | :--- | :---: | :--- | :--- |
| **R-01** | Trùng lịch thi cử làm thiếu hụt Capacity | **Cao** | Khai báo availability đầu Sprint; áp dụng Pairing; sẵn sàng hoãn 3 PBI Should Have. | TV-02 (SM) |
| **R-02** | Phân công không đều / Phụ thuộc cá nhân | **Trung bình**| Theo dõi bảng chấm công, review chéo bắt buộc, chia sẻ kiến thức định kỳ. | TV-02 (SM) |
| **R-03** | OCR tiếng Việt kém trên ảnh quét chất lượng thấp | **Cao** | Chuẩn hóa dữ liệu mẫu 300 DPI; tiền xử lý ảnh; giới hạn phạm vi demo. | TV-03 (Backend) |
| **R-04** | Web Crypto / Canvas không tương thích trình duyệt | **Trung bình**| Tập trung tối ưu cho Chrome/Edge; ghi rõ ma trận tương thích trong tài liệu. | TV-05 (Security) |
| **R-05** | Kỳ vọng bảo vệ bản quyền tuyệt đối 100% | **Cao** | Định vị rõ hệ thống là giải pháp răn đe và truy vết ở mức prototype/MVP. | TV-01 (PO) |
| **R-06** | Phụ thuộc quá mức vào Coding Agent sinh code | **Trung bình**| Bắt buộc Peer Review, viết test độc lập và yêu cầu thành viên giải thích mã nguồn. | TV-02 (Tech Lead) |
| **R-07** | Mất kết nối mạng / Gián đoạn dịch vụ đám mây | **Trung bình**| Thiết lập môi trường chạy Docker hoàn chỉnh dưới máy cục bộ (Local). | TV-06 (DevOps) |
| **R-08** | Lỗi tích hợp muộn làm hỏng buổi demo cuối kỳ | **Cao** | Tích hợp liên tục mỗi Sprint; Code Freeze trước 3 ngày; chuẩn bị kịch bản & video backup. | TV-01, TV-06 |

---

### 7. QUY TRÌNH QUẢN LÝ THAY ĐỔI VÀ ĐÓNG DỰ ÁN

1. **Quy tắc Quản lý thay đổi:**
   - Mọi yêu cầu mới phải tạo Change Request gửi Product Owner đánh giá giá trị kinh doanh.
   - Nếu bổ sung PBI mới, bắt buộc phải loại bỏ hoặc hoãn PBI cũ có số Story Points tương đương.
   - Thay đổi liên quan đến Deadline học phần hoặc tiêu chí bàn giao phải được Giảng viên phê duyệt.
2. **Kế hoạch Đóng dự án (Project Closure):**
   - Thực hiện Code Freeze toàn diện và gắn Tag Release cuối kỳ trên Git.
   - Chạy toàn bộ Regression Test và xác nhận môi trường Staging/Docker ổn định.
   - Hoàn thiện bộ tài liệu, slide thuyết trình, kịch bản demo và danh sách giới hạn đã biết.
   - Tổ chức buổi Retrospective tổng kết toàn dự án, đúc kết Lessons Learned và quyết toán kinh phí thực tế.

---

### 8. XÁC NHẬN VÀ PHÊ DUYỆT KẾ HOẠCH

| Vai trò phê duyệt | Họ và tên | Chữ ký / Xác nhận | Ngày phê duyệt |
| :--- | :--- | :--- | :---: |
| **Product Owner / Đại diện nhóm** | | | 12/08/2026 |
| **Scrum Master / Trưởng nhóm** | | | 12/08/2026 |
| **Đại diện Nhóm Phát triển** | | | 12/08/2026 |
| **Giảng viên phụ trách học phần** | **TS. Ngô Huy Biên** | | |
