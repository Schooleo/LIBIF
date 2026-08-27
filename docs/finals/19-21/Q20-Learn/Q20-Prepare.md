# Q20-Prepare — Chuẩn bị vấn đáp về Kế hoạch Kiểm thử

## Khung trả lời 20–40 giây

1. Nêu quyết định kiểm thử.
2. Liên hệ một rủi ro hoặc AC của LIBIF.
3. Nói bằng chứng và giá trị đối với quyết định phát hành.

Điểm neo cần nhớ:

    Cơ sở kiểm thử → rủi ro → chiến lược → ca kiểm thử
    → môi trường/dữ liệu → thực thi → lỗi → báo cáo

## Câu hỏi có thể được hỏi

### 1. Kế hoạch Kiểm thử phải trả lời gì?

**Trả lời:** Kiểm thử cái gì và không kiểm thử gì; mục tiêu/rủi ro nào; dựa trên phiên bản yêu cầu nào; dùng cấp độ, loại và kỹ thuật nào; ai làm, khi nào, ở môi trường và dữ liệu nào; tiêu chí bắt đầu/kết thúc; lỗi và bằng chứng được quản lý ra sao.

### 2. Đầu vào để tạo Kế hoạch Kiểm thử là gì?

**Trả lời:** SOW, PBI, AC, kiến trúc, giao diện/lược đồ, QMP, DoD, tiêu chí phát hành, Sổ đăng ký Rủi ro, lịch trình, nhân sự, môi trường và bài học từ Sprint trước.

### 3. Nhóm chuyển đầu vào thành kế hoạch thế nào?

**Trả lời:** Yêu cầu xác định hành vi cần kiểm chứng; kiến trúc chỉ ra điểm tích hợp; QMP cung cấp mục tiêu/ngưỡng; rủi ro quyết định ưu tiên; nguồn lực quyết định mức tự động hóa; DoD và yêu cầu nghiệm thu quyết định tiêu chí kết thúc.

### 4. Kế hoạch Kiểm thử được đánh giá thế nào?

**Trả lời:** Kiểm tra tính đúng, đầy đủ, truy vết, khả thi và hiệu quả. Mọi AC bắt buộc/rủi ro cao phải có ca kiểm thử, kết quả mong đợi và bằng chứng trên đúng phiên bản, môi trường và dữ liệu.

### 5. Tại sao cần Kế hoạch Kiểm thử?

**Trả lời:** Để tránh kiểm thử ngẫu nhiên hoặc bỏ sót; ưu tiên công sức theo rủi ro; chuẩn bị nguồn lực; phân trách nhiệm; xác định tiêu chí kết thúc và tạo bằng chứng cho nghiệm thu/phát hành.

### 6. Kế hoạch được sử dụng khi nào?

**Trả lời:** Dùng khi lập kế hoạch Sprint, phát triển, thực thi kiểm thử, họp hằng ngày, sàng lọc lỗi, UAT và quyết định phát hành. Báo cáo Kiểm thử dùng kế hoạch làm đường cơ sở để so sánh thực tế.

### 7. Khi nào phải cập nhật kế hoạch?

**Trả lời:** Khi phạm vi, AC, kiến trúc, rủi ro, lịch trình, môi trường, dữ liệu, công cụ hoặc chiến lược tạo bản dựng thay đổi. Mọi thay đổi phải ghi phiên bản, lý do, ảnh hưởng, người duyệt và cập nhật RTM.

### 8. Vì sao phải kiểm thử dựa trên rủi ro?

**Trả lời:** Thời gian hữu hạn nên không thể kiểm thử mọi thứ sâu như nhau. LIBIF ưu tiên phân quyền, mã hóa, phiên đồng thời, OCR, tìm kiếm và nhật ký kiểm toán vì lỗi ở đây có ảnh hưởng cao.

### 9. Kết quả mong đợi được lấy từ đâu?

**Trả lời:** Từ AC, đặc tả, thiết kế, quy tắc nghiệp vụ, dữ liệu chuẩn hoặc quyết định đã được PO phê duyệt. Không có căn cứ đúng thì kết quả đạt/không đạt sẽ mang tính chủ quan.

### 10. Tiêu chí bắt đầu và kết thúc là gì?

**Trả lời:** Tiêu chí bắt đầu bảo đảm bản dựng, môi trường, dữ liệu và ca kiểm thử đã sẵn sàng. Tiêu chí kết thúc thường yêu cầu AC bắt buộc và kiểm thử rủi ro cao đã chạy, không còn lỗi nghiêm trọng/cao và rủi ro còn lại đã được chấp nhận.

### 11. Khi nào tạm dừng và tiếp tục kiểm thử?

**Trả lời:** Tạm dừng khi bản dựng không thể kiểm thử, môi trường/dữ liệu sai hoặc lỗi chặn làm kết quả mất tin cậy. Tiếp tục khi nguyên nhân đã sửa, bản dựng mới được định danh và kiểm thử khói đạt.

### 12. Tỷ lệ ca đạt cao có chứng minh chất lượng không?

**Trả lời:** Không. Phải xem độ bao phủ yêu cầu/rủi ro, số ca bị chặn/bỏ qua, lỗi còn mở và mức đại diện của dữ liệu. Nhiều ca dễ đạt không bù được một luồng rủi ro cao chưa kiểm thử.

### 13. Phân biệt Kế hoạch Kiểm thử và Báo cáo Kiểm thử?

**Trả lời:** Kế hoạch mô tả dự định, phạm vi, chiến lược và tiêu chí trước khi thực hiện. Báo cáo ghi kết quả thực tế, sai lệch, lỗi, độ bao phủ, rủi ro còn lại và khuyến nghị phát hành.

### 14. Bộ bằng chứng câu 20 cần gì?

**Trả lời:** Kế hoạch có phiên bản; cấu hình quy chuẩn lập trình và CI; dữ liệu lỗi thật; kết quả kiểm thử đơn vị; biên bản thanh tra mã; Báo cáo Kiểm thử; phản hồi khách hàng. Mỗi bằng chứng phải truy được tới phiên bản phần mềm gốc.

## Điều không nên nói

- Không nói tỷ lệ đạt cao đồng nghĩa phần mềm không còn lỗi.
- Không gọi kết quả thực tế là nội dung dự kiến của kế hoạch.
- Không dùng ảnh chụp màn hình thay hoàn toàn cho nhật ký hoặc hồ sơ gốc.
- Không bỏ qua ca rủi ro cao chỉ để đạt tiêu chí số lượng.
