# DEFINITION OF DONE — LIBIF

| Version | Ngày hiệu lực | Product baseline | Người phê duyệt |
|---|---|---|---|
| `[ ]` | `[ ]` | `[ ]` | `[Scrum Team/PO]` |

DoD là tiêu chuẩn chung cho Increment. Acceptance Criteria cho biết xây đúng story nào; DoD xác nhận Increment đạt mức chất lượng chung. PBI chưa đạt toàn bộ mục bắt buộc không được tính Done và quay lại Product Backlog.

## Checklist bắt buộc cho mỗi PBI/Increment

### Requirement và traceability

- [ ] PBI/AC rõ, được PO xác nhận; link tới thiết kế/risk/test/defect liên quan.
- [ ] In/out scope và thay đổi đã được ghi nhận; không còn assumption quan trọng chưa xác minh.

### Code và cấu hình

- [ ] Code đã merge qua PR vào nhánh chuẩn; không commit secret hay dữ liệu nhạy cảm.
- [ ] Build, lint, formatter check và TypeScript type-check đều pass trên CI.
- [ ] Ít nhất 01 reviewer độc lập phê duyệt; finding Major/Critical đã đóng.
- [ ] Migration/config/API contract/README được cập nhật khi thay đổi ảnh hưởng chúng.

### Test

- [ ] Unit tests cho logic mới/thay đổi pass; test phải có assertion có ý nghĩa.
- [ ] Integration/E2E/security tests tương ứng risk và AC pass trên baseline.
- [ ] Regression liên quan pass; flaky/skip test có issue, owner và hạn xử lý.
- [ ] Coverage không giảm dưới baseline đã phê duyệt; exception có risk acceptance.
- [ ] Defect Critical/High liên quan = 0 open; defect còn lại có quyết định và residual risk.

### LIBIF-specific quality

- [ ] Upload kiểm tra type/size và xử lý lỗi an toàn; OCR job có trạng thái/retry/log phù hợp.
- [ ] Dữ liệu xuất bản đã qua human review; raw OCR accuracy không bị trình bày như post-review accuracy.
- [ ] RBAC/object authorization được test cả positive và negative cases.
- [ ] Dữ liệu lưu kho dùng cơ chế AES-GCM đã thiết kế; key/secret không nằm trong source/log.
- [ ] Giới hạn concurrent session được test điều kiện cạnh tranh.
- [ ] UI không công khai URL file gốc; tuyên bố bảo vệ chỉ đúng phạm vi SOW, không tuyên bố “không thể sao chép tuyệt đối”.
- [ ] Watermark/audit không làm lộ dữ liệu nhạy cảm quá mức; audit record đúng trường và truy vết được.

### Deploy, acceptance và evidence

- [ ] Deploy được lên staging bằng hướng dẫn/versioned configuration.
- [ ] PO kiểm tra AC trên staging; feedback đã ghi và phân loại.
- [ ] Evidence có commit/build, environment, date, executor và link artifact.
- [ ] Increment tích hợp với phần đã Done trước đó và ở trạng thái usable/demoable.

## DoD bổ sung cho Release

- [ ] AC-01…AC-08 trong SOW đã có kết quả và evidence.
- [ ] Full regression/fresh-install pass; Test Report được phê duyệt.
- [ ] Critical/High open = 0; open Medium/Low có owner hoặc risk acceptance.
- [ ] Known limitations, rollback/backup demo và release notes hoàn tất.
- [ ] Customer/UAT feedback được xử lý thành Accepted / Backlog / Change request / Rejected-with-rationale.
- [ ] Release/tag bất biến được tạo; checksum/artifact/link được lưu.

## Quy tắc thay đổi DoD

Thay đổi qua retrospective/quality review; ghi lý do, ảnh hưởng tới item đang làm, approver và ngày hiệu lực. Không hạ DoD hồi tố để biến một item chưa đạt thành Done.

