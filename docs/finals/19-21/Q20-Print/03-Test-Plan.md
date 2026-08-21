# KẾ HOẠCH KIỂM THỬ TỔNG THỂ — LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| ID / Phiên bản | `LIBIF-TP-[ ]` / `[ ]` |
| Kiểm thử basis đường cơ sở | Danh sách sản phẩm `[ ]`; SOW `[ ]`; Kiến trúc `[ ]`; QMP `[ ]` |
| SUT build | Phát hành/tag `[ ]`; commit `[ ]`; image digest `[ ]` |
| Người phụ trách / Người phê duyệt | `[ ]` / `[ ]` |
| Kiểm thử window | `[start]` – `[end]` |

## 1. Mục tiêu và phạm vi

- Xác minh PBI-01…16 và AC-01…08 theo rủi ro.
- Cung cấp bằng chứng đủ cho quyết định phát hành, không nhằm chứng minh phần mềm “không có lỗi”.

| Hạng mục kiểm thử | Trong phạm vi | Ngoài phạm vi/lý do |
|---|---|---|
| Web UI/API | upload, review/catalog, publish, search, reader, audit | `[ ]` |
| Services/data | OCR, PostgreSQL, Redis concurrency, MinIO encrypted object | production HA/DR |
| Bảo mật | authn/authz, object access, upload, secrets, crypto use, original-URL exposure, audit | professional pentest/certification |
| Compatibility | `[browser/version/viewport]` | `[ ]` |

## 2. Kiểm thử basis và assumptions

| Basis ID | Phiên bản/link | Kiểm thử implications | Gap/decision |
|---|---|---|---|
| PBI/AC | | | |
| Kiến trúc/API/schema | | | |
| QMP/DoD | | | |
| Sổ đăng ký rủi ro | | | |
| OWASP ASVS subset | | | |

## 3. Chiến lược dựa trên rủi ro

Điểm rủi ro đề xuất: `Khả năng xảy ra (1–5) × Ảnh hưởng (1–5)`. Nhóm chốt ngưỡng ưu tiên và ghi lý do.

| Mã rủi ro | Dạng thất bại | L | I | Điểm | Biện pháp kiểm thử | Cấp độ/loại | Người phụ trách |
|---|---|---:|---:|---:|---|---|---|
| TR-01 | Sai authorization làm lộ sách | | | | positive/negative/object-level access | integration/security | |
| TR-02 | Key/nonce/crypto xử lý sai hoặc file lưu plaintext | | | | storage inspection, decrypt/tamper cases | integration/security | |
| TR-03 | Race condition vượt hạn mức đọc | | | | concurrent requests at N/N+1 | integration/performance | |
| TR-04 | OCR sai nhưng được xuất bản | | | | bộ dữ liệu chuẩn + quy trình phê duyệt của con người | chức năng/dữ liệu | |
| TR-05 | Search sai trang hoặc p95 ≥ 2s | | | | relevance + timed bộ dữ liệu | integration/performance | |
| TR-06 | Original file URL bị lộ | | | | DOM/network/direct-object checks | security | |
| TR-07 | Audit thiếu/sai/tiết lộ nhạy cảm | | | | action-to-log reconciliation | integration/security | |
| TR-08 | Fresh install thất bại | | | | clean môi trường rehearsal | portability | |

## 4. Kiểm thử levels, types và techniques

| Cấp độ/loại | Mục tiêu | Kỹ thuật | Tự động hóa/công cụ | Bằng chứng kết thúc |
|---|---|---|---|---|
| Rà soát tĩnh | lỗi requirement/design/code sớm | checklist/inspection | ESLint/type-check/manual | log/minutes |
| Đơn vị | branch/business logic cô lập | equivalence/boundary/decision | Jest `[verify]` | JUnit/console/coverage |
| Tích hợp | DB/Redis/MinIO/OCR/API contracts | state transition/error guessing | `[ ]` | report/log |
| E2E | critical user journeys | scenario/decision table | `[ ]` | run/video/screenshot |
| Bảo mật | threat/control verification | misuse/negative cases + ASVS subset | `[ ]` | checklist/results |
| Hiệu năng | search/concurrency/OCR timing | workload/boundary | `[ ]` | raw timings/percentiles |
| UAT | fitness for librarian/reader | business scenario | manual | signed phản hồi |

## 5. Traceability matrix (RTM)

| PBI/AC | Risk | Kiểm thử case IDs | Execution IDs | Lỗi IDs | Trạng thái cuối/bằng chứng |
|---|---|---|---|---|---|
| AC-01 | TR-04 | | | | |
| AC-02 | TR-01/02 | | | | |
| AC-03 | TR-03 | | | | |
| AC-04 | TR-05 | | | | |
| AC-05 | | | | | |
| AC-06 | TR-06/07 | | | | |
| AC-07 | all | | | | |
| AC-08 | TR-08 | | | | |

## 6. Môi trường và cấu hình kiểm thử

| Thành phần | Phiên bản/config | Endpoint/resource | Evidence |
|---|---|---|---|
| OS/CPU/RAM | | | |
| Browser | | | |
| Node/package lock | | | |
| App containers | | | |
| PostgreSQL/Redis/MinIO/Tesseract | | | |
| Feature flags/secrets source | redacted | | |

Mọi execution record phải đủ: build/commit, môi trường ID, test data version, time, executor và phiên bản công cụ.

## 7. Dữ liệu kiểm thử

| Dataset ID/version | Nội dung | Căn cứ xác định kết quả mong đợi | Quyền sử dụng/privacy | Đặt lại/dọn dẹp |
|---|---|---|---|---|
| OCR-GOLD-[ ] | tài liệu tiếng Việt 300 DPI + ground truth | CER/WER hoặc field accuracy | | |
| RBAC-[ ] | users/roles/books | access matrix | synthetic | |
| SEARCH-[ ] | indexed pages/queries | expected book/page | | |
| LOAD-[ ] | sessions N/N+1 | allowed/blocked count | synthetic | |

Không dùng dữ liệu cá nhân thật nếu không cần; ảnh bằng chứng phải che token, secret, full IP và nội dung có bản quyền.

## 8. Tiêu chí bắt đầu, kết thúc, tạm dừng và tiếp tục

### Tiêu chí bắt đầu

- [ ] Kiểm thử basis reviewed; build deployable; môi trường/data versioned.
- [ ] Smoke test đạt; critical dependency available; cases reviewed.

### Tiêu chí kết thúc (đường cơ sở đề xuất cần duyệt)

- [ ] 100% Must-have AC executed và đạt.
- [ ] Các kiểm thử rủi ro cao theo kế hoạch đã được thực hiện; số lỗi nghiêm trọng/cao còn mở bằng 0.
- [ ] Kiểm thử hồi quy, security subset và AC-08 fresh install đạt.
- [ ] Mọi lỗi và rủi ro còn lại được PO chấp nhận bằng văn bản.
- [ ] Báo cáo Kiểm thử, RTM và kho bằng chứng đã hoàn tất.

### Tạm dừng / tiếp tục

Suspend khi build không testable, môi trường/data sai đường cơ sở, smoke fail, hoặc blocker làm kết quả mất tin cậy. Resume khi root cause được sửa, build mới định danh và smoke đạt; ghi phần test cần chạy lại.

## 9. Quản lý lỗi

- Mức nghiêm trọng: nghiêm trọng (lộ dữ liệu/mất toàn bộ luồng), cao (Must feature hỏng/không workaround), trung bình (ảnh hưởng có workaround), thấp (nhỏ/cosmetic). Nhóm phải phê duyệt định nghĩa cụ thể.
- Trường bắt buộc: mã lỗi, tiêu đề, bản dựng/môi trường, điều kiện trước/dữ liệu, các bước, kết quả mong đợi, kết quả thực tế, bằng chứng, khả năng tái hiện, mức nghiêm trọng, mức ưu tiên, người phụ trách, trạng thái, PBI/kiểm thử liên kết, mã xác nhận sửa lỗi và kết quả kiểm thử lại.
- Triage `[lịch]`; disagreement do `[vai trò]` quyết định; reopened lỗi giữ lịch sử.

## 10. Sản phẩm bàn giao, lịch và trách nhiệm

| Sản phẩm bàn giao/hoạt động | Người phụ trách | Kế hoạch | Thực tế | Trạng thái/link |
|---|---|---|---|---|
| Kế hoạch/ca kiểm thử/dữ liệu | | | | |
| Môi trường/kiểm thử khói | | | | |
| Đơn vị/integration/E2E/security/UAT | | | | |
| Lỗi triage/retest/regression | | | | |
| Báo cáo Kiểm thử/lưu trữ | | | | |

## 11. Theo dõi, kiểm soát và báo cáo

Theo dõi: số ca theo kế hoạch, đã thực hiện, đạt, không đạt và bị chặn; độ bao phủ yêu cầu/rủi ro; lỗi theo mức nghiêm trọng, trạng thái, thời gian tồn đọng và số lần mở lại; độ ổn định tự động hóa và xu hướng độ bao phủ. Không dùng riêng “tỷ lệ đạt cao” để kết luận chất lượng; phải đối chiếu rủi ro, độ bao phủ kiểm thử và lỗi còn mở.

## 12. Phương pháp hình thành và đánh giá Kế hoạch Kiểm thử (dùng khi vấn đáp)

1. Baseline test basis; tìm ambiguity/gap.
2. Xác định test items, constraints, stakeholders và quality objectives.
3. Product-risk analysis, ưu tiên phạm vi/levels/types/techniques.
4. Chọn môi trường, representative data và oracle.
5. Ước lượng effort/lịch/role; định nghĩa entry/exit/suspension.
6. Rà soát traceability và feasibility; pilot smoke/high-risk cases.
7. Trong thực thi: monitoring/control, triage/retest/regression và versioning.
8. Đánh giá cuối bằng tiêu chí kết thúc, RTM completeness, lỗi/residual-risk analysis và stakeholder approval.

