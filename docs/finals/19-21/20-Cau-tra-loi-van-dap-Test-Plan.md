# CÂU TRẢ LỜI VẤN ĐÁP CUỐI KỲ

> Tách từ `19-20-21-Cau-tra-loi-van-dap.md`. Nội dung dựa trên ba PDF lý thuyết và hồ sơ LIBIF trong workspace. Chỉ khẳng định kết quả thực hiện khi có bằng chứng thật.

# 20. KẾ HOẠCH KIỂM THỬ

## 20.1. Trình bày quá trình hình thành Kế hoạch Kiểm thử của nhóm

Kế hoạch Kiểm thử được xây dựng từ QMP và cơ sở kiểm thử, không được viết tách rời các yêu cầu. Quy trình phù hợp cho LIBIF:

1. Thiết lập đường cơ sở cho Tầm nhìn, SOW, Danh sách sản phẩm, kiến trúc, QMP, DoD và rủi ro.
2. Xác định mục tiêu, hạng mục kiểm thử, phạm vi thực hiện, nội dung ngoài phạm vi và các giới hạn.
3. Phân tích rủi ro sản phẩm: phân quyền, lưu trữ mã hóa, phiên đồng thời, OCR, phê duyệt nội dung, tìm kiếm, địa chỉ tài liệu gốc, nhật ký kiểm toán và cài đặt mới.
4. Chọn cấp độ, loại và kỹ thuật kiểm thử: kiểm thử tĩnh, đơn vị, tích hợp, đầu cuối (E2E), bảo mật, hiệu năng, hồi quy và UAT; kết hợp kịch bản định trước với kiểm thử thăm dò.
5. Lập ma trận truy vết giữa yêu cầu, rủi ro và kiểm thử.
6. Chọn môi trường, trình duyệt, dịch vụ, phiên bản công cụ, bộ dữ liệu và căn cứ xác định kết quả mong đợi.
7. Xác định vai trò, công sức, lịch trình, sản phẩm bàn giao, tiêu chí bắt đầu, kết thúc, tạm dừng và tiếp tục.
8. Xác định quy trình xử lý lỗi, mức nghiêm trọng, cách báo cáo và quản lý cấu hình.
9. Rà soát, chạy thử kiểm thử khói hoặc các ca rủi ro cao, sau đó phê duyệt và thiết lập đường cơ sở.
10. Trong quá trình thực thi, theo dõi và kiểm soát; cuối vòng lập Báo cáo Kiểm thử và lưu trữ bằng chứng.

## 20.2. Các câu hỏi chính Kế hoạch Kiểm thử phải trả lời

- Kiểm thử **cái gì** và không kiểm thử cái gì?
- Mục tiêu kiểm thử và rủi ro chất lượng cần giảm là gì?
- Dựa trên yêu cầu, thiết kế và phiên bản nào?
- Chọn cấp độ, loại, kỹ thuật và mức độ tự động hóa nào, vì sao?
- Ai thực hiện, khi nào, cần bao nhiêu công sức, nguồn lực và công cụ nào?
- Môi trường, cấu hình và dữ liệu kiểm thử nào được dùng?
- Kết quả mong đợi và căn cứ xác định lấy từ đâu?
- Khi nào được bắt đầu, tạm dừng, tiếp tục và kết thúc test?
- Lỗi được ghi nhận, phân loại, sàng lọc, kiểm thử lại và đóng như thế nào?
- Theo dõi tiến độ, độ bao phủ và chất lượng bằng chỉ số nào?
- Sản phẩm bàn giao và bằng chứng nào được lưu?
- Ai có quyền quyết định phát hành hay không và chấp nhận rủi ro còn lại?

## 20.3. Đầu vào và các bước tạo Kế hoạch Kiểm thử

### Đầu vào

- Phạm vi dự án, SOW, PBI, câu chuyện người dùng và AC.
- Kiến trúc, giao diện, lược đồ dữ liệu, thiết kế triển khai và các thuộc tính chất lượng.
- QMP, DoD, quy chuẩn lập trình và tiêu chí phát hành.
- Sổ đăng ký rủi ro, ước lượng, lịch trình, nhân sự và giới hạn môi trường.
- Lỗi, dữ liệu lịch sử và bài học từ Sprint trước.
- Quy trình nghiệp vụ của khách hàng, dữ liệu đại diện và kỳ vọng đối với UAT.

### Cách chuyển đầu vào thành kế hoạch

- Yêu cầu cho biết cần xác minh hành vi nào.
- Kiến trúc cho biết điểm tích hợp và rủi ro kỹ thuật nào cần kiểm thử.
- QMP cung cấp mục tiêu chất lượng và ngưỡng.
- Rủi ro quyết định mức ưu tiên và độ sâu kiểm thử.
- Nguồn lực và lịch trình quyết định phạm vi tự động hóa và thứ tự thực thi.
- DoD và yêu cầu chấp nhận quyết định tiêu chí kết thúc.

Sau đó, nhóm rà soát để phát hiện yêu cầu không thể kiểm thử, thiếu căn cứ xác định kết quả đúng, môi trường không khả thi hoặc khoảng trống về độ bao phủ trước khi phê duyệt.

## 20.4. Kế hoạch Kiểm thử được đánh giá thế nào?

Đánh giá theo năm nhóm tiêu chí:

1. **Tính đúng đắn và nhất quán**: đúng phiên bản phần mềm, phạm vi, Danh sách sản phẩm, kiến trúc và QMP.
2. **Tính đầy đủ**: đủ phạm vi, rủi ro, chiến lược, cấp độ và loại kiểm thử, môi trường, dữ liệu, vai trò, lịch trình, tiêu chí, cách xử lý lỗi, cấu hình và báo cáo.
3. **Khả năng truy vết và độ bao phủ**: mọi AC bắt buộc và rủi ro cao đều có ca kiểm thử; mỗi ca có kết quả mong đợi và bằng chứng.
4. **Tính khả thi**: môi trường, công cụ, dữ liệu, kỹ năng và thời gian thực sự sẵn có.
5. **Tính hiệu quả**: khi áp dụng, kế hoạch có tìm được lỗi quan trọng, hỗ trợ kiểm thử lại và kiểm thử hồi quy, đồng thời giúp đưa ra quyết định phát hành đáng tin cậy hay không.

Khi kết thúc kiểm thử, cần so sánh kế hoạch với thực tế; kiểm tra sai lệch, độ bao phủ yêu cầu và rủi ro, lỗi còn mở, tiêu chí kết thúc, rủi ro còn lại và sự chấp nhận của khách hàng. Tỷ lệ đạt cao vẫn chưa đủ nếu các ca rủi ro cao chưa được chạy hoặc nhiều ca bị chặn hay bỏ qua.

## 20.5. Tại sao cần Kế hoạch Kiểm thử?

- Tạo phạm vi và mục tiêu chung, tránh kiểm thử ngẫu nhiên hoặc bỏ sót.
- Ưu tiên công sức theo rủi ro thay vì chia đều cho mọi chức năng.
- Chuẩn bị sớm môi trường, dữ liệu, công cụ và trách nhiệm.
- Xác định tiêu chí khách quan để kết thúc kiểm thử và phát hành.
- Tạo khả năng truy vết và bằng chứng cho lỗi, hoạt động kiểm toán và việc khách hàng chấp nhận sản phẩm.
- Cho phép theo dõi, kiểm soát và cập nhật khi dự án thay đổi.
- Giảm chi phí lỗi bằng cách phối hợp rà soát tĩnh, kiểm thử đơn vị, tích hợp, đầu cuối và UAT.

## 20.6. Kế hoạch Kiểm thử được sử dụng và cập nhật thế nào?

- Dùng trong Lập kế hoạch Sprint để đưa hoạt động kiểm thử vào ước lượng và phân công.
- Dùng khi lập trình để lập trình viên biết yêu cầu về kiểm thử đơn vị, kiểm thử tích hợp và cổng CI.
- Dùng khi thực thi kiểm thử để chọn đúng phiên bản phần mềm, môi trường và dữ liệu, đồng thời ghi kết quả và lỗi.
- Dùng trong họp hằng ngày và sàng lọc lỗi để so sánh kế hoạch với thực tế, xử lý trở ngại và điều chỉnh ưu tiên theo rủi ro.
- Dùng trong Rà soát Sprint và UAT để chứng minh AC và ghi nhận phản hồi.
- Dùng cuối đợt phát hành làm đường cơ sở cho Báo cáo Hoàn thành Kiểm thử và quyết định có phát hành hay không.

Kế hoạch Kiểm thử được cập nhật khi phạm vi, AC, kiến trúc, rủi ro, lịch trình, môi trường, bộ dữ liệu, công cụ hoặc chiến lược tạo bản dựng thay đổi. Mọi thay đổi cần ghi phiên bản, lý do, ảnh hưởng, người phê duyệt và cập nhật ma trận truy vết yêu cầu (RTM). Không được viết ngược kết quả thực tế vào kế hoạch như thể đã dự kiến từ trước; các kết quả này thuộc hồ sơ thực thi và Báo cáo Kiểm thử.

## 20.7. Cách trình bày bộ bằng chứng câu 20

1. Kế hoạch Kiểm thử có phiên bản và đường cơ sở.
2. Quy chuẩn lập trình: cấu hình thật, lệnh chạy và kết quả CI trên mã xác nhận cụ thể.
3. Công cụ theo dõi lỗi: danh sách và chi tiết lỗi có dữ liệu thật, kết quả mong đợi, kết quả thực tế, bằng chứng và lịch sử xử lý.
4. Kiểm thử đơn vị: lệnh chạy, mã xác nhận, phiên bản công cụ, số ca đạt, không đạt hoặc bị bỏ qua, thời lượng, độ bao phủ và báo cáo gốc.
5. Thanh tra mã nguồn: phạm vi, vai trò, phát hiện và bằng chứng xác minh sửa lỗi.
6. Báo cáo Kiểm thử: so sánh kế hoạch với thực tế, RTM, lỗi, tiêu chí kết thúc, rủi ro còn lại và kết luận.
7. Phản hồi khách hàng: kịch bản, phiên bản phần mềm, nhóm người dùng, phản hồi, cách xử lý và xác nhận.

Mọi ảnh chụp phải truy được về sản phẩm gốc; không dùng ảnh chụp màn hình thay cho nhật ký hoặc hồ sơ có thể kiểm tra.

---
