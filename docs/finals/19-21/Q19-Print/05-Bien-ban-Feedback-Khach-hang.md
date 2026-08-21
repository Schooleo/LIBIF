# BIÊN BẢN TRÌNH DIỄN/UAT VÀ PHẢN HỒI KHÁCH HÀNG — LIBIF

## A. Thông tin chung

| Trường | Giá trị |
|---|---|
| Mã phiên / Ngày giờ / Địa điểm | `[ ]` |
| Phiên bản sản phẩm/mã xác nhận + môi trường | `[ ]` |
| Người điều phối / Người ghi biên bản | `[ ]` |
| Đại diện khách hàng/người dùng, vai trò, tổ chức | `[ ]` |
| Đồng ý ghi chép/ghi âm | `[Có/Không; tham chiếu]` |

Nếu PO sinh viên đóng vai người dùng đại diện do chưa có thủ thư thật, phải ghi rõ “proxy user”; không ghi là “khách hàng thật”.

## B. Mục tiêu, chương trình và kịch bản

| Mã kịch bản | Vai trò/công việc | PBI/AC | Dữ liệu kiểm thử | Kết quả mong đợi | Thực tế | Evidence |
|---|---|---|---|---|---|---|
| UAT-01 | Thủ thư: upload→OCR→review→approve | AC-01 | | | | |
| UAT-02 | Quản trị: publish/RBAC/concurrent limit | AC-02/03 | | | | |
| UAT-03 | Độc giả: search→reader | AC-04/05 | | | | |
| UAT-04 | Chủ sở hữu: URL/watermark/audit | AC-06 | | | | |

## C. Quan sát và phản hồi

| FB ID | Người/role | Kịch bản | Phản hồi/quan sát (nguyên văn ngắn hoặc paraphrase được xác nhận) | Loại | Ảnh hưởng/mức ưu tiên | Phản hồi của nhóm |
|---|---|---|---|---|---|---|
| | | | | Lỗi / Thay đổi / Trải nghiệm người dùng / Câu hỏi / Tích cực | | |

## D. Quyết định chuyển hóa thành công việc

| FB ID | Cách xử lý | PBI/lỗi/change ID | Người phụ trách | Thời hạn/Sprint | Tiêu chí chấp nhận | Trạng thái |
|---|---|---|---|---|---|---|
| | Chấp nhận ngay / Danh sách sản phẩm / Từ chối / Trùng lặp / Cần nghiên cứu | | | | | |

Mọi “Từ chối/Trì hoãn” phải có lý do. Feedback không tự động làm đổi đường cơ sở; thay đổi vượt phạm vi qua kiểm soát thay đổi.

## E. Đánh giá và chấp nhận

| Câu hỏi | Điểm/câu trả lời | Ghi chú |
|---|---|---|
| Luồng có giải quyết đúng công việc không? | `[ ]` | |
| Dễ hiểu/thao tác? | `[ ]` | |
| Kết quả/dữ liệu có đáng tin? | `[ ]` | |
| Rủi ro/giới hạn nào không chấp nhận? | `[ ]` | |
| Quyết định | Chấp nhận / Conditionally accept / Từ chối | Điều kiện `[ ]` |

## F. Xác nhận

| Vai trò | Họ tên | Xác nhận nội dung | Ngày/link |
|---|---|---|---|
| Đại diện người dùng/khách hàng | | | |
| Chủ sản phẩm | | | |
| Người ghi biên bản | | | |
