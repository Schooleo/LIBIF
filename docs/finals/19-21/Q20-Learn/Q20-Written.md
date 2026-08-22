# Q20-Written — Kế hoạch Kiểm thử của LIBIF

> Bản viết tay trong khoảng 10 phút: vẽ luồng hình thành, sau đó trình bày cách đánh giá.

## Mô hình cần vẽ

    Yêu cầu + Kiến trúc + QMP + DoD + Rủi ro
                         │
                         ▼
           Phạm vi và mục tiêu kiểm thử
                         │
                         ▼
       Rủi ro → cấp độ/loại/kỹ thuật ưu tiên
                         │
                         ▼
    Môi trường + dữ liệu + vai trò + lịch + tiêu chí
                         │
                         ▼
       Thực thi → lỗi → kiểm thử lại → báo cáo

## 1. Quá trình hình thành Kế hoạch Kiểm thử

1. **Thiết lập cơ sở kiểm thử:** Tầm nhìn, SOW, PBI, AC, kiến trúc, QMP, DoD và Sổ đăng ký Rủi ro.
2. **Xác định mục tiêu và phạm vi:** chức năng nào được kiểm thử, nội dung ngoài phạm vi và các giới hạn.
3. **Phân tích rủi ro sản phẩm:** ưu tiên phân quyền, lưu trữ mã hóa, phiên đồng thời, OCR, tìm kiếm, địa chỉ tài liệu gốc, nhật ký kiểm toán và cài đặt mới.
4. **Chọn chiến lược kiểm thử:** rà soát tĩnh; kiểm thử đơn vị, tích hợp, E2E, bảo mật, hiệu năng, hồi quy và UAT; kết hợp kịch bản định trước với kiểm thử thăm dò.
5. **Lập ma trận truy vết:** liên kết `yêu cầu → rủi ro → ca kiểm thử → kết quả → lỗi → bằng chứng`.
6. **Chuẩn bị thực thi:** xác định môi trường, trình duyệt, dịch vụ, phiên bản công cụ, bộ dữ liệu và căn cứ xác định kết quả đúng.
7. **Lập kế hoạch quản lý:** phân vai, công sức, lịch trình, sản phẩm bàn giao; đặt tiêu chí bắt đầu, kết thúc, tạm dừng và tiếp tục.
8. **Quy định xử lý lỗi:** cách ghi lỗi, mức nghiêm trọng, sàng lọc, sửa, kiểm thử lại, kiểm thử hồi quy và đóng lỗi.
9. **Rà soát và phê duyệt:** chạy thử kiểm thử khói hoặc ca rủi ro cao rồi thiết lập đường cơ sở.
10. **Theo dõi:** so sánh kế hoạch với thực tế, cập nhật khi yêu cầu hoặc rủi ro thay đổi và lập Báo cáo Kiểm thử cuối vòng.

## 2. Phương pháp đánh giá Kế hoạch Kiểm thử

- **Đúng và nhất quán:** đúng phạm vi, phiên bản phần mềm, kiến trúc và QMP.
- **Đầy đủ:** có phạm vi, rủi ro, chiến lược, môi trường, dữ liệu, vai trò, lịch, tiêu chí và quy trình lỗi.
- **Truy vết và bao phủ:** mọi AC bắt buộc và rủi ro cao đều có ca kiểm thử, kết quả mong đợi và bằng chứng.
- **Khả thi:** công cụ, kỹ năng, dữ liệu, môi trường và thời gian thực sự sẵn có.
- **Hiệu quả:** phát hiện được lỗi quan trọng, hỗ trợ kiểm thử lại/hồi quy và giúp đưa ra quyết định phát hành đáng tin cậy.

Khi kết thúc, phải đối chiếu kế hoạch với thực tế, độ bao phủ, lỗi còn mở, tiêu chí kết thúc và rủi ro còn lại. **Tỷ lệ đạt cao không đủ** nếu ca rủi ro cao chưa chạy hoặc nhiều ca bị chặn.

## 3. Tại sao LIBIF cần Kế hoạch Kiểm thử?

Kế hoạch giúp thống nhất phạm vi, ưu tiên công sức theo rủi ro, chuẩn bị môi trường và dữ liệu sớm, phân công rõ trách nhiệm, tạo tiêu chí kết thúc khách quan và cung cấp bằng chứng cho nghiệm thu/phát hành.

**Kết luận:** Kế hoạch Kiểm thử nối yêu cầu và rủi ro với ca kiểm thử và bằng chứng; nó được cập nhật có kiểm soát nhưng không được viết ngược kết quả thực tế vào kế hoạch.
