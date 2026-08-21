# BÁO CÁO HOÀN THÀNH KIỂM THỬ — LIBIF

## 1. Identification và executive decision

| Trường | Giá trị |
|---|---|
| Mã báo cáo/phiên bản | `LIBIF-TR-[ ]` |
| Kế hoạch Kiểm thử/version | `[ ]` |
| Bản phát hành/thẻ/mã xác nhận/mã băm ảnh của SUT | `[ ]` |
| Môi trường/bộ dữ liệu/thời gian kiểm thử | `[ ]` |
| Kết luận chung | PASS / PASS WITH ACCEPTED RISK / FAIL / INCOMPLETE |
| Phát hành recommendation | GO / CONDITIONAL GO / NO-GO |

Lý do kết luận (3–5 câu, gắn tiêu chí kết thúc và rủi ro còn lại): `[ĐIỀN]`.

## 2. Phạm vi thực thi và sai lệch

| Kế hoạch hạng mục/type | Kế hoạch | Đã thực hiện | Not executed + reason | Deviation approval |
|---|---:|---:|---|---|
| | | | | |

Mọi thay đổi môi trường/dữ liệu/phạm vi/ngưỡng so với Kế hoạch Kiểm thử phải ghi ảnh hưởng tới độ tin cậy của kết luận.

## 3. Kết quả tổng hợp

| Cấp độ/loại | Tổng | Đạt | Không đạt | Bị chặn | Bỏ qua/Chưa chạy | Tỷ lệ đạt* | Evidence |
|---|---:|---:|---:|---:|---:|---:|---|
| Đơn vị | | | | | | | |
| Tích hợp | | | | | | | |
| E2E/Kiểm thử hồi quy | | | | | | | |
| Bảo mật | | | | | | | |
| Hiệu năng | | | | | | | |
| UAT | | | | | | | |

`Tỷ lệ đạt = Đạt / Đã thực hiện`, ghi rõ Đã thực hiện có/không gồm Bị chặn. Không dùng đạt rate nếu mẫu test/coverage không đại diện.

## 4. Độ bao phủ yêu cầu và rủi ro

| PBI/AC | Risk | Kế hoạch/Đã thực hiện | Trạng thái cuối | Lỗi | Evidence |
|---|---|---:|---|---|---|
| AC-01…AC-08 | | | | | |

| Rủi ro | Biện pháp kiểm thử đã hoàn thành? | Kết quả | Khả năng xảy ra/ảnh hưởng còn lại | Người phụ trách/chấp nhận rủi ro |
|---|---|---|---|---|
| TR-01…TR-08 | | | | |

## 5. Phân tích lỗi

| Mức nghiêm trọng | Đã ghi nhận | Đã đóng | Đã mở lại | Còn mở | Trì hoãn/đã chấp nhận |
|---|---:|---:|---:|---:|---:|
| nghiêm trọng | | | | | |
| cao | | | | | |
| trung bình | | | | | |
| thấp | | | | | |

### Còn mở defects / known limitations

| Mã | Ảnh hưởng/cách khắc phục tạm thời | PBI/người dùng bị ảnh hưởng | Quyết định/rủi ro | Người phụ trách/mục tiêu |
|---|---|---|---|---|
| | | | | |

## 6. Quality objectives và tiêu chí kết thúc

| Objective/criterion | Mục tiêu | Thực tế | Met? | Evidence/lý do |
|---|---:|---:|---|---|
| Must-have AC đạt | 100% | | | |
| nghiêm trọng/cao còn mở | 0 | | | |
| Search p95 on đường cơ sở bộ dữ liệu | < 2s | | | |
| Fresh install | Đạt | | | |
| Danh sách kiểm tra DoD/phát hành | 100% mục bắt buộc | | | |

## 7. Phản hồi khách hàng/UAT

| Session/FB IDs | Chấp nhận | Danh sách sản phẩm/change | Rejected/deferred | Chấp nhận decision |
|---|---:|---:|---:|---|
| | | | | |

## 8. Bài học, hành động tiếp theo và lưu trữ

- Kiểm thử process/effectiveness observations: `[ ]`.
- Nguyên nhân lỗi lọt, kiểm thử thiếu ổn định hoặc sự cố môi trường và CAPA: `[vấn đề, người phụ trách, thời hạn]`.
- Sản phẩm đã lưu trữ: Kế hoạch Kiểm thử, cases, RTM, raw results, logs, screenshots, lỗi export, inspection, phản hồi, config and checksums: `[links]`.

## 9. Xác nhận phê duyệt

| Vai trò | Họ tên | Quyết định | Rủi ro còn lại được chấp nhận | Ngày/link |
|---|---|---|---|---|
| QA/Kiểm thử Lead | | | | |
| Tech Lead | | | | |
| Chủ sản phẩm | | | | |
