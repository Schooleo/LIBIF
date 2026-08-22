# CÂU 11 – KẾ HOẠCH DỰ ÁN (PROJECT PLAN)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Kế hoạch dự án (Project Plan) của nhóm.  
> **Kèm theo:** Bản in tài liệu Kế hoạch dự án của nhóm (`LIBIF-Project-Planning.md` / `Q11-print.md`).

---

## PHẦN 1: BÀI VIẾT TAY A4 (Dành cho 10 phút viết nhanh trên giấy thi)

*Mẹo: Vào phòng thi, vẽ ngay khung nguyên lý W5HH và sơ đồ luồng hoạt động 5 Sprint để gây ấn tượng mạnh về tính cấu trúc.*

```
+---------------------------------------------------------------------------------------------------+
|                       BÀI TRÌNH BÀY VẤN ĐÁP A4 - CÂU 11: KẾ HOẠCH DỰ ÁN (LIBIF)                   |
+---------------------------------------------------------------------------------------------------+

1. ĐỊNH NGHĨA & NGUYÊN LÝ W5HH (BARRY BOEHM)
- Kế hoạch dự án (Project Plan) là "Bản đồ dẫn đường" (Roadmap/Navigation Map) tích hợp toàn bộ các 
  hoạt động quản lý nhằm đưa dự án từ khởi tạo đến bàn giao thành công.
- Trả lời 7 câu hỏi W5HH:
  + Why: Lý do & Lợi ích (Số hóa thư viện, chống rò rỉ dữ liệu).
  + What: Phạm vi công việc & Mục tiêu (16 PBIs, 3 Enablers, 136 SP).
  + When: Lịch trình & Milestone (10 tuần, 5 Sprint, 5 Mốc G1-G5).
  + Who & Where: Cơ cấu tổ chức & Trách nhiệm (6 SV, ma trận RACI, TV-01 -> TV-06).
  + How (Tech & Manage): Mô hình Scrum, Modular Monolith, Docker/CI-CD, Quản lý rủi ro & chất lượng.
  + How Much: Nguồn lực & Chi phí (900h effort, 0 VNĐ ngân sách - tối ưu free-tier).

2. QUÁ TRÌNH HÌNH THÀNH (Đầu vào -> Phương pháp -> Đầu ra)
- Đầu vào (Inputs): Project Charter, Vision & Scope, Product Backlog, Architecture, PoC, Project Estimation.
- Phương pháp áp dụng (Techniques):
  + Lập kế hoạch Agile (Planning Onion): Product Vision -> Release Plan -> Sprint Plan -> Daily Plan.
  + Work Breakdown Structure (WBS): Phân rã 8 gói công việc (1.0 Quản lý đến 8.0 Bàn giao).
  + Ma trận phân công trách nhiệm RACI (Responsible, Accountable, Consulted, Informed).
  + Quản lý luồng công việc: Backlog -> Ready -> In Progress -> Code Review -> Testing -> Done.
  + Kế hoạch tích hợp quản trị: Rủi ro (Risk), Chất lượng (DoD/DoR), Thay đổi (Change), Giao tiếp.
- Đầu ra (Outputs): Bản Kế hoạch dự án hoàn chỉnh 15 mục, tích hợp mọi baseline quản trị.

3. PHƯƠNG PHÁP ĐÁNH GIÁ & ĐIỀU CHỈNH TÀI LIỆU
- Đánh giá sự đồng thuận (Consensus): 6 thành viên cam kết capacity (15h/tuần) và nhận vai trò (RACI).
- Kiểm tra tính nhất quán (Consistency): Khớp tuyệt đối với Baseline của Project Estimation.
- Đánh giá theo Sprint: Cập nhật sau mỗi Sprint Review/Retro (Velocity, Burndown, Impediments).
- Cơ chế kiểm soát thay đổi: Change Request qua PO -> Đánh giá tác động -> Hoán đổi SP tương đương.

4. BẢNG TÓM TẮT TIẾN ĐỘ 5 SPRINT & CÁC MỐC MILESTONE CỐT LÕI
+---------+-------+--------------------------------------+---------------+--------+------------------+
| Sprint  | Tuần  | Mục tiêu chính (Sprint Goal)          | Phạm vi (PBI) | Quy mô | Mốc Milestone    |
+---------+-------+--------------------------------------+---------------+--------+------------------+
| Sprint 1| 1-2   | Dựng nền tảng & OCR Pipeline         | EN-01, PBI1,2 | 26 SP  | G1: OCR Baseline |
| Sprint 2| 3-4   | Nghiệp vụ kiểm duyệt & biên mục      | PBI-03,4,5,6  | 28 SP  | G2: Midterm Demo |
| Sprint 3| 5-6   | Xuất bản an toàn & Kiểm soát truy cập| PBI-07,8,9,16 | 29 SP  | G3: DRM & Access |
| Sprint 4| 7-8   | Tra cứu toàn văn & Đọc sách an toàn  | PBI-10,11,14,15 29 SP | G4: Feature Done |
| Sprint 5| 9-10  | Tích hợp, kiểm thử & Bàn giao        | PBI-12,13,EN2,3 24 SP | G5: Final Submit |
+---------+-------+--------------------------------------+---------------+--------+------------------+
```

---

## PHẦN 2: GIẢI THÍCH LÝ THUYẾT CHI TIẾT (Dành cho thành viên ôn tập & hiểu sâu)

### 2.1 Bản chất của Kế hoạch Quản lý Dự án (Project Management Plan)
- **Định nghĩa:** Kế hoạch dự án là tài liệu chính thức, được phê duyệt, dùng để hướng dẫn việc thực thi, giám sát, kiểm soát và kết thúc dự án. Nó không chỉ là một bảng tiến độ (Gantt Chart hay Sprint Board), mà là sự **tích hợp toàn diện** của các kế hoạch thành phần:
  - Kế hoạch phạm vi (Scope Management Plan)
  - Kế hoạch tiến độ (Schedule Management Plan)
  - Kế hoạch chi phí & nguồn lực (Cost & Resource Plan)
  - Kế hoạch chất lượng (Quality Management Plan - DoR, DoD)
  - Kế hoạch giao tiếp (Communication Plan)
  - Kế hoạch rủi ro (Risk Management Plan)
  - Kế hoạch quản lý thay đổi & cấu hình (Change & Configuration Management Plan)
- **Tại sao cần lập kế hoạch (Why Planning - Slide 06)?:**
  1. *Reducing uncertainty* (Giảm thiểu sự bất định).
  2. *Establishing trust* (Tạo lập sự tin tưởng giữa các bên).
  3. *Reducing risks* (Nhận diện và giảm thiểu rủi ro sớm).
  4. *Supporting better decision making* (Cung cấp cơ sở dữ liệu để ra quyết định).
  5. *Conveying information* (Truyền đạt thông tin rõ ràng, thống nhất kỳ vọng).

### 2.2 Nguyên lý W5HH của Barry Boehm
Là bộ khung tư duy kinh điển áp dụng cho mọi dự án phần mềm ở mọi quy mô:
1. **Why (Tại sao):** Tại sao phần mềm này được phát triển? Lợi ích kinh doanh và giá trị mang lại là gì? (LIBIF: Giải quyết bài toán số hóa di sản và chống rò rỉ tài liệu số cho thư viện).
2. **What (Cái gì):** Dự án sẽ làm những gì? Phạm vi chức năng và sản phẩm bàn giao là gì? (LIBIF: 16 PBIs, 3 Enablers, mã nguồn, tài liệu, Docker, bộ test).
3. **When (Khi nào):** Khi nào công việc hoàn thành? Các mốc bàn giao lớn (Milestones) là gì? (LIBIF: 10 tuần học, 5 Sprint, mốc G1 đến G5).
4. **Who (Ai):** Ai chịu trách nhiệm cho các chức năng? Cơ cấu nhóm và sự phân công ra sao? (LIBIF: 6 sinh viên với vai trò PO, SM/Tech Lead, Dev, QA/DevOps qua ma trận RACI).
5. **Where (Ở đâu):** Các bên liên quan nằm ở đâu về mặt tổ chức? (LIBIF: Nhóm sinh viên, giảng viên hướng dẫn, người dùng đại diện).
6. **How technically & managerially (Làm thế nào):** Về mặt kỹ thuật và quản lý sẽ thực hiện ra sao? (LIBIF: Kỹ thuật dùng Modular Monolith/React/NestJS/Docker; Quản lý dùng quy trình Scrum 2 tuần/Sprint).
7. **How much (Bao nhiêu):** Cần bao nhiêu tài nguyên, công sức và tiền bạc? (LIBIF: 900 giờ công danh nghĩa, 765 giờ tập trung, ngân sách 0 VNĐ tối ưu free-tier).

### 2.3 Các cấp độ lập kế hoạch trong Agile (Agile Planning Onion)
Theo Mike Cohn (*Agile Estimating and Planning*), lập kế hoạch trong Agile diễn ra theo nhiều tầng:
```
           ( 1. Strategy )
          ( 2. Portfolio  )
         ( 3. Product Vision)
        ( 4. Product Roadmap )
       (  5. Release Plan     )
      (   6. Sprint Plan       )
     (    7. Daily Plan         )
```
- **Product Roadmap:** Lộ trình dài hạn định hướng sản phẩm qua các bản phát hành.
- **Release Plan:** Kế hoạch phát hành trung hạn (thường từ vài Sprint đến vài tháng) trả lời: *Bao giờ thì có bản phát hành? Có những tính năng gì? Chi phí bao nhiêu?*
  - *Fixed-Date Release Plan:* Cố định ngày ra mắt (VD: Cuối tuần 10), phạm vi co giãn linh hoạt.
  - *Fixed-Scope Release Plan:* Cố định phạm vi (đủ hết các tính năng mong muốn), thời gian có thể dịch chuyển.
  - *LIBIF áp dụng Fixed-Date Release Plan:* Cố định 10 tuần, bảo đảm 13 Must Have, co giãn 3 Should Have.
- **Sprint Plan:** Kế hoạch chi tiết trong timebox 2 tuần (Sprint Goal, Sprint Backlog, Capacity, Task Breakdown).
- **Daily Plan:** Kế hoạch hàng ngày qua Daily Scrum (15 phút: việc đã làm hôm qua, việc làm hôm nay, trở ngại).

### 2.4 Kỹ thuật lập tiến độ truyền thống (Traditional Scheduling) & Phân tích đường găng (CPM)
Trong quản lý dự án truyền thống (Slide *06 Software Project Planning*):
- **Phân rã công việc (WBS -> Activity List):** Xác định các hoạt động cụ thể và thuộc tính (Activity Attributes).
- **Xác định phụ thuộc (Dependencies):**
  - *Mandatory dependencies (Phụ thuộc bắt buộc/Hard logic):* Do bản chất kỹ thuật (VD: Phải OCR xong mới đối soát được; phải mã hóa xong mới đưa vào lưu kho).
  - *Discretionary dependencies (Phụ thuộc tùy ý/Soft logic/Best practice):* Do nhóm lựa chọn quy trình (VD: Viết Unit Test trước hay sau khi viết code).
  - *External dependencies:* Phụ thuộc bên ngoài (VD: Chờ giảng viên duyệt đề cương, chờ cấp quyền VPS).
  - *Internal dependencies:* Phụ thuộc nội bộ giữa các task của nhóm.
- **Quan hệ logic (Logical Relationships):** Finish-to-Start (FS - phổ biến nhất), Start-to-Start (SS), Finish-to-Finish (FF), Start-to-Finish (SF - hiếm gặp).
- **Critical Path Method (CPM - Phương pháp đường găng):**
  - Đường găng là chuỗi các hoạt động có tổng thời gian dài nhất từ đầu đến cuối dự án, quyết định **thời gian ngắn nhất để hoàn thành dự án**.
  - Bất kỳ sự chậm trễ nào trên đường găng đều làm chậm toàn bộ dự án.
  - Phân tích qua 2 lượt:
    + *Forward Pass (Lượt tiến):* Tính ngày bắt đầu sớm (Early Start - ES) và ngày kết thúc sớm (Early Finish - EF).
    + *Backward Pass (Lượt lùi):* Tính ngày kết thúc muộn (Late Finish - LF) và ngày bắt đầu muộn (Late Start - LS).
    + *Total Float / Slack (Độ trôi tổng thể):* $\text{Float} = \text{LS} - \text{ES} = \text{LF} - \text{EF}$. Các hoạt động trên đường găng có $\text{Float} = 0$.
    + *Free Float (Độ trôi tự do):* Khoảng thời gian một task có thể trễ mà không làm ảnh hưởng đến ngày bắt đầu sớm của bất kỳ task kế tiếp nào.

---

## PHẦN 3: TRẢ LỜI ĐẦY ĐỦ CÁC CÂU HỎI THƯỜNG GẶP (FAQs)

### Q1: Các câu hỏi chính cần trả lời trong tài liệu Kế hoạch dự án là gì?
Tài liệu trả lời trọn vẹn 7 câu hỏi theo nguyên lý W5HH:
1. **Tại sao (Why):** Mục tiêu học phần và giá trị giải pháp thư viện số LIBIF.
2. **Cái gì (What):** Phạm vi bàn giao (16 PBIs, 3 Enablers, 8 WBS packages, tiêu chí thành công SC-01 đến SC-07).
3. **Khi nào (When):** Lịch trình 10 tuần, 5 Sprint và 5 mốc Milestone (G1 -> G5).
4. **Ai & Ở đâu (Who & Where):** Cơ cấu 6 sinh viên, ma trận RACI và vai trò của giảng viên/người dùng đại diện.
5. **Thực hiện thế nào (How):** Quy trình Scrum, quy tắc luồng việc (DoR, DoD), kế hoạch kiểm thử, kế hoạch quản lý cấu hình và rủi ro.
6. **Chi phí bao nhiêu (How Much):** 900 giờ-người, ngân sách tiền mặt 0 VNĐ (sử dụng Azure for Students, Free AI, Subdomain).

### Q2: Các đầu vào cần thiết và các bước nhóm đã thực hiện để tạo tài liệu Kế hoạch dự án?
- **Đầu vào (Inputs):**
  - `LIBIF-Project-Estimation.md` (Baseline quy mô 136 SP, effort 900h, chi phí 0 VNĐ).
  - `LIBIF-Product-Backlog.md` (Danh sách 16 PBIs, User Stories, Acceptance Criteria).
  - `LIBIF-Architecture.md` (Thiết kế hệ thống Modular Monolith, công nghệ, hạ tầng).
  - `LIBIF-Proof-Of-Concept.md` (Kết quả thử nghiệm kỹ thuật Canvas DRM).
  - `LIBIF-Project-Vision-Scope.md` & `LIBIF-Project-Charter.md`.
- **Các bước thực hiện (Steps):**
  - *Bước 1:* Xác lập mục tiêu và tiêu chí thành công của dự án (SC-01 đến SC-07).
  - *Bước 2:* Xây dựng cấu trúc phân rã công việc WBS (8 gói công việc 1.0 đến 8.0).
  - *Bước 3:* Thiết lập cơ cấu tổ chức nhóm, phân định vai trò và lập ma trận RACI.
  - *Bước 4:* Lập kế hoạch tiến độ 5 Sprint, xác định Sprint Goal, gán PBI và xác lập 5 mốc Milestone (G1-G5).
  - *Bước 5:* Xây dựng kế hoạch quản lý chất lượng (Chiến lược test, Definition of Ready, Definition of Done).
  - *Bước 6:* Xây dựng các kế hoạch tích hợp: Giao tiếp, Quản lý rủi ro (Risk Register), Quản lý cấu hình & Quản lý thay đổi.
  - *Bước 7:* Lập kế hoạch đóng dự án và tổ chức ký duyệt phê duyệt kế hoạch.

### Q3: Tài liệu Kế hoạch dự án của nhóm đã được đánh giá thế nào?
1. **Đánh giá tính đầy đủ & khả thi (Completeness & Feasibility):** Rà soát toàn bộ các gói công việc WBS đảm bảo không thiếu sót khâu nào từ khởi tạo, lập trình, kiểm thử đến đóng gói bàn giao.
2. **Đánh giá sự cam kết của thành viên (Team Buy-in & Commitment):** Toàn bộ 6 thành viên đồng thuận với mức cam kết 15 giờ/tuần, hiểu rõ ma trận RACI và vai trò chịu trách nhiệm của mình.
3. **Đánh giá tính nhất quán đa tài liệu (Cross-document Consistency):** Đối chiếu với tài liệu Ước lượng (`LIBIF-Project-Estimation.md`) và Tuyên bố công việc (`LIBIF-Statement-Of-Work.md`), đảm bảo thống nhất tuyệt đối về số lượng PBI (16), Story Points (136), số Sprint (5), effort (900h) và ngân sách (0 VNĐ).
4. **Phê duyệt bởi Giảng viên & Nhóm:** Kế hoạch có mục ký duyệt chính thức ở phần kết (Mục 15).

### Q4: Tại sao cần tạo tài liệu Kế hoạch dự án?
1. **Định hướng thực thi (Roadmap for Execution):** Cung cấp "bản đồ" chỉ rõ ai phải làm gì, vào thời điểm nào, phối hợp với ai.
2. **Giảm thiểu bất định & rủi ro (Risk & Uncertainty Reduction):** Chuẩn bị trước các phương án dự phòng khi gặp sự cố (mất mạng, thi cử, OCR kém).
3. **Tạo lập cam kết và trách nhiệm (Accountability):** Rõ ràng người chịu trách nhiệm chính (A) và người thực hiện (R) qua ma trận RACI, tránh đùn đẩy trách nhiệm.
4. **Cơ sở để giám sát và kiểm soát (Baseline for Monitoring & Control):** Nếu không có kế hoạch ban đầu, nhóm không thể biết mình đang chạy nhanh hay chậm, thừa hay thiếu ngân sách.

### Q5: Tài liệu Kế hoạch dự án của nhóm đã được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào?
- **Sử dụng hàng ngày/hàng tuần:**
  - Làm căn cứ tổ chức Sprint Planning đầu mỗi Sprint (chọn PBI theo Sprint Goal đã định).
  - Định hướng hoạt động Daily Scrum (kiểm tra tiến độ so với Sprint Backlog).
  - Điều phối kiểm thử và nghiệm thu tính năng dựa trên Definition of Done.
- **Cập nhật định kỳ:**
  - Cuối mỗi Sprint (Sprint Review & Retrospective): Cập nhật trạng thái bàn giao, điều chỉnh Velocity thực tế.
  - Tại mốc cuối Sprint 2: Đánh giá lại toàn bộ tiến độ, nếu Velocity < 24 SP/Sprint -> Kích hoạt cập nhật kế hoạch (hoãn 3 PBI Should Have).
  - Khi có Change Request được duyệt: Cập nhật lại phạm vi và phân bổ công việc.

### Q6: Một số mô hình cho phép không xác định rõ các kết quả cuối cùng của dự án (ví dụ Agile/Scrum), vậy có cần tạo tài liệu Kế hoạch dự án trong các trường hợp này hay không? Tại sao?
- **TRẢ LỜI: CÓ, HOÀN TOÀN BẮT BUỘC PHẢI TẠO KẾ HOẠCH DỰ ÁN!**
- **Giải thích:**
  1. *Agile không đồng nghĩa với "Không có kế hoạch" (No Planning):* Tuyên ngôn Agile nhấn mạnh *"Phản hồi với sự thay đổi hơn là bám sát một kế hoạch"* (Responding to change over following a plan), nhưng không có nghĩa là loại bỏ kế hoạch. Thực tế, Agile đòi hỏi **lập kế hoạch liên tục ở nhiều cấp độ (Planning Onion)**.
  2. *Dù kết quả chi tiết linh hoạt, các yếu tố quản trị cốt lõi vẫn phải cố định:* 
     - Phải có **Product Vision** và **Product Roadmap** để biết đích đến.
     - Phải có kế hoạch về **Thời gian (Timebox)**, **Nguồn lực (Capacity)** và **Ngân sách (Budget)** để đảm bảo dự án không vượt quá giới hạn tài chính và hạn chót bàn giao.
     - Phải có quy tắc về **Quy trình phối hợp (Scrum events)**, **Tiêu chuẩn chất lượng (DoR/DoD)** và **Quản lý rủi ro**.
  3. *Kế hoạch trong Agile đóng vai trò là "Điểm tựa để ra quyết định" (Basis for decision making):* Kế hoạch giúp nhóm nhận biết khi nào có sự sai lệch để kịp thời điều chỉnh (Pivot) hoặc tái ưu tiên Backlog.

### Q7: Tài liệu Kế hoạch dự án (Project Plan) khác gì với tài liệu Định nghĩa quy trình phát triển phần mềm (Software Process Definition - SPD)?

| Tiêu chí phân biệt | Định nghĩa quy trình (SPD) | Kế hoạch dự án (Project Plan) |
| :--- | :--- | :--- |
| **Bản chất** | **"Luật chơi" / Khung phương pháp luận** | **"Bản đồ thực thi" cho một dự án cụ thể** |
| **Câu hỏi trả lời** | *Chúng ta làm việc theo quy trình, nguyên tắc nào?* | *Với dự án này, làm cái gì, khi nào xong, ai làm, tốn bao nhiêu tiền?* |
| **Tính tái sử dụng** | Có thể tái sử dụng cho nhiều dự án khác nhau trong tổ chức | Duy nhất cho dự án cụ thể (LIBIF), không tái sử dụng nguyên vẹn |
| **Nội dung chính** | - Lựa chọn mô hình SDLC (Scrum, Kanban, Waterfall)<br>- Định nghĩa các vai trò chuẩn (PO, SM, Dev, QA)<br>- Quy định các sự kiện, nghi thức (Planning, Daily, Review, Retro)<br>- Tiêu chuẩn chất lượng chung (Coding Standard, DoR, DoD template)<br>- Quy trình kiểm thử, tích hợp liên tục (CI/CD workflow) | - Mục tiêu cụ thể & WBS của dự án LIBIF<br>- Phân công đích danh từng con người (TV-01 đến TV-06, RACI)<br>- Lịch trình chi tiết (Sprint 1 bắt đầu ngày nào, PBI nào làm ở Sprint nào)<br>- Ngân sách chi tiết (0 VNĐ) & Năng lực giờ công (900h)<br>- Danh mục rủi ro cụ thể của dự án (OCR tiếng Việt, Web Crypto...) |
| **Tần suất thay đổi** | Ổn định, ít thay đổi trong suốt vòng đời dự án | Cập nhật liên tục sau mỗi Sprint dựa trên dữ liệu thực tế |

---

## PHẦN 4: ĐỐI CHIẾU, VALIDATION & PHẢN BIỆN TÀI LIỆU CỦA NHÓM

### 4.1 Điểm mạnh của tài liệu nhóm (`LIBIF-Project-Planning.md`)
1. **Cấu trúc 15 mục toàn diện:** Bao phủ đầy đủ từ Mục đích, Baseline, Mô hình Scrum, Tổ chức nhóm, WBS, Lịch 5 Sprint, Nguồn lực, Chi phí, Chất lượng, Giao tiếp, Rủi ro, Quản lý thay đổi, Giám sát, Đóng dự án đến Phê duyệt.
2. **Tuân thủ chặt chẽ mô hình Fixed-Date Agile Planning:** Cố định thời hạn 10 tuần, bảo đảm 13 Must Have và xác định rõ cơ chế co giãn cho 3 Should Have.
3. **Phân rã WBS 8 gói rõ ràng (1.0 đến 8.0):** Gắn liền với các PBI trong Product Backlog và có phân công Owner cụ thể.
4. **Ma trận RACI minh bạch:** Phân định rõ quyền hạn giữa PO, SM, Dev, QA và Giảng viên hướng dẫn.

### 4.2 Những câu hỏi phản biện của Giảng viên và cách trả lời

| Câu hỏi phản biện của Giảng viên | Trọng tâm kiểm tra | Cách trả lời thuyết phục |
|:---|:---|:---|
| *1. "Trong kế hoạch, nhóm phân công TV-02 vừa làm Scrum Master vừa làm Technical Lead và Backend Dev. Liệu có bị xung đột lợi ích (Conflict of Interest) không?"* | Đóng nhiều vai trong nhóm nhỏ. | **Trả lời:** "Thưa thầy, trong một nhóm dự án sinh viên 6 người, việc kiêm nhiệm là tất yếu để tối ưu nguồn lực. Vai trò SM giúp đảm bảo quy trình Scrum và tháo gỡ trở ngại (Impediments), trong khi Tech Lead định hướng kiến trúc kỹ thuật. Nhóm phân định ranh giới rõ ràng: Quyết định phạm vi và nghiệm thu nghiệp vụ thuộc về Product Owner (TV-01), chất lượng kiểm thử độc lập do QA (TV-06) đảm nhiệm. Do đó, việc TV-02 kiêm nhiệm vẫn bảo đảm tính minh bạch và hiệu quả." |
| *2. "Kế hoạch ghi Sprint 5 vừa làm tính năng PBI-12, PBI-13 vừa làm Hardening và nộp bài. Liệu có kịp không nếu tính năng bị lỗi?"* | Rủi ro dồn việc vào Sprint cuối. | **Trả lời:** "Thưa thầy, nhóm đã tính toán kỹ: Sprint 5 chỉ có **24 SP** (nhẹ nhất trong 5 Sprint). Trong đó, PBI-12 (Chặn tải file) đã có nền tảng từ kiến trúc MinIO ở Sprint 3, còn PBI-13 (Nhảy trang) là Should Have. Nếu Sprint 5 gặp khó khăn về thời gian, nhóm sẽ **hoãn ngay PBI-13** để tập trung 100% nguồn lực cho Hardening, chạy Regression Test và đóng gói Docker bàn giao." |
| *3. "Nếu một thành viên trong nhóm bị ốm hoặc bận thi cử làm giảm 50% capacity trong 1 Sprint, Kế hoạch dự án xử lý thế nào?"* | Năng lực ứng phó rủi ro nhân sự. | **Trả lời:** "Thưa thầy, điều này được quy định tại mục 6.3 và rủi ro R-01: Nếu 1 thành viên thiếu > 20% capacity, nhóm lập tức áp dụng cơ chế Pairing (ghép đôi lập trình) giữa thành viên phụ và chính, đồng thời giảm WIP (Work-in-Progress) và cắt bớt tính năng Should Have tương ứng với số giờ bị thiếu, tuyệt đối không ép thành viên khác làm việc quá tải dẫn đến suy giảm chất lượng code." |
| *4. "Tại sao nhóm không dùng sơ đồ Gantt truyền thống mà dùng Sprint Map trong Kế hoạch dự án?"* | Sự phù hợp của công cụ với phương pháp luận. | **Trả lời:** "Thưa thầy, LIBIF áp dụng mô hình Scrum với quy trình lặp và thích ứng (Empirical Process Control). Sơ đồ Gantt truyền thống giả định các công việc diễn ra tuần tự và cố định từ đầu (Waterfall). Việc sử dụng **Sprint Map kết hợp Release Milestones** phù hợp hơn với Scrum vì nó cho phép tái ưu tiên Backlog linh hoạt sau mỗi Sprint Review mà vẫn giữ vững mục tiêu Sprint Goal và các mốc bàn giao lớn." |

---

## PHẦN 5: KIẾN THỨC MỞ RỘNG VỀ LẬP KẾ HOẠCH DỰ ÁN

### 5.1 Phân biệt Product Roadmap, Release Plan và Sprint Plan

| Thuộc tính | Product Roadmap | Release Plan | Sprint Plan |
| :--- | :--- | :--- | :--- |
| **Tầm nhìn** | Dài hạn (6 tháng - vài năm) | Trung hạn (1 - 3 tháng, vài Sprint) | Ngắn hạn (1 - 2 tuần) |
| **Mục đích** | Định hướng chiến lược phát triển sản phẩm | Lên kế hoạch phát hành một phiên bản có giá trị (MVP/MRFs) | Cam kết thực hiện một tập tính năng cụ thể đạt DoD |
| **Độ chi tiết** | Mức Epic / Chủ đề (Themes) | Mức User Stories / PBIs | Mức Task kỹ thuật (giờ làm việc) |
| **Đối tượng** | Ban lãnh đạo, Nhà đầu tư, Khách hàng | Khách hàng, Nhóm phát triển, Vận hành | Toàn bộ nhóm phát triển nội bộ |

### 5.2 Các loại quan hệ phụ thuộc trong mạng công việc (PDM/AON)
1. **Finish-to-Start (FS):** Hoạt động A phải kết thúc thì B mới được bắt đầu (VD: Hoàn thành thiết kế DB -> Bắt đầu viết code Migration).
2. **Start-to-Start (SS):** Hoạt động A bắt đầu thì B mới được bắt đầu (VD: Bắt đầu chạy OCR hàng loạt -> Bắt đầu tiến trình theo dõi tiến độ).
3. **Finish-to-Finish (FF):** Hoạt động A kết thúc thì B mới được kết thúc (VD: Viết code xong -> Hoàn thành việc viết tài liệu kỹ thuật).
4. **Start-to-Finish (SF):** Hoạt động A bắt đầu thì B mới được kết thúc (Rất hiếm gặp, VD: Ca trực mới bắt đầu thì ca trực cũ mới được kết thúc).

### 5.3 Khái niệm Lead và Lag
- **Lead (Đẩy sớm):** Khoảng thời gian một hoạt động kế tiếp có thể bắt đầu sớm hơn trước khi hoạt động trước kết thúc hoàn toàn (VD: Bắt đầu viết UI khi API mới hoàn thành 80%).
- **Lag (Độ trễ):** Khoảng thời gian bắt buộc phải chờ sau khi hoạt động trước kết thúc rồi mới được bắt đầu hoạt động sau (VD: Chờ 24h sau khi gửi email khảo sát để tổng hợp phản hồi).
