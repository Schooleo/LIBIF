# CÂU 6: CHỨNG MINH Ý TƯỞNG (PROOF OF CONCEPT)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Chứng minh ý tưởng (Proof of Concept) của nhóm. (Sinh viên nộp kèm bản in giao diện thể hiện đầu vào và đầu ra khi chạy mã nguồn Chứng minh ý tưởng của nhóm.)

---

## 📋 TÀI LIỆU CẦN IN VÀ NỘP KÈM

| STT | Tài liệu nộp kèm | Nguồn tài liệu | Mục đích minh chứng |
|:---:|---|---|---|
| **1** | Bản in tài liệu Proof of Concept | `LIBIF-Proof-Of-Concept.md` | Báo cáo thẩm định kỹ thuật chính thức của nhóm |
| **2** | Bản in giao diện Đầu vào / Đầu ra khi chạy mã PoC | Ảnh chụp thực tế khi chạy mã nguồn | Minh chứng ảnh scan 300 DPI $\rightarrow$ Văn bản và tọa độ Bounding Box |
| **3** | Bản in mô hình xử lý dữ liệu Pipe & Filter | `LIBIF-Architecture.md` (Mục 3) | Giải thích quy trình tích hợp OCR vào kiến trúc hệ thống |

---

## PHẦN A: QUÁ TRÌNH HÌNH THÀNH VÀ PHƯƠNG PHÁP ĐÁNH GIÁ POC

### 1. Khái niệm và Sản phẩm PoC của nhóm
* **Khái niệm:** Proof of Concept (PoC) là sản phẩm mẫu kỹ thuật quy mô nhỏ, được xây dựng để **kiểm chứng giải pháp kỹ thuật cốt lõi/rủi ro cao nhất là khả thi** trước khi triển khai toàn bộ dự án.
* **Sản phẩm PoC của nhóm:** Mô-đun **Nhận dạng ký tự quang học (OCR) Tiếng Việt** từ ảnh scan 300 DPI bằng **Tesseract OCR Engine** kết hợp thư viện xử lý ảnh **OpenCV**.

### 2. Các đầu vào và 5 bước thực hiện PoC

| Hạng mục | Nội dung chi tiết |
|---|---|
| **Đầu vào cần thiết** | 1. **Product Backlog:** Các yêu cầu PBI-01 (Tải tài liệu), PBI-02 (OCR ngầm), PBI-04 (Đối soát Side-by-side).<br>2. **Project Proposal:** Mục 6.2 phân tích tính khả thi kỹ thuật.<br>3. **Architecture:** Mô hình dòng dữ liệu Pipe & Filter.<br>4. **Dữ liệu mẫu:** 10 - 20 trang sách scan Tiếng Việt chuẩn 300 DPI.<br>5. **Công cụ:** Tesseract OCR (ngôn ngữ `vie`), OpenCV, Python. |
| **5 Bước thực hiện** | **Bước 1 (Xác định mục tiêu):** Đặt bài toán nhận dạng chữ Tiếng Việt có dấu và trích xuất tọa độ từng từ.<br>**Bước 2 (Cài đặt môi trường):** Cài đặt engine Tesseract, gói ngôn ngữ tiếng Việt và OpenCV.<br>**Bước 3 (Lập trình PoC):** Xây dựng chuỗi: *Ảnh scan $\rightarrow$ Chỉnh nghiêng $\rightarrow$ Khử nhiễu $\rightarrow$ Nhị phân hóa $\rightarrow$ Tesseract OCR $\rightarrow$ Xuất văn bản & tọa độ Bounding Box*.<br>**Bước 4 (Thử nghiệm thực tế):** Chạy thực nghiệm trên 20 trang mẫu để đo độ chính xác và tốc độ.<br>**Bước 5 (Đánh giá & Kết luận):** Đối chiếu với tiêu chí chấp nhận và lập báo cáo PoC. |

### 3. Tiêu chí và Kết quả đánh giá PoC (6/6 Tiêu chí Đạt)

| Tiêu chí kiểm thử | Ngưỡng yêu cầu | Kết quả thực nghiệm | Đánh giá |
|---|:---:|:---:|:---:|
| **Độ chính xác ký tự** | $\ge 85\%$ | **$88\% - 92\%$** trên chữ in | **ĐẠT** |
| **Tốc độ xử lý** | $\le 5$ giây / trang | **$2 - 4$ giây / trang** | **ĐẠT** |
| **Độ khớp Bounding Box** | Khớp $\ge 90\%$ vị trí | **$\ge 90\%$** tọa độ từ chuẩn xác | **ĐẠT** |
| **Nhận dạng dấu Tiếng Việt** | Nhận dạng đúng đa số | **$85\% - 90\%$** từ có dấu đúng | **ĐẠT** |
| **Hiệu quả tiền xử lý ảnh** | Cải thiện chất lượng | Tăng **$+12\% - 18\%$** độ chính xác | **ĐẠT** |
| **Tích hợp hàng chờ Redis** | Vận hành ổn định | Không nghẽn, không lỗi bộ nhớ | **ĐẠT** |

> **Kết luận:** Tesseract kết hợp OpenCV hoàn toàn đáp ứng tốt bài toán OCR Tiếng Việt. Sai số nhỏ $5\% - 15\%$ còn lại được giải quyết triệt để thông qua **Giao diện đối soát Side-by-side của Thủ thư (Human-in-the-loop)**.

### 4. Phương pháp đánh giá tổng thể

| Khía cạnh đánh giá | Phương pháp thực hiện | Kết quả ghi nhận |
|---|---|---|
| **Đánh giá kỹ thuật** | Đo đạc định lượng bằng mã nguồn trên 20 trang mẫu | Đạt đầy đủ các chỉ số về tốc độ và độ chính xác |
| **Đánh giá nghiệp vụ** | Trình bày kết quả trích xuất văn bản cho Product Owner | Xác nhận sai số $5\% - 15\%$ xử lý được ở khâu đối soát |
| **Đánh giá nội bộ** | Các thành viên kiểm tra chéo mã nguồn và dữ liệu đo | Thống nhất giải pháp kỹ thuật đáp ứng yêu cầu |
| **So sánh giải pháp** | So sánh Tesseract (miễn phí) với các API đám mây trả phí | Tesseract đáp ứng tốt với chi phí bản quyền $0$ VNĐ |

---

## PHẦN B: CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Sản phẩm Chứng minh ý tưởng (Proof of Concept) là gì?

| Khía cạnh | Nội dung trả lời |
|---|---|
| **Khái niệm** | Là sản phẩm thử nghiệm kỹ thuật quy mô nhỏ, nhằm chứng minh giải pháp công nghệ cốt lõi/rủi ro cao nhất là khả thi trước khi đầu tư toàn diện. |
| **Phân biệt với Prototype** | • **PoC:** Tập trung vào **tính khả thi kỹ thuật/thuật toán** (mã nguồn chạy được).<br>• **Prototype:** Tập trung vào **giao diện và trải nghiệm người dùng (UX/UI)**. |
| **Mục đích cốt lõi** | Giảm thiểu rủi ro kỹ thuật từ sớm và tạo bằng chứng thuyết phục Product Owner, Giảng viên. |

---

### B2. Các phương pháp chứng minh khả năng hoàn thành dự án về mặt kỹ thuật

| Phương pháp | Bản chất kỹ thuật | Khi nào sử dụng |
|---|---|---|
| **Proof of Concept (PoC)** | Viết mã nguồn chạy thử nghiệm thực tế | Khi đối mặt với rủi ro công nghệ cốt lõi *(Nhóm chọn)* |
| **Prototype (Bản mẫu)** | Xây dựng khung giao diện tương tác | Khi luồng nghiệp vụ hoặc giao diện người dùng chưa rõ |
| **Spike (Nghiên cứu thăm dò)** | Dành khoảng thời gian ngắn để tìm hiểu lý thuyết | Khi nhóm chưa biết nên lựa chọn công nghệ nào |
| **Benchmarking (Đo kiểm chuẩn)** | Đo đạc và so sánh chỉ số hiệu năng | Khi cần đối sánh với đối thủ hoặc tiêu chuẩn ngành |

---

### B3. Nhóm chọn sản phẩm gì để Chứng minh ý tưởng và tại sao?
* **Sản phẩm:** Mô-đun **OCR Tiếng Việt từ ảnh scan 300 DPI** dùng **Tesseract Engine** và **OpenCV**.

| STT | Lý do lựa chọn OCR | Phân tích chi tiết |
|:---:|---|---|
| **1** | **Tính nền tảng của quy trình** | OCR là bước đầu vào của toàn bộ dòng dữ liệu (Tải file $\rightarrow$ **OCR** $\rightarrow$ Đối soát $\rightarrow$ Mã hóa $\rightarrow$ Tìm kiếm). Nếu OCR thất bại, toàn bộ hệ thống phía sau không thể vận hành. |
| **2** | **Đặc thù tiếng Việt phức tạp** | Tiếng Việt có nhiều thanh dấu và ký tự ghép phức tạp, cần chứng minh engine mã nguồn mở nhận dạng chính xác. |
| **3** | **Chất lượng ảnh scan thô** | Ảnh scan thực tế dễ bị nghiêng và nhiễu, cần kiểm chứng bước tiền xử lý ảnh có khắc phục được không. |
| **4** | **Trích xuất tọa độ Bounding Box** | Cần lấy chính xác tọa độ từng từ để hỗ trợ giao diện đối soát hai màn hình (Side-by-side UI). |
| **5** | **Tối ưu hóa chi phí** | Chứng minh giải pháp mã nguồn mở ($0$ VNĐ bản quyền) vẫn đáp ứng tốt yêu cầu kỹ thuật. |

---

### B4. Các đầu vào cần thiết và các bước thực hiện PoC là gì?

| Thành phần | Chi tiết thực hiện |
|---|---|
| **Đầu vào (5 thành phần)** | • **Tài liệu:** Product Backlog (PBI-01, PBI-02, PBI-04), Project Proposal (Mục 6.2), Architecture (Mục 3).<br>• **Dữ liệu & Công cụ:** 10 - 20 trang scan mẫu 300 DPI, Tesseract OCR (`vie`), OpenCV. |
| **Các bước (5 bước)** | 1. **Xác định bài toán:** Đặt mục tiêu OCR Tiếng Việt và trích xuất Bounding Box.<br>2. **Cài đặt môi trường:** Cài Tesseract, bộ dữ liệu tiếng Việt và thư viện OpenCV.<br>3. **Lập trình mã nguồn:** Xây dựng chuỗi: Nhận ảnh $\rightarrow$ Tiền xử lý $\rightarrow$ Chạy Tesseract $\rightarrow$ Xuất Text & Bounding Box.<br>4. **Thử nghiệm:** Chạy trên 20 trang mẫu, đo độ chính xác và thời gian.<br>5. **Đánh giá:** Đối chiếu tiêu chí chấp nhận và lập báo cáo PoC. |

---

### B5. Tại sao cần tạo sản phẩm Chứng minh ý tưởng?

| STT | Mục đích / Giá trị mang lại | Ý nghĩa thực tế trong dự án |
|:---:|---|---|
| **1** | **Giảm thiểu rủi ro kỹ thuật** | Phát hiện sớm các hạn chế khi xử lý dấu tiếng Việt, tránh thất bại khi phát triển chính thức. |
| **2** | **Thuyết phục các bên liên quan** | Cung cấp kết quả thực nghiệm trực quan để Product Owner và Giảng viên tin tưởng phê duyệt. |
| **3** | **Định hình kiến trúc hệ thống** | Làm cơ sở thiết kế mô hình Pipe & Filter và hàng chờ Redis/BullMQ trong tài liệu Kiến trúc. |
| **4** | **Hỗ trợ ước lượng chính xác** | Căn cứ cho giả định EST-A05 trong tài liệu Ước lượng để tự tin cam kết tiến độ 10 tuần. |
| **5** | **Tăng sự tự tin cho đội ngũ** | Bài toán kỹ thuật cốt lõi đã chạy được, giúp nhóm an tâm bước vào các Sprint phát triển. |

---

### B6. Sản phẩm PoC đã được sử dụng trong quá trình thực hiện dự án như thế nào?

| Phương diện | Chi tiết ứng dụng vào dự án |
|---|---|
| **Chuyển giao mã nguồn** | • Đóng gói logic tiền xử lý và OCR thành mô-đun nghiệp vụ Backend (NestJS Module).<br>• Kết nối với hàng chờ **Redis + BullMQ** để xử lý số hóa chạy ngầm.<br>• Dùng dữ liệu tọa độ Bounding Box để xây dựng **Giao diện đối soát Side-by-side** (PBI-04).<br>• Nạp văn bản vào **PostgreSQL** (chỉ mục `tsvector`) để phục vụ tìm kiếm toàn văn. |
| **Kế hoạch Sprint** | • **Sprint 1 - 2:** Hiện thực hóa PBI-01 (Tải tài liệu) và PBI-02 (Tesseract OCR chạy ngầm).<br>• **Sprint 2 - 3:** Hoàn thiện PBI-04 (Giao diện đối soát Side-by-side). |
| **Tham chiếu tài liệu** | • Làm nền tảng thiết kế Mục 3 trong tài liệu Kiến trúc (`LIBIF-Architecture.md`).<br>• Làm căn cứ cho giả định kỹ thuật EST-A05 trong tài liệu Ước lượng (`LIBIF-Project-Estimation.md`).<br>• Minh chứng cho cam kết tính khả thi trong Đề xuất dự án (`LIBIF-Project-Proposal.md`). |

---

## PHẦN C: SƠ ĐỒ LUỒNG GHI NHỚ NHANH (TRÌNH BÀY TRÊN GIẤY A4)

```
[BÀI TOÁN KỸ THUẬT CỐT LÕI]
OCR Tiếng Việt từ ảnh scan 300 DPI bằng Tesseract Engine + OpenCV
(Nền tảng quy trình số hóa, xử lý dấu phức tạp, trích xuất tọa độ Bounding Box, chi phí 0 VNĐ)
                                │
                                ▼
[5 ĐẦU VÀO] ──► [5 BƯỚC THỰC HIỆN]
• Backlog (PBI-01, 02, 04)      1. Xác định bài toán
• Proposal (Mục 6.2)            2. Cài đặt môi trường
• Architecture (Mục 3)          3. Lập trình PoC (Ảnh -> Tiền xử lý -> Tesseract -> Text & BBox)
• 20 trang scan mẫu 300 DPI     4. Thử nghiệm thực tế trên 20 trang mẫu
• Tesseract + OpenCV            5. Đánh giá kết quả & lập báo cáo
                                │
                                ▼
[KẾT QUẢ ĐÁNH GIÁ (6/6 ĐẠT)]
• Độ chính xác: 88% - 92% (Yêu cầu >= 85%)     • Tốc độ: 2 - 4 giây/trang (Yêu cầu <= 5s)
• Bounding Box: Khớp >= 90%                    • Xử lý dấu tiếng Việt: 85% - 90%
• Tiền xử lý ảnh: Tăng +12% - 18% độ chính xác • Hàng chờ Redis: Vận hành ổn định
==> Sai số 5% - 15% được xử lý qua Giao diện đối soát Side-by-side (Human-in-the-loop)
                                │
                                ▼
[TẠI SAO CẦN & ỨNG DỤNG VÀO DỰ ÁN]
• Mục đích: Giảm rủi ro -> Thuyết phục -> Thiết kế kiến trúc -> Hỗ trợ ước lượng -> Tạo sự tự tin
• Ứng dụng: Đưa vào NestJS Backend + Hàng chờ Redis/BullMQ -> Xây Side-by-side UI (Sprint 1-3)
```
