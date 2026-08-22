# Q13-Written — Mô hình Continuous Integration của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình trước, sau đó giải thích WHAT và WHY.

## Mô hình cần vẽ

    Developer ──commit/push──> Pull Request vào dev/main
                                      │
                                      ▼
                               GitHub Actions
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
               API CI                                  Web CI
        ESLint → NestJS build                  ESLint → Next.js build
        → Jest unit test                       → Vitest component test
        → Worker integration → E2E
                  └───────────────────┬───────────────────┘
                         FAIL         │          PASS
                          ▼           │           ▼
              Email PR owner → sửa   │      Review + merge
                          └── push lại┘

    Công cụ: Git/GitHub, GitHub Actions, npm, ESLint,
    Jest, Vitest, Docker Compose và SMTP email.

## Giải thích

1. **Git và Pull Request**
   - WHAT: Mỗi thay đổi được commit trên branch và mở PR vào dev/main.
   - WHY: Tạo điểm tích hợp chung để review, truy vết người thực hiện và không đưa code chưa kiểm chứng trực tiếp vào branch cốt lõi.

2. **GitHub Actions**
   - WHAT: Tự chạy cùng một pipeline khi PR được mở hoặc có push mới.
   - WHY: Mọi thành viên được kiểm tra bằng quy trình giống nhau, không phụ thuộc máy cá nhân hay thao tác nhớ tay.

3. **Quality gate**
   - Lint giữ coding standards; build xác nhận API/Web biên dịch được.
   - Unit/component test kiểm tra module nhỏ.
   - Worker integration test kiểm tra PostgreSQL, Redis, MinIO và OCR worker phối hợp.
   - E2E kiểm tra luồng API hoàn chỉnh.

   WHY: Build thành công vẫn có thể sai nghiệp vụ hoặc lỗi khi kết nối service; nhiều lớp test giúp phát hiện lỗi sớm trước merge.

4. **Phản hồi**
   - WHAT: GitHub hiển thị từng job; email gửi kết quả và workflow link cho PR owner.
   - WHY: Người chịu trách nhiệm biết lỗi nhanh, sửa và push lại cho đến khi pass.

## Tại sao LIBIF cần CI?

LIBIF có Next.js, NestJS, database, queue, storage và OCR worker; thay đổi một phần có thể gây regression phần khác. CI giúp phát hiện lỗi sớm, bảo vệ dev/main, giữ coding standards thống nhất, hỗ trợ nhiều thành viên tích hợp thường xuyên và tạo bằng chứng chất lượng trước CD.

**Kết luận:** CI là vòng lặp tự động **push → kiểm tra → phản hồi → sửa → kiểm tra lại**. CI chưa tự release; nó bảo đảm phiên bản đủ chất lượng để nhóm review và tích hợp.
