# BẢN IN NỘP KÈM — BÁO CÁO KẾT QUẢ KIỂM THỬ LIBIF

## 1. Identification và quyết định

| Trường | Giá trị |
|---|---|
| Mã báo cáo / phiên bản | `LIBIF-TR-2026-07-24-01` / 1.0 |
| Kế hoạch kiểm thử | `LIBIF-TP-1.0` |
| SUT | `dev@82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34 |
| Window/evidence | Sprint 1–5; tổng hợp tại 24/07/2026 |
| Kết luận chung | **INCOMPLETE — POC increment usable, release evidence chưa đủ** |
| Recommendation | **CONDITIONAL GO cho demo POC; NO-GO cho production release** |

Lý do: repository ghi nhận các gate kỹ thuật lớn đã chạy và đạt, gồm lint, build, API/web tests, API e2e, worker/OCR và security/privacy gate. Tuy nhiên chưa có full RTM/raw archive, defect register chính thức, p95/capacity, UAT/customer acceptance, browser/accessibility matrix và production-operability evidence. Sprint 5 cũng kết luận hardening increment chỉ được chấp nhận một phần.

## 2. Kết quả tổng hợp có thể kiểm chứng

| Level/type | Kết quả được ghi nhận | Evidence status |
|---|---|---|
| API unit/integration gate | 192 tests ở mốc PR #34 | Passed theo Sprint 5 report; raw console output chưa lưu |
| Web component/UI gate | 96 tests ở mốc PR #34 | Passed theo Sprint 5 report; raw console output chưa lưu |
| API e2e | 12 suites / 73 tests ở closure record | Passed theo Sprint 5 report |
| Worker/OCR infrastructure | 1 suite / 5 scenarios | 5/5; gồm Redis, MinIO, PostgreSQL/PDF/OCR boundary |
| Static/build | Root lint, shared/API/web builds | Passed theo Sprint 5 report |
| Security/privacy | authz, source denial, watermark, audit, fail-closed, rate/concurrency | Gate passed; chưa phải pentest thương mại |
| Performance | Live `MapReduce` content-search smoke | p95/capacity chưa được đo và ghi |
| UAT | Chưa có customer/proxy-user session | Incomplete |

Không chuyển các dòng “đã ghi nhận trong Sprint report” thành một pass rate tổng hợp, vì số mẫu và loại test không đồng nhất.

## 3. Độ bao phủ yêu cầu và rủi ro

| AC/risk group | Trạng thái | Bằng chứng/giới hạn |
|---|---|---|
| AC-01 / OCR-approval | Có evidence kỹ thuật | Worker/approval loop; chưa có UAT ký xác nhận |
| AC-02 / authz-storage | Có evidence kỹ thuật | Private boundary/security gate; production key rotation còn thiếu |
| AC-03 / concurrency | Có evidence kỹ thuật | Redis controls/tests; chưa có capacity threshold đầy đủ |
| AC-04 / search | Có smoke | P95 <2s chưa được chứng minh |
| AC-05 / Reader | Có automated/live evidence | Full real-browser matrix chưa chạy |
| AC-06 / source-watermark-audit | Có security gate | Claim chỉ là deterrence/attribution, không phải DRM tuyệt đối |
| AC-07 / defects | Chưa kết luận | GitHub không có Issues; thiếu defect export |
| AC-08 / fresh install | Có local evidence | Production deployment/rollback chưa được chứng minh |

## 4. Defect và limitation register

| ID | Loại | Ảnh hưởng | Quyết định |
|---|---|---|---|
| GAP-TEST-01 | Evidence gap | Không có defect log/issue export chính thức | Bổ sung tracker và RTM trước release |
| GAP-TEST-02 | Performance gap | Không thể kết luận search p95 <2s | Chạy benchmark trên dataset baseline |
| GAP-TEST-03 | Acceptance gap | Không có UAT/customer sign-off | Tổ chức phiên UAT với user/proxy user |
| GAP-TEST-04 | Release gap | Backup/restore, secret rotation, runbook, rollback còn thiếu | Giữ trạng thái Conditional/No-Go production |

Các dòng trên là **gap của hồ sơ kiểm thử**, không phải lỗi sản phẩm đã tái hiện. Không có căn cứ để điền số lượng defect theo severity.

## 5. Đánh giá tiêu chí kết thúc

| Tiêu chí | Mục tiêu | Thực tế | Kết luận |
|---|---|---|---|
| Must-have AC | 100% executed và passed | Nhiều AC có evidence nhưng acceptance toàn bộ chưa ký | Chưa đạt |
| Critical/High còn mở | 0 | Không có defect register đủ để xác minh | Chưa xác minh |
| Search p95 | <2 giây | Chỉ có live smoke | Chưa đạt/Chưa đo |
| Fresh install | Đạt | Local Compose/Docker smoke | Đạt trong phạm vi local POC |
| DoD/release checklist | 100% bắt buộc | Production hardening và UAT còn carry-over | Chưa đạt |

## 6. Bài học và hành động tiếp theo

- Không đồng nhất automated test pass với acceptance: cần RTM, raw result, risk và user decision.
- Chuẩn bị seed record ở trạng thái pending approval trước khi chạy manual review-canvas walkthrough.
- Chạy browser/accessibility, performance/capacity và abuse/recovery matrix trước khi tuyên bố release.
- Bổ sung defect tracker, release checklist, rollback và operator runbook.

## 7. Xác nhận

| Vai trò | Họ tên | Quyết định | Ngày/link |
|---|---|---|---|
| QA/Test lead | Chưa ghi nhận | Chưa ký | Chưa có |
| Tech lead | Chưa ghi nhận | Chưa ký | Chưa có |
| Product owner | Chưa ghi nhận | Chưa ký | Chưa có |
