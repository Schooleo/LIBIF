# CÂU 12 – PHÁT BIỂU CÔNG VIỆC (STATEMENT OF WORK) & HỢP ĐỒNG PHẦN MỀM

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Phát biểu công việc (Statement of Work - SOW) của nhóm.  
> **Kèm theo:** Bản in tài liệu Phát biểu công việc của nhóm (`LIBIF-Statement-Of-Work.md` / `Q12-print.md`).

---

## PHẦN 1: BÀI VIẾT TAY A4 (Dành cho 10 phút viết nhanh trên giấy thi)

*Mẹo: Vào phòng thi, vẽ ngay bảng so sánh 3 tài liệu và bảng đối chiếu 2 loại hợp đồng để lấy trọn điểm lý thuyết và thực tiễn.*

```
+---------------------------------------------------------------------------------------------------+
|               BÀI TRÌNH BÀY VẤN ĐÁP A4 - CÂU 12: PHÁT BIỂU CÔNG VIỆC & HỢP ĐỒNG (LIBIF)            |
+---------------------------------------------------------------------------------------------------+

1. ĐỊNH NGHĨA & MỤC ĐÍCH STATEMENT OF WORK (SOW)
- SOW là "Thỏa thuận phạm vi kỹ thuật và cam kết bàn giao" giữa Bên thực hiện (Nhóm 6 SV) và 
  Bên đánh giá/nghiệm thu (Giảng viên / Khách hàng đại diện).
- Xác định rõ: Làm gì (Scope), Bàn giao gì (8 Deliverables), Tiêu chuẩn nào (Acceptance Criteria),
  Khi nào xong (10 tuần, 5 mốc G1-G5), Trách nhiệm mỗi bên, Giới hạn ngoài phạm vi (Out-of-scope).

2. QUÁ TRÌNH HÌNH THÀNH (Đầu vào -> Phương pháp -> Đầu ra)
- Đầu vào (Inputs): Project Charter, Vision & Scope, Product Backlog, Architecture, PoC, Project Estimation.
- Các bước thực hiện (Steps):
  + Bước 1: Xác định mục tiêu sản phẩm (MVP thư viện số DRM) & mục tiêu học tập môn học.
  + Bước 2: Rà soát & cố định 8 gói công việc (WP-01 -> WP-08), phân định In-scope vs Out-of-scope.
  + Bước 3: Xác lập danh mục 8 sản phẩm bàn giao (DEL-01 -> DEL-08) kèm hạn nộp và định dạng.
  + Bước 4: Xây dựng tiêu chí chấp nhận cụ thể: 8 tiêu chí sản phẩm (AC-01..08) + 6 tiêu chí QLDA.
  + Bước 5: Thống nhất lịch trình 5 Sprint, phân công nguồn lực, ngân sách (8.8M) và cơ chế nghiệm thu.
- Đầu ra: Bản SOW chính thức 16 mục làm căn cứ nghiệm thu và bảo vệ đồ án cuối kỳ.

3. SO SÁNH THỜI GIAN & CHI PHÍ: PROPOSAL vs ESTIMATION vs SOW
+-----------------------+-----------------------------+----------------------------+-----------------------------+
| Tiêu chí so sánh      | Đề xuất dự án (Proposal)   | Ước lượng dự án (Estimate) | Phát biểu công việc (SOW)   |
+-----------------------+-----------------------------+----------------------------+-----------------------------+
| Bản chất              | Chào hàng & Xin phê duyệt   | Tính toán & Phân tích kỹ   | Cam kết phạm vi bàn giao    |
| Thời gian (Schedule)  | Mục tiêu sơ bộ / 7 tháng    | 10 tuần, 5 Sprint (±20-30%)| 10 tuần cố định (Mốc G1-G5) |
| Chi phí (Cost)        | Khái toán / Ngân sách dự trù| 8.8M VNĐ (phân tích kịch bản)| 8.8M VNĐ (Hạn mức & Trần 10M)|
+-----------------------+-----------------------------+----------------------------+-----------------------------+

4. PHÂN BIỆT HỢP ĐỒNG GIÁ CỐ ĐỊNH (FIXED-PRICE) vs THEO THỜI GIAN & VẬT TƯ (T&M)
+-----------------------+---------------------------------------------+---------------------------------------------+
| Đặc điểm so sánh      | Hợp đồng Giá Cố Định (Fixed-Price)          | Hợp đồng Theo Thời gian & Vật tư (T&M)     |
+-----------------------+---------------------------------------------+---------------------------------------------+
| Giá & Phạm vi         | Cố định 1 mức giá cho toàn bộ phạm vi chốt  | Thanh toán theo giờ công thực tế + vật tư   |
| Phân bổ rủi ro        | Bên bán (Supplier) chịu phần lớn rủi ro     | Bên mua (Customer) chịu phần lớn rủi ro     |
| Độ linh hoạt thay đổi | Thấp (Change Request tốn kém & phức tạp)    | Rất cao (thay đổi yêu cầu dễ dàng)          |
| Phù hợp khi nào?      | Yêu cầu rõ ràng, công nghệ quen thuộc       | Dự án R&D, yêu cầu mơ hồ, thay đổi liên tục |
+-----------------------+---------------------------------------------+---------------------------------------------+
```

---

## PHẦN 2: GIẢI THÍCH LÝ THUYẾT CHI TIẾT (Dành cho thành viên ôn tập & hiểu sâu)

### 2.1 Bản chất của Phát biểu công việc (Statement of Work - SOW)
- **Định nghĩa:** Statement of Work (SOW) là tài liệu mô tả chi tiết các yêu cầu công việc cụ thể cho một dự án. SOW đóng vai trò là **phụ lục kỹ thuật cốt lõi** gắn liền với Hợp đồng dịch vụ phần mềm hoặc là thỏa thuận chính thức giữa khách hàng và nhóm phát triển.
- **Nội dung cấu thành chuẩn của một SOW (Slide 06):**
  1. *Scope of Work (Phạm vi công việc):* Mô tả chi tiết những gì sẽ làm (In-scope) và nêu rõ những gì **không làm** (Out-of-scope) để tránh hiện tượng phình phạm vi (Scope Creep).
  2. *Location of Work & Resources:* Địa điểm làm việc, thiết bị, môi trường máy chủ và phân bổ nhân sự.
  3. *Period of Performance / Schedule:* Thời gian thực hiện, các mốc kiểm tra (Checkpoints) và ngày bàn giao cuối cùng.
  4. *Deliverables Schedule:* Danh mục cụ thể các sản phẩm bàn giao (mã nguồn, tài liệu, file cấu hình, bộ test...).
  5. *Applicable Standards / Quality:* Tiêu chuẩn kỹ thuật, tiêu chuẩn mã nguồn (Coding standards), quy trình QA.
  6. *Acceptance Criteria (Tiêu chí chấp nhận):* Các điều kiện rõ ràng, có thể kiểm chứng được để khách hàng đồng ý ký biên bản nghiệm thu.
  7. *Special Requirements:* Quy định bảo mật, quyền sở hữu trí tuệ (IP), bản quyền dữ liệu và việc sử dụng công cụ bên thứ ba (AI/Coding Agent).

### 2.2 Hợp đồng dự án phần mềm (Software Contract)
- **Định nghĩa:** Là văn bản pháp lý ràng buộc quyền và nghĩa vụ giữa hai bên: **Khách hàng (Client/Customer)** và **Nhà cung cấp/Nhà phát triển (Developer/Supplier)**.
- **8 câu hỏi chính cần trả lời trong Hợp đồng phần mềm:**
  1. *Ai là các bên tham gia (Parties)?* Thông tin pháp lý của Bên A (Khách hàng) và Bên B (Nhà phát triển).
  2. *Công việc cần thực hiện là gì (Services & Deliverables)?* Dẫn chiếu chi tiết đến SOW.
  3. *Giá trị và phương thức thanh toán ra sao (Price & Payment Terms)?* Trọn gói hay theo giờ, thanh toán theo tiến độ mốc (Milestone-based) hay định kỳ.
  4. *Thời hạn thực hiện và bàn giao là khi nào (Term & Schedule)?* Ngày bắt đầu, các mốc nghiệm thu và hạn chót.
  5. *Tiêu chuẩn nghiệm thu và quy trình bàn giao như thế nào (Acceptance Procedure)?* Thời gian kiểm thử nghiệm thu (UAT), cách xử lý khi không đạt.
  6. *Quyền sở hữu trí tuệ thuộc về ai (Intellectual Property Rights)?* Mã nguồn, bản quyền thiết kế thuộc về khách hàng hay nhà phát triển giữ bản quyền nền tảng.
  7. *Bảo hành và hỗ trợ sau triển khai ra sao (Warranty & Maintenance)?* Thời gian bảo hành lỗi miễn phí (ví dụ 3-6 tháng), SLA phản hồi sự cố.
  8. *Điều khoản chấm dứt, phạt vi phạm và giải quyết tranh chấp (Termination & Dispute Resolution)?* Điều kiện đơn phương chấm dứt, bồi thường thiệt hại và tòa án phân xử.

### 2.3 Phân tích chuyên sâu các loại Hợp đồng phần mềm (Slide 06 & 06.1)

#### 1. Hợp đồng giá cố định (Fixed-Price Contract / Firm Fixed Price)
- **Đặc điểm:** Giá trị hợp đồng là một số tiền cố định không đổi cho một phạm vi công việc đã xác định từ đầu.
- **Góc nhìn Khách hàng:** Yên tâm về ngân sách tối đa; không cần giám sát hàng ngày nhưng dễ nhận sản phẩm bị cắt xén chất lượng nếu nhà phát triển bị lỗ.
- **Góc nhìn Nhà phát triển:** Rủi ro tài chính cao nếu yêu cầu bị hiểu sai hoặc phát sinh kỹ thuật. Do đó, nhà phát triển luôn cộng thêm một khoản dự phòng rủi ro lớn (**Slack từ 10% đến 30%** - *Slide 06 Sales Tip 4*). Khi khách hàng muốn thay đổi, chi phí Change Request sẽ rất cao.

#### 2. Hợp đồng theo thời gian và nguyên vật liệu (Time and Materials Contract - T&M)
- **Đặc điểm:** Khách hàng thanh toán theo đơn giá nhân công theo ngày/giờ của từng cấp bậc kỹ sư (Junior, Senior dev rate) và chi phí hạ tầng/dụng cụ phát sinh thực tế.
- **Góc nhìn Khách hàng:** Rất linh hoạt, có thể thay đổi hướng đi bất cứ lúc nào; tuy nhiên rủi ro vượt ngân sách lớn, đòi hỏi phải quản lý vi mô (Micromanagement) để đảm bảo nhân sự làm việc hiệu quả.
- **Góc nhìn Nhà phát triển:** Không chịu rủi ro về thời gian; doanh thu tăng nếu dự án kéo dài; tuy nhiên thiếu động lực tối ưu hóa năng suất.

#### 3. Hợp đồng Agile giá cố định (Agile Fixed-Price Contract - Slide 06.1)
- **Mô hình dung hòa hiện đại:**
  - Xác định **Project Vision** và **Giá trần ước tính sơ bộ (Indicative Fixed-Price)** dựa trên Product Backlog ban đầu.
  - Có **Giai đoạn thử nghiệm (Checkpoint Phase):** Sau 2-3 Sprint đầu tiên, hai bên đánh giá lại năng suất thực tế (Velocity) để quyết định tiếp tục hay dừng hợp đồng trong êm đẹp (Exit Point).
  - **Cơ chế chia sẻ rủi ro (Risk Sharing):** Nếu vượt giá trần đã thỏa thuận mà không thể tránh khỏi, phần chi phí vượt chỉ được tính ở mức **30% - 70%** đơn giá thông thường.
  - **Cơ chế hoán đổi phạm vi (Scope Governance):** Cho phép khách hàng thêm User Story mới mà không tăng giá hợp đồng, với điều kiện phải bỏ ra một User Story cũ có số Story Points tương đương.

---

## PHẦN 3: TRẢ LỜI ĐẦY ĐỦ CÁC CÂU HỎI THƯỜNG GẶP (FAQs)

### Q1: Các câu hỏi chính cần trả lời trong tài liệu Phát biểu công việc (SOW) là gì?
Tài liệu SOW trả lời 7 câu hỏi mấu chốt:
1. **Mục đích & Bối cảnh:** Tại sao cần thực hiện công việc này? (Mô phỏng thư viện số DRM).
2. **Phạm vi công việc (Scope of Work):** Nhóm sẽ làm những gì (8 gói công việc WP-01 đến 08) và dứt khoát không làm những gì (Out-of-scope: 24/7 SLA, mua máy quét, app mobile)?
3. **Sản phẩm bàn giao (Deliverables):** Cụ thể bàn giao những tài liệu, mã nguồn và gói triển khai nào (8 Deliverables DEL-01 đến 08)?
4. **Tiêu chuẩn chấp nhận (Acceptance Criteria):** Điều kiện nào để nghiệm thu (8 tiêu chí sản phẩm AC-01..08 và 6 tiêu chí quản lý dự án)?
5. **Tiến độ & Milestone:** Lịch trình bàn giao 5 Sprint và 5 mốc kiểm soát (G1 đến G5) diễn ra khi nào?
6. **Nguồn lực & Ngân sách:** Ai làm (6 SV x 15h/tuần = 900h) và hạn mức chi phí là bao nhiêu (8.8M VNĐ)?
7. **Quy trình thay đổi & Nghiệm thu:** Thay đổi xử lý ra sao và quy trình bàn giao cuối kỳ thế nào?

### Q2: Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu SOW?
- **Đầu vào (Inputs):**
  - `LIBIF-Project-Charter.md` (Mục tiêu, ràng buộc, mốc lớn).
  - `LIBIF-Project-Vision-Scope.md` (Phạm vi trong và ngoài).
  - `LIBIF-Product-Backlog.md` (16 PBIs, acceptance criteria).
  - `LIBIF-Architecture.md` (Kiến trúc kỹ thuật, tech stack).
  - `LIBIF-Project-Estimation.md` (Baseline 136 SP, 900h, 8.8M VNĐ).
  - `LIBIF-Project-Planning.md` (Lịch 5 Sprint, ma trận RACI).
- **Các bước thực hiện (Steps):**
  - *Bước 1:* Xác định tính chất tài liệu là thỏa thuận phạm vi học phần giữa Nhóm sinh viên và Giảng viên.
  - *Bước 2:* Cấu trúc hóa 8 gói công việc (WP-01 đến WP-08) từ WBS của Kế hoạch dự án.
  - *Bước 3:* Làm rõ ranh giới In-scope (13 Must Have + 3 Should Have) và Out-of-scope (Hệ thống production, mua máy quét, mobile app...).
  - *Bước 4:* Định nghĩa chi tiết 8 Deliverables (DEL-01 đến DEL-08) kèm định dạng và thời hạn.
  - *Bước 5:* Xây dựng bộ tiêu chí chấp nhận 2 lớp: Tiêu chí kỹ thuật/sản phẩm (AC-01..08) và Tiêu chí quản trị (PM-AC-01..06).
  - *Bước 6:* Tích hợp các điều khoản về quyền sở hữu trí tuệ, bản quyền dữ liệu mẫu và nguyên tắc sử dụng AI/Coding Agent minh bạch.
  - *Bước 7:* Lập quy trình nghiệm thu 8 bước và xác lập điều kiện hoàn tất SOW.

### Q3: Tài liệu SOW của nhóm đã được đánh giá thế nào?
1. **Đánh giá tính ràng buộc & rõ ràng (Clarity & Non-ambiguity):** Đảm bảo mọi Deliverable đều có định dạng rõ ràng (Git repo, Docker Compose, Markdown/PDF) và Acceptance Criteria có thể kiểm chứng được bằng mắt hoặc bằng test tự động.
2. **Đánh giá ranh giới phạm vi (Scope Boundary Check):** Rà soát mục Out-of-scope để ngăn ngừa kỳ vọng vượt quá năng lực sinh viên (như cam kết chống chụp màn hình 100% bằng camera ngoài).
3. **Đánh giá tính nhất quán (Consistency Check):** Khớp nối chính xác với `LIBIF-Project-Estimation.md` và `LIBIF-Project-Planning.md` về thời gian (10 tuần), nguồn lực (900h) và ngân sách (8.8M VNĐ).
4. **Phê duyệt bởi các bên:** SOW được đại diện nhóm (PO, SM, Dev) và Giảng viên phụ trách cùng ký nhận (Mục 16).

### Q4: Tại sao cần tạo tài liệu Phát biểu công việc (SOW)?
1. **Thiết lập kỳ vọng chung (Align Expectations):** Giúp nhóm sinh viên và giảng viên/khách hàng có cùng một bức tranh rõ ràng về sản phẩm cuối cùng.
2. **Ngăn chặn phình phạm vi (Prevent Scope Creep):** Có căn cứ pháp lý để từ chối các yêu cầu phát sinh vô lý ngoài phạm vi đã thống nhất.
3. **Cơ sở nghiệm thu công bằng (Basis for Acceptance):** Cung cấp bộ tiêu chí khách quan để đánh giá sản phẩm đạt hay không đạt, tránh cảm tính.
4. **Xác định trách nhiệm rõ ràng (Define Obligations):** Quy định rõ nghĩa vụ của Bên thực hiện (làm code, viết tài liệu) và Bên hướng dẫn/đánh giá (cung cấp yêu cầu, chấm điểm).

### Q5: Tài liệu SOW của nhóm đã được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào?
- **Sử dụng làm "Thước đo nghiệm thu":** Trong mỗi buổi Sprint Review và buổi bảo vệ cuối kỳ, nhóm dùng danh mục Deliverables và Acceptance Criteria trong SOW để đối chiếu kết quả bàn giao.
- **Sử dụng để kiểm soát thay đổi (Change Control):** Khi có ý tưởng tính năng mới, PO đối chiếu với mục 4.4 (Ngoài phạm vi) để quyết định đưa vào Roadmap tương lai thay vì chèn vào Sprint hiện tại.
- **Cập nhật:** Khi có sự thay đổi được chấp thuận (ví dụ: hoãn 3 PBI Should Have sau Sprint 2), SOW được ghi nhận cập nhật trong hồ sơ Sprint Review và điều chỉnh danh mục tính năng bàn giao thực tế.

### Q6: Giải thích sự khác nhau về thời gian và chi phí giữa các tài liệu: Đề xuất dự án (Project Proposal), Ước lượng dự án (Project Estimate), và Phát biểu công việc (Statement of Work)?

| Khía cạnh | Đề xuất dự án (Project Proposal) | Ước lượng dự án (Project Estimate) | Phát biểu công việc (SOW) |
| :--- | :--- | :--- | :--- |
| **Bản chất** | Tài liệu **chào hàng, thuyết phục** phê duyệt chủ trương | Tài liệu **tính toán khoa học, phân tích** công sức và chi phí | Tài liệu **cam kết phạm vi & thỏa thuận bàn giao** |
| **Về Thời gian (Schedule)** | - Đưa ra khung thời gian mục tiêu (Target Schedule).<br>- Nhìn ở tầm nhìn rộng (ví dụ: Lộ trình 7 tháng hoàn chỉnh của giải pháp thương mại, hoặc 10 tuần học phần).<br>- Mang tính định hướng tổng quan. | - Tính toán thời lượng dựa trên quy mô (136 SP ÷ 27 SP/Sprint = 10 tuần, 5 Sprint).<br>- Kèm **biên sai số (-20% đến +30%)**.<br>- Xác định các điểm tái ước tính (Sprint 1, Sprint 2). | - Chốt thành **Lịch trình bàn giao cố định (Committed Timeline)**: Đúng 10 tuần, không gia hạn.<br>- Cố định các mốc Milestone cụ thể (G1 đến G5) gắn liền với từng Deliverable. |
| **Về Chi phí (Cost)** | - Đưa ra khái toán / Ngân sách dự trù ban đầu để xin phê duyệt đầu tư.<br>- Thường là con số ước lượng vòng đầu (Ballpark estimate). | - Phân tích chi tiết từng hạng mục chi phí (Agent 3M, VPS 4M, Domain 600k, In ấn 400k + Dự phòng 10% = 8.8M).<br>- Xây dựng nhiều kịch bản (Tối thiểu, Tiết kiệm, Baseline, Trần 10M). | - Chốt thành **Hạn mức tài chính & Điều khoản chi tiêu (Budget Cap)**: Baseline 8.8M VNĐ, trần 10M VNĐ.<br>- Quy định rõ chi phí nhân công SV là 0 VNĐ, chỉ thanh toán chi phí thực tế. |

### Q7: Các câu hỏi chính cần trả lời trong tài liệu Hợp đồng dự án phần mềm (Software Contract) là gì?
*(Đã trình bày chi tiết tại Mục 2.2)*:
1. *Parties:* Các bên tham gia là ai?
2. *Scope & Deliverables:* Bàn giao sản phẩm gì (dẫn chiếu SOW)?
3. *Price & Payment:* Giá bao nhiêu, thanh toán thế nào?
4. *Schedule:* Thời gian thực hiện và hạn chót bàn giao khi nào?
5. *Acceptance:* Tiêu chuẩn và quy trình nghiệm thu ra sao?
6. *IP Rights:* Bản quyền mã nguồn và dữ liệu thuộc về ai?
7. *Warranty & Support:* Bảo hành bao lâu, sửa lỗi thế nào?
8. *Termination & Liability:* Điều kiện hủy hợp đồng và phạt vi phạm ra sao?

### Q8: Giải thích sự khác nhau giữa Hợp đồng giá cố định (Fixed-Price) và Hợp đồng theo nguyên vật liệu và thời gian (Time and Materials - T&M)?

| Tiêu chí | Hợp đồng Giá Cố Định (Fixed-Price) | Hợp đồng Theo Thời gian & Vật tư (T&M) |
| :--- | :--- | :--- |
| **Cơ chế tính giá** | Một mức giá trọn gói duy nhất cho toàn bộ phạm vi xác định trước | Tính tiền theo: $(\text{Số giờ làm việc} \times \text{Đơn giá giờ}) + \text{Chi phí thực tế}$ |
| **Phân bổ rủi ro** | **Bên bán (Nhà phát triển) chịu rủi ro chính.** Nếu dự án kéo dài hoặc tốn công hơn dự kiến, bên bán tự chịu lỗ. | **Bên mua (Khách hàng) chịu rủi ro chính.** Nếu dự án kéo dài, khách hàng phải trả thêm tiền theo số giờ phát sinh. |
| **Yêu cầu đầu vào** | Yêu cầu phải rất chi tiết, rõ ràng, đóng băng từ đầu (Clear & stable requirements) | Yêu cầu có thể mơ hồ, chưa hoàn chỉnh ở giai đoạn đầu (Evolving requirements) |
| **Độ linh hoạt thay đổi** | Rất thấp. Mỗi thay đổi đều phải qua quy trình Change Request phức tạp và bị tính phí cao. | Rất cao. Khách hàng có thể thay đổi yêu cầu, thêm bớt tính năng liên tục theo từng tuần. |
| **Mức độ quản lý** | Khách hàng chỉ cần kiểm tra kết quả tại các mốc Milestone, không cần can thiệp hàng ngày. | Khách hàng phải giám sát chặt chẽ (Micromanagement) bảng chấm công và năng suất nhân sự. |
| **Ưu điểm lớn nhất** | Khách hàng biết trước chính xác tổng chi phí cần chi trả. | Bắt đầu dự án rất nhanh; linh hoạt thích ứng với thị trường. |
| **Nhược điểm lớn nhất** | Dễ nảy sinh tranh chấp về phạm vi; nhà phát triển có xu hướng cắt xén chất lượng để bảo vệ lợi nhuận. | Khách hàng không thể kiểm soát trước ngân sách cuối cùng; dễ bị đội vốn vô hạn. |

---

## PHẦN 4: ĐỐI CHIẾU, VALIDATION & PHẢN BIỆN TÀI LIỆU CỦA NHÓM

### 4.1 Điểm mạnh của tài liệu nhóm (`LIBIF-Statement-Of-Work.md`)
1. **Định vị đúng bản chất học phần:** Tài liệu tuyên bố rõ ràng đây là *"Thỏa thuận phạm vi phục vụ quản lý và đánh giá học phần, không phải hợp đồng thương mại"* (Mục 1) -> Tránh ngộ nhận về trách nhiệm pháp lý thực tế.
2. **Quy định phạm vi ngoài (Out-of-scope) rất chặt chẽ:** Nêu rõ không làm SLA 24/7, không mua scanner, không cam kết DRM tuyệt đối chống chụp camera ngoài -> Bảo vệ nhóm khỏi những đánh giá bất khả thi.
3. **Tiêu chí chấp nhận 2 tầng (AC sản phẩm + PM-AC quản lý):** Không chỉ nghiệm thu phần mềm chạy được mà còn nghiệm thu cả các bằng chứng thực hành Scrum (Sprint Backlog, Review/Retro notes, Risk log).
4. **Quy định minh bạch về AI & Bản quyền:** Cam kết không đưa dữ liệu nhạy cảm lên AI, không vi phạm bản quyền sách mẫu, và sinh viên chịu trách nhiệm giải trình toàn bộ mã nguồn.

### 4.2 Những câu hỏi phản biện của Giảng viên và cách trả lời

| Câu hỏi phản biện của Giảng viên | Điểm cốt lõi bị kiểm tra | Cách trả lời thuyết phục |
|:---|:---|:---|
| *1. "Trong SOW, nhóm cam kết tính năng DRM Canvas và Screenshot Blur (PBI-11, 15). Nếu người dùng dùng điện thoại chụp màn hình từ bên ngoài thì hệ thống có chặn được không? SOW có bị coi là không đạt nghiệm thu không?"* | Giới hạn kỹ thuật và ranh giới nghiệm thu. | **Trả lời:** "Thưa thầy, tại Mục 6.3 và Mục 4.4 của tài liệu SOW, nhóm đã quy định rõ ràng: Cơ chế DRM Canvas, Screenshot Blur và Dynamic Watermark là các biện pháp **răn đe, giảm thiểu rủi ro và hỗ trợ truy vết ở mức prototype/MVP**, không phải là giải pháp bảo mật phần cứng tuyệt đối. Việc người dùng dùng camera ngoài chụp màn hình nằm ngoài phạm vi kỹ thuật của một ứng dụng Web. Do đó, tiêu chí AC-06 được coi là đạt khi hệ thống che mờ khi mất focus, gắn watermark định danh người dùng/IP và không để lộ link tải file trực tiếp trên trình duyệt." |
| *2. "Nếu giảng viên yêu cầu bổ sung tính năng 'Đọc sách trên ứng dụng di động (Mobile App)' vào tuần thứ 6, nhóm xử lý theo SOW thế nào?"* | Quy trình quản lý thay đổi phạm vi. | **Trả lời:** "Thưa thầy, căn cứ theo Mục 4.4 (Ngoài phạm vi) và Mục 13 (Quản lý thay đổi) của SOW: Tính năng Mobile App hiện nằm ngoài phạm vi đồ án 10 tuần. Nếu Giảng viên yêu cầu bổ sung, nhóm sẽ lập một Change Request: Đánh giá Story Points của Mobile App (khoảng 30-40 SP), sau đó đề xuất chuyển một khối lượng Must Have tương đương hoặc đưa tính năng này vào Product Roadmap sau học phần, vì thời hạn 10 tuần và năng lực 900h của nhóm là cố định." |
| *3. "SOW này tương đương với loại Hợp đồng nào trong thực tế: Giá cố định (Fixed-Price) hay Theo thời gian & vật tư (T&M)?"* | Ánh xạ lý thuyết hợp đồng vào đồ án. | **Trả lời:** "Thưa thầy, SOW của nhóm mang bản chất của mô hình **Agile Fixed-Price Contract (Hợp đồng Agile giá cố định)**: Nhóm cố định về thời gian (10 tuần) và nguồn lực/ngân sách trần (900h effort, 8.8M VNĐ), đồng thời cam kết 13 PBI Must Have cốt lõi. Tuy nhiên, nhóm duy trì tính linh hoạt của Agile qua 3 PBI Should Have (13 SP) làm phạm vi co giãn và cho phép hoán đổi tính năng tương đương khi có yêu cầu thay đổi từ phía giảng viên/khách hàng." |
| *4. "Tại sao trong bảng ngân sách SOW, chi phí nhân công của 6 sinh viên lại ghi là 0 VNĐ? Nếu ra doanh nghiệp thật thì tính thế nào?"* | Thực tiễn đồ án vs Môi trường doanh nghiệp. | **Trả lời:** "Thưa thầy, trong bối cảnh học phần đại học, công sức của sinh viên là hoạt động học tập thực hành nên được ghi nhận bằng **900 giờ-người**, không phát sinh giao dịch tiền tệ thực tế (0 VNĐ). Nếu ra môi trường doanh nghiệp thật theo hợp đồng T&M hoặc Fixed-Price, 900 giờ công này sẽ được nhân với đơn giá giờ (Hourly Rate, ví dụ 15 - 25 USD/giờ cho lập trình viên), tạo nên chi phí nhân công từ 300 - 500 triệu VNĐ, cộng với chi phí quản lý chung (Overhead) và lợi nhuận định mức." |
