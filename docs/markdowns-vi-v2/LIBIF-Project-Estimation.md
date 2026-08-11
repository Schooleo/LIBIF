# ƯỚC TÍNH DỰ ÁN (PROJECT ESTIMATION)

| Thuộc tính | Giá trị |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| Bối cảnh | Đồ án nhóm trong học phần Quản lý Dự án Phần mềm |
| Tên tài liệu | `docs/markdowns-vi-v2/LIBIF-Project-Estimation.md` |
| Mã dự án | CDLS-2026 |
| Phương pháp phát triển | Scrum |
| Quy mô nhóm | 06 sinh viên, có Coding Agent hỗ trợ xuyên suốt |
| Thời gian thực hiện | 10 tuần học |
| Phiên bản tài liệu | 2.0 |
| Ngày cập nhật | 11/08/2026 |
| Trạng thái | Baseline đề xuất cho nhóm và giảng viên phụ trách |

---

## 1. Tóm tắt Điều hành

Tài liệu này ước tính thời gian, công sức và chi phí cho **đồ án LIBIF của nhóm 06 sinh viên** trong học phần Quản lý Dự án Phần mềm. Nhóm áp dụng Scrum với **05 Sprint, mỗi Sprint 02 tuần**, đồng thời sử dụng Coding Agent để hỗ trợ lập trình, kiểm thử và hoàn thiện tài liệu.

| Chỉ tiêu | Baseline đề xuất |
| :--- | :--- |
| Thời gian học phần dành cho dự án | **10 tuần (05 Sprint)** |
| Quy mô nhóm | **06 sinh viên** |
| Mức tham gia giả định | **15 giờ/sinh viên/tuần** |
| Tổng effort danh nghĩa | **900 giờ-người** |
| Effort tập trung cho sản phẩm | **765 giờ-người** sau thời gian họp và gián đoạn |
| Quy mô backlog | **136 Story Points**, gồm 117 SP tính năng và 19 SP công việc hỗ trợ |
| Chi phí tiền mặt dự kiến | **8.800.000 VNĐ**, đã gồm dự phòng 10% |
| Chi phí nhân công phải trả | **0 VNĐ**; công sức sinh viên được quản lý bằng giờ-người |
| Phạm vi ưu tiên | **13 PBI Must Have**; 03 PBI Should Have là phạm vi co giãn |

> **Kết luận:** Khối lượng 136 SP là thách thức nhưng có thể thực hiện trong 10 tuần nếu nhóm tận dụng nền tảng và PoC sẵn có, duy trì đều 15 giờ/người/tuần và kiểm soát phạm vi chặt chẽ. Vì thời hạn học phần thường cố định, phương án ứng phó khi chậm là hoãn PBI Should Have, không kéo dài dự án tùy ý.

Đây là ước tính sơ bộ cấp dự án với biên sai số khoảng **-20% đến +30%** trước khi có velocity thực tế. Nhóm phải cập nhật lại forecast sau Sprint 1 và Sprint 2.

---

## 2. Cơ sở và Phạm vi Ước tính

### 2.1 Tài liệu đầu vào đã rà soát

Ước tính được xây dựng từ các tài liệu hiện có trong `docs/markdowns-vi-v2/`:

1. `LIBIF-Product-Backlog.md`: 16 PBIs thuộc 05 Epic, gồm 13 Must Have và 03 Should Have.
2. `LIBIF-Architecture.md`: kiến trúc Modular Monolith; công nghệ React/Next.js, NestJS, PostgreSQL, Redis, MinIO, Tesseract và Docker; bối cảnh nhóm 06 sinh viên và tiến độ 10 tuần.
3. `LIBIF-Proof-Of-Concept.md`: PoC Canvas DRM và kế hoạch tích hợp vào sản phẩm.
4. `LIBIF-Project-Vision-Scope.md`: phạm vi trong/ngoài dự án và 08 tính năng cấp cao.
5. `LIBIF-Project-Charter.md`: deliverables, tiêu chí thành công, vai trò, ràng buộc và milestone.
6. `LIBIF-Project-Proposal.md`: tính khả thi, lợi ích, giả định và rủi ro.

### 2.2 Phạm vi sản phẩm mẫu của học phần

- Upload tài liệu, tiền xử lý ảnh và Tesseract OCR chạy nền.
- Giao diện đối soát Side-by-side, phê duyệt và biên mục cơ bản.
- Mã hóa AES-256, phân quyền và giới hạn phiên đọc đồng thời.
- Tìm kiếm toàn văn và HTML5 Canvas Reader.
- Block Download, Dynamic Watermark, Screenshot Blur và Audit Trail ở mức prototype/MVP.
- Môi trường staging, Docker Compose, kiểm thử, demo và tài liệu học phần.

### 2.3 Sản phẩm bàn giao học phần

1. Bộ tài liệu quản lý dự án: Charter, Proposal, Vision & Scope, Product Backlog, Architecture, PoC và Project Estimation.
2. Product Backlog và bằng chứng vận hành Scrum: Sprint Backlog, biên bản Review/Retrospective, biểu đồ tiến độ hoặc báo cáo velocity.
3. Mã nguồn có quản lý phiên bản và hướng dẫn cài đặt.
4. Bản triển khai staging hoặc gói Docker chạy được trên máy giảng viên.
5. Bộ test case, kết quả kiểm thử và danh sách giới hạn đã biết.
6. Báo cáo tổng kết, slide và kịch bản demo cuối kỳ.

### 2.4 Ngoài phạm vi

- Sản phẩm production phục vụ thư viện thật, SLA 24/7 và hỗ trợ sau triển khai.
- Mua máy quét, số hóa hàng loạt kho sách và hiệu chỉnh nội dung thực tế.
- Pentest/chứng nhận bảo mật chuyên nghiệp hoặc cam kết DRM tuyệt đối.
- Mua bản quyền nội dung và tư vấn pháp lý chuyên sâu.
- Mobile App, AI tóm tắt, dịch tự động và nhận dạng chữ viết tay/Hán Nôm.
- Mở rộng cho nhiều thư viện, tải người dùng lớn và đóng gói thương mại hoàn chỉnh.

### 2.5 Quan hệ với lộ trình 7 tháng trong Project Charter

Mốc 7 tháng trong Project Charter thể hiện vòng đời của một sản phẩm thương mại đầy đủ. Đối với học phần, nhóm chỉ thực hiện **MVP/prototype trong 10 tuần**, tập trung chứng minh quy trình nghiệp vụ, kiến trúc, kỹ năng quản lý dự án và khả năng tích hợp kỹ thuật. Các hoạt động pilot thực tế, pháp lý, hardening production và thương mại hóa được xem là roadmap sau học phần.

---

## 3. Giả định Ước tính

| Mã | Giả định | Giá trị dùng để tính | Tác động nếu sai |
| :--- | :--- | :--- | :--- |
| EST-A01 | Thời lượng học phần | 10 tuần, 05 Sprint, mỗi Sprint 02 tuần | Không có nhiều khả năng gia hạn; phải điều chỉnh phạm vi. |
| EST-A02 | Mức tham gia của mỗi sinh viên | 15 giờ/tuần | Thiếu 10% availability tương đương khoảng 01 tuần năng lực của nhóm. |
| EST-A03 | Nghĩa vụ học tập khác | Các thành viên vẫn học môn khác và có kỳ kiểm tra | Tuần thi/đồ án môn khác có thể làm giảm capacity 20-30%. |
| EST-A04 | Phạm vi | 16 PBIs và 03 enablers | PBI mới chỉ được thêm khi loại hoặc hoãn phạm vi tương đương. |
| EST-A05 | Nền tảng kỹ thuật | Tech stack và PoC hiện có được tái sử dụng | Nếu phải xây lại nền tảng, Must Have khó hoàn thành trong 10 tuần. |
| EST-A06 | Coding Agent | Có quyền truy cập trong toàn bộ 10 tuần | Mất công cụ làm giảm tốc độ tạo mã, test và tài liệu nhưng không làm dự án dừng. |
| EST-A07 | Hiệu quả Coding Agent | Tiết kiệm 15-20% effort ở tác vụ phù hợp | Phải kiểm chứng bằng dữ liệu sau Sprint 1; không tính lợi ích hai lần. |
| EST-A08 | Dữ liệu test | Có 10-20 tài liệu tiếng Việt quét khoảng 300 DPI | Thiếu dữ liệu mẫu làm chậm benchmark OCR và demo. |
| EST-A09 | Người nghiệm thu nghiệp vụ | Product Owner đóng vai người dùng đại diện; ưu tiên có thủ thư góp ý | Nếu không có người dùng thật, kết quả chỉ được xem là kiểm thử mô phỏng. |
| EST-A10 | Hạ tầng | Có máy cá nhân và một môi trường staging dùng chung | Thiếu tài nguyên OCR/lưu trữ làm giảm chất lượng demo. |

### 3.1 Nguyên tắc sử dụng Coding Agent trong học phần

Coding Agent có thể hỗ trợ tạo khung mã, gợi ý giải pháp, viết unit test, phân tích lỗi, refactor, review bước đầu và đồng bộ tài liệu. Tuy nhiên:

- Mỗi thay đổi do Agent hỗ trợ phải có thành viên chịu trách nhiệm, hiểu và review.
- Không đưa mật khẩu, khóa API, dữ liệu cá nhân hoặc tài liệu có bản quyền lên prompt.
- Mã sinh ra phải qua test và peer review như mã do thành viên tự viết.
- Nhóm phải tuân thủ quy định của giảng viên về sử dụng AI và công bố mức độ hỗ trợ nếu được yêu cầu.
- Coding Agent không thay thế quyết định kiến trúc, đánh giá nghiệp vụ, Sprint Review hoặc phần trình bày của sinh viên.

Baseline 10 tuần đã tính lợi ích năng suất từ Coding Agent. Nếu công cụ hoạt động kém hơn dự kiến, nhóm giảm Should Have trước khi đề nghị thay đổi deadline.

---

## 4. Ước tính Quy mô Product Backlog

Story Points dùng dãy Fibonacci để biểu diễn độ phức tạp, rủi ro và mức chưa chắc chắn tương đối; **không quy đổi trực tiếp một Story Point thành số giờ**.

| PBI | Nội dung rút gọn | Ưu tiên | Story Points | Lý do chính |
| :--- | :--- | :---: | ---: | :--- |
| PBI-01 | Upload ảnh/PDF và tạo hồ sơ số hóa | Must | 5 | Validation file, lưu tạm và trạng thái hồ sơ. |
| PBI-02 | Tiền xử lý ảnh và Tesseract OCR chạy nền | Must | 13 | BullMQ, Tesseract, tọa độ từ, retry và dữ liệu lớn. |
| PBI-03 | Theo dõi tiến độ hàng chờ OCR | Should | 5 | Realtime/progress và xử lý trạng thái lỗi. |
| PBI-04 | Giao diện đối soát Side-by-side | Must | 13 | Đồng bộ ảnh-văn bản, bounding box và chỉnh sửa. |
| PBI-05 | Phê duyệt/Từ chối tài liệu | Must | 5 | Workflow trạng thái và audit người duyệt. |
| PBI-06 | Biên mục tài liệu | Must | 5 | Form, validation và metadata thư viện cơ bản. |
| PBI-07 | Mã hóa AES-256 và lưu kho | Must | 8 | Quản lý khóa, chunk/page và MinIO vault. |
| PBI-08 | Chính sách truy cập theo nhóm | Must | 5 | RBAC và chính sách trên từng tài liệu. |
| PBI-09 | Giới hạn phiên đọc đồng thời | Must | 8 | Redis lock, timeout và race condition. |
| PBI-10 | Tìm kiếm toàn văn | Must | 8 | `tsvector`, snippet và kiểm thử hiệu năng. |
| PBI-11 | HTML5 Canvas Reader | Must | 13 | Streaming, Web Crypto, render và trải nghiệm đọc. |
| PBI-12 | Block Download/Direct Link Protection | Must | 8 | Token ngắn hạn và hardening client ở mức prototype. |
| PBI-13 | Nhảy trang và highlight từ khóa | Should | 5 | Liên kết kết quả tìm kiếm với Canvas Reader. |
| PBI-14 | Dynamic Watermark | Must | 5 | Render watermark và định danh theo phiên. |
| PBI-15 | Screenshot Blur | Should | 3 | Focus/visibility/keyboard trên trình duyệt. |
| PBI-16 | Audit Trail | Must | 8 | Event logging, truy vết và truy vấn log. |
|  | **Tổng tính năng** |  | **117** |  |

### Công việc hỗ trợ học phần

| Mã | Nội dung | Story Points |
| :--- | :--- | ---: |
| EN-01 | Khởi tạo kiến trúc, Auth/RBAC nền, database, Docker và CI/CD | 8 |
| EN-02 | Kiểm thử tích hợp, hiệu năng, bảo mật cơ bản và sửa lỗi | 8 |
| EN-03 | Báo cáo cuối kỳ, hướng dẫn sử dụng, slide và đóng gói demo | 3 |
|  | **Tổng enablers** | **19** |
|  | **Tổng quy mô ước tính** | **136 SP** |

Phần Must Have chiếm **104 SP tính năng**. PBI-03, PBI-13 và PBI-15 chiếm **13 SP** và là phạm vi co giãn đầu tiên nếu velocity thấp hơn kế hoạch. Nếu vẫn thiếu capacity, nhóm đơn giản hóa tiêu chí phi chức năng hoặc dữ liệu demo nhưng phải ghi rõ giới hạn; không báo cáo một tính năng chưa đạt Definition of Done là đã hoàn thành.

---

## 5. Ước tính Thời gian và Kế hoạch Sprint

### 5.1 Lịch phát triển trong 10 tuần học

| Sprint | Tuần | Sprint Goal | Phạm vi dự kiến | SP | Bằng chứng đánh giá |
| :--- | :---: | :--- | :--- | ---: | :--- |
| Sprint 1 | 1-2 | Dựng nền tảng và luồng OCR cơ bản | EN-01, PBI-01, PBI-02 | 26 | Repository, CI, upload và kết quả OCR mẫu. |
| Sprint 2 | 3-4 | Hoàn thành nghiệp vụ kiểm duyệt | PBI-03, PBI-04, PBI-05, PBI-06 | 28 | Demo đối soát, phê duyệt, biên mục và Sprint Review. |
| Sprint 3 | 5-6 | Xuất bản và kiểm soát truy cập | PBI-07, PBI-08, PBI-09, PBI-16 | 29 | Mã hóa, RBAC, giới hạn phiên, audit và test tích hợp. |
| Sprint 4 | 7-8 | Tra cứu và đọc sách an toàn | PBI-10, PBI-11, PBI-14, PBI-15 | 29 | Search, Canvas Reader, watermark, blur trên staging. |
| Sprint 5 | 9-10 | Hoàn thiện, kiểm thử và báo cáo cuối kỳ | PBI-12, PBI-13, EN-02, EN-03 | 24 | Test report, mã nguồn, Docker, báo cáo, slide và demo. |
|  |  | **Tổng** |  | **136** |  |

Đây là forecast ban đầu. Product Owner và nhóm được quyền điều chỉnh thứ tự trong Sprint Planning nhưng phải duy trì Sprint Goal và các phụ thuộc kỹ thuật. So với kế hoạch PoC, PBI-11 được chuyển sang Sprint 4 và PBI-12 sang Sprint 5 để hoàn thành mã hóa và phân quyền trước.

### 5.2 Các mốc học phần

| Mốc | Thời điểm | Điều kiện hoàn thành |
| :--- | :---: | :--- |
| G1 - Baseline & OCR Pipeline | Cuối tuần 2 | Backlog/kiến trúc được thống nhất; upload và OCR chạy trên dữ liệu mẫu. |
| G2 - Midterm Functional Demo | Cuối tuần 4 | Luồng thủ thư có thể demo; có velocity và retrospective của 02 Sprint. |
| G3 - Secure Publishing Demo | Cuối tuần 6 | Mã hóa, RBAC, concurrent limit và audit có kiểm thử. |
| G4 - Feature Complete | Cuối tuần 8 | Các Must Have chính chạy end-to-end trên staging. |
| G5 - Final Submission | Cuối tuần 10 | Code freeze, test report, tài liệu, slide và demo cuối kỳ hoàn tất. |

### 5.3 Dự phòng tiến độ trong học kỳ

- Deadline mục tiêu và deadline tối đa đều là **cuối tuần 10**.
- Sprint 5 ưu tiên hardening và bàn giao, hạn chế bắt đầu tính năng lớn mới.
- Nếu velocity trung bình sau Sprint 2 dưới **24 SP/Sprint**, chuyển PBI-03, PBI-13 và PBI-15 sang mục “chưa thực hiện”.
- Nếu tuần thi làm capacity giảm trên 20%, nhóm phải điều chỉnh Sprint Backlog ngay ở refinement gần nhất.
- Chỉ đề nghị gia hạn khi giảng viên cho phép; gia hạn không được xem là dự phòng mặc định.

---

## 6. Ước tính Nguồn lực

### 6.1 Cơ cấu nhóm 06 sinh viên

Vai trò dưới đây là trọng tâm trách nhiệm. Các thành viên vẫn cùng chịu trách nhiệm với Sprint Goal và hỗ trợ chéo khi cần.

| Thành viên | Vai trò chính | Vai trò kiêm nhiệm | Trách nhiệm trọng tâm | Capacity |
| :---: | :--- | :--- | :--- | ---: |
| TV-01 | Product Owner / Business Analyst | UX, Demo Coordinator | Product Goal, backlog, acceptance criteria, kịch bản nghiệp vụ | 15 giờ/tuần |
| TV-02 | Scrum Master / Technical Lead | Backend Developer | Scrum events, kiến trúc, tích hợp và impediment | 15 giờ/tuần |
| TV-03 | Backend/OCR Developer | Data Engineer | Tesseract, BullMQ, PostgreSQL, Redis và MinIO | 15 giờ/tuần |
| TV-04 | Frontend Developer | UI/UX | Admin Panel và giao diện Side-by-side | 15 giờ/tuần |
| TV-05 | Frontend/Security Developer | Backend Support | Canvas Reader, Web Crypto, watermark và hardening | 15 giờ/tuần |
| TV-06 | QA/DevOps Engineer | Documentation Coordinator | Test, CI/CD, Docker, staging và tổng hợp báo cáo | 15 giờ/tuần |
|  |  |  | **Tổng capacity nhóm** | **90 giờ/tuần** |

Product Owner và Scrum Master là vai trò do thành viên nhóm đảm nhiệm để thực hành Scrum; giảng viên không thay thế hai vai trò này.

### 6.2 Năng lực giờ-người

| Thành phần | Công thức | Giờ-người | Tỷ lệ |
| :--- | :--- | ---: | ---: |
| Effort danh nghĩa | 6 người × 15 giờ × 10 tuần | 900 | 100% |
| Scrum events và phối hợp nhóm | Planning, Daily Scrum, Review, Retro, refinement | 90 | 10% |
| Gián đoạn học tập và hỗ trợ chéo | Lịch học, kiểm tra, lỗi môi trường và việc phát sinh nhỏ | 45 | 5% |
| **Effort tập trung cho sản phẩm** | 900 - 90 - 45 | **765** | **85%** |

Phân bổ 765 giờ tập trung theo nhóm công việc:

| Nhóm công việc | Giờ-người | Tỷ lệ |
| :--- | ---: | ---: |
| Nghiệp vụ, backlog, UX và tài liệu quản lý | 90 | 11,8% |
| Kiến trúc, nền tảng và DevOps | 75 | 9,8% |
| Backend, OCR, dữ liệu và tìm kiếm | 195 | 25,5% |
| Frontend Admin/Review/Reader | 180 | 23,5% |
| Bảo mật, DRM và audit | 105 | 13,7% |
| QA, sửa lỗi, báo cáo và demo | 120 | 15,7% |
| **Tổng** | **765** | **100%** |

### 6.3 Nguồn lực hỗ trợ ngoài nhóm

| Nguồn lực | Vai trò | Mức tham gia đề xuất |
| :--- | :--- | :--- |
| Giảng viên phụ trách | Cố vấn, phản hồi và đánh giá kết quả học phần | Checkpoint giữa kỳ và cuối kỳ; tư vấn khi có blocker học thuật |
| Thủ thư/người dùng đại diện | Góp ý nghiệp vụ và trải nghiệm | 01-02 buổi review; nếu không có, Product Owner làm proxy |
| Bộ dữ liệu mẫu | Dùng benchmark OCR và demo | 10-20 tài liệu có quyền sử dụng, chuẩn khoảng 300 DPI |
| Hạ tầng staging | Môi trường demo dùng chung | 01 VPS hoặc máy chủ/lớp miễn phí phù hợp |
| Coding Agent | Hỗ trợ kỹ thuật và tài liệu | Có sẵn cho các thành viên trong 10 tuần |

---

## 7. Ước tính Chi phí

### 7.1 Nguyên tắc tính cho đồ án sinh viên

- Công sức của 06 sinh viên được ghi nhận bằng **900 giờ-người**, không quy đổi thành lương phải trả.
- Chỉ lập ngân sách cho khoản tiền nhóm hoặc nhà trường thực sự có thể phải chi.
- Ưu tiên công nghệ mã nguồn mở, tài nguyên giáo dục, free tier và hạ tầng sẵn có.
- Các con số về Coding Agent và hạ tầng là **hạn mức lập kế hoạch**, cần thay bằng mức thực trả trước khi mua.

### 7.2 Ngân sách tiền mặt cơ sở

| Hạng mục | Cơ sở tính | Thành tiền (VNĐ) |
| :--- | :--- | ---: |
| Công sức 06 sinh viên | 900 giờ-người, không trả lương trong học phần | 0 |
| Coding Agent | Hạn mức sử dụng cho nhóm trong 10 tuần | 3.000.000 |
| VPS staging | Theo mức trần đã nêu trong tài liệu kiến trúc | 4.000.000 |
| Domain, backup và dịch vụ phụ trợ | Hạn mức cho giai đoạn đồ án | 600.000 |
| Dữ liệu test, in ấn và vật tư thuyết trình | Hạn mức | 400.000 |
| **Tạm tính** |  | **8.000.000** |
| Dự phòng rủi ro | 10% × 8.000.000 | 800.000 |
| **Tổng ngân sách dự kiến** |  | **8.800.000** |

Nếu chia đều, mức đóng góp tối đa tham khảo là khoảng **1.467.000 VNĐ/sinh viên**. Tuy nhiên, nhóm chỉ thu chi theo hóa đơn thực tế và phải thống nhất trước khi mua dịch vụ.

### 7.3 Các kịch bản chi phí

| Kịch bản | Điều kiện | Tổng sau dự phòng 10% |
| :--- | :--- | ---: |
| Tối thiểu | Coding Agent và máy chủ đã được cung cấp; chỉ cần vật tư/test | **440.000 VNĐ** |
| Tiết kiệm | Coding Agent có sẵn, dùng VPS/free tier hoặc máy nhóm | **1.100.000 VNĐ** |
| Baseline | Mua hạn mức Coding Agent và VPS theo kế hoạch | **8.800.000 VNĐ** |
| Trần kiểm soát | Phát sinh thêm quota compute/storage nhưng không đổi phạm vi | **10.000.000 VNĐ** |

Không đưa pentest thương mại, tư vấn pháp lý, scanner, production hosting hoặc chi phí vận hành sau học phần vào ngân sách. Bất kỳ khoản chi nào làm tổng dự báo vượt **10.000.000 VNĐ** phải được cả nhóm và giảng viên phụ trách xem xét trước.

---

## 8. Cơ chế Kiểm soát Theo Scrum

### 8.1 Scrum events phù hợp lịch sinh viên

| Sự kiện | Timebox đề xuất | Kết quả cần lưu |
| :--- | :--- | :--- |
| Sprint Planning | 02 giờ đầu Sprint | Sprint Goal, Sprint Backlog và capacity từng thành viên |
| Daily Scrum | 15 phút vào ngày nhóm làm việc; cập nhật async khi trùng lịch học | Tiến độ, kế hoạch tiếp theo và impediment |
| Backlog Refinement | 01 giờ/tuần | PBI sẵn sàng cho Sprint kế tiếp |
| Sprint Review | 01 giờ cuối Sprint | Increment demo được và feedback ghi nhận |
| Sprint Retrospective | 45 phút cuối Sprint | 01-03 hành động cải tiến có người phụ trách |

### 8.2 Definition of Ready

Một PBI chỉ được đưa vào Sprint khi:

- Có User Story, giá trị nghiệp vụ và acceptance criteria rõ ràng.
- Đã xác định phụ thuộc, dữ liệu test và thiết kế/UI cần thiết.
- Cả nhóm thống nhất Story Points.
- Không còn câu hỏi có thể làm thay đổi đáng kể giải pháp.

### 8.3 Definition of Done

Một PBI chỉ được tính hoàn thành khi:

- Mã nguồn được ít nhất 01 thành viên khác review; mã do Coding Agent hỗ trợ không được tự động chấp nhận.
- Unit/integration test liên quan chạy thành công và không còn lỗi Critical mở.
- Acceptance criteria được kiểm tra trên staging hoặc môi trường demo thống nhất.
- Có xử lý lỗi, logging và tài liệu cần thiết.
- Product Owner chấp nhận trong Sprint Review.
- Thành viên phụ trách có thể giải thích thiết kế và mã nguồn khi giảng viên hỏi.

### 8.4 Chỉ số theo dõi

Mỗi Sprint, nhóm cập nhật:

- Velocity hoàn thành và Sprint Goal Success Rate.
- Burn-down/Burn-up hoặc trạng thái backlog tương đương.
- Effort thực tế của từng thành viên so với capacity.
- Số lỗi Critical/High còn mở và tỷ lệ test thành công.
- Pull request, review và mức độ đóng góp của từng thành viên.
- Công việc có Coding Agent hỗ trợ và thời gian phải sửa lại.
- Hành động cải tiến từ Retrospective.

Baseline phải được xem xét lại khi velocity sau 02 Sprint dưới 24 SP/Sprint, một thành viên thiếu trên 20% capacity, phạm vi tăng trên 10%, hoặc chi phí dự báo vượt 10.000.000 VNĐ.

---

## 9. Rủi ro Ảnh hưởng đến Ước tính

| Mã | Rủi ro | Xác suất | Tác động | Ứng phó |
| :--- | :--- | :---: | :---: | :--- |
| R-01 | Trùng lịch thi, môn học khác hoặc thành viên vắng | Cao | Cao | Khai báo availability ở Sprint Planning, pairing và cắt Should Have sớm. |
| R-02 | Phân công không đều hoặc phụ thuộc một thành viên | Trung bình | Cao | Theo dõi effort/PR, review chéo và chia sẻ kiến thức hằng tuần. |
| R-03 | OCR tiếng Việt kém trên ảnh scan xấu | Cao | Cao | Chốt chuẩn 300 DPI, benchmark Sprint 1 và giới hạn dữ liệu demo. |
| R-04 | Canvas/Web Crypto khác nhau giữa trình duyệt | Trung bình | Cao | Ưu tiên Chrome/Edge cho MVP, ghi rõ ma trận tương thích. |
| R-05 | Kỳ vọng chống chụp màn hình 100% | Cao | Cao | Trình bày là cơ chế răn đe/truy vết, không cam kết chặn camera ngoài. |
| R-06 | Phụ thuộc quá mức vào Coding Agent | Trung bình | Cao | Peer review, test bắt buộc và yêu cầu thành viên giải thích mã. |
| R-07 | Vi phạm quy định học thuật khi dùng AI | Thấp-Trung bình | Cao | Tuân thủ hướng dẫn môn học và công bố cách sử dụng khi được yêu cầu. |
| R-08 | Mất quota, lỗi mạng hoặc dịch vụ Agent/VPS | Trung bình | Trung bình | Giữ khả năng làm việc local, commit thường xuyên và có phương án free tier. |
| R-09 | Scope creep do định hướng sản phẩm thương mại | Cao | Cao | Chỉ demo MVP; chuyển production, pháp lý và thương mại hóa sang roadmap. |
| R-10 | Tích hợp muộn, demo cuối kỳ không ổn định | Trung bình | Cao | Tích hợp mỗi Sprint, code freeze trước demo và chuẩn bị video dự phòng. |

---

## 10. Quy tắc Quản lý Thay đổi

1. Yêu cầu mới được đưa vào Product Backlog, không chèn trực tiếp vào Sprint đang chạy trừ khi Sprint Goal không còn giá trị.
2. Tăng phạm vi phải đi kèm việc loại hoặc hoãn PBI có Story Points tương đương.
3. Product Owner đề xuất ưu tiên; cả nhóm đánh giá effort; Scrum Master ghi nhận thay đổi và ảnh hưởng.
4. Thay đổi deadline, mục tiêu học phần hoặc sản phẩm bàn giao phải được giảng viên phụ trách đồng ý.
5. Khi chậm tiến độ, cắt PBI-03, PBI-13 và PBI-15 trước; không giảm chất lượng tài liệu, test cốt lõi hoặc tính trung thực của báo cáo.
6. Mọi thay đổi baseline phải được ghi trong revision history hoặc biên bản Sprint Review.

---

## 11. Baseline Đề nghị Thống nhất

- **Phạm vi:** 16 PBIs và 03 enablers, tổng 136 SP; 13 SP Should Have là phạm vi co giãn.
- **Thời gian:** 10 tuần, gồm 05 Sprint × 02 tuần; không mặc định có thời gian gia hạn.
- **Nguồn lực:** 06 sinh viên × 15 giờ/tuần × 10 tuần = 900 giờ-người.
- **Effort tập trung:** 765 giờ-người sau Scrum events và gián đoạn.
- **Chi phí:** 8.800.000 VNĐ tiền mặt ở kịch bản baseline; trần kiểm soát 10.000.000 VNĐ.
- **Coding Agent:** hỗ trợ xuyên suốt nhưng mọi đầu ra phải được sinh viên hiểu, review, kiểm thử và chịu trách nhiệm.
- **Điểm tái ước tính:** cuối Sprint 1 và cuối Sprint 2 dựa trên velocity và availability thực tế.
- **Thẩm quyền:** nhóm quản lý Sprint Backlog; giảng viên phụ trách phê duyệt thay đổi deadline hoặc yêu cầu học phần.

---

> **Xác nhận:** `LIBIF-Project-Estimation.md` là baseline phục vụ lập kế hoạch, theo dõi tiến độ, quản lý effort, chi phí và minh chứng thực hành Scrum của nhóm trong học phần Quản lý Dự án Phần mềm.
