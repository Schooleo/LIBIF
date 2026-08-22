# Q15-Prepare — Chuẩn bị vấn đáp về DevOps

## Điểm neo phải nhớ

DevOps không phải một công cụ riêng lẻ. DevOps là vòng lặp cộng tác:

    Plan → Code → Test → Release → Deploy → Operate → Feedback → Plan

LIBIF dùng ba policy version:

    dev = latest | staging = full SHA | production = vMAJOR.MINOR.PATCH

## Cấu trúc trả lời

1. Nêu vai trò trong vòng lặp DevOps.
2. Dẫn đúng file/tool trong bản in.
3. Nói lợi ích quản lý: nhất quán, truy vết, giảm rủi ro, phản hồi nhanh.

## Câu hỏi có thể được hỏi

### 1. DevOps là gì? Có phải chỉ là Docker không?

**Trả lời:** Không. DevOps là cách Development, QA và Operations cùng chịu trách nhiệm cho vòng đời phần mềm, kết hợp quy trình, tự động hóa và phản hồi. Docker chỉ là một công cụ đóng gói/runtime trong mô hình đó.

### 2. DevOps khác CI/CD thế nào?

**Trả lời:** CI/CD là phần tự động hóa quan trọng của DevOps. DevOps rộng hơn, bao gồm planning, collaboration, infrastructure, deployment, vận hành, quan sát và feedback trở lại công việc tiếp theo.

### 3. Infrastructure as Code của nhóm là gì?

**Trả lời:** Nhóm lưu mô tả hạ tầng dưới dạng file có version trong Git. Azure Bicep tạo cloud resources; cloud-init chuẩn bị VM; Docker Compose định nghĩa runtime services. Nhờ vậy cấu hình có thể review và tái lập thay vì phụ thuộc thao tác nhớ tay trên portal.

### 4. Bicep, Dockerfile và Docker Compose khác nhau thế nào?

**Trả lời:** Bicep tạo hạ tầng Azure như VM/network/disk/identity. Dockerfile định nghĩa cách build một application image. Compose định nghĩa nhiều container chạy cùng nhau, dependency, network, volume và health check. Chúng giải quyết ba lớp khác nhau.

### 5. Makefile và deployment script có vai trò gì?

**Trả lời:** Chúng là giao diện thao tác có guardrail: validate environment/tag/SHA, chọn đúng artifact, gọi Compose và health check. Mục đích là để developer/Ops thực hiện cùng một quy trình ngắn, giảm sai lệnh thủ công.

### 6. GitHub Actions có vai trò gì trong DevOps model?

**Trả lời:** Actions điều phối CI/CD: nhận trigger từ PR, main hoặc version tag; chạy quality gate; publish artifact; gọi Vercel/Azure; ghi log và gửi email. Nó tạo audit trail từ commit đến kết quả deployment.

### 7. Nhóm vận hành đồng thời nhiều version như thế nào?

**Trả lời:** Dev có thể dùng latest từ branch dev; staging pin full SHA từ main; production dùng semantic version đã duyệt. Mỗi môi trường có URL, environment file, credential, Compose project và volume riêng nên chạy song song mà không tự ghi đè version hoặc dữ liệu của nhau.

### 8. Tại sao latest chỉ dùng cho dev?

**Trả lời:** latest là moving tag: cùng một tên có thể trỏ sang image mới. Điều này thuận tiện cho dev testing nhưng không đủ truy vết cho UAT/production. SHA và semantic version pin artifact identity, nên phù hợp với môi trường cần ổn định.

### 9. Nếu Dev B merge code sau khi Dev A đã deploy latest thì môi trường Dev A có tự đổi không?

**Trả lời:** Tag trên registry đổi, nhưng container đang chạy không tự đổi chỉ vì tag đổi. Môi trường Dev A chỉ nhận version mới khi chủ động pull/redeploy. Team communication giúp thống nhất thời điểm cập nhật; nếu cần bất biến thì dùng SHA/version pin.

### 10. Khi production update backend v1.0.2, hạ tầng có bị tạo lại không?

**Trả lời:** Không. Application deployment kéo image v1.0.2, chạy migration và cập nhật containers. Bicep chỉ cần chạy lại khi thực sự thay đổi VM, network, disk hoặc identity. Điều này tách vòng đời application khỏi vòng đời infrastructure.

### 11. Feedback loop của LIBIF nằm ở đâu?

**Trả lời:** CI/CD logs và email báo cho người chịu trách nhiệm; health endpoint, Compose status/log phản ánh runtime; QA/Ops thực hiện UAT ở staging. Kết quả được chuyển thành sửa code, PR hoặc backlog item rồi đi lại vòng Plan/Code.

### 12. Nhóm có monitoring hoàn chỉnh chưa?

**Trả lời:** Nhóm hiện có monitoring cơ bản: container health check, API health endpoint, workflow log, Docker log và email kết quả. Chưa có hệ thống metrics/alert chuyên sâu như Prometheus/Grafana; đây là cải tiến sau nếu dự án vận hành lâu dài.

### 13. Secrets được quản lý thế nào?

**Trả lời:** File môi trường thật bị bỏ khỏi Git; repo chỉ lưu file example. CI/CD credential nằm trong GitHub Secrets hoặc protected environment variables; Azure dùng OIDC credential ngắn hạn. Staging secret nằm trên host trong file có quyền hạn chế.

### 14. Tại sao staging self-hosted nhưng production dùng Vercel/Azure?

**Trả lời:** Staging phục vụ demo/UAT chi phí thấp và cần chạy full stack cùng nhau, nên Compose + Tailscale Funnel phù hợp. Production tách frontend lên Vercel và backend persistent workload lên Azure VM để dùng đúng thế mạnh mỗi nền tảng và Azure for Students.

### 15. DevOps có loại bỏ vai trò con người không?

**Trả lời:** Không. Tự động hóa thay thế thao tác lặp lại, còn con người review PR, đánh giá UAT, quyết định release, xử lý incident và ưu tiên feedback. Mục tiêu là quyết định tốt hơn với bằng chứng nhanh hơn.

### 16. Lợi ích lớn nhất của DevOps với dự án 10 tuần là gì?

**Trả lời:** Feedback sớm và quy trình lặp lại giúp nhóm không dồn tích hợp/triển khai đến cuối kỳ. Mỗi thay đổi có thể đi qua cùng quality gate, staging và release path, nên giảm regression và bảo vệ tiến độ.

### 17. Điểm yếu hiện tại của mô hình production là gì?

**Trả lời:** Backend chạy trên một Azure VM và data disk trong một region, nên còn single point of failure; backup/restore và rollback tự động chưa được kiểm chứng đầy đủ. Với phạm vi học phần đây là trade-off chi phí, nhưng sản phẩm thật cần backup ngoài VM, monitoring và high availability.

### 18. Nếu thầy hỏi công cụ nào thuộc bước nào, trả lời sao?

**Trả lời ngắn:**

- Plan/Code: GitHub, Git, branch và PR.
- CI/Test: GitHub Actions, ESLint, Jest, Vitest, Docker Compose.
- Release: GHCR, full SHA và semantic tag.
- Deploy: Make/scripts, Vercel CLI, Azure CLI/OIDC, Compose, Prisma.
- Operate/Observe: Caddy/Tailscale/Nginx, health check, logs, email và UAT.

## Điều không nên nói

- Không đồng nhất DevOps với một người hoặc một công cụ.
- Không nói latest làm container đang chạy tự cập nhật.
- Không nói Bicep quản lý runtime container hoặc Compose tạo Azure VM.
- Không nói Vercel consume production web image.
- Không nói nhóm đã có high availability, automated backup/rollback hay observability đầy đủ.
- Không kể Kubernetes, Terraform, Jenkins, Prometheus/Grafana như công cụ đã dùng.
