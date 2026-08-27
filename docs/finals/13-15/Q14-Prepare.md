# Q14-Prepare — Chuẩn bị vấn đáp về Continuous Delivery

## Điểm neo phải nhớ

    main → CI → GHCR full SHA → Ops deploy staging → UAT
         → con người tạo vX.Y.Z → automated production pipeline

Đây là Continuous Delivery vì pipeline sẵn sàng release nhưng con người vẫn đưa ra release decision.

## Cấu trúc trả lời

1. Nêu bước nào tự động và bước nào cần con người.
2. Chỉ ra artifact/environment cụ thể của LIBIF.
3. Kết luận lợi ích: kiểm soát rủi ro, truy vết, giảm thao tác sai.

## Câu hỏi có thể được hỏi

### 1. Continuous Delivery khác Continuous Deployment thế nào?

**Trả lời:** Continuous Delivery tự động hóa build, test, đóng gói và chuẩn bị/deploy theo pipeline, nhưng production release vẫn có quyết định của con người. Continuous Deployment sẽ tự đưa mọi thay đổi đạt gate lên production mà không cần release decision thủ công.

**LIBIF:** Ops kiểm thử staging rồi chủ động tạo tag vMAJOR.MINOR.PATCH; vì vậy là Continuous Delivery.

### 2. Main có tự động deploy lên staging host không?

**Trả lời:** Không. Main tự chạy CI và publish image bằng full SHA. Ops chạy make staging-up để chọn và triển khai SHA mới nhất đã thành công. Email staging cũng nói rõ image đã publish nhưng host cần pull commit đó.

### 3. Tại sao staging dùng full commit SHA?

**Trả lời:** Full SHA là bất biến và xác định chính xác code. Ops, QA và developer cùng biết staging đang chạy commit nào; main có commit mới cũng không làm môi trường đã deploy tự thay đổi.

### 4. Nếu main có thay đổi mới sau khi staging đã deploy thì sao?

**Trả lời:** Staging vẫn chạy SHA đã pin. Chỉ khi Ops chủ động chạy lại staging-up thì script mới lấy SHA thành công mới nhất, kiểm tra đủ bộ image rồi triển khai. Vì vậy môi trường kiểm thử không drift giữa buổi UAT.

### 5. Tại sao dev dùng latest nhưng staging và production không dùng?

**Trả lời:** latest tiện để developer nhanh lấy bản tích hợp mới nhất, nhưng là tag có thể thay đổi. Staging cần truy vết bằng SHA; production cần phiên bản đã phê duyệt bằng semantic version. Mỗi môi trường có tag policy riêng để không triển khai nhầm.

### 6. Ai quyết định production release?

**Trả lời:** Người phụ trách release/Ops dựa trên CI, UAT và system test ở staging. Khi chấp nhận, họ tạo tag đúng dạng vMAJOR.MINOR.PATCH trên commit thuộc main; tag này là tín hiệu bắt đầu production pipeline.

### 7. Production pipeline làm gì sau khi có tag?

**Trả lời:** Workflow kiểm tra format và main ancestry, chạy lại toàn bộ API/Web quality gate, deploy frontend bằng Vercel CLI, publish API/migration images lên GHCR bằng version tag, deploy backend lên Azure qua OIDC, chạy migration/Compose và health check, sau đó gửi email kết quả.

### 8. Vercel có dùng libif-web Docker image không?

**Trả lời:** Không. Vercel CLI build và deploy Next.js từ source đã được quality gate kiểm chứng. Workflow vẫn publish web image có semantic tag để giữ bộ release đầy đủ và hỗ trợ phương án self-hosted, nhưng Vercel production không consume image đó.

### 9. Azure dùng artifact nào?

**Trả lời:** Azure VM kéo libif-api và libif-migrate từ GHCR với đúng semantic version tag. API và OCR worker dùng cùng API image; migration image chạy schema update trước khi application khởi động.

### 10. Khi deploy backend v1.0.2, Bicep có tạo lại VM không?

**Trả lời:** Không. Bicep dùng để khởi tạo/thay đổi tài nguyên hạ tầng khi cần. Release ứng dụng thông thường chỉ kéo image v1.0.2, chạy migration và cập nhật container; VM, network, disk và identity giữ nguyên.

### 11. Tại sao migration phải nằm trong pipeline?

**Trả lời:** Ứng dụng mới có thể cần schema mới. Prisma migration bảo đảm database thay đổi theo version có kiểm soát và chạy trước API/worker; tránh trường hợp code mới chạy với schema cũ rồi lỗi startup hoặc sai dữ liệu.

### 12. Nếu deployment fail thì chuyện gì xảy ra?

**Trả lời:** Job báo fail, downstream success không được công nhận, health check không đạt và email gửi workflow run cho người chịu trách nhiệm. Ops đọc log, sửa cấu hình/code rồi chạy lại theo quy trình; không tuyên bố release thành công chỉ vì image đã được publish.

### 13. Tại sao cần cả Staging và Production?

**Trả lời:** Staging dùng dữ liệu demo và dành cho UAT/system test, có thể thay đổi chủ động. Production phục vụ người dùng thật, dùng version đã phê duyệt và cấu hình/credential riêng. Tách hai môi trường tránh thử nghiệm ảnh hưởng dịch vụ thật.

### 14. LIBIF làm HTTPS thế nào khi không có domain riêng?

**Trả lời:** Frontend dùng libif.vercel.app. Browser gọi đường dẫn /api cùng origin; Vercel rewrite sang hostname do Azure quản lý. Caddy cung cấp HTTPS cho backend. Staging dùng Tailscale Funnel và domain ts.net.

### 15. Tại sao dùng OIDC với Azure?

**Trả lời:** GitHub nhận quyền Azure ngắn hạn gắn với repository và production environment, thay vì lưu một Azure client secret dài hạn. Về quản lý dự án, điều này giảm rủi ro credential bị lộ và xác định rõ pipeline nào được phép deploy.

### 16. Email CD được gửi cho ai?

**Trả lời:** Workflow tìm release owner từ PR gắn với commit; nếu không có email hợp lệ thì dùng các fallback đã cấu hình. Email có environment, release, commit, kết quả và access URL để người chịu trách nhiệm kiểm tra ngay.

### 17. Có rollback tự động không?

**Trả lời:** Hiện nhóm có artifact bất biến nên có cơ sở chọn lại version trước, nhưng chưa triển khai rollback database/application hoàn toàn tự động. Đây là giới hạn cần nói trung thực; Ops phải đánh giá compatibility của migration và thực hiện rollback có kiểm soát.

## Điều không nên nói

- Không nói merge main tự động thay đổi self-hosted staging.
- Không gọi pipeline là Continuous Deployment hoàn toàn tự động.
- Không nói Vercel kéo web Docker image.
- Không nói latest là version bất biến.
- Không nói Bicep chạy lại cho mỗi application release.
- Không khẳng định có automated rollback/backup nếu bản in không chứng minh điều đó.
