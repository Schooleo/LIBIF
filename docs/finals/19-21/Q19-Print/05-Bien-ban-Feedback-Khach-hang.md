# BẢN IN NỘP KÈM — HỒ SƠ TRÌNH DIỄN/UAT VÀ PHẢN HỒI KHÁCH HÀNG LIBIF (DÙNG CHUNG CÂU 19–20)

> **Tình trạng bằng chứng:** repository chưa có phiên UAT với thủ thư/khách hàng thật, chưa có proxy user được ghi nhận và chưa có chữ ký acceptance. Vì vậy không điền giả tên, điểm số hoặc feedback.

## A. Kiểm soát phiên

| Trường | Giá trị |
|---|---|
| Mã hồ sơ | `UAT-EVIDENCE-GAP-2026-08-24` |
| SUT baseline | `dev@82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34 |
| Môi trường có evidence | Local Docker Compose/CI; có live smoke được ghi trong Sprint 5 |
| Người điều phối/ghi biên bản | Chưa ghi nhận |
| Đại diện khách hàng/người dùng | Chưa có record |
| Đồng ý ghi chép/ghi âm | Chưa có record |
| Quyết định acceptance | Chưa thể kết luận |

## B. Kịch bản UAT cần thực hiện

| Mã | Vai trò/công việc | Liên quan | Kết quả mong đợi | Kết quả thực tế được ghi nhận |
|---|---|---|---|---|
| UAT-01 | Thủ thư: upload → OCR → review → approve | AC-01 | Tài liệu đi hết luồng, có trạng thái và approval history | Có processing/approval evidence; chưa có người dùng UAT ký xác nhận |
| UAT-02 | Quản trị: publish/RBAC/concurrent limit | AC-02/03 | Quyền đúng, vượt giới hạn bị chặn, có audit | Có automated/security evidence; chưa có manual UAT record |
| UAT-03 | Độc giả: search → Reader → chuyển trang | AC-04/05 | Tìm đúng kết quả và đọc được trên browser mục tiêu | Có live search/Reader smoke; p95 và browser matrix chưa ghi |
| UAT-04 | Chủ sở hữu: source denial/watermark/audit | AC-06 | Không lộ source PDF; watermark/audit truy vết được | Có security gate; chưa có feedback khách hàng |

## C. Feedback thực tế

| FB ID | Người/role | Kịch bản | Feedback/quan sát | Loại | Trạng thái |
|---|---|---|---|---|---|
| — | — | — | Chưa có phản hồi khách hàng hoặc proxy user trong repository | Chưa có dữ liệu | Cần tổ chức phiên UAT |

Các nhận xét trong Sprint retrospective là **nội bộ nhóm**, không được ghi là feedback khách hàng. Sprint 5 ghi rõ manual review-canvas walkthrough còn thiếu do không có pending-approval row phù hợp.

## D. Việc cần tạo sau phiên UAT

| Việc | Owner | Evidence bắt buộc | Trạng thái |
|---|---|---|---|
| Chốt representative user/proxy user | PO/đại diện nhóm | Tên, vai trò, tổ chức và quyền ghi chép | Chưa thực hiện |
| Chạy UAT-01…04 | QA + user | session ID, build, env, dataset, ảnh/log | Chưa thực hiện |
| Ghi feedback và phân loại | Người ghi biên bản | FB ID, loại, priority, PBI/issue | Chưa thực hiện |
| Chốt acceptance/change/backlog | PO | chữ ký hoặc decision record | Chưa thực hiện |

## E. Kết luận quản lý

Hệ thống có evidence kỹ thuật cho nhiều luồng và gate, nhưng **chưa có bằng chứng phù hợp để gọi là customer acceptance**. Không được dùng hồ sơ này để tuyên bố khách hàng đã chấp nhận sản phẩm. Khi có phiên UAT thật, phải thay phần gap bằng dữ liệu session và giữ lại lịch sử thay đổi.

## F. Xác nhận

| Vai trò | Họ tên | Xác nhận | Ngày/link |
|---|---|---|---|
| Đại diện người dùng/khách hàng | Chưa ghi nhận | Chưa ký | Chưa có |
| Chủ sản phẩm | Chưa ghi nhận | Chưa ký | Chưa có |
| Người ghi biên bản | Chưa ghi nhận | Chưa ký | Chưa có |
