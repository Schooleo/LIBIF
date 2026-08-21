# TUYÊN BỐ PHẠM VI CÔNG VIỆC (STATEMENT OF WORK - SOW)
## HỆ THỐNG THƯ VIỆN SỐ & QUẢN LÝ BẢN QUYỀN SỐ (LIBIF / CDLS)

> **Học phần:** Quản lý Dự án Phần mềm – GV. TS. Ngô Huy Biên (2026)  
> **Mã tài liệu:** `LIBIF-Statement-Of-Work` | **Phiên bản:** 1.0 (Thỏa thuận chính thức)  
> **Bên thực hiện:** Nhóm 06 sinh viên | **Bên hướng dẫn & Đánh giá:** Giảng viên phụ trách  
> **Phương pháp phát triển:** Scrum (05 Sprint × 02 tuần) | **Thời gian thực hiện:** 10 tuần học

---

### BẢNG TÓM TẮT THỎA THUẬN PHẠM VI VÀ CAM KẾT HỌC PHẦN

| Thuộc tính | Cam kết chính thức trong SOW |
| :--- | :--- |
| **Tên dự án** | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| **Mục tiêu sản phẩm** | Xây dựng hệ thống MVP Web khép kín: Số hóa OCR $\rightarrow$ Đối soát $\rightarrow$ Biên mục $\rightarrow$ Xuất bản mã hóa $\rightarrow$ Đọc an toàn Canvas DRM |
| **Thời hạn thực hiện** | Đúng 10 tuần học (05 Sprint × 02 tuần), không có thời gian gia hạn mặc định |
| **Tổng nguồn lực cam kết** | 06 sinh viên × 15 giờ/tuần = **900 giờ-người** (765 giờ tập trung sản phẩm) |
| **Quy mô Backlog cam kết** | **136 Story Points** (117 SP tính năng + 19 SP Enablers) |
| **Phân loại phạm vi bàn giao** | **13 Must Have (104 SP) bắt buộc**; **03 Should Have (13 SP) co giãn** |
| **Chi phí tiền mặt dự kiến** | **0 VNĐ** (Toàn bộ sử dụng Azure for Students, AI free-tier và tài nguyên sẵn có) |
| **Chi phí nhân công** | **0 VNĐ** (công sức 06 sinh viên quản lý bằng 900 giờ-người) |

---

### 1. PHẠM VI CÔNG VIỆC (SCOPE OF WORK)

#### 1.1 Tám gói công việc trong phạm vi (In-Scope Work Packages)
| Mã WP | Gói công việc | PBIs / Enablers | Nội dung chi tiết thực hiện |
| :---: | :--- | :--- | :--- |
| **WP-01** | **Quản lý dự án** | Cross-cutting | Lập kế hoạch, vận hành 5 Sprint Scrum, quản lý rủi ro, kiểm soát thay đổi và báo cáo |
| **WP-02** | **Nền tảng & Triển khai** | **EN-01** | Khung kiến trúc Modular Monolith, Auth/RBAC, Database Schema, Docker Compose, CI/CD |
| **WP-03** | **Số hóa và OCR** | **PBI-01, 02, 03** | API Upload ảnh/PDF, xử lý ảnh, hàng đợi BullMQ, Tesseract OCR chạy nền, theo dõi tiến độ |
| **WP-04** | **Kiểm duyệt & Biên mục** | **PBI-04, 05, 06** | Giao diện đối soát Side-by-side (ảnh/text/bounding box), workflow duyệt, form metadata |
| **WP-05** | **Xuất bản & Phân quyền** | **PBI-07, 08, 09** | Mã hóa AES-256 lưu kho MinIO, phân quyền nhóm độc giả, giới hạn phiên đọc đồng thời (Redis) |
| **WP-06** | **Tìm kiếm & Trình đọc** | **PBI-10 đến 13** | Tìm kiếm toàn văn PostgreSQL, Canvas Reader giải mã chunk bằng Web Crypto, bảo vệ link tải |
| **WP-07** | **Bảo vệ & Audit** | **PBI-14, 15, 16** | Dynamic Watermark theo phiên, Screenshot Blur khi mất focus, Audit Trail truy vết chi tiết |
| **WP-08** | **Kiểm thử & Bàn giao** | **EN-02, EN-03** | Bộ test Unit/Integration/E2E, fix bug, tài liệu README, slide thuyết trình và kịch bản demo |

#### 1.2 Danh mục ngoài phạm vi (Out-of-Scope)
- Hệ thống Production 24/7 có cam kết SLA, High Availability (HA) hoặc Disaster Recovery (DR).
- Triển khai thí điểm tại thư viện thực tế hoặc số hóa kho sách quy mô công nghiệp.
- Mua sắm máy quét chuyên dụng (Scanner) hoặc mua bản quyền nội dung thương mại.
- Đánh giá / Chứng nhận an toàn thông tin chuyên nghiệp (Pentest) và cam kết chống sao chép 100% bằng camera ngoài.
- Ứng dụng di động (Mobile App), AI dịch tự động, AI tóm tắt văn bản, nhận dạng chữ viết tay (HTR) / chữ Hán Nôm.
- Dịch vụ bảo hành, bảo trì và hỗ trợ vận hành sau khi kết thúc học phần.

---

### 2. DANH MỤC SẢN PHẨM BÀN GIAO (DELIVERABLES)

| Mã | Tên sản phẩm bàn giao | Nội dung tối thiểu | Định dạng | Hạn nộp |
| :---: | :--- | :--- | :---: | :---: |
| **DEL-01** | **Tài liệu Khởi tạo & Phân tích** | Project Charter, Proposal, Vision & Scope, Product Backlog | Markdown / PDF | Tuần 2 |
| **DEL-02** | **Kiến trúc & PoC** | Tài liệu Architecture, Báo cáo PoC và mã nguồn kiểm chứng kỹ thuật | Markdown & Code | Tuần 2-4 |
| **DEL-03** | **Kế hoạch Quản lý dự án** | Estimation, Project Planning, SOW, Risk/Issue/Change log | Markdown | Tuần 2 & Cập nhật |
| **DEL-04** | **Minh chứng vận hành Scrum** | Sprint Goal, Sprint Backlog, biên bản Review, Retro, Velocity | Issue Board & Docs | Cuối mỗi Sprint |
| **DEL-05** | **Mã nguồn hệ thống MVP** | Toàn bộ mã nguồn Frontend, Backend, DB Migrations, Test | Git Repository | Tuần 10 |
| **DEL-06** | **Gói triển khai & Cài đặt** | Docker Compose, file cấu hình mẫu `.env.example`, README cài đặt | Git Release & Docker | Tuần 10 |
| **DEL-07** | **Bộ kiểm thử & Báo cáo chất lượng**| Bộ Test Cases, Test Scripts, Báo cáo kiểm thử, Defect Log | Source code & Report | Tuần 10 |
| **DEL-08** | **Báo cáo & Trình bày cuối kỳ** | Báo cáo tổng kết, Slide thuyết trình, Kịch bản demo, Lessons Learned | Markdown / Slide / Video | Tuần 10 |

---

### 3. TIÊU CHÍ CHẤP NHẬN VÀ NGHIỆM THU (ACCEPTANCE CRITERIA)

#### 3.1 Tiêu chí chấp nhận sản phẩm (Product Acceptance Criteria)
- **AC-01 (Luồng số hóa):** Upload thành công tài liệu mẫu; Tesseract OCR chạy nền trích xuất được text và tọa độ; giao diện Side-by-side cho phép chỉnh sửa và phê duyệt.
- **AC-02 (Xuất bản & Phân quyền):** Tài liệu đã duyệt được mã hóa AES-256 lưu vào MinIO Vault; áp dụng đúng phân quyền truy cập theo vai trò.
- **AC-03 (Kiểm soát phiên đọc):** Hệ thống chặn được phiên đọc thứ 2 vượt quá hạn mức đồng thời của cùng một tài khoản độc giả qua Redis lock.
- **AC-04 (Tìm kiếm toàn văn):** Tìm kiếm đúng từ khóa trong nội dung sách mẫu và trả về đoạn trích (snippet) trong thời gian dưới 2 giây.
- **AC-05 (Canvas Reader):** Trình đọc giải mã và hiển thị trang sách mượt mà, hỗ trợ zoom, chuyển trang trên trình duyệt Chrome/Edge.
- **AC-06 (Bảo vệ răn đe):** Không để lộ đường dẫn URL file gốc; Dynamic Watermark hiển thị rõ thông tin độc giả/IP; kích hoạt Screenshot Blur khi mất focus.
- **AC-07 (Độ tin cậy):** Không còn lỗi mức Critical hoặc High chưa giải quyết; bộ test Unit/Integration vượt qua 100%.
- **AC-08 (Khả năng cài đặt):** Người đánh giá có thể cài đặt và chạy thành công hệ thống trên máy sạch theo tài liệu README hoặc Docker Compose.

#### 3.2 Tiêu chí chấp nhận quản lý dự án (Project Management Acceptance Criteria)
- **PM-AC-01:** Có đầy đủ bộ tài liệu quản lý dự án chuẩn hóa, nhất quán các chỉ số baseline.
- **PM-AC-02:** Có đầy đủ bằng chứng thực hành 05 Sprint (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective).
- **PM-AC-03:** Lịch sử đóng góp trên Git và bảng phân công công việc thể hiện tính minh bạch của cả 6 thành viên.
- **PM-AC-04:** Sổ theo dõi Rủi ro (Risk Register) và Thay đổi (Change Log) được cập nhật định kỳ.
- **PM-AC-05:** Có dữ liệu tái ước tính và đo lường Velocity thực tế sau Sprint 1 và Sprint 2.
- **PM-AC-06:** Sử dụng Coding Agent tuân thủ tính trung thực học thuật; thành viên giải thích được toàn bộ mã nguồn.

---

### 4. LỊCH THỰC HIỆN, NGUỒN LỰC VÀ NGÂN SÁCH

#### 4.1 Lịch trình 5 Sprint và Mốc kiểm soát
| Sprint / Mốc | Tuần | Phạm vi thực hiện | Kết quả bàn giao chính |
| :--- | :---: | :--- | :--- |
| **Sprint 1 / Mốc G1** | 1-2 | EN-01, PBI-01, PBI-02 (26 SP) | Khởi tạo nền tảng, CI/CD, Pipeline OCR chạy trên dữ liệu mẫu |
| **Sprint 2 / Mốc G2** | 3-4 | PBI-03, 04, 05, 06 (28 SP) | Demo luồng Thủ thư (Đối soát, Duyệt, Biên mục); Báo cáo giữa kỳ |
| **Sprint 3 / Mốc G3** | 5-6 | PBI-07, 08, 09, 16 (29 SP) | Mã hóa AES-256, Phân quyền RBAC, Giới hạn phiên, Audit Trail |
| **Sprint 4 / Mốc G4** | 7-8 | PBI-10, 11, 14, 15 (29 SP) | Tìm kiếm toàn văn, Canvas Reader, Dynamic Watermark, Blur |
| **Sprint 5 / Mốc G5** | 9-10 | PBI-12, 13, EN-02, 03 (24 SP)| Tích hợp, Test toàn diện, Docker hoàn chỉnh, Nộp bài & Demo |

#### 4.2 Ngân sách và Chi phí thực hiện
| STT | Hạng mục chi phí | Hạn mức phân bổ (VNĐ) | Ghi chú & Nguồn lực |
| :---: | :--- | ---: | :--- |
| 1 | **Công sức 06 sinh viên** | **0 VNĐ** | 900 giờ-người phục vụ học tập thực hành |
| 2 | **Hạ tầng (Hosting, DB, MinIO)** | **0 VNĐ** | Azure for Students (miễn phí) |
| 3 | **Coding Agent & AI Tools** | **0 VNĐ** | Free tier: Codex, Gemini CLI, Copilot |
| 4 | **Tên miền & Dịch vụ phụ trợ** | **0 VNĐ** | Sử dụng subdomain miễn phí |
| 5 | **Dữ liệu test & In ấn** | **0 VNĐ** | Dữ liệu mẫu có sẵn, in ấn nội bộ |
| | **TỔNG CHI PHÍ TIỀN MẶT** | **0 VNĐ** | **Tối ưu toàn diện bằng tài nguyên miễn phí** |

---

### 5. TRÁCH NHIỆM CỦA CÁC BÊN VÀ QUY TRÌNH NGHIỆM THU

#### 5.1 Trách nhiệm của Nhóm sinh viên (Bên thực hiện)
- Lập kế hoạch, phát triển mã nguồn, viết tài liệu và kiểm thử theo đúng các cam kết trong SOW.
- Đảm bảo tính trung thực, bảo mật của mã nguồn và không vi phạm bản quyền dữ liệu mẫu.
- Chủ động báo cáo rủi ro và các trở ngại kỹ thuật vượt thẩm quyền cho Giảng viên hướng dẫn.

#### 5.2 Trách nhiệm của Giảng viên phụ trách (Bên hướng dẫn & Đánh giá)
- Cung cấp khung yêu cầu, chuẩn đầu ra và các mốc đánh giá của học phần.
- Đóng góp ý kiến chuyên môn tại các mốc checkpoint giữa kỳ và xem xét các đề xuất thay đổi lớn.
- Tổ chức đánh giá, chấm điểm và nghiệm thu kết quả đồ án dựa trên các tiêu chí đã thống nhất.

#### 5.3 Quy trình Nghiệm thu 6 bước
1. **Developer kiểm tra:** Thành viên tự kiểm tra Acceptance Criteria và viết Unit/Integration Test.
2. **Peer Review:** Ít nhất 01 thành viên khác duyệt Pull Request trên Git.
3. **QA xác nhận:** Chạy kiểm thử độc lập và cập nhật Defect Log.
4. **Product Owner nghiệm thu nội bộ:** Kiểm tra trên môi trường Staging và ký nhận đạt Definition of Done trong Sprint Review.
5. **Đóng gói cuối kỳ:** Chạy Regression Test toàn diện, tạo Release Tag và nộp đủ 8 Deliverables.
6. **Bảo vệ & Nghiệm thu học phần:** Trình bày, demo trực tiếp và trả lời câu hỏi vấn đáp trước Giảng viên.

---