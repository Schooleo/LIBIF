# CÂU 10 – ƯỚC LƯỢNG DỰ ÁN (PROJECT ESTIMATION)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Ước lượng dự án (Project Estimate) của nhóm.  
> **Kèm theo:** Bản in tài liệu Ước lượng dự án của nhóm (`LIBIF-Project-Estimation.md` / `Q10-print.md`).

---

## PHẦN 1: BÀI VIẾT TAY A4 (Dành cho 10 phút viết nhanh trên giấy thi)

*Mẹo: Khi vào phòng thi, vẽ ngay sơ đồ luồng quá trình (Workflow) và bảng số liệu cốt lõi (Baseline) để làm khung sườn thuyết trình.*

```
+---------------------------------------------------------------------------------------------------+
|                     BÀI TRÌNH BÀY VẤN ĐÁP A4 - CÂU 10: ƯỚC LƯỢNG DỰ ÁN (LIBIF)                     |
+---------------------------------------------------------------------------------------------------+

1. ĐỊNH NGHĨA & MỤC ĐÍCH TÀI LIỆU
- Trả lời 4 câu hỏi cốt lõi: Làm bao nhiêu (Size: 136 SP)? Mất bao lâu (Duration: 10 tuần, 5 Sprint)? 
  Tốn bao nhiêu công sức (Effort: 900h danh nghĩa, 765h tập trung)? Chi phí bao nhiêu (8.8M VNĐ)?
- Giúp giảm bất định (reducing uncertainty), lập baseline theo dõi và ra quyết định ưu tiên phạm vi.

2. QUÁ TRÌNH HÌNH THÀNH (Đầu vào -> Phương pháp -> Đầu ra)
- Đầu vào (Inputs): Product Backlog (16 PBIs), Architecture (Modular Monolith), PoC DRM Canvas, 
  Vision & Scope, Project Charter, Project Proposal.
- Phương pháp áp dụng (Techniques):
  + Đếm, Tính toán & Đánh giá (Count, Compute, Judge): Đếm 16 PBIs/5 Epics -> Phân rã -> Ước lượng.
  + Agile Estimation: Planning Poker với thang Fibonacci (1, 2, 3, 5, 8, 13) gán Story Points (SP).
  + Phân rã & Kết hợp (Decomposition & Recomposition): PBI lớn (13 SP) -> Task nhỏ (<= 2 ngày).
  + Bottom-up Effort Estimation: Tính giờ theo 6 nhóm công việc -> 765h focus.
  + Dự phòng (Contingency): 10% ngân sách (800k VNĐ) + 13 SP Should-Have làm scope buffer.
- Đầu ra (Outputs): Baseline ước tính chi tiết, lịch trình 5 Sprint, phân bổ nguồn lực, ngân sách.

3. PHƯƠNG PHÁP ĐÁNH GIÁ & ĐIỀU CHỈNH TÀI LIỆU
- Đánh giá tính nhất quán (Consistency Check): Đối chiếu chéo giữa Backlog, Architecture, Plan, SOW.
- Quản lý biên sai số: Công bố sai số ban đầu -20% đến +30% (Cone of Uncertainty).
- Điểm tái ước tính (Re-estimation checkpoints): Cuối Sprint 1 và Sprint 2 dùng Velocity thực tế.
- Ngưỡng hành động: Nếu Velocity < 24 SP/Sprint -> Cắt 3 PBI Should Have (PBI-03, 13, 15 - 13 SP).

4. BẢNG BASELINE CỐT LÕI (CẦN NHỚ ĐỂ NÓI VÀ VIẾT)
+-------------------------+-------------------------------------------------------------------------+
| Tổng quy mô (Size)      | 136 Story Points (117 SP tính năng + 19 SP Enablers)                   |
| Thời gian (Duration)    | 10 tuần học = 5 Sprint x 2 tuần (Velocity dự kiến: ~27 SP/Sprint)       |
| Nguồn lực & Công sức    | 6 sinh viên x 15h/tuần x 10 tuần = 900h (765h tập trung sản phẩm)       |
| Ngân sách tiền mặt      | 8.800.000 VNĐ (Baseline)               |
| Phân loại phạm vi       | 13 Must Have (104 SP) + 3 Should Have (13 SP co giãn) + 3 Enablers (19) |
+-------------------------+-------------------------------------------------------------------------+
```

---

## PHẦN 2: GIẢI THÍCH LÝ THUYẾT CHI TIẾT (Dành cho thành viên ôn tập & hiểu sâu)

### 2.1 Bản chất của Ước lượng Phần mềm (Software Estimation)
- **Ước lượng không phải là cam kết (Commitment) hay mục tiêu (Target/Goal):**
  - *Estimate:* Dự đoán khách quan dựa trên dữ liệu và xác suất (VD: Dự án mất khoảng 9 - 11 tuần).
  - *Target:* Tuyên bố về mục tiêu kinh doanh mong muốn (VD: Cần ra mắt trước kỳ thi cuối kỳ).
  - *Commitment:* Lời hứa bàn giao một phạm vi cụ thể tại một mốc thời gian và chi phí nhất định.
- **Hiện tượng Cone of Uncertainty (Hình nón bất định):**
  - Ở giai đoạn khởi đầu dự án (Initial Concept), độ sai lệch ước tính có thể từ **0.25x đến 4x** (gấp 4 lần hoặc chỉ bằng 1/4 thực tế).
  - Khi yêu cầu được làm rõ (Requirements Complete), sai số giảm còn **0.67x đến 1.5x**.
  - Đối với LIBIF: Nhóm đã có Product Backlog rõ ràng và PoC kỹ thuật trước khi lập Estimation nên chọn biên sai số **-20% đến +30%**.

### 2.2 Quy tắc "Đếm, Tính toán và Đánh giá" (Count, Compute, Judge)
Theo tài liệu môn học (Slide *05.2 Introduction To Software Estimation*):
1. **Count (Đếm - Ưu tiên số 1):** Tìm bất cứ thứ gì có thể đếm được trực tiếp (số User Stories, số Use Cases, số bảng Database, số màn hình giao diện, số API endpoints). Đếm là sự thật khách quan, không bị thiên kiến.
2. **Compute (Tính toán - Ưu tiên số 2):** Sử dụng các công thức toán học, thống kê, dữ liệu lịch sử hoặc tỷ lệ từ dự án tương tự để ngoại suy (VD: Công thức PERT, hệ số nhân trong Estimation by Analogy, quy đổi số ngày làm việc).
3. **Judge (Đánh giá - Phương án cuối cùng):** Chỉ sử dụng phán đoán chủ quan của chuyên gia khi không có cách nào đếm hoặc tính toán được. Khi bắt buộc phải đánh giá, cần áp dụng các kỹ thuật có cấu trúc (Planning Poker, Wideband Delphi, Three-Point Estimation) để triệt tiêu thiên kiến cá nhân.

### 2.3 Story Points & Dãy Fibonacci trong Agile Estimation
- **Story Point (SP):** Đo lường tổng hợp của **Kích thước (Size) + Độ phức tạp (Complexity) + Rủi ro/Độ bất định (Uncertainty/Risk)**. SP mang tính tương đối (relative), không quy đổi cố định `1 SP = X giờ`.
- **Tại sao dùng thang Fibonacci (1, 2, 3, 5, 8, 13, 21...)?**
  - Khoảng cách giữa các số tăng dần phản ánh đúng bản chất: việc càng lớn thì độ bất định càng cao.
  - Tránh tranh cãi vô bổ về độ chi tiết giả tạo (ví dụ tranh luận giữa 11 hay 12 điểm).
  - Khuyến khích việc phân rã (Disaggregation): Nếu một story được chấm 13 hoặc 21 SP, nhóm nhận diện đó là một "Epic/PBI quá lớn" và bắt buộc phải bóc tách thành các story 3, 5, 8 SP.

### 2.4 Kỹ thuật Planning Poker
- Là sự kết hợp của **Expert Opinion + Analogy + Disaggregation**.
- **Quy trình:**
  1. PO giải thích User Story / PBI và Tiêu chí chấp nhận (Acceptance Criteria).
  2. Cả nhóm thảo luận ngắn (Timebox 2 phút).
  3. Mỗi thành viên chọn một lá bài bí mật (thang Fibonacci) và đồng loạt lật bài.
  4. Nếu điểm số đồng thuận -> chốt SP.
  5. Nếu phân tán (ví dụ có người chấm 3, người chấm 13): Người chấm cao nhất và thấp nhất giải thích góc nhìn -> Thảo luận làm rõ -> Bỏ phiếu lại vòng 2.
- **Điểm ưu việt:** Tránh hiệu ứng "mỏ neo" (Anchoring Bias - người đầu tiên nói làm ảnh hưởng người khác), ngăn chặn việc "3 junior lấn át 1 senior" mà thay vào đó tập trung vào chia sẻ thông tin chuyên môn.

### 2.5 Phân rã và Kết hợp (Decomposition and Recomposition) & Quy luật số lớn (Law of Large Numbers)
- **Quy luật số lớn:** Khi ta chia nhỏ dự án thành nhiều phần việc độc lập (tối thiểu 5 - 10 hạng mục) với kích thước nhỏ (task <= 2 ngày công), sai số ước lượng dương (ước lượng thừa) và sai số ước lượng âm (ước lượng thiếu) của từng task sẽ tự triệt tiêu lẫn nhau, giúp tổng ước tính toàn dự án hội tụ về độ chính xác cao.
- **Top-Down vs. Bottom-Up:**
  - *Top-Down:* Bắt đầu từ mức tổng quan hệ thống, dùng tương quan dự án tương tự (Analogy). Nhanh nhưng dễ bỏ sót chi phí kỹ thuật chi tiết.
  - *Bottom-Up:* Bắt đầu từ cấp độ module/task nhỏ nhất, cộng dồn lên. Chính xác nhưng tốn thời gian và có thể bỏ sót chi phí tích hợp/quản lý chung.
  - *LIBIF phối hợp cả hai:* Top-Down để xác định dung lượng 10 tuần / 136 SP; Bottom-Up để phân bổ 765 giờ-người cho 6 nhóm công việc kỹ thuật cụ thể.

---

## PHẦN 3: TRẢ LỜI ĐẦY ĐỦ CÁC CÂU HỎI THƯỜNG GẶP (FAQs)

### Q1: Các câu hỏi chính cần trả lời trong tài liệu Ước lượng dự án là gì?
Tài liệu trả lời 5 câu hỏi quyết định:
1. **Quy mô (Size):** Phần mềm này lớn đến mức nào? (LIBIF: 136 SP, 16 PBIs, 3 Enablers).
2. **Thời gian (Duration/Schedule):** Dự án sẽ hoàn thành trong bao lâu? (LIBIF: 10 tuần, 5 Sprint).
3. **Công sức (Effort):** Cần bao nhiêu giờ công của các vai trò? (LIBIF: 900 giờ danh nghĩa, 765 giờ tập trung).
4. **Chi phí (Cost/Budget):** Cần ngân sách tiền mặt là bao nhiêu? (LIBIF: 8.800.000 VNĐ gồm 10% dự phòng).
5. **Rủi ro và Giả định (Risks & Assumptions):** Có những rào cản nào làm lệch ước tính và phương án ứng phó là gì?

### Q2: Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Ước lượng dự án?
- **Đầu vào (Inputs):** 
  - `LIBIF-Product-Backlog.md` (16 PBIs, phân loại MoSCoW).
  - `LIBIF-Architecture.md` (Modular Monolith, PostgreSQL, MinIO, BullMQ, Tesseract).
  - `LIBIF-Proof-Of-Concept.md` (Thử nghiệm Canvas DRM và Web Crypto).
  - `LIBIF-Project-Vision-Scope.md` (Phạm vi trong/ngoài dự án).
  - `LIBIF-Project-Charter.md` & `LIBIF-Project-Proposal.md`.
- **Các bước thực hiện (Steps):**
  - *Bước 1:* Rà soát toàn bộ tài liệu đầu vào, xác lập các giả định dự án (EST-A01 đến EST-A10).
  - *Bước 2:* Dùng Planning Poker gán Story Points cho 16 PBIs và 3 Enablers (tổng 136 SP).
  - *Bước 3:* Phân bổ Backlog vào 5 Sprint dựa trên Velocity dự kiến (~27 SP/Sprint) và chuỗi phụ thuộc kỹ thuật.
  - *Bước 4:* Tính toán năng lực nhân sự (Capacity): 6 SV x 15h/tuần x 10 tuần = 900h -> trừ 15% hội họp/gián đoạn còn 765h tập trung.
  - *Bước 5:* Lập ngân sách tiền mặt theo các khoản chi thực tế (Agent, VPS, domain, in ấn) + 10% dự phòng rủi ro.
  - *Bước 6:* Nhận diện 10 rủi ro ảnh hưởng ước tính (R-01 đến R-10) và xác lập quy tắc quản lý thay đổi.

### Q3: Tài liệu Ước lượng dự án của nhóm đã được đánh giá thế nào?
1. **Kiểm tra chéo nội bộ (Internal Peer Review):** Các thành viên phụ trách Frontend, Backend, QA, DevOps cùng rà soát để đảm bảo không bỏ sót task nền tảng (Enablers) và task tích hợp.
2. **Kiểm tra tính khả thi nguồn lực (Sanity Check):** 
   - Tổng SP (136 SP) / 5 Sprint = ~27.2 SP/Sprint.
   - Với 765h tập trung / 136 SP ≈ 5.6 giờ/SP -> Mức độ hợp lý và khả thi với năng lực nhóm có sự hỗ trợ của Coding Agent.
3. **Đánh giá dựa trên PoC:** Dựa vào kết quả làm PoC DRM Canvas để đối chiếu độ phức tạp của PBI-11 (13 SP) và PBI-12 (8 SP).
4. **Cơ chế kiểm chứng thực tế:** Thiết lập mốc tái ước tính tại cuối Sprint 1 và Sprint 2 dựa trên Velocity thực nghiệm để hiệu chỉnh kế hoạch.

### Q4: Tại sao cần tạo tài liệu Ước lượng dự án?
1. **Cơ sở lập kế hoạch (Foundation for Planning):** Không thể lập lịch trình (Schedule) hay phân bổ việc nếu không biết quy mô và công sức.
2. **Quản lý kỳ vọng (Expectation Management):** Giúp giảng viên/khách hàng hiểu rõ khả năng bàn giao của nhóm trong phạm vi thời gian cố định.
3. **Cơ sở ra quyết định phạm vi (Scope Trade-off):** Biết rõ dung lượng để phân loại Must Have (104 SP) và Should Have (13 SP) - khi trễ hạn có căn cứ để cắt giảm có kiểm soát.
4. **Kiểm soát rủi ro & Ngân sách (Cost & Risk Control):** Tránh chi tiêu tự phát, dự trù kinh phí hạ tầng và công cụ.

### Q5: Tài liệu Ước lượng dự án của nhóm đã được sử dụng trong quá trình thực hiện dự án như thế nào?
- **Hướng dẫn Sprint Planning:** Mỗi đầu Sprint, nhóm căn cứ vào mức Story Point dự kiến (~26-29 SP) và Capacity thực tế tuần đó để kéo PBI vào Sprint Backlog.
- **Theo dõi tiến độ qua Velocity & Burndown:** So sánh số SP hoàn thành thực tế với baseline để phát hiện sớm nguy cơ chậm tiến độ.
- **Kích hoạt kế hoạch ứng phó:** Quy định nếu sau Sprint 2 Velocity trung bình < 24 SP/Sprint -> Lập tức hoãn 3 PBI Should Have (PBI-03, 13, 15).
- **Kiểm soát chi phí:** Theo dõi các khoản chi thực tế cho VPS/Coding Agent so với hạn mức 8.800.000 VNĐ.

### Q6: Giải thích các phương pháp phân rã một tính năng lớn thành các tính năng nhỏ?
1. **Phân rã theo quy trình nghiệp vụ (Workflow Steps):** Tách theo các bước người dùng thực hiện (VD: Upload file -> Xem trước -> Nhập metadata -> Xác nhận gửi).
2. **Phân rã theo biến thể dữ liệu (Data Variations):** Tách theo định dạng đầu vào (VD: Xử lý PDF dạng text trước, xử lý file ảnh quét PNG/JPG sau).
3. **Phân rã theo lát cắt dọc (Vertical Slicing):** Cắt theo từng luồng tính năng hoàn chỉnh từ UI -> API -> Database thay vì làm toàn bộ UI rồi mới làm Backend.
4. **Phân rã theo mức độ chất lượng / Phi chức năng (Quality/Operations):** Làm luồng cơ bản (Happy path) trước, sau đó bổ sung xử lý lỗi, retry, bảo mật nâng cao.
5. **Phân rã Spike/PoC:** Tách riêng phần nghiên cứu kỹ thuật chưa rõ thành Spike 1-2 ngày trước khi triển khai tính năng chính.

### Q7: Khi không có khả năng phân rã được các tính năng lớn của dự án, nhóm phải làm thế nào?
1. **Thực hiện Timeboxed Spike / PoC:** Dành 1 khoảng thời gian cố định (ví dụ 1-2 ngày) để làm thử nghiệm kỹ thuật nhằm hiểu rõ bản chất công việc, sau đó mới tiến hành phân rã.
2. **Sử dụng Ước lượng Tương quan (Estimation by Analogy):** So sánh với một module hoặc dự án có độ phức tạp tương đương đã từng thực hiện.
3. **Áp dụng kỹ thuật Wideband Delphi:** Mời các thành viên có kinh nghiệm ước lượng độc lập nhiều vòng để tìm điểm hội tụ.
4. **Gán kích thước sơ bộ dạng T-Shirt Sizing (L, XL) với biên dự phòng rủi ro cao:** Tạm thời đưa vào kế hoạch với giả định rủi ro lớn nhất, sau đó bắt buộc tái ước lượng ngay khi có thông tin bổ sung.

### Q8: Ước lượng có thể sai lệch khoảng bao nhiêu lần ở giai đoạn đầu dự án? Tại sao cần ước lượng ở giai đoạn đầu?
- **Mức độ sai lệch:** Theo mô hình *Cone of Uncertainty*, ở giai đoạn ý tưởng ban đầu (Initial Concept), ước lượng có thể sai lệch từ **0.25x đến 4.0x** (tức là gấp 4 lần hoặc chỉ bằng 1/4 thực tế).
- **Tại sao vẫn bắt buộc phải ước lượng ở giai đoạn đầu?**
  1. Để trả lời câu hỏi khả thi: Có nên thực hiện dự án hay không (Go/No-Go Decision)?
  2. Để lập ngân sách ban đầu và xin phê duyệt nguồn lực/tài trợ.
  3. Để định hình phạm vi mục tiêu (Target Scope) và các mốc bàn giao lớn (Milestones).
  4. Tạo ra một "điểm neo" (Baseline) ban đầu để đo lường mức độ biến động và thu hẹp dần độ bất định qua từng giai đoạn.

### Q9: Ước lượng kích cỡ (Size) mang lại lợi ích gì cho dự án khi mối quan tâm chính của ban quản lý là thời gian (Duration) và chi phí (Cost)?
- **Size là thuộc tính nội tại, khách quan của sản phẩm:** Kích thước phần mềm (tính bằng Story Points, Function Points, hoặc Use Case Points) phản ánh độ lớn và độ phức tạp của bài toán, không bị thay đổi bởi việc ai làm hay làm bằng công cụ nào.
- **Size là nền tảng để tính toán Duration và Cost:**
  $$\text{Duration (Thời gian)} = \frac{\text{Size (Story Points)}}{\text{Velocity (SP/Sprint)}} \times \text{Sprint Duration}$$
  $$\text{Cost (Chi phí)} = \text{Effort} \times \text{Đơn giá nhân công} + \text{Chi phí hạ tầng/dịch vụ}$$
- **Lợi ích thực tế:**
  1. *Ổn định qua thời gian:* Khi năng suất nhóm thay đổi (tăng lên nhờ quen việc hoặc nhờ Coding Agent), Size vẫn giữ nguyên, chỉ có Velocity tăng lên giúp rút ngắn Duration.
  2. *Tách bạch giữa "Độ lớn bài toán" và "Năng lực thực thi":* Giúp ban quản lý hiểu rõ nếu muốn giảm Duration thì phải giảm Size (cắt bớt Scope) hoặc tăng năng lực, chứ không thể ép thời gian một cách vô căn cứ.

### Q10: Giải thích quy tắc “Đếm, Tính toán và Đánh giá” (Count, Compute, Judge) khi thực hiện ước lượng dự án?
*(Đã trình bày chi tiết tại Mục 2.2)*:
- **Đếm (Count):** Thu thập các đại lượng định lượng có sẵn (16 PBIs, 5 Epics, 10-20 tài liệu mẫu, 8 bảng DB).
- **Tính toán (Compute):** Dùng công thức toán học/thống kê để suy ra các đại lượng cần tìm (Tổng giờ = 6 người x 15h x 10 tuần = 900h; Ngân sách = $\sum \text{hạng mục} + 10\% \text{dự phòng}$).
- **Đánh giá (Judge):** Sử dụng kinh nghiệm chuyên gia cho những yếu tố không thể đếm/tính (Độ phức tạp của thuật toán DRM, hiệu năng OCR trên ảnh scan mờ) thông qua Planning Poker.

### Q11: Giải thích các kỹ thuật để tăng độ chính xác khi thực hiện việc ước lượng bằng đánh giá chủ quan?
1. **Ước lượng 3 điểm (Three-Point Estimation / PERT):** Đưa ra 3 kịch bản: Lạc quan ($O$), Khả dĩ nhất ($M$), Bi quan ($P$), và tính giá trị kỳ vọng:
   $$E = \frac{O + 4M + P}{6}, \quad \sigma = \frac{P - O}{6}$$
2. **Kỹ thuật Wideband Delphi:** Nhiều chuyên gia ước tính độc lập, giấu tên, thảo luận nhóm qua nhiều vòng lặp để loại bỏ thiên kiến cá nhân.
3. **Sử dụng Dải ước lượng (Range Estimation):** Thay vì đưa ra 1 con số tuyệt đối, đưa ra khoảng giá trị kèm độ tin cậy (Confidence Level, ví dụ: 80% khả năng hoàn thành trong 9-11 tuần).
4. **Sử dụng Checklist rà soát:** Kiểm tra xem đã bao gồm công việc kiểm thử, viết tài liệu, sửa lỗi, thiết lập môi trường CI/CD chưa.
5. **So sánh với dữ liệu thực tế đã lưu (MRE - Magnitude of Relative Error):** Đo sai số của các lần ước lượng trước để tự hiệu chỉnh thói quen lạc quan/bi quan.

### Q12: Giải thích các kỹ thuật để tăng độ chính xác khi ước lượng bằng phương pháp “Phân rã và Kết hợp” (“Decomposition and Recomposition”)?
1. **Phân rã đủ mịn (Task Granularity phù hợp):** Bóc tách công việc thành các task có kích thước từ 0.25 ngày đến tối đa 2 ngày làm việc. Task lớn hơn 2 ngày tiềm ẩn nhiều việc ẩn (hidden work).
2. **Sử dụng WBS chuẩn theo hoạt động (Activity-Based WBS):** Với mỗi tính năng, luôn phân rã đủ các công đoạn: Phân tích -> Thiết kế -> Lập trình -> Code Review -> Unit Test -> Tích hợp -> Viết tài liệu.
3. **Khai thác Quy luật số lớn (Law of Large Numbers):** Đảm bảo danh mục phân rã có từ 10 hạng mục trở lên để sai số ngẫu nhiên bù trừ cho nhau.
4. **Đối chiếu Recomposition hai chiều (Top-down vs Bottom-up Reconciliation):** Sau khi cộng dồn từ dưới lên, so sánh với ước lượng tổng quan ban đầu; nếu lệch nhau > 20%, phải ngồi lại tìm nguyên nhân chênh lệch.

### Q13: Giải thích kỹ thuật ước lượng bằng các lá bài (Planning Poker)?
*(Đã trình bày chi tiết tại Mục 2.4)*. Nhấn mạnh:
- Kết hợp cả 3 phương pháp: Expert Opinion, Analogy, Disaggregation.
- Dùng dãy Fibonacci để phản ánh độ bất định.
- Lật bài đồng thời để chống hiện tượng neo tâm lý.
- Tập trung thảo luận vào 2 thái cực (người cho điểm cao nhất và thấp nhất) để làm sáng tỏ các rủi ro hoặc giả định ẩn.

---

## PHẦN 4: ĐỐI CHIẾU, VALIDATION & PHẢN BIỆN TÀI LIỆU CỦA NHÓM

### 4.1 Điểm mạnh và tính hợp lý của tài liệu nhóm (`LIBIF-Project-Estimation.md`)
1. **Cấu trúc chuẩn mực theo học phần:** Phân định rõ ràng giữa quy mô (136 SP), thời gian (10 tuần, 5 Sprint), công sức (900h/765h) và chi phí tiền mặt (8.8M VNĐ).
2. **Tính thực tế với bối cảnh sinh viên:**
   - Không quy đổi công sức sinh viên thành tiền lương ảo (ghi nhận 0 VNĐ lương, chỉ tính 8.8M tiền mặt thực chi cho VPS, AI Agent, in ấn).
   - Đã trừ hao 15% thời gian (135h) cho việc học môn khác, thi cử, họp Scrum -> Còn 765h tập trung sản phẩm.
3. **Phân loại phạm vi linh hoạt (MoSCoW):**
   - Xác định 13 Must Have (104 SP) là cam kết cốt lõi.
   - Xác định 3 Should Have (13 SP: PBI-03, PBI-13, PBI-15) làm phạm vi co giãn để bảo vệ deadline 10 tuần.
4. **Quy định rõ cơ chế sử dụng Coding Agent:** Coi Agent là công cụ trợ lực (tăng 15-20% hiệu suất), không thay thế trách nhiệm của sinh viên; mọi code đều phải qua Peer Review và Unit Test.

### 4.2 Những điểm phản biện / Câu hỏi hóc búa giảng viên có thể hỏi và cách trả lời

| Câu hỏi phản biện của Giảng viên | Điểm yếu có thể bị soi | Cách trả lời thuyết phục (Dựa trên tài liệu) |
|:---|:---|:---|
| *1. "Tại sao nhóm chưa có dữ liệu lịch sử (Historical Data) mà lại dám ước tính Velocity là 27 SP/Sprint?"* | Nhóm là sinh viên, chưa từng làm dự án tương tự trước đây. | **Trả lời:** "Thưa thầy, 27 SP/Sprint là Velocity giả định ban đầu (Initial Forecast) dựa trên dung lượng 136 SP chia cho 5 Sprint. Nhóm nhận thức rõ đây là ước tính sơ bộ với biên sai số -20% đến +30%. Vì vậy, trong tài liệu mục 8.4 và 11, nhóm đã quy định **2 điểm tái ước tính bắt buộc tại cuối Sprint 1 và Sprint 2**. Nếu Velocity thực tế < 24 SP/Sprint, nhóm sẽ kích hoạt quy tắc quản lý thay đổi: hoãn ngay 3 PBI Should Have (13 SP) để bảo vệ mục tiêu tốt nghiệp môn học." |
| *2. "Story Point là đo kích thước tương đối, tại sao trong bảng mục 6.2 nhóm lại quy đổi ra 765 giờ công?"* | Dễ bị nhầm là quy đổi trực tiếp 1 SP = X giờ. | **Trả lời:** "Thưa thầy, nhóm **không quy đổi trực tiếp 1 SP thành số giờ cố định**. Story Point dùng để đo kích thước backlog và tính Velocity. Còn 765 giờ là ước tính năng lực (Capacity) từ dưới lên của 6 thành viên (Bottom-Up Effort). Nhóm đối chiếu hai con số này như một bước Sanity Check: 765h / 136 SP ≈ 5.6h/SP để kiểm tra xem khối lượng công việc có vượt quá tổng năng lực thời gian của nhóm hay không." |
| *3. "Nếu đến tuần thứ 8 mà tiến độ bị chậm 30%, nhóm sẽ làm gì? Kéo dài thêm 2 tuần hay làm cách nào?"* | Ràng buộc thời gian học phần là cố định (10 tuần). | **Trả lời:** "Thưa thầy, thời hạn 10 tuần của học phần là ràng buộc bất khả kháng (Hard Deadline). Do đó, nhóm áp dụng phương pháp **Fixed-Date Agile Planning**: Cố định thời gian và nguồn lực, điều chỉnh phạm vi (Flexible Scope). Nhóm sẽ lập tức cắt bỏ các PBI Should Have (PBI-03, 13, 15) và đơn giản hóa tiêu chí phi chức năng của các PBI còn lại, ưu tiên bàn giao Increment chạy được với 13 PBI Must Have đạt chuẩn Definition of Done." |
| *4. "Coding Agent giúp giảm 15-20% công sức, nếu Agent bị sập hoặc mất mạng thì dự án có thất bại không?"* | Rủi ro phụ thuộc công nghệ bên ngoài. | **Trả lời:** "Thưa thầy, rủi ro này đã được nhóm nhận diện tại mã R-06 và R-08. Nhóm thiết kế kiến trúc Modular Monolith chuẩn và môi trường chạy Docker cục bộ (Local). Coding Agent chỉ đóng vai trò hỗ trợ sinh mã mẫu và test. Khi mất công cụ, nhóm sẽ giảm bớt các tính năng Should Have, tập trung làm thủ công các Must Have cốt lõi; dự án vẫn đảm bảo hoàn thành đúng hạn." |
