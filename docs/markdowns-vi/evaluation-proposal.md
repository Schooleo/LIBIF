# BÁO CÁO ĐÁNH GIÁ ĐỀ XUẤT DỰ ÁN
## Đánh giá Toàn diện LIBIF — Hệ thống Quản lý Tài liệu & Số hóa Thư viện Thông minh

---

> **Tài liệu Mục tiêu:** [Project-Proposal.md](./Project-Proposal.md)  
> **Khung Đánh giá:** [criteria.md](./criteria.md)  
> **Ngày lập:** 24 tháng 7 năm 2026  
> **Đơn vị Đánh giá:** Hội đồng Đánh giá Dự án & Hệ thống AI  
> **Phán quyết Cuối cùng:** **APPROVED (ĐỒNG Ý)**  
> **Điểm Tổng thể:** **8.15 / 10**

---

## Tóm tắt Dành cho Lãnh đạo

Tài liệu này trình bày đánh giá toàn diện, chi tiết theo từng tiêu chí cho **Đề xuất Dự án LIBIF** ([Project-Proposal.md](./Project-Proposal.md)). Đánh giá xem xét tính thực tiễn, tính khả thi, tác động đến hoạt động, kiến trúc kỹ thuật, quản trị rủi ro và giá trị tổng thể của hệ thống được đề xuất dựa trên 10 tiêu chí đánh giá chuẩn hóa được quy định trong [criteria.md](./criteria.md).

Dựa trên phân tích định lượng và định tính, **LIBIF** thể hiện sự phù hợp cao với bài toán thực tế, thiết kế kỹ thuật thực tiễn (Modular Monolith, hàng đợi Tesseract OCR bất đồng bộ, trình đọc DRM Canvas HTML5), hiệu quả chi phí vận hành rõ ràng (~70.4 triệu VNĐ/năm chi phí vận hành so với phần mềm thương mại), và chiến lược giảm thiểu rủi ro cho các bên liên quan được cấu trúc chặt chẽ.

> [!NOTE]
> **Quyết định Cuối cùng:** **ĐỒNG Ý (APPROVED)** — Đề xuất dự án có tính thực tiễn cao, vững chắc về kỹ thuật và khả thi về mặt kinh tế cho quá trình chuyển đổi số thư viện đại học.

---

## Bảng Điểm Đánh giá

| STT | Tiêu chí Đánh giá | Điểm (Thang 10) | Trọng số / Ưu tiên | Tóm tắt Đánh giá |
| :-: | :--- | :-: | :-: | :--- |
| **1** | **Xác minh Bài toán** | **9.0 / 10** | Cao | Vấn đề thực tế, nhức nhối được xác minh qua 3 loại tổn thất định lượng (nhân lực, thời gian truy cập, bản quyền). |
| **2** | **Nhu cầu Thị trường** | **8.5 / 10** | Cao | Bản đồ toàn diện 7 nhóm bên liên quan với các vấn đề nhức nhối cụ thể và giải pháp lợi ích tương ứng. |
| **3** | **Quy mô & Phạm vi Thị trường** | **6.5 / 10** | Trung bình | Định hướng rõ ràng vào các thư viện khoa/trường đại học với bối cảnh UNESCO, nhưng thiếu phân tích chi tiết TAM/SAM/SOM. |
| **4** | **Tác động Hoạt động** | **8.5 / 10** | Cao | Tác động đo lường được: tiết kiệm 375–500 giờ công mỗi 500 cuốn sách; sinh viên truy cập tức thì 24/7 thay vì chờ 24–72 giờ. |
| **5** | **Tính Khả thi Tài chính** | **8.5 / 10** | Cao | Cấu trúc chi phí rất thấp (90.5M VNĐ nhân công MVP + ~70.4M VNĐ/năm vận hành) so với phần mềm doanh nghiệp (125M–1.25B VNĐ/năm). |
| **6** | **Tính Khả thi Kỹ thuật & Độ phức tạp** | **9.0 / 10** | Cao | Công nghệ thực tiễn (Modular Monolith, Tesseract OCR với `vie`, hàng đợi Redis+BullMQ, Canvas DRM, Docker Compose). |
| **7** | **Lợi thế Cạnh tranh / Rào cản** | **7.5 / 10** | Trung bình | Vượt trội so với công cụ tự phát (Drive/Zalo); lợi thế cạnh tranh nằm ở sự tích hợp quy trình và DRM học thuật tùy chỉnh. |
| **8** | **Tiềm năng Phát triển** | **8.0 / 10** | Trung bình | Khả năng mở rộng tốt nhờ lưu trữ S3, hàng đợi bất đồng bộ Redis, và kiến trúc mô-đun sẵn sàng tách dịch vụ. |
| **9** | **Đánh giá Rủi ro** | **8.5 / 10** | Cao | Chiến lược giảm thiểu chủ động cho bản quyền pháp lý, kháng cự vận hành và nút thắt hiệu năng hệ thống. |
| **10** | **Độ tin cậy của Bằng chứng** | **7.5 / 10** | Trung bình | Ước tính chi phí nhân công và cloud thực tế; các chỉ số tổn thất ban đầu dựa trên mô hình bài học thực tiễn đại diện. |
| **TỔNG** | **Điểm Trung bình Trọng số** | **8.15 / 10** | **Tính Thực tiễn & Khả thi Tổng thể Cao** |

---

## Phân tích Chi tiết Theo Tiêu chí

### 1. Xác minh Bài toán (Vấn đề có thực tế và đủ nhức nhối không?)
* **Điểm:** **9.0 / 10**
* **Phân tích Chi tiết:**
  - Đề xuất xây dựng một bài học thực tiễn thuyết phục, chân thực ("Một buổi chiều tại Thư viện Khoa") mô tả nút thắt vận hành của cô Lan (thủ thư) và Minh (sinh viên).
  - Định lượng ba vấn đề nhức nhối riêng biệt:
    1. **Tổn thất Lực lượng Lao động:** Quét thủ công, đổi tên, ghi sổ Excel và nhắn Zalo mất 45–60 phút/cuốn sách, tích lũy **375–500 giờ công** (hơn 46 ngày làm việc toàn thời gian) cho danh mục 500 cuốn sách.
    2. **Tổn thất Khả năng Truy cập:** Sinh viên đối mặt với **độ trễ 24–72 giờ** để tiếp cận tài liệu học tập số hóa, ảnh hưởng trực tiếp đến việc học và chuẩn bị thi.
    3. **Tổn thất Bản quyền:** Phân phối PDF không kiểm soát qua email/Zalo/Telegram dẫn đến phát tán tệp trái phép mà nhà trường không thể theo dõi hay bảo vệ bản quyền.
* **Đánh giá:** Vấn đề có thực, cấp thiết và được xác minh tốt trên các khía cạnh vận hành, giáo dục và pháp lý.

---

### 2. Nhu cầu Thị trường (Người dùng mục tiêu có thực sự muốn giải pháp không?)
* **Điểm:** **8.5 / 10**
* **Phân tích Chi tiết:**
  - Thực hiện **Phân tích Các bên Liên quan** sâu rộng xác định 7 nhóm chính: Ban Giám hiệu, Quản lý Thư viện, Thủ thư & Nhân viên, Giảng viên & Nghiên cứu sinh, Sinh viên & Người học, Cán bộ Pháp chế, và Đội CNTT Hạ tầng.
  - Áp dụng **Ma trận Quyền hạn vs. Sự quan tâm của Mendelow** để phân loại chiến lược quản lý các bên liên quan.
  - Giải quyết các nhu cầu cụ thể và rủi ro kháng cự của người dùng:
    - *Thủ thư:* Cần biên mục dễ dàng → Giải quyết bằng kéo-thả và tự động lấy siêu dữ liệu ISBN.
    - *Sinh viên:* Cần truy cập nhanh, thân thiện di động → Giải quyết bằng tìm kiếm danh mục tức thì 24/7 và Trình đọc Canvas HTML5 đáp ứng tốt.
    - *Cán bộ Pháp chế/Tuân thủ:* Cần bảo vệ chống rủi ro bản quyền → Giải quyết bằng Canvas Reader không cho tải tệp gốc, watermark động, và URL S3 tạm thời presigned (< 60s).
* **Khuyến nghị:** Đưa thêm dữ liệu khảo sát người dùng thực tế (ví dụ: thống kê khảo sát sinh viên/nhân viên) trong các bản cập nhật tương lai để tăng cường chứng minh nhu cầu thị trường.

---

### 3. Quy mô & Phạm vi Thị trường
* **Điểm:** **6.5 / 10**
* **Phân tích Chi tiết:**
  - Đề xuất hướng tới các thư viện khoa/trường đại học (bắt đầu với Khoa Khoa học & Kỹ thuật Máy tính tại HCMUS) và dẫn chiếu định hướng số hóa thư viện toàn cầu của UNESCO.
  - Nhấn mạnh nhu cầu chung về chuyển đổi số chi phí hợp lý tại các cơ sở giáo dục đại học ở Việt Nam.
* **Hạn chế:**
  - Thiếu các chỉ số định lượng về Tổng thị trường Tiềm năng (TAM), Thị trường Khả dụng (SAM), và Thị trường Mục tiêu (SOM) bằng tiền hoặc số lượng trường nếu thương mại hóa.
* **Đánh giá:** Thích hợp cho một dự án nội bộ cấp khoa/trường đại học, nhưng còn khiêm tốn nếu đánh giá như một đề xuất startup SaaS thương mại.

---

### 4. Tác động Hoạt động
* **Điểm:** **8.5 / 10**
* **Phân tích Chi tiết:**
  - **Hiệu quả Vận hành:** Thay thế 375–500 giờ nhập liệu thủ công mỗi 500 cuốn sách bằng tính năng tự động lấy siêu dữ liệu ISBN và xử lý OCR bất đồng bộ.
  - **Giá trị Học thuật:** Giảm rào cản thời gian truy cập tài liệu của sinh viên từ 24–72 giờ xuống còn tự phục vụ tức thì 24/7.
  - **Tuân thủ & Quản trị:** Loại bỏ việc chia sẻ PDF không được theo dõi, giảm thiểu rủi ro pháp lý bản quyền cho nhà trường.
  - **Ra Quyết định dựa trên Dữ liệu:** Bảng điều khiển phân tích thời gian thực cho phép quản lý theo dõi chỉ số đọc, danh mục phổ biến và giờ cao điểm để giải trình ngân sách mua sắm.

---

### 5. Tính Khả thi Tài chính (Hiệu quả Kinh tế & Vận hành)
* **Điểm:** **8.5 / 10**
* **Phân tích Chi tiết:**
  - **Ngân sách Phát triển:** Tổng chi phí nhân công **90.500.000 VNĐ** cho 6 sinh viên kỹ sư năm cuối trong 8 tuần (~2 tháng), thể hiện khoản đầu tư MVP thực tế và tinh gọn.
  - **Chi phí Vận hành:** **~1.2M – 2.0M VNĐ/tháng** (~70.44M VNĐ/năm) cho hạ tầng đám mây AWS.
  - **So sánh Chi phí:** Cực kỳ tiết kiệm so với các hệ thống thư viện số doanh nghiệp thương mại (thường từ 125 triệu đến 1,25 tỷ VNĐ/năm).
  - **Chiến lược Bảo trì:** Triển khai Docker Compose đơn lệnh và kiến trúc Modular Monolith đảm bảo chi phí vận hành và bảo trì thấp cho đội ngũ CNTT của trường.

---

### 6. Tính Khả thi Kỹ thuật & Độ phức tạp
* **Điểm:** **9.0 / 10**
* **Phân tích Chi tiết:**
  - **Kiến trúc:** Thiết kế **Modular Monolith** thực tiễn, tránh sự phức tạp sớm của microservices trong khi vẫn duy trì ranh giới tên miền sạch sẻ.
  - **Công cụ OCR:** Sử dụng mã nguồn mở **Tesseract OCR** với dữ liệu tiếng Việt (`vie`) và tiền xử lý hình ảnh (chuyển ảnh xám, phân ngưỡng, chỉnh nghiêng), mang lại giải pháp nhẹ, tiết kiệm chi phí thay vì các mô hình GPU học sâu nặng nề.
  - **Xử lý Tải Bất đồng bộ:** Hàng đợi **Redis + BullMQ** tách biệt công việc xử lý OCR nặng về CPU/RAM khỏi luồng xử lý chính của Web Server, loại bỏ triệt để lỗi 504 Gateway Timeout và sự cố hết bộ nhớ (OOM).
  - **Bảo mật & DRM:** Trình đọc **HTML5 Canvas Reader** trên trình duyệt kết hợp URL presigned S3 hết hạn nhanh (< 60s) và chèn watermark động (MSSV/IP) ngăn chặn việc tải tệp PDF gốc cũng như lệnh in/sao chép.

---

### 7. Lợi thế Cạnh tranh / Rào cản
* **Điểm:** **7.5 / 10**
* **Phân tích Chi tiết:**
  - **So với Công cụ Tự phát (Google Drive, Email, Zalo):** Cung cấp tìm kiếm toàn văn OCR, đọc DRM trên trình duyệt, phân tích thời gian thực và tự động lấy siêu dữ liệu ISBN — các tính năng hoàn toàn thiếu vắng trong lưu trữ đám mây thông thường.
  - **So với Hệ thống Doanh nghiệp Thương mại (DSpace, Koha):** Cung cấp giao diện nhẹ hơn, tùy chỉnh thân thiện phù hợp riêng cho quy trình thư viện đại học Việt Nam với chi phí chỉ bằng một phần nhỏ.
* **Hạn chế:**
  - Rào cản công nghệ phụ thuộc vào các thành phần mã nguồn mở tiêu chuẩn (Tesseract, BullMQ, React/Canvas). Khả năng phòng thủ chủ yếu đến từ việc tích hợp quy trình tùy chỉnh chuyên sâu theo lĩnh vực hơn là bằng sáng chế độc quyền.

---

### 8. Tiềm năng Phát triển
* **Điểm:** **8.0 / 10**
* **Phân tích Chi tiết:**
  - **Khả năng Mở rộng Kỹ thuật:** Lưu trữ đối tượng AWS S3 đáp ứng dung lượng tài liệu không giới hạn; hàng đợi BullMQ mở rộng theo chiều ngang cho các công việc OCR nặng.
  - **Mức độ Sẵn sàng Kiến trúc:** Cấu trúc Modular Monolith được thiết kế chủ động để dễ dàng tách thành Microservices khi lượng truy cập tăng cao.
  - **Mở rộng Cấp Trường:** Giải pháp dễ dàng mở rộng từ một thư viện khoa sang quy mô toàn trường đại học hoặc đa cơ sở.

---

### 9. Đánh giá Rủi ro & Giảm thiểu
* **Điểm:** **8.5 / 10**
* **Phân tích Chi tiết:**
  - Đề xuất xác định và giải quyết ba nhóm rủi ro chính:
    1. **Rủi ro Pháp lý & Bản quyền:** Giảm thiểu bằng Canvas Reader, chặn tải PDF gốc, URL presigned hết hạn nhanh và chèn watermark động.
    2. **Rủi ro Kháng cự Vận hành / Người dùng:** Giảm thiểu bằng giao diện không cần đào tạo (kéo-thả PDF, 1-click tự động điền ISBN).
    3. **Nút thắt Hiệu năng Hệ thống:** Giảm thiểu bằng hàng đợi chạy ngầm bất đồng bộ Redis + BullMQ cho xử lý OCR.
* **Khuyến nghị:** Các bản chỉnh sửa tương lai nên bổ sung chính sách sao lưu/phục hồi sau thảm họa và chiến lược xử lý dự phòng khi gặp các tài liệu lịch sử cũ bị xuống cấp nặng.

---

### 10. Độ tin cậy của Bằng chứng
* **Điểm:** **7.5 / 10**
* **Phân tích Chi tiết:**
  - Các số liệu tài chính (chi phí nhân công, chi phí hạ tầng AWS, định mức phần mềm thương mại) cụ thể, thực tế và được phân rã rõ ràng.
  - Thông số kiến trúc kỹ thuật thể hiện các nguyên lý kỹ thuật phần mềm vững chắc.
* **Hạn chế:**
  - Các chỉ số vận hành (ví dụ: 45–60 phút/cuốn, độ trễ 24–72h của sinh viên) được rút ra từ mô hình bài học thực tiễn định tính thay vì từ khảo sát mẫu thống kê được xuất bản.

---

## Điểm mạnh Chính & Khuyến nghị

### Điểm mạnh Nổi bật
1. **Bối cảnh Thực tế Rõ ràng:** Được xây dựng trên một câu chuyện vận hành thực tế, dễ cảm nhận.
2. **Kiến trúc Kỹ thuật Vững chắc:** Hàng đợi OCR bất đồng bộ và DRM Canvas HTML5 giải quyết dứt điểm các nút thắt thực tế (timeout, rò rỉ PDF).
3. **Hiệu quả Chi phí Cao:** Mang lại ROI cao với chi phí vận hành cloud tối thiểu (~70.4M VNĐ/năm).
4. **Quản trị Các bên Liên quan Bài bản:** Bao gồm Ma trận Mendelow và các chiến lược giảm thiểu kháng cự chi tiết.

### Đề xuất Cải thiện
1. **Dữ liệu Khảo sát Thực nghiệm:** Thực hiện khảo sát thí điểm chính thức với sinh viên và thủ thư để thu thập số liệu nền tảng thực nghiệm.
2. **Mở rộng Quy mô Thị trường:** Nếu có ý định thương mại hóa ngoài HCMUS, cần chi tiết hóa số liệu thị trường TAM/SAM/SOM cho ngành giáo dục đại học Việt Nam.
3. **Phục hồi Sau Thảm họa:** Ghi nhận chính thức quy trình sao lưu cơ sở dữ liệu, nhân bản S3 và quy trình chuyển phòng ngừa sự cố.

---

## Phán quyết Cuối cùng & Ký Phê duyệt

> [!IMPORTANT]
> **PHÁN QUYẾT CUỐI CÙNG: APPROVED (ĐỒNG Ý)**  
> **Điểm Trọng số: 8.15 / 10**  
>  
> **Đề xuất Dự án LIBIF** ([Project-Proposal.md](./Project-Proposal.md)) chính thức được **ĐỒNG Ý (APPROVED)**. Đề xuất thể hiện tính thực tiễn xuất sắc, khả năng thực thi kỹ thuật cao, tính khả thi tài chính và sự phù hợp mạnh mẽ với các mục tiêu chuyển đổi số của nhà trường.
