# BÁO CÁO ĐÁNH GIÁ ĐỀ XUẤT DỰ ÁN (PROJECT PROPOSAL EVALUATION)
## Dự án: LIBIF — Hệ thống Số hóa Thư viện Thông minh

Báo cáo này đánh giá ý tưởng dự án **LIBIF** được đề xuất trong tài liệu [Project-Proposal.md](./Project-Proposal.md).

---

## I. Đánh giá chi tiết theo 10 tiêu chí (Thang điểm 10)

### 1. Problem Validation (Xác thực vấn đề)
* **Điểm:** **9.0 / 10**
* **Nhận xét:** Vấn đề được xác định rất rõ ràng và thực tế thông qua case study tại thư viện khoa CNTT - HCMUS. Quy trình thủ công hiện tại gây ra 3 tổn thất nghiêm trọng: tổn thất nhân lực (thủ thư mất 45-60 phút/đầu sách), tổn thất tiếp cận (sinh viên mất 24-72 giờ để có tài liệu), và tổn thất bản quyền (lọt file PDF ra ngoài không kiểm soát). Đây là nỗi đau thực sự ("đủ đau") có số liệu chứng minh cụ thể.

### 2. Market Need (Nhu cầu thị trường)
* **Điểm:** **8.5 / 10**
* **Nhận xét:** Nhu cầu cực kỳ cấp thiết từ cả ba nhóm stakeholders chính: Thủ thư (muốn giảm tải việc nhập liệu thủ công), Sinh viên (muốn tra cứu và đọc tài liệu tức thì 24/7), và Ban quản lý (muốn có dashboard giám sát ROI và tiến độ chuyển đổi số). Ý tưởng giải quyết đúng nỗi đau trực tiếp của người dùng.

### 3. Market Size & Reach (Quy mô & Khả năng tiếp cận thị trường)
* **Điểm:** **7.5 / 10**
* **Nhận xét:** Mặc dù dự án bắt đầu ở quy mô một khoa/trường (HCMUS), giải pháp số hóa thư viện tự động tích hợp OCR tiếng Việt có thể mở rộng ra hàng trăm trường đại học, cao đẳng và hàng ngàn thư viện trường học, thư viện công cộng tại Việt Nam. Tuy nhiên, đề xuất hiện tại chưa vạch rõ lộ trình thương mại hóa hoặc kế hoạch tiếp cận thị trường ngoài phạm vi thử nghiệm nội bộ.

### 4. Business Impact (Tác động kinh doanh)
* **Điểm:** **9.0 / 10**
* **Nhận xét:** Chỉ số tác động định lượng (KPI) rất rõ ràng: giảm 70% thời gian xử lý sách của thủ thư, giảm thời gian sinh viên tiếp cận từ ngày xuống còn dưới 5 giây, kiểm soát phát tán lậu tài liệu về mức tối thiểu nhờ Canvas Reader. Tác động dài hạn giúp tăng hiệu quả học tập của sinh viên và thúc đẩy chuyển đổi số giáo dục.

### 5. Business Viability (Khả năng tài chính & vận hành)
* **Điểm:** **8.0 / 10**
* **Nhận xét:** 
  * Chi phí phát triển ban đầu (One-time Dev Budget): **62.500.000 VNĐ** (cho 4 sinh viên trong 8 tuần) là rất hợp lý và khả thi cho một dự án cấp khoa/trường.
  * Chi phí vận hành thường niên (Recurring Operating Budget): **70.440.000 VNĐ/năm** (trong đó hạ tầng Cloud AWS chiếm 28,44 triệu/năm) cần được cân nhắc kỹ đối với ngân sách của một khoa. Tuy nhiên, nếu so sánh với việc mua phần mềm thương mại (125M - 1.25B VNĐ/năm) thì phương án này tối ưu hơn rất nhiều.

### 6. Technical Feasibility & Complexity (Khả thi & Độ phức tạp kỹ thuật)
* **Điểm:** **9.0 / 10**
* **Nhận xét:** 
  * Công nghệ OCR tiếng Việt (VietOCR & PaddleOCR) đã bước vào giai đoạn chín muồi với độ chính xác thực tế từ 95-98% (đối với tài liệu in tương đối chuẩn).
  * Kiến trúc hệ thống phân tách giữa Web Server và OCR Worker (chạy hàng đợi Redis) giúp hạn chế lỗi tràn bộ nhớ (OOM) khi xử lý file nặng.
  * Giải pháp bảo mật bằng Canvas Reader kết hợp AWS Presigned URLs là một hướng đi thông minh, khả thi về mặt kỹ thuật mà không cần tích hợp các hệ thống DRM phức tạp và đắt đỏ.

### 7. Competitive Advantage / Moat (Lợi thế cạnh tranh)
* **Điểm:** **7.0 / 10**
* **Nhận xét:** Lợi thế cạnh tranh lớn nhất là khả năng tối ưu hóa sâu cho ngôn ngữ tiếng Việt (OCR diacritics) và quy trình nghiệp vụ đặc thù của thư viện Việt Nam. Tuy nhiên, rào cản công nghệ (moat) không quá cao vì các thư viện mã nguồn mở đều được công khai. Lợi thế cốt lõi sẽ nằm ở trải nghiệm người dùng (UX) tinh gọn và tốc độ triển khai thực tế.

### 8. Growth Potential (Tiềm năng tăng trưởng)
* **Điểm:** **8.0 / 10**
* **Nhận xét:** Theo Quyết định 206/QĐ-TTg của Thủ tướng Chính phủ về Chương trình chuyển đổi số ngành thư viện, nhu cầu số hóa thư viện là bắt buộc và có nguồn ngân sách nhà nước hỗ trợ. LIBIF có tiềm năng tăng trưởng lớn bằng cách đóng gói giải pháp thành mô hình SaaS hoặc chuyển giao công nghệ cho các cơ sở giáo dục khác.

### 9. Risk Assessment (Đánh giá rủi ro)
* **Điểm:** **7.5 / 10**
* **Nhận xét:** Dự án đã xác định tốt các rủi ro về tiến độ (8 tuần), khả năng thích ứng của thủ thư và rủi ro phình chướng yêu cầu (scope creep). Tuy nhiên, **rủi ro pháp lý về bản quyền tài liệu** chưa được giải quyết triệt để. Mặc dù Canvas Reader chặn download file, nhưng việc tự ý số hóa và phân phối nội bộ sách giáo trình vẫn có thể vi phạm Luật Sở hữu trí tuệ nếu chưa có sự đồng ý của tác giả/nhà xuất bản.

### 10. Evidence Confidence (Mức độ tin cậy của dữ liệu)
* **Điểm:** **8.5 / 10**
* **Nhận xét:** Các giả định về thời gian xử lý thủ công, nhu cầu sinh viên và chi phí hạ tầng (AWS EC2, S3, thù lao nhân sự) đều được tính toán dựa trên dữ liệu thực tế tại Việt Nam năm 2026. Mức độ tin cậy của dữ liệu ở mức cao.

---

## II. Tổng kết điểm số & Quyết định đề xuất

### 1. Bảng điểm tổng hợp

| STT | Tiêu chí | Điểm số (Thang 10) | Trọng số đề xuất | Điểm có trọng số |
|:---:|---|:---:|:---:|:---:|
| 1 | Problem Validation | 9.0 | 15% | 1.35 |
| 2 | Market Need | 8.5 | 10% | 0.85 |
| 3 | Market Size & Reach | 7.5 | 10% | 0.75 |
| 4 | Business Impact | 9.0 | 15% | 1.35 |
| 5 | Business Viability | 8.0 | 10% | 0.80 |
| 6 | Technical Feasibility & Complexity | 9.0 | 15% | 1.35 |
| 7 | Competitive Advantage / Moat | 7.0 | 5% | 0.35 |
| 8 | Growth Potential | 8.0 | 5% | 0.40 |
| 9 | Risk Assessment | 7.5 | 10% | 0.75 |
| 10| Evidence Confidence | 8.5 | 5% | 0.425 |
| | **TỔNG ĐIỂM TRUNG BÌNH** | **8.2 / 10** | **100%** | **8.375 / 10** |

### 2. Kết luận & Quyết định: **ĐỒNG Ý (APPROVE)**

> [!NOTE]
> Dự án **LIBIF** được đánh giá rất cao về tính thực tiễn, mức độ khả thi kỹ thuật và khả năng giải quyết trực tiếp các điểm nghẽn của quy trình quản lý thư viện hiện tại. Do đó, quyết định đưa ra là **ĐỒNG Ý** cho phép triển khai, đi kèm với một số khuyến nghị khắc phục rủi ro về mặt pháp lý bản quyền tài liệu.

---

## III. QUY TRÌNH THẨM ĐỊNH & PHẢN BIỆN BỞI CON NGƯỜI (HUMAN-IN-THE-LOOP REVIEW WORKFLOW)

Bản đánh giá 10 tiêu chí trên ban đầu được sinh ra bởi hệ thống **AI Assistant** dựa trên phân tích dữ liệu tài liệu đề xuất. Để đảm bảo tính chính xác khách quan và loại bỏ hoàn toàn rủi ro sai lệch, quy trình kiểm duyệt **Human-in-the-loop** đã được thực thi theo 3 bước:

```
[ AI Assistant ]  ──►  [ Human Expert Review ]  ──►  [ Final Panel Sign-off ]
 (Bản phác thảo 10 tiêu chí)  (Phản biện & Điều chỉnh điểm)  (Phê duyệt chính thức)
```

1. **Bước 1 — AI Initial Assessment (Dự thảo AI):** Trợ lý AI thực hiện đọc hiểu tài liệu, đối chiếu tiêu chí và đề xuất bảng điểm 10 mục cùng các đoạn nhận xét định lượng ban đầu.
2. **Bước 2 — Human Expert Review & Override (Thẩm định & Điều chỉnh điểm):** Hội đồng thẩm định gồm **Project Manager (PM)** và **Lead Architect** rà soát lại từng tiêu chí:
   - *Kiểm tra dữ liệu chi phí:* Hội đồng xác nhận ngân sách MVP đã điều chỉnh từ 62.5M VNĐ (4 nhân sự) lên 90.5M VNĐ (6 nhân sự), yêu cầu bổ sung diễn giải trong Tiêu chí 5.
   - *Kiểm tra rủi ro bản quyền:* Hội đồng đánh giá rủi ro bản quyền (Tiêu chí 9) là điểm trọng yếu, yêu cầu bắt buộc áp dụng công nghệ DRM Canvas Reader đã thử nghiệm trong PoC.
3. **Bước 3 — Human Sign-off (Phê duyệt chính thức):** Giám đốc dự án ký phê duyệt chốt bảng điểm 8.375/10 và cấp phép triển khai dự án.

