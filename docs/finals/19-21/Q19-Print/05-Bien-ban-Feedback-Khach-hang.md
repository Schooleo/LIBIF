# BẢN IN NỘP KÈM — HỒ SƠ TRÌNH DIỄN/UAT VÀ PHẢN HỒI NGƯỜI DÙNG LIBIF (DÙNG CHUNG CÂU 19–20)

> **Tình trạng bằng chứng:** repository chưa có phiên UAT với thủ thư/khách hàng thật, chưa có proxy user được ghi nhận và chưa có chữ ký acceptance. Vì vậy không điền giả tên, điểm số hoặc feedback.

> **Kế hoạch bổ sung:** nhóm sẽ tổ chức một phiên đánh giá hồi cứu prototype với Product Owner làm đại diện người dùng nội bộ (proxy user). Phiên này chưa diễn ra; mọi trường về thời gian, kết quả, feedback, quyết định và chữ ký phải được điền sau khi hoạt động thực tế hoàn thành.

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

## D. Phân công cho phiên feedback sẽ thực hiện

| Thành viên | Vai trò dự án | Vai trò trong phiên | Trách nhiệm |
|---|---|---|---|
| Biện Xuân An | TV-01 — Product Owner/Business Analyst | Đại diện người dùng nội bộ (proxy user) | Trực tiếp trải nghiệm, trả lời câu hỏi và xác nhận feedback được ghi đúng |
| Vương Khải Phong | TV-04 — Frontend/UI/UX | Người trình diễn/đại diện nhóm phát triển | Chuẩn bị môi trường, trình diễn chức năng và tiếp nhận hành động cải thiện |
| Vũ Hoàng Minh | TV-06 — QA/DevOps/Documentation | Người điều phối và ghi biên bản | Công bố phạm vi, ghi kết quả, quản lý ảnh minh chứng và hoàn thiện biên bản |

Ba người đều là thành viên nhóm LIBIF. Biện Xuân An chỉ đại diện người dùng nội bộ theo vai trò Product Owner, **không phải khách hàng thương mại, thủ thư độc lập hoặc đại diện một đơn vị thư viện**.

## E. Kịch bản phiên dự kiến

| Mã | Kịch bản | Người thao tác/trình diễn | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|---|
| UAT-01 | Đăng nhập và kiểm tra quyền truy cập | Biện Xuân An | Người dùng vào đúng phạm vi theo vai trò | Chưa thực hiện |
| UAT-02 | Tìm kiếm và mở chi tiết tài liệu | Biện Xuân An | Tìm được tài liệu và xem được thông tin cần thiết | Chưa thực hiện |
| UAT-03 | Đọc tài liệu, chuyển trang và quan sát watermark | Biện Xuân An | Reader hoạt động, nội dung đọc được và watermark hiển thị | Chưa thực hiện |
| UAT-04 | Trình diễn luồng quản trị/thủ thư khả dụng | Vương Khải Phong | Chức năng được trình diễn đúng phạm vi build | Chưa thực hiện |

Trong phiên, Vũ Hoàng Minh cần hỏi và ghi lại ít nhất các nội dung sau:

1. Thao tác nào dễ hiểu nhất và bước nào gây bối rối?
2. Nhãn nút, nội dung và thông báo lỗi có rõ ràng không?
3. Tìm kiếm và Reader có đáp ứng nhu cầu của người dùng đại diện không?
4. Watermark có ảnh hưởng đến khả năng đọc không?
5. Nếu chỉ sửa một vấn đề, vấn đề nào cần được ưu tiên?
6. Chức năng nào nên bổ sung cho phiên bản tiếp theo?

Không điền câu trả lời trước và không chuyển nhận xét nội bộ cũ thành feedback của phiên mới.

## F. Thông tin phiên cần điền sau khi thực hiện

| Trường | Giá trị |
|---|---|
| Mã phiên | `UAT-LIBIF-[YYYYMMDD]-01` |
| Ngày thực hiện | Chưa thực hiện |
| Giờ bắt đầu/kết thúc | Chưa thực hiện |
| Hình thức | Dự kiến Discord — chia sẻ màn hình |
| Baseline/build | Chưa chốt |
| Môi trường | Chưa chốt |
| Đồng ý ghi biên bản/chụp màn hình | Chưa xác nhận |

## G. Bảng feedback phải hoàn thiện sau phiên

| ID | Người góp ý | Kịch bản | Feedback/quan sát thực tế | Loại | Ưu tiên | Hành động | Owner | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| FB-01 | Chưa ghi nhận | — | Chưa thực hiện phiên | — | — | — | — | Pending |

Chỉ bổ sung `FB-02`, `FB-03` hoặc các dòng khác khi có nhận xét thực tế. Không sử dụng feedback mẫu hoặc nội dung do công cụ AI tạo ra như phát biểu của người tham gia.

## H. Minh chứng cần thu thập

1. Ảnh Discord thể hiện ba người tham gia và màn hình đang được chia sẻ.
2. Ảnh giao diện của ít nhất một kịch bản Reader và một kịch bản quản trị nếu chạy được.
3. Ảnh vấn đề hoặc đề xuất được người dùng đại diện chỉ ra, nếu có.
4. Tin nhắn xác nhận nội dung biên bản hoặc bản giấy có đủ ba chữ ký.
5. Baseline/build, môi trường và thời gian thực tế của phiên.

Ảnh không được để lộ password, token, secret hoặc dữ liệu cá nhân không cần thiết.

## I. Việc cần tạo sau phiên UAT

| Việc | Owner | Evidence bắt buộc | Trạng thái |
|---|---|---|---|
| Chốt representative user/proxy user | Vũ Hoàng Minh | Vai trò của Biện Xuân An và quyền ghi chép | Đã phân công; chưa xác nhận phiên |
| Chạy UAT-01…04 | QA + user | session ID, build, env, dataset, ảnh/log | Chưa thực hiện |
| Ghi feedback và phân loại | Vũ Hoàng Minh | FB ID, loại, priority, PBI/issue | Chưa thực hiện |
| Chốt hành động cải thiện | Vương Khải Phong + nhóm | Owner, trạng thái và backlog/issue nếu có | Chưa thực hiện |
| Chốt kết luận phiên | Cả ba người | Chữ ký hoặc tin nhắn xác nhận | Chưa thực hiện |

## J. Kết luận quản lý hiện tại

Hệ thống có evidence kỹ thuật cho nhiều luồng và gate, nhưng **chưa có bằng chứng phù hợp để gọi là customer acceptance**. Không được dùng hồ sơ này để tuyên bố khách hàng đã chấp nhận sản phẩm. Khi có phiên UAT thật, phải thay phần gap bằng dữ liệu session và giữ lại lịch sử thay đổi.

Kết luận phù hợp dự kiến sau phiên, nếu các kịch bản chính đạt, là: **“Prototype phù hợp để trình diễn học tập có điều kiện.”** Chỉ sử dụng kết luận này sau khi ba người thực sự xem xét và đồng ý.

## K. Xác nhận sau phiên

> Không ký trước. Chỉ ký sau khi đã thực hiện phiên và kiểm tra lại toàn bộ feedback, kết quả và quyết định.

| Vai trò | Họ tên | Xác nhận | Ngày/link |
|---|---|---|---|
| Đại diện người dùng nội bộ/Product Owner | Biện Xuân An | Chưa ký | Chưa có |
| Người trình diễn/đại diện nhóm phát triển | Vương Khải Phong | Chưa ký | Chưa có |
| Người điều phối và ghi biên bản | Vũ Hoàng Minh | Chưa ký | Chưa có |
