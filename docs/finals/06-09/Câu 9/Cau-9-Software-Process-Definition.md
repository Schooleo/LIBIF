# CÂU 9: ĐỊNH NGHĨA QUY TRÌNH PHÁT TRIỂN PHẦN MỀM (SOFTWARE PROCESS DEFINITION)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm (Software Process Definition) của nhóm. (Sinh viên nộp kèm bản in tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Quy trình phát triển phần mềm trả lời những câu hỏi gì?
6 câu hỏi tương ứng 6 nội dung cốt lõi:
1. **Mô hình cơ sở:** Áp dụng mô hình nào? *(Mô hình Lai Waterfall-Scrum)*.
2. **Giai đoạn:** Bao nhiêu giai đoạn, kéo dài bao lâu? *(10 tuần, 5 Sprint x 2 tuần)*.
3. **Vai trò:** Từng thành viên đảm nhận việc gì? *(6 vị trí SV-1 đến SV-6)*.
4. **Sản phẩm:** Những tài liệu và phần mềm nào được tạo ra?
5. **Bản phân phối:** Quy trình đưa ra bản phân phối chạy được gồm các bước nào?
6. **Sự kiện:** Các cuộc họp định kỳ diễn ra khi nào? *(Daily 15p, Planning, Review, Retro)*.

---

### B2. Mô hình cơ sở được chọn là gì và tại sao?
* **Mô hình:** **Mô hình Lai (Hybrid Waterfall-Scrum)**.
* **Lý do:** Lõi Scrum (5 Sprint x 2 tuần) giúp phát triển cuốn chiếu, linh hoạt nhận góp ý; Vỏ Thác nước (Sprint 1 & Sprint 5) giúp kiểm soát chặt thời hạn cố định 10 tuần của học phần.

---

### B3. Thời gian dự kiến của từng giai đoạn?
* **Tổng thời gian:** 10 tuần chia làm **5 Sprint (2 tuần/Sprint)**:
  * *Sprint 1:* Kiến trúc, cơ sở dữ liệu và luồng nhận dạng OCR cơ bản.
  * *Sprint 2:* Giao diện đối soát Side-by-side và quy trình phê duyệt.
  * *Sprint 3:* Mã hóa AES-256, phân quyền và giới hạn phiên đọc.
  * *Sprint 4:* Tìm kiếm toàn văn, Canvas Reader, Watermark và làm mờ màn hình.
  * *Sprint 5:* Kiểm thử an ninh, sửa lỗi, nghiệm thu UAT và đóng gói Docker.

---

### B4. Phân công vai trò 6 thành viên?
1. **SV-1 (Scrum Master / Tech Lead):** Quản lý tiến độ, họp Scrum, kiến trúc, mã hóa AES-256.
2. **SV-2 (Backend Dev):** Xây dựng API, Tesseract OCR ngầm, hàng chờ Redis/BullMQ.
3. **SV-3 (Frontend Dev):** Giao diện Quản trị Thủ thư, Màn hình đối soát Side-by-side.
4. **SV-4 (Frontend Dev):** Cổng Độc giả, Trình đọc Canvas Reader, nhúng Watermark.
5. **SV-5 (Security Dev):** Chống tải file, phân quyền đọc, nhật ký hoạt động.
6. **SV-6 (QA & Search Dev):** Tìm kiếm PostgreSQL `tsvector`, kịch bản test, điều phối UAT.
*(PO: Giảng viên hướng dẫn & Trưởng nhóm)*.

---

### B5. Các sản phẩm khởi tạo?
1. **Tài liệu QLDA:** Đề xuất, Tầm nhìn & Phạm vi, Điều lệ, Backlog, Kiến trúc, PoC, Kế hoạch, Ước tính, SOW.
2. **Bản mẫu thiết kế:** Trọn bộ 82 màn hình tương tác trong `stitch_design/`.
3. **Mã nguồn & Bản phân phối:** Mã nguồn NestJS + React đóng gói Docker, 5 bản phân phối sau 5 Sprint.
4. **Hồ sơ kiểm thử & bàn giao:** Kịch bản test, Báo cáo UAT, Hướng dẫn sử dụng.

---

### B6. Quy trình ra bản phân phối hoạt động (Working Increment)?
* **5 Bước:** 1. Lập kế hoạch Sprint → 2. Lập trình tính năng → 3. Kiểm tra chéo mã nguồn & test tự động → 4. Triển khai Staging → 5. Nghiệm thu theo chuẩn DoD.
* **Tiêu chuẩn DoD:** Chạy đúng mô tả + Vượt 100% test + Không bug nặng + PO duyệt tại Sprint Review.

---

### B7. Ưu và khuyết điểm của mô hình Lai?

| Ưu điểm | Khuyết điểm |
|---|---|
| • Linh hoạt tiếp thu góp ý mỗi 2 tuần<br>• Giữ vững deadline 10 tuần nhờ khung Thác nước<br>• Minh bạch tiến độ qua Daily Standup 15 phút | • Đòi hỏi kỷ luật cao (cập nhật liên tục, họp đúng giờ)<br>• Áp lực tiến độ khi trùng tuần thi cử ở trường |

---

### B8. Đánh giá quy trình thế nào?
* **Thẩm định ban đầu:** Thống nhất quy trình trước khi bắt đầu (Sprint 1).
* **Đánh giá định kỳ:** Họp Rút kinh nghiệm (Retrospective) cuối mỗi Sprint để nhận diện điểm nghẽn và cải tiến cho Sprint tiếp theo.

---

### B9. Tại sao cần Định nghĩa quy trình?
1. **Tạo tiếng nói chung** cho 6 thành viên, tránh làm việc phân tán.
2. **Minh bạch trách nhiệm** — rõ việc từng người và người kiểm tra chéo.
3. **Đảm bảo chất lượng đồng đều** nhờ tiêu chuẩn DoD.
4. **Kiểm soát tiến độ** — phát hiện sớm điểm nghẽn để điều động hỗ trợ.
5. **Thuận tiện bàn giao** và giải trình với Giảng viên.

---

### B10. Quy trình đã dùng và cập nhật thực tế thế nào?
* **Sử dụng:** Kim chỉ nam vận hành hàng ngày (Planning, Daily 15p, Review cuối mỗi 2 tuần).
* **Cập nhật thực tế:**
  * **Sprint 2:** Điều động **SV-6 (QA) sang hỗ trợ viết mã và kiểm thử Side-by-side UI** để giải phóng đường găng tiến độ.
  * Tái sử dụng mẫu giao diện trong `stitch_design/` giúp giảm 40% thời gian làm Frontend.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

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
