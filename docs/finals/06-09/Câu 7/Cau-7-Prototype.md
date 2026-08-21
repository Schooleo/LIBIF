# CÂU 7: SẢN PHẨM BẢN MẪU (PROTOTYPE) — BẢN DỄ HỌC & DỄ TRÌNH BÀY

> **Đề bài:** Trình bày quá trình hình thành và phương pháp đánh giá sản phẩm Bản mẫu (Prototype) của nhóm. (Sinh viên nộp kèm bản in phác thảo giao diện ban đầu cho hệ thống của nhóm.)

---

## 📋 TÀI LIỆU CẦN IN VÀ NỘP KÈM (CHỌN 01 BẢN MẪU ĐẠI DIỆN)

* **Bản in nộp kèm duy nhất:** Màn hình **Đối soát & Phê duyệt Số hóa** tại thư mục `stitch_design/approval_review/screen.png` (kèm mã nguồn `code.html`).
* **Lý do lựa chọn:** Đây là màn hình quan trọng nhất thể hiện rõ nghiệp vụ của dự án: Màn hình chia đôi $60/40$ để thủ thư vừa xem ảnh scan gốc, vừa đối soát dữ liệu máy trích xuất.

---

## PHẦN A: QUÁ TRÌNH HÌNH THÀNH VÀ PHƯƠNG PHÁP ĐÁNH GIÁ BẢN MẪU

### I. QUÁ TRÌNH HÌNH THÀNH BẢN MẪU

#### 1. Bối cảnh và Lý do hình thành Bản mẫu
* **Thực trạng trước đây:** Thủ thư phải mở nhiều ứng dụng rời rạc để kiểm tra kết quả nhận dạng chữ, vừa tốn công vừa dễ nhầm lẫn.
* **Mục tiêu của Bản mẫu:** Tạo một màn hình làm việc tập trung để thủ thư dễ dàng so sánh dòng-theo-dòng giữa ảnh sách scan và văn bản trích xuất, giúp sửa $5\% - 15\%$ sai số nhận dạng trước khi xuất bản.
* **Cấu trúc màn hình đại diện (`stitch_design/approval_review/`):**
  * **Cột bên trái ($60\%$ màn hình):** Xem trang sách scan gốc chuẩn $300\text{ DPI}$, có nút phóng to/thu nhỏ và khung viền đánh dấu vị trí từ.
  * **Cột bên phải ($40\%$ màn hình):** Bảng thông tin sách (Tên sách, Tác giả, Năm xuất bản, ISBN), độ tin cậy nhận dạng chữ ($99\%$), phân loại danh mục, 3 ô kiểm tra chất lượng và các nút duyệt xuất bản.

#### 2. Các tài liệu đầu vào cần thiết

| STT | Tài liệu đầu vào | Vai trò đóng góp cho Bản mẫu |
|:---:|---|---|
| **1** | **Tầm nhìn & Phạm vi** (`LIBIF-Project-Vision-Scope.md`) | Xác định vai trò người dùng (Thủ thư số hóa) và các tính năng chính. |
| **2** | **Yêu cầu sản phẩm** (`LIBIF-Product-Backlog.md`) | Tiêu chí nghiệm thu của tính năng Đối soát (PBI-04), Phê duyệt (PBI-05), Nhập thông tin sách (PBI-06). |
| **3** | **Đề xuất dự án** (`LIBIF-Project-Proposal.md`) | Xác định quy trình nghiệp vụ kiểm duyệt tài liệu trước khi xuất bản. |
| **4** | **Quy chuẩn thiết kế trong `stitch_design/`** | Bộ màu sắc giao diện (Xanh Teal, Xám nhạt), kiểu chữ tiếng Việt và các biểu tượng. |

#### 3. Quá trình 5 bước hình thành Bản mẫu

| Bước | Tên bước | Công việc thực tế nhóm đã làm |
|:---:|---|---|
| **B1** | **Vẽ luồng thao tác trên giấy** | Nhóm vẽ phác thảo tay các bước thủ thư thao tác: *Mở danh sách $\rightarrow$ Chọn sách $\rightarrow$ Đối soát $\rightarrow$ Bấm duyệt*. |
| **B2** | **Dựng khung bố cục đơn giản** | Chia đôi màn hình theo tỷ lệ $60/40$ để tối ưu tầm nhìn so sánh giữa ảnh gốc và văn bản. |
| **B3** | **Thiết kế giao diện chi tiết** | Đưa màu sắc chuẩn, biểu tượng trực quan và dữ liệu sách mẫu thật (*Sách Habermas*) vào bản vẽ. |
| **B4** | **Lập trình bản mẫu bấm thử được** | Viết mã nguồn HTML/CSS (`code.html`) để người dùng có thể rê chuột, bấm thử các nút, đánh dấu ô chọn như phần mềm thật. |
| **B5** | **Thử nghiệm với người dùng & Tinh chỉnh** | Mời Thủ thư và đại diện dự án dùng thử để tiếp thu góp ý và hoàn thiện bản thiết kế. |

---

### II. PHƯƠNG PHÁP VÀ KẾT QUẢ ĐÁNH GIÁ BẢN MẪU

| Phương pháp đánh giá | Cách nhóm thực hiện | Kết quả thực tế & Cải tiến thu được |
|---|---|---|
| **1. Cho người dùng dùng thử** | Mời người đóng vai Thủ thư thao tác thử: *"Đối soát thông tin cuốn sách Habermas và thực hiện duyệt xuất bản"*. | • Người dùng thao tác dễ dàng, hoàn thành việc duyệt dưới $1$ phút.<br>• **Cải tiến:** Thủ thư góp ý cần có danh sách nhắc việc $\rightarrow$ Nhóm đã **thêm 3 ô kiểm tra chất lượng** (Ảnh rõ nét, Không thiếu trang, Đã kiểm tra thông tin). |
| **2. Tự rà soát tính thân thiện** | Nhóm tự kiểm tra giao diện theo các nguyên tắc thiết kế tốt (tránh bấm nhầm, bố cục rõ ràng). | • **Cải tiến 1:** Thêm nút riêng **"Yêu cầu sửa lại"** (Request Correction) tách biệt với nút "Từ chối" để tránh bấm nhầm hủy hồ sơ.<br>• **Cải tiến 2:** Thêm nhãn xanh **"Đã trích xuất tự động"** ở các ô dữ liệu máy tự điền. |
| **3. Khảo sát nhóm người dùng** | Khảo sát ý kiến định kỳ trên nhóm Thủ thư và Độc giả (theo mục 8.2 trong Project Charter). | Đạt **$100\%$ kịch bản nghiệm thu thực tế** (theo **Tiêu chí thành công SC-03** trong Project Charter), khẳng định giao diện sẵn sàng để lập trình. |

---

## PHẦN B: 6 CÂU HỎI THƯỜNG GẶP KHI VẤN ĐÁP

### B1. Sản phẩm Bản mẫu (Prototype) là gì?
* **Khái niệm:** Là mô hình mô phỏng giao diện và cách thao tác của phần mềm, giúp kiểm tra trải nghiệm người dùng trước khi viết mã nguồn.
* **Khác với PoC (Chứng minh ý tưởng):**
  * **Bản mẫu (Prototype):** Tập trung vào **Giao diện và Trải nghiệm bên ngoài** (người dùng nhìn và bấm thử thế nào).
  * **Chứng minh ý tưởng (PoC):** Tập trung vào **Kỹ thuật và Thuật toán bên trong** (mã nguồn có giải được bài toán khó không).
* **Mục đích:** Giúp các bên nhìn thấy sản phẩm tương lai, phát hiện thiếu sót sớm và chốt thiết kế thống nhất.

---

### B2. Khác nhau giữa Bản mẫu hệ thống và Tập hợp các màn hình giao diện?

| Tiêu chí so sánh | Tập hợp các màn hình giao diện (Bản vẽ tĩnh) | Bản mẫu hệ thống (Bản mẫu bấm thử được) |
|---|---|---|
| **Bản chất** | Các bức ảnh/bản vẽ **đứng riêng lẻ, bất động**. | Hệ thống các màn hình **liên kết với nhau**. |
| **Thao tác** | **Không bấm được**, chỉ nhìn cách sắp xếp chữ và nút. | **Bấm tương tác được** (click chuyển trang, mở hộp thoại, đánh dấu ô chọn). |
| **Mục đích** | Xem bố cục và màu sắc. | Kiểm tra **toàn bộ quy trình làm việc thực tế**. |

---

### B3. Các đầu vào cần thiết và các bước tạo Bản mẫu của nhóm là gì?
* **4 Đầu vào:** Tài liệu Tầm nhìn & Phạm vi + Yêu cầu sản phẩm (PBI-04, 05, 06) + Quy trình nghiệp vụ đề xuất + Bộ quy chuẩn thiết kế (`stitch_design/`).
* **5 Bước thực hiện:**
  1. Vẽ luồng thao tác trên giấy.
  2. Dựng khung bố cục chia đôi $60/40$.
  3. Thiết kế giao diện chi tiết đầy đủ màu sắc.
  4. Lập trình bản mẫu bấm thử được bằng HTML/CSS (`code.html`).
  5. Cho người dùng dùng thử để lấy góp ý và hoàn thiện.

---

### B4. Sản phẩm Bản mẫu của nhóm đã được đánh giá thế nào?
1. **Bố cục chia đôi $60/40$:** Giúp mắt đối soát dòng-theo-dòng thuận tiện, không phải chuyển qua lại giữa các cửa sổ.
2. **Hạn chế sai sót:** Đã bổ sung **3 ô kiểm tra chất lượng** và nút riêng **"Yêu cầu sửa lại"**.
3. **Mỹ thuật và hiển thị:** Màu sắc hài hòa, hỗ trợ hiển thị tiếng Việt có dấu rõ ràng.
4. **Kết quả nghiệm thu:** Đạt **$100\%$ kịch bản kiểm thử nghiệm thu** (theo tiêu chí **SC-03** trong Project Charter).

---

### B5. Tại sao cần tạo sản phẩm Bản mẫu? (5 lý do then chốt)
1. **Trực quan hóa yêu cầu:** Khách hàng nhìn thấy màn hình thật sẽ dễ dàng đóng góp ý kiến chính xác hơn là đọc văn bản mô tả.
2. **Tiết kiệm chi phí sửa đổi:** Sửa trên bản thiết kế chỉ mất vài phút; nếu lập trình xong cơ sở dữ liệu mới sửa thì tốn gấp $10 - 50$ lần công sức.
3. **Làm rõ tiêu chuẩn nghiệm thu:** Giúp khách hàng và đội phát triển hiểu thống nhất về sản phẩm cần bàn giao.
4. **Làm mẫu cho lập trình viên:** Lập trình viên nhìn vào bản mẫu để viết mã giao diện chính xác từng nút bấm, màu sắc.
5. **Cơ sở để viết kịch bản kiểm thử:** Đội kiểm thử dựa vào các nút bấm và ô nhập liệu trên bản mẫu để chuẩn bị kịch bản kiểm tra phần mềm.

---

### B6. Sản phẩm Bản mẫu đã được sử dụng trong dự án như thế nào?
* **Dùng để viết mã giao diện:** Lập trình viên dựa vào mã `approval_review/code.html` để xây dựng giao diện thực tế cho **PBI-04** và **PBI-05** trong **Sprint 2**.
* **Dùng để đối chiếu khi bàn giao Sprint:** Trong buổi báo cáo cuối Sprint, nhóm dùng bản mẫu để so sánh xem sản phẩm thật làm ra có đúng với thiết kế ban đầu không.
* **Làm căn cứ nghiệm thu:** Khách hàng/Thủ thư đối chiếu bản mẫu để nghiệm thu sản phẩm bàn giao.
* **Đính kèm hợp đồng công việc:** Đính kèm trong phụ lục tài liệu **Statement of Work (`LIBIF-Statement-Of-Work.md`)**.

---

## PHẦN C: SƠ ĐỒ LUỒNG GHI NHỚ NHANH (VẼ TRÊN GIẤY A4)

```
[BỐI CẢNH & BẢN MẪU ĐẠI DIỆN]
• Bối cảnh: Thủ thư cần màn hình tập trung để đối soát và sửa 5%-15% sai số nhận dạng trước khi xuất bản
• Bản mẫu đại diện: Màn hình Đối soát (stitch_design/approval_review/) chia đôi 60/40: Trái xem ảnh scan | Phải kiểm tra dữ liệu & Phê duyệt
                                │
                                ▼
[4 ĐẦU VÀO] ──► [5 BƯỚC HÌNH THÀNH]
• Tầm nhìn & Phạm vi (Thủ thư)    1. Vẽ luồng thao tác trên giấy
• Yêu cầu (PBI-04, 05, 06)        2. Dựng khung bố cục chia đôi 60/40
• Đề xuất dự án (Quy trình)       3. Thiết kế giao diện chi tiết đầy đủ màu sắc
• Quy chuẩn thiết kế              4. Lập trình bản mẫu bấm thử được (code.html)
                                  5. Cho người dùng dùng thử & tinh chỉnh
                                │
                                ▼
[KẾT QUẢ ĐÁNH GIÁ]
• Người dùng dùng thử: Duyệt mượt dưới 1 phút -> Thêm 3 ô kiểm tra chất lượng
• Tự rà soát: Thêm nút "Yêu cầu sửa lại" riêng biệt + Nhãn "Đã trích xuất tự động"
• Khảo sát người dùng: Đạt 100% kịch bản nghiệm thu thực tế (Tiêu chí SC-03)
                                │
                                ▼
[TẠI SAO CẦN & ỨNG DỤNG VÀO DỰ ÁN]
• Lý do: Trực quan hóa yêu cầu -> Tiết kiệm chi phí sửa -> Làm mẫu cho Dev -> Viết kịch bản kiểm thử
• Ứng dụng: Lập trình viên viết mã giao diện trong Sprint 2 (PBI-04, 05) -> Căn cứ nghiệm thu sản phẩm
```
