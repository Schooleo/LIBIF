# BẢN IN NỘP KÈM — BẰNG CHỨNG THEO DÕI LỖI/RỦI RO

## 1. Nguồn theo dõi thực tế

| Nguồn | Dữ liệu quan sát được | Ý nghĩa |
|---|---|---|
| GitHub repository | Sprint register ghi **GitHub không có Issues** | Không có defect log dạng Issue để xuất báo cáo |
| Trello Product Backlog | [Board LIBIF](https://trello.com/b/KiPSLb2v/libif-product-backlog-pbi-01-pbi-16), snapshot 22/08/2026 | Theo dõi PBI/review, không phải defect tracker |
| Sprint register | 11 PBI ở Review, 5 PBI ở Product Backlog, 0 PBI Done | Evidence trạng thái acceptance, không phải số defect |
| Phase 8 handoff/Sprint 5 | Các hardening carry-over | Open actions/evidence gaps cần xử lý trước production |

## 2. Dữ liệu thực tế tại snapshot

| Nhóm record | Số lượng/trạng thái | Ghi chú |
|---|---|---|
| PBI đang Review | 11 | PBI-01, 02, 05, 06, 08, 09, 10, 11, 12, 14, 16 |
| PBI ở Product Backlog | 5 | PBI-03, 04, 07, 13, 15 |
| PBI Done | 0 | Board giữ ở Review đến khi acceptance criteria được xác nhận |
| GitHub Issues | 0 | Sprint register ghi rõ không có Issues |
| Formal defect records | Chưa có | Không được suy ra từ PBI status |

## 3. Hardening items còn mở được ghi nhận

| Item | Nội dung | Trạng thái |
|---|---|---|
| P8-OPS | Backup/restore, secret rotation, fail-closed config, operator runbook | Carry-over |
| P8-SEC | Watermark signing/key rotation và abuse/recovery exercise | Carry-over |
| P8-CAP | Rendering/cache/audit/detector capacity test | Carry-over |
| P8-QA | Real-browser accessibility, privacy, visual và Vietnamese-content QA | Carry-over |
| P8-REL | Release/rollback checklist và deployed CSV verification | Carry-over |
| P8-DEMO | Seed trạng thái pending approval và manual review walkthrough | Carry-over |

Các dòng này là hardening/evidence work, không được gọi là defect sản phẩm nếu chưa có steps-to-reproduce và severity.

## 4. Kết luận cho Test Report

Không thể điền số defect theo Critical/High/Medium/Low một cách trung thực vì repository chưa có defect export. Báo cáo kiểm thử phải ghi **“chưa xác minh”** thay vì ghi 0. Việc cần làm tiếp theo là chọn một tracker, tạo mã record, liên kết PBI/test/commit và lưu lịch sử triage–retest–close.

