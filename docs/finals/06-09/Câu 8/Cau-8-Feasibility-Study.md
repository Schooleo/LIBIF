# CÂU 8: BÁO CÁO TÍNH KHẢ THI (FEASIBILITY STUDY REPORT)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Báo cáo tính khả thi (Feasibility Study Report) của nhóm. (Sinh viên nộp kèm bản in tài liệu Báo cáo tính khả thi của nhóm.)

---

## 📋 TÀI LIỆU CẦN IN VÀ NỘP KÈM

| STT | Tài liệu nộp kèm | Nguồn tài liệu | Nội dung minh chứng |
|:---:|---|---|---|
| **1** | **Bản in Báo cáo phân tích tính khả thi** | `LIBIF-Project-Proposal.md` (Mục 6: Phân tích Tính Khả thi) | Văn bản chính thức phân tích 6 khía cạnh khả thi (Kinh doanh, Kỹ thuật, Vận hành, Tài chính, Tiến độ, Pháp lý) và kết luận phê duyệt dự án. |
| **2** | *(Tham chiếu bổ sung)* Bảng phân tích chi tiết 8 khía cạnh | `LIBIF-Presentation.html` (Slide 5 & 6) | Minh chứng tóm tắt trực quan các chỉ số khả thi và phương án giảm thiểu rủi ro. |

---

## PHẦN A: QUÁ TRÌNH HÌNH THÀNH VÀ PHƯƠNG PHÁP ĐÁNH GIÁ

### I. QUÁ TRÌNH HÌNH THÀNH BÁO CÁO TÍNH KHẢ THI

#### 1. Bối cảnh và Mục tiêu của Báo cáo
* **Bối cảnh:** Trước khi đầu tư công sức và tiền bạc vào xây dựng hệ thống Thư viện số thương mại, nhóm phải trả lời câu hỏi cốt lõi: *"Dự án này có đáng làm không và có khả năng làm được hay không?"*
* **Mục tiêu:** Đánh giá toàn diện các yếu tố ảnh hưởng đến sự thành bại của dự án, nhằm cung cấp dữ liệu thực tế giúp Product Owner và Giảng viên ra quyết định **Làm tiếp hay Dừng lại (Go / No-Go Decision)**.

#### 2. Các tài liệu và dữ liệu đầu vào cần thiết

| STT | Dữ liệu đầu vào | Vai trò đóng góp cho Báo cáo |
|:---:|---|---|
| **1** | **Khảo sát thị trường & nghiệp vụ** | Nhu cầu chuyển đổi số thực tế tại các trường đại học và thư viện tỉnh/thành phố (`LIBIF-Project-Proposal.md` Mục 1 & 2). |
| **2** | **Kết quả thực nghiệm từ mã PoC** | Minh chứng kỹ thuật nhận dạng chữ tiếng Việt (Tesseract OCR) và bảo mật trình đọc Canvas hoàn toàn chạy được. |
| **3** | **Khảo sát người dùng (Thủ thư)** | Phản hồi thực tế của thủ thư về luồng đối soát hai màn hình (`LIBIF-Project-Vision-Scope.md`). |
| **4** | **Dữ liệu ước lượng nguồn lực** | Khung thời gian 10 tuần, năng lực 6 sinh viên và ngân sách hạ tầng tối ưu (`LIBIF-Project-Estimation.md`). |
| **5** | **Văn bản pháp lý hiện hành** | Luật Sở hữu trí tuệ và Luật An ninh mạng Việt Nam về bản quyền tài liệu số. |

#### 3. Quá trình 5 bước hình thành Báo cáo

| Bước | Tên bước | Công việc thực tế nhóm đã làm |
|:---:|---|---|
| **B1** | **Xác định các khía cạnh cần đánh giá** | Lựa chọn 6 khía cạnh trọng yếu: Kinh doanh, Kỹ thuật, Vận hành, Tài chính, Tiến độ và Pháp lý. |
| **B2** | **Thu thập dữ liệu & Đo lường thực tế** | Chạy thử nghiệm kỹ thuật (PoC), khảo sát thủ thư và tìm hiểu chi phí máy chủ thực tế. |
| **B3** | **Phân tích chi tiết từng khía cạnh** | Đánh giá điểm thuận lợi, khó khăn và đề xuất phương án giải quyết cho từng khía cạnh. |
| **B4** | **Nhận diện rủi ro & Phương án ứng phó** | Lập danh sách rủi ro tiềm ẩn (như OCR sai lệch, tiến độ gấp) và kế hoạch xử lý dự phòng. |
| **B5** | **Tổng hợp & Đưa ra kết luận (Go/No-Go)** | Đóng gói thành Mục 6 trong tài liệu Đề xuất dự án và kết luận dự án **Khả thi cao, sẵn sàng triển khai**. |

---

### II. PHƯƠNG PHÁP VÀ KẾT QUẢ ĐÁNH GIÁ BÁO CÁO TÍNH KHẢ THI

#### 1. Bảng đánh giá 6 khía cạnh khả thi trọng yếu

| Khía cạnh | Câu hỏi cốt lõi | Kết quả phân tích thực tế của nhóm | Đánh giá |
|---|---|---|:---:|
| **1. Kinh doanh** | Thị trường có cần không? Có bán được không? | Nhu cầu số hóa thư viện rất lớn. Mô hình thu phí linh hoạt (bán gói phần mềm hoặc thu phí theo tài khoản). | **Khả thi cao** |
| **2. Kỹ thuật** | Nhóm có đủ công nghệ và làm chủ được không? | Dùng Tesseract OCR miễn phí + OpenCV tiền xử lý ảnh; trình duyệt hỗ trợ tốt HTML5 Canvas để bảo vệ bản quyền. | **Khả thi** |
| **3. Vận hành** | Thủ thư có dùng được không? Quy trình có tiện không? | Giao diện chia đôi màn hình mô phỏng đúng thói quen làm việc, thủ thư dùng được ngay không cần đào tạo IT sâu. | **Khả thi cao** |
| **4. Tài chính** | Chi phí có nằm trong tầm tay không? | Chi phí bản quyền OCR $= 0$ VNĐ; hạ tầng thử nghiệm tối ưu khoảng $4.000.000$ VNĐ cho máy chủ staging. | **Khả thi** |
| **5. Tiến độ** | 10 tuần (5 Sprint) có làm kịp không? | 6 sinh viên tập trung làm 13 tính năng cốt lõi (Must Have); các tính năng phụ có thể hoãn lại nếu thiếu giờ. | **Khả thi** |
| **6. Pháp lý** | Có vi phạm bản quyền không? | Tuân thủ Luật Sở hữu trí tuệ; hệ thống có chức năng ghi nhật ký xem sách để giải trình minh bạch với Nhà xuất bản. | **Khả thi cao** |

#### 2. Kết luận đánh giá của Hội đồng / Giảng viên
* Báo cáo được Hội đồng/Giảng viên thẩm định và thông qua, đưa ra quyết định **"GO" (Chấp thuận đầu tư thực hiện dự án)**.
* Kết quả phân tích khả thi trở thành căn cứ pháp lý để ký duyệt **Ủy nhiệm dự án (Project Charter)**.

---

## PHẦN B: 5 CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Các câu hỏi chính cần trả lời trong tài liệu Báo cáo tính khả thi là gì?
Tài liệu cần trả lời 6 câu hỏi lớn tương ứng với 6 khía cạnh:
1. **Kinh doanh:** Thị trường có nhu cầu thực tế không và mô hình kinh doanh có mang lại doanh thu bền vững không?
2. **Kỹ thuật:** Nhóm có đủ công nghệ và năng lực giải quyết bài toán OCR và bảo vệ bản quyền không?
3. **Vận hành:** Quy trình mới có phù hợp với thói quen của thủ thư và độc giả không?
4. **Tài chính:** Dự án tốn bao nhiêu chi phí và có cần mua các bản quyền phần mềm đắt đỏ không?
5. **Tiến độ:** Nhóm có hoàn thành được sản phẩm mẫu trong thời hạn 10 tuần (5 Sprint) không?
6. **Pháp lý:** Phần mềm có tuân thủ Luật Sở hữu trí tuệ và bảo vệ được quyền tác giả không?

---

### B2. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Báo cáo tính khả thi là gì?
* **5 Đầu vào:** Khảo sát nhu cầu thị trường + Kết quả chạy thử mã PoC + Khảo sát ý kiến thủ thư + Dữ liệu ước lượng thời gian/chi phí + Luật Sở hữu trí tuệ.
* **5 Bước thực hiện:**
  1. Xác định 6 khía cạnh cần đánh giá.
  2. Thu thập số liệu đo lường thực tế.
  3. Phân tích chi tiết từng khía cạnh khả thi.
  4. Lập danh sách rủi ro và phương án ứng phó.
  5. Tổng hợp báo cáo và kết luận quyết định "Go / No-Go".

---

### B3. Tài liệu Báo cáo tính khả thi của nhóm đã được đánh giá thế nào?
* **Đánh giá đa chiều:** Nhóm tự đánh giá chéo giữa các thành viên (Tech Lead kiểm tra kỹ thuật, Scrum Master kiểm tra tiến độ, Product Owner kiểm tra kinh doanh).
* **Kiểm chứng bằng thực nghiệm:** Tính khả thi kỹ thuật được chứng minh bằng mã nguồn chạy được thực tế từ sản phẩm PoC.
* **Kết quả phê duyệt:** Cả 6 khía cạnh đều đạt mức **Khả thi cao**, được Giảng viên/Product Owner đồng ý phê duyệt quyết định **"GO"** để chuyển sang giai đoạn lập kế hoạch chi tiết.

---

### B4. Tại sao cần tạo tài liệu Báo cáo tính khả thi? (5 lý do then chốt)
1. **Tránh đầu tư sai lầm:** Ngăn chặn việc lãng phí thời gian, công sức và tiền bạc vào một dự án không thể thực hiện được.
2. **Nhận diện rủi ro từ sớm:** Giúp nhóm nhìn thấy trước các khó khăn (như sai số OCR, áp lực tiến độ) để chuẩn bị phương án dự phòng.
3. **Căn cứ ra quyết định Go/No-Go:** Cung cấp bức tranh toàn cảnh khách quan để người có thẩm quyền quyết định có nên làm dự án hay không.
4. **Định hướng lựa chọn công nghệ:** Giúp nhóm tự tin chọn các công nghệ mã nguồn mở miễn phí ($0$ VNĐ) để tiết kiệm ngân sách.
5. **Làm nền tảng cho việc lập kế hoạch:** Các con số ước lượng trong báo cáo là cơ sở để viết tài liệu Kế hoạch và Dự toán sau này.

---

### B5. Tài liệu Báo cáo tính khả thi của nhóm đã được sử dụng trong quá trình thực hiện dự án như thế nào?
* **Đầu vào để viết Project Charter:** Kết luận khả thi là căn cứ trực tiếp để nhóm lập và ký duyệt tài liệu Ủy nhiệm dự án (`LIBIF-Project-Charter.md`).
* **Định hình thiết kế kiến trúc:** Báo cáo xác nhận dùng công nghệ $0$ VNĐ phí bản quyền $\rightarrow$ Kiến trúc sư thiết kế hệ thống quanh Tesseract OCR và PostgreSQL (`LIBIF-Architecture.md`).
* **Căn cứ quản lý phạm vi và tiến độ:** Khi làm việc trong 10 tuần, nhóm bám sát nguyên tắc ưu tiên 13 tính năng bắt buộc (Must Have) đã nêu trong báo cáo khả thi.
* **Hồ sơ quản lý rủi ro:** Các phương án giảm thiểu rủi ro trong báo cáo được đưa vào bảng theo dõi rủi ro của từng Sprint.

---

## PHẦN C: SƠ ĐỒ LUỒNG GHI NHỚ NHANH (VẼ TRÊN GIẤY A4)

```
[MỤC TIÊU BÁO CÁO TÍNH KHẢ THI]
Trả lời câu hỏi cốt lõi: "Dự án có đáng làm và có làm được không?" -> Đưa ra quyết định Go / No-Go
                                │
                                ▼
[5 ĐẦU VÀO] ──► [5 BƯỚC HÌNH THÀNH]
• Khảo sát thị trường số hóa      1. Xác định 6 khía cạnh đánh giá
• Kết quả chạy thực nghiệm PoC    2. Thu thập dữ liệu & đo lường thực tế
• Phản hồi thực tế từ Thủ thư     3. Phân tích chi tiết từng khía cạnh
• Ước lượng 10 tuần & chi phí     4. Nhận diện rủi ro & phương án ứng phó
• Luật Sở hữu trí tuệ             5. Tổng hợp báo cáo & kết luận khả thi
                                │
                                ▼
[KẾT QUẢ ĐÁNH GIÁ 6 KHÍA CẠNH (TẤT CẢ ĐẠT KHẢ THI)]
1. Kinh doanh: Nhu cầu lớn, thu phí linh hoạt    4. Tài chính: Tiết kiệm tối đa, 0 VNĐ phí bản quyền
2. Kỹ thuật: Tesseract + OpenCV + Canvas DRM      5. Tiến độ: 10 tuần (5 Sprint) cho 13 Must Have
3. Vận hành: Giao diện chia đôi dễ dùng           6. Pháp lý: Tuân thủ Luật SHTT, có nhật ký giải trình
==> KẾT LUẬN: Ra quyết định "GO" (Đủ điều kiện phê duyệt khởi động dự án)
                                │
                                ▼
[TẠI SAO CẦN & ỨNG DỤNG VÀO DỰ ÁN]
• Lý do: Tránh đầu tư sai lầm -> Nhận diện rủi ro sớm -> Căn cứ ra quyết định Go/No-Go
• Ứng dụng: Đầu vào viết Project Charter -> Định hướng công nghệ Architecture -> Quản lý rủi ro Sprint
```
