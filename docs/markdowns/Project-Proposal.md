# PROJECT PROPOSAL
## LIBIF — Hệ thống Số hóa Thư viện Thông minh
### *Intelligent Library Digitization & Document Management System*

---

> **Phân loại tài liệu:** Đề xuất Dự án (Project Proposal)
> **Trạng thái:** Bản nháp v2.0
> **Ngày lập:** 19 tháng 07 năm 2026
> **Nhóm phát triển:** 6 sinh viên năm 4, Khoa Công nghệ Thông tin — HCMUS
> **Hỗ trợ kỹ thuật:** Antigravity AI Assistant · GitHub Copilot

---

## MỤC LỤC

1. [Business Case — Câu chuyện Thực tế](#1-business-case)
2. [Tại sao Vấn đề này Quan trọng (Why)](#2-tại-sao-vấn-đề-này-quan-trọng)
3. [Phân tích Các bên Liên quan (Stakeholders)](#3-phân-tích-các-bên-liên-quan)
4. [Đánh giá Khả thi (Feasibility)](#4-đánh-giá-khả-thi)
5. [Lộ trình Dự án (Timeline)](#5-lộ-trình-dự-án)
6. [Ngân sách Dự án (Project Budget)](#6-ngân-sách-dự-án)
7. [Kỳ vọng Tác động Kinh doanh](#7-kỳ-vọng-tác-động-kinh-doanh)
8. [Kết luận](#8-kết-luận)


> *Chi tiết về phạm vi tính năng, kiến trúc kỹ thuật và yêu cầu người dùng được trình bày trong tài liệu **Business Requirements Document (BRD)** và **User Requirements Document (URD)** đính kèm.*

---

## 1. Business Case

### Câu chuyện: Một buổi chiều tại Thư viện Khoa Công nghệ Thông tin

Chị Nguyễn Thị Lan, thủ thư duy nhất của một khoa CNTT tại một trường đại học ở TP.HCM, bắt đầu ca làm việc lúc 8 giờ sáng. Trên bàn là chồng sách vừa được tặng — 47 đầu sách chuyên ngành mới, tổng trị giá khoảng **35 triệu đồng**. Nhiệm vụ của chị hôm nay: scan, đặt tên file, ghi vào Excel, rồi chờ sinh viên nhắn Zalo để gửi file từng người một.

Lúc 2 giờ chiều, anh Minh — sinh viên năm 3 — nhắn tin hỏi mượn cuốn *Giải tích số* để chuẩn bị cho bài thi tuần sau. Chị Lan mở máy tìm kiếm trong 23 phút, phát hiện file bị lưu nhầm thư mục, rồi gửi qua email. File PDF đó — không có cơ chế bảo vệ nào — sau đó lan ra cả lớp qua nhóm Telegram trong vòng 24 giờ.

**Đây không phải lỗi của ai.** Đây là hệ quả tất yếu của một quy trình được xây dựng cho thế giới trước khi có internet, đang phải vận hành trong thế giới năm 2026.

**LIBIF** được đề xuất để thay thế toàn bộ vòng lặp thủ công đó: tự động hóa OCR, tập trung hóa kho tài liệu số, và trao cho sinh viên khả năng tự tra cứu — bảo mật, tức thì, 24/7.

---

## 2. Tại sao Vấn đề này Quan trọng

### 2.1 Vấn đề Có thật và Đủ Đau

Quy trình quản lý tài liệu số hóa thủ công hiện tại gây ra **ba loại tổn thất** có thể đo lường được:

**① Tổn thất Nhân lực — Thủ thư bị kẹt trong công việc có giá trị thấp**

Một thủ thư xử lý thủ công một đầu sách (scan → đặt tên → nhập Excel → phản hồi sinh viên) mất trung bình 45–60 phút. Với kho 500 đầu sách cần số hóa, điều này tương đương **375–500 giờ công** — tức hơn **46 ngày làm việc toàn thời gian** — chỉ để hoàn tất việc nhập liệu. Trong thời gian đó, thủ thư không thể làm công tác quản lý tri thức, tư vấn hay phát triển chuyên môn.

**② Tổn thất Tiếp cận — Sinh viên không thể học khi cần**

Thời gian trung bình để sinh viên tiếp cận được một tài liệu đã số hóa là **24–72 giờ** — tính từ lúc nhắn tin đến lúc nhận được file, phụ thuộc hoàn toàn vào lịch làm việc của thủ thư. Với nhịp học tập hiện đại (bài kiểm tra đột xuất, deadline ngắn), rào cản thời gian này trực tiếp làm giảm chất lượng học tập. Nghiên cứu từ hàng trăm nghìn sinh viên tại Mỹ cho thấy sinh viên sử dụng tài nguyên thư viện số thường xuyên có GPA cao hơn và tỷ lệ tốt nghiệp tốt hơn đáng kể.

**③ Tổn thất Bản quyền — Vi phạm xảy ra ngoài tầm kiểm soát**

Khi file PDF được gửi qua email hay Zalo, mọi cơ chế kiểm soát phân phối đều mất hiệu lực. Tổ chức không có dữ liệu về ai đang đọc gì, file đã lan đến đâu, và tài liệu nào đang bị phân phối trái phép. Đây là rủi ro pháp lý tiềm tàng và là vi phạm trực tiếp nghĩa vụ bảo hộ bản quyền mà tổ chức đã cam kết với nhà xuất bản.

### 2.2 Bối cảnh Toàn cầu Xác nhận Tầm quan trọng

Số hóa thư viện không phải xu hướng — đây đã là tiêu chuẩn tối thiểu của các cơ sở giáo dục hiện đại. UNESCO xác nhận hàng triệu tài liệu đang đứng trước nguy cơ hư hỏng vật lý không thể phục hồi nếu không được số hóa kịp thời. Công nghệ OCR đã được chứng minh là xương sống của mọi dự án thư viện số hiện đại, cho phép biến ảnh tĩnh thành dữ liệu có thể tìm kiếm toàn văn.

### 2.3 Tại sao Bây giờ, Tại sao LIBIF

Hai điều kiện vừa hội tụ làm cho thời điểm này trở nên lý tưởng:

1. **Công nghệ OCR tiếng Việt vừa chín muồi.** VietOCR (kiến trúc Transformer) và PaddleOCR đã đạt độ chính xác 95–98% trên tiếng Việt, vượt xa ngưỡng thực dụng. Ba năm trước, độ chính xác này chưa đủ tin cậy cho môi trường sản xuất.

2. **Chi phí triển khai đã giảm đến mức khả thi với ngân sách giáo dục.** Hạ tầng cloud tối thiểu để vận hành một hệ thống như LIBIF nay chỉ tốn **~1.200.000 – 2.000.000 VNĐ/tháng** — tương đương chi phí in ấn vật phẩm truyền thông hằng tháng của một khoa trung bình.

Nếu không hành động ngay, tổ chức sẽ tiếp tục chi trả chi phí ẩn (hidden cost) mỗi tháng dưới dạng thời gian thủ thư bị lãng phí, sinh viên không tiếp cận được tài liệu, và rủi ro pháp lý bản quyền tích lũy — trong khi giải pháp đã sẵn sàng và chi phí triển khai thấp hơn bao giờ hết.

### 2.4 Tại sao Không Tiếp tục Dùng Google Drive / Email

| Vấn đề | Google Drive / Email | LIBIF |
|---|---|---|
| Kiểm soát phân phối | ❌ File có thể sao chép và phát tán tự do | ✅ Đọc trực tuyến, không tải được file gốc |
| Tìm kiếm toàn văn | ❌ Chỉ tìm theo tên file | ✅ Tìm theo nội dung bên trong tài liệu |
| Tốc độ tiếp cận | ❌ Phụ thuộc thủ thư (24–72 giờ) | ✅ Tức thì, 24/7, tự phục vụ |
| Báo cáo thống kê | ❌ Không có dữ liệu sử dụng | ✅ Dashboard real-time cho ban quản lý |
| Tuân thủ bản quyền | ❌ Không kiểm soát được | ✅ Có cơ chế kỹ thuật bảo vệ |

---

## 3. Phân tích Các bên Liên quan

### 3.1 Bản đồ Stakeholders

| Stakeholder | Vai trò trong Dự án | Nỗi đau Hiện tại | Lợi ích Kỳ vọng |
|---|---|---|---|
| **Ban Quản lý Thư viện** | Chủ đầu tư nội bộ, người phê duyệt | Thiếu dữ liệu báo cáo, không biết tài nguyên được dùng như thế nào | Dashboard real-time, số liệu chứng minh ROI với ban giám hiệu |
| **Thủ thư** | Người dùng hằng ngày, người thực thi | Bị kẹt trong công việc thủ công lặp đi lặp lại, căng thẳng khi sinh viên thúc giục | Giảm 70% thời gian nhập liệu, hệ thống giao tiếp với sinh viên tự động |
| **Sinh viên & Giảng viên** | Người hưởng lợi chính | Chờ đợi 24–72 giờ, không biết tài liệu nào đã có số | Tự tra cứu và đọc tức thì, 24/7 |
| **Ban Giám hiệu** | Phê duyệt chiến lược & ngân sách | Áp lực chuyển đổi số, thiếu giải pháp cụ thể khả thi | Hệ thống cụ thể hóa cam kết chuyển đổi số, tăng uy tín học thuật |
| **Nhóm CNTT nội bộ** | Vận hành & bảo trì | Bị gọi xử lý sự cố không có hệ thống | Kiến trúc chuẩn hóa, tài liệu kỹ thuật đầy đủ, dễ bảo trì |

### 3.2 Điều kiện Thành công theo Từng Stakeholder

Dự án chỉ thành công khi **cả ba nhóm cốt lục** đều được thỏa mãn đồng thời:

- **Thủ thư không kháng cự:** UI phải đủ đơn giản để thủ thư không cần đào tạo kỹ thuật. Nếu hệ thống phức tạp hơn Excel hiện tại, thủ thư sẽ quay lại quy trình cũ.
- **Sinh viên tự phục vụ được:** Nếu sinh viên vẫn cần liên hệ thủ thư để mở được tài liệu, hệ thống thất bại về giá trị cốt lõi.
- **Ban quản lý thấy số liệu:** Nếu không có dashboard và báo cáo ROI thực tế để chứng minh hiệu quả đầu tư với ban giám hiệu, dự án sẽ khó được tiếp tục cấp ngân sách duy trì.

---

## 4. Đánh giá Khả thi (Feasibility)

### 4.1 Khả thi về mặt Kỹ thuật (Technical Feasibility)
* **Công nghệ OCR tiếng Việt:** Các thư viện mã nguồn mở hiện đại như PaddleOCR và VietOCR (dựa trên kiến trúc Transformer) đã đạt độ chính xác **95 - 98%** đối với văn bản tiếng Việt có dấu. Điều này đảm bảo nội dung sách sau khi scan sẽ được trích xuất chính xác để phục vụ cho việc tìm kiếm toàn văn (Full-text Search).
* **Bảo mật tài liệu (DRM nhẹ):** Việc tích hợp trình đọc Canvas Reader kết hợp với AWS S3 Presigned URLs có thời gian hết hạn cực ngắn (dưới 1 phút) giúp ngăn chặn hiệu quả việc tải xuống trực tiếp file PDF gốc. Kỹ thuật đóng dấu chìm động (Dynamic Watermarking) vẽ trực tiếp MSSV và IP của người đọc lên Canvas là hoàn toàn khả thi bằng JavaScript ở Frontend mà không làm tăng tải của máy chủ.
* **Hạ tầng Cloud phổ thông:** Hệ thống sử dụng các dịch vụ tiêu chuẩn của AWS (EC2, S3) và cơ sở dữ liệu phổ biến (PostgreSQL, Redis), giúp đội ngũ kỹ thuật của trường dễ dàng tiếp quản, bảo trì và vận hành lâu dài.

### 4.2 Khả thi về mặt Tài chính (Financial Feasibility)
* **Chi phí phát triển tối ưu:** Với quy mô đội ngũ 6 nhân sự là sinh viên năm cuối khoa CNTT kết hợp các trợ lý lập trình AI (GitHub Copilot), tổng ngân sách phát triển MVP chỉ khoảng **90.500.000 VNĐ** (chi phí một lần duy nhất).
* **Chi phí vận hành siêu rẻ:** Chi phí hạ tầng cloud thực tế chỉ khoảng **2.370.000 VNĐ/tháng** (khoảng **28.440.000 VNĐ/năm**).
* **Tỷ suất hoàn vốn (ROI) rõ ràng:** Quy trình thủ công hiện tại làm lãng phí khoảng 46 ngày làm việc của thủ thư mỗi năm (tương đương khoảng 15-20 triệu VNĐ tiền lương lãng phí) và gây chậm trễ hàng ngàn giờ học tập của sinh viên. LIBIF giúp tiết kiệm 70% thời gian của thủ thư và loại bỏ hoàn toàn thời gian chờ đợi của sinh viên, mang lại giá trị kinh tế lớn hơn nhiều so với chi phí vận hành.

### 4.3 Khả thi về mặt Vận hành & Con người (Operational Feasibility)
* **Giao diện thân thiện và dễ dùng:** Giao diện của thủ thư được tối giản hóa tối đa (chỉ kéo thả file và bấm duyệt), loại bỏ hoàn toàn các thao tác nhập liệu phức tạp. Giao diện của sinh viên giống như một tủ sách số cá nhân, dễ dàng tìm kiếm và đọc ngay trên mọi thiết bị di động hay máy tính.
* **Quy trình tự động hóa khép kín:** Sinh viên tự tra cứu và tự mượn đọc 24/7 mà không cần sự can thiệp của thủ thư, giải phóng thủ thư khỏi công việc hỗ trợ lặp đi lặp lại.

---

### 4.4 So sánh với các giải pháp kết hợp có sẵn (No-code / Low-code)

Khi xem xét tính khả thi của việc tự xây dựng LIBIF, chúng tôi đã đặt lên bàn cân so sánh với việc kết hợp các công cụ sẵn có trên thị trường nhằm tối ưu hóa chi phí:

| Tiêu chí | LIBIF (Tự phát triển) | Phương án 1: Nextcloud + Collabora + Elasticsearch | Phương án 2: Paperless-ngx + Directus + PDF.js | Phương án 3: Google Drive Restricted + Apps Script |
| :--- | :--- | :--- | :--- | :--- |
| **Bảo mật DRM chống tải file** | 🟢 **Khá tốt** (Canvas Reader + Presigned URL + Watermark động) | 🟢 **Rất tốt** (Stream Pixels + Watermark động từ Collabora) | 🔴 **Yếu** (Dễ bypass qua Network tab / F12 của PDF.js) | 🔴 **Yếu** (Dễ bypass bằng các extension tải Drive chặn download) |
| **Độ chính xác OCR tiếng Việt** | 🟢 **Rất cao** (Tích hợp PaddleOCR/VietOCR tối ưu riêng) | 🟡 **Khá** (Dùng Tesseract mặc định của Nextcloud) | 🟡 **Khá** (Dùng Tesseract mặc định của Paperless) | 🟢 **Rất cao** (Do chạy qua công cụ OCRmyPDF thủ công trước) |
| **Yêu cầu cấu hình Server** | 🟢 **Thấp** (Chỉ cần RAM 4GB chạy EC2 giá rẻ) | 🔴 **Rất cao** (Đòi hỏi RAM $\ge$ 8GB - 16GB để chạy Collabora) | 🟡 **Trung bình** (Đòi hỏi RAM $\ge$ 4GB) | 🟢 **Không cần** (Hoàn toàn chạy trên hạ tầng Google Cloud free) |
| **Trải nghiệm người dùng** | 🟢 **Tối ưu** (Thiết kế chuẩn cổng thư viện số HCMUS) | 🟡 **Trung bình** (Giao diện thuần dạng quản lý thư mục tệp tin) | 🟢 **Tốt** (Giao diện portal hiện đại) | 🔴 **Kém** (Phải tương tác qua Sheets và nhận mail rời rạc) |
| **Chi phí & Công sức duy trì** | 🟢 **Thấp** (Code đóng gói Docker, dễ bảo trì lâu dài) | 🔴 **Cao** (Phải tự quản trị hệ thống server Nextcloud phức tạp) | 🟡 **Trung bình** (Cần duy trì kết nối API giữa hai hệ thống độc lập) | 🟢 **Thấp** (Nhưng dễ gặp lỗi giới hạn quota gửi mail của Google) |

**Kết luận:** Mặc dù các phương án kết hợp (đặc biệt là Google Drive + Apps Script) có chi phí ban đầu bằng 0, chúng lại bộc lộ điểm yếu lớn về khả năng **bảo mật DRM** (dễ bị sinh viên bypass để tải file gốc) và **trải nghiệm người dùng** rời rạc. Việc đầu tư xây dựng LIBIF là phương án tối ưu nhất để đảm bảo cân bằng giữa tính bảo mật bản quyền, chất lượng OCR tiếng Việt và tính dễ dàng trong vận hành của thủ thư khoa.

---

## 5. Lộ trình Dự án

Lộ trình thực hiện trong **8 tuần** được chia nhỏ thành **4 giai đoạn cụ thể**, đảm bảo tính tuần tự, quản lý rủi ro tốt và tích hợp sớm.

### 5.1 Các Giai đoạn Thực hiện (Project Stages)

#### 📅 Giai đoạn 1: Khởi động & Thiết kế Kiến trúc (Tuần 1 – Tuần 2)
*   **Mục tiêu:** Thống nhất yêu cầu chi tiết, thiết kế kiến trúc hệ thống và chuẩn bị môi trường phát triển.
*   **Công việc chi tiết:**
    *   Phân tích yêu cầu chi tiết (SRS), thống nhất sơ đồ dữ liệu (Database Schema).
    *   Thiết kế API Contract giữa Frontend và Backend (Mở mockup API để Frontend làm việc độc lập).
    *   DevOps (Team Lead đảm nhận): Thiết lập hạ tầng Cloud phát triển, cài đặt Docker và cấu hình luồng CI/CD (GitHub Actions) tự động deploy bản kiểm thử.
*   **Sản phẩm bàn giao (Deliverable):** Tài liệu đặc tả API, Bản vẽ kiến trúc hệ thống, Môi trường Dev/Staging chạy ổn định với CI/CD.

#### 📅 Giai đoạn 2: Phát triển Core MVP & Tích hợp OCR (Tuần 3 – Tuần 5)
*   **Mục tiêu:** Phát triển song song Frontend, Backend và OCR pipeline; kết nối các thành phần chính của hệ thống.
*   **Công việc chi tiết:**
    *   **Backend:** Xây dựng Module Authentication, Upload tài liệu bảo mật lên AWS S3, API Catalog (Quản lý danh mục sách) tích hợp tự động điền metadata qua mã ISBN.
    *   **Frontend:** Phát triển UI/UX theo Design System, xây dựng Trang Portal cho thủ thư (Admin Portal) để quản lý tải lên và duyệt kết quả OCR.
    *   **OCR Pipeline (Backend & OCR Dev):** Tích hợp engine OCR (VietOCR/PaddleOCR), tối ưu hóa hàng đợi xử lý nền (Background Queue với Redis), xây dựng cơ chế lưu vết và lập chỉ mục nội dung văn bản tìm kiếm toàn văn (Full-text Search Index).
*   **Sản phẩm bàn giao (Deliverable):** Phiên bản MVP chạy thử nghiệm nội bộ, cho phép upload sách, tự động chạy OCR, và hiển thị giao diện duyệt cơ bản.

#### 📅 Giai đoạn 3: Kiểm thử, Tối ưu & Đánh giá UAT (Tuần 6 – Tuần 7)
*   **Mục tiêu:** Nâng cao độ chính xác của OCR, kiểm tra lỗ hổng bảo mật và lấy ý kiến phản hồi thực tế từ người dùng.
*   **Công việc chi tiết:**
    *   **Bảo mật Reader Portal (Frontend & PM):** Xây dựng trình đọc tài liệu trực tuyến (Canvas Reader) ngăn chặn tải file PDF trực tiếp, chặn copy-paste bằng kỹ thuật và bảo mật đường dẫn tệp thông qua AWS Presigned URLs.
    *   **Kiểm thử (QA/Tester):** Thực hiện kiểm thử tích hợp (Integration Testing), kiểm thử hiệu năng (Stress test với k6), kiểm thử độ chính xác của bộ OCR (yêu cầu độ chính xác tiếng Việt ≥ 93%).
    *   **UAT (User Acceptance Testing):** Đưa hệ thống cho Thủ thư và nhóm 5 sinh viên dùng thử thực tế để phát hiện lỗi trải nghiệm người dùng (UX) và thu thập danh sách lỗi (Bug list).
*   **Sản phẩm bàn giao (Deliverable):** Bản báo cáo kiểm thử chất lượng, kết quả UAT có chữ ký xác nhận của thủ thư, hệ thống chạy trơn tru trên môi trường Staging.

#### 📅 Giai đoạn 4: Đóng gói, Bàn giao & Triển khai (Tuần 8)
*   **Mục tiêu:** Triển khai hệ thống lên môi trường chạy thực tế (Production), chuyển giao tài liệu hướng dẫn sử dụng và đóng dự án.
*   **Công việc chi tiết:**
    *   Hoàn thiện sửa các lỗi phát hiện trong quá trình UAT.
    *   Deploy hệ thống lên môi trường Production (AWS Cloud chính thức).
    *   Đóng gói mã nguồn, viết tài liệu hướng dẫn vận hành cho kỹ thuật viên và hướng dẫn sử dụng (User Manual) cho thủ thư.
    *   Bàn giao tài khoản quản trị và tổ chức buổi hướng dẫn vận hành trực tiếp.
*   **Sản phẩm bàn giao (Deliverable):** Hệ thống chính thức chạy trên tên miền nhà trường, Tài liệu hướng dẫn sử dụng, Mã nguồn bàn giao đầy đủ trên GitHub.

---

### 5.2 Gantt Chart Điều chỉnh (6 Nhân sự)

```
VAI TRO / CONG VIEC             │  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │
────────────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
PM / System Architect (Lead)    │     │     │     │     │     │     │     │     │
  Phân tích & Thiết kế Kiến trúc│█████│█████│     │     │     │     │     │     │
  Thiết lập CI/CD & Cloud       │█████│█████│     │     │     │     │     │     │
  Phát triển Core Auth & API    │     │░░░░░│█████│█████│     │     │     │     │
  Triển khai Production & GD    │     │     │     │     │     │     │█████│█████│
Backend Engineer                │     │     │     │     │     │     │     │     │
  Hỗ trợ thiết kế DB & API      │█████│█████│     │     │     │     │     │     │
  Phát triển Catalog & AWS S3   │     │█████│█████│█████│     │     │     │     │
  Tích hợp Security Reader API │     │     │     │░░░░░│█████│█████│     │     │
  Hỗ trợ Sửa lỗi Backend        │     │     │     │     │     │░░░░░│█████│█████│
AI / OCR Specialist             │     │     │     │     │     │     │     │     │
  Nghiên cứu & Fine-tune Model  │█████│█████│     │     │     │     │     │     │
  Thiết lập OCR Worker Pipeline │     │░░░░░│█████│█████│     │     │     │     │
  Full-text Search Indexing     │     │     │     │█████│█████│     │     │     │
  Tối ưu OCR Accuracy & Sửa lỗi │     │     │     │     │░░░░░│█████│█████│     │
Frontend Engineer               │     │     │     │     │     │     │     │     │
  Xây dựng Admin Catalog Portal │     │█████│█████│█████│     │     │     │     │
  Xây dựng DRM Canvas Reader    │     │     │     │░░░░░│█████│█████│     │     │
  Giao diện Dashboard Management│     │     │     │     │     │█████│█████│     │
  Sửa lỗi Frontend sau UAT      │     │     │     │     │     │     │░░░░░│█████│
UI/UX Designer & Tech Writer    │     │     │     │     │     │     │     │     │
  Thiết kế UI Mockups & Flows   │█████│█████│     │     │     │     │     │     │
  Thiết kế Design System & Icons│     │█████│█████│     │     │     │     │     │
  Viết User Manual & Tài liệu GD│     │     │     │     │█████│█████│█████│█████│
QA / Tester                     │     │     │     │     │     │     │     │     │
  Viết Test Plan & Test Case    │     │     │█████│█████│     │     │     │     │
  Kiểm thử Chức năng & OCR      │     │     │     │     │█████│█████│     │     │
  Tổ chức UAT & Security Test   │     │     │     │     │     │░░░░░│█████│█████│

█ = Đang thực hiện    ░ = Chuẩn bị / Song song
```

---

### 5.3 Các Mốc Quan trọng (Milestones)

| Milestone | Tuần | Deliverable chính | Ai xác nhận |
|---|---|---|---|
| **M0** — Khởi động | 1 | Tài liệu thiết kế database và API contract được duyệt; môi trường dev sẵn sàng | PM (Lead) |
| **M1** — Base Framework | 3 | Core API (Auth, Upload) và Frontend base layout chạy ổn định | PM (Lead) |
| **M2** — OCR & Search | 5 | Pipeline VietOCR tự động hoàn thành; Tìm kiếm toàn văn (Full-text) hoạt động | PM + AI Specialist |
| **M3** — Security Reader | 6 | Bảo mật file (Canvas Reader + Presigned URLs) tích hợp thành công vào Frontend | PM + Frontend Dev |
| **M4** — UAT Ready | 7 | Bản phát hành thử nghiệm UAT hoàn tất; Thủ thư và sinh viên đánh giá | Thủ thư + QA |
| **M5** — Launch & Handover | 8 | Production triển khai chính thức; tài liệu hướng dẫn và mã nguồn bàn giao đầy đủ | Ban Quản lý |

---

## 6. Ngân sách Dự án

Ngân sách dự án được chia thành hai phần rõ rệt: **Ngân sách Phát triển (Một lần)** phục vụ cho quá trình xây dựng hệ thống trong 8 tuần, và **Ngân sách Vận hành (Hằng năm)** để duy trì hệ thống chạy ổn định sau khi bàn giao.

Cơ cấu nhân sự gồm **6 thành viên** (sinh viên năm 4 Khoa CNTT - HCMUS) với các vai trò chuyên môn hóa nhằm đảm bảo chất lượng kỹ thuật cao nhất và tiến độ dự án.

### 6.1 Ngân sách Phát triển (One-time Development Budget)

Ngân sách này được phân bổ cho 8 tuần xây dựng MVP bởi đội ngũ 6 thành viên kết hợp công cụ AI trợ giúp:

**1. Nhân sự (8 tuần phát triển):**

| Vai trò | Số lượng | Mức hỗ trợ / tháng | Tổng cộng (8 tuần / 2 tháng) | Mô tả công việc |
|---|---|---|---|---|
| PM / System Architect (Lead) | 1 | 9.000.000 VNĐ | **18.000.000 VNĐ** | Lập kế hoạch, quản lý tiến độ, thiết lập CI/CD, thiết kế database, phát triển core Auth/API |
| Backend Engineer | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** | Phát triển API Catalog, quản lý lưu trữ S3, tích hợp đường dẫn bảo mật Presigned URLs |
| AI / OCR Specialist | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** | Fine-tune engine VietOCR/PaddleOCR, xây dựng OCR Worker Pipeline, lập chỉ mục Full-text Search |
| Frontend Engineer | 1 | 7.500.000 VNĐ | **15.000.000 VNĐ** | Phát triển Web Portal (Admin & Reader), trình đọc DRM Canvas Reader, tích hợp API |
| UI/UX Designer & Tech Writer | 1 | 6.000.000 VNĐ | **12.000.000 VNĐ** | Thiết kế Wireframe/UI, xây dựng Design System, viết User Manual và tài liệu bàn giao |
| QA / Tester | 1 | 5.000.000 VNĐ | **10.000.000 VNĐ** | Viết Test Plan/Test Case, kiểm thử chức năng, đánh giá độ chính xác OCR, hỗ trợ UAT |
| **Cộng nhân sự** | **6** | | **85.000.000 VNĐ** | |

**2. Công cụ & Hạ tầng phục vụ phát triển:**

| Hạng mục | Giải pháp | Tính toán | Tổng cộng (8 tuần) |
|---|---|---|---|
| Phí trợ lý AI | GitHub Copilot Pro | 250.000 VNĐ/tháng × 6 người × 2 tháng | **3.000.000 VNĐ** |
| Hạ tầng Dev Cloud | AWS EC2 & S3 (Spot Instances) | Tiết kiệm ~65% giá chạy thử nghiệm | **2.500.000 VNĐ** |
| **Cộng công cụ** | | | **5.500.000 VNĐ** |

**👉 Tổng ngân sách phát triển:** **90.500.000 VNĐ**

---

### 6.2 Ngân sách Vận hành Hằng năm (Recurring Operating Budget)

Ngân sách thường xuyên cần cấp phát để duy trì hệ thống chạy ổn định sau khi đã bàn giao sản phẩm.

**1. Hạ tầng Cloud (AWS On-Demand, us-east-1):**

| Server / Dịch vụ | Cấu hình | Chi phí/tháng |
|---|---|---|
| **Web Server** | AWS EC2 t3.medium (2 vCPU, 4 GB RAM) | **770.000 VNĐ** |
| **OCR Worker** | AWS EC2 t3.large (2 vCPU, 8 GB RAM) | **1.540.000 VNĐ** |
| **Object Storage** | AWS S3 Standard (50 GB lưu trữ ban đầu) | **30.000 VNĐ** |
| **Redis Queue** | Redis Cloud free tier (30 MB) | **0 VNĐ** |
| **Domain & SSL** | Namecheap + Let’s Encrypt | **30.000 VNĐ** |
| **Cộng hạ tầng/tháng**| | **2.370.000 VNĐ** |

**2. Bản quyền & Bảo trì:**

| Hạng mục | Phương án | Chi phí/năm |
|---|---|---|
| Bản quyền AI vận hành | GitHub Copilot Pro (6 người × 250.000 VNĐ × 12 tháng) | **18.000.000 VNĐ** |
| Công tác bảo trì | Sửa lỗi, backup, hỗ trợ vận hành (10 giờ/tháng × 250.000 VNĐ/giờ) | **30.000.000 VNĐ** |

**👉 Tổng ngân sách vận hành năm đầu:** **76.440.000 VNĐ/năm**
*(Trong đó, phần chi phí cứng cho hạ tầng Cloud là **28.440.000 VNĐ/năm**).*

---

### 6.3 Dự phòng Ngân sách (Contingency Reserve)

Khuyến nghị duy trì quỹ dự phòng **15%** tính trên tổng ngân sách phát triển và vận hành hằng năm để xử lý các rủi ro kỹ thuật hoặc tăng tải ngoài dự kiến:
*   Dự phòng phát triển: **13.575.000 VNĐ** (chỉ sử dụng khi kéo dài timeline phát triển).
*   Dự phòng vận hành: **11.466.000 VNĐ/năm** (dùng khi lượng sách số hóa vượt 50 GB dự kiến ban đầu hoặc lưu lượng OCR tăng cao).

---

## 7. Kỳ vọng Tác động Kinh doanh

### 7.1 Tác động Đo lường được (3–6 Tháng Sau Triển khai)

| Chỉ số | Trước | Sau | Cơ sở |
|---|---|---|---|
| Thời gian xử lý 1 đầu sách | 45–60 phút | ≤10–15 phút | Ước tính nội bộ; so sánh OCR tự động vs. nhập tay |
| Thời gian sinh viên tiếp cận tài liệu | 24–72 giờ | <5 giây | Benchmark hệ thống tìm kiếm |
| File PDF rò rỉ ngoài kiểm soát | Không kiểm soát được | 0 (về nguyên tắc kỹ thuật) | Presigned URL + Canvas rendering |
| Dữ liệu thống kê sử dụng tài liệu | 0 | Real-time dashboard | Thiết kế hệ thống |
| Số lượt truy cập đồng thời | Không hỗ trợ | ≥200 concurrent users | K6 performance test |

### 7.2 Tác động Dài hạn (6–18 Tháng)

Dựa trên kinh nghiệm từ các dự án tương tự tại Đông Nam Á và Việt Nam:

- **Tăng tần suất sử dụng tài nguyên thư viện** bởi sinh viên — từ đó hỗ trợ kết quả học tập và tỷ lệ tốt nghiệp.
- **Nền tảng dữ liệu** để nghiên cứu Digital Humanities và phân tích xu hướng học thuật trong tương lai.
- **Đóng góp vào mục tiêu Chuyển đổi số Quốc gia** của Việt Nam trong lĩnh vực giáo dục.
- **Mô hình nhân rộng** cho các khoa, trường và tổ chức giáo dục khác trong hệ sinh thái đại học Việt Nam.

### 7.3 Lợi thế Cạnh tranh / Moat

LIBIF được tối ưu hóa đặc biệt cho **tiếng Việt và bối cảnh giáo dục Việt Nam** — điều mà các giải pháp quốc tế (KOHA, DSpace, Alma) không làm được mà không cần tùy chỉnh tốn kém. Đây là lợi thế khó sao chép nhanh: tích hợp VietOCR được tinh chỉnh, giao diện tiếng Việt native, và hiểu biết về quy trình thủ công đặc thù của thư viện trường đại học Việt Nam.

### 7.4 Phân tích Đối thủ Cạnh tranh (Competitor Analysis)

Để định vị rõ nét, LIBIF được so sánh với 3 nhóm giải pháp đối thủ hiện tại trên thị trường:

| Tiêu chí so sánh | Thư viện số truyền thống (Koha, DSpace, Vebrary) | Quản lý tài liệu doanh nghiệp (DocEye, Paperless-ngx) | Học liệu điện tử quốc tế (VitalSource, Kortext) | LIBIF (Đề xuất) |
| :--- | :--- | :--- | :--- | :--- |
| **Mục tiêu thiết kế** | Quản trị nghiệp vụ thư viện vật lý và số | Lưu trữ văn bản hành chính, hóa đơn doanh nghiệp | Phân phối giáo trình có bản quyền toàn cầu | Số hóa học liệu cấp Khoa/Trường tối giản |
| **Khả năng tự động OCR tiếng Việt** | ❌ Không tích hợp sẵn (Phải xử lý thủ công bên ngoài) | 🟡 Trung bình (Tesseract đa ngôn ngữ, dễ lỗi dấu tiếng Việt) | ❌ Không hỗ trợ (Chỉ nhận file PDF/ePub đã được định dạng sẵn) | 🟢 **Rất tốt** (Tích hợp engine PaddleOCR/VietOCR tối ưu riêng) |
| **Bảo mật DRM chống download** | ❌ Yếu hoặc không có (Cho tải cả file PDF gốc về) | ❌ Không có cơ chế chặn download | 🟢 **Rất mạnh** (DRM cấp độ nhà xuất bản toàn cầu) | 🟢 **Khá tốt** (Canvas Reader + Watermark + Presigned URL) |
| **Tính linh hoạt (Tự quét tài liệu nội bộ)** | 🟢 Tốt (Tự upload tài liệu nội bộ thoải mái) | 🟢 Tốt (Hỗ trợ upload tài liệu nội bộ) | ❌ Không hỗ trợ (Chỉ phân phối sách từ các nhà xuất bản liên kết) | 🟢 **Tốt** (Hỗ trợ thủ thư tự quét và upload học liệu nội bộ) |
| **Chi phí đầu tư ban đầu & vận hành** | 🔴 **Rất cao** (Từ 125 triệu đến hơn 1 tỷ VNĐ/năm) | 🟡 **Trung bình** (Từ 50 triệu đến 150 triệu VNĐ) | 🔴 **Cực kỳ đắt** (Tính phí bản quyền theo từng đầu sách/sinh viên) | 🟢 **Siêu tiết kiệm** (62.5 triệu phát triển, 2.3M/tháng vận hành) |

LIBIF đi vào vùng ngách tối ưu: kết hợp **Tự động hóa OCR tiếng Việt + Bảo mật Canvas Reader chống tải file + Chi phí vận hành siêu rẻ (~2.3M/tháng)** cho cấp khoa.

---

## 8. Kết luận

**Vấn đề đã rõ.** Quy trình số hóa thủ tục tại các thư viện cơ sở giáo dục đang gây tổn thất nhân lực, cản trở tiếp cận học liệu và tạo rủi ro pháp lý bản quyền — ba điều mà bất kỳ tổ chức giáo dục nào cũng không nên chấp nhận năm 2026.

**Giải pháp đã chín muồi.** Công nghệ OCR tiếng Việt vừa đạt ngưỡng độ chính xác đủ để triển khai thực tế. Chi phí vận hành đã giảm xuống mức ngân sách giáo dục có thể chấp nhận. Thời điểm này là cửa sổ cơ hội để triển khai với chi phí thấp nhất và rủi ro kỹ thuật thấp nhất từ trước đến nay.
