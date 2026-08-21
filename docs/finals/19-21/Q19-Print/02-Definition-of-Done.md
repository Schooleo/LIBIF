# ĐỊNH NGHĨA HOÀN THÀNH — LIBIF

| Phiên bản | Ngày hiệu lực | Đường cơ sở sản phẩm | Người phê duyệt |
|---|---|---|---|
| `[ ]` | `[ ]` | `[ ]` | `[Scrum Team/PO]` |

DoD là tiêu chuẩn chung cho Phần tăng trưởng. Tiêu chí chấp nhận cho biết xây đúng câu chuyện người dùng nào; DoD xác nhận Phần tăng trưởng đạt mức chất lượng chung. PBI chưa đạt toàn bộ mục bắt buộc không được tính Done và quay lại Danh sách sản phẩm.

## Danh sách kiểm tra bắt buộc cho mỗi PBI/Phần tăng trưởng

### Yêu cầu và traceability

- [ ] PBI/AC rõ, được PO xác nhận; liên kết tới thiết kế, rủi ro, kiểm thử và lỗi liên quan.
- [ ] phạm vi và ngoài phạm vi và thay đổi đã được ghi nhận; không còn giả định quan trọng chưa xác minh.

### Mã nguồn và cấu hình

- [ ] Mã nguồn đã merge qua PR vào nhánh chuẩn; không commit secret hay dữ liệu nhạy cảm.
- [ ] Tạo bản dựng, lint, formatter check và TypeScript type-check đều đạt trên CI.
- [ ] Ít nhất 01 người rà soát độc lập phê duyệt; phát hiện mức cao/nghiêm trọng đã đóng.
- [ ] Migration/config/API contract/README được cập nhật khi thay đổi ảnh hưởng chúng.

### Kiểm thử

- [ ] Kiểm thử đơn vị cho logic mới/thay đổi đạt; test phải có assertion có ý nghĩa.
- [ ] Kiểm thử tích hợp, E2E và bảo mật tương ứng với rủi ro và AC đều đạt trên đường cơ sở.
- [ ] Kiểm thử hồi quy liên quan đạt; ca thiếu ổn định hoặc bị bỏ qua phải có vấn đề, người phụ trách và hạn xử lý.
- [ ] Độ bao phủ không giảm dưới đường cơ sở đã phê duyệt; ngoại lệ phải có quyết định chấp nhận rủi ro.
- [ ] Lỗi nghiêm trọng/cao liên quan = 0 còn mở; lỗi còn lại có quyết định và rủi ro còn lại.

### Chất lượng đặc thù của LIBIF

- [ ] Upload kiểm tra type/size và xử lý lỗi an toàn; OCR job có trạng thái/retry/log phù hợp.
- [ ] Dữ liệu xuất bản đã qua con người rà soát; độ chính xác OCR thô không bị trình bày như độ chính xác sau rà soát.
- [ ] RBAC/object authorization được test cả positive và negative cases.
- [ ] Dữ liệu lưu kho dùng cơ chế AES-GCM đã thiết kế; key/secret không nằm trong source/log.
- [ ] Giới hạn concurrent session được test điều kiện cạnh tranh.
- [ ] UI không công khai URL file gốc; tuyên bố bảo vệ chỉ đúng phạm vi SOW, không tuyên bố “không thể sao chép tuyệt đối”.
- [ ] Watermark/audit không làm lộ dữ liệu nhạy cảm quá mức; audit record đúng trường và truy vết được.

### Triển khai, nghiệm thu và bằng chứng

- [ ] Triển khai được lên môi trường thử nghiệm bằng hướng dẫn/versioned configuration.
- [ ] PO kiểm tra AC trên môi trường thử nghiệm; phản hồi đã ghi và phân loại.
- [ ] Evidence có commit/build, môi trường, date, executor và link artifact.
- [ ] Phần tăng trưởng tích hợp với phần đã Done trước đó và ở trạng thái usable/demoable.

## DoD bổ sung cho Phát hành

- [ ] AC-01…AC-08 trong SOW đã có kết quả và bằng chứng.
- [ ] Kiểm thử hồi quy đầy đủ/cài đặt mới đạt; Báo cáo Kiểm thử được phê duyệt.
- [ ] Số lỗi nghiêm trọng/cao còn mở bằng 0; lỗi trung bình/thấp còn mở phải có người phụ trách hoặc quyết định chấp nhận rủi ro.
- [ ] các giới hạn đã biết, trình diễn quay lui/sao lưu và ghi chú phát hành hoàn tất.
- [ ] Phản hồi khách hàng/UAT được xử lý thành Chấp nhận / Danh sách sản phẩm / Change request / Từ chối kèm lý do.
- [ ] Phát hành/tag bất biến được tạo; checksum/artifact/link được lưu.

## Quy tắc thay đổi DoD

Thay đổi qua Cải tiến Sprint/rà soát chất lượng; ghi lý do, ảnh hưởng tới hạng mục đang làm, approver và ngày hiệu lực. Không hạ DoD hồi tố để biến một hạng mục chưa đạt thành Done.
