# Q19-Prepare — Chuẩn bị vấn đáp về Quản lý Chất lượng

## Khung trả lời 20–40 giây

1. Trả lời trực tiếp khái niệm hoặc quyết định.
2. Nêu một dẫn chứng cụ thể của LIBIF.
3. Kết luận giá trị đối với chất lượng hoặc rủi ro.

Điểm neo cần nhớ:

    Đối tượng → đặc tính → chỉ số → cách đo → ngưỡng
              → QA/QC → bằng chứng → đánh giá → cải tiến

## Câu hỏi có thể được hỏi

### 1. QMP phải trả lời những câu hỏi nào?

**Trả lời:** Quản lý chất lượng cho đối tượng nào; đặc tính nào quan trọng; đo bằng chỉ số, nguồn dữ liệu và ngưỡng nào; ai phụ trách; hoạt động QA/QC nào được áp dụng; bằng chứng lưu ở đâu; sai lệch và thay đổi được xử lý thế nào.

### 2. Đầu vào để lập QMP là gì?

**Trả lời:** Tầm nhìn và Phạm vi, SOW, Danh sách sản phẩm, AC, kiến trúc, kế hoạch dự án, DoD, quy chuẩn lập trình, rủi ro và dữ liệu lịch sử về lỗi, kiểm thử, rà soát và phản hồi.

### 3. QMP được đánh giá thế nào?

**Trả lời:** Đánh giá tài liệu có đúng, đủ, rõ, đo được và truy vết được không; kế hoạch có khả thi không; khi áp dụng có ngăn lỗi, phát hiện lỗi sớm và giúp đạt AC, DoD, tiêu chí phát hành hay không.

### 4. Tại sao cần QMP?

**Trả lời:** QMP chuyển chất lượng từ cảm tính thành tiêu chí đo được, thống nhất trách nhiệm, phòng ngừa lỗi, hỗ trợ nghiệm thu và cung cấp bằng chứng để cải tiến.

### 5. QMP được sử dụng và cập nhật khi nào?

**Trả lời:** QMP được dùng trong làm rõ yêu cầu, lập kế hoạch Sprint, phát triển, kiểm thử, UAT, phát hành và Cải tiến Sprint. Cập nhật khi phạm vi, kiến trúc, rủi ro, chỉ số, ngưỡng, công cụ hoặc vai trò thay đổi.

### 6. QA khác QC thế nào?

**Trả lời:** QA thiên về phòng ngừa lỗi trong quy trình, ví dụ quy chuẩn lập trình, đào tạo, DoD và cổng CI. QC thiên về phát hiện lỗi trong sản phẩm, ví dụ thanh tra, phân tích tĩnh, kiểm thử và UAT.

### 7. McCall và ISO 9126 hỗ trợ thế nào?

**Trả lời:** Hai mô hình cung cấp hệ thống đặc tính chất lượng để nhóm không bỏ sót yêu cầu phi chức năng. Nhóm dùng chúng để ánh xạ `yêu cầu → đặc tính → chỉ số → kiểm thử`, nhưng ngưỡng vẫn phải chọn theo bối cảnh và rủi ro LIBIF.

### 8. Định tính khác định lượng thế nào?

**Trả lời:** Định tính mô tả cảm nhận và nguyên nhân, như “giao diện khó hiểu”. Định lượng dùng số để so sánh, như p95 là 1,8 giây hoặc 48/50 ca đạt. Hai loại bổ sung cho nhau.

### 9. Đo chất lượng sản phẩm, quy trình và con người ra sao?

**Trả lời:** Sản phẩm đo bằng AC, lỗi, hiệu năng và độ bao phủ; quy trình đo bằng thời gian chu trình, tỷ lệ mở lại lỗi và việc làm lại; con người đánh giá qua năng lực, đào tạo, cộng tác và phản hồi đồng cấp. Không dùng riêng số dòng mã hay số lần xác nhận mã để đánh giá cá nhân.

### 10. Làm sao hạn chế tài liệu sai yêu cầu khách hàng?

**Trả lời:** Khai thác yêu cầu bằng phỏng vấn, hội thảo và quan sát; dùng bản mẫu, ca sử dụng và tiêu chí chấp nhận; rà soát với khách hàng/PO; duy trì truy vết và quản lý thay đổi.

### 11. Làm sao hạn chế mã nguồn sai thiết kế?

**Trả lời:** Rà soát kiến trúc, quy định mô-đun và hợp đồng API; áp dụng quy chuẩn lập trình, phân tích tĩnh, kiểm tra kiểu, rà soát yêu cầu hợp nhất mã và kiểm thử kiến trúc/hồi quy.

### 12. Làm sao hạn chế phần mềm sai yêu cầu?

**Trả lời:** Viết AC có thể kiểm thử; thiết kế kiểm thử sớm; kết hợp kiểm thử đơn vị, tích hợp, E2E, bảo mật, hồi quy và UAT; ưu tiên theo rủi ro; theo dõi lỗi tới khi sửa và kiểm thử lại.

## Điều không nên nói

- Không nói QMP chỉ là danh sách kiểm thử hoặc chỉ thuộc trách nhiệm của QA.
- Không kết luận chất lượng khi chưa có yêu cầu, ngưỡng và bằng chứng.
- Không nói mô hình McCall hoặc ISO tự cung cấp ngưỡng chung cho mọi dự án.
- Không hạ ngưỡng hồi tố chỉ để biến kết quả không đạt thành đạt.
