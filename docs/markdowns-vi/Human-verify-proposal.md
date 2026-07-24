# BÁO CÁO KIỂM THỬ THỰC TẾ & XÁC NHẬN BỞI CON NGƯỜI: ĐỀ XUẤT ĐÁNH GIÁ DỰ ÁN LIBIF

## Tóm tắt Điều hành

Tài liệu này trình bày kết quả xác nhận thực tế do con người thực hiện và kiểm thử sức chịu đựng (stress-test) phản biện đối với **Báo cáo Đề xuất Đánh giá LIBIF** ([evaluation-proposal.md](./evaluation-proposal.md)). Tài liệu giải quyết hai câu hỏi thẩm định cốt lõi về **đối thủ cạnh tranh trên thị trường, hiệu ứng/mức độ chấp nhận thị trường, các giải pháp thay thế tự làm (DIY - phối hợp công cụ có sẵn)**, và cuối cùng đưa ra câu trả lời cho việc liệu kết luận **ĐỒNG Ý (APPROVED)** (Điểm số có trọng số: **8.15 / 10**) có tiếp tục hiệu lực và khả thi để triển khai dự án hay không.

---

## 1. Giai đoạn Xác nhận 1: Phân tích Đối thủ Cạnh tranh & Cảnh quan Thị trường

### 1.1 Các Câu hỏi Cốt lõi được Điều tra
* Có các ứng dụng đối thủ hiện hữu nào giải quyết nhu cầu thị trường và quy mô thị trường được nêu trong đề xuất hay không?
* Hiệu ứng chấp nhận thị trường, điểm mạnh và hạn chế của các ứng dụng hiện hữu này là gì?
* Đánh giá ban đầu trong `evaluation-proposal.md` có phản ánh chính xác thực tế thị trường hay không?

### 1.2 Cảnh quan Đối thủ & Hiệu ứng Chấp nhận Thị trường

| Phân loại | Giải pháp Tiêu biểu | Mức độ Chấp nhận & Điểm mạnh | Hạn chế Cốt lõi & Khoảng trống Thị trường |
| :--- | :--- | :--- | :--- |
| **Kho Lưu trữ Học thuật Mở (Open-Source)** | **DSpace** *(Được sử dụng tại VNU, HCMUT, ĐH Đà Lạt, Phenikaa...)* | Được áp dụng rộng rãi trên thế giới và tại Việt Nam cho các bài báo khoa học, luận văn và kho lưu trữ nghiên cứu Mở (Open Access). | ❌ **Không có Bảo vệ DRM Tự thân (Native):** Chỉ kiểm soát đăng nhập/quyền truy cập; tệp PDF sau khi tải về có thể tự do phát tán.<br>❌ **Không hỗ trợ Tiếp nhận OCR Bất đồng bộ (Async OCR Ingest):** Yêu cầu tệp PDF phải có sẵn lớp văn bản (text layer).<br>❌ Cấu hình Solr/Tomcat phức tạp, giao diện người dùng cũ kỹ. |
| **Hệ thống Quản lý Thư viện Tích hợp (ILS)** | **Koha** *(Mã nguồn mở)* | Lựa chọn chuẩn hóa cho việc biên mục sách giấy, mượn trả và quản lý thư viện truyền thống. | ❌ Được thiết kế cho việc mượn trả sách vật lý; thiếu các tính năng đọc số trực tuyến và bảo mật DRM cho tài sản số. |
| **Phần mềm Doanh nghiệp Thương mại** | **Vebrary (Lạc Việt)**<br>**Libol (Tinh Vân)** | Tuân thủ đầy đủ các chuẩn quốc tế (MARC21, Z39.50); được triển khai tại các thư viện trung tâm đại học lớn. | ❌ **Chi phí Cao:** Chi phí bản quyền & bảo trì từ 125 triệu – 1,25 tỷ VNĐ/năm.<br>❌ Quá phức tạp (over-engineered) và cồng kềnh đối với các thư viện cấp khoa/bộ môn. |
| **Công cụ Tự phát / Khai thác Tạm thời (Ad-Hoc)** | **Google Drive, Zalo, OneDrive** | Miễn phí, phổ biến và có thể sử dụng ngay bởi cán bộ nhân viên khoa. | ❌ **Rủi ro Bản quyền Rất cao:** Hoàn toàn không có theo dõi phân phối hay DRM.<br>❌ Không hỗ trợ tìm kiếm OCR toàn văn trên hình ảnh sách quét.<br>❌ Hoàn toàn không có phân tích tình hình sử dụng. |

### 1.3 Kết luận Xác nhận Giai đoạn 1
Đánh giá của đề xuất đánh giá (**Nhu cầu Thị trường: 8.5/10**, **Lợi thế Cạnh tranh: 7.5/10**) đã được **XÁC NHẬN (VALIDATED)**. 

Các giải pháp hiện hữu trên thị trường để lại một **"Khoảng trống Số hóa Cấp Khoa"** rõ rệt:
* Các công cụ mã nguồn mở (DSpace) thiếu tính năng DRM chống sao chép.
* Các giải pháp doanh nghiệp (Vebrary) có chi phí quá đắt đỏ so với ngân sách cấp khoa.
* Các công cụ tạm thời (Google Drive) khiến đơn vị đối mặt với rủi ro pháp lý về bản quyền.

---

## 2. Giai đoạn Xác nhận 2: Kiểm thử Sức chịu đựng với Chuỗi Công cụ DIY Có sẵn

### 2.1 Các Câu hỏi Cốt lõi được Điều tra
* Người dùng có thể kết hợp các công cụ có sẵn (ví dụ: ABBYY FineReader + Google Drive "Chống tải về" + Calibre/Excel) mà không cần xây dựng LIBIF hay không?
* Nếu việc phối hợp DIY là khả thi, đề xuất đánh giá LIBIF có còn giá trị và đáng để triển khai hay không?

### 2.2 Tính Khả thi của việc Phối hợp Công cụ DIY Có sẵn (DIY Stack)

Về mặt lý thuyết, cán bộ thư viện *có thể* kết nối chuỗi các công cụ có sẵn như sau:

$$\text{Quét sách vật lý} \longrightarrow \text{ABBYY / OCRmyPDF (OCR)} \longrightarrow \text{Excel / Calibre (Biên mục Metadata)} \longrightarrow \text{Google Drive ("Chống tải về")}$$

Tuy nhiên, khi kiểm thử sức chịu đựng chuỗi DIY này, hàng loạt ma sát vận hành nghiêm trọng và lỗ hổng bảo mật đã bộc lộ:

| Tiêu chí So sánh | Phối hợp Công cụ DIY (Google Drive + ABBYY + Excel) | Hệ thống Tích hợp LIBIF |
| :--- | :--- | :--- |
| **Quy trình Làm việc của Cán bộ** | ❌ **Ma sát Cao:** Yêu cầu 3–4 ứng dụng riêng biệt cho mỗi cuốn sách (45–60 phút/cuốn). Nhập dữ liệu thủ công. | 🟢 **Thao tác Drag & Drop 1-Click:** Tự động lấy metadata từ ISBN, xếp hàng xử lý OCR bất đồng bộ trong background (Redis+BullMQ). |
| **Bảo vệ DRM & Bản quyền** | ❌ **Yếu (Lỗ hổng "Chống tải về"):** Google Drive chỉ vô hiệu hóa nút tải về. **Không có watermark động** (MSSV + IP) để truy vết người chụp màn hình phát tán tài liệu. | 🟢 **Vững chắc (HTML5 Canvas + Dynamic Watermark):** Chặn tải tệp PDF gốc, chèn đè MSSV, địa chỉ IP và dấu thời gian trực tiếp lên các trang đọc. |
| **Quản lý Quyền Truy cập** | ❌ **Gánh nặng Hành chính:** Cán bộ phải thêm/xóa hàng ngàn email sinh viên thủ công vào Google Groups mỗi học kỳ. | 🟢 **Tích hợp Tự động:** Tích hợp với hệ thống Đăng nhập một lần (SSO) của trường và dữ liệu đăng ký môn học. |
| **Tìm kiếm & Khai thác** | ❌ **Manh mún:** Sinh viên phải tìm kiếm trong tệp Excel để lấy liên kết Drive, dẫn đến sự đứt gãy trong biên mục. | 🟢 **Cổng thông tin Tập trung:** Tìm kiếm toàn văn OCR được đánh chỉ mục trực tiếp trên cổng thông tin học thuật đáp ứng (responsive web portal). |
| **Phân tích Tình hình Đọc** | ❌ **Không có:** Hoàn toàn không có dữ liệu về thời lượng đọc, giờ cao điểm hay các danh mục được quan tâm. | 🟢 **Bảng điều khiển Real-Time:** Phân tích toàn diện giúp giải trình ngân sách và hỗ trợ chương trình đào tạo. |

---

## 3. Ma trận Quyết định Chiến lược Cuối cùng: Có nên Triển khai LIBIF?

Dựa trên kết quả xác nhận thực nghiệm, kết luận **ĐỒNG Ý (8.15 / 10)** trong [evaluation-proposal.md](./evaluation-proposal.md) được **XÁC NHẬN (CONFIRMED)**, đi kèm với các điều kiện bối cảnh cụ thể:

```
                                  [Cây Quyết định Chiến lược]
                                              │
                 ┌────────────────────────────┴────────────────────────────┐
                 ▼                                                         ▼
    [Kịch bản A: KHÔNG XÂY DỰNG]                              [Kịch bản B: TRIỂN KHAI LIBIF]
  • Quy mô kho sách < 50–100 cuốn                         • Quy mô kho sách > 300–1,000+ cuốn
  • Tài liệu là Mở (Open Access, không cần DRM)           • Giáo trình/tài liệu nội bộ có bản quyền
  • Không có đội ngũ bảo trì CNTT lâu dài                 • Cần tự động hóa tiếp nhận OCR & Canvas DRM
  ➜ Sử dụng chuỗi DIY (Google Drive + ABBYY)              ➜ Triển khai Đề xuất Dự án LIBIF
```

### 3.1 Kịch bản A: Khi LIBIF KHÔNG cần thiết
Nếu thư viện chỉ quản lý dưới 100 cuốn sách mở (open-access) và không có nhu cầu bảo vệ bản quyền, việc xây dựng phần mềm riêng là không hiệu quả. **Chuỗi công cụ DIY (Google Drive + ABBYY FineReader)** là đã đủ đáp ứng.

### 3.2 Kịch bản B: Khi LIBIF được KHUYẾN NGHỊ MẠNH MẼ (Mục tiêu Cốt lõi)
Khi một khoa đại học quản lý hàng trăm cuốn sách có bản quyền, yêu cầu quy trình tự động hóa OCR, cần truy vết rò rỉ ảnh chụp màn hình thông qua watermark động và mong muốn một cổng thông tin quản lý tập trung, **LIBIF mang lại hiệu quả đầu tư (ROI) vượt trội** (chi phí vận hành khoảng 70,4 triệu VNĐ/năm so với hàng trăm triệu cho phần mềm thương mại, tiết kiệm 375–500 giờ công lao động cho mỗi 500 cuốn sách).

---

## 4. Kết luận Xác nhận & Khuyến nghị

1. **Tái xác nhận Đánh giá:** Báo cáo đề xuất đánh giá ([evaluation-proposal.md](./evaluation-proposal.md)) đã xác định chính xác khoảng trống thị trường, tính khả thi kỹ thuật và hiệu quả kinh tế.
2. **Trọng tâm Trọng yếu Tạo Lợi thế:** Quá trình triển khai phải nhấn mạnh đặc biệt vào **HTML5 Canvas DRM với Dynamic Watermarking** và **Tiếp nhận OCR Bất đồng bộ trong Background**, bởi hai tính năng này đại diện cho "rào cản kỹ thuật" (technical moat) chính phân biệt LIBIF với quy trình làm việc Google Drive thông thường.
3. **Hành động Tiếp theo:** Tiến hành triển khai dự án LIBIF theo kết quả đã phê duyệt, tập trung thử nghiệm ban đầu tại các thư viện cấp khoa có lưu lượng sử dụng lớn (như Thư viện Khoa CNTT - HCMUS).
