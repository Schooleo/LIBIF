# PROJECT PROPOSAL

**Tên dự án:** Hệ thống Thư viện Số và Quản lý Bản quyền Số LIBIF

---

## 1. Tóm tắt đề xuất

LIBIF là thư viện số giúp thủ thư nhận dạng chữ từ tài liệu quét, đối soát nội dung, xuất bản và cung cấp quyền đọc trực tuyến có kiểm soát. Dự án nhằm kiểm chứng luồng nghiệp vụ cốt lõi trong 10 tuần với ngân sách tiền mặt 0 VNĐ (tối ưu hóa toàn bộ bằng tài nguyên miễn phí), trước khi xem xét thí điểm tại thư viện thật.

## 2. Tình huống kinh doanh

> Cô Lan phụ trách kho tài liệu tại thư viện một trường đại học có nhiều giáo trình cũ chỉ còn bản giấy. Mỗi đầu học kỳ, sinh viên cùng tìm một số cuốn, trong khi người ở xa khó tiếp cận. Cô quét tài liệu thành PDF, nhưng hình ảnh thì không tìm được từ khóa; phải kiểm tra quyền bằng tay. Khi một tệp bị chia sẻ ra ngoài, thư viện không xác định được tài khoản làm lộ tài liệu. Ban giám hiệu tạm dừng mở rộng kho số, còn nhà xuất bản chưa yên tâm cấp thêm quyền khai thác.
>
> Với LIBIF, cô Lan tải bản quét lên để hệ thống nhận dạng chữ, đối chiếu ảnh gốc với văn bản, sửa lỗi rồi mới phê duyệt. Sinh viên được tìm kiếm và đọc trực tuyến theo quyền đã cấp; dấu nhận diện cùng nhật ký hoạt động hỗ trợ truy vết khi có vi phạm. Thư viện nhờ đó hình thành một quy trình có kiểm soát từ tiếp nhận, kiểm duyệt đến khai thác.
>
> Giá trị kinh doanh nằm ở việc mở rộng phục vụ mà không tăng số bản sách và thao tác thủ công, đồng thời tạo bằng chứng để làm việc với chủ sở hữu bản quyền.

## 3. Phát biểu vấn đề

Các thư viện đại học có tài liệu giấy hoặc bản quét rời rạc nhưng thiếu một hệ thống thống nhất để nhận dạng chữ, kiểm duyệt nội dung, tìm kiếm toàn văn và kiểm soát quyền đọc. Hậu quả là thủ thư phải xử lý nhiều bước thủ công, độc giả khó tiếp cận tài liệu từ xa, còn đơn vị quản lý không đủ bằng chứng truy vết để giảm rủi ro phát tán trái phép.

Nếu chỉ lưu PDF trên dịch vụ chia sẻ tệp, thư viện giải quyết được việc lưu trữ nhưng chưa giải quyết được chất lượng dữ liệu, quy trình phê duyệt và trách nhiệm bản quyền. LIBIF cần chứng minh rằng một quy trình tập trung có thể giảm thao tác của thủ thư, bảo vệ tệp gốc và cung cấp khả năng tra cứu thuận tiện trong phạm vi ngân sách của một thư viện quy mô vừa.

## 4. Mục tiêu và tiêu chí thành công

- Hoàn thành luồng tải tài liệu → nhận dạng chữ → đối soát → phê duyệt → tìm kiếm → đọc trực tuyến.
- Không công khai đường dẫn PDF gốc trên giao diện; dấu nhận diện động và nhật ký hoạt động vận hành trong kịch bản thử nghiệm.
- Hoàn thành trong 10 tuần, không phát sinh chi phí tiền mặt ngoài dự kiến và không còn lỗi nghiêm trọng trước khi bàn giao.
- Có đủ bằng chứng kiểm thử, nghiệm thu và vận hành 05 Sprint.

> Chi tiết xem tại [Điều lệ dự án](./LIBIF-Project-Charter.md) và [Phạm vi công việc](./LIBIF-Statement-Of-Work.md).

## 5. Phạm vi

- **Trong phạm vi:** tải tài liệu, Tesseract OCR, đối soát, biên mục cơ bản, phân quyền, mã hóa, tìm kiếm, trình đọc Canvas, watermark và audit log.
- **Ngoài phạm vi:** máy quét, bản quyền nội dung, ứng dụng di động, vận hành thật và bảo trì thương mại.

> Chi tiết xem tại [Tầm nhìn và Phạm vi](./LIBIF-Project-Vision-Scope.md) và [Danh sách yêu cầu sản phẩm](./LIBIF-Product-Backlog.md).

## 6. Đối thủ và sản phẩm tham chiếu

| Sản phẩm | Đường dẫn chính thức | Phân tích ngắn gọn |
| :--- | :--- | :--- |
| **DSpace** | [dspace.org](https://dspace.org/features/) | Là phần mềm mã nguồn mở mạnh về kho lưu trữ số, quản lý nhiều định dạng, tìm kiếm toàn văn và phân quyền theo nhóm. LIBIF tập trung sâu hơn vào nhận dạng chữ tiếng Việt, đối soát từng trang và trải nghiệm đọc có dấu nhận diện động. Đây là khác biệt về trọng tâm, không có nghĩa DSpace không thể được mở rộng. |
| **Greenstone** | [greenstone.org](https://greenstone.org/) | Là phần mềm mã nguồn mở, đa ngôn ngữ, phù hợp để tổ chức và phát hành bộ sưu tập số trên web hoặc thiết bị lưu trữ rời. LIBIF ưu tiên quy trình tập trung cho thủ thư, kiểm soát phiên đọc và nhật ký truy cập. |
| **Ex Libris Alma Digital** | [exlibrisgroup.com](https://exlibrisgroup.com/products/alma-library-services-platform/) | Quản lý thống nhất tài nguyên in, điện tử và số với phạm vi nghiệp vụ rộng. LIBIF chọn phạm vi hẹp hơn để phù hợp nhóm phát triển nhỏ và mục tiêu thử nghiệm nhận dạng chữ, đối soát tiếng Việt, đọc có kiểm soát. Giá và khả năng tùy biến cần được xác minh bằng báo giá và thử nghiệm thực tế. |

Ba sản phẩm trên là đối thủ hoặc giải pháp thay thế theo từng phần của bài toán. Các nhận định về độ dễ dùng, tổng chi phí sở hữu và hiệu quả bảo vệ nội dung cần được kiểm chứng bằng bản dùng thử, báo giá hoặc triển khai thí điểm trước khi quyết định thương mại hóa LIBIF.

## 7. Giải pháp đề xuất

- Dùng Tesseract để nhận dạng chữ trên máy chủ và hàng chờ để xử lý tác vụ nền.
- Cho phép thủ thư đối chiếu ảnh gốc với văn bản trước khi phê duyệt.
- Mã hóa tài liệu, phân quyền và giới hạn phiên đọc đồng thời.
- Cung cấp tìm kiếm, trình đọc Canvas, watermark và audit log.

Giải pháp chỉ giảm nguy cơ tải và phát tán tệp; không cam kết ngăn chặn tuyệt đối mọi hình thức sao chép hoặc chụp bằng thiết bị bên ngoài.

> Chi tiết xem tại [Kiến trúc hệ thống](./LIBIF-Architecture.md) và [Chứng minh khả thi](./LIBIF-Proof-Of-Concept.md).

## 8. Sản phẩm bàn giao và nghiệm thu

- Bộ tài liệu quản lý dự án và yêu cầu sản phẩm.
- Mã nguồn, môi trường thử nghiệm và gói Docker có hướng dẫn cài đặt.
- Bản mẫu chạy được các luồng nghiệp vụ cốt lõi.
- Bộ kiểm thử, báo cáo kết quả, danh sách giới hạn và kịch bản trình diễn.

> Danh sách sản phẩm, tiêu chí chấp nhận và quy trình nghiệm thu xem tại [Phạm vi công việc](./LIBIF-Statement-Of-Work.md).

## 9. Lợi ích kỳ vọng

- Thủ thư có một quy trình tập trung thay cho nhiều thao tác rời rạc.
- Độc giả có thể tìm kiếm nội dung và đọc tài liệu từ xa theo quyền được cấp.
- Thư viện có dấu nhận diện và nhật ký để hỗ trợ truy vết sự cố.
- Nhóm có bằng chứng để đánh giá khả năng thí điểm và thương mại hóa tiếp theo.

Các lợi ích trên là mục tiêu cần đo bằng dữ liệu thử nghiệm, không phải kết quả đã được bảo đảm.

## 10. Tính khả thi và rủi ro chính

- **Kỹ thuật:** khả thi ở mức bản mẫu nhờ tái sử dụng nền tảng và kết quả thử nghiệm hiện có.
- **Tiến độ:** khả thi nếu giữ phạm vi ưu tiên và hoãn hạng mục phụ khi vận tốc thấp hơn kế hoạch.
- **Tài chính:** khả thi trong ngân sách học phần; chưa đủ cơ sở để ước tính chi phí thương mại hóa.
- **Rủi ro chính:** chất lượng tài liệu quét làm tăng lỗi nhận dạng; thiếu hụt năng lực nhóm; thay đổi công cụ hoặc giấy phép; giới hạn bảo vệ nội dung trên trình duyệt.

> Danh sách rủi ro, mức độ, người phụ trách và phương án ứng phó xem tại [Kế hoạch quản lý rủi ro](./LIBIF-Software-Risk-Management-Plan.md).

## 11. Thời gian và chi phí dự kiến

Ước tính dưới đây áp dụng cho bản mẫu của học phần, không phải sản phẩm thương mại vận hành tại thư viện thật.

### 11.1 Thời gian

| Giai đoạn | Thời gian | Kết quả chính |
| :--- | :---: | :--- |
| Sprint 1 | Tuần 1-2 | Nền tảng, tải tài liệu và luồng nhận dạng chữ cơ bản |
| Sprint 2 | Tuần 3-4 | Đối soát, phê duyệt và biên mục |
| Sprint 3 | Tuần 5-6 | Mã hóa, phân quyền, giới hạn phiên và nhật ký |
| Sprint 4 | Tuần 7-8 | Tìm kiếm toàn văn, trình đọc và dấu nhận diện động |
| Sprint 5 | Tuần 9-10 | Kiểm thử, sửa lỗi, đóng gói và trình diễn |
| **Tổng** | **10 tuần** | **05 Sprint, 900 giờ-người của 06 sinh viên** |

### 11.2 Chi phí
| Hạng mục | Dự toán (VNĐ) | Ghi chú |
| :--- | ---: | :--- |
| Công sức 06 sinh viên | 0 | 900 giờ-người (765h tập trung sản phẩm) |
| Máy chủ thử nghiệm & Cơ sở dữ liệu | 0 | Azure for Students (miễn phí) |
| Công cụ AI hỗ trợ lập trình | 0 | Free tier (Codex, Gemini CLI, Copilot) |
| Tên miền & Dịch vụ phụ trợ | 0 | Subdomain miễn phí |
| Dữ liệu thử và in ấn | 0 | Tài liệu có sẵn, in nội bộ |
| **Tổng ngân sách tiền mặt** | **0** | **Tối ưu toàn diện bằng tài nguyên miễn phí** |

Công sức sinh viên được quản lý bằng giờ-người (900 giờ công) nên chi phí lương trong học phần là 0 VNĐ. Mọi phát sinh chi phí tiền mặt ngoài dự kiến phải được cả nhóm thảo luận và thống nhất trước.

Dự toán chưa gồm máy quét, bản quyền nội dung, tư vấn pháp lý, kiểm thử xâm nhập chuyên nghiệp, hạ tầng vận hành thật và bảo trì. Chi phí thương mại hóa chỉ được xác lập sau khi bản mẫu đạt nghiệm thu và có yêu cầu cụ thể từ thư viện thí điểm.

> Cơ sở ước tính, các kịch bản và quy tắc điều chỉnh xem tại [Ước tính dự án](./LIBIF-Project-Estimation.md).

## 12. Tổ chức, quản trị và bước tiếp theo

- Scrum Master điều phối tiến độ và xử lý trở ngại.
- Nhóm phát triển chịu trách nhiệm kỹ thuật, kiểm thử, triển khai và tài liệu.

Sau khi đề xuất được duyệt, nhóm lập kế hoạch Sprint, triển khai bản mẫu và tái ước tính sau Sprint 1 và Sprint 2. Việc thí điểm hoặc thương mại hóa cần một quyết định riêng dựa trên kết quả nghiệm thu, phản hồi của thủ thư, yêu cầu pháp lý và chi phí vận hành thực tế.

> Quyền hạn phê duyệt và trách nhiệm xem tại [Điều lệ dự án](./LIBIF-Project-Charter.md); cách thực hiện và kiểm soát xem tại [Kế hoạch quản lý dự án](./LIBIF-Project-Planning.md).
