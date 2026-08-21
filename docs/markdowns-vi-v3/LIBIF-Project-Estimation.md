# ƯỚC TÍNH DỰ ÁN (PROJECT ESTIMATION)

| Thuộc tính | Giá trị |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| Mã dự án | CDLS-2026 |
| Phương pháp phát triển | Scrum |
| Quy mô nhóm | 06 sinh viên, có Coding Agent hỗ trợ |
| Thời gian thực hiện | 10 tuần (05 Sprint × 02 tuần) |
| Phiên bản tài liệu | 3.0 |
| Ngày cập nhật | 21/08/2026 |

---

## 1. Tóm tắt Điều hành

Tài liệu ước tính **kích cỡ, thời gian, công sức và chi phí** cho dự án LIBIF. Nhóm áp dụng Scrum với 05 Sprint, mỗi Sprint 02 tuần, sử dụng Coding Agent hỗ trợ kỹ thuật.

| Chỉ tiêu | Baseline |
| :--- | :--- |
| Quy mô backlog (Size) | **136 Story Points** (117 SP tính năng + 19 SP hỗ trợ) |
| Thời gian (Duration) | **10 tuần = 05 Sprint × 02 tuần** |
| Effort danh nghĩa | **900 giờ-người** (6 SV × 15 giờ/tuần × 10 tuần) |
| Effort tập trung sản phẩm | **765 giờ-người** (sau khi trừ 15% hội họp & gián đoạn) |
| Chi phí tiền mặt | **0 VNĐ** (sử dụng Azure for Students, free-tier AI tools) |
| Phạm vi cam kết | **13 PBI Must Have** (104 SP); 03 PBI Should Have (13 SP) là phạm vi co giãn |
| Biên sai số | **-20% đến +30%** trước khi có velocity thực tế |

> Khối lượng 136 SP là thách thức nhưng khả thi trong 10 tuần nếu nhóm duy trì 15 giờ/người/tuần và kiểm soát phạm vi chặt chẽ. Phương án ứng phó khi chậm là hoãn PBI Should Have, không kéo dài thời gian.

---

## 2. Cơ sở Ước tính

### 2.1 Tài liệu đầu vào

1. `LIBIF-Product-Backlog.md` — 16 PBIs thuộc 05 Epic (13 Must Have, 03 Should Have).
2. `LIBIF-Architecture.md` — Kiến trúc Modular Monolith; React/Next.js, NestJS, PostgreSQL, Redis, MinIO, Tesseract, Docker.
3. `LIBIF-Proof-Of-Concept.md` — PoC Canvas DRM và kế hoạch tích hợp.
4. `LIBIF-Project-Vision-Scope.md` — Phạm vi trong/ngoài dự án.
5. `LIBIF-Project-Charter.md` — Deliverables, tiêu chí thành công, ràng buộc và milestone.
6. `LIBIF-Project-Proposal.md` — Tính khả thi, giả định và rủi ro.

### 2.2 Phạm vi sản phẩm (In-scope)

- Upload tài liệu, tiền xử lý ảnh và Tesseract OCR chạy nền.
- Giao diện đối soát Side-by-side, phê duyệt và biên mục.
- Mã hóa AES-256, phân quyền RBAC và giới hạn phiên đọc đồng thời.
- Tìm kiếm toàn văn và HTML5 Canvas Reader.
- Block Download, Dynamic Watermark, Screenshot Blur và Audit Trail (mức MVP).
- Môi trường staging, Docker Compose, kiểm thử và demo.

### 2.3 Ngoài phạm vi (Out-of-scope)

- Sản phẩm production phục vụ thư viện thật, SLA 24/7.
- Pentest chuyên nghiệp hoặc cam kết DRM tuyệt đối.
- Mobile App, AI tóm tắt/dịch tự động, nhận dạng chữ viết tay.
- Mở rộng đa thư viện và tải người dùng lớn.

---

## 3. Giả định Ước tính

| Mã | Giả định | Giá trị | Tác động nếu sai |
| :--- | :--- | :--- | :--- |
| EST-A01 | Thời lượng dự án | 10 tuần, 05 Sprint × 02 tuần | Phải điều chỉnh phạm vi |
| EST-A02 | Mức tham gia mỗi thành viên | 15 giờ/tuần | Mỗi 10% thiếu ≈ 1 tuần năng lực nhóm |
| EST-A03 | Nghĩa vụ học tập khác | Có kỳ thi và đồ án môn khác | Tuần thi giảm capacity 20-30% |
| EST-A04 | Phạm vi cố định | 16 PBIs + 03 Enablers | Thêm PBI mới phải hoãn PBI tương đương |
| EST-A05 | Tech stack và PoC sẵn có | Tái sử dụng nền tảng hiện tại | Xây lại nền tảng → khó hoàn thành 10 tuần |
| EST-A06 | Coding Agent | Có quyền truy cập toàn bộ 10 tuần | Mất công cụ giảm tốc độ nhưng không dừng dự án |
| EST-A07 | Hiệu quả Coding Agent | Tiết kiệm 15-20% effort ở tác vụ phù hợp | Kiểm chứng sau Sprint 1; không tính lợi ích hai lần |
| EST-A08 | Dữ liệu test | 10-20 tài liệu tiếng Việt quét ≈300 DPI | Thiếu dữ liệu → chậm benchmark OCR |
| EST-A09 | Hạ tầng | Azure for Students (miễn phí) + máy cá nhân | Hết quota → chuyển về Docker local |

---

## 4. Ước tính Kích cỡ (Size Estimation)

Phương pháp: **Planning Poker** với thang Fibonacci. Story Points biểu diễn độ phức tạp, rủi ro và mức bất định tương đối; **không quy đổi trực tiếp 1 SP = X giờ**.

### 4.1 Product Backlog Items

| PBI | Nội dung | Ưu tiên | SP | Lý do chính |
| :--- | :--- | :---: | ---: | :--- |
| PBI-01 | Upload ảnh/PDF và tạo hồ sơ số hóa | Must | 5 | Validation file, lưu tạm và trạng thái |
| PBI-02 | Tiền xử lý ảnh và Tesseract OCR chạy nền | Must | 13 | BullMQ, Tesseract, tọa độ từ, retry |
| PBI-03 | Theo dõi tiến độ hàng chờ OCR | Should | 5 | Realtime progress và xử lý trạng thái lỗi |
| PBI-04 | Giao diện đối soát Side-by-side | Must | 13 | Đồng bộ ảnh-văn bản, bounding box, chỉnh sửa |
| PBI-05 | Phê duyệt/Từ chối tài liệu | Must | 5 | Workflow trạng thái và audit người duyệt |
| PBI-06 | Biên mục tài liệu | Must | 5 | Form, validation và metadata thư viện |
| PBI-07 | Mã hóa AES-256 và lưu kho | Must | 8 | Quản lý khóa, chunk/page và MinIO vault |
| PBI-08 | Chính sách truy cập theo nhóm | Must | 5 | RBAC trên từng tài liệu |
| PBI-09 | Giới hạn phiên đọc đồng thời | Must | 8 | Redis lock, timeout và race condition |
| PBI-10 | Tìm kiếm toàn văn | Must | 8 | `tsvector`, snippet và kiểm thử hiệu năng |
| PBI-11 | HTML5 Canvas Reader | Must | 13 | Streaming, Web Crypto, render |
| PBI-12 | Block Download/Direct Link Protection | Must | 8 | Token ngắn hạn và hardening client |
| PBI-13 | Nhảy trang và highlight từ khóa | Should | 5 | Liên kết tìm kiếm với Canvas Reader |
| PBI-14 | Dynamic Watermark | Must | 5 | Render watermark theo phiên |
| PBI-15 | Screenshot Blur | Should | 3 | Focus/visibility/keyboard trên trình duyệt |
| PBI-16 | Audit Trail | Must | 8 | Event logging và truy vết |
| | **Tổng tính năng** | | **117** | |

### 4.2 Công việc hỗ trợ (Enablers)

| Mã | Nội dung | SP |
| :--- | :--- | ---: |
| EN-01 | Khởi tạo kiến trúc, Auth/RBAC, database, Docker, CI/CD | 8 |
| EN-02 | Kiểm thử tích hợp, hiệu năng, bảo mật cơ bản và sửa lỗi | 8 |
| EN-03 | Báo cáo cuối kỳ, hướng dẫn sử dụng, slide, đóng gói demo | 3 |
| | **Tổng Enablers** | **19** |
| | **Tổng quy mô dự án** | **136 SP** |

Must Have chiếm **104 SP**. Ba PBI Should Have (PBI-03, PBI-13, PBI-15) chiếm **13 SP** là phạm vi co giãn đầu tiên khi velocity thấp hơn kế hoạch.

---

## 5. Ước tính Thời gian (Duration Estimation)

### 5.1 Kế hoạch 05 Sprint

| Sprint | Tuần | Sprint Goal | Phạm vi | SP |
| :--- | :---: | :--- | :--- | ---: |
| Sprint 1 | 1-2 | Dựng nền tảng và luồng OCR cơ bản | EN-01, PBI-01, PBI-02 | 26 |
| Sprint 2 | 3-4 | Hoàn thành nghiệp vụ kiểm duyệt | PBI-03, PBI-04, PBI-05, PBI-06 | 28 |
| Sprint 3 | 5-6 | Xuất bản và kiểm soát truy cập | PBI-07, PBI-08, PBI-09, PBI-16 | 29 |
| Sprint 4 | 7-8 | Tra cứu và đọc sách an toàn | PBI-10, PBI-11, PBI-14, PBI-15 | 29 |
| Sprint 5 | 9-10 | Hoàn thiện, kiểm thử và bàn giao | PBI-12, PBI-13, EN-02, EN-03 | 24 |
| | | **Tổng** | | **136** |

Velocity dự kiến: **~27 SP/Sprint**. Đây là forecast ban đầu, được điều chỉnh theo velocity thực tế sau mỗi Sprint.

### 5.2 Các mốc quan trọng (Milestones)

| Mốc | Thời điểm | Điều kiện hoàn thành |
| :--- | :---: | :--- |
| G1 — Baseline & OCR Pipeline | Cuối tuần 2 | Upload và OCR chạy trên dữ liệu mẫu |
| G2 — Midterm Demo | Cuối tuần 4 | Luồng thủ thư demo được; có velocity 02 Sprint |
| G3 — Secure Publishing | Cuối tuần 6 | Mã hóa, RBAC, giới hạn phiên và audit hoạt động |
| G4 — Feature Complete | Cuối tuần 8 | Must Have chính chạy end-to-end trên staging |
| G5 — Final Submission | Cuối tuần 10 | Code freeze, test report, tài liệu và demo |

### 5.3 Dự phòng tiến độ

- Deadline cố định: **cuối tuần 10**.
- Sprint 5 ưu tiên hardening và bàn giao, hạn chế tính năng mới.
- Nếu velocity trung bình sau Sprint 2 < **24 SP/Sprint** → hoãn PBI-03, PBI-13, PBI-15.
- Tuần thi giảm capacity > 20% → điều chỉnh Sprint Backlog ngay ở refinement gần nhất.

---

## 6. Ước tính Công sức (Effort Estimation)

### 6.1 Năng lực nhóm

| Thành phần | Giờ-người | Tỷ lệ |
| :--- | ---: | ---: |
| Effort danh nghĩa (6 SV × 15h × 10 tuần) | 900 | 100% |
| Scrum events và phối hợp nhóm | 90 | 10% |
| Gián đoạn học tập | 45 | 5% |
| **Effort tập trung cho sản phẩm** | **765** | **85%** |

### 6.2 Phân bổ effort theo nhóm công việc

| Nhóm công việc | Giờ-người | Tỷ lệ |
| :--- | ---: | ---: |
| Nghiệp vụ, backlog, UX và tài liệu quản lý | 90 | 11,8% |
| Kiến trúc, nền tảng và DevOps | 75 | 9,8% |
| Backend, OCR, dữ liệu và tìm kiếm | 195 | 25,5% |
| Frontend Admin/Review/Reader | 180 | 23,5% |
| Bảo mật, DRM và audit | 105 | 13,7% |
| QA, sửa lỗi, báo cáo và demo | 120 | 15,7% |
| **Tổng** | **765** | **100%** |

### 6.3 Cơ cấu nhóm

| Thành viên | Vai trò chính | Trách nhiệm trọng tâm | Capacity |
| :---: | :--- | :--- | ---: |
| TV-01 | Product Owner / BA | Backlog, acceptance criteria, kịch bản nghiệp vụ | 15h/tuần |
| TV-02 | Scrum Master / Tech Lead | Scrum events, kiến trúc, tích hợp | 15h/tuần |
| TV-03 | Backend/OCR Developer | Tesseract, BullMQ, PostgreSQL, Redis, MinIO | 15h/tuần |
| TV-04 | Frontend Developer | Admin Panel, giao diện Side-by-side | 15h/tuần |
| TV-05 | Frontend/Security Dev | Canvas Reader, Web Crypto, watermark | 15h/tuần |
| TV-06 | QA/DevOps Engineer | Test, CI/CD, Docker, staging, báo cáo | 15h/tuần |
| | | **Tổng capacity nhóm** | **90h/tuần** |

---

## 7. Ước tính Chi phí (Cost Estimation)

| Hạng mục | Chi phí (VNĐ) | Ghi chú |
| :--- | ---: | :--- |
| Công sức 06 sinh viên | 0 | 900 giờ-người, quản lý bằng effort |
| Hạ tầng (Hosting, DB, Storage) | 0 | Azure for Students (miễn phí) |
| Coding Agent | 0 | Free tier: Codex, Gemini CLI, v.v. |
| Tên miền | 0 | Sử dụng subdomain miễn phí |
| Dữ liệu test và in ấn | 0 | Tài liệu có sẵn, in nội bộ |
| **Tổng chi phí tiền mặt** | **0 VNĐ** | **Toàn bộ sử dụng tài nguyên miễn phí** |

---

## 8. Rủi ro Ảnh hưởng Ước tính

| Mã | Rủi ro | Xác suất | Tác động | Ứng phó |
| :--- | :--- | :---: | :---: | :--- |
| R-01 | Trùng lịch thi hoặc thành viên vắng | Cao | Cao | Khai báo availability, pairing, cắt Should Have sớm |
| R-02 | Phân công không đều / phụ thuộc cá nhân | TB | Cao | Theo dõi effort/PR, review chéo, chia sẻ kiến thức |
| R-03 | OCR tiếng Việt kém trên ảnh scan xấu | Cao | Cao | Chuẩn 300 DPI, benchmark Sprint 1, giới hạn demo |
| R-04 | Canvas/Web Crypto khác biệt giữa trình duyệt | TB | Cao | Ưu tiên Chrome/Edge, ghi rõ ma trận tương thích |
| R-05 | Kỳ vọng chống chụp màn hình 100% | Cao | Cao | Định vị là cơ chế răn đe, không cam kết chặn camera |
| R-06 | Phụ thuộc quá mức vào Coding Agent | TB | Cao | Review bắt buộc, test và giải thích mã |
| R-07 | Hết quota Azure / free-tier AI tools | TB | TB | Chuyển Docker local, thay thế bằng tool miễn phí khác |
| R-08 | Scope creep | Cao | Cao | Chỉ demo MVP; tính năng mới phải hoán đổi SP tương đương |
| R-09 | Tích hợp muộn, demo cuối kỳ không ổn định | TB | Cao | Tích hợp mỗi Sprint, code freeze trước demo, video dự phòng |

---

## 9. Quy tắc Quản lý Thay đổi

1. Yêu cầu mới vào Product Backlog, không chèn trực tiếp vào Sprint đang chạy.
2. Tăng phạm vi phải hoãn PBI có Story Points tương đương.
3. Product Owner đề xuất ưu tiên; cả nhóm đánh giá effort; Scrum Master ghi nhận.
4. Khi chậm tiến độ: cắt PBI-03, PBI-13, PBI-15 trước; không giảm chất lượng test cốt lõi.
5. Mọi thay đổi baseline ghi trong revision history hoặc biên bản Sprint Review.

---

## 10. Baseline Thống nhất

- **Size:** 136 SP (16 PBIs + 03 Enablers); 13 SP Should Have là phạm vi co giãn.
- **Duration:** 10 tuần = 05 Sprint × 02 tuần.
- **Effort:** 900 giờ-người danh nghĩa → 765 giờ-người tập trung.
- **Cost:** 0 VNĐ (toàn bộ sử dụng tài nguyên miễn phí).
- **Coding Agent:** hỗ trợ xuyên suốt; mọi đầu ra phải được sinh viên hiểu, review và chịu trách nhiệm.
- **Điểm tái ước tính:** cuối Sprint 1 và cuối Sprint 2 dựa trên velocity thực tế.
