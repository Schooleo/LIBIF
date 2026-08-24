# BẢN IN NỘP KÈM — LESSONS LEARNED REGISTER CỦA DỰ ÁN LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Mã tài liệu / phiên bản | `LIBIF-LLR-1.0` |
| Phạm vi | Daily Sprint 2026-07-20 đến 2026-07-24; implementation evidence và hardening handoff |
| Nguồn | Git history, PR #14–#34, Sprint reports, PBI traceability, Phase 8 handoff |
| Ngày tổng hợp | 24/08/2026 |
| Người phụ trách/phê duyệt | Nhóm LIBIF; chưa có approver register riêng |
| Trạng thái | Bản tổng hợp nội bộ; action production còn mở |

## 1. Cấu trúc một bài học hợp lệ

Một bài học không chỉ là “cần cố gắng hơn”. Mỗi record phải có: bối cảnh/sự kiện, ảnh hưởng, nguyên nhân, điều làm tốt/chưa tốt, khuyến nghị có thể hành động, owner, thời hạn, evidence, kết quả xác nhận và trạng thái. Bài học được ghi sau Sprint/Review/Retrospective và được kiểm tra lại ở Sprint sau.

## 2. Lessons Learned Register

| ID / nguồn | Bối cảnh và sự kiện | Ảnh hưởng / nguyên nhân | Điều học được và hành động | Owner / trạng thái / evidence |
|---|---|---|---|---|
| LL-01 / Sprint 4 | Worker được tách khỏi HTTP process; queue payload chỉ giữ identifier; private workspace và cleanup được bổ sung | Giảm nguy cơ lộ plaintext và trạng thái giả; nguyên nhân là processing cần boundary rõ trước Reader | Với job xử lý tài liệu, phải freeze lifecycle, retry, cancellation, supersession và cleanup trước khi mở rộng feature | Tech Lead + backend / Đã áp dụng / Sprint 4 report, PR #15 |
| LL-02 / Sprint 4 | Reader, rendering, catalogue và administration được chia thành bounded workstreams, có contract freeze | Giảm conflict khi nhiều thành viên làm song song; nguyên nhân là các module chia sẻ cùng API/schema | Chia ownership theo module, ghi dependency/merge order và chỉ regenerate generated client ở integration owner | Tech Lead / Đã áp dụng / Sprint 4 report, PR #15–#21 |
| LL-03 / Sprint 5 | Handoff protected Reader/administration tách feature closure khỏi hardening | Các thiếu sót production không bị che dưới nhãn “feature done”; nguyên nhân là tiêu chí POC và production khác nhau | Mỗi phase phải có stop condition và handoff riêng; gap phải chuyển thành carry-over item có owner | Scrum Master/PM / Đã ghi nhận, action còn mở / Sprint 5 report, Phase 8 handoff |
| LL-04 / Sprint 5 | Local Compose, deterministic seed, migration/reindex và authenticated smoke giúp chạy lại demo | Tăng khả năng tái hiện và giảm phụ thuộc thao tác DB thủ công; nguyên nhân là seed/runtime được coi là deliverable | Đưa seed, migration, health check và smoke command vào Definition of Done cho demo | DevOps / Đã áp dụng ở local POC / PR #28–#34, Sprint 5 report |
| LL-05 / Sprint 5 | Manual review-canvas walkthrough không chạy được vì thiếu pending-approval row phù hợp | Automated/component/build evidence có nhưng visual acceptance còn thiếu; nguyên nhân là dữ liệu demo chưa chuẩn bị đúng state | Seed trước các trạng thái trình diễn (đặc biệt pending approval), rồi ghi ảnh/video và người kiểm tra | QA/DevOps / Chưa thực hiện đầy đủ / Sprint 5 report |
| LL-06 / Sprint 5 | Automated test count tăng nhưng production readiness vẫn còn gap | Test pass không thay thế backup/restore, rotation, observability, browser matrix, capacity và rollback | Test Report phải tách “POC evidence” khỏi “production acceptance”; không suy luận sẵn sàng từ pass rate | QA/PM / Carry-over / Sprint 5 report, Phase 8 handoff |
| LL-07 / Sprint 5 | Search đã có live content-search smoke và reindex path, nhưng p95 baseline chưa ghi | Không thể kết luận mục tiêu <2s; nguyên nhân là smoke xác nhận chức năng, chưa phải performance measurement | Mỗi performance objective cần dataset/version, workload, raw timing, percentile và threshold trước khi test | QA/DevOps / Chưa thực hiện / Sprint 5 report |
| LL-08 / Toàn bộ Sprint | GitHub không có Issues và formal Scrum/inspection minutes không được lưu | Khó truy vết defect, review và acceptance độc lập; nguyên nhân là code/PR evidence được ưu tiên hơn hồ sơ quản trị | Chọn tracker duy nhất, bắt buộc record ID, triage, retest, approver và lưu biên bản Review/Retro | PM/Scrum Master / Chưa thực hiện / Sprint register README |

## 3. Đánh giá hiệu quả của bài học

| Nhóm hành động | Kết quả hiện tại | Đánh giá |
|---|---|---|
| Private worker boundary | Đã dùng làm nền cho approval/Reader và privacy gate | Có hiệu quả; được xác nhận qua worker/security evidence |
| Bounded ownership/contract freeze | Cho phép tích hợp nhiều workstream và giữ generated contract ổn định | Có hiệu quả; giảm conflict theo retrospective |
| Local Compose/seed | POC có thể chạy lại và demo bằng dữ liệu deterministic | Có hiệu quả trong local; chưa suy rộng thành production operability |
| Prepared visual/UAT state | Pending-approval walkthrough vẫn thiếu | Chưa hiệu quả; cần action mới |
| Formal defect/review/acceptance register | Chưa được tạo đầy đủ | Chưa hiệu quả; là gap quản trị rõ ràng |

## 4. Cách sử dụng trong quản lý dự án

Lessons Learned Register được cập nhật ở cuối Sprint, dùng để:

1. chuyển nguyên nhân và khuyến nghị thành action có owner/due date;
2. đưa action vào Sprint Backlog hoặc hardening backlog;
3. kiểm tra ở Sprint sau xem hành động đã được áp dụng và chỉ số/gap có cải thiện không;
4. đóng record chỉ khi có evidence xác nhận, không đóng vì “đã nhắc lại”.

## 5. Kết luận

Register cho thấy quản lý dự án LIBIF không chỉ theo dõi việc đã làm mà còn chuyển kinh nghiệm thành thay đổi quy trình: boundary và contract được làm rõ, seed/reproducibility được tăng cường, đồng thời các giới hạn production/UAT được giữ minh bạch. Các bài học LL-05 đến LL-08 còn mở là bằng chứng nhóm chưa hoàn tất toàn bộ hardening và cần tiếp tục kiểm soát thay vì tuyên bố dự án đã sẵn sàng production.

## 6. Xác nhận

| Vai trò | Họ tên | Xác nhận | Ngày |
|---|---|---|---|
| Người lập register | Nhóm LIBIF | Chưa ký riêng | 24/08/2026 |
| Scrum Master/PM | Chưa ghi nhận | Chưa ký | Chưa có |
| Product Owner | Chưa ghi nhận | Chưa ký | Chưa có |

