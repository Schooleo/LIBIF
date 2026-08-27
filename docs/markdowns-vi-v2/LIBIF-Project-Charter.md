# ĐIỀU LỆ DỰ ÁN LIBIF

## 1. Thông tin chung

| Nội dung | Thông tin |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số và Quản lý Bản quyền Số LIBIF |
| Loại dự án | Nguyên mẫu khả dụng tối thiểu phục vụ học tập và trình diễn |
| Thời gian | 10 tuần, 5 Sprint |
| Nhân lực | 6 sinh viên, 15 giờ/người/tuần, tổng cộng 900 giờ công |
| Chi phí tiền mặt | 0 đồng (Toàn bộ sử dụng tài nguyên miễn phí: Azure for Students, Free AI, Subdomain) |
| Người cho phép khởi động | Giảng viên phụ trách |
| Người điều hành phạm vi sản phẩm | Product Owner |

## 2. Mục đích và lý do thực hiện

Hiện nay, thủ thư phải lưu tệp quét, nhận dạng ký tự, sửa văn bản, biên mục và chia sẻ tài liệu qua nhiều công cụ rời rạc. Sinh viên chủ yếu tìm theo thông tin mô tả, phải yêu cầu tệp hoặc đọc thủ công và khó tìm đúng trang chứa nội dung cần thiết. LIBIF được khởi động để kiểm chứng một quy trình thống nhất: thủ thư tải tài liệu lên, kiểm tra kết quả OCR, phê duyệt và phân quyền; sinh viên tìm kiếm toàn văn và đọc trực tuyến có kiểm soát.

Điều lệ này chính thức xác lập mục tiêu, phạm vi, nguồn lực, quyền quyết định và trách nhiệm của các bên trong 10 tuần thực hiện.

## 3. Mục tiêu và tiêu chí thành công

| Mục tiêu | Tiêu chí xác nhận |
| :--- | :--- |
| Hoàn thiện quy trình cốt lõi | Chạy được luồng tải lên → OCR → đối soát → phê duyệt → tìm kiếm → đọc trực tuyến |
| Hỗ trợ tìm kiếm nội dung | Trả về đúng tài liệu và trang chứa từ khóa trên bộ dữ liệu thử nghiệm |
| Kiểm soát quyền truy cập | Kiểm tra quyền trước khi đọc, không hiển thị đường dẫn tệp PDF gốc trên giao diện, có watermark và nhật ký truy cập |
| Bảo đảm chất lượng bản trình diễn | Cài đặt và chạy được bằng Docker; không còn lỗi nghiêm trọng trong các luồng cốt lõi |
| Tuân thủ giới hạn dự án | Hoàn thành trong 10 tuần và không phát sinh chi phí tiền mặt ngoài dự kiến |

Các cơ chế bảo vệ chỉ nhằm giảm nguy cơ sao chép trái phép, không cam kết ngăn chặn tuyệt đối việc ghi lại nội dung trên thiết bị người dùng.

## 4. Phạm vi cấp cao

### 4.1. Trong phạm vi

- Tải lên và lưu trữ tài liệu thử nghiệm có quyền sử dụng.
- Nhận dạng ký tự bằng Tesseract và xử lý nền.
- Giao diện đối chiếu ảnh gốc với văn bản OCR, sửa và phê duyệt.
- Biên mục, phân quyền, mã hóa, ghi nhật ký truy cập.
- Tìm kiếm toàn văn theo tài liệu và trang.
- Đọc trực tuyến bằng Canvas, kèm watermark và các biện pháp hạn chế tải trực tiếp.
- Đóng gói Docker, kiểm thử, tài liệu và trình diễn.

### 4.2. Ngoài phạm vi

- Mua sắm máy quét hoặc thực hiện số hóa tài liệu giấy.
- Xác lập hay mua bản quyền nội dung.
- Ứng dụng di động, thanh toán, đa đơn vị và vận hành thương mại.
- Kiểm thử xâm nhập chuyên nghiệp, cam kết mức dịch vụ hoặc hỗ trợ dài hạn.
- Cam kết chống sao chép tuyệt đối.

## 5. Sản phẩm bàn giao và mốc thực hiện

| Mốc | Tuần | Sản phẩm chính |
| :--- | :---: | :--- |
| M1 | 1–2 | Phạm vi cơ sở, kiến trúc, tải lên và OCR ban đầu |
| M2 | 3–4 | Đối soát OCR, biên mục và phê duyệt |
| M3 | 5–6 | Phân quyền, mã hóa và nhật ký truy cập |
| M4 | 7–8 | Tìm kiếm toàn văn, trình đọc Canvas và watermark |
| M5 | 9–10 | Tích hợp, kiểm thử, Docker, tài liệu và trình diễn |

Sản phẩm cuối gồm hồ sơ quản lý và yêu cầu, mã nguồn, môi trường chạy thử, bộ kiểm thử, báo cáo và kịch bản trình diễn.

## 6. Giả định, ràng buộc và rủi ro chính

- Dùng khoảng 10–20 tài liệu tiếng Việt hợp pháp, chất lượng quét khuyến nghị 300 DPI.
- Nếu không có thủ thư tham gia thường xuyên, Product Owner đại diện xác nhận nghiệp vụ.
- Ưu tiên tái sử dụng công nghệ và kết quả thử nghiệm sẵn có để phù hợp 900 giờ công.
- Rủi ro chính gồm chất lượng OCR không ổn định, thiếu hụt thời gian của thành viên, thay đổi công cụ và giới hạn bảo vệ nội dung trên trình duyệt.
- Chi tiết xem tại [Đề xuất dự án](./LIBIF-Project-Proposal.md) và [Tầm nhìn và phạm vi](./LIBIF-Project-Vision-Scope.md).

## 7. Các bên liên quan

| Mã | Bên liên quan | Trách nhiệm và quyền lợi chính |
| :--- | :--- | :--- |
| GV | Giảng viên phụ trách | Cho phép khởi động, đánh giá kết quả và phê duyệt thay đổi vượt mức cơ sở |
| PO | TV-01 — Product Owner, phân tích nghiệp vụ | Quản lý giá trị, phạm vi, backlog, tiêu chí chấp nhận và nghiệm thu nội bộ |
| TL | TV-02 — Scrum Master, trưởng kỹ thuật | Điều phối Sprint, kiến trúc, tích hợp và tháo gỡ trở ngại |
| OCR | TV-03 — Phát triển backend và OCR | OCR, xử lý nền, dữ liệu và dịch vụ backend liên quan |
| FE | TV-04 — Phát triển giao diện | Giao diện quản trị, đối soát và biên mục |
| AT | TV-05 — Phát triển trình đọc và bảo vệ nội dung | Canvas, mã hóa phía trình duyệt, watermark và gia cố giao diện |
| QA | TV-06 — Kiểm thử và vận hành phát triển | Kiểm thử, tích hợp liên tục, Docker, môi trường thử và điều phối tài liệu |
| TT | Đại diện thủ thư | Xác nhận quy trình hiện tại, góp ý đối soát, biên mục và phân quyền |
| SV | Đại diện sinh viên | Góp ý khả năng tìm kiếm, đọc và mức dễ sử dụng |
| CSH | Chủ sở hữu hoặc bên cung cấp nội dung | Xác nhận quyền sử dụng và các giới hạn áp dụng cho dữ liệu thử nghiệm |

## 8. Ma trận RACI

Ký hiệu được dùng như sau:

- **R:** trực tiếp thực hiện công việc.
- **A:** chịu trách nhiệm giải trình cuối cùng; mỗi công việc chỉ có một A.
- **C:** được tham vấn trước khi quyết định hoặc hoàn thành.
- **I:** được thông báo kết quả hoặc tiến độ.

| Công việc | GV | PO | TL | OCR | FE | AT | QA | TT | SV | CSH |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Phê duyệt điều lệ và mức cơ sở | **A** | **R** | C | I | I | I | I | C | I | C |
| Quản lý backlog và tiêu chí chấp nhận | I | **A/R** | C | C | C | C | C | C | C | I |
| Lập kế hoạch Sprint, theo dõi và xử lý trở ngại | I | C | **A/R** | R | R | R | R | I | I | I |
| Thiết kế kiến trúc và tích hợp hệ thống | I | C | **A/R** | C | C | C | C | I | I | I |
| Phát triển tải lên, OCR, dữ liệu và xử lý nền | I | C | **A** | **R** | C | C | C | C | I | I |
| Phát triển đối soát, biên mục và giao diện quản trị | I | C | **A** | C | **R** | C | C | C | I | I |
| Phát triển phân quyền, mã hóa và nhật ký | I | C | **A** | **R** | C | R | C | C | I | I |
| Phát triển tìm kiếm, Canvas và watermark | I | C | **A** | R | C | **R** | C | C | C | I |
| Lập và thực hiện kế hoạch kiểm thử | I | C | C | C | C | C | **A/R** | C | C | I |
| Tổ chức đánh giá với thủ thư và sinh viên | I | **A** | C | I | C | C | **R** | **R** | **R** | I |
| Đóng gói Docker và duy trì môi trường thử | I | I | **A** | C | C | C | **R** | I | I | I |
| Hoàn thiện hồ sơ, báo cáo và trình diễn | I | **A/R** | R | R | R | R | **R** | C | C | I |
| Xác nhận quyền sử dụng dữ liệu thử nghiệm | I | **A/R** | I | I | I | I | C | C | I | C |
| Ưu tiên hoặc hoán đổi tính năng trong mức cơ sở | I | **A/R** | C | C | C | C | C | C | C | I |
| Thay đổi thời hạn, ngân sách hoặc mục tiêu chính | **A** | **R** | R | I | I | I | C | C | I | C |

## 9. Ma trận ảnh hưởng và quyền lợi

|  | Quyền lợi thấp | Quyền lợi cao |
| :--- | :--- | :--- |
| **Ảnh hưởng cao** | **Duy trì hài lòng:** chủ sở hữu hoặc bên cung cấp nội dung | **Phối hợp chặt chẽ:** giảng viên, Product Owner, Scrum Master và trưởng kỹ thuật |
| **Ảnh hưởng thấp** | **Theo dõi:** nhà cung cấp công cụ và hạ tầng phụ thuộc | **Thông tin thường xuyên:** TV-03 đến TV-06, đại diện thủ thư và đại diện sinh viên |

| Nhóm | Cách tương tác |
| :--- | :--- |
| Phối hợp chặt chẽ | Cập nhật hằng tuần, tham gia lập kế hoạch và đánh giá cuối mỗi Sprint; xử lý ngay thay đổi ảnh hưởng mức cơ sở |
| Duy trì hài lòng | Tham vấn trước khi dùng dữ liệu hoặc thay đổi điều kiện truy cập nội dung |
| Thông tin thường xuyên | Theo dõi backlog và tiến độ; tham gia họp ngắn, kiểm thử và phiên trình diễn phù hợp vai trò |
| Theo dõi | Kiểm tra thay đổi phiên bản, giấy phép hoặc khả năng cung cấp khi có dấu hiệu ảnh hưởng dự án |

## 10. Quyền quyết định và phê duyệt

| Quyết định | Người có quyền giải trình cuối cùng | Điều kiện |
| :--- | :--- | :--- |
| Tầm nhìn, thứ tự ưu tiên và tiêu chí chấp nhận | Product Owner | Không vượt thời hạn, ngân sách và mục tiêu đã duyệt |
| Kiến trúc, tích hợp và tiêu chuẩn kỹ thuật | Scrum Master, trưởng kỹ thuật | Có tham vấn thành viên phụ trách và kiểm thử |
| Chất lượng bản dựng và kết quả kiểm thử | TV-06 | Lỗi nghiêm trọng phải được báo cho Product Owner và trưởng kỹ thuật |
| Thay đổi vượt phạm vi cơ sở | Giảng viên phụ trách | Áp dụng khi đổi mục tiêu chính, kéo dài thời hạn hoặc phát sinh chi phí |
| Chấp nhận sản phẩm cuối của nhóm | Product Owner | Dựa trên tiêu chí thành công và bằng chứng kiểm thử; giảng viên đánh giá kết quả học phần |

Điều lệ có hiệu lực khi giảng viên phụ trách chấp thuận. Mọi thay đổi phải được ghi nhận trong backlog hoặc nhật ký thay đổi và thông báo cho các bên chịu ảnh hưởng.

## 11. Tài liệu liên quan

- [Đề xuất dự án LIBIF](./LIBIF-Project-Proposal.md)
- [Tầm nhìn và phạm vi LIBIF](./LIBIF-Project-Vision-Scope.md)
- [Ước lượng dự án LIBIF](./LIBIF-Project-Estimation.md)
