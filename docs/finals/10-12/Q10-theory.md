### PHẦN 1: GIẢI THÍCH LÝ THUYẾT CHI TIẾT (Dành cho thành viên ôn tập & hiểu sâu)

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

## PHẦN 2: TRẢ LỜI ĐẦY ĐỦ CÁC CÂU HỎI THƯỜNG GẶP (FAQs)

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu khái niệm/kỹ thuật hoặc con số nhóm dùng.
2. **Dẫn chứng LIBIF:** chỉ vào đúng mục/bảng trong `LIBIF-Project-Estimation.md` (VD Mục 4.1, 5.1, 6.1...).
3. **Giá trị quản lý:** nói ước tính giúp kiểm soát rủi ro/scope gì.

Điểm neo phải nhớ:

    Đầu vào (Backlog, Architecture, PoC, Vision&Scope, Charter, Proposal)
      → Planning Poker (Fibonacci) → Size (136 SP)
      → Duration (5 Sprint × 2 tuần) → Effort (Count 900h → Compute 765h)
      → Cost (0 VNĐ) → Baseline → Tái ước tính cuối Sprint 1 & 2

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Ước lượng dự án là gì?

**Trả lời:** Kích cỡ (Size) của backlog là bao nhiêu, dự án mất bao lâu (Duration), cần bao nhiêu công sức (Effort) và chi phí (Cost), sai số ước lượng ở mức nào, và khi nào cần tái ước tính.

### 2. Các đầu vào và các bước nhóm đã thực hiện để tạo tài liệu là gì?

**Trả lời:** Đầu vào là 6 tài liệu: Product Backlog, Architecture, PoC, Vision & Scope, Charter, Proposal. Các bước: (1) Planning Poker ước tính SP từng PBI theo thang Fibonacci; (2) phân bổ SP vào 5 Sprint dựa trên velocity giả định ~27 SP/Sprint; (3) tính effort bằng Count (6 SV×15h×10 tuần=900h) rồi Compute trừ 15% overhead ra 765h; (4) chi phí = 0 vì dùng tài nguyên miễn phí; (5) ghi nhận giả định và rủi ro ảnh hưởng ước tính.

### 3. Tài liệu đã được đánh giá thế nào?

**Trả lời:** Đánh giá qua thảo luận nhóm trong Planning Poker — không để 1-2 thành viên áp đảo (3 junior không outvote 1 senior kinh nghiệm hơn); kiểm tra tính tương đối nhất quán giữa các SP (PBI 2 điểm phải gấp đôi PBI 1 điểm); đối chiếu tổng thời gian ước tính với deadline cố định 10 tuần; cả nhóm review lại bảng phân bổ Sprint trước khi chốt baseline.

### 4. Tại sao cần tạo tài liệu Ước lượng dự án?

**Trả lời:** Để biết mục tiêu (target) 10 tuần có thực tế hay không trước khi cam kết (commitment); làm cơ sở lập kế hoạch Sprint, phân bổ công sức theo nhóm công việc, và làm baseline để theo dõi/kiểm soát tiến độ qua velocity thực tế.

### 5. Tài liệu đã được sử dụng và cập nhật trong dự án như thế nào?

**Trả lời:** Baseline dùng để phân bổ SP vào 5 Sprint (Mục 5.1); tái ước tính cuối Sprint 1 và Sprint 2 dựa trên velocity thực tế; nếu velocity trung bình sau Sprint 2 < 24 SP/Sprint thì cắt PBI-03, PBI-13, PBI-15 theo quy tắc quản lý thay đổi (Mục 9).

### 6. Giải thích các phương pháp phân rã một tính năng lớn thành các tính năng nhỏ.

**Trả lời:** Dùng Disaggregation/Decomposition qua Work Breakdown Structure: chia từ Product → Epic/System → PBI → Task nhỏ hơn (VD PBI-02 OCR chia thành setup BullMQ, tích hợp Tesseract, xử lý retry). Mục tiêu là mỗi task ≤ 2 ngày effort để ước lượng chính xác hơn (Law of Large Numbers cần khoảng 5-10 item).

### 7. Khi không có khả năng phân rã được tính năng lớn, nhóm phải làm thế nào?

**Trả lời:** Chuyển sang Estimation by Analogy (so với PBI/dự án tương tự đã ước tính trước) hoặc dùng Expert Opinion có cấu trúc (Wideband Delphi) như phương án cuối — đúng theo nguyên tắc "Đếm, Tính toán, Phán đoán": Judgment chỉ dùng khi không thể Count hay Compute.

### 8. Ước lượng có thể sai lệch khoảng bao nhiêu lần ở giai đoạn đầu dự án?

**Trả lời:** Theo lý thuyết Cone of Uncertainty, ở giai đoạn Initial Concept sai số có thể dao động từ 0.25x đến 4x. Trong LIBIF, nhóm chốt một khoảng hẹp hơn dựa trên kinh nghiệm và ràng buộc thời gian cố định: **-20% đến +30%**.

### 9. Tại sao cần ước lượng ở giai đoạn đầu của dự án?

**Trả lời:** Để xác định target có realistic hay không, làm cơ sở quyết định phạm vi ngay từ đầu, tránh cam kết không thực tế. Dù sai số lớn ở giai đoạn đầu (Cone rộng), có ước lượng vẫn tốt hơn không có — "5 item vẫn tốt hơn 1 item" — và Cone chỉ thu hẹp dần khi có quyết định/tiến độ thực tế.

### 10. Ước lượng kích cỡ (Size) mang lại lợi ích gì khi ban quản lý chỉ quan tâm Duration và Cost?

**Trả lời:** Vì không thể ước tính trực tiếp Duration/Cost khi chưa biết "khối lượng" công việc cần làm. Size (Story Points) là đại lượng tương đối, ổn định (không đổi theo người thực hiện), trong khi Duration/Cost phụ thuộc năng suất đội (velocity). Do đó nhóm đo Size trước, rồi convert sang Duration/Effort/Cost qua velocity/dữ liệu lịch sử.

### 11. Giải thích quy tắc "Đếm, Tính toán và Đánh giá" (Count, Compute, Judge).

**Trả lời:** Ưu tiên **Đếm** nếu có thể (đếm PBI, chấm SP qua Planning Poker); khi không đếm trực tiếp được thì **Tính toán** dựa trên dữ liệu lịch sử/công thức (suy ra giờ-người từ SP hoặc từ capacity 6 SV×15h); chỉ dùng **Phán đoán** chủ quan khi không còn cách nào khác (VD ước tính ảnh hưởng của rủi ro OCR tiếng Việt kém).

### 12. Giải thích các kỹ thuật để tăng độ chính xác khi ước lượng bằng đánh giá chủ quan.

**Trả lời:** Dùng **Structured Expert Judgment** thay vì đánh giá trực giác đơn lẻ: Wideband Delphi (nhiều chuyên gia ước tính độc lập, thảo luận ẩn danh, lặp nhiều vòng đến khi hội tụ); Planning Poker (kết hợp expert opinion + analogy + disaggregation, timebox thảo luận 2 phút); dùng khoảng ước tính Best case/Worst case và tính Expected Case theo công thức PERT = (Optimistic + 4×MostLikely + Pessimistic)/6 thay vì lấy trung điểm.

### 13. Giải thích các kỹ thuật để tăng độ chính xác khi ước lượng bằng "Phân rã và Kết hợp" (Decomposition and Recomposition).

**Trả lời:** Chia tính năng lớn thành nhiều task nhỏ (mỗi task ≤ 2 ngày), từng thành viên ước tính độc lập từng task, sau đó tổng hợp (recompose) lại thành estimate tổng. Nhờ Law of Large Numbers, sai số dương/âm giữa các task nhỏ có xu hướng bù trừ lẫn nhau, giúp sai số trung bình của tổng thể thấp hơn so với ước tính một khối lớn duy nhất. Cần khoảng 5-10 item để có lợi ích rõ rệt.

### 14. Giải thích kỹ thuật ước lượng bằng các lá bài (Planning Poker).

**Trả lời:** Mỗi thành viên có bộ bài theo thang Fibonacci (1,2,3,5,8,13...); Product Owner đọc story, cả nhóm đồng thời lật bài để tránh hiệu ứng neo (anchoring); nếu điểm chênh lệch lớn thì thảo luận (dùng đồng hồ cát 2 phút), sau đó ước lượng lại vòng 2, lặp lại đến khi hội tụ. Nguyên tắc quan trọng: 3 thành viên junior không được outvote 1 thành viên senior giàu kinh nghiệm hơn — quyết định dựa trên thảo luận thuyết phục, không phải số đông.

## Điều không nên nói

- Không nói Story Point quy đổi trực tiếp thành số giờ cố định (1 SP ≠ X giờ — SP chỉ mang tính tương đối).
- Không nói ước lượng ban đầu chính là cam kết (commitment) cuối cùng; ước lượng (estimate), mục tiêu (target) và cam kết (commitment) là ba khái niệm khác nhau.
- Không nói 136 SP hay 765 giờ-người là con số chính xác tuyệt đối; luôn kèm sai số −20%/+30% và có điểm tái ước tính.
- Không kể các kỹ thuật/công cụ nhóm chưa thực sự áp dụng (VD nếu chỉ dùng Planning Poker thì không nói đã chạy đầy đủ quy trình Wideband Delphi nhiều vòng).
- Không nói tăng thêm giờ làm việc sẽ luôn rút ngắn effort tuyến tính (bỏ qua overhead phối hợp, hiệu ứng Parkinson's Law).