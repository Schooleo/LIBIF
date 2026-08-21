# KẾ HOẠCH QUẢN LÝ CHẤT LƯỢNG PHẦN MỀM — LIBIF

## Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Mã tài liệu / Phiên bản | `LIBIF-QMP-[...]` / `[x.y]` |
| Đường cơ sở sản phẩm | Bản phát hành/thẻ `[ ]`, mã xác nhận SHA `[ ]` |
| Người phụ trách / Người phê duyệt | `[người phụ trách QA]` / `[PO + Trưởng nhóm kỹ thuật]` |
| Ngày hiệu lực / kỳ rà soát | `[ ]` / `[mỗi lần Rà soát Sprint hoặc khi phạm vi/rủi ro thay đổi]` |
| Trạng thái | Bản nháp / Đã rà soát / Đã phê duyệt / Đã thay thế |

### Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Nội dung | Người duyệt |
|---|---|---|---|---|
| | | | | |

## 1. Mục đích, phạm vi và đối tượng chất lượng

Mục đích: mô tả cách nhóm lập kế hoạch, bảo đảm (QA), kiểm soát (QC), đo lường và cải tiến chất lượng cho LIBIF.

| Đối tượng | Trong phạm vi | Ngoài phạm vi |
|---|---|---|
| Sản phẩm | PBI-01…16, AC-01…08, dữ liệu OCR/biên mục, API/giao diện | Môi trường vận hành có tính sẵn sàng cao và khôi phục sau thảm họa, kiểm thử xâm nhập thương mại, cam kết chống sao chép tuyệt đối |
| Quy trình | Scrum trong 5 Sprint, rà soát, kiểm thử, quản lý lỗi, thay đổi và cấu hình | `[ ]` |
| Dự án | chất lượng sản phẩm bàn giao, bằng chứng, lịch trình và trách nhiệm | `[ ]` |
| Môi trường | máy cục bộ, CI, môi trường thử nghiệm, Docker và dữ liệu kiểm thử | môi trường vận hành liên tục 24/7 |

## 2. Tài liệu đầu vào và khả năng truy vết

| Đầu vào | Đường cơ sở/phiên bản | Cách sử dụng | Người phụ trách |
|---|---|---|---|
| Tầm nhìn và Phạm vi Dự án | `[ ]` | nhu cầu của các bên liên quan, phạm vi và ngoài phạm vi | PO |
| Danh sách sản phẩm | `[ ]` | PBI và tiêu chí chấp nhận | PO |
| Kiến trúc | `[ ]` | thuộc tính chất lượng, thành phần và công nghệ | Trưởng nhóm kỹ thuật |
| SOW | `[ ]` | AC-01…08 và giới hạn | PM |
| Kế hoạch Dự án/Rủi ro/Theo dõi | `[ ]` | quy trình, DoD, rủi ro và chỉ số | PM/QA |

## 3. Chính sách và mục tiêu chất lượng

> Mỗi mục tiêu phải có công thức, nguồn dữ liệu, tần suất, người phụ trách và ngưỡng. Các ngưỡng dưới đây là `ĐỀ XUẤT`, chỉ trở thành đường cơ sở sau khi nhóm duyệt.

| Mã | Đặc tính | Mục tiêu đo được | Phương pháp/nguồn | Ngưỡng đề xuất | Người phụ trách |
|---|---|---|---|---|---|
| QO-01 | Phù hợp chức năng | AC bắt buộc đạt | số AC bắt buộc đạt / số AC bắt buộc đã thực hiện | 100% trước phát hành | QA/PO |
| QO-02 | Độ tin cậy | Không còn lỗi nghiêm trọng; luồng chính không bị chặn | công cụ theo dõi lỗi + kiểm thử hồi quy | lỗi nghiêm trọng còn mở = 0 | QA |
| QO-03 | Hiệu năng | Tìm kiếm PBI-10 trên bộ dữ liệu đường cơ sở | p95 từ nhật ký kiểm thử | < 2 giây | Lập trình viên máy chủ/QA |
| QO-04 | Bảo mật | RBAC, phân quyền đối tượng, bí mật, lưu trữ mã hóa và nhật ký kiểm toán được kiểm chứng | danh sách kiểm tra/kiểm thử bảo mật | 100% kiểm soát bắt buộc đạt; lỗi nghiêm trọng/cao còn mở = 0 | Bảo mật/QA |
| QO-05 | Khả năng bảo trì | Mã nguồn thay đổi đạt kiểm tra quy tắc, kiểu dữ liệu, rà soát và kiểm thử | CI + yêu cầu hợp nhất mã | 100% yêu cầu hợp nhất mã vượt qua cổng kiểm tra | Trưởng nhóm kỹ thuật |
| QO-06 | Chất lượng dữ liệu/nội dung | Nội dung trước xuất bản được thủ thư đối soát | hồ sơ lấy mẫu + nhật ký phê duyệt | 100% trang của tài liệu trình diễn được duyệt; ghi riêng độ chính xác OCR thô | PO/QA |
| QO-07 | Khả năng sử dụng | Đại diện người dùng hoàn thành kịch bản UAT | số lần hoàn thành / số lần thử + phản hồi | `[nhóm duyệt]` | PO |
| QO-08 | Tính khả chuyển | Cài đặt mới theo README/Docker Compose | nhật ký trên máy sạch | đạt AC-08 | DevOps |

Lưu ý: “100% nội dung đã duyệt” không đồng nghĩa OCR tự động chính xác 100%; phải báo cáo riêng độ chính xác OCR thô và kết quả sau con người rà soát.

## 4. Tiêu chuẩn, quy ước và cổng chất lượng

| Cổng kiểm tra | Bắt buộc | Bằng chứng |
|---|---|---|
| Commit/PR | định dạng, branch rule, link PBI/issue | PR URL/export |
| Chất lượng tĩnh | ESLint + kiểm tra kiểu TypeScript + kiểm tra định dạng | cấu hình + nhật ký CI |
| Rà soát | ít nhất 01 người rà soát độc lập; security-sensitive code có Tech Lead | approval + inspection record |
| Kiểm thử | affected unit/integration tests đạt | test output |
| Độ bao phủ | đường cơ sở theo module; không giảm ngoài ngoại lệ được duyệt | coverage report |
| Bảo mật | không hard-code secret; authn/authz, crypto, upload, audit checklist | scan/review/test bằng chứng |
| Chấp nhận | AC đạt trên môi trường thử nghiệm và PO quyết định | test/UAT/phản hồi record |
| Phát hành | DoD + tiêu chí kết thúc + chấp nhận rủi ro còn mở | quyết định phát hành đã ký |

Ngoại lệ phải ghi: mã, quy tắc/cổng kiểm tra, lý do, phạm vi, rủi ro, người phê duyệt, thời hạn và vấn đề khắc phục.

## 5. Hoạt động QA (phòng ngừa)

| Hoạt động | Khi nào | Người thực hiện | Kết quả |
|---|---|---|---|
| Rà soát requirement/AC theo INVEST và testability | refinement | PO+QA+Dev | comment/change |
| Threat/risk review cho upload, auth, crypto, session, audit | đầu Sprint/thiết kế đổi | Tech Lead+QA | risk/test update |
| Coding standard/tool configuration | Sprint 1; khi stack đổi | Tech Lead | config versioned |
| Kiểm thử design trước/đồng thời coding | mỗi PBI | QA+Dev | cases/automation |
| CI gates và branch protection | liên tục | DevOps | run log |
| Retrospective/CAPA | cuối Sprint | cả nhóm | action owner/due date |

## 6. Hoạt động QC (phát hiện)

| Hoạt động | Phạm vi | Sampling/coverage | Kết quả |
|---|---|---|---|
| Static analysis/type check | source changed | 100% changed source | log |
| Thanh tra mã nguồn | yêu cầu hợp nhất mã/mô-đun nhạy cảm rủi ro | 100% mô-đun trọng yếu; `[quy tắc khác]` | biên bản/phát hiện |
| Đơn vị/tích hợp/E2E/UAT | theo Kế hoạch Kiểm thử | dựa trên rủi ro + khả năng truy vết | kết quả/báo cáo |
| Lỗi triage/retest/regression | mọi lỗi | theo severity | issue history |
| Rà soát tài liệu | sản phẩm bàn giao | 01 tác giả + 01 người rà soát | danh sách kiểm tra/phê duyệt |

## 7. Vai trò và RACI

| Hoạt động | PO | Trưởng nhóm kỹ thuật | Lập trình viên | QA/DevOps | Đại diện khách hàng |
|---|---:|---:|---:|---:|---:|
| Chốt mục tiêu chất lượng/AC | A | C | C | R | C |
| Coding standards/architecture | C | A/R | R | C | I |
| Kiểm thử plan/execution/report | C | C | R | A/R | I |
| Chấp nhận/UAT | A/R | C | I | C | R/C |
| Quyết định chất lượng phát hành | A | R | C | R | C |

## 8. Quản lý lỗi, thay đổi và cấu hình

- Quy trình xử lý: New → Triaged → In Progress → Ready for Retest → Đã đóng; Đã mở lại/Won't Fix/Duplicate phải có lý do.
- Mức nghiêm trọng mô tả ảnh hưởng; mức ưu tiên mô tả thứ tự xử lý—không trộn hai khái niệm.
- Mọi kết quả kiểm thử phải gắn build/commit, môi trường, bộ dữ liệu và phiên bản công cụ.
- Thay đổi mục tiêu/ngưỡng/scope phải qua change record và cập nhật QMP/Kế hoạch Kiểm thử/RTM tương ứng.

## 9. Báo cáo, audit và cải tiến

| Nhịp | Chỉ số tối thiểu | Người nhận | Trigger hành động |
|---|---|---|---|
| PR/CI | lint/type/test/coverage | Dev/Tech Lead | gate fail chặn merge |
| Hằng tuần | test progress, lỗi theo severity/age, blocked risks | team/PM | lệch ngưỡng → owner/action |
| Sprint Rà soát | PBI Done, escaped/reopened defects, phản hồi | stakeholders | backlog/CAPA |
| Phát hành | tiêu chí kết thúc, rủi ro còn lại, còn mở defects | PO/giảng viên | go/no-go |

## 10. Phương pháp hình thành và đánh giá QMP (dùng khi vấn đáp)

1. Thu thập Vision/SOW/Danh sách sản phẩm/Kiến trúc/risk/constraint và yêu cầu đề thi.
2. Xác định entity cần quản lý: product, process, project, môi trường.
3. Chọn attribute theo rủi ro và ISO/IEC 25010; chuyển thành metric có công thức/nguồn/ngưỡng/owner.
4. Chọn preventive controls (QA), detective controls (QC), quality gates và bằng chứng.
5. Rà soát chéo bởi PO–Tech Lead–QA; kiểm tra SMART, feasibility và traceability.
6. Pilot qua Sprint đầu; đối chiếu dữ liệu thật, lỗi escape và phản hồi; điều chỉnh bằng version/change record.
7. Đánh giá cuối: coverage của requirement, mức đạt objective, trend lỗi, audit sample và stakeholder acceptance.

### Danh sách kiểm tra phê duyệt QMP

- [ ] Phạm vi nhất quán Vision/SOW/Danh sách sản phẩm; ngoài phạm vi được ghi rõ.
- [ ] Mỗi objective đo được và có nguồn dữ liệu/owner/tần suất/ngưỡng.
- [ ] QA khác QC; có cả phòng ngừa và phát hiện.
- [ ] Cổng kiểm tra có bằng chứng, ngoại lệ và escalation.
- [ ] Mapping tới Kế hoạch Kiểm thử/DoD/inspection/phản hồi đầy đủ.
- [ ] Reviewer ghi phát hiện; phát hiện đã đóng hoặc chấp nhận risk.
