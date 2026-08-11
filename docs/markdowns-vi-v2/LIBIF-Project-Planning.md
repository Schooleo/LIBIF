# KẾ HOẠCH QUẢN LÝ DỰ ÁN (PROJECT MANAGEMENT PLAN)

| Thuộc tính | Giá trị |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| Bối cảnh | Đồ án nhóm trong học phần Quản lý Dự án Phần mềm |
| Tên tài liệu | `docs/markdowns-vi-v2/LIBIF-Project-Planning.md` |
| Mã dự án | CDLS-2026 |
| Phương pháp phát triển | Scrum |
| Quy mô nhóm | 06 sinh viên, có Coding Agent hỗ trợ xuyên suốt |
| Thời gian thực hiện | 10 tuần học, 05 Sprint × 02 tuần |
| Baseline tham chiếu | `LIBIF-Project-Estimation.md`, phiên bản 2.0 |
| Phiên bản tài liệu | 1.0 |
| Ngày lập | 12/08/2026 |
| Trạng thái | Kế hoạch đề xuất để nhóm và giảng viên thống nhất |

---

## 1. Mục đích Tài liệu

Tài liệu này mô tả cách nhóm lập kế hoạch, tổ chức, thực hiện, theo dõi và kết thúc đồ án LIBIF trong học phần Quản lý Dự án Phần mềm. Kế hoạch chuyển các baseline trong `LIBIF-Project-Estimation.md` thành hoạt động quản trị cụ thể cho 05 Sprint.

Mục tiêu quản lý dự án gồm:

- Hoàn thành MVP/prototype có thể cài đặt, kiểm thử và demo vào cuối tuần 10.
- Thực hành đầy đủ các hoạt động Scrum và lưu bằng chứng quản lý dự án.
- Kiểm soát phạm vi 136 SP, effort 900 giờ-người và ngân sách tiền mặt 8.800.000 VNĐ.
- Phân công minh bạch, cân bằng đóng góp và giảm phụ thuộc vào cá nhân.
- Sử dụng Coding Agent có kiểm soát, tuân thủ quy định học thuật và bảo đảm thành viên hiểu đầu ra.

---

## 2. Baseline và Tiêu chí Thành công

### 2.1 Baseline dự án

| Thành phần | Baseline |
| :--- | :--- |
| Phạm vi | 16 PBIs và 03 enablers, tổng 136 SP |
| Phạm vi bắt buộc | 13 PBI Must Have, tổng 104 SP tính năng |
| Phạm vi co giãn | PBI-03, PBI-13, PBI-15, tổng 13 SP |
| Thời gian | 10 tuần, 05 Sprint × 02 tuần |
| Nguồn lực | 06 sinh viên × 15 giờ/tuần × 10 tuần = 900 giờ-người |
| Effort tập trung | 765 giờ-người |
| Chi phí tiền mặt | 8.800.000 VNĐ, đã gồm dự phòng 10% |
| Trần kiểm soát chi phí | 10.000.000 VNĐ |

### 2.2 Tiêu chí thành công của học phần

| Mã | Tiêu chí | Chỉ số/Điều kiện |
| :--- | :--- | :--- |
| SC-01 | Hoàn thành phạm vi cốt lõi | Các PBI Must Have được demo hoặc giới hạn chưa đạt được báo cáo trung thực và có nguyên nhân. |
| SC-02 | Có Increment chạy được | Hệ thống cài được bằng hướng dẫn hoặc Docker và chạy trên staging/máy demo. |
| SC-03 | Có bằng chứng Scrum | Có Sprint Goal, Sprint Backlog, Review, Retrospective và velocity cho mỗi Sprint. |
| SC-04 | Chất lượng tối thiểu | Không còn lỗi Critical; test cốt lõi chạy thành công; hạn chế đã biết được ghi nhận. |
| SC-05 | Đúng hạn học phần | Mã nguồn, báo cáo, slide và demo hoàn tất cuối tuần 10. |
| SC-06 | Đóng góp minh bạch | Có lịch sử issue, commit, pull request, review và effort của từng thành viên. |
| SC-07 | Sử dụng AI có trách nhiệm | Mã do Coding Agent hỗ trợ được review, test và thành viên có thể giải thích. |

---

## 3. Phương pháp Thực hiện

### 3.1 Mô hình Scrum

Dự án sử dụng Scrum với Sprint dài 02 tuần. Product Backlog là nguồn công việc duy nhất; mỗi Sprint tạo một Increment có thể kiểm thử và demo. Nhóm ưu tiên hoàn thành end-to-end thay vì đồng thời bắt đầu quá nhiều module.

| Sự kiện | Timebox | Thành phần | Đầu ra bắt buộc |
| :--- | :--- | :--- | :--- |
| Sprint Planning | 02 giờ đầu Sprint | Cả nhóm | Sprint Goal, Sprint Backlog, capacity và owner ban đầu |
| Daily Scrum | 15 phút/ngày làm việc hoặc cập nhật async khi trùng lịch | Nhóm phát triển | Tiến độ, kế hoạch tiếp theo, impediment |
| Backlog Refinement | 01 giờ/tuần | PO và nhóm | PBI đủ rõ cho 1-2 Sprint tiếp theo |
| Sprint Review | 01 giờ cuối Sprint | Nhóm, giảng viên/người dùng khi phù hợp | Demo Increment, feedback và quyết định backlog |
| Sprint Retrospective | 45 phút cuối Sprint | Cả nhóm | 01-03 hành động cải tiến có owner và hạn xử lý |

### 3.2 Quy tắc luồng công việc

Trạng thái đề xuất cho mỗi backlog item:

`Backlog → Ready → In Progress → Code Review → Testing → Done`

- Mỗi thành viên không giữ quá 02 item ở trạng thái In Progress.
- PBI lớn phải được tách thành task kỹ thuật nhưng Story Points chỉ được ghi hoàn thành khi toàn bộ PBI đạt Definition of Done.
- Pull request cần ít nhất 01 reviewer khác người viết.
- Không merge khi pipeline thất bại hoặc còn nhận xét review mức blocking.
- Lỗi Critical được ưu tiên hơn tính năng mới trong cùng Sprint.

### 3.3 Definition of Ready

Một PBI được đưa vào Sprint khi:

- Có User Story, giá trị nghiệp vụ và acceptance criteria rõ ràng.
- Đã xác định phụ thuộc, dữ liệu test và thiết kế/UI cần thiết.
- Cả nhóm thống nhất Story Points.
- Không còn câu hỏi có khả năng làm thay đổi đáng kể giải pháp.
- PBI có thể hoàn thành trong một Sprint; nếu chưa, phải tách nhỏ trước Planning.

### 3.4 Definition of Done

Một PBI được tính hoàn thành khi:

- Acceptance criteria đã được kiểm tra trên môi trường thống nhất.
- Mã nguồn đã qua peer review và pipeline liên quan chạy thành công.
- Có unit/integration test phù hợp; không còn lỗi Critical mở.
- Có xử lý lỗi, logging và cập nhật tài liệu cần thiết.
- Product Owner chấp nhận trong Sprint Review.
- Thành viên phụ trách có thể giải thích phần mã và thiết kế, kể cả khi có Coding Agent hỗ trợ.

---

## 4. Tổ chức Nhóm và Trách nhiệm

### 4.1 Cơ cấu nhóm

| Mã | Vai trò chính | Vai trò kiêm nhiệm | Trách nhiệm | Capacity |
| :---: | :--- | :--- | :--- | ---: |
| TV-01 | Product Owner / Business Analyst | UX, Demo Coordinator | Product Goal, backlog, acceptance criteria và kịch bản demo | 15 giờ/tuần |
| TV-02 | Scrum Master / Technical Lead | Backend Developer | Scrum events, kiến trúc, tích hợp và impediment | 15 giờ/tuần |
| TV-03 | Backend/OCR Developer | Data Engineer | Tesseract, BullMQ, PostgreSQL, Redis và MinIO | 15 giờ/tuần |
| TV-04 | Frontend Developer | UI/UX | Admin Panel và giao diện Side-by-side | 15 giờ/tuần |
| TV-05 | Frontend/Security Developer | Backend Support | Canvas Reader, Web Crypto, watermark và hardening | 15 giờ/tuần |
| TV-06 | QA/DevOps Engineer | Documentation Coordinator | Test, CI/CD, Docker, staging và tổng hợp báo cáo | 15 giờ/tuần |

Giảng viên giữ vai trò cố vấn và đánh giá học phần, không thay thế Product Owner hoặc Scrum Master. Khi không có thủ thư thật tham gia, TV-01 làm người dùng đại diện và phải ghi rõ các nhận định nghiệp vụ chưa được xác minh thực tế.

### 4.2 Ma trận RACI rút gọn

| Hoạt động | PO/BA | SM/Tech Lead | Dev Team | QA/DevOps | Giảng viên |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Quản lý Product Backlog | A/R | C | C | C | I |
| Lập Sprint và điều phối Scrum | C | A/R | R | R | I |
| Kiến trúc và quyết định kỹ thuật | C | A | R | C | I |
| Phát triển Increment | C | R | A/R | R | I |
| Kiểm thử và quản lý lỗi | C | C | R | A/R | I |
| Tài liệu và báo cáo học phần | A | C | R | R | I |
| Thay đổi deadline/yêu cầu học phần | C | R | C | C | A |
| Demo và nộp bài cuối kỳ | A/R | R | R | R | I |

---

## 5. Work Breakdown Structure

| WBS | Gói công việc | Phạm vi | Đầu ra chính | Owner chính |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | Quản lý dự án | Backlog, Sprint, risk, issue, change, giám sát và báo cáo | Bộ bằng chứng Scrum, dữ liệu giám sát và tài liệu quản lý | TV-01, TV-02 |
| 2.0 | Nền tảng kỹ thuật | Auth/RBAC, database, Docker, CI/CD | EN-01 và môi trường tích hợp | TV-02, TV-06 |
| 3.0 | Số hóa và OCR | PBI-01 đến PBI-03 | Upload, OCR nền và tiến độ tác vụ | TV-03 |
| 4.0 | Kiểm duyệt và biên mục | PBI-04 đến PBI-06 | Side-by-side, duyệt và metadata | TV-04 |
| 5.0 | Xuất bản và phân quyền | PBI-07 đến PBI-09 | AES-256, RBAC và concurrent limit | TV-02, TV-03 |
| 6.0 | Tìm kiếm và trình đọc | PBI-10 đến PBI-15 | Search, Canvas Reader và bảo vệ răn đe | TV-04, TV-05 |
| 7.0 | Audit và kiểm thử | PBI-16, EN-02 | Audit Trail, test report và defect log | TV-05, TV-06 |
| 8.0 | Bàn giao học phần | EN-03 | Hướng dẫn, báo cáo, slide và demo | TV-01, TV-06 |

---

## 6. Kế hoạch Tiến độ

### 6.1 Kế hoạch 05 Sprint

| Sprint | Tuần | Sprint Goal | Phạm vi dự kiến | SP | Milestone |
| :--- | :---: | :--- | :--- | ---: | :--- |
| Sprint 1 | 1-2 | Dựng nền tảng và luồng OCR cơ bản | EN-01, PBI-01, PBI-02 | 26 | G1 - Baseline & OCR Pipeline |
| Sprint 2 | 3-4 | Hoàn thành nghiệp vụ kiểm duyệt | PBI-03, PBI-04, PBI-05, PBI-06 | 28 | G2 - Midterm Functional Demo |
| Sprint 3 | 5-6 | Xuất bản và kiểm soát truy cập | PBI-07, PBI-08, PBI-09, PBI-16 | 29 | G3 - Secure Publishing Demo |
| Sprint 4 | 7-8 | Tra cứu và đọc sách an toàn | PBI-10, PBI-11, PBI-14, PBI-15 | 29 | G4 - Feature Complete |
| Sprint 5 | 9-10 | Hoàn thiện, kiểm thử và nộp bài | PBI-12, PBI-13, EN-02, EN-03 | 24 | G5 - Final Submission |
|  |  | **Tổng** |  | **136** |  |

### 6.2 Lịch hoạt động lặp lại

| Thời điểm | Hoạt động |
| :--- | :--- |
| Đầu mỗi Sprint | Xác nhận availability, Sprint Planning và phân công owner |
| Giữa tuần thứ nhất | Refinement và tích hợp sớm |
| Cuối tuần thứ nhất | Kiểm tra Sprint Goal, rủi ro và effort |
| Giữa tuần thứ hai | Feature freeze cho phạm vi Sprint, tập trung test |
| Cuối Sprint | Review, Retrospective, cập nhật velocity và forecast |
| Cuối Sprint 2 | Tái ước tính chính thức lần 1 và quyết định Should Have |
| Đầu Sprint 5 | Code freeze theo module, hoàn thiện báo cáo và demo |
| Cuối tuần 10 | Nộp mã nguồn, tài liệu, slide và thực hiện demo |

### 6.3 Quản lý sai lệch tiến độ

- Velocity dưới 24 SP/Sprint sau Sprint 2: hoãn PBI-03, PBI-13 và PBI-15.
- Một thành viên thiếu trên 20% capacity: phân công lại, pairing và giảm WIP.
- Sprint Goal có nguy cơ thất bại: Scrum Master tổ chức buổi xử lý impediment trong 24 giờ.
- Không chuyển PBI chưa Done thành “hoàn thành một phần”; phần còn lại quay về Product Backlog.
- Deadline học phần chỉ thay đổi khi giảng viên cho phép bằng thông báo chính thức.

---

## 7. Kế hoạch Nguồn lực và Effort

| Thành phần | Giờ-người | Tỷ lệ |
| :--- | ---: | ---: |
| Effort danh nghĩa | 900 | 100% |
| Scrum events và phối hợp | 90 | 10% |
| Gián đoạn học tập và hỗ trợ chéo | 45 | 5% |
| **Effort tập trung cho sản phẩm** | **765** | **85%** |

Phân bổ effort tập trung:

| Nhóm công việc | Giờ-người | Tỷ lệ |
| :--- | ---: | ---: |
| Nghiệp vụ, backlog, UX và tài liệu quản lý | 90 | 11,8% |
| Kiến trúc, nền tảng và DevOps | 75 | 9,8% |
| Backend, OCR, dữ liệu và tìm kiếm | 195 | 25,5% |
| Frontend Admin/Review/Reader | 180 | 23,5% |
| Bảo mật, DRM và audit | 105 | 13,7% |
| QA, sửa lỗi, báo cáo và demo | 120 | 15,7% |
| **Tổng** | **765** | **100%** |

Mỗi thành viên khai báo capacity trước Sprint Planning và cập nhật effort thực tế tối thiểu mỗi tuần. Effort được dùng để cân bằng tải và rút kinh nghiệm, không dùng riêng lẻ để đánh giá giá trị đóng góp thay cho kết quả và chất lượng.

---

## 8. Kế hoạch Chi phí

| Hạng mục | Ngân sách (VNĐ) | Quy tắc kiểm soát |
| :--- | ---: | :--- |
| Coding Agent | 3.000.000 | Là hạn mức 10 tuần; kiểm tra quyền truy cập sẵn có trước khi mua. |
| VPS staging | 4.000.000 | Ưu tiên tài nguyên trường/free tier; chỉ mua khi cần. |
| Domain, backup và dịch vụ phụ trợ | 600.000 | PO/SM xác nhận trước khi chi. |
| Dữ liệu test, in ấn và vật tư demo | 400.000 | Có hóa đơn hoặc ghi nhận chi phí thực tế. |
| Dự phòng 10% | 800.000 | Chỉ dùng cho quota compute/storage hoặc sự cố cần thiết. |
| **Tổng baseline** | **8.800.000** | Trần kiểm soát 10.000.000 VNĐ. |

- TV-01 duy trì bảng thu chi; ít nhất một thành viên khác đối soát.
- Không mua dịch vụ khi có phương án miễn phí đáp ứng được mục tiêu học phần và không làm tăng rủi ro đáng kể.
- Khoản chi vượt ngân sách hạng mục phải được nhóm thống nhất trước.
- Dự báo tổng vượt 10.000.000 VNĐ phải được giảng viên phụ trách xem xét.

---

## 9. Kế hoạch Chất lượng

### 9.1 Mục tiêu chất lượng

| Nhóm chất lượng | Mục tiêu MVP | Cách kiểm tra |
| :--- | :--- | :--- |
| Chức năng | Luồng upload → OCR → duyệt → xuất bản → tìm kiếm → đọc chạy end-to-end | Test case và demo trên staging |
| OCR | Xử lý được bộ dữ liệu tiếng Việt mẫu khoảng 300 DPI | Benchmark và lưu kết quả mẫu |
| Tìm kiếm | Trả kết quả đúng trên tập dữ liệu demo; mục tiêu dưới 2 giây | Test có đo thời gian |
| Bảo mật prototype | Không cấp URL PDF gốc công khai; watermark và audit hoạt động | Kiểm tra Network/DevTools và security checklist |
| Độ tin cậy demo | Không còn lỗi Critical; có dữ liệu seed và phương án khôi phục | Regression test và rehearsal |
| Khả năng cài đặt | Thành viên khác có thể chạy theo README/Docker | Fresh-install test |

### 9.2 Chiến lược kiểm thử

- Unit test cho logic mã hóa, quyền truy cập, concurrent limit và xử lý trạng thái.
- Integration test cho OCR queue, database, MinIO, Redis và API.
- End-to-end test cho các luồng nghiệp vụ chính.
- Kiểm thử thủ công đa trình duyệt theo phạm vi ưu tiên Chrome/Edge.
- Security checklist cho secret, token, URL tài liệu, phân quyền và log.
- Demo rehearsal tối thiểu 02 lần trong Sprint 5.

### 9.3 Quản lý lỗi

| Mức | Mô tả | Thời gian phản ứng |
| :--- | :--- | :--- |
| Critical | Không cài/chạy được, mất dữ liệu, lộ file/secret hoặc chặn luồng demo chính | Xử lý ngay, dừng merge tính năng mới liên quan |
| High | Chức năng Must Have sai và chưa có workaround | Đưa vào ưu tiên cao nhất của Sprint |
| Medium | Sai chức năng phụ hoặc có workaround | Xử lý theo capacity trước code freeze |
| Low | UI/cosmetic hoặc cải tiến nhỏ | Backlog, không cản trở bàn giao |

---

## 10. Kế hoạch Giao tiếp

| Hoạt động | Thành phần | Tần suất | Kênh | Owner |
| :--- | :--- | :--- | :--- | :--- |
| Daily Scrum | 06 thành viên | Ngày làm việc | Trực tiếp/nhóm chat | Scrum Master |
| Technical Sync | Thành viên liên quan | 1-2 lần/tuần | Call/pairing | Tech Lead |
| Sprint Review | Nhóm, giảng viên/người dùng khi phù hợp | Cuối Sprint | Demo trực tiếp/trực tuyến | Product Owner |
| Retrospective | 06 thành viên | Cuối Sprint | Họp nhóm | Scrum Master |
| Báo cáo checkpoint | Nhóm và giảng viên | Giữa kỳ/cuối kỳ hoặc theo yêu cầu | LMS/email/lớp học | Product Owner |
| Risk escalation | Nhóm và giảng viên | Khi rủi ro vượt thẩm quyền nhóm | Kênh chính thức môn học | Scrum Master |

Quyết định thay đổi phạm vi, deadline hoặc chi phí phải được ghi lại trong issue, biên bản Review hoặc revision history; không chỉ thống nhất qua trao đổi miệng.

---

## 11. Kế hoạch Rủi ro

| Mã | Rủi ro chính | Owner | Dấu hiệu kích hoạt | Ứng phó |
| :--- | :--- | :--- | :--- | :--- |
| R-01 | Trùng lịch thi hoặc thiếu capacity | Scrum Master | Capacity giảm trên 20% | Điều phối lại và cắt Should Have |
| R-02 | Đóng góp không đều/phụ thuộc cá nhân | Scrum Master | Task treo, review dồn vào một người | Pairing, giới hạn WIP và chia sẻ kiến thức |
| R-03 | OCR kém trên ảnh xấu | Backend/OCR Dev | Benchmark không đạt trên dữ liệu mẫu | Chuẩn hóa 300 DPI và giới hạn loại tài liệu |
| R-04 | Canvas/Web Crypto không tương thích | Frontend/Security Dev | Test trình duyệt thất bại | Ưu tiên Chrome/Edge và ghi rõ giới hạn |
| R-05 | Kỳ vọng DRM tuyệt đối | Product Owner | Tiêu chí yêu cầu chặn mọi cách sao chép | Định vị là răn đe/truy vết, không cam kết camera ngoài |
| R-06 | Phụ thuộc Coding Agent | Tech Lead | Mã khó giải thích, lỗi lặp hoặc dịch vụ gián đoạn | Peer review, test và phương án làm local |
| R-07 | Vi phạm quy định học thuật | Product Owner | Không truy vết được phần AI hỗ trợ | Ghi nhận, công bố và tuân thủ hướng dẫn giảng viên |
| R-08 | Demo cuối kỳ không ổn định | QA/DevOps | Regression fail gần code freeze | Rehearsal, seed data, backup và video dự phòng |

Risk Register được rà soát trong Sprint Planning và cập nhật tối thiểu một lần mỗi tuần. Rủi ro đã xảy ra được chuyển thành Issue và có owner/hạn xử lý.

---

## 12. Quản lý Thay đổi, Cấu hình và Tài liệu

### 12.1 Quy trình thay đổi

1. Ghi Change Request vào backlog/issue với lý do và người đề xuất.
2. Product Owner phân tích giá trị và mức ưu tiên.
3. Nhóm ước tính ảnh hưởng đến SP, effort, chi phí và Sprint Goal.
4. Nếu tăng phạm vi, loại hoặc hoãn PBI có quy mô tương đương.
5. Thay đổi deadline hoặc yêu cầu học phần phải được giảng viên đồng ý.
6. Cập nhật baseline và thông báo cho cả nhóm.

### 12.2 Quản lý cấu hình

- Nhánh chính luôn ở trạng thái có thể build; thay đổi đi qua pull request.
- Gắn tag hoặc release cho mỗi Sprint Review và bản nộp cuối kỳ.
- Secret chỉ lưu trong biến môi trường; không commit `.env` hoặc credential.
- Schema/migration và dữ liệu seed được quản lý cùng repository.
- Tài liệu Markdown là một phần của Definition of Done khi thay đổi ảnh hưởng thiết kế hoặc quy trình.
- Backup repository và dữ liệu demo trước code freeze.

### 12.3 Sử dụng Coding Agent

- Không cấp quyền vượt quá nhu cầu công việc hoặc đưa secret vào prompt.
- Thành viên yêu cầu thay đổi phải review diff trước khi merge.
- Test và tài liệu do Agent tạo được kiểm tra như đầu ra của con người.
- Khi giảng viên yêu cầu, nhóm cung cấp mô tả phạm vi sử dụng AI và phần đóng góp của thành viên.
- Không dùng Coding Agent để tạo bằng chứng giả về tiến độ, review, kiểm thử hoặc đóng góp.

---

## 13. Theo dõi và Báo cáo

| Chỉ số | Mục đích | Ngưỡng hành động |
| :--- | :--- | :--- |
| Velocity | Forecast phạm vi còn lại | Trung bình sau Sprint 2 dưới 24 SP/Sprint |
| Sprint Goal Success | Đo khả năng lập kế hoạch | Thất bại 02 Sprint liên tiếp |
| Effort/Capacity | Phát hiện quá tải hoặc thiếu đóng góp | Thành viên lệch trên 20% capacity |
| WIP age | Phát hiện task bị kẹt | Một task In Progress quá 03 ngày làm việc |
| Defect Critical/High | Kiểm soát chất lượng | Có Critical hoặc quá 05 High trước code freeze |
| Pipeline pass rate | Độ ổn định tích hợp | Nhánh chính thất bại quá 01 ngày |
| Chi phí dự báo | Kiểm soát ngân sách | Forecast vượt 10.000.000 VNĐ |

Cuối mỗi Sprint, Scrum Master cập nhật dashboard/báo cáo; Product Owner cập nhật forecast phạm vi; QA/DevOps cập nhật chất lượng và release readiness.

---

## 14. Kế hoạch Kết thúc Dự án

Dự án được đóng khi hoàn thành các hoạt động sau:

- Code freeze và tạo release/tag cuối kỳ.
- Chạy regression test và lưu báo cáo kết quả.
- Kiểm tra cài đặt sạch từ README hoặc Docker Compose.
- Hoàn thiện tài liệu, slide, kịch bản demo và danh sách giới hạn đã biết.
- Backup mã nguồn, dữ liệu mẫu và artifact cần thiết.
- Thực hiện demo/nộp bài theo yêu cầu học phần.
- Tổ chức Retrospective cuối dự án và ghi lessons learned.
- Đối chiếu contribution của các thành viên và quyết toán chi phí thực tế.

---

## 15. Phê duyệt Kế hoạch

| Vai trò | Trách nhiệm phê duyệt | Họ tên | Ngày/Xác nhận |
| :--- | :--- | :--- | :--- |
| Product Owner/Đại diện nhóm | Xác nhận phạm vi và sản phẩm bàn giao |  |  |
| Scrum Master/Trưởng nhóm | Xác nhận tiến độ, nguồn lực và cơ chế kiểm soát |  |  |
| Đại diện nhóm phát triển | Xác nhận capacity và Definition of Done |  |  |
| Giảng viên phụ trách | Xác nhận phù hợp yêu cầu học phần |  |  |

---

> **Xác nhận:** `LIBIF-Project-Planning.md` là kế hoạch điều hành đồ án LIBIF trong 10 tuần. Khi có thay đổi baseline được chấp thuận, Product Owner và Scrum Master phải cập nhật tài liệu hoặc lưu quyết định trong hồ sơ Sprint tương ứng.
