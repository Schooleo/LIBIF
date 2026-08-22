# Q14-Written — Mô hình Continuous Delivery của LIBIF

> Vẽ mô hình trước và đánh dấu rõ các quyết định của con người.

## Mô hình cần vẽ

    PR qua CI ──[review + merge]──> main
                                      │
                                      ▼
                         Staging Images / GitHub Actions
                            CI → GHCR full commit SHA
                                      │
                         [Ops chạy make staging-up]
                                      ▼
                    Self-hosted Staging + Tailscale Funnel
                                      │
                              UAT / system test
                                      │
                     [Con người tạo tag vMAJOR.MINOR.PATCH]
                                      ▼
                         Production / GitHub Actions
                         validate tag + chạy lại CI
                         ┌────────────┴────────────┐
                         ▼                         ▼
                 Vercel CLI deploy          GHCR image vX.Y.Z
                 Next.js từ source          → Azure VM qua OIDC
                                            → migration + Compose
                         └────────────┬────────────┘
                                      ▼
                          Health check + CD email

    Công cụ: GitHub Actions, GHCR, Docker Compose, Make,
    Tailscale Funnel, Vercel CLI, Azure/OIDC, Prisma, Caddy, SMTP.

## Giải thích

1. **Staging artifact**
   - WHAT: Merge main kích hoạt toàn bộ CI; nếu đạt, workflow publish API, migrate và Web image bằng full commit SHA.
   - WHY: SHA bất biến, giúp biết chính xác staging đang kiểm thử commit nào.

2. **Self-hosted Staging**
   - WHAT: Ops chủ động chạy make staging-up để kiểm tra đủ image, pull đúng SHA và triển khai bằng Compose; Tailscale Funnel cung cấp URL HTTPS cho UAT.
   - WHY: Kiểm tra nghiệp vụ và lỗi runtime trước release. Staging không tự drift khi main có commit mới.

3. **Release decision**
   - WHAT: Khi UAT đạt, người phụ trách tạo tag vMAJOR.MINOR.PATCH trên commit thuộc main.
   - WHY: Tag ghi nhận quyết định release và tạo version production có thể truy vết.

4. **Production**
   - Frontend: Vercel CLI build/deploy Next.js từ source đã kiểm chứng; Vercel không kéo Web Docker image.
   - Backend: GHCR publish API/migration image theo version; Azure VM đăng nhập qua OIDC, pull image, chạy Prisma migration, Compose và health check.
   - Email báo environment, release, kết quả và access URL.

## Tại sao đây là Continuous Delivery?

Pipeline tự động hóa kiểm tra, đóng gói và triển khai, nhưng con người vẫn review/merge, chọn lúc deploy staging, đánh giá UAT và tạo production tag. Vì còn **release decision**, LIBIF là Continuous Delivery, không phải Continuous Deployment hoàn toàn tự động.

## Tại sao LIBIF cần CD?

CD đưa đúng artifact đã qua quality gate tới đúng môi trường; tách dev/staging/production; chuẩn hóa migration, HTTPS và health check; giảm sai sót thao tác; truy vết release bằng SHA/version; đồng thời giữ quyền phê duyệt của Ops.

**Kết luận:** CD giúp LIBIF luôn ở trạng thái sẵn sàng release, nhưng chỉ phát hành production khi con người xác nhận bằng version tag.
