# Kiến thức quan trọng & câu trả lời ngắn gọn cho câu hỏi thường gặp

## Điểm neo phải nhớ

    7 inputs → Mục đích/Bối cảnh → Mục tiêu → Phạm vi (trong/co giãn/ngoài)
             → Deliverables → Tiêu chí chấp nhận → Lịch trình → Nguồn lực/Ngân sách
             → Trách nhiệm/Nghiệm thu/Thay đổi → Quyền sở hữu/AI → Điều kiện hoàn tất

    SOW = "WHAT, not HOW" — mô tả YÊU CẦU TỐI THIỂU, không mô tả cách làm kỹ thuật

    LIBIF SOW KHÔNG phải hợp đồng thương mại — là thỏa thuận phạm vi phục vụ đánh giá học phần

## Cấu trúc trả lời khi vấn đáp

1. Nêu SOW là gì (yêu cầu tối thiểu, WHAT not HOW) và khẳng định đây không phải hợp đồng thương mại.
2. Liệt kê đầu vào và các bước nhóm đã làm để tạo SOW.
3. Nêu cách đánh giá và cách SOW được dùng suốt 5 Sprint (nghiệm thu, quản lý thay đổi).
4. Nếu được hỏi thêm về Software Contract: chuyển sang trả lời bằng lý thuyết (Fixed-Price vs Time & Materials), nói rõ đây là kiến thức áp dụng ngoài phạm vi LIBIF vì nhóm không ký hợp đồng thật.

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Phát biểu công việc là gì?

**Trả lời:** Theo mô hình SOW: Purpose, Objectives of the work, Scope of work, Location of the work, Period of performance, Proposed Designs/UIs/Workflows/Features, Assumptions, Deliverables schedule, Applicable standards, Acceptance criteria, Change management process, Professional services agreement, Specialized requirements — tất cả trả lời **WHAT** cần làm, không phải **HOW** để làm.

### 2. Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Phát biểu công việc là gì?

**Trả lời:** 7 đầu vào: Charter, Vision & Scope, Product Backlog, Architecture, PoC, Project Estimation, Project Planning. 9 bước: (1) xác định mục đích/bối cảnh, (2) mục tiêu công việc, (3) phạm vi công việc (8 WP + phạm vi co giãn + ngoài phạm vi), (4) sản phẩm bàn giao, (5) tiêu chí chấp nhận, (6) lịch trình/milestone, (7) nguồn lực & ngân sách, (8) trách nhiệm/nghiệm thu/quản lý thay đổi, (9) quyền sở hữu-AI, điều kiện hoàn tất và ký xác nhận.

### 3. Tài liệu Phát biểu công việc của nhóm đã được đánh giá thế nào?

**Trả lời:** Dùng chính 2 bộ tiêu chí chấp nhận trong SOW để tự đánh giá: AC-01→08 kiểm tra sản phẩm có đạt yêu cầu chức năng tối thiểu không (demo, test case, security checklist); PM-AC-01→06 kiểm tra bằng chứng quản lý dự án (baseline, 5 Sprint, đóng góp, risk register, tái ước tính, dùng AI đúng quy định). Ngoài ra SOW còn được đối chiếu tính nhất quán với Project Estimation và Product Backlog để đảm bảo không có số liệu vênh nhau.

### 4. Tại sao cần tạo tài liệu Phát biểu công việc?

**Trả lời:** Theo Slide 06 (Why SOW): cung cấp hiểu biết rõ ràng về yêu cầu, thiết lập baseline để đánh giá, giảm thời gian đánh giá/thương lượng, giảm nhu cầu thay đổi trong tương lai, và tạo cơ sở đo hiệu suất (contractor performance measures). Với LIBIF, SOW là căn cứ khách quan để giảng viên và nhóm cùng biết "làm đến đâu là đủ", tránh tranh cãi phạm vi lúc nộp bài.

### 5. Tài liệu Phát biểu công việc của nhóm đã được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào?

**Trả lời:** Được dùng làm căn cứ trong quy trình nghiệm thu 8 bước mỗi Sprint (Sec. 12): owner tự kiểm tra AC → peer review → QA test → PO kiểm tra trên staging → demo Sprint Review → chuyển Done/quay lại Backlog. Mọi thay đổi phạm vi đi qua bảng thẩm quyền ở Sec. 13 (từ đổi thứ tự PBI do PO tới thay đổi deadline chỉ do giảng viên xác nhận), không thống nhất qua lời nói. SOW được coi là hoàn tất khi đủ 6 điều kiện ở Sec. 15 (nộp deliverable, có release/tag, test report, báo cáo phạm vi hoàn thành/chưa hoàn thành, chi phí đối chiếu, có retrospective cuối dự án).

### 6. Giải thích sự khác nhau về thời gian và chi phí giữa Đề xuất dự án, Ước lượng dự án và Phát biểu công việc.

**Trả lời:** Đề xuất dự án cho con số sơ bộ, độ chính xác thấp, dùng để quyết định có làm hay không. Ước lượng dự án tinh chỉnh con số đó bằng kỹ thuật ước lượng (WBS/backlog) để tạo baseline kỹ thuật (136 SP, 900h, 0 VNĐ). Phát biểu công việc không tạo số liệu mới mà **lấy đúng baseline đó** và biến thành cam kết chính thức về lịch trình (Sec. 7) và ngân sách (Sec. 9) dùng làm căn cứ nghiệm thu — thay đổi con số này phải qua Change Request chứ không tự do điều chỉnh như lúc ước lượng.

### 7. Các câu hỏi chính cần trả lời trong tài liệu Hợp đồng dự án phần mềm (Software Contract) là gì?

**Trả lời:** Theo Slide 06, Software Contract là "custom-software development agreement" quy định quyền và trách nhiệm giữa nhà phát triển và khách hàng, cần trả lời: nhận diện các bên (identification of the parties), điều khoản thanh toán (payment), chi phí khác (other costs), phí trễ hạn (late fees), thay đổi phạm vi dự án (changes in project scope), trễ tiến độ (delays), đào tạo (training), hỗ trợ và bảo trì (support and maintenance), bảo hành (warranties), trách nhiệm (responsibilities).

**Lưu ý LIBIF:** Nhóm không có hợp đồng thương mại thật — SOW của nhóm nói rõ "không phải hợp đồng thương mại, cam kết cung cấp dịch vụ production". Đây là câu hỏi lý thuyết, trả lời dựa trên kiến thức Slide 06, không gán ghép vào LIBIF.

### 8. Giải thích sự khác nhau giữa Hợp đồng giá cố định và Hợp đồng theo nguyên vật liệu và thời gian.

**Trả lời:**

- **Hợp đồng giá cố định (Fixed-Price Contract):** dựa trên phạm vi (scope) đã đặc tả chi tiết đầy đủ, giá và ngày giao hàng đã thống nhất trước; giả định khách hàng đã biết rõ mình muốn gì; phù hợp mô hình waterfall có yêu cầu ổn định. Không thay đổi: rủi ro thấp, giá biết trước, đúng hạn/ngân sách. Có thay đổi: chi phí cao vì phát sinh change request thường được định giá không cạnh tranh (do đã trúng thầu).
- **Hợp đồng theo nguyên vật liệu và thời gian (Time and Materials):** trả theo chi phí thực tế của nhân công (theo cấp bậc: junior/senior...) và vật tư/thiết bị sử dụng, cộng thêm phụ phí cố định cho overhead/lợi nhuận nhà cung cấp. Phù hợp khi dự án không thể mô tả đầy đủ và rõ ràng ngay từ đầu, hoặc có khả năng thay đổi trong quá trình làm. Khách hàng "mua" nguồn lực có kiến thức/kinh nghiệm và dùng nó để đạt mục tiêu dự án; đòi hỏi khách hàng tin nhà phát triển chi tiêu hợp lý, và nhà phát triển tin khách hàng không hủy hợp đồng vô cớ.

### 9. Vì sao SOW của LIBIF không phải là hợp đồng thương mại?

**Trả lời:** Vì đây là đồ án học phần Quản lý dự án phần mềm — bên "thực hiện" là nhóm sinh viên, bên "đánh giá" là giảng viên, không có giao dịch tiền bạc/pháp lý giữa hai bên độc lập như trong hợp đồng thật. SOW ghi rõ trong Sec. 1: các thuật ngữ "bàn giao", "nghiệm thu", "chi phí" được hiểu trong bối cảnh đồ án sinh viên, không phải cam kết cung cấp dịch vụ production hay chứng nhận an toàn thông tin.

### 10. Phạm vi co giãn (Should Have) trong SOW dùng để làm gì?

**Trả lời:** PBI-03, PBI-13, PBI-15 (13 SP) được đánh dấu Should Have — nếu velocity trung bình sau Sprint 2 dưới 24 SP/Sprint hoặc capacity giảm đáng kể, Product Owner được quyền đề xuất hoãn các PBI này để bảo vệ deadline và chất lượng của 13 PBI Must Have (104 SP). Đây là cơ chế linh hoạt hóa cam kết mà vẫn giữ được tính "Fixed" cho phần lõi.

### 11. Ai chịu trách nhiệm nghiệm thu cuối cùng — Product Owner hay Giảng viên?

**Trả lời:** Product Owner chấp nhận PBI trong Sprint Review là **nghiệm thu nội bộ của nhóm**, không thay thế quyền đánh giá học phần của Giảng viên (Sec. 12, câu cuối). Hai lớp nghiệm thu tách biệt: PO đảm bảo chất lượng Increment theo Definition of Done; Giảng viên đánh giá toàn bộ sản phẩm/bằng chứng theo yêu cầu học phần.

### 12. Nếu SOW và Product Backlog có nội dung khác nhau thì áp dụng theo tài liệu nào?

**Trả lời:** Theo xác nhận cuối tài liệu (Sec. cuối): khi SOW và Product Backlog khác nhau, **thay đổi được phê duyệt gần nhất và có bằng chứng trong hồ sơ dự án** là căn cứ áp dụng — nghĩa là không có tài liệu nào "luôn đúng" một cách tuyệt đối, mà quy trình Change Request và bằng chứng cập nhật mới nhất mới quyết định.

## Điều không nên nói

- Không gọi SOW của LIBIF là "hợp đồng" theo nghĩa thương mại — tài liệu tự nêu rõ đây không phải hợp đồng.
- Không nhầm SOW với Ước lượng dự án — SOW không tạo số liệu ước lượng mới, chỉ cam kết hóa baseline đã có.
- Không nói SOW mô tả cách làm kỹ thuật (HOW) — SOW chỉ mô tả yêu cầu tối thiểu (WHAT).
- Không khẳng định nhóm có hợp đồng Fixed-Price hay Time & Materials thật — câu hỏi về Software Contract là lý thuyết, trả lời từ Slide 06, không gán cho LIBIF.
- Không nói Product Owner chấp nhận PBI là nghiệm thu cuối cùng thay giảng viên.
- Không nói phạm vi "ngoài phạm vi" (Sec. 4.4) là việc nhóm không biết làm — đó là ranh giới chủ động để kiểm soát quy mô đồ án.

---

# PHẦN 3 — Tài liệu cần in để nộp cho giảng viên lúc vấn đáp

Theo đề bài (phần ngoặc đơn của Câu 12): **"Sinh viên nộp kèm bản in tài liệu Phát biểu công việc của nhóm."**

☐ In toàn bộ file `LIBIF-Statement-Of-Work.md`, gồm đầy đủ các mục:

- Mục 1: Mục đích và tính chất tài liệu, đầu vào
- Mục 2-3: Bối cảnh & bài toán, Mục tiêu công việc
- Mục 4: Phạm vi công việc (gói WP, bảng PBI, phạm vi co giãn, ngoài phạm vi)
- Mục 5: Sản phẩm bàn giao (DEL-01→08)
- Mục 6: Tiêu chí chấp nhận (AC + PM-AC + giới hạn bảo mật)
- Mục 7-8: Lịch thực hiện & Milestone, Nguồn lực và phân công
- Mục 9-10: Ngân sách & điều kiện chi phí, Giả định/Phụ thuộc/Ràng buộc
- Mục 11-13: Trách nhiệm các bên, Quy trình nghiệm thu, Quản lý thay đổi
- Mục 14-16: Quyền sở hữu/Bản quyền/AI, Điều kiện hoàn tất SOW, Xác nhận phạm vi

> Lưu ý: đánh số **"Câu 12"** lên đầu bản in trước khi vào phòng thi. Nếu giảng viên hỏi sâu về Software Contract, không có bản in riêng để nộp thêm (đề chỉ yêu cầu bản in SOW) — chuẩn bị trả lời bằng lời dựa trên Slide 06 (Fixed-Price vs Time & Materials).