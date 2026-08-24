# BẢN IN NỘP KÈM — HỒ SƠ THANH TRA MÃ NGUỒN LIBIF (DÙNG CHUNG CÂU 19–20)

> **Loại hồ sơ:** bản tổng hợp bằng chứng từ Git/PR/CI. Repository chưa có biên bản thanh tra mã nguồn chính thức có chữ ký hoặc persisted review discussion; phần này không giả mạo một cuộc họp chưa được ghi nhận.

## A. Thông tin baseline

| Trường | Giá trị |
|---|---|
| Mã hồ sơ | `CI-EVIDENCE-2026-07-24` |
| Đường cơ sở | `82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34 |
| Phạm vi | processing/OCR, approval, Reader, authorization, watermark, audit, catalogue search và hardening |
| Tác giả/owner | Nhiều thành viên; Git history ghi nhận `Schooleo`, `PaoPao1406`, `Kwan`, `vnquy94` |
| Inspector/điều phối viên | Chưa có phân công/biên bản chính thức |
| Pre-check | Root lint, API/web build, tests, e2e, worker integration được Sprint 5 report ghi là đạt |

## B. Bằng chứng review và kiểm tra

| Nguồn | Nội dung đã kiểm tra | Kết quả được repository ghi nhận |
|---|---|---|
| PR #14–#15 | Worker boundary, OCR, retry, private object lifecycle, approval | Processing workstream accepted ở Sprint 4 |
| PR #16–#21 | Rendering, Reader access, watermark, catalogue, admin foundation | Workstream 1–4 có gate và test counts |
| Commit `6122520` | Cookie privacy, trace/audit, fail-closed 503, 429 metadata, public non-leakage | Security/catalogue gates closed |
| PR #22–#25 | Notification/accessibility/taxonomy/admin closure | Phase 7 closure accepted |
| PR #26–#34 | Rendering regressions, CI/CD, local Compose, seed, search, review canvas | POC increment usable; hardening partially accepted |

## C. Checklist kết quả

| Tiêu chí | Kết quả evidence |
|---|---|
| Đúng yêu cầu/AC và state transition | Có test/closure evidence cho các luồng chính; acceptance từng PBI vẫn cần PO xác nhận |
| Kiến trúc/API/schema | Có contract freeze, generated client và migration/seed checks |
| Bảo trì và static quality | Root lint/build được ghi nhận đạt; không có formatter/coverage threshold riêng |
| Bảo mật | Có authz, source-PDF denial, rate/concurrency, audit, watermark và fail-closed checks |
| Test quality | Có unit/component, e2e và worker integration; chưa có full RTM/raw result archive |
| Vận hành | Local Compose/Docker smoke có; backup/restore, secret rotation, observability và rollback còn carry-over |

## D. Findings/gaps cần xử lý

| ID | Phân loại | Quan sát | Hành động | Trạng thái |
|---|---|---|---|---|
| CI-GAP-01 | Evidence gap | Không có biên bản inspection chính thức/persisted review discussion cho từng PR | Lập biên bản có inspector, finding, action và xác nhận | Chưa thực hiện |
| CI-GAP-02 | Quality gap | Search smoke có nhưng p95 trên dataset baseline chưa ghi | Chạy benchmark, lưu raw timings/percentiles | Carry-over |
| CI-GAP-03 | Release gap | Chưa có production backup/restore, secret rotation, rollback/runbook | Hoàn thiện hardening evidence | Carry-over |
| CI-GAP-04 | Acceptance gap | Chưa có real-browser/accessibility matrix và UAT sign-off | Chạy matrix, lưu ảnh/log và feedback record | Carry-over |

## E. Kết luận

Các PR/CI chứng minh nhóm đã review và kiểm tra mã nguồn trong quá trình phát triển; các lỗi tích hợp và privacy được phát hiện rồi sửa trước các gate Sprint 4–5. Tuy nhiên, hồ sơ này **chưa thể được ký như biên bản thanh tra chính thức**, vì thiếu inspector, thời gian phiên, finding log và chữ ký. Kết luận quản lý phù hợp là: code đã qua nhiều automated/integration gates, còn formal inspection và release-readiness evidence là việc phải hoàn tất.

## F. Xác nhận

| Vai trò | Họ tên | Xác nhận | Ngày |
|---|---|---|---|
| Đại diện nhóm | Chưa ghi nhận | Chưa ký | Chưa ghi nhận |
| Điều phối viên inspection | Chưa ghi nhận | Chưa ký | Chưa ghi nhận |
| Inspector độc lập | Chưa ghi nhận | Chưa ký | Chưa ghi nhận |
