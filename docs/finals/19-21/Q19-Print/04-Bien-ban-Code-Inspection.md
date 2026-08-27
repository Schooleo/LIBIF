# BẢN IN NỘP KÈM — BIÊN BẢN XÁC NHẬN HỒI CỨU VÀ TÁI XÁC MINH THANH TRA MÃ NGUỒN LIBIF

> **Tình trạng hồ sơ:** Nhóm xác nhận đã thực hiện phiên thanh tra mã nguồn ngày 30/07/2026 nhưng không lập biên bản và không lưu ảnh màn hình tại thời điểm đó. Ngày 25/08/2026, nhóm tái tạo evidence từ đúng baseline, đối chiếu Git history, CI, mã nguồn và chạy lại targeted test. Các ảnh đính kèm là evidence tái xác minh ngày 25/08/2026, không phải ảnh chụp ngày 30/07/2026.

## A. Kiểm soát hồ sơ

| Trường | Giá trị |
|---|---|
| Mã hồ sơ | `CI-RETRO-2026-07-30` |
| Ngày inspection ban đầu | 30/07/2026 |
| Thời gian | 19:30–20:05 |
| Hình thức | Discord — chia sẻ màn hình |
| Ngày lập hồ sơ hồi cứu | 25/08/2026 |
| Ngày tái xác minh kỹ thuật | 25/08/2026 |
| Baseline | `82c8fe9541e0789479b0ea65d7cac752907c035e` — PR #34, merge 24/07/2026 |
| Trạng thái | Hoàn thiện nội dung và evidence; chờ ký tay trên bản in |

### Lý do lập hồi cứu

Phiên inspection đã diễn ra qua Discord ngày 30/07/2026 nhưng nhóm chưa lập biên bản và không lưu ảnh màn hình. Hồ sơ này được lập ngày 25/08/2026 để ghi nhận hồi cứu hoạt động đó và tái xác minh kỹ thuật trên đúng baseline. Timeline được tách rõ để không trình bày evidence tái tạo như bằng chứng đồng thời với phiên ban đầu.

## B. Người tham gia

| Vai trò | Họ tên | Tình trạng |
|---|---|---|
| Người điều phối/ghi nhận | Đoàn Lê Gia Bảo | Có tham gia |
| Inspector độc lập | Văn Ngọc Quý | Có tham gia |
| Owner/đại diện tác giả | Lê Nguyễn Nhật Trường | Có tham gia |

## C. Mục tiêu và phạm vi

Phiên inspection đánh giá việc triển khai kiểm soát truy cập tài liệu có giới hạn source PDF cho đúng vai trò, chỉ trả trang đã watermark cho Reader, ghi audit đủ khả năng truy vết, fail-closed khi dependency bảo vệ không khả dụng, và có kiểm thử positive/negative cho các hành vi quan trọng.

| File | Dòng/phạm vi | Nội dung kiểm tra |
|---|---:|---|
| `apps/api/src/modules/access/access.controller.ts` | 104–158 | View/download token, stream và download source PDF cho staff |
| `apps/api/src/modules/access/access.service.ts` | 266–316 | Render trang, compose watermark, audit `PAGE_SERVED` và protected response |
| `apps/api/src/modules/access/access.service.ts` | 416–508 | Denial audit, fail-closed và ký/xác minh source token |
| `apps/api/src/modules/access/access.service.spec.ts` | 118–260 | RBAC, source denial, watermark, audit, rate limit và dependency failure |

**Ngoài phạm vi:** các module ngoài Access, penetration test độc lập, capacity/performance test, production secret rotation, coverage toàn repository, browser/accessibility matrix và UAT. Kết luận chỉ áp dụng cho phạm vi trên, không đại diện cho toàn bộ repository hoặc production readiness.

## D. Tiêu chí thanh tra

| ID | Tiêu chí | Cách kiểm tra |
|---|---|---|
| IC-01 | Phù hợp yêu cầu và DoD | Đối chiếu RBAC, source denial, watermark và audit với DoD |
| IC-02 | Phân quyền ở controller | Kiểm tra `@Roles('LIBRARIAN', 'ADMIN')` |
| IC-03 | Phân quyền ở service | Kiểm tra tiếp user, role, token và token purpose |
| IC-04 | Không công khai source PDF cho Reader | Đối chiếu endpoint, service và negative tests |
| IC-05 | Watermark phía server | Kiểm tra `composeWatermark` và protected response |
| IC-06 | Khả năng truy vết | Kiểm tra `PAGE_SERVED`, `PAGE_DENIED` và `traceFingerprint` |
| IC-07 | Fail-closed | Kiểm tra khi audit, watermark hoặc dependency lỗi |
| IC-08 | Test positive/negative | Đọc test và chạy targeted Jest suite |
| IC-09 | Coding Standards | Đối chiếu ESLint/API CI |
| IC-10 | Privacy | Không đưa secret, raw token hoặc dữ liệu nhạy cảm vào evidence |

## E. Bằng chứng và kết quả

### Evidence lịch sử

| Evidence | Kết quả |
|---|---|
| Commit/PR | Baseline `82c8fe9`; PR #34 merge ngày 24/07/2026 |
| Static/build gate | API/web lint và build được Sprint 5 ghi nhận đạt |
| Unit/component tests | 192 API tests và 96 web tests đạt |
| API end-to-end | 12 suites/73 tests đạt |
| Worker integration | 5/5 scenarios đạt |

### Tái xác minh kỹ thuật ngày 25/08/2026

| Evidence | Kết quả |
|---|---|
| Baseline check | Full SHA, ngày, tác giả và PR #34 được xác nhận |
| Controller review | Source token/stream giới hạn cho Librarian/Admin |
| Watermark review | Trang được ghép watermark trước khi trả về |
| Audit review | Ghi `PAGE_SERVED` cùng user/session/file/page/trace |
| Fail-closed review | Audit/watermark lỗi làm request thất bại |
| Targeted Jest test | 01 suite đạt, 15/15 test đạt trong 5,268 giây |

### Checklist kết quả

| Tiêu chí | Kết quả | Quan sát |
|---|---|---|
| Controller giới hạn source cho staff | Đạt | View/download token và source endpoints giới hạn cho Librarian/Admin |
| Service xác minh quyền/token | Đạt | Service nhận user, role, document ID, token và token purpose |
| Reader không nhận raw PDF | Đạt ở mức code/test | Có negative test từ chối raw-document access |
| Watermark phía server | Đạt | Response sử dụng `watermarked.content` |
| Audit và trace | Đạt | Ghi user, session, document, file, page và trace fingerprint |
| Fail-closed | Đạt | Audit/watermark/dependency lỗi không trả trang chưa bảo vệ |
| Negative tests | Đạt | Có các ca denial và dependency failure |
| Targeted test execution | Đạt | 15/15 tests pass |
| ESLint/API CI | Đạt theo record | Không ghi nhận lint failure tại baseline |
| Formatter/coverage threshold | Chưa chứng minh | Repository chưa có formatter gate hoặc coverage threshold chính thức |

## F. Findings và hành động

Không phát hiện finding **Critical, High hoặc Medium** trong phạm vi được thanh tra.

| ID | Phân loại | Quan sát | Hành động | Owner | Trạng thái |
|---|---|---|---|---|---|
| INSP-OBS-01 | Observation | Repository chưa cấu hình formatter gate hoặc coverage threshold chính thức | Đánh giá coverage baseline và đề xuất threshold trong quality-hardening backlog | Tech Lead/QA | Carry-over |

Observation không chặn prototype nhưng phải tiếp tục được ghi là khoảng trống; không được suy rộng kết quả inspection thành kết luận production release đã sẵn sàng.

## G. Quyết định

**Quyết định: Đạt có điều kiện trong phạm vi được thanh tra.**

Căn cứ:

1. Không phát hiện finding Critical, High hoặc Medium trong phạm vi Access đã xác định.
2. Controller giới hạn source PDF cho Librarian/Admin; service tiếp tục xác minh quyền và token.
3. Trang Reader được watermark ở server, ghi audit và giữ trace fingerprint.
4. Audit/watermark/dependency failure được xử lý fail-closed.
5. Targeted Jest suite đạt 15/15 test.
6. Observation về formatter/coverage threshold được giữ làm quality hardening, không chặn acceptance của prototype.

Quyết định này không đồng nghĩa toàn bộ repository đã qua formal inspection hoặc sản phẩm đã đủ điều kiện production release.

## H. Phụ lục evidence tái xác minh

### INS-01 — Xác nhận baseline

![Terminal xác nhận commit baseline PR #34](<Code Inspection/INS-01-Baseline-PR34.png>)

*Hình INS-01 — Commit `82c8fe9541e0789479b0ea65d7cac752907c035e`, merge qua PR #34 ngày 24/07/2026. Ảnh được chụp lại ngày 25/08/2026 từ đúng baseline.*

### INS-02 — Kiểm soát truy cập source PDF

![Controller giới hạn source access cho staff](<Code Inspection/INS-02-Staff-Source-Access.png>)

*Hình INS-02 — `view-token`, `download-token` và stream source PDF được giới hạn cho `LIBRARIAN` hoặc `ADMIN`. Nguồn: `access.controller.ts`, dòng 104–142, baseline `82c8fe9`.*

### INS-03A — Watermark và fail-closed

![Service tạo watermark và fail-closed](<Code Inspection/INS-03A-Watermark-Fail-Closed.png>)

*Hình INS-03A — Trang được render với profile `READER_STANDARD`, ghép watermark có nhãn người đọc, thời điểm, document ID, số trang và opaque trace. Dependency failure làm request thất bại thay vì trả trang chưa bảo vệ. Nguồn: `access.service.ts`, dòng 266–297.*

### INS-03B — Audit và protected response

![Audit PAGE_SERVED và protected response](<Code Inspection/INS-03B-Audit-Protected-Response.png>)

*Hình INS-03B — Hệ thống ghi `PAGE_SERVED` cùng user, session, document, file, page và trace; response trả `watermarked.content` với cache policy dành cho trang cá nhân hóa. Nguồn: `access.service.ts`, dòng 299–316.*

### INS-04 — Negative/fail-closed tests

![Negative tests cho audit và watermark failure](<Code Inspection/INS-04-Negative-Fail-Closed-Tests.png>)

*Hình INS-04 — Test xác nhận audit failure và watermark failure không làm lộ trang; denial được ghi với nguyên nhân dependency unavailable và mức rủi ro cao. Nguồn: `access.service.spec.ts`, dòng 236–258.*

### INS-05 — Targeted test result

![Kết quả 15 trên 15 access service tests đạt](<Code Inspection/INS-05-Access-Service-Test-Result.png>)

*Hình INS-05 — Ngày 25/08/2026, Jest chạy riêng `access.service.spec.ts`: 01 suite và 15/15 test đạt trong 5,268 giây.*

## I. Giới hạn hồ sơ hồi cứu

- Không có ảnh hoặc biên bản được lưu ngay tại phiên ngày 30/07/2026.
- Ảnh và targeted test được tái tạo ngày 25/08/2026 từ đúng baseline.
- Hồ sơ không chứng minh toàn bộ repository đã qua formal inspection.
- Hồ sơ không thay thế penetration test, UAT hoặc production-readiness assessment.
- Không có formatter gate hoặc coverage threshold chính thức được chứng minh.

## J. Xác nhận

Các bên ký trên bản in sau khi đối chiếu nội dung, findings và quyết định:

| Vai trò | Họ tên | Chữ ký/xác nhận | Ngày |
|---|---|---|---|
| Người điều phối | Đoàn Lê Gia Bảo | __________________________ | ____/____/2026 |
| Inspector độc lập | Văn Ngọc Quý | __________________________ | ____/____/2026 |
| Owner/đại diện tác giả | Lê Nguyễn Nhật Trường | __________________________ | ____/____/2026 |
