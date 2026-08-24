# KẾ HOẠCH DỰ ÁN CẬP NHẬT THEO DỮ LIỆU THỰC TẾ

| Thuộc tính | Giá trị cập nhật |
|---|---|
| Dự án | LIBIF — Hệ thống Thư viện Số |
| Phương pháp | Scrum |
| Trưởng nhóm | Lê Nguyễn Nhật Trường |
| Công cụ | Trello; Pull Request/commit; kiểm tra mã, kiểm thử, dựng bản build, kiểm thử đầu cuối và kiểm tra nhanh theo mô-đun |
| Đường cơ sở tham chiếu | 16 PBI + 3 hạng mục hỗ trợ, tổng 136 SP |
| Nhịp thực hiện trong hồ sơ | Năm Sprint hằng ngày: 20–24/07/2026 |

## Quy trình quản lý công việc

1. **Lập kế hoạch:** chọn PBI/mô-đun từ danh sách công việc sản phẩm; ghi mục tiêu Sprint, người phụ trách, hạn hoàn thành, tiêu chí nghiệm thu và bằng chứng.
2. **Thực hiện:** người phụ trách làm việc; Agent hỗ trợ phân rã, tạo khung mã, kiểm thử hoặc tài liệu khi được yêu cầu.
3. **Theo dõi:** cập nhật Trello, Pull Request/commit, trở ngại, quan hệ phụ thuộc và bản ghi thời gian.
4. **Đánh giá:** rà soát phần thay đổi và chạy cổng kiểm tra phù hợp: kiểm tra mã, dựng bản build, kiểm thử đơn vị/API/web, kiểm thử đầu cuối, tác vụ nền/OCR hoặc kiểm tra nhanh.
5. **Nghiệm thu:** chỉ tính PBI hoàn thành khi đạt tiêu chí hoàn tất và có bằng chứng nghiệm thu; Agent không tự chuyển thẻ sang `Done`.
6. **Kiểm soát:** ghi nhận thay đổi, làm lại và công việc chuyển tiếp; chia nhỏ, làm việc theo cặp, đổi người phụ trách hoặc hoãn phần ưu tiên thấp khi công sức bị lệch.

## Đối chiếu năm Sprint đã ghi nhận

| Sprint | Phạm vi chính | Mốc | Bằng chứng |
|---|---|---|---|
| S1 | Kiểm tra kiến trúc, hệ thống thiết kế, khung ứng dụng và xác thực | 20/07 | Báo cáo Sprint ngày 20/07/2026 |
| S2 | Trình đọc/quyền truy cập, danh mục, xử lý/thông báo và bảng điều khiển | 21/07 | Báo cáo Sprint ngày 21/07/2026 |
| S3 | Vòng đời tài liệu, lưu trạng thái trình đọc, quy trình và phân loại | 22/07 | Báo cáo Sprint ngày 22/07/2026 |
| S4 | Vòng lặp OCR/nghiệm thu thực tế, trình đọc được bảo vệ và bảo mật | 23/07 | Báo cáo Sprint ngày 23/07/2026 |
| S5 | Hoàn tất quản trị/bảo mật và hoàn thiện đợt 8 | 24/07 | Báo cáo Sprint ngày 24/07/2026 |

## Cách kiểm soát thay đổi

Phạm vi tăng không kiểm soát phải được ghi thành yêu cầu thay đổi hoặc hạng mục trong danh sách công việc, sau đó đánh giá tác động đến SP, công sức, hạn hoàn thành và mục tiêu Sprint. Công sức tăng không kiểm soát được đối chiếu bằng bản ghi thời gian, trở ngại và chênh lệch ước lượng; nhóm xử lý bằng ước lượng lại, chia nhiệm vụ hoặc điều phối lại. Khi chưa đạt tiêu chí hoàn tất, phần việc quay về danh sách công việc sản phẩm thay vì kéo dài hạn hoặc báo `Done`.

Nguồn đối chiếu: [Kế hoạch dự án](../../../markdowns-vi-v2/LIBIF-Project-Planning.md), [Theo dõi dự án](../../../markdowns-vi-v2/LIBIF-Project-Monitoring.md), [Sổ đăng ký Sprint](../../../../ai_artifacts/sprints/README.md).
