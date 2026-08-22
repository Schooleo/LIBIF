# Q15-Written — Mô hình DevOps của LIBIF

> Vẽ vòng lặp trước, sau đó thêm ba lane môi trường.

## Mô hình cần vẽ

                              ┌─────────────────────────────┐
                              │                             ▼
    PLAN → CODE → CI/TEST → RELEASE → DEPLOY → OPERATE → OBSERVE
      ▲      Git/PR/Actions    GHCR     scripts     health/log/email
      └──────────────────── FEEDBACK ◄──────────────────────┘

    Hạ tầng: Bicep → Azure VM/network/disk/identity
              cloud-init → Linux/Docker baseline
              Dockerfile → application image
              Compose → runtime services
              Make/scripts + Actions → automation

    ┌────────────────┬────────────────────┬──────────────────────┐
    │ DEV            │ STAGING            │ PRODUCTION           │
    ├────────────────┼────────────────────┼──────────────────────┤
    │ branch dev     │ branch main        │ tag vMAJOR.MINOR.PATCH│
    │ image latest   │ image full SHA     │ backend image vX.Y.Z │
    │ local/dev test │ Compose + Funnel   │ Web Vercel + API Azure│
    └────────────────┴────────────────────┴──────────────────────┘

## Giải thích

1. **Plan/Code:** nhóm chọn công việc, phát triển trên branch và mở PR để gắn thay đổi với mục tiêu và người chịu trách nhiệm.
2. **CI/Test:** GitHub Actions chạy lint, build và nhiều lớp test để phản hồi sớm, chặn lỗi trước môi trường sau.
3. **Release/Deploy:** GHCR lưu image; Vercel, Azure, Compose và scripts đưa đúng version vào đúng môi trường, giúp deployment lặp lại và truy vết được.
4. **Operate/Observe:** Ops xem health check, status/log và email; QA thực hiện UAT. Feedback được đưa lại backlog/PR để bắt đầu vòng mới.

Các lớp cấu hình có mục đích khác nhau: **Bicep** tạo tài nguyên Azure có version; **cloud-init** chuẩn bị VM; **Dockerfile** build image; **Compose** định nghĩa API, worker, PostgreSQL, Redis, MinIO và migration; **Make/scripts/Actions** chuẩn hóa validation, publish, deploy và notification. Nhờ đó nhóm giảm thao tác nhớ tay và khác biệt môi trường.

## Vận hành đồng thời nhiều version

- **Dev:** branch dev có tag latest để developer nhanh lấy bản tích hợp; môi trường chỉ đổi khi chủ động pull/redeploy.
- **Staging:** pin full SHA từ main, nên giữ nguyên trong UAT dù main có commit mới.
- **Production:** dùng semantic version đã duyệt; frontend ở Vercel và backend ở Azure cùng bắt nguồn từ commit được tag.

Mỗi môi trường có URL, environment file, credential, Compose project, network và volume riêng, nên có thể chạy song song mà không ghi đè version hoặc dữ liệu.

## Tại sao LIBIF cần DevOps?

DevOps nối Development, QA và Operations trong một feedback loop; đưa chất lượng/vận hành vào sớm; giảm lỗi cấu hình; truy vết code → test → artifact → deployment; cho phép staging kiểm thử version mới trong khi production vẫn ổn định.

**Kết luận:** DevOps không chỉ là Docker hay GitHub Actions; đó là quy trình cộng tác và tự động hóa có kiểm soát để biết rõ version nào đang chạy, ai quyết định release và kết quả vận hành ra sao.
