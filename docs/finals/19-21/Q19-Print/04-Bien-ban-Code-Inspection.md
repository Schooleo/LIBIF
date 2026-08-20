# BIÊN BẢN CODE INSPECTION — LIBIF

## A. Thông tin phiên

| Trường | Giá trị |
|---|---|
| Inspection ID / Date-time | `CI-[ ]` / `[ ]` |
| PBI/PR/commit | `[ ]` / `[URL]` / `[full SHA]` |
| Module/files/LOC changed | `[ ]` |
| Mục tiêu/risk | `[ ]` |
| Author | `[ ]` |
| Moderator / Reader / Recorder / Inspectors | `[ ]` |
| Pre-check evidence | build `[ ]`; lint `[ ]`; tests `[ ]` |

## B. Entry checklist

- [ ] Scope nhỏ và diff ổn định; author đã self-review.
- [ ] Requirement/AC/design/risk có sẵn; build/static checks pass hoặc failure đã biết.
- [ ] Reviewer độc lập với author; security-sensitive scope có reviewer phù hợp.

## C. Checklist inspection

- [ ] Correctness: code đáp ứng AC, boundary/error/state/concurrency đúng.
- [ ] Design: dependency/module responsibility/API/schema nhất quán kiến trúc.
- [ ] Maintainability: naming, duplication, complexity, dead code, comments có lý do.
- [ ] Type/error/logging: không nuốt lỗi; log có context nhưng không lộ secret/PII.
- [ ] Security: input/upload validation; authn + object-level authz; injection/path traversal; secret/key/nonce; crypto API; rate/abuse; audit.
- [ ] Data/concurrency: transaction, idempotency, Redis lock/atomicity, retry/timeout.
- [ ] Test quality: meaningful assertion, positive/negative/boundary, determinism, cleanup.
- [ ] Operations: configuration, migration, observability, backward compatibility/rollback.

## D. Findings

| Finding ID | File:line / symbol | Category | Severity | Observation + violated criterion | Recommended action | Owner | Due | Status / fix commit | Verification |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

Severity: Critical/Major/Minor/Observation. Đây là severity của inspection finding, không tự động đồng nhất defect severity.

## E. Kết luận và follow-up

| Metric | Value |
|---|---:|
| Preparation / meeting / rework time | `[ ] / [ ] / [ ]` |
| Findings Critical/Major/Minor | `[ ] / [ ] / [ ]` |
| Decision | Accept / Accept after rework / Re-inspection required / Reject |
| Open action IDs | `[ ]` |

Moderator chỉ đóng phiên sau khi kiểm tra fix commit và cập nhật từng finding. Đính kèm PR diff, CI log và ảnh/export approval; không chỉ chụp màn hình cuộc họp.

| Vai trò | Họ tên | Xác nhận | Ngày |
|---|---|---|---|
| Author | | | |
| Moderator | | | |
| Inspector | | | |

