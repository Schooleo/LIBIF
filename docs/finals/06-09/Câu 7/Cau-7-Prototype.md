# CÂU 7: SẢN PHẨM BẢN MẪU (PROTOTYPE)

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Bản mẫu (Prototype) của nhóm. (Sinh viên nộp kèm bản in phác thảo giao diện ban đầu cho hệ thống của nhóm.)

---

## CÁC CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Bản mẫu (Prototype) là gì?
* Mô hình mô phỏng giao diện **bấm thử được**, giúp kiểm tra trải nghiệm người dùng trước khi viết mã nguồn.
* **Khác PoC:** Prototype kiểm chứng **giao diện bên ngoài**; PoC kiểm chứng **kỹ thuật bên trong**.

---

### B2. Khác nhau giữa Bản mẫu hệ thống và Tập hợp màn hình giao diện?

| | Tập hợp màn hình (tĩnh) | Bản mẫu hệ thống (tương tác) |
|---|---|---|
| **Bản chất** | Ảnh rời lẻ, bất động | Các màn hình **liên kết chuyển trạng thái** |
| **Thao tác** | Không bấm được | Bấm chuyển trang, mở hộp thoại, đánh dấu ô |
| **Mục đích** | Xem bố cục | Kiểm tra **quy trình làm việc thực tế** |

---

### B3. Đầu vào và các bước tạo Bản mẫu?
* **4 Đầu vào:** Tầm nhìn & Phạm vi + Product Backlog + Quy trình nghiệp vụ đề xuất + Bộ quy chuẩn thiết kế.
* **4 Bước:** 1. Vẽ luồng thao tác trên giấy → 2. Dựng khung bố cục $60/40$ → 3. Thiết kế giao diện chi tiết → 4. Lập trình bản mẫu HTML/CSS.

---

### B4. Đánh giá Bản mẫu?
* Bố cục $60/40$ giúp đối soát dòng-theo-dòng thuận tiện.
* Bổ sung **3 ô kiểm tra chất lượng** và nút **"Yêu cầu sửa lại"** riêng.
* Đạt **$100\%$ kịch bản nghiệm thu**.

---

### B5. Tại sao cần Bản mẫu?
1. **Trực quan hóa yêu cầu** — khách hàng góp ý chính xác hơn đọc văn bản.
2. **Tiết kiệm chi phí sửa** — sửa thiết kế vài phút, sửa mã nguồn tốn gấp $10 - 50$ lần.
3. **Chốt tiêu chuẩn nghiệm thu** thống nhất giữa khách hàng và đội phát triển.
4. **Làm mẫu cho lập trình viên** viết mã giao diện chính xác.
5. **Cơ sở viết kịch bản kiểm thử** dựa trên nút bấm và ô nhập liệu thực tế.

---

### B6. Bản mẫu đã dùng trong dự án thế nào?
* Lập trình viên dựa vào mã mẫu xây giao diện trong **Sprint 2**.
* Đối chiếu sản phẩm thật với thiết kế ban đầu khi bàn giao Sprint.
* Làm căn cứ nghiệm thu cho Thủ thư và đính kèm phụ lục **Statement of Work**.

---

## SƠ ĐỒ GHI NHỚ NHANH (VẼ TRÊN GIẤY A4 KHI VẤN ĐÁP)

```
[BỐI CẢNH & BẢN MẪU ĐẠI DIỆN]
• Bối cảnh: Thủ thư cần màn hình tập trung để đối soát và sửa kết quả nhận dạng trước khi xuất bản
• Bản mẫu đại diện: Màn hình Đối soát chia đôi 60/40: Trái xem ảnh scan | Phải kiểm tra dữ liệu & Phê duyệt
                                │
                                ▼
[4 ĐẦU VÀO] ──► [4 BƯỚC HÌNH THÀNH]
• Tầm nhìn & Phạm vi (Thủ thư)    1. Vẽ luồng thao tác trên giấy
• Yêu cầu trong Product Backlog   2. Dựng khung bố cục chia đôi 60/40
• Đề xuất dự án (Quy trình)       3. Thiết kế giao diện chi tiết đầy đủ màu sắc
• Quy chuẩn thiết kế              4. Lập trình bản mẫu bấm thử được
                                │
                                ▼
[KẾT QUẢ ĐÁNH GIÁ]
• Thử nghiệm thao tác: Duyệt mượt dưới 1 phút -> Thêm 3 ô kiểm tra chất lượng
• Tự rà soát: Thêm nút "Yêu cầu sửa lại" riêng biệt + Nhãn "Đã trích xuất tự động"
• Khảo sát người dùng: Đạt 100% kịch bản nghiệm thu thực tế
                                │
                                ▼
[TẠI SAO CẦN & ỨNG DỤNG VÀO DỰ ÁN]
• Lý do: Trực quan hóa yêu cầu -> Tiết kiệm chi phí sửa -> Làm mẫu cho Dev -> Viết kịch bản kiểm thử
• Ứng dụng: Lập trình viên viết mã giao diện trong Sprint 2 -> Căn cứ nghiệm thu sản phẩm
```
