# BIÊN BẢN THANH TRA MÃ NGUỒN — LIBIF

## A. Thông tin phiên

| Trường | Giá trị |
|---|---|
| Inspection ID / Ngày giờ | `CI-[ ]` / `[ ]` |
| PBI/PR/commit | `[ ]` / `[URL]` / `[full SHA]` |
| Mô-đun/tệp/số dòng mã thay đổi | `[ ]` |
| Mục tiêu/rủi ro | `[ ]` |
| Tác giả | `[ ]` |
| Điều phối viên / Người đọc / Người ghi biên bản / Người thanh tra | `[ ]` |
| Pre-check bằng chứng | build `[ ]`; lint `[ ]`; tests `[ ]` |

## B. Danh sách kiểm tra đầu vào

- [ ] Phạm vi nhỏ và phần mã thay đổi ổn định; tác giả đã tự rà soát.
- [ ] Yêu cầu/AC/thiết kế/rủi ro có sẵn; build/static checks đạt hoặc lỗi đã biết.
- [ ] Người rà soát độc lập với tác giả; phạm vi nhạy cảm về bảo mật có người rà soát phù hợp.

## C. Danh sách kiểm tra thanh tra

- [ ] Tính đúng đắn: code đáp ứng AC, boundary/error/state/concurrency đúng.
- [ ] Thiết kế: dependency/module responsibility/API/schema nhất quán kiến trúc.
- [ ] Khả năng bảo trì: naming, duplication, complexity, dead code, comments có lý do.
- [ ] Loại/error/logging: không nuốt lỗi; log có context nhưng không lộ secret/PII.
- [ ] Bảo mật: input/upload validation; authn + object-level authz; injection/path traversal; secret/key/nonce; crypto API; rate/abuse; audit.
- [ ] Dữ liệu/xử lý đồng thời: transaction, idempotency, Redis lock/atomicity, retry/timeout.
- [ ] Chất lượng kiểm thử: phép khẳng định có ý nghĩa, trường hợp đúng/sai/biên, tính xác định và dọn dẹp dữ liệu.
- [ ] Vận hành: configuration, migration, observability, backward compatibility/rollback.

## D. Các phát hiện

| Phát hiện ID | File:line / symbol | Phân loại | Mức nghiêm trọng | Quan sát + violated criterion | Hành động đề xuất | Người phụ trách | Thời hạn | Trạng thái / mã xác nhận sửa lỗi | Xác minh |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

Mức nghiêm trọng: nghiêm trọng/mức cao/Minor/Quan sát. Đây là severity của inspection phát hiện, không tự động đồng nhất lỗi severity.

## E. Kết luận và follow-up

| Chỉ số | Giá trị |
|---|---:|
| Preparation / meeting / rework time | `[ ] / [ ] / [ ]` |
| Các phát hiện nghiêm trọng/mức cao/Minor | `[ ] / [ ] / [ ]` |
| Quyết định | Chấp nhận / Chấp nhận sau khi làm lại / Yêu cầu thanh tra lại / Từ chối |
| Còn mở action IDs | `[ ]` |

Điều phối viên chỉ đóng phiên sau khi kiểm tra mã xác nhận sửa lỗi và cập nhật từng phát hiện. Đính kèm PR phần mã thay đổi, CI log và ảnh/bản xuất phê duyệt; không chỉ chụp màn hình cuộc họp.

| Vai trò | Họ tên | Xác nhận | Ngày |
|---|---|---|---|
| Tác giả | | | |
| Điều phối viên | | | |
| Inspector | | | |
