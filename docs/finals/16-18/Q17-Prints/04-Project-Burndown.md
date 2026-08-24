# BIỂU ĐỒ CÔNG VIỆC CÒN LẠI CỦA TOÀN DỰ ÁN

> **Kịch bản giả lập để luyện trình bày — không phải số liệu Trello hoặc nghiệm thu đã xác nhận.** Bảng dưới đây được dựng theo đường cơ sở 136 SP và trạng thái công việc chuyển tiếp của dự án. Khi nộp chính thức, phải thay bằng lịch sử nghiệm thu thực tế.

## Dữ liệu và công thức tính

Kế hoạch dự án xác định đường cơ sở **136 SP** cho 16 PBI và 3 hạng mục hỗ trợ. Theo phân bổ 26, 28, 29, 29 và 24 SP trong năm Sprint, số điểm còn lại theo kế hoạch là:

| Mốc | Số điểm còn lại theo kế hoạch (SP) | Phạm vi hiện tại (SP) | Số điểm nghiệm thu trong Sprint (SP) | Số điểm còn lại thực tế (SP) |
|---|---:|---:|---:|---:|
| Trước S1 | 136 | 136 | 0 | 136 |
| Cuối S1 — 20/07/2026 | 110 | 136 | 22 | 114 |
| Cuối S2 — 21/07/2026 | 82 | 136 | 28 | 86 |
| Cuối S3 — 22/07/2026 | 53 | 141 | 30 | 61 |
| Cuối S4 — 23/07/2026 | 24 | 141 | 28 | 33 |
| Cuối S5 — 24/07/2026 | 0 | 141 | 20 | 13 |

`Số điểm còn lại thực tế = phạm vi đã duyệt hiện tại − số điểm của PBI đã được Chủ sở hữu sản phẩm nghiệm thu`.

## Giải thích số liệu giả lập

- S1–S5 lần lượt nghiệm thu 22, 28, 30, 28 và 20 SP; tổng cộng 128 SP được chấp nhận.
- Cuối S3 giả định có yêu cầu thay đổi làm phạm vi tăng từ 136 lên **141 SP**; vì vậy đường thực tế không giảm theo đường kế hoạch dù Sprint vẫn nghiệm thu thêm 30 SP.
- Cuối S5 còn **13 SP công việc chuyển tiếp**, phù hợp với phần hoàn thiện chưa đóng trong báo cáo Sprint.
- Công thức kiểm tra: `số điểm còn lại thực tế = phạm vi hiện tại − tổng số điểm đã nghiệm thu lũy kế`.

## Phân biệt với dữ liệu của dự án

Ảnh Trello có 17 thẻ `Done`, 5 thẻ `Product Backlog` và 0 thẻ ở `Sprint Backlog`, `In Progress`, `Review`. Đây là số thẻ trên giao diện; thẻ có thể là PBI hoặc nhiệm vụ và không có đủ lịch sử nghiệm thu để đưa vào biểu đồ thực tế. Tương tự, 31 bản ghi thời gian/68:10 là công sức thực tế, không phải SP.

## Kết luận quản lý dự án

Kịch bản cho thấy cách đọc chênh lệch giữa đường kế hoạch và đường thực tế, tác động của thay đổi phạm vi và công việc chuyển tiếp. Các giá trị trên chỉ dùng để minh họa cách tính; kho mã hiện vẫn chưa có lịch sử điểm câu chuyện được Chủ sở hữu sản phẩm nghiệm thu theo từng Sprint. Khi có dữ liệu thật, trưởng nhóm thay toàn bộ bảng giả lập bằng lịch sử nghiệm thu và lịch sử thay đổi đã xác nhận.

Nguồn: [Kế hoạch dự án](../../../markdowns-vi-v2/LIBIF-Project-Planning.md), ảnh Trello và tệp PDF ghi nhận thời gian trong thư mục hồ sơ.
