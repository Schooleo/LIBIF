# ĐỀ XUẤT DỰ ÁN
## LIBIF — Hệ thống Quản lý Tài liệu & Số hóa Thư viện Thông minh

---

> **Loại tài liệu:** Đề xuất Dự án  
> **Trạng thái:** Dự thảo v2.0  
> **Ngày lập:** 19 tháng 7 năm 2026  
> **Đội ngũ Phát triển:** 6 Sinh viên Năm cuối, Khoa Khoa học & Kỹ thuật Máy tính — HCMUS  
> **Hỗ trợ Kỹ thuật:** Trợ lý AI Antigravity · GitHub Copilot  

---

## MỤC LỤC

1. [Bối cảnh Thực tế — Bài học Thực tiễn](#1-bối-cảnh-thực-tế)
2. [Tầm quan trọng của Vấn đề](#2-tầm-quan-trọng-của-vấn-đề)
3. [Phân tích Các bên Liên quan](#3-phân-tích-các-bên-liên-quan)
4. [Đánh giá Tính Khả thi](#4-đánh-giá-tính-khả-thi)
5. [Lộ trình & Tiến độ Dự án](#5-lộ-trình--tiến-độ-dự-án)
6. [Ngân sách Dự án](#6-ngân-sách-dự-án)
7. [Tác động Dự kiến đối với Hoạt động](#7-tác-động-dự-kiến-đối-với-hoạt-động)
8. [Kết luận](#8-kết-luận)

> *Thông tin chi tiết về phạm vi tính năng, kiến trúc kỹ thuật và yêu cầu người dùng được trình bày chi tiết trong **Tài liệu Yêu cầu Hoạt động (BRD)** và **Tài liệu Yêu cầu Người dùng (URD)** đính kèm.*

---

## 1. Bối cảnh Thực tế

### Bài học Thực tiễn: Một buổi chiều tại Thư viện Khoa

Cô Nguyễn Thị Lan, thủ thư duy nhất của thư viện Khoa Khoa học Máy tính tại một trường đại học ở TP.HCM, bắt đầu ca làm việc lúc 8:00 sáng. Trên bàn làm việc của cô là chồng sách vừa được quyên góp — 47 cuốn giáo trình chuyên ngành trị giá khoảng **35 triệu đồng**. Nhiệm vụ hôm nay của cô: quét (scan) từng cuốn sách, đổi tên tệp, ghi chép thông tin vào tệp Excel, và chờ sinh viên nhắn tin qua Zalo để gửi từng tệp một.

Lúc 2:00 chiều, Minh — một sinh viên năm thứ ba — nhắn tin xin mượn cuốn *Giải tích Số* để chuẩn bị cho kỳ thi tuần tới. Cô Lan tìm kiếm trên máy tính mất 23 phút, phát hiện ra tệp đã bị lưu sai thư mục và gửi qua email. Tệp PDF đó — hoàn toàn không có bất kỳ cơ chế bảo vệ nào — đã lan truyền ra toàn bộ lớp học thông qua một nhóm Telegram trong vòng 24 giờ.

**Đây không phải là lỗi của riêng ai.** Đó là kết quả tất yếu của một quy trình thủ công được xây dựng từ thời kỳ tiền internet nhưng vẫn đang vận hành vào năm 2026.

**LIBIF** được đề xuất để thay thế toàn bộ vòng lặp thủ công đó: tự động hóa OCR, tập trung hóa lưu trữ tài liệu số, và trao quyền cho sinh viên tự tra cứu, tiếp cận tài liệu một cách an toàn, tức thì và 24/7.

---

## 2. Tầm quan trọng của Vấn đề

### 2.1 Vấn đề Thực tế và Đủ Nhức nhối

Quy trình quản lý tài liệu số thủ công hiện tại gây ra **ba loại tổn thất có thể đo lường được**:

**① Tổn thất Lực lượng Lao động — Thủ thư bị sa lầy vào các công việc giá trị thấp**
Một thủ thư xử lý thủ công một cuốn sách (scan → đổi tên → nhập Excel → phản hồi sinh viên) mất trung bình 45–60 phút. Đối với một danh mục 500 cuốn sách cần số hóa, con số này tương đương **375–500 giờ công** — hơn **46 ngày làm việc toàn thời gian** — chỉ để hoàn thành công việc nhập dữ liệu. Trong thời gian này, thủ thư không thể tham gia vào việc quản lý trí thức, tư vấn hay phát triển chuyên môn.

**② Tổn thất Khả năng Truy cập — Sinh viên không thể học khi cần**
Thời gian trung bình để một sinh viên tiếp cận được tài liệu số hóa là **24–72 giờ** — tính từ lúc gửi yêu cầu đến khi nhận được tệp, phụ thuộc hoàn toàn vào lịch trình của thủ thư. Trong môi trường học tập hiện đại với các bài kiểm tra đột xuất và thời hạn nộp bài gấp rút, sự chậm trễ này ảnh hưởng trực tiếp đến kết quả học tập.

**③ Tổn thất Bản quyền — Vi phạm không kiểm soát**
Khi một tệp PDF được phân phối qua email hoặc các ứng dụng nhắn tin, mọi cơ chế kiểm soát phân phối đều thất bại. Nhà trường thiếu dữ liệu về số lượng độc giả, sự lan truyền tệp, hoặc việc phát tán trái phép, dẫn đến rủi ro pháp lý về bản quyền.

### 2.2 Bối cảnh Toàn cầu Khẳng định Tầm quan trọng

Số hóa thư viện không phải là một xu hướng — đó là yêu cầu nền tảng đối với các cơ sở giáo dục hiện đại. UNESCO xác nhận hàng triệu tài liệu vật lý đang đối mặt với sự xuống cấp không thể phục hồi nếu không được số hóa kịp thời. Công nghệ OCR đã chứng minh là xương sống của các thư viện số hiện đại, chuyển đổi các hình ảnh tĩnh thành dữ liệu có thể tìm kiếm toàn văn.

### 2.3 Tại sao lại là Hiện tại, Tại sao lại là LIBIF

Hai điều kiện tiên quyết quan trọng hội tụ tạo nên thời điểm lý tưởng:
1. **Công nghệ OCR tiếng Việt với Tesseract đã chín mùi và đạt hiệu quả cao:** Tesseract OCR, một công cụ mã nguồn mở chuẩn công nghiệp, kết hợp với dữ liệu huấn luyện tiếng Việt (`vie`) và tiền xử lý hình ảnh tối ưu (chuyển ảnh xám, phân ngưỡng, chỉnh nghiêng), mang lại độ chính xác cao và hiệu suất xử lý tốt cho các tài liệu in tiếng Việt. Bằng cách tối thiểu hóa chi phí RAM và CPU so với các giải pháp học sâu (deep learning) nặng nề, Tesseract mang lại một giải pháp mạnh mẽ, nhẹ nhàng và tiết kiệm chi phí, hoàn toàn phù hợp với nhu cầu dự án.
2. **Chi phí triển khai đã giảm đáng kể:** Hạ tầng đám mây tối thiểu để vận hành LIBIF chỉ tốn khoảng **~1.200.000 – 2.000.000 VNĐ/tháng**.

### 2.4 Tại sao Không tiếp tục Sử dụng Google Drive / Email

| Vấn đề | Google Drive / Email | LIBIF |
|---|---|---|
| Kiểm soát Phân phối | ❌ Tệp có thể bị sao chép tự do | ✅ Đọc an toàn trên trình duyệt, không tải tệp gốc |
| Tìm kiếm Toàn văn | ❌ Chỉ tìm kiếm theo tên tệp | ✅ Tìm kiếm toàn văn bên trong nội dung tài liệu |
| Tốc độ Truy cập | ❌ Phụ thuộc vào thủ thư (24–72h) | ✅ Tự phục vụ tức thì, 24/7 |
| Báo cáo Sử dụng | ❌ Không có chỉ số sử dụng | ✅ Bảng điều khiển phân tích theo thời gian thực |
| Tuân thủ Bản quyền | ❌ Không có biện pháp thực thi | ✅ Bảo vệ DRM kỹ thuật được tích hợp |

---

## 3. Phân tích Các bên Liên quan

### 3.1 Bản đồ Các bên Liên quan Tóm tắt

Để đảm bảo bao quát toàn bộ từ lãnh đạo nhà trường, vận hành thư viện hàng ngày, tuân thủ pháp lý cho đến việc tiếp nhận của người dùng cuối, các bên liên quan của dự án được mở rộng thành bảy nhóm riêng biệt:

| Nhóm bên Liên quan | Vai trò trong Dự án | Vấn đề Nhức nhối Hiện tại | Lợi ích Dự kiến |
|---|---|---|---|
| **Ban Giám hiệu / Lãnh đạo** | Bên Phê duyệt Chiến lược & Tài trợ Dự án | Áp lực chuyển đổi số cấp trường nhưng thiếu ROI rõ ràng hoặc giải pháp cụ thể. | Giải pháp trọn gói hoàn thành cam kết chuyển đổi số và nâng cao uy tín học thuật của nhà trường. |
| **Quản lý Thư viện** | Bên Tài trợ Vận hành & Chủ quản Lĩnh vực | Thiếu chỉ số báo cáo thời gian thực về khai thác tài nguyên; không thể giải trình ngân sách mua sắm. | Bảng điều khiển phân tích thời gian thực chứng minh ROI và định hướng quyết định bổ sung, số hóa tài liệu. |
| **Thủ thư & Nhân viên** | Người Vận hành Hệ thống Hàng ngày | Bị sa lầy vào công việc thủ công lặp đi lặp lại (scan, nhập Excel, nhắn Zalo); áp lực bởi yêu cầu gấp của sinh viên. | Giảm đáng kể khối lượng công việc nhập liệu thủ công; tự động thu thập siêu dữ liệu ISBN và sinh viên tự phục vụ. |
| **Giảng viên & Nghiên cứu sinh** | Đóng góp Nội dung & Độc giả Nâng cao | Truy cập phân tán vào tài liệu chuyên ngành; rủi ro phát tán trái phép tài liệu bài giảng/đề cương nội bộ. | Cổng thông tin hai vai trò: chia sẻ an toàn tài liệu bài giảng cho sinh viên đăng ký và truy cập tức thì 24/7 tới tài liệu tham khảo hiếm. |
| **Sinh viên & Người học** | Đối tượng Thụ hưởng Chính / Độc giả | Thời gian chờ 24–72 giờ cho yêu cầu tài liệu; không thể tìm kiếm nội dung bên trong sách; truy cập di động kém. | Tìm kiếm danh mục tự phục vụ 24/7 tức thì, tra cứu toàn văn OCR, và trình đọc DRM phản hồi tốt trên trình duyệt mọi thiết bị. |
| **Cán bộ Pháp chế & Bản quyền** | Phê duyệt Tuân thủ & Rủi ro | Rủi ro cao về trách nhiệm pháp lý vi phạm bản quyền do phân phối PDF không kiểm soát qua Zalo/email. | Thực thi DRM kỹ thuật (Canvas Reader trên trình duyệt, watermark động, URL tạm thời presigned) đảm bảo tuân thủ quy định. |
| **Đội ngũ CNTT & Hạ tầng** | Vận hành Hệ thống & Bảo trì | Các cuộc gọi sự cố phát sinh không theo chuẩn; bảo trì các công cụ máy chủ cũ kỹ không có tài liệu hướng dẫn. | Kiến trúc Modular Monolith chuẩn hóa, triển khai Docker đơn lệnh, hợp đồng API hoàn chỉnh, và chi phí vận hành cloud thấp. |

---

### 3.2 Ma trận Quyền hạn vs. Sự quan tâm (Mô hình Mendelow)

Các bên liên quan được phân loại theo mức độ ảnh hưởng (Quyền hạn) và tác động dự án (Sự quan tâm) để xây dựng chiến lược tương tác hiệu quả:

```
                QUYỀN HẠN CAO
                      │
   [GIỮ HÀI LÒNG]     │    [QUẢN LÝ CHẶT CHẼ]
   • Bộ phận Pháp chế │    • Ban Giám hiệu
     & Bản quyền      │    • Ban Quản lý Thư viện
   • Đội CNTT & Hạ    │
     tầng             │
                      │
──────────────────────┼──────────────────────
                      │
     [GIÁM SÁT]       │    [CUNG CẤP THÔNG TIN]
   • Các Tổ chức Kiểm │    • Thủ thư & Nhân viên
     định & Đánh giá  │    • Giảng viên & Nghiên cứu sinh
     Chất lượng       │    • Sinh viên & Người học
                      │
                QUYỀN HẠN THẤP ──────────► SỰ QUAN TÂM CAO
```

- **Quản lý Chặt chẽ (Quyền hạn Cao, Sự quan tâm Cao):** Ban Giám hiệu & Ban Quản lý Thư viện. Yêu cầu báo cáo demo cột mốc hai tuần một lần, xem trước bảng điều khiển ROI, và cập nhật ngân sách/tiến độ.
- **Giữ Hài lòng (Quyền hạn Cao, Sự quan tâm Trung bình/Thấp):** Cán bộ Pháp chế/Bản quyền & Đội CNTT Hạ tầng. Cần tham vấn về tuân thủ thực thi DRM, kiểm định bảo mật, và bàn giao kiến trúc hệ thống.
- **Cung cấp Thông tin (Quyền hạn Thấp, Sự quan tâm Cao):** Thủ thư, Giảng viên và Sinh viên. Tập trung vào sự đơn giản của giao diện, hướng dẫn sử dụng, và vòng phản hồi tích cực trong quá trình kiểm thử UAT.
- **Giám sát (Quyền hạn Thấp, Sự quan tâm Thấp):** Các tổ chức kiểm định bên ngoài. Đảm bảo kết xuất báo cáo hệ thống đáp ứng các yêu cầu kiểm toán tiêu chuẩn của trường.

---

### 3.3 Điều kiện Thành công của Các bên Liên quan & Giảm thiểu Rủi ro Kháng cự

Để đảm bảo việc triển khai diễn ra suôn sẻ ở mọi cấp độ, các điều kiện thành công then chốt, rủi ro kháng cự chính và chiến lược giảm thiểu được xây dựng cho cả bảy nhóm:

| Nhóm bên Liên quan | Điều kiện Thành công Key | Rủi ro Kháng cự Chính | Chiến lược Giảm thiểu |
|---|---|---|---|
| **Ban Giám hiệu / Lãnh đạo** | Bằng chứng rõ ràng về tiến độ chuyển đổi số và ROI cao. | Hoài nghi về khả năng hoàn thành dự án và lo ngại lãng phí ngân sách đầu tư. | Demo tiến độ 2 tuần/lần, báo cáo trạng thái EVM rõ ràng, và xem trước bảng điều khiển quản lý. |
| **Quản lý Thư viện** | Phân tích thời gian thực về khai thác tài nguyên để giải trình ngân sách mua sắm với nhà trường. | E ngại áp dụng nếu hệ thống không cung cấp báo cáo quản lý có giá trị thực tiễn. | Bảng điều khiển tự động theo dõi tổng lượt đọc, danh mục hàng đầu, và giờ cao điểm với tính năng xuất báo cáo 1-click. |
| **Thủ thư & Nhân viên** | Hệ thống phải đơn giản hơn, sạch sẽ hơn và nhanh hơn việc nhập sổ Excel thủ công. | Kháng cự thay đổi thói quen thủ công cũ hoặc lo sợ sự phức tạp của phần mềm. | Giao diện không cần đào tạo: Kéo-thả PDF + Auto-fill siêu dữ liệu ISBN chỉ bằng 1-click. |
| **Giảng viên & Nghiên cứu sinh** | Chia sẻ an toàn tài liệu học phần mà không bị rò rỉ công khai tài liệu nội bộ. | Lo ngại về việc mất bản quyền trí tuệ hoặc vi phạm bản quyền bài giảng/đề cương tự soạn. | Phân quyền truy cập dựa trên vai trò (RBAC) chi tiết, Canvas Reader an toàn, và chèn watermark người dùng động. |
| **Sinh viên & Người học** | Tìm kiếm tài liệu tự phục vụ 24/7 tức thì và đọc mượt mà trên trình duyệt mọi thiết bị. | Thất vọng nếu trình đọc trực tuyến chậm, không tương thích di động, hoặc bắt cài plugin. | Trình đọc Canvas HTML5 nhẹ nhàng, giao diện phản hồi (responsive), đoạn trích trích xuất OCR tìm kiếm toàn văn tức thì, không cần plugin. |
| **Cán bộ Pháp chế & Bản quyền** | Không lộ tệp PDF gốc hoặc liên kết tải trực tiếp trong nhật ký mạng của trình duyệt. | Rủi ro chặn triển khai do lo ngại kiện tụng bản quyền từ các nhà xuất bản thương mại. | URL tạm thời presigned S3 hết hạn nhanh (< 60s), Canvas Reader ngăn chặn sao chép/in, và chèn watermark MSSV/IP động. |
| **Đội ngũ CNTT & Hạ tầng** | Triển khai đơn lệnh, không đòi hỏi điều phối máy chủ phức tạp hay chi phí bảo trì nặng nề. | Từ chối bảo trì các mã nguồn không có tài liệu hoặc hạ tầng đa máy chủ quá phức tạp. | Triển khai Docker Compose đóng gói, hợp đồng OpenAPI/Swagger đầy đủ, và kiến trúc Modular Monolith. |

---

## 4. Đánh giá Tính Khả thi

### 4.1 Khả thi về Kỹ thuật
- **Kiến trúc Modular Monolith:** Đảm bảo độ phức tạp vận hành thấp trong khi vẫn duy trì sự cô lập tên miền rõ ràng để dễ dàng tách thành Microservices trong tương lai.
- **Hàng đợi Tesseract OCR Bất đồng bộ:** Đường ống Redis + BullMQ tách biệt công việc xử lý OCR nặng khỏi luồng xử lý của Web Server, loại bỏ hoàn toàn lỗi 504 timeout và sự cố hết bộ nhớ (OOM).
- **Trình đọc Canvas DRM:** Trình diễn Canvas ngay trên trình duyệt với watermark động, vô hiệu hóa các lệnh sao chép/tải xuống đồng thời bảo vệ các URL presigned.

### 4.2 Khả thi về Tài chính & Vận hành
- **Chi phí Phát triển MVP:** Ngân sách một lần **90.500.000 VNĐ** cho đội ngũ kỹ sư 6 thành viên trong 8 tuần.
- **Ngân sách Vận hành Hàng năm:** **~70.440.000 VNĐ/năm** cho hạ tầng đám mây AWS, thấp hơn đáng kể so với phần mềm thương mại doanh nghiệp (125 triệu – 1,25 tỷ VNĐ/năm).

---

## 5. Lộ trình & Tiến độ Dự án

### 5.1 Phân bổ Sprint 8 Tuần

- **Sprint 1 (Tuần 1-2):** Thiết lập Nền tảng, Tải lên PDF thô bằng kéo-thả (US-01), Tự động điền siêu dữ liệu ISBN thông minh (US-02).
- **Sprint 2 (Tuần 3-4):** Hàng đợi Tiến trình Tesseract OCR & Nén Bất đồng bộ Chạy ngầm (US-03), Cổng Tìm kiếm Danh mục Trực tuyến (US-04), Xác thực & RBAC.
- **Sprint 3 (Tuần 5-6):** Đoạn trích Tìm kiếm Toàn văn (US-05), Trình đọc Canvas DRM (US-06), Quy trình Phê duyệt của Thủ thư (US-08).
- **Sprint 4 (Tuần 7-8):** Bảng điều khiển Thống kê Quản lý (US-07), Quản lý Danh mục & Thẻ (US-09), Kiểm thử E2E & Bàn giao QA.

---

## 6. Ngân sách Dự án

### 6.1 Chi tiết Ngân sách Nhân công (6 Kỹ sư, 8 Tuần)

| Vai trò | Số lượng | Chi phí Tháng / Người | Tổng Chi phí (2 Tháng) | Trách nhiệm Chính |
|---|:---:|:---:|:---:|---|
| PM / Kiến trúc sư Hệ thống (Trưởng nhóm) | 1 | 10.000.000 VNĐ | **20.000.000 VNĐ** | Lập kế hoạch, thiết kế kiến trúc, CI/CD, thiết kế cơ sở dữ liệu, API lõi |
| Kỹ sư Backend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** | Service danh mục, tích hợp lưu trữ đối tượng S3, xác thực & Security Reader API |
| Chuyên gia AI / OCR | 1 | 8.500.000 VNĐ | **17.000.000 VNĐ** | Đường ống Tesseract OCR, hàng đợi Redis BullMQ, tinh chỉnh chỉ mục tìm kiếm toàn văn |
| Kỹ sư Frontend | 1 | 8.000.000 VNĐ | **16.000.000 VNĐ** | Admin Portal, component DRM Canvas Reader, giao diện Dashboard |
| Nhà thiết kế UI/UX & Viết Tài liệu | 1 | 5.500.000 VNĐ | **11.000.000 VNĐ** | UI mockup, hệ thống thiết kế, hướng dẫn người dùng & tài liệu kỹ thuật |
| Kỹ sư QA / Kiểm thử | 1 | 5.250.000 VNĐ | **10.500.000 VNĐ** | Kiểm thử đơn vị, kịch bản tự động hóa E2E, kiểm thử bảo mật & UAT |
| **TỔNG CHI PHÍ NHÂN CÔNG** | **6** | — | **90.500.000 VNĐ** | |

---

## 7. Tác động Dự kiến đối với Hoạt động

- **Giảm đáng kể** thời gian nhập dữ liệu và xử lý tài liệu của thủ thư cho mỗi cuốn sách.
- **Truy cập Tức thì** cho sinh viên để tìm kiếm và đọc các giáo trình số hóa 24/7.
- **Bảo vệ Mạnh mẽ** chống lại việc tải tệp PDF gốc trái phép và phát tán không kiểm soát.
- **ROI Đo lường được** thông qua bảng điều khiển quản lý theo thời gian thực theo dõi các chỉ số đọc.

---

## 8. Kết luận

LIBIF mang đến một giải pháp thực tiễn, tác động cao và vững chắc về mặt kỹ thuật để hiện đại hóa quy trình số hóa thư viện đại học. Bằng cách tự động hóa các nút thắt thủ công và bảo vệ tài sản số, LIBIF thiết lập một nền tảng vững chắc cho quá trình chuyển đổi số của nhà trường.
