# CÂU 8: BÁO CÁO TÍNH KHẢ THI (FEASIBILITY STUDY REPORT)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Báo cáo tính khả thi (Feasibility Study Report) của nhóm. (Sinh viên nộp kèm bản in tài liệu Báo cáo tính khả thi của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Báo cáo tính khả thi trả lời những câu hỏi gì?
6 câu hỏi tương ứng 6 khía cạnh:
1. **Kinh doanh:** Thị trường có nhu cầu và mô hình thu phí có bền vững?
2. **Kỹ thuật:** Nhóm có đủ năng lực giải quyết OCR và bảo vệ bản quyền?
3. **Vận hành:** Quy trình mới có phù hợp thói quen thủ thư/độc giả?
4. **Tài chính:** Dự án tốn bao nhiêu, có cần bản quyền đắt tiền?
5. **Tiến độ:** Có hoàn thành được trong 10 tuần (5 Sprint)?
6. **Pháp lý:** Có tuân thủ Luật Sở hữu trí tuệ?

---

### B2. Đầu vào và các bước tạo Báo cáo khả thi?
* **5 Đầu vào:** Khảo sát thị trường + Kết quả mã PoC + Ý kiến thủ thư + Ước lượng thời gian/chi phí + Luật SHTT.
* **5 Bước:** 1. Xác định 6 khía cạnh → 2. Thu thập số liệu thực tế → 3. Phân tích từng khía cạnh → 4. Lập danh mục rủi ro & phương án ứng phó → 5. Tổng hợp báo cáo & kết luận Go/No-Go.

---

### B3. Đánh giá Báo cáo khả thi?
* Đánh giá chéo nội bộ (Tech Lead kiểm kỹ thuật, SM kiểm tiến độ, PO kiểm kinh doanh).
* Tính khả thi kỹ thuật của luồng OCR tiếng Việt bất đồng bộ được kiểm chứng bằng mã PoC và kiểm thử tích hợp chạy thực tế.
* Kết quả: 6/6 khía cạnh đạt **Khả thi**, phê duyệt quyết định **"GO"**.

---

### B4. Tại sao cần Báo cáo khả thi?
1. **Tránh đầu tư sai lầm** — không lãng phí vào dự án bất khả thi.
2. **Nhận diện rủi ro sớm** — chuẩn bị dự phòng cho sai số OCR, áp lực tiến độ.
3. **Căn cứ quyết định Go/No-Go** — bức tranh toàn cảnh khách quan cho người phê duyệt.
4. **Định hướng công nghệ** — tự tin chọn mã nguồn mở $0$ VNĐ.
5. **Nền tảng lập kế hoạch** — số liệu ước lượng là cơ sở viết Project Charter và Dự toán.

---

### B5. Báo cáo khả thi đã dùng trong dự án thế nào?
* Căn cứ trực tiếp lập **Project Charter**.
* Định hình **Kiến trúc** xoay quanh Tesseract OCR + PostgreSQL ($0$ VNĐ bản quyền).
* Bám sát 13 tính năng Must Have để quản lý phạm vi trong 10 tuần.
* Các phương án giảm rủi ro đưa vào bảng theo dõi từng Sprint.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

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
1. Kinh doanh: Nhu cầu số hóa rõ                  4. Tài chính: 0 VNĐ tiền mặt nhờ free-tier
2. Kỹ thuật: Tesseract.js + Redis/BullMQ OCR      5. Tiến độ: 10 tuần (5 Sprint) cho 13 Must Have
3. Vận hành: Giao diện chia đôi dễ dùng           6. Pháp lý: Tuân thủ Luật SHTT, có nhật ký giải trình
==> KẾT LUẬN: Ra quyết định "GO" (Đủ điều kiện phê duyệt khởi động dự án)
                                │
                                ▼
[TẠI SAO CẦN & ỨNG DỤNG VÀO DỰ ÁN]
• Lý do: Tránh đầu tư sai lầm -> Nhận diện rủi ro sớm -> Căn cứ ra quyết định Go/No-Go
• Ứng dụng: Đầu vào viết Project Charter -> Định hướng công nghệ Architecture -> Quản lý rủi ro Sprint
```
