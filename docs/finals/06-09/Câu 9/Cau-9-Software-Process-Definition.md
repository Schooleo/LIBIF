# CÂU 9: ĐỊNH NGHĨA QUY TRÌNH PHÁT TRIỂN PHẦN MỀM

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm. (Sinh viên nộp kèm bản in tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Quy trình phát triển phần mềm trả lời những câu hỏi gì?
5 câu hỏi tương ứng 5 nội dung cốt lõi:
1. **Mô hình cơ sở:** Nhóm áp dụng mô hình nào? *(Khung làm việc Scrum)*.
2. **Giai đoạn:** Bao nhiêu giai đoạn, kéo dài bao lâu? *(10 tuần, 5 Sprint x 2 tuần)*.
3. **Vai trò:** Từng thành viên đảm nhận việc gì? *(Scrum Master, Chủ sở hữu sản phẩm, 6 thành viên phát triển)*.
4. **Bản phân phối:** Quy trình đưa ra bản phân phối chạy được gồm các bước nào? *(5 bước: Kế hoạch → Lập trình → Kiểm tra chéo → Triển khai Staging → Chuẩn DoD)*.
5. **Sự kiện:** Các cuộc họp định kỳ diễn ra khi nào? *(Họp nhanh 15 phút, Họp lập kế hoạch, Họp demo, Họp rút kinh nghiệm)*.

---

### B2. Mô hình cơ sở được chọn là gì và tại sao?
* **Mô hình:** **Khung làm việc Scrum**.
* **Lý do:** Phát triển lặp và tăng trưởng phù hợp với các mô-đun phức tạp (OCR, Canvas DRM, Watermark) + Nhận phản hồi và thích ứng liên tục sau mỗi Sprint 2 tuần + Giúp nhóm 6 người tự tổ chức và phối hợp chéo hiệu quả.

---

### B3. Thời gian dự kiến của từng giai đoạn?
* **Tổng thời gian:** 10 tuần chia làm **5 Sprint (2 tuần/Sprint)**:
  * *Sprint 1:* Dựng nền tảng, cơ sở dữ liệu và luồng nhận dạng OCR cơ bản.
  * *Sprint 2:* Giao diện đối soát Side-by-side và quy trình phê duyệt.
  * *Sprint 3:* Mã hóa AES-256, phân quyền và giới hạn phiên đọc.
  * *Sprint 4:* Tìm kiếm toàn văn, Canvas Reader, Watermark và làm mờ màn hình.
  * *Sprint 5:* Kiểm thử an ninh, sửa lỗi, nghiệm thu thực tế và đóng gói Docker.

---

### B4. Phân công vai trò 6 thành viên trong nhóm?
1. **SV-1:** Scrum Master / Trưởng nhóm kỹ thuật (Quản trị tiến độ, điều phối các sự kiện Scrum, kiến trúc, mã hóa AES-256).
2. **SV-2:** Lập trình viên Backend (Xây dựng API, Tesseract OCR ngầm, hàng chờ Redis/BullMQ).
3. **SV-3:** Lập trình viên Frontend (Giao diện Quản trị Thủ thư, Màn hình đối soát Side-by-side).
4. **SV-4:** Lập trình viên Frontend (Cổng Độc giả, Trình đọc Canvas Reader, nhúng Watermark).
5. **SV-5:** Chuyên viên Bảo mật (Chống tải file, phân quyền đọc, nhật ký hoạt động).
6. **SV-6:** Chuyên viên Kiểm thử & Tìm kiếm (Tìm kiếm PostgreSQL tsvector, kịch bản kiểm thử, điều phối nghiệm thu).

---

### B5. Các sản phẩm khởi tạo?
1. **Tài liệu quản lý dự án:** Đề xuất dự án, Tầm nhìn và phạm vi, Điều lệ dự án, Danh sách yêu cầu sản phẩm, Thiết kế kiến trúc, Báo cáo PoC, Kế hoạch thực thi, Bản ước lượng, Hợp đồng công việc.
2. **Bản mẫu thiết kế:** Trọn bộ 82 màn hình tương tác bằng công cụ Google Stitch.
3. **Mã nguồn & Bản phân phối:** Mã nguồn NestJS + React đóng gói Docker, 5 bản phân phối sau 5 Sprint.
4. **Hồ sơ kiểm thử & bàn giao:** Kịch bản kiểm thử, Báo cáo nghiệm thu thực tế, Hướng dẫn sử dụng.

---

### B6. Quy trình ra bản phân phối hoạt động?
* **5 Bước:** 1. Lập kế hoạch Sprint → 2. Lập trình tính năng → 3. Kiểm tra chéo mã nguồn & kiểm thử tự động → 4. Triển khai lên máy chủ thử nghiệm → 5. Nghiệm thu theo chuẩn Định nghĩa Hoàn thành.
* **Tiêu chuẩn Định nghĩa Hoàn thành:** Chạy đúng mô tả + Vượt qua 100% bài kiểm thử + Không còn lỗi nặng + Được phê duyệt tại buổi họp demo cuối Sprint.

---

### B7. Ưu và khuyết điểm của khung làm việc Scrum?

| Ưu điểm | Khuyết điểm |
|---|---|
| • Luôn có bản phân phối chạy được sau mỗi 2 tuần<br>• Dễ dàng thích ứng và nhận góp ý sớm từ người dùng<br>• Minh bạch tiến độ hàng ngày qua họp nhanh 15 phút | • Đòi hỏi tính tự giác và kỷ luật cao của 6 thành viên<br>• Áp lực giao hàng định kỳ khi trùng lịch thi cử ở trường |

---

### B8. Đánh giá quy trình thế nào?
* **Thẩm định ban đầu:** Thống nhất quy tắc làm việc của nhóm trước Sprint 1.
* **Đánh giá định kỳ:** Họp Rút kinh nghiệm cuối mỗi Sprint để nhận diện điểm nghẽn và cải tiến ngay cho Sprint tiếp theo.

---

### B9. Tại sao cần Định nghĩa quy trình?
1. **Tạo tiếng nói chung** cho 6 thành viên, thúc đẩy tinh thần tự tổ chức.
2. **Minh bạch trách nhiệm** — rõ vai trò Scrum và công việc trong danh sách Sprint.
3. **Đảm bảo chất lượng đồng đều** nhờ tiêu chuẩn Định nghĩa Hoàn thành.
4. **Kiểm soát tiến độ** — phát hiện sớm điểm nghẽn để phối hợp chéo hỗ trợ.
5. **Thuận tiện bàn giao** và chứng minh bằng chứng quản lý với Giảng viên.

---

### B10. Quy trình đã dùng và cập nhật thực tế thế nào?
* **Sử dụng:** Kim chỉ nam vận hành hàng ngày (Lập kế hoạch Sprint, Họp nhanh hàng ngày 15 phút, Họp demo và Rút kinh nghiệm mỗi 2 tuần).
* **Cập nhật thực tế:**
  * **Sprint 2:** Điều động **SV-6 (Kiểm thử) sang hỗ trợ viết mã và kiểm thử giao diện Side-by-side** để giải phóng đường găng tiến độ.
  * Tái sử dụng mẫu giao diện có sẵn giúp giảm 40% thời gian làm Frontend.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

```
[KHUNG LÀM VIỆC SCRUM THUẦN TÚY]
05 Sprint cuốn chiếu (2 tuần/Sprint) ──► 136 Story Points ──► Bản phân phối tăng trưởng
                                │
                                ▼
[4 ĐẦU VÀO] ──► [PHÂN CÔNG 6 THÀNH VIÊN]
• Tầm nhìn & Phạm vi (10 tuần)   1. SV-1: Scrum Master / Trưởng nhóm kỹ thuật (Kiến trúc, AES-256)
• Yêu cầu Backlog (16 PBIs)      2. SV-2: Lập trình viên Backend (API, Tesseract OCR, Redis Queue)
• Ước lượng (136 SP, 15h/tuần)   3. SV-3: Lập trình viên Frontend (Admin Thủ thư, Giao diện Side-by-side)
• Khung chuẩn Scrum Guide        4. SV-4: Lập trình viên Frontend (Cổng Độc giả, Canvas Reader, Watermark)
                                 5. SV-5: Chuyên viên Bảo mật (Chống tải file, Phân quyền, Nhật ký)
                                 6. SV-6: Chuyên viên Kiểm thử & Tìm kiếm (PostgreSQL tsvector, UAT)
                                │
                                ▼
[LỘ TRÌNH 5 SPRINT (10 TUẦN)]
• Sprint 1: Kiến trúc, Cơ sở dữ liệu & OCR cơ bản   • Sprint 4: Tìm kiếm, Canvas Reader & Watermark
• Sprint 2: Giao diện Side-by-side & Phê duyệt      • Sprint 5: Kiểm thử an ninh, Nghiệm thu UAT & Docker
• Sprint 3: Xuất bản, Mã hóa AES-256 & Phân quyền
                                │
                                ▼
[QUY TRÌNH RA BẢN PHÂN PHỐI (DoD)]
Lập kế hoạch Sprint -> Viết mã -> Kiểm tra chéo -> Triển khai máy chủ thử nghiệm -> Đạt chuẩn DoD -> Họp demo
                                │
                                ▼
[ĐÁNH GIÁ QUY TRÌNH]
• Đánh giá: Họp Rút kinh nghiệm mỗi 2 tuần -> Đo vận tốc 26-29 SP/Sprint -> Đạt 100% tiêu chí nghiệm thu
```
