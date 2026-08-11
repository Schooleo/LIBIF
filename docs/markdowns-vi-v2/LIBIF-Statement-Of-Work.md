# TUYÊN BỐ PHẠM VI CÔNG VIỆC (STATEMENT OF WORK)

| Thuộc tính | Giá trị |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| Bối cảnh | Đồ án nhóm trong học phần Quản lý Dự án Phần mềm |
| Tên tài liệu | `docs/markdowns-vi-v2/LIBIF-Statement-Of-Work.md` |
| Mã dự án | CDLS-2026 |
| Bên thực hiện | Nhóm dự án gồm 06 sinh viên |
| Bên hướng dẫn/đánh giá | Giảng viên phụ trách học phần |
| Phương pháp phát triển | Scrum, 05 Sprint × 02 tuần |
| Thời gian thực hiện | 10 tuần học |
| Baseline tham chiếu | `LIBIF-Project-Estimation.md`, phiên bản 2.0 |
| Phiên bản tài liệu | 1.0 |
| Ngày lập | 12/08/2026 |
| Trạng thái | Đề xuất thống nhất phạm vi công việc học phần |

---

## 1. Mục đích và Tính chất Tài liệu

Statement of Work (SOW) này xác định công việc nhóm sinh viên cam kết thực hiện, sản phẩm bàn giao, tiêu chí chấp nhận, thời gian, nguồn lực, chi phí và giới hạn của đồ án LIBIF.

Đây là **thỏa thuận phạm vi phục vụ quản lý và đánh giá học phần**, không phải hợp đồng thương mại, cam kết cung cấp dịch vụ production hoặc chứng nhận an toàn thông tin. Các thuật ngữ “bàn giao”, “nghiệm thu” và “chi phí” trong tài liệu được hiểu trong bối cảnh đồ án sinh viên.

---

## 2. Bối cảnh và Bài toán

Các thư viện cần chuyển tài liệu quét thành nội dung có thể tra cứu và đọc trực tuyến, đồng thời hạn chế việc phát tán file gốc. LIBIF xây dựng một MVP/prototype mô phỏng quy trình khép kín:

`Upload tài liệu → OCR → Đối soát → Biên mục → Mã hóa/Xuất bản → Tìm kiếm → Đọc an toàn → Audit`

Nhóm sử dụng kiến trúc Modular Monolith và các công nghệ React/Next.js, NestJS, PostgreSQL, Redis, MinIO, Tesseract OCR và Docker. Coding Agent hỗ trợ trong toàn bộ quá trình nhưng không thay thế trách nhiệm chuyên môn và học thuật của sinh viên.

---

## 3. Mục tiêu Công việc

### 3.1 Mục tiêu sản phẩm

- Xây dựng MVP Web cho phép thủ thư mô phỏng số hóa, kiểm duyệt và xuất bản tài liệu.
- Cho phép độc giả tìm kiếm toàn văn và đọc tài liệu qua Canvas Reader.
- Minh họa các lớp bảo vệ gồm mã hóa, phân quyền, giới hạn phiên, watermark và audit.
- Đóng gói hệ thống đủ để cài đặt, kiểm thử và demo trong môi trường học phần.

### 3.2 Mục tiêu học tập

- Thực hành lập kế hoạch và kiểm soát phạm vi, tiến độ, effort, chi phí, chất lượng và rủi ro.
- Vận hành Scrum qua 05 Sprint và lưu bằng chứng cho từng Sprint.
- Thực hành phân công nhóm đa chức năng, quản lý thay đổi và báo cáo stakeholder.
- Sử dụng Coding Agent có trách nhiệm, minh bạch và có kiểm chứng.

---

## 4. Phạm vi Công việc

### 4.1 Gói công việc trong phạm vi

| WP | Gói công việc | PBIs/Enabler | Nội dung |
| :--- | :--- | :--- | :--- |
| WP-01 | Quản lý dự án | Cross-cutting | Backlog, Sprint Planning, Review, Retrospective, risk, issue, change và báo cáo. |
| WP-02 | Nền tảng và triển khai | EN-01 | Auth/RBAC nền, database, Docker Compose, CI/CD và staging. |
| WP-03 | Số hóa và OCR | PBI-01 đến PBI-03 | Upload ảnh/PDF, tiền xử lý, Tesseract OCR chạy nền và trạng thái tác vụ. |
| WP-04 | Kiểm duyệt và biên mục | PBI-04 đến PBI-06 | Side-by-side, chỉnh sửa, duyệt/từ chối và metadata cơ bản. |
| WP-05 | Xuất bản và truy cập | PBI-07 đến PBI-09 | AES-256, chính sách truy cập và giới hạn phiên đồng thời. |
| WP-06 | Tìm kiếm và trình đọc | PBI-10 đến PBI-13 | Tìm kiếm toàn văn, Canvas Reader, bảo vệ link và nhảy trang. |
| WP-07 | Bảo vệ và audit | PBI-14 đến PBI-16 | Watermark, Screenshot Blur và Audit Trail. |
| WP-08 | Kiểm thử và bàn giao | EN-02, EN-03 | Test, sửa lỗi, README, báo cáo, slide và kịch bản demo. |

### 4.2 Phạm vi chức năng

| Mã | Chức năng | Mức ưu tiên | Kết quả cần đạt ở mức MVP |
| :--- | :--- | :---: | :--- |
| PBI-01 | Upload ảnh/PDF | Must | Kiểm tra định dạng, tạo hồ sơ và lưu tài liệu mẫu. |
| PBI-02 | OCR chạy nền | Must | Tiền xử lý và trích xuất văn bản/toạ độ bằng Tesseract. |
| PBI-03 | Theo dõi OCR | Should | Hiển thị tiến độ, trạng thái lỗi và cho phép retry. |
| PBI-04 | Đối soát Side-by-side | Must | Hiển thị ảnh và văn bản, hỗ trợ định vị/chỉnh sửa. |
| PBI-05 | Phê duyệt/Từ chối | Must | Quản lý trạng thái và lưu người/thời điểm duyệt. |
| PBI-06 | Biên mục | Must | Lưu các metadata thư viện cơ bản. |
| PBI-07 | Mã hóa lưu kho | Must | Mã hóa AES-256 trước khi lưu khu vực xuất bản. |
| PBI-08 | Chính sách truy cập | Must | Phân quyền đọc theo nhóm người dùng. |
| PBI-09 | Giới hạn phiên đọc | Must | Chặn phiên vượt hạn mức bằng cơ chế đồng bộ phù hợp. |
| PBI-10 | Tìm kiếm toàn văn | Must | Tìm sách/trang và hiển thị đoạn trích trên dữ liệu demo. |
| PBI-11 | Canvas Reader | Must | Đọc, chuyển trang và zoom trên trình duyệt. |
| PBI-12 | Bảo vệ link/tải file | Must | Không công khai URL PDF gốc; dùng token/stream ở mức prototype. |
| PBI-13 | Nhảy trang từ kết quả | Should | Mở đúng trang và highlight từ khóa. |
| PBI-14 | Dynamic Watermark | Must | Hiển thị định danh người dùng/IP/thời gian trên trang đọc. |
| PBI-15 | Screenshot Blur | Should | Làm mờ khi mất focus hoặc sự kiện trình duyệt hỗ trợ. |
| PBI-16 | Audit Trail | Must | Ghi thời gian, người dùng, hành động, tài liệu/trang và IP. |

### 4.3 Phạm vi co giãn

PBI-03, PBI-13 và PBI-15 là Should Have, tổng 13 SP. Khi velocity trung bình sau Sprint 2 dưới 24 SP/Sprint hoặc capacity giảm đáng kể, Product Owner được đề xuất hoãn các PBI này để bảo vệ deadline và chất lượng Must Have.

### 4.4 Ngoài phạm vi

- Hệ thống production có SLA, giám sát 24/7, high availability hoặc disaster recovery hoàn chỉnh.
- Triển khai/pilot tại thư viện thật và đào tạo người dùng diện rộng.
- Số hóa hàng loạt, mua scanner hoặc hiệu chỉnh nội dung quy mô vận hành.
- Pentest/chứng nhận bảo mật chuyên nghiệp và cam kết chống sao chép tuyệt đối.
- Mua hoặc phân phối bản quyền nội dung sách.
- Mobile App, offline reader, AI tóm tắt, dịch tự động, HTR/Hán Nôm.
- Tích hợp thanh toán, hợp đồng nhà xuất bản hoặc mô hình SaaS nhiều tenant hoàn chỉnh.
- Bảo hành, bảo trì và hỗ trợ kỹ thuật sau khi kết thúc học phần.

---

## 5. Sản phẩm Bàn giao

| Mã | Deliverable | Nội dung tối thiểu | Hình thức | Thời hạn |
| :--- | :--- | :--- | :--- | :---: |
| DEL-01 | Bộ tài liệu khởi tạo và phân tích | Charter, Proposal, Vision & Scope, Product Backlog | Markdown/PDF nếu môn học yêu cầu | Tuần 2 |
| DEL-02 | Kiến trúc và PoC | Architecture, PoC và kết quả thử nghiệm kỹ thuật | Markdown, code mẫu, hình/demo | Tuần 2-4 |
| DEL-03 | Kế hoạch quản lý dự án | Estimation, Project Planning, SOW, Project Monitoring, Risk/Issue/Change records | Markdown và bằng chứng trên công cụ quản lý | Tuần 2; cập nhật xuyên suốt |
| DEL-04 | Bằng chứng Scrum | Sprint Goal, Sprint Backlog, Review, Retro, velocity/burndown | Issue board, biên bản hoặc báo cáo | Cuối mỗi Sprint |
| DEL-05 | Mã nguồn MVP | Frontend, backend, database migration, test và dữ liệu seed | Git repository | Tuần 10 |
| DEL-06 | Gói triển khai/demo | Docker Compose hoặc hướng dẫn chạy local/staging | Release artifact và README | Tuần 10 |
| DEL-07 | Bộ kiểm thử | Test case, kết quả unit/integration/E2E, defect log | Source/test report | Tuần 10 |
| DEL-08 | Báo cáo và trình bày cuối kỳ | Báo cáo tổng kết, slide, kịch bản demo, giới hạn và lessons learned | Markdown/PDF/slide | Tuần 10 |

### 5.1 Yêu cầu chung cho deliverable

- Tệp mở được, không hỏng và được đặt tên nhất quán.
- Mã nguồn build/chạy theo hướng dẫn trên môi trường đã công bố.
- Tài liệu phản ánh đúng trạng thái sản phẩm, không mô tả tính năng chưa hoàn thành như đã hoàn thành.
- Mọi secret, tài khoản thật và dữ liệu nhạy cảm được loại khỏi artifact nộp bài.
- Có revision history hoặc lịch sử Git đủ để truy vết thay đổi chính.

---

## 6. Tiêu chí Chấp nhận

### 6.1 Tiêu chí chấp nhận sản phẩm

| AC | Tiêu chí | Bằng chứng |
| :--- | :--- | :--- |
| AC-01 | Luồng upload → OCR → đối soát → phê duyệt chạy trên dữ liệu mẫu | Demo và test case end-to-end |
| AC-02 | Tài liệu đã duyệt được mã hóa/lưu kho và áp dụng quyền truy cập | Integration test và demo vai trò |
| AC-03 | Giới hạn phiên đọc đồng thời hoạt động trong kịch bản thử nghiệm | Test cạnh tranh/đồng thời có log kết quả |
| AC-04 | Tìm kiếm trả đúng sách/trang trên tập dữ liệu demo | Test case và kết quả đo phản hồi |
| AC-05 | Canvas Reader hiển thị tài liệu, chuyển trang và zoom | Demo trên trình duyệt mục tiêu |
| AC-06 | Không công khai URL PDF gốc trong UI; watermark và audit hoạt động | Security checklist và kiểm tra Network/DevTools |
| AC-07 | Không còn lỗi Critical trước bản nộp cuối kỳ | Defect log và regression report |
| AC-08 | Hệ thống có thể cài/chạy theo README hoặc Docker Compose | Fresh-install verification |

### 6.2 Tiêu chí chấp nhận quản lý dự án

| AC | Tiêu chí | Bằng chứng |
| :--- | :--- | :--- |
| PM-AC-01 | Có kế hoạch và baseline phạm vi, tiến độ, effort, chi phí | Bộ tài liệu quản lý dự án |
| PM-AC-02 | Có đủ bằng chứng 05 Sprint | Sprint Goal, backlog, Review và Retro |
| PM-AC-03 | Có theo dõi đóng góp và capacity | Issue, commit, PR, review và effort log |
| PM-AC-04 | Có Risk/Issue/Change records được cập nhật | Register và biên bản quyết định |
| PM-AC-05 | Có tái ước tính sau Sprint 1 và Sprint 2 | Forecast/baseline update |
| PM-AC-06 | Việc dùng Coding Agent tuân thủ quy định học thuật | Review, test và mô tả sử dụng AI khi được yêu cầu |

### 6.3 Giới hạn của tiêu chí bảo mật

Block Download, Screenshot Blur và watermark trong đồ án là cơ chế **giảm rủi ro, răn đe và truy vết ở mức prototype**. Việc đáp ứng AC-06 không có nghĩa hệ thống ngăn được mọi hình thức sao chép, chụp bằng thiết bị ngoài hoặc tấn công chuyên sâu.

---

## 7. Lịch Thực hiện và Milestone

| Sprint/Mốc | Tuần | Phạm vi | Kết quả nghiệm thu nội bộ |
| :--- | :---: | :--- | :--- |
| Sprint 1 / G1 | 1-2 | EN-01, PBI-01, PBI-02 | Baseline, CI, upload và OCR Pipeline |
| Sprint 2 / G2 | 3-4 | PBI-03 đến PBI-06 | Demo nghiệp vụ thủ thư và báo cáo giữa kỳ |
| Sprint 3 / G3 | 5-6 | PBI-07 đến PBI-09, PBI-16 | Xuất bản an toàn, quyền, phiên và audit |
| Sprint 4 / G4 | 7-8 | PBI-10, PBI-11, PBI-14, PBI-15 | Search, Canvas Reader và bảo vệ răn đe |
| Sprint 5 / G5 | 9-10 | PBI-12, PBI-13, EN-02, EN-03 | Hardening, test, tài liệu và Final Submission |

Deadline mục tiêu và deadline tối đa là cuối tuần 10, trừ khi giảng viên công bố thay đổi lịch học phần. PBI chưa đạt Definition of Done tại cuối Sprint được trả về Product Backlog và không tính vào velocity.

---

## 8. Nguồn lực và Phân công

### 8.1 Nhân sự

| Vai trò | Số lượng | Trách nhiệm chính |
| :--- | :---: | :--- |
| Product Owner/Business Analyst | 01 sinh viên | Backlog, acceptance criteria, nghiệp vụ và demo |
| Scrum Master/Technical Lead | 01 sinh viên | Scrum, kiến trúc, tích hợp và xử lý impediment |
| Backend/OCR/Data | 01 sinh viên chính và hỗ trợ chéo | OCR, queue, database, Redis và MinIO |
| Frontend/UI/UX | 01 sinh viên chính và hỗ trợ chéo | Admin Panel và Side-by-side UI |
| Frontend/Security | 01 sinh viên chính và hỗ trợ chéo | Canvas Reader, Web Crypto và watermark |
| QA/DevOps/Documentation | 01 sinh viên chính và cả nhóm hỗ trợ | Test, CI/CD, staging, release và tài liệu |

Mỗi sinh viên dự kiến đóng góp 15 giờ/tuần trong 10 tuần. Tổng effort danh nghĩa là **900 giờ-người**; effort tập trung cho sản phẩm là **765 giờ-người**.

### 8.2 Nguồn lực hỗ trợ

- Giảng viên: cố vấn, phản hồi và đánh giá học phần.
- Thủ thư/người dùng đại diện: 01-02 buổi góp ý nếu có thể sắp xếp.
- Bộ dữ liệu: 10-20 tài liệu tiếng Việt có quyền sử dụng, khoảng 300 DPI.
- Hạ tầng: máy cá nhân, Git repository, CI/CD và 01 môi trường staging.
- Coding Agent: hỗ trợ trong 10 tuần theo quy định sử dụng AI của học phần.

---

## 9. Ngân sách và Điều kiện Chi phí

| Hạng mục | Baseline (VNĐ) |
| :--- | ---: |
| Công sức 06 sinh viên | 0 tiền lương; quản lý bằng 900 giờ-người |
| Coding Agent | 3.000.000 |
| VPS staging | 4.000.000 |
| Domain, backup và dịch vụ phụ trợ | 600.000 |
| Dữ liệu test, in ấn và vật tư demo | 400.000 |
| Dự phòng 10% | 800.000 |
| **Tổng** | **8.800.000** |

- Baseline là hạn mức lập kế hoạch, không phải nghĩa vụ phải chi hết.
- Nhóm ưu tiên tài nguyên trường, free tier và dịch vụ sẵn có.
- Mọi khoản chi cần được nhóm thống nhất và ghi nhận thực tế.
- Tổng dự báo vượt 10.000.000 VNĐ cần được cả nhóm và giảng viên xem xét.
- Chi phí production, scanner, pentest thương mại, bản quyền nội dung và bảo trì không thuộc SOW.

---

## 10. Giả định, Phụ thuộc và Ràng buộc

### 10.1 Giả định

- Các thành viên duy trì trung bình 15 giờ/tuần và chủ động báo tuần giảm capacity.
- Tech stack và PoC hiện có có thể tái sử dụng.
- Có dữ liệu mẫu và môi trường đủ để chạy OCR/demo.
- Product Owner có thể làm người dùng đại diện khi chưa có thủ thư tham gia.
- Coding Agent khả dụng nhưng mọi đầu ra đều được sinh viên review và kiểm thử.

### 10.2 Phụ thuộc

- PBI-02 phụ thuộc PBI-01; PBI-04 phụ thuộc kết quả OCR.
- PBI-07 đến PBI-09 phụ thuộc workflow phê duyệt.
- PBI-11/PBI-12 phụ thuộc mã hóa và phân quyền.
- PBI-13 phụ thuộc tìm kiếm và Canvas Reader.
- PBI-14/PBI-15/PBI-16 phụ thuộc luồng đọc tài liệu.
- Final Submission phụ thuộc test, tài liệu, release artifact và lịch giảng viên.

### 10.3 Ràng buộc

- Thời gian cố định 10 tuần; không mặc định có Sprint bổ sung.
- Nhóm có 06 sinh viên và không bổ sung nhân sự thuê ngoài.
- Công nghệ chủ đạo theo Architecture hiện hành; thay đổi lớn phải phân tích tác động.
- Chỉ dùng dữ liệu có quyền sử dụng và không đưa dữ liệu nhạy cảm vào Coding Agent.
- Phạm vi bảo mật là prototype, không phải sản phẩm được chứng nhận.

---

## 11. Trách nhiệm của Các bên

### 11.1 Nhóm sinh viên

- Thực hiện công việc, quản lý backlog và tạo Increment theo Sprint.
- Bảo đảm tính chính xác, trung thực của mã nguồn, test, tài liệu và báo cáo.
- Quản lý repository, dữ liệu, secret và artifact nộp bài.
- Báo sớm rủi ro, thiếu capacity hoặc thay đổi có ảnh hưởng baseline.
- Tuân thủ quy định học thuật, bản quyền và sử dụng AI.

### 11.2 Product Owner đại diện nhóm

- Duy trì Product Backlog, ưu tiên và acceptance criteria.
- Chấp nhận/từ chối PBI trong Sprint Review dựa trên Definition of Done.
- Điều phối demo, feedback và tài liệu phạm vi.

### 11.3 Scrum Master/Technical Lead

- Tổ chức Scrum events, theo dõi impediment và tính minh bạch tiến độ.
- Điều phối quyết định kiến trúc, tích hợp và quản lý thay đổi kỹ thuật.
- Báo giảng viên khi blocker vượt thẩm quyền của nhóm.

### 11.4 Giảng viên phụ trách

- Cung cấp yêu cầu, mốc nộp và tiêu chí đánh giá học phần.
- Góp ý tại checkpoint và xác nhận thay đổi deadline/yêu cầu học phần.
- Đánh giá sản phẩm và bằng chứng quản lý dự án theo quy định môn học.

---

## 12. Quy trình Nghiệm thu

1. Owner tự kiểm tra acceptance criteria và chuẩn bị bằng chứng.
2. Ít nhất 01 thành viên khác peer review mã/tài liệu.
3. QA chạy test liên quan và cập nhật defect log.
4. Product Owner kiểm tra trên staging/môi trường demo.
5. Nhóm demo trong Sprint Review và ghi nhận feedback.
6. PBI đạt Definition of Done được chuyển sang Done; PBI còn thiếu quay lại Product Backlog.
7. Cuối tuần 10, nhóm chạy regression/fresh-install, tạo release và nộp deliverables.
8. Giảng viên đánh giá theo yêu cầu học phần; feedback sau đánh giá được lưu vào hồ sơ kết thúc dự án.

Việc Product Owner chấp nhận PBI là nghiệm thu nội bộ của nhóm, không thay thế quyền đánh giá học phần của giảng viên.

---

## 13. Quản lý Thay đổi

| Loại thay đổi | Thẩm quyền | Cách xử lý |
| :--- | :--- | :--- |
| Thứ tự PBI không đổi tổng phạm vi | Product Owner | Cập nhật Product Backlog và thông báo ở Planning/Review |
| Thay đổi task trong Sprint nhưng giữ Sprint Goal | Nhóm phát triển | Cập nhật Sprint Backlog |
| Tăng/giảm phạm vi chức năng | PO đề xuất, nhóm ước tính | Lập Change Request và đổi bằng PBI/SP tương đương |
| Thay đổi kiến trúc lớn | Tech Lead và nhóm | Ghi ADR, tác động effort/rủi ro và cập nhật tài liệu |
| Thay đổi deadline/yêu cầu học phần | Giảng viên | Chỉ áp dụng sau xác nhận chính thức |
| Dự báo chi phí vượt 10 triệu VNĐ | Cả nhóm và giảng viên xem xét | Ưu tiên phương án miễn phí hoặc điều chỉnh phạm vi |

Mọi thay đổi baseline phải có lý do, ảnh hưởng, người quyết định và ngày hiệu lực. Thỏa thuận qua lời nói không được xem là thay đổi chính thức nếu chưa được ghi lại.

---

## 14. Quyền sở hữu, Bản quyền và Sử dụng AI

- Quyền sử dụng mã nguồn và sản phẩm học phần tuân theo quy định của trường, học phần và giấy phép của các thư viện mã nguồn mở được dùng.
- Dữ liệu sách mẫu phải thuộc public domain, do nhóm tự tạo hoặc được phép sử dụng.
- Không phân phối file có bản quyền cùng repository hoặc artifact nộp bài khi chưa được phép.
- Coding Agent là công cụ hỗ trợ; sinh viên vẫn chịu trách nhiệm với tính đúng đắn, bảo mật và khả năng giải thích đầu ra.
- Nhóm công bố mức độ sử dụng AI nếu quy định học phần yêu cầu.
- Không dùng AI để tạo dữ liệu kiểm thử, review, biên bản hoặc bằng chứng đóng góp giả.

---

## 15. Điều kiện Hoàn tất SOW

SOW được xem là hoàn tất khi:

- Đến deadline cuối tuần 10 hoặc ngày thay thế do giảng viên công bố.
- Nhóm đã nộp các deliverable bắt buộc ở Mục 5.
- Có release/tag cuối kỳ, test report và hướng dẫn chạy.
- Có báo cáo phạm vi hoàn thành/chưa hoàn thành và giới hạn đã biết.
- Chi phí thực tế được đối chiếu với baseline.
- Retrospective cuối dự án và lessons learned được ghi nhận.

Những hạng mục ngoài phạm vi hoặc chưa hoàn thành được đưa vào Product Backlog/Roadmap sau học phần, không mặc nhiên kéo dài nghĩa vụ của SOW.

---

## 16. Xác nhận Phạm vi Công việc

| Vai trò | Nội dung xác nhận | Họ tên | Ngày/Xác nhận |
| :--- | :--- | :--- | :--- |
| Product Owner/Đại diện nhóm | Phạm vi, ưu tiên và deliverables |  |  |
| Scrum Master/Trưởng nhóm | Tiến độ, nguồn lực và quy trình thực hiện |  |  |
| Đại diện nhóm phát triển | Capacity, Definition of Done và trách nhiệm bàn giao |  |  |
| Giảng viên phụ trách | Sự phù hợp với mục tiêu và yêu cầu học phần |  |  |

---

> **Xác nhận:** `LIBIF-Statement-Of-Work.md` là cơ sở thống nhất phạm vi công việc của đồ án LIBIF. Khi SOW và Product Backlog khác nhau, thay đổi được phê duyệt gần nhất và có bằng chứng trong hồ sơ dự án là căn cứ áp dụng.
