# Q13-Prepare — Chuẩn bị vấn đáp về Continuous Integration

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu khái niệm hoặc quyết định của nhóm.
2. **Dẫn chứng LIBIF:** chỉ vào đúng node trên mô hình hoặc đúng bản in.
3. **Giá trị quản lý:** nói lỗi/rủi ro nào được phát hiện hoặc giảm bớt.

Điểm neo phải nhớ:

    PR → GitHub Actions → API/Web quality gates
       → PASS thì review/merge
       → FAIL thì email PR owner, sửa và chạy lại

## Câu hỏi có thể được hỏi

### 1. CI của nhóm bắt đầu khi nào?

**Trả lời:** CI chạy khi có Pull Request vào dev hoặc main; push mới lên PR sẽ chạy lại các job liên quan. Push vào dev cũng chạy quality gate trước khi publish image latest cho môi trường dev testing.

**Giữ đúng trọng tâm:** Trigger là thay đổi mã nguồn; CI kiểm chứng trước khi tích hợp.

### 2. Tại sao phải có cả lint, build và test?

**Trả lời:** Ba bước tìm ba nhóm vấn đề khác nhau. Lint giữ coding standards; build xác nhận dự án biên dịch được; test kiểm tra hành vi. Chỉ build thành công không chứng minh nghiệp vụ hoặc tích hợp đúng.

**Liên hệ bản in:** Chỉ vào Makefile make verify và hai workflow CI.

### 3. Unit test, integration test và E2E test khác nhau thế nào?

**Trả lời:** Unit test kiểm tra module nhỏ; worker integration test kiểm tra PostgreSQL, Redis, MinIO và OCR worker phối hợp; E2E test kiểm tra luồng API hoàn chỉnh. Phạm vi càng rộng thì càng gần môi trường thật nhưng chạy tốn thời gian hơn.

### 4. Lỗi nào build không bắt được nhưng integration test bắt được?

**Trả lời:** Ví dụ API vẫn biên dịch nhưng worker không kết nối Redis, không đọc file từ MinIO hoặc không ghi trạng thái vào PostgreSQL. Worker integration test khởi động cả hạ tầng nên bắt được lỗi kết nối và luồng xử lý này.

### 5. Nếu CI fail thì nhóm xử lý thế nào?

**Trả lời:** GitHub chặn trạng thái đạt của PR, email báo cho PR owner, người đó mở workflow log, sửa lỗi và push lại. Pipeline tự chạy lại cho đến khi pass; nhóm không bỏ qua gate để merge.

### 6. Tại sao tách API CI và Web CI?

**Trả lời:** Backend và frontend có tool/test khác nhau, nên tách giúp phản hồi rõ và có thể chạy song song. Tuy nhiên thay đổi shared contract hoặc deployment configuration vẫn có thể kích hoạt cả hai để tránh lỗi tích hợp.

### 7. Email có vai trò gì khi GitHub đã hiển thị trạng thái?

**Trả lời:** Email là kênh chủ động: người chịu trách nhiệm không cần liên tục mở GitHub vẫn nhận được repository, PR, commit, kết quả và link workflow. Nó rút ngắn thời gian từ lúc lỗi xuất hiện đến lúc bắt đầu sửa.

### 8. Ai nhận email CI?

**Trả lời:** Workflow cố gắng gửi cho tác giả PR bằng email GitHub công khai hoặc email commit hợp lệ; nếu không tìm được thì dùng địa chỉ fallback đã cấu hình. SMTP_FROM chỉ là người gửi, không mặc định là người nhận.

### 9. CI có tự deploy hệ thống không?

**Trả lời:** Không. CI chủ yếu kiểm tra và tạo niềm tin cho artifact. Deployment thuộc CD. Trong LIBIF, các workflow CD chỉ chạy sau quality gate và còn có quyết định của con người như merge main, triển khai staging hoặc tạo version tag.

### 10. Tại sao dự án sinh viên vẫn cần CI?

**Trả lời:** Nhóm có nhiều thành viên và nhiều dịch vụ; lỗi tích hợp vẫn xảy ra dù quy mô nhỏ. GitHub Actions giảm kiểm tra thủ công, bảo vệ tiến độ 10 tuần và tạo bằng chứng rõ ràng cho Definition of Done.

### 11. Nếu test trên máy developer pass nhưng GitHub Actions fail thì sao?

**Trả lời:** Kết quả CI là chuẩn chung vì chạy trong môi trường sạch và lặp lại. Nhóm đọc log để tìm dependency, environment hoặc assumption chỉ tồn tại trên máy cá nhân, sau đó sửa script/config để hai môi trường nhất quán.

### 12. CI có bảo đảm phần mềm không còn lỗi không?

**Trả lời:** Không. CI giảm rủi ro bằng các kiểm tra tự động đã định nghĩa; nó không thay thế code review, UAT hoặc system test. Vì vậy sau CI, LIBIF còn có staging để Ops/nhóm kiểm thử nghiệp vụ.

## Điều không nên nói

- Không nói build pass nghĩa là hệ thống chắc chắn chạy đúng.
- Không nói CI tự động đưa code lên production.
- Không nói tất cả test đều là unit test.
- Không nói email luôn gửi về SMTP_FROM; đó là sender, recipient là PR owner hoặc fallback.
- Không kể công cụ nhóm chưa triển khai như Jenkins, SonarQube hoặc Kubernetes.
