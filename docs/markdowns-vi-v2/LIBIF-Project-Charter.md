# ĐIỀU LỆ DỰ ÁN (PROJECT CHARTER)

**Tên dự án:** Hệ thống Thư viện Số Thương mại & Quản lý Bản quyền Số (Commercial Digital Library System)  
**Tên tài liệu:** `docs/markdowns-vi-v2/LIBIF-Project-Charter.md`  
**Mã dự án:** CDLS-2026  
**Phân loại:** Đóng gói sản phẩm thương mại / Phát triển theo hợp đồng cho thư viện thứ ba  
**Ngôn ngữ tài liệu:** Tiếng Việt  
**Tình trạng:** Bản phê duyệt chính thức (Approved Charter)  

---

## 1. Tổng quan Dự án (Project Overview)

Dự án **Hệ thống Thư viện Số Thương mại (CDLS)** được khởi động nhằm xây dựng một giải pháp phần mềm quản lý kho tri thức số khép kín, an toàn bản quyền và tối ưu cho quy trình vận hành của các thư viện đại học, thư viện chuyên ngành và thư viện công cộng.  
Hệ thống giải quyết bài toán chuyển đổi sách giấy sang tài sản số có khả năng tìm kiếm toàn văn (full-text search) thông qua **Tesseract OCR Engine** kết hợp **Giao diện đối soát Side-by-side dành cho Thủ thư**, đồng thời bảo vệ an toàn nội dung số thông qua **cơ chế bảo mật đa lớp (HTML5 Canvas Reader, Watermark động, Screenshot Blur, DRM và mã hóa AES-256)**.

---

## 2. Mục tiêu Kinh doanh (Business Objectives)

| STT | Mục tiêu Kinh doanh | Mô tả Chi tiết | Chỉ số Đo lường (KPIs) | Loại Thông tin |
| :--- | :--- | :--- | :--- | :--- |
| **BO-01** | **Thương mại hóa sản phẩm phần mềm** | Đóng gói sản phẩm thành công để bán bản quyền (On-premise) hoặc triển khai dịch vụ (SaaS) cho các thư viện thứ ba. | Hoàn thiện bản đóng gói sản phẩm thương mại đạt chuẩn UAT. | **EXPERT JUDGEMENT** |
| **BO-02** | **Bảo vệ tuyệt đối tài sản số** | Triệt tiêu nguy cơ rò rỉ file gốc và vi phạm bản quyền khi phục vụ độc giả từ xa. | $0$ sự cố rò rỉ đường dẫn file PDF thô ra môi trường Internet. | **FACT** |
| **BO-03** | **Tối ưu hóa năng suất vận hành thư viện** | Tự động hóa khâu OCR và chuẩn hóa quy trình kiểm duyệt dữ liệu số của thủ thư. | Giảm $70\%$ thời gian xử lý trích xuất văn bản so với làm thủ công rời rạc. | **INDUSTRY PRACTICE** |
| **BO-04** | **Nâng cao khả năng truy cập tri thức** | Cho phép độc giả tra cứu từ khóa toàn văn và đọc sách trực tuyến 24/7. | Tốc độ tìm kiếm toàn văn $< 2$ giây trên kho dữ liệu thử nghiệm. | **INDUSTRY PRACTICE** |

---

## 3. Tiêu chí Thành công (Success Criteria)

| STT | Tiêu chí Thành công | Phương pháp Kiểm tra / Đo lường | Bên Phê duyệt |
| :--- | :--- | :--- | :--- |
| **SC-01** | **Bảo mật Bản quyền $100\%$** | Không thể khai thác URL file gốc qua công cụ bắt link (IDM, F12); Watermark động nhúng chính xác ID/IP người đọc. | Trưởng nhóm An toàn Thông tin (SecOps Lead) |
| **SC-02** | **Chất lượng Dữ liệu OCR Đã duyệt** | $100\%$ tài liệu xuất bản được thủ thư đối soát trên giao diện Side-by-side UI và đạt chất lượng tri thức không có sai sót. | Thủ thư Trưởng (Lead Librarian) |
| **SC-03** | **Chấp nhận của Người dùng (UAT)** | Đạt $100\%$ kịch bản nghiệm thu UAT đối với các luồng nghiệp vụ Số hóa, Duyệt OCR, Xuất bản và Đọc an toàn. | Giám đốc Sản phẩm / Khách hàng |
| **SC-04** | **Đúng Tiến độ & Ngân sách** | Hoàn thành sản phẩm theo đúng các mốc thời gian (Milestones) và trong hạn mức ngân sách được duyệt. | Nhà đầu tư Dự án (Sponsor) |

---

## 4. Sản phẩm Bàn giao Chính (Major Deliverables)

| Mã Sản phẩm | Tên Sản phẩm Bàn giao | Mô tả Chi tiết | Người Chịu Trách nhiệm |
| :--- | :--- | :--- | :--- |
| **DEL-01** | **Tài liệu Phân tích Nghiệp vụ & Kiến trúc** | Bản mô tả yêu cầu (SRS), Thiết kế kiến trúc bảo mật DRM và Thiết kế giao diện (UI/UX). | Business Analyst (BA) Lead |
| **DEL-02** | **Phân hệ Số hóa & Tesseract OCR** | Module upload file scan, tiền xử lý ảnh và Tesseract OCR Engine tích hợp ngầm. | Backend Lead |
| **DEL-03** | **Phân hệ Kiểm duyệt OCR Side-by-side** | Giao diện màn hình kép đối soát ảnh gốc và văn bản OCR dành cho thủ thư. | Frontend Lead |
| **DEL-04** | **Phân hệ HTML5 Canvas Reader An toàn** | Trình đọc sách Web mã hóa stream, Watermark động, Screenshot Blur và Block Download. | Frontend & Security Lead |
| **DEL-05** | **Phân hệ Quản trị Phân quyền & Audit Log** | Module cấu hình hạn mức đọc đồng thời, phân quyền nhóm và ghi nhật ký hoạt động. | Backend Lead |
| **DEL-06** | **Bộ Đóng gói Triển khai & Tài liệu HDSD** | Gói cài đặt (Docker/Installer), Tài liệu hướng dẫn sử dụng và Bộ kịch bản kiểm thử UAT. | DevOps & QA Lead |

---

## 5. Các Cột mốc Chính (Major Milestones)

| Cột mốc (Milestone) | Nội dung Công việc Chính | Thời gian Dự kiến | Loại Đánh giá |
| :--- | :--- | :--- | :--- |
| **M1: Kick-off & Architecture** | Phê duyệt Điều lệ dự án, hoàn thiện SRS và Kiến trúc hệ thống. | Tháng 1 | **ESTIMATED** |
| **M2: Core OCR & Review UI** | Hoàn thành Phân hệ Số hóa, Tesseract OCR ngầm và Giao diện Side-by-side UI. | Tháng 3 | **ESTIMATED** |
| **M3: Security & Canvas Reader** | Hoàn thành HTML5 Canvas Reader, Watermark động, DRM và Chống tải file. | Tháng 5 | **ESTIMATED** |
| **M4: Integration & Internal QA** | Tích hợp toàn hệ thống, kiểm thử bảo mật (Pentest) và kiểm thử chức năng. | Tháng 6 | **ESTIMATED** |
| **M5: UAT & Product Release** | Nghiệm thu UAT với Thủ thư/Khách hàng và phát hành bản đóng gói thương mại. | Tháng 7 | **ESTIMATED** |

---

## 6. Ràng buộc Dự án (Project Constraints)

* **Ràng buộc Kỹ thuật:** Phải chạy trên các trình duyệt Web hiện đại chuẩn HTML5 (Chrome, Firefox, Edge, Safari) mà không yêu cầu người dùng cài đặt thêm plugin/extension bên ngoài.
* **Ràng buộc Công nghệ OCR:** Phải sử dụng **Tesseract OCR Engine** self-hosted trên hạ tầng máy chủ của hệ thống để tối ưu chi phí bản quyền và đảm bảo tự chủ bảo mật dữ liệu.
* **Ràng buộc Bản quyền:** Không cung cấp bất kỳ cơ chế nào cho phép xuất ngược file PDF gốc ra ngoài sau khi đã mã hóa đưa vào kho số.
* **Ràng buộc Ngân sách:** Ngân sách phát triển phải nằm trong hạn mức phê duyệt của Nhà đầu tư (Sponsor).

---

## 7. Giả định Dự án (Project Assumptions)

| Mã | Mô tả Giả định | Tác động nếu Giả định Sai | Phương pháp Xác minh |
| :--- | :--- | :--- | :--- |
| **ASN-01** | Khách hàng (Thư viện) trang bị máy quét (scanner) đạt chất lượng tối thiểu 300 DPI. | Tỷ lệ OCR nhận dạng sai cao, tăng thời gian sửa thủ công của thủ thư. | Khảo sát thực tế hạ tầng thiết bị của thư viện đối tác. |
| **ASN-02** | Đội ngũ kỹ thuật có đủ năng lực làm chủ Tesseract OCR và mã hóa HTML5 Canvas. | Tiến độ bị chậm do mất thời gian nghiên cứu công nghệ bảo mật. | Đánh giá năng lực nhân sự (Skill Matrix) trước khi Kick-off. |
| **ASN-03** | Độc giả chấp nhận việc xem sách số có nhúng Watermark động trên màn hình. | Độc giả phàn nàn về trải nghiệm thị giác khi đọc. | Thử nghiệm UI mẫu trên nhóm độc giả tập trung (Focus Group). |

---

## 8. Phân tích Các bên Liên quan (Stakeholder Analysis)

| Bên Liên quan | Vai trò | Mục tiêu Cốt lõi | Mối quan ngại Chính | Kỳ vọng Sản phẩm |
| :--- | :--- | :--- | :--- | :--- |
| **Project Sponsor** | Nhà đầu tư / Giám đốc | Thương mại hóa sản phẩm, thu hồi vốn đầu tư. | Vượt ngân sách, chậm tiến độ, khó bán sản phẩm. | Phần mềm đóng gói chất lượng cao, dễ triển khai. |
| **Library Director** | Khách hàng / Đại diện Thư viện | Hiện đại hóa thư viện, mở rộng phục vụ từ xa. | Sách số bị thất thoát, bị kiện vi phạm bản quyền. | Bảo mật tuyệt đối, minh bạch báo cáo khai thác. |
| **Librarian Lead** | Người dùng chính (Thủ thư) | Số hóa nhanh, kiểm duyệt OCR thuận tiện. | Giao diện phức tạp, tăng tải công việc hàng ngày. | Giao diện Side-by-side dễ dùng, thao tác ít click. |
| **Security Lead** | Chuyên gia An toàn thông tin | Đảm bảo hệ thống không có lỗ hổng bảo mật. | Lỗ hổng rò rỉ link file, công cụ bắt link tải. | Cơ chế DRM, Watermark động và mã hóa AES-256 vững chắc. |
| **Development Team** | Đội ngũ Phát triển Phần mềm | Xây dựng hệ thống chạy mượt mà, đúng thiết kế. | Yêu cầu tính năng thay đổi liên tục (Scope creep). | Yêu cầu rõ ràng, kiến trúc phần mềm chuẩn hóa. |

---

## 9. Ma trận RACI (Responsibility & Accountability)

> **Ghi chú ký hiệu:**  
> **R (Responsible):** Người trực tiếp thực thi.  
> **A (Accountable):** Người chịu trách nhiệm giải trình duy nhất (1 vị trí 'A' cho mỗi công việc).  
> **C (Consulted):** Người được tham vấn ý kiến chuyên môn.  
> **I (Informed):** Người nhận thông tin cập nhật.

| Hạng mục Công việc / Deliverable | Sponsor | PM | BA | Dev Lead | SecOps | QA Lead | Thủ thư / Khách hàng |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Phê duyệt Điều lệ & Ngân sách Dự án** | **A** | R | C | I | I | I | C |
| **Thu thập & Phân tích Yêu cầu (SRS)** | I | A | **R** | C | C | C | C |
| **Thiết kế Kiến trúc & Module Bảo mật DRM** | I | A | C | **R** | C | C | I |
| **Phát triển Engine Tesseract OCR & Side-by-side UI** | I | A | C | **R** | I | C | I |
| **Phát triển HTML5 Canvas Reader & Watermark** | I | A | C | **R** | C | C | I |
| **Kiểm thử Bảo mật & Chống Rò rỉ Dữ liệu** | I | A | I | C | **R** | C | I |
| **Kiểm thử Chức năng & Đảm bảo Chất lượng** | I | A | C | C | I | **R** | I |
| **Nghiệm thu UAT & Bàn giao Sản phẩm** | C | A | C | I | I | C | **R** |

---

## 10. Ma trận Mức độ Ảnh hưởng vs Quyền lợi (Stakeholder Influence vs Interest Matrix)

| Mức độ Ảnh hưởng (Influence) | Quyền lợi Thấp (Low Interest) | Quyền lợi Cao (High Interest) |
| :--- | :--- | :--- |
| **Ảnh hưởng Cao (High Influence)** | **QUẢN LÝ CHẶT CHẼ (Keep Satisfied)**<br>• Đội ngũ Pháp lý & Bảo hộ Bản quyền<br>• Cơ quan Quản lý Nhà nước về Xuất bản | **HỢP TÁC TÍCH CỰC (Manage Closely)**<br>• Nhà đầu tư Dự án (Project Sponsor)<br>• Ban Giám đốc Thư viện (Customer)<br>• Trưởng nhóm An toàn Thông tin (Security Lead) |
| **Ảnh hưởng Thấp (Low Influence)** | **GIÁM SÁT TỐI THIỂU (Monitor)**<br>• Đơn vị Cung cấp Máy quét / Phần cứng | **THÔNG TIN THƯỜNG XUYÊN (Keep Informed)**<br>• Thủ thư (Librarians - Primary Users)<br>• Độc giả (Readers - End Users) |

### Bảng Chi tiết Chiến lược Quản lý Stakeholder

| Phân nhóm Ma trận | Các Bên Liên quan | Mục tiêu Quản lý | Chiến lược Giao tiếp & Hành động |
| :--- | :--- | :--- | :--- |
| **Hợp tác Tích cực** *(High Influence, High Interest)* | Project Sponsor, Ban Giám đốc Thư viện, Security Lead | Duy trì sự ủng hộ tối đa và đồng thuận chiến lược. | Báo cáo tiến độ hàng tuần/tháng; tham vấn trực tiếp các quyết định về ngân sách, kiến trúc bảo mật và nghiệm thu. |
| **Quản lý Chặt chẽ** *(High Influence, Low Interest)* | Đội ngũ Pháp lý, Cơ quan Quản lý Bản quyền | Đảm bảo tuân thủ $100\%$ pháp lý, tránh nguy cơ đình chỉ. | Tham vấn về khung pháp lý bản quyền số, cập nhật các cam kết bảo vệ dữ liệu theo Luật Sở hữu Trí tuệ. |
| **Thông tin Thường xuyên** *(Low Influence, High Interest)* | Thủ thư (Librarians), Độc giả (Readers) | Đảm bảo sản phẩm đáp ứng tốt nhu cầu sử dụng thực tế. | Tổ chức các buổi demo UI/UX, thử nghiệm giao diện Side-by-side và khảo sát ý kiến độc giả định kỳ. |
| **Giám sát Tối thiểu** *(Low Influence, Low Interest)* | Nhà cung cấp thiết bị máy quét (Scanner Vendors) | Đảm bảo tương thích kỹ thuật hạ tầng đầu vào. | Theo dõi định dạng file kết xuất ảnh quét (300 DPI, PDF/Image) để đảm bảo đầu vào chuẩn cho Tesseract OCR. |

---

## 11. Kế hoạch Giao tiếp & Báo cáo (Communication Plan)

| Loại Giao tiếp | Mục đích | Tần suất | Hình thức / Kênh | Người Chủ trì | Thành phần Tham gia |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Daily Standup** | Cập nhật tiến độ kỹ thuật, tháo gỡ khó khăn hàng ngày. | Hàng ngày (15 phút) | Trực tiếp / MS Teams | Scrum Master / Dev Lead | Đội ngũ Phát triển, QA |
| **Weekly Progress Meeting** | Báo cáo tiến độ mốc, quản lý rủi ro và chi phí. | Hàng tuần | Hợp trực tuyến | Project Manager (PM) | PM, BA Leads, Dev Leads, QA Lead |
| **Sponsor Steering Meeting** | Báo cáo chiến lược, xin phê duyệt điều chỉnh lớn. | Hàng tháng | Hợp trực tiếp / Hybrid | Project Manager | Sponsor, Ban Giám đốc, PM |
| **User Feedback Session** | Demo tính năng và thu thập phản hồi người dùng. | Theo đợt Release | Demo trực tiếp | BA Lead | Thủ thư mẫu, Độc giả đại diện |
| **Ad-hoc Security Review** | Thẩm định các phát hiện lỗ hổng an toàn thông tin. | Khi phát sinh | Hợp đột xuất | Security Lead | SecOps, PM, Dev Lead |

---

## 12. Quyền hạn Phê duyệt (Approval Authority)

| Phạm vi Quyết định | Người có Quyền hạn Phê duyệt Duy nhất | Hạn mức / Điều kiện |
| :--- | :--- | :--- |
| **Phê duyệt Điều lệ & Thay đổi Ngân sách** | **Project Sponsor** | Thay đổi ngân sách $> 5\%$ hoặc thay đổi mục tiêu chiến lược. |
| **Phê duyệt Kế hoạch & Scope Change** | **Project Manager (PM)** | Thay đổi phạm vi tính năng không làm chậm tiến độ chung quá 1 tuần. |
| **Phê duyệt Kiến trúc Kỹ thuật & Công nghệ** | **Software Architect / Dev Lead** | Lựa chọn thư viện, công nghệ mã hóa và cấu trúc dữ liệu. |
| **Phê duyệt An toàn Thông tin & DRM** | **Security Lead (SecOps)** | Quyết định cơ chế bảo mật đủ điều kiện vận hành thương mại. |
| **Phê duyệt Nghiệm thu Sản phẩm (UAT)** | **Giám đốc Thư viện / Khách hàng** | Phê duyệt chính thức sản phẩm bàn giao đưa vào vận hành. |

---
> **Xác nhận Phê duyệt:** Tệp Điều lệ Dự án (LIBIF-Project-Charter.md) là văn bản pháp lý nội bộ chính thức xác lập quyền hạn của Giám đốc Dự án và cam kết nguồn lực từ Nhà đầu tư.
