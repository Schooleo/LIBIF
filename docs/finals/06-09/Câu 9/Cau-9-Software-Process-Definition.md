# CÂU 9: ĐỊNH NGHĨA QUY TRÌNH PHÁT TRIỂN PHẦN MỀM (SOFTWARE PROCESS DEFINITION)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm (Software Process Definition) của nhóm. (Sinh viên nộp kèm bản in tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.)

---

## 📋 TÀI LIỆU CẦN IN VÀ NỘP KÈM

| STT | Tài liệu nộp kèm | Nguồn tài liệu | Nội dung minh chứng |
|:---:|---|---|---|
| **1** | **Bản in Kế hoạch & Quy trình phát triển phần mềm** | `LIBIF-Project-Planning.md` (Mục 1, 4, 5, 8) | Mô hình Hybrid Waterfall-Scrum, kế hoạch 5 Sprint (10 tuần), bảng phân công 6 thành viên và các sự kiện Scrum định kỳ. |
| **2** | *(Tham chiếu bổ sung)* Bảng phân rã công việc WBS & Ma trận RACI | `LIBIF-Project-Planning.md` (Mục 2) & `LIBIF-Project-Charter.md` (Mục 9) | Cấu trúc phân rã công việc 5 giai đoạn và ma trận trách nhiệm giải trình RACI. |

---

## PHẦN A: QUÁ TRÌNH HÌNH THÀNH VÀ PHƯƠNG PHÁP ĐÁNH GIÁ QUY TRÌNH

### I. QUÁ TRÌNH HÌNH THÀNH QUY TRÌNH PHÁT TRIỂN PHẦN MỀM

#### 1. Bối cảnh và Mục tiêu của tài liệu
* **Bối cảnh:** Nhóm gồm 6 sinh viên năm 3 phải phối hợp phát triển một hệ thống Thư viện số thương mại phức tạp trong thời gian giới hạn 10 tuần.
* **Mục tiêu:** Thiết lập một khung quy trình làm việc có tính kỷ luật cao, phân định rõ vai trò - trách nhiệm của từng thành viên, quy định các sự kiện họp định kỳ và tiêu chuẩn chất lượng để đảm bảo bàn giao sản phẩm chạy được sau mỗi 2 tuần.

#### 2. Các tài liệu đầu vào cần thiết

| STT | Tài liệu đầu vào | Vai trò đóng góp cho Quy trình |
|:---:|---|---|
| **1** | **Tài liệu Tầm nhìn & Phạm vi** (`LIBIF-Project-Vision-Scope.md`) | Xác định khung thời hạn 10 tuần học phần và các mốc bàn giao chính. |
| **2** | **Tài liệu Yêu cầu sản phẩm** (`LIBIF-Product-Backlog.md`) | Danh sách 16 tính năng (PBIs) được xếp thứ tự ưu tiên theo chuẩn MoSCoW. |
| **3** | **Tài liệu Ước lượng dự án** (`LIBIF-Project-Estimation.md`) | Khối lượng 136 Story Points và năng lực đóng góp của nhóm ($15$ giờ/người/tuần). |
| **4** | **Khung chuẩn Scrum Guide & Agile** | Nguyên tắc phát triển linh hoạt, lặp đi lặp lại và phân phối theo chu kỳ ngắn. |

#### 4. Quá trình 5 bước hình thành Quy trình

| Bước | Tên bước | Công việc thực tế nhóm đã làm |
|:---:|---|---|
| **B1** | **Phân tích bối cảnh & Chọn mô hình** | Lựa chọn mô hình **Lai giữa Thác nước và Scrum (Hybrid Waterfall-Scrum)**: Dùng Scrum làm lõi phát triển, bọc ngoài bởi Thác nước để kiểm soát mốc bàn giao. |
| **B2** | **Phân chia giai đoạn & Thiết kế Sprint** | Chia 10 tuần thành 5 Sprint (mỗi Sprint 2 tuần), phân bổ khối lượng ~26 - 29 Story Points cho mỗi Sprint. |
| **B3** | **Phân vai & Xác lập trách nhiệm** | Phân chia rõ ràng vai trò cho 6 thành viên (Scrum Master/Tech Lead, Backend, 2 Frontend, Security, QA). |
| **B4** | **Quy định các sự kiện & Tiêu chuẩn DoD** | Thiết lập lịch họp hàng ngày (15 phút), họp đầu Sprint, họp demo cuối Sprint và bộ tiêu chuẩn "Định nghĩa Hoàn thành". |
| **B5** | **Ban hành tài liệu chính thức** | Đóng gói thành văn bản Kế hoạch quản lý dự án (`LIBIF-Project-Planning.md`) để toàn đội ngũ thống nhất thực hiện. |

---

### II. PHƯƠNG PHÁP VÀ KẾT QUẢ ĐÁNH GIÁ QUY TRÌNH

| Phương pháp đánh giá | Cách nhóm triển khai | Kết quả thực tế & Cải tiến thu được |
|---|---|---|
| **1. Đánh giá qua cuộc họp Rút kinh nghiệm (Retrospective)** | Cuối mỗi Sprint 2 tuần, nhóm dành 45 phút ngồi lại để thảo luận: *Điều gì làm tốt? Điều gì còn nghẽn? Cần cải tiến gì?* | • Phát hiện việc viết giao diện Side-by-side tốn thời gian $\rightarrow$ **Cải tiến:** Tái sử dụng các mẫu giao diện có sẵn trong `stitch_design/` để tăng tốc độ lập trình. |
| **2. Đo lường tốc độ hoàn thành (Velocity Tracking)** | Theo dõi số lượng Story Points thực tế hoàn thành sau mỗi Sprint so với kế hoạch ban đầu. | • Nhóm duy trì vận tốc ổn định **26 - 29 SP/Sprint**, đảm bảo hoàn thành trọn vẹn 13 tính năng cốt lõi (Must Have) đúng hạn 10 tuần. |
| **3. Kiểm soát chất lượng theo Definition of Done** | Đối soát sản phẩm bàn giao xem đã đạt 100% tiêu chí hoàn thành (mã chạy mượt, qua kiểm thử, chạy được trên máy chủ staging). | • Đạt **$100\%$ kịch bản nghiệm thu UAT** (theo tiêu chí **SC-03** trong Project Charter), không có lỗi nghiêm trọng khi bàn giao. |

---

## PHẦN B: 10 CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Các câu hỏi chính cần trả lời trong tài liệu Định nghĩa quy trình phát triển phần mềm?
Tài liệu trả lời 6 câu hỏi cốt lõi:
1. Nhóm áp dụng mô hình phát triển nào? (Mô hình Lai Waterfall-Scrum).
2. Dự án gồm bao nhiêu giai đoạn và mỗi giai đoạn kéo dài bao lâu? (10 tuần, 5 Sprint, mỗi Sprint 2 tuần).
3. Từng thành viên đảm nhận vai trò và trách nhiệm gì? (Bảng phân công 6 vị trí).
4. Các sản phẩm và tài liệu nào sẽ được tạo ra ở từng giai đoạn?
5. Quy trình để đưa ra một bản phân phối phần mềm chạy được gồm các bước nào?
6. Các cuộc họp định kỳ diễn ra khi nào và với ai?

---

### B2. Mô hình cơ sở được lựa chọn để hiệu chỉnh là gì?
* **Mô hình cơ sở:** **Scrum Framework** kết hợp khung quản lý mốc **Thác nước (Hybrid Waterfall-Scrum)**.
* **Tại sao lại chọn mô hình Lai này?**
  * **Lõi Scrum (ở giữa):** Áp dụng trong 5 Sprint để phát triển tính năng cuốn chiếu, cho phép chỉnh sửa giao diện và nhận góp ý liên tục từ khách hàng sau mỗi 2 tuần.
  * **Khung Thác nước (bên ngoài):** Áp dụng ở Sprint 1 (chốt kiến trúc, tài liệu) và Sprint 5 (kiểm thử an ninh, đóng gói, nghiệm thu) để kiểm soát chặt chẽ mốc thời hạn 10 tuần của học phần.

---

### B3. Thời gian dự kiến của từng giai đoạn là bao lâu?
Tổng thời gian dự án là **10 tuần**, chia đều thành **5 Sprint (mỗi Sprint 2 tuần)**:
* **Sprint 1 (Tuần 1 - 2):** Thiết kế kiến trúc, tạo cơ sở dữ liệu và hoàn thiện luồng nhận dạng chữ OCR cơ bản.
* **Sprint 2 (Tuần 3 - 4):** Xây dựng Giao diện đối soát Side-by-side và tính năng Phê duyệt xuất bản.
* **Sprint 3 (Tuần 5 - 6):** Mã hóa lưu kho AES-256, phân quyền truy cập và đếm phiên đọc đồng thời.
* **Sprint 4 (Tuần 7 - 8):** Xây dựng bộ tìm kiếm toàn văn, Trình đọc Canvas Reader, nhúng Watermark và làm mờ màn hình.
* **Sprint 5 (Tuần 9 - 10):** Kiểm thử an toàn thông tin, sửa lỗi, nghiệm thu thực tế và đóng gói Docker bàn giao.

---

### B4. Các vai trò nào từng thành viên trong nhóm sẽ đảm nhiệm?
Nhóm gồm 6 sinh viên năm 4 đảm nhiệm các vai trò chuyên trách:
1. **SV-1 (Trưởng nhóm kỹ thuật / Scrum Master):** Điều phối tiến độ, chủ trì các buổi họp Scrum, phụ trách kiến trúc và mã hóa bảo mật.
2. **SV-2 (Lập trình viên Backend):** Xây dựng hệ thống API, luồng xử lý Tesseract OCR và hàng chờ Redis.
3. **SV-3 (Lập trình viên Frontend):** Xây dựng Giao diện quản trị cho Thủ thư và Màn hình đối soát Side-by-side.
4. **SV-4 (Lập trình viên Frontend):** Xây dựng Cổng Độc giả, Trình đọc Canvas Reader và lớp nhúng Watermark.
5. **SV-5 (Chuyên viên An toàn thông tin):** Xây dựng cơ chế chống tải file, phân quyền đọc và ghi nhật ký hoạt động.
6. **SV-6 (Chuyên viên Đảm bảo chất lượng & Tìm kiếm):** Xây dựng bộ tìm kiếm toàn văn, viết kịch bản kiểm thử và điều phối nghiệm thu.
* *(Đại diện Chủ sở hữu Sản phẩm - Product Owner):* Giảng viên hướng dẫn đóng vai trò phê duyệt yêu cầu và nghiệm thu.

---

### B5. Các sản phẩm nào dự kiến sẽ khởi tạo?
1. **Bộ tài liệu quản lý dự án:** Đề xuất (Proposal), Tầm nhìn & Phạm vi, Điều lệ (Charter), Product Backlog, Kiến trúc, Báo cáo PoC, Kế hoạch thực thi (Planning), Bản ước tính, Hợp đồng công việc (SOW).
2. **Bản mẫu thiết kế giao diện:** Trọn bộ 82 màn hình bản mẫu trong `stitch_design/`.
3. **Mã nguồn & Bản phân phối:** Mã nguồn phần mềm hoàn chỉnh và 5 bản phân phối phần mềm chạy được sau mỗi Sprint trên máy chủ thử nghiệm (Staging).
4. **Hồ sơ kiểm thử & Bàn giao:** Bộ kịch bản kiểm thử, Biên bản nghiệm thu thực tế và Hướng dẫn sử dụng.

---

### B6. Quy trình để đưa ra một bản phân phối hoạt động (Working Increment) là gì?
Quy trình gồm 5 bước tuần tự trong mỗi Sprint:
1. **Lập kế hoạch Sprint (Sprint Planning):** Chọn các tính năng ưu tiên từ Product Backlog đưa vào Sprint Backlog.
2. **Lập trình tính năng:** Các thành viên viết mã nguồn theo đúng phân công.
3. **Kiểm tra chéo & Tự động chạy thử:** Thành viên khác rà soát mã nguồn (Peer Review) và chạy kiểm thử tự động.
4. **Triển khai lên máy chủ Staging:** Đóng gói Docker và đẩy phiên bản mới lên môi trường thử nghiệm dùng chung.
5. **Nghiệm thu theo Định nghĩa Hoàn thành (Definition of Done - DoD):**
   * Tính năng hoạt động đúng mô tả.
   * Vượt qua $100\%$ các bài kiểm tra tự động.
   * Không còn lỗi nghiêm trọng.
   * Được Product Owner xem và chấp thuận trong buổi demo Sprint Review.

---

### B7. Ưu và khuyết điểm của mô hình nhóm lựa chọn là gì?

| Khía cạnh | Mô hình Lai Hybrid Waterfall-Scrum |
|---|---|
| **Ưu điểm** | • **Linh hoạt thích ứng:** Cho phép xem demo và nhận góp ý từ thủ thư mỗi 2 tuần để sửa giao diện kịp thời.<br>• **Kiểm soát chặt chẽ thời hạn:** Khung Thác nước bên ngoài giúp giữ vững deadline 10 tuần của học phần.<br>• **Minh bạch tiến độ:** Mọi người đều nắm rõ công việc qua họp nhanh 15 phút hàng ngày. |
| **Khuyết điểm** | • **Đòi hỏi kỷ luật cao:** Thành viên phải cập nhật công việc liên tục, họp đúng giờ.<br>• **Áp lực thời gian:** Chu kỳ 2 tuần khá ngắn đối với sinh viên khi trùng vào các tuần thi cử ở trường. |

---

### B8. Tài liệu Định nghĩa quy trình của nhóm đã được đánh giá thế nào?
* **Thẩm định ban đầu:** Cả nhóm họp thống nhất quy trình trước khi bắt tay vào làm (Sprint 1).
* **Đánh giá định kỳ:** Cuối mỗi Sprint, nhóm họp Rút kinh nghiệm (Retrospective) để đánh giá xem quy trình có bị vướng mắc gì không, từ đó điều chỉnh lại cách phối hợp cho Sprint tiếp theo.

---

### B9. Tại sao cần tạo tài liệu Định nghĩa quy trình phát triển phần mềm? (5 lý do)
1. **Tạo tiếng nói chung:** Giúp 6 thành viên hiểu rõ quy tắc làm việc, tránh tình trạng "mạnh ai nấy làm".
2. **Minh bạch trách nhiệm:** Ai cũng biết rõ nhiệm vụ của mình và người phối hợp kiểm tra.
3. **Đảm bảo chất lượng đồng đều:** Nhờ có tiêu chuẩn "Định nghĩa Hoàn thành" (DoD), tính năng làm ra phải đạt chuẩn mới được tính là xong.
4. **Kiểm soát tiến độ hiệu quả:** Nhận diện sớm các công việc bị chậm để kịp thời điều động người hỗ trợ.
5. **Thuận tiện cho bàn giao:** Giúp khách hàng và giảng viên nắm bắt được quy trình nhóm đã vận hành để làm ra sản phẩm.

---

### B10. Tài liệu Định nghĩa quy trình đã được sử dụng và cập nhật trong dự án như thế nào?
* **Sử dụng thực tế:** Làm kim chỉ nam vận hành hàng ngày: chia việc đầu Sprint, họp nhanh 15 phút mỗi sáng và demo cho khách hàng cuối mỗi 2 tuần.
* **Cập nhật thực tế trong dự án:**
  * Tại **Sprint 2**, khi nhận thấy việc làm giao diện Side-by-side tốn nhiều công sức hơn dự kiến, nhóm đã **cập nhật điều động thêm SV-6 (QA) sang hỗ trợ viết mã và kiểm thử** để không làm nghẽn tiến độ của đường găng.
  * Tận dụng các mẫu giao diện có sẵn trong `stitch_design/` để rút ngắn thời gian làm Frontend.

---

## PHẦN C: SƠ ĐỒ LUỒNG GHI NHỚ NHANH (VẼ TRÊN GIẤY A4)

```
[MÔ HÌNH QUY TRÌNH LAI: HYBRID WATERFALL-SCRUM]
Khung ngoài Waterfall (Kiểm soát 10 tuần) + Lõi trong Scrum (5 Sprint, mỗi Sprint 2 tuần linh hoạt)
                                │
                                ▼
[4 ĐẦU VÀO] ──► [PHÂN CÔNG 6 THÀNH VIÊN]
• Vision & Scope (10 tuần)       1. SV-1: Trưởng nhóm kỹ thuật / Scrum Master (Kiến trúc, AES-256)
• Backlog (16 PBIs MoSCoW)       2. SV-2: Backend Dev (API, Tesseract OCR, Redis Queue)
• Ước lượng (136 SP, 15h/tuần)   3. SV-3: Frontend Dev (Admin Thủ thư, Giao diện Side-by-side)
• Khung chuẩn Scrum Guide        4. SV-4: Frontend Dev (Cổng Độc giả, Canvas Reader, Watermark)
                                 5. SV-5: Security Dev (Chống tải file, Phân quyền, Audit Trail)
                                 6. SV-6: QA & Search Dev (Tìm kiếm PostgreSQL, Test & UAT)
                                │
                                ▼
[LỘ TRÌNH 5 SPRINT (10 TUẦN)]
• Sprint 1: Kiến trúc, Cơ sở dữ liệu & OCR cơ bản   • Sprint 4: Tìm kiếm, Canvas Reader & Watermark
• Sprint 2: Giao diện Side-by-side & Phê duyệt      • Sprint 5: Kiểm thử an ninh, Nghiệm thu UAT & Docker
• Sprint 3: Xuất bản, Mã hóa AES-256 & Phân quyền
                                │
                                ▼
[QUY TRÌNH RA BẢN PHÂN PHỐI (DoD)]
Lập kế hoạch Sprint -> Viết mã -> Kiểm tra chéo (Peer Review) -> Triển khai Staging -> Đạt chuẩn DoD -> Demo Sprint Review
                                │
                                ▼
[ĐÁNH GIÁ & CẬP NHẬT QUY TRÌNH]
• Đánh giá: Họp Rút kinh nghiệm (Retrospective) mỗi 2 tuần -> Đo vận tốc 26-29 SP/Sprint -> Đạt 100% UAT (SC-03)
• Cập nhật: Sprint 2 điều động SV-6 hỗ trợ Side-by-side UI để giải phóng đường găng tiến độ
```
