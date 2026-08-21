# CÂU TRẢ LỜI VẤN ĐÁP CUỐI KỲ

# 19. KẾ HOẠCH QUẢN LÝ CHẤT LƯỢNG PHẦN MỀM

## 19.1. Trình bày quá trình hình thành tài liệu QMP (Kế hoạch quản lý chất lượng trong dự án) của nhóm

Nhóm hình thành QMP theo chuỗi logic của bài giảng:

`Chọn đối tượng → chọn đặc tính → xác định chỉ số → chọn cách đo → đặt yêu cầu/ngưỡng → lập kế hoạch bảo đảm và kiểm soát chất lượng → thu thập bằng chứng → đánh giá và cải tiến`.

Áp dụng cho LIBIF:

1. **Chọn các đối tượng cần quản lý chất lượng**:
   - Sản phẩm: giao diện web, API, mã nguồn, dữ liệu OCR/biên mục, tài liệu được mã hóa và audit log.
   - Quy trình: làm rõ yêu cầu, lập trình, rà soát, kiểm thử, quản lý lỗi, quản lý thay đổi và Scrum.
   - Dự án: sản phẩm bàn giao, tiến độ, mức độ hoàn thành phạm vi và mức độ hài lòng của các bên liên quan.
   - Con người/môi trường: năng lực nhóm, CI/staging, Docker, PostgreSQL, Redis, MinIO và Tesseract.
2. **Thu thập yêu cầu** từ Tầm nhìn và Phạm vi, Danh sách sản phẩm PBI-01–PBI-16, các tiêu chí chấp nhận AC-01–AC-08 trong SOW, tài liệu kiến trúc và Sổ đăng ký rủi ro.
3. **Chọn đặc tính quan trọng**, như tính đúng đắn, mức độ phù hợp chức năng, độ tin cậy, hiệu năng, bảo mật, tính toàn vẹn, khả năng sử dụng, khả năng bảo trì, khả năng kiểm thử và tính khả chuyển.
4. **Chuyển đặc tính trừu tượng thành chỉ số đo**, chẳng hạn tỷ lệ ca kiểm thử đạt, số lỗi theo mức nghiêm trọng, thời gian phản hồi tìm kiếm, độ bao phủ kiểm thử, tỷ lệ tiêu chí chấp nhận đạt và mức độ hài lòng của khách hàng.
5. **Xác định chuẩn so sánh**. Theo bài giảng, nếu không có yêu cầu, đường cơ sở hoặc tiêu chuẩn thì không thể kết luận sản phẩm có chất lượng. Ví dụ, LIBIF đặt thời gian tìm kiếm dưới 2 giây theo PBI-10, không còn lỗi nghiêm trọng trước khi phát hành theo SOW và toàn bộ tiêu chí chấp nhận bắt buộc phải đạt trước nghiệm thu.
6. **Xác định biện pháp bảo đảm chất lượng (QA) và kiểm soát chất lượng (QC)**: quy chuẩn lập trình, Định nghĩa Hoàn thành (DoD), cổng kiểm tra CI, rà soát đồng cấp và đào tạo phòng ngừa; đồng thời thực hiện thanh tra, phân tích tĩnh, kiểm thử, theo dõi lỗi và kiểm thử chấp nhận của người dùng (UAT) để phát hiện sai sót.
7. **Phân vai, lập lịch, quy định bằng chứng và cơ chế thay đổi** trong QMP; trưởng nhóm kỹ thuật và nhân sự QA rà soát trước khi thiết lập đường cơ sở.
8. **Dùng dữ liệu từng Sprint để hiệu chỉnh** chỉ số, ngưỡng và ghi lịch sử phiên bản, thay vì coi QMP là tài liệu chỉ viết một lần.

## 19.2. Các câu hỏi chính QMP phải trả lời

Một QMP tốt phải trả lời được:

1. Chất lượng của **đối tượng nào** được quản lý: sản phẩm, quy trình, dự án, con người hay môi trường?
2. Những **đặc tính chất lượng nào** quan trọng và vì sao chúng phù hợp nhu cầu kinh doanh, người dùng và kỹ thuật?
3. Mỗi đặc tính được biểu diễn bằng **thuộc tính hoặc chỉ số nào**?
4. **Đo như thế nào**, bằng công cụ/dữ liệu nào, ở môi trường nào và tần suất nào?
5. **Chuẩn/ngưỡng chấp nhận** là gì?
6. Ai chịu trách nhiệm thực hiện, rà soát, phê duyệt và xử lý sai lệch?
7. Hoạt động **QA phòng ngừa** và **QC phát hiện** gồm những gì?
8. Sản phẩm nào cần rà soát, thanh tra, kiểm thử hoặc được khách hàng chấp nhận?
9. Phát hiện hoặc lỗi được báo cáo, sửa, kiểm thử lại và đóng như thế nào?
10. Bằng chứng được quản lý phiên bản, lưu giữ và truy xuất thế nào?
11. Khi yêu cầu, rủi ro hoặc đường cơ sở thay đổi thì QMP được cập nhật ra sao?

## 19.3. Đầu vào và các bước tạo QMP

### Đầu vào

- Bài toán nghiệp vụ, mục tiêu và kỳ vọng của khách hàng.
- Điều lệ Dự án, Tầm nhìn và Phạm vi, cùng SOW.
- Danh sách sản phẩm, câu chuyện người dùng, tiêu chí chấp nhận và Định nghĩa Sẵn sàng.
- Kiến trúc, nền tảng công nghệ và các thuộc tính chất lượng.
- Kế hoạch Dự án, ước lượng, lịch trình, giới hạn nguồn lực và Sổ đăng ký Rủi ro.
- Tiêu chuẩn, quy ước của tổ chức, quy chuẩn lập trình, DoD và quy định học phần.
- Dữ liệu lịch sử về lỗi, tốc độ nhóm, phát hiện khi rà soát, kết quả kiểm thử và phản hồi nếu có.

### Các bước

1. Thiết lập đường cơ sở cho đầu vào và giải quyết các điểm mâu thuẫn.
2. Lập ma trận nhu cầu chất lượng của các bên liên quan.
3. Chọn đối tượng và đặc tính chất lượng.
4. Xác định chỉ số, công thức, nguồn dữ liệu, người phụ trách, tần suất và ngưỡng.
5. Chọn tiêu chuẩn, cách thực hành, hoạt động rà soát, kiểm thử, công cụ và các cổng chất lượng.
6. Thiết kế quy trình báo cáo vấn đề, hành động khắc phục, lưu giữ hồ sơ, đào tạo, quản lý rủi ro và kiểm soát thay đổi.
7. Rà soát tính đầy đủ, khả thi, khả năng đo lường và khả năng truy vết.
8. Phê duyệt, thiết lập đường cơ sở, triển khai thử trong Sprint và cập nhật theo dữ liệu thực tế.

## 19.4. QMP được đánh giá như thế nào?

Không đánh giá QMP chỉ bằng việc “đủ mục lục”. Cần đánh giá ở ba tầng:

1. **Đánh giá chất lượng tài liệu**:
   - Đúng: không mâu thuẫn với SOW/Backlog/Architecture.
   - Đủ: có mục đích, tài liệu tham chiếu, cách quản lý, tài liệu hóa, tiêu chuẩn, chỉ số, hoạt động rà soát, kiểm thử, khắc phục, công cụ, hồ sơ, đào tạo, rủi ro và lịch sử thay đổi theo khung IEEE 730 được bài giảng giới thiệu.
   - Rõ và đo được: mỗi chỉ số có công thức, nguồn dữ liệu, người phụ trách và ngưỡng.
   - Có khả năng truy vết: mục tiêu chất lượng liên kết với yêu cầu, rủi ro, kiểm thử và bằng chứng.
2. **Đánh giá tính khả thi của kế hoạch**:
   - Công cụ, nhân lực, dữ liệu và lịch có thực hiện được trong 5 Sprint không?
   - Chi phí kiểm soát có tương xứng với rủi ro không? Bài giảng nhấn mạnh mục tiêu là chất lượng chấp nhận được với chi phí phù hợp, không phải chất lượng cao nhất bằng mọi giá.
3. **Đánh giá hiệu lực khi áp dụng**:
   - Cổng CI có ngăn mã nguồn không đạt chuẩn?
   - Hoạt động thanh tra có tìm được lỗi sớm?
   - Số lỗi, công việc làm lại và lỗi lọt sang giai đoạn sau có giảm?
   - AC, DoD, phản hồi khách hàng và tiêu chí phát hành có được đáp ứng?
   - Phát hiện từ hoạt động kiểm toán hoặc rà soát có hành động khắc phục và được đóng?

Kết quả đánh giá phải dẫn tới một quyết định: phê duyệt, phê duyệt kèm hành động khắc phục hoặc yêu cầu làm lại; không chỉ dừng ở nhận xét miệng.

## 19.5. Tại sao cần QMP?

- Chuyển khái niệm “phần mềm tốt” từ cảm tính thành yêu cầu đo được.
- Tạo hiểu biết chung giữa khách hàng, Chủ sản phẩm (PO), lập trình viên, nhân sự QA và người quản lý.
- Phòng ngừa lỗi sớm, giảm công việc làm lại và chi phí bảo trì.
- Cung cấp tiêu chí khách quan cho trạng thái hoàn thành, nghiệm thu và phát hành.
- Bảo đảm sự hài lòng của khách hàng, không chỉ hoàn thành phạm vi, thời gian và chi phí.
- Xác định trách nhiệm, công cụ, hồ sơ và cách xử lý sai lệch.
- Hỗ trợ kiểm toán, học hỏi từ dữ liệu và cải tiến liên tục.

## 19.6. QMP được sử dụng và cập nhật thế nào trong dự án?

QMP được dùng xuyên suốt:

- **Làm rõ yêu cầu và lập kế hoạch**: kiểm tra AC có thể kiểm thử hay không, nhận diện rủi ro chất lượng và ước lượng hoạt động rà soát, kiểm thử.
- **Phát triển**: áp dụng quy chuẩn lập trình, kiểm thử đơn vị, CI/CD và rà soát mã nguồn.
- **Trước khi chuyển sang Hoàn thành**: kiểm tra DoD và bằng chứng.
- **Kiểm thử và sàng lọc lỗi**: phân mức nghiêm trọng, quyết định kiểm thử lại, kiểm thử hồi quy và theo dõi chỉ số.
- **Rà soát Sprint và UAT**: so sánh Phần tăng trưởng với AC và thu thập phản hồi khách hàng.
- **Phát hành**: đối chiếu mục tiêu chất lượng, tiêu chí kết thúc và rủi ro còn lại để quyết định có phát hành hay không.
- **Cải tiến Sprint**: dùng Năm câu hỏi Tại sao, sơ đồ xương cá hoặc phân tích trường lực để xác định hành động cải tiến.

QMP cần tăng phiên bản khi thay đổi phạm vi, kiến trúc, rủi ro, chỉ số, ngưỡng, công cụ, vai trò hoặc quy trình nghiệm thu. Mỗi thay đổi phải ghi lý do, ảnh hưởng, người phê duyệt và ngày hiệu lực. Không được hạ ngưỡng hồi tố chỉ để biến kết quả không đạt thành đạt.

## 19.7. McCall và ISO 9126 hỗ trợ kiểm soát chất lượng thế nào?

Hai mô hình cung cấp một “từ điển chất lượng”, giúp nhóm không chỉ kiểm tra chức năng mà còn xem xét các thuộc tính phi chức năng.

### McCall

McCall nêu các yếu tố như tính đúng đắn, độ tin cậy, hiệu năng, tính toàn vẹn, khả năng sử dụng, khả năng bảo trì, khả năng kiểm thử, tính linh hoạt, tính khả chuyển, khả năng tái sử dụng và khả năng tương tác. Với LIBIF:

- Tính đúng đắn: tải lên, OCR, tìm kiếm và RBAC hoạt động đúng đặc tả.
- Tính toàn vẹn: người không có quyền không đọc được tài liệu.
- Hiệu năng: chức năng tìm kiếm đáp ứng ngưỡng thời gian.
- Khả năng bảo trì và kiểm thử: mô-đun rõ ràng, có thể kiểm tra quy tắc mã, kiểu dữ liệu, kiểm thử và rà soát.
- Tính khả chuyển: có thể cài đặt lại bằng Docker theo tài liệu README.

### ISO 9126

ISO 9126 tổ chức chất lượng thành sáu nhóm: chức năng, độ tin cậy, khả năng sử dụng, hiệu năng, khả năng bảo trì và tính khả chuyển, kèm các đặc tính con. Mô hình giúp lập danh sách kiểm tra có cấu trúc và ánh xạ `yêu cầu → đặc tính → chỉ số → kiểm thử`.

### Giá trị và giới hạn

- Giá trị: tạo thuật ngữ thống nhất, kiểm tra độ đầy đủ của yêu cầu, chọn chỉ số và cách kiểm thử phù hợp.
- Giới hạn: mô hình không tự cung cấp ngưỡng chung cho mọi dự án. Nhóm vẫn phải chọn đặc tính và ngưỡng theo các bên liên quan, bối cảnh, rủi ro và chi phí. Không nên đo tất cả thuộc tính chỉ để “đủ mô hình”.

## 19.8. Định tính khác định lượng thế nào?

| Tiêu chí | Định tính | Định lượng |
|---|---|---|
| Dạng dữ liệu | Mô tả, nhận xét, nhóm phân loại | Số lượng, tỷ lệ, thời gian, chi phí |
| Ví dụ LIBIF | giao diện khó hiểu; quy trình hợp lý; khách hàng hài lòng, trung lập hoặc không hài lòng | thời gian tìm kiếm p95 là 1,8 giây; 48/50 ca kiểm thử đạt; 2 lỗi mức cao |
| Ưu điểm | Giải thích nguyên nhân, cảm nhận và bối cảnh | So sánh với đường cơ sở, theo dõi xu hướng |
| Hạn chế | Có tính chủ quan, khó tổng hợp | Có thể tạo cảm giác chính xác giả nếu chỉ số hoặc mẫu đo sai |

Hai loại bổ sung nhau. Ví dụ rating usability bằng số cho biết mức độ, còn phỏng vấn/quan sát giải thích vì sao người dùng gặp khó khăn.

## 19.9. Đo chất lượng sản phẩm, quy trình và con người

Áp dụng năm bước của bài giảng: `đối tượng → đặc tính → chỉ số → phương pháp đánh giá → yêu cầu hoặc đường cơ sở`.

### Sản phẩm

- Tính đúng đắn: số lượng hoặc tỷ lệ AC hay ca kiểm thử đạt.
- Độ tin cậy: số lần hỏng, thời gian trung bình giữa hai lần hỏng hoặc kết quả phục hồi.
- Mật độ lỗi: số lỗi trên dòng mã, mô-đun hoặc điểm chức năng, nhưng phải nêu rõ cách tính kích thước.
- Hiệu năng: thời gian phản hồi, mức dùng CPU và RAM với tải công việc xác định.
- Khả năng sử dụng: tỷ lệ hoàn thành tác vụ, thời gian học cách sử dụng và phản hồi định tính.
- Khả năng bảo trì: độ phức tạp, phát hiện khi rà soát, thời gian sửa lỗi và ảnh hưởng hồi quy.

### Quy trình

- Hoạt động và sản phẩm công việc theo kế hoạch so với thực tế.
- Thời gian chu trình, độ bao phủ rà soát, số lỗi được loại bỏ trước kiểm thử và tỷ lệ mở lại lỗi.
- Khối lượng làm lại do đặc tả không khớp kết quả.
- Tỷ lệ hành động cải tiến sau Sprint được hoàn thành.
- Chỉ số phải dùng để cải tiến quy trình, không dùng đơn lẻ để quy trách nhiệm cá nhân.

### Dự án

- Tỷ lệ sản phẩm bàn giao hoàn thành so với kế hoạch.
- Sai lệch lịch trình và chi phí, mức hoàn thành phạm vi và sự hài lòng của khách hàng.
- Mức phơi nhiễm rủi ro, thời gian tồn đọng của thay đổi hoặc vấn đề và mức hoàn thành mục tiêu.

### Con người

- Kinh nghiệm phù hợp với lĩnh vực, mức bao phủ đào tạo và kỹ năng, khả năng cộng tác và mức độ hài lòng.
- Có thể kết hợp tự đánh giá, phản hồi đồng cấp, ma trận năng lực, số năm kinh nghiệm và tỷ lệ hoàn thành đào tạo.
- Không dùng số dòng mã, số lần xác nhận mã hay số lỗi cá nhân như thước đo chất lượng độc lập vì dễ bị thao túng và không phản ánh tinh thần đồng đội hoặc độ khó công việc.

## 19.10. Hạn chế tài liệu dự án sai yêu cầu khách hàng

- Khai thác yêu cầu qua phỏng vấn, hội thảo, quan sát và mô hình hóa quy trình thực tế.
- Dùng bản mẫu, bản đồ câu chuyện, ca sử dụng, cấu trúc Cho trước – Khi – Thì và bảng thuật ngữ để giảm cách hiểu khác nhau.
- Thiết lập đường cơ sở cho yêu cầu và duy trì khả năng truy vết tới mục tiêu, AC và kiểm thử.
- Rà soát tài liệu với khách hàng, PO và người thực hiện; ghi nhận ý kiến, hành động và phê duyệt.
- Trình diễn sớm, thực hiện UAT và lập báo cáo phản hồi; chuyển phản hồi thành mã lỗi, mục trong Danh sách sản phẩm hoặc mã thay đổi.
- Quản lý phiên bản và thay đổi; cập nhật tất cả tài liệu bị ảnh hưởng.
- Dùng danh sách kiểm tra về tính đúng đắn, đầy đủ, nhất quán, rõ ràng, khả thi và khả năng kiểm thử.

## 19.11. Hạn chế mã nguồn sai thiết kế

- Rà soát kiến trúc, thiết kế và ghi lại các quyết định quan trọng.
- Chia module, API contract, schema và dependency rule rõ ràng.
- Quy chuẩn lập trình về định dạng, bố cục tệp, xử lý lỗi, sự kiện và ghi nhật ký.
- Phân tích tĩnh, kiểm tra kiểu, cổng tạo bản dựng và kiểm thử kiến trúc nếu có.
- Đối chiếu yêu cầu hợp nhất mã và kết quả thanh tra mã nguồn với PBI, AC, thiết kế và rủi ro.
- Thiết kế đơn giản: dễ hiểu với người đọc, truyền đạt rõ ý, có cấu trúc hợp lý và tối giản.
- Phát hiện các dấu hiệu mã nguồn có vấn đề như *Divergent Change*, *Shotgun Surgery*, *Time Dependency*, *Half-Baked Object*, sau đó tái cấu trúc và kiểm thử hồi quy. Đây là tên riêng của các dạng vấn đề trong mã nguồn nên giữ tiếng Anh.
- Không cho hợp nhất mã khi phát hiện mức nghiêm trọng hoặc mức cao chưa được đóng, trừ khi rủi ro đã được chấp nhận chính thức.

## 19.12. Hạn chế phần mềm hoạt động sai yêu cầu khách hàng

- Viết tiêu chí chấp nhận có thể kiểm thử và thiết kế kiểm thử từ sớm.
- Thực hiện kiểm thử đơn vị, tích hợp, đầu cuối và kiểm thử thăm dò với các trường hợp không có, có một, có nhiều, giá trị quá lớn hoặc quá nhỏ, thao tác CRUD, sai kiểu dữ liệu và đầu vào độc hại.
- Tích hợp kiểm thử vào CI/CD để phát hiện lỗi hồi quy sau mỗi thay đổi.
- Kiểm thử dựa trên rủi ro, ưu tiên RBAC, mã hóa, xử lý đồng thời, OCR và nhật ký kiểm toán của LIBIF.
- Kiểm thử trên dữ liệu và môi trường đại diện; xác định kết quả mong đợi và căn cứ đối chiếu trước khi chạy.
- Theo dõi, sàng lọc, sửa, kiểm thử lại và kiểm thử hồi quy lỗi, đồng thời bảo đảm khả năng truy vết.
- Khách hàng thực hiện UAT vì hoạt động này vừa kiểm chứng sản phẩm vừa là phương tiện giao tiếp.
- Chỉ chuyển sang Hoàn thành khi Phần tăng trưởng đạt DoD và sẵn sàng đưa vào vận hành trong phạm vi của dự án.

---
