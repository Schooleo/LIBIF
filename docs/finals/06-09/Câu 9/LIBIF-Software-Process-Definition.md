# ĐỊNH NGHĨA QUY TRÌNH PHÁT TRIỂN PHẦN MỀM

## 1. Tổng quan & Mục tiêu Quy trình

Quy trình phát triển phần mềm được thiết lập nhằm xây dựng khung làm việc kỷ luật, rõ ràng và hiệu quả cho đội ngũ **06 sinh viên** trong thời gian **10 tuần**.

### Mục tiêu cốt lõi:
1. Đảm bảo bàn giao các bản phân phối phần mềm chạy được sau mỗi chu kỳ **02 tuần**.
2. Phân định minh bạch vai trò, trách nhiệm và kênh phối hợp giữa các thành viên.
3. Kiểm soát chất lượng đồng đều qua tiêu chuẩn **Định nghĩa Hoàn thành**.
4. Đảm bảo hoàn thành đúng hạn $100\%$ các tính năng cốt lõi theo mục tiêu học phần.

---

## 2. Mô hình Cơ sở & Phương pháp luận

Dự án áp dụng mô hình **Lai giữa Waterfall và Scrum** làm phương pháp luận phát triển:

```
[VỎ NGOÀI: WATERFALL] ──► Kiểm soát mốc thời hạn 10 tuần, tài liệu kiến trúc ban đầu và nghiệm thu cuối kỳ.
       │
       ▼
[LÕI TRONG: SCRUM]    ──► 05 Sprint phát triển cuốn chiếu, thử nghiệm giao diện và tiếp nhận phản hồi định kỳ.
```

### 2.1 Căn cứ Lựa chọn Mô hình Lai
* **Không dùng Waterfall thuần túy:** Do các tính năng bảo mật mới (HTML5 Canvas Reader, OCR ngầm, chống tải file) cần thử nghiệm thực tế và chỉnh sửa giao diện liên tục với thủ thư.
* **Không dùng Kanban thuần túy:** Kanban không có hạn chót cố định, trong khi đồ án học phần có ràng buộc cứng về mốc kết thúc 10 tuần.
* **Mô hình Lai là tối ưu:** Kết hợp tính linh hoạt của Scrum trong từng chu kỳ 2 tuần với tính kiểm soát chặt chẽ của Waterfall ở hai đầu dự án (khởi động kiến trúc và nghiệm thu bàn giao).

### 2.2 Ưu điểm & Hạn chế

| Khía cạnh | Điểm mạnh | Điểm cần lưu ý |
|---|---|---|
| **Mô hình Lai** | • Linh hoạt nhận góp ý sau mỗi 2 tuần để tinh chỉnh giao diện.<br>• Giữ vững thời hạn kết thúc 10 tuần của học phần.<br>• Minh bạch tiến độ hàng ngày qua bảng công việc. | • Đòi hỏi tính tự giác và kỷ luật cao từ 6 thành viên.<br>• Áp lực điều phối khi trùng lịch thi cử tại trường. |

---

## 3. Lộ trình Phát triển 05 Sprint (10 Tuần)

Tổng thời gian thực hiện gồm **10 tuần**, chia thành **05 Sprint (mỗi Sprint đúng 02 tuần)**:

| Sprint | Thời gian | Mục tiêu Sprint | Story Points | Kết quả Phân phối |
| :--- | :---: | :--- | :---: | :--- |
| **Sprint 1** | Tuần 1 – 2 | Dựng nền tảng kiến trúc, cơ sở dữ liệu và luồng OCR cơ bản. | 26 | Mã nguồn khung, pipeline upload file và Tesseract OCR chạy thử nghiệm. |
| **Sprint 2** | Tuần 3 – 4 | Hoàn thành giao diện đối soát Side-by-side và quy trình phê duyệt. | 28 | Màn hình đối soát kép cho thủ thư kiểm tra và bấm phê duyệt xuất bản. |
| **Sprint 3** | Tuần 5 – 6 | Xây dựng phân hệ xuất bản, mã hóa AES-256 và phân quyền truy cập. | 29 | Module mã hóa lưu kho, giới hạn phiên đọc và ghi nhật ký hoạt động. |
| **Sprint 4** | Tuần 7 – 8 | Phát triển tìm kiếm toàn văn, Canvas Reader và lớp bảo vệ bản quyền. | 29 | Trình đọc trực tuyến nhúng Watermark động, làm mờ chống chụp màn hình. |
| **Sprint 5** | Tuần 9 – 10 | Kiểm thử an ninh, sửa lỗi, nghiệm thu thực tế và đóng gói Docker. | 24 | Gói Docker hoàn chỉnh, báo cáo kiểm thử và biên bản nghiệm thu UAT. |
| **Tổng cộng** | **10 tuần** | **Hoàn thành trọn vẹn sản phẩm tối thiểu** | **136 SP** | **Sản phẩm chạy ổn định trên máy chủ thử nghiệm** |

---

## 4. Cơ cấu Tổ chức & Phân công 06 Thành viên

Nhóm gồm 06 sinh viên năm 4 đảm nhiệm các vai trò chuyên trách:

| Mã | Thành viên | Vai trò | Trách nhiệm Trọng tâm | Mức tham gia |
| :---: | :--- | :--- | :--- | :---: |
| **SV-1** | Trưởng nhóm Kỹ thuật | Scrum Master / Tech Lead | Quản lý tiến độ, chủ trì sự kiện Scrum, kiến trúc hệ thống và mã hóa AES-256. | 15 giờ/tuần |
| **SV-2** | Lập trình viên Backend | Lập trình Backend | Xây dựng hệ thống API, luồng xử lý Tesseract OCR và hàng chờ BullMQ/Redis. | 15 giờ/tuần |
| **SV-3** | Lập trình viên Frontend | Lập trình Frontend | Xây dựng giao diện Quản trị cho Thủ thư và Màn hình đối soát Side-by-side. | 15 giờ/tuần |
| **SV-4** | Lập trình viên Frontend | Lập trình Frontend | Xây dựng Cổng Độc giả, Trình đọc Canvas Reader và lớp nhúng Watermark. | 15 giờ/tuần |
| **SV-5** | Chuyên viên Bảo mật | Chuyên viên Bảo mật | Cơ chế chống tải file, giới hạn đọc đồng thời và ghi nhật ký hoạt động. | 15 giờ/tuần |
| **SV-6** | Chuyên viên Kiểm thử | Chuyên viên Kiểm thử & Tìm kiếm | Xây dựng bộ tìm kiếm toàn văn, viết kịch bản kiểm thử và điều phối nghiệm thu. | 15 giờ/tuần |


---

## 5. Quy trình Tạo Bản phân phối & Định nghĩa Hoàn thành

### 5.1 Luồng 6 Bước Tạo Bản phân phối

```
[1. Lập kế hoạch Sprint] ──► [2. Lập trình tính năng] ──► [3. Kiểm tra chéo mã nguồn]
                                                                    │
                                                                    ▼
[6. Demo Sprint Review]  ◄── [5. Đối soát tiêu chuẩn]  ◄── [4. Đóng gói lên Staging]
```

1. **Lập kế hoạch Sprint:** Chọn các tính năng ưu tiên từ Product Backlog đưa vào Sprint Backlog, chốt mục tiêu Sprint.
2. **Lập trình tính năng:** Thành viên phụ trách viết mã nguồn và kiểm thử đơn vị tương ứng.
3. **Kiểm tra chéo mã nguồn:** Thành viên thứ hai rà soát mã nguồn trước khi tạo yêu cầu gộp nhánh.
4. **Triển khai máy chủ thử nghiệm:** Đóng gói Docker và tự động đẩy lên môi trường Staging (Azure for Students).
5. **Nghiệm thu theo Định nghĩa Hoàn thành:** Đối soát các tiêu chuẩn chất lượng.
6. **Demo sản phẩm trong Sprint Review:** Trình diễn tính năng chạy thực tế cho đại diện người dùng và giảng viên góp ý.

### 5.2 Tiêu chuẩn Định nghĩa Hoàn thành

Một tính năng chỉ được xem là hoàn thành khi đáp ứng trọn vẹn các tiêu chí:
* [x] Mã nguồn được viết hoàn chỉnh, tuân thủ quy chuẩn định dạng và không có lỗi biên dịch.
* [x] Vượt qua $100\%$ các bài kiểm thử tự động (kiểm thử đơn vị và kiểm thử tích hợp).
* [x] Đã được ít nhất một thành viên khác trong nhóm kiểm tra chéo.
* [x] Đã đóng gói Docker và triển khai chạy ổn định trên môi trường Staging.
* [x] Không còn lỗi nghiêm trọng.
* [x] Được Chủ sở hữu Sản phẩm kiểm tra và chấp thuận trong buổi họp Sprint Review.

---

## 6. Các Sự kiện Scrum & Kênh Giao tiếp

| Sự kiện | Tần suất | Thời lượng | Kênh thực hiện | Mục đích & Nội dung | Người Chủ trì |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Họp nhanh hàng ngày** | Thứ 2 – Thứ 6 | 15 phút | Trực tiếp / Trực tuyến | Trả lời 3 câu hỏi: *Đã làm gì hôm qua? Sẽ làm gì hôm nay? Có vướng mắc gì cần gỡ?* | SV-1 |
| **Lập kế hoạch Sprint** | Đầu mỗi Sprint | 2 giờ | Trực tuyến | Phân rã công việc cho 6 thành viên, cam kết mục tiêu Sprint. | SV-1 |
| **Demo sản phẩm** | Cuối mỗi Sprint | 1 giờ | Demo trực tiếp | Trình diễn tính năng chạy thực tế trên máy chủ Staging để nhận phản hồi. | Cả nhóm |
| **Rút kinh nghiệm Sprint** | Cuối mỗi Sprint | 45 phút | Nội bộ nhóm | Thảo luận: *Việc làm tốt? Điểm nghẽn cần tháo gỡ? Cải tiến cho Sprint sau?* | SV-1 |

---


## 7. Đánh giá Quy trình Thực tế

### 7.1 Phương pháp Đánh giá
* **Họp Rút kinh nghiệm định kỳ:** Đánh giá dòng chảy công việc sau mỗi 2 tuần để loại bỏ điểm nghẽn.
* **Theo dõi tốc độ hoàn thành:** Nhóm duy trì nhịp độ ổn định **26 – 29 SP/Sprint**, đảm bảo bàn giao đúng 10 tuần.
* **Kiểm soát chất lượng bàn giao:** Đạt **$100\%$ kịch bản nghiệm thu thực tế** (theo tiêu chuẩn **SC-03** trong Điều lệ dự án).

