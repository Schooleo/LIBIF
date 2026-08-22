# Q2-Prepare — Chuẩn bị vấn đáp về Tầm nhìn và Phạm vi Dự án

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu nội dung chính của tài liệu.
2. **Dẫn chứng LIBIF:** chỉ đúng mục trong bản in Vision & Scope.
3. **Giá trị quản lý:** nói tại sao tài liệu này bảo vệ dự án.

Điểm neo phải nhớ:

    ĐẦU VÀO: Project Proposal đã phê duyệt
         ↓
    ĐẦU RA — Vision & Scope gồm:
      As-Is (hiện trạng rời rạc)
        ↓ Gap Analysis: 7 khoảng trống → 7 tính năng
      To-Be (quy trình tập trung)
        ↓
      In-Scope: OCR / Đối soát / Mã hóa / Canvas / Watermark / Audit log
      Out-of-Scope: Máy quét / Bản quyền nội dung / Di động / Vận hành thật
        ↓
      Tính năng ưu tiên: Bắt buộc (13) / Nên có (3)

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Vision & Scope là gì?

**Trả lời:** Bốn câu hỏi: (1) Tầm nhìn dài hạn của sản phẩm là gì? (2) Khoảng cách giữa hiện tại và tương lai là gì? (3) Phạm vi In-Scope gồm gì? (4) Điều gì Out-of-Scope?

**LIBIF:** Tầm nhìn — quy trình tập trung cho thư viện cần khai thác tài liệu quét; In-Scope — OCR, đối soát, mã hóa, Canvas, watermark, audit log; Out-of-Scope — máy quét, bản quyền nội dung, di động, vận hành thật.

### 2. Các đầu vào và bước hình thành tài liệu Vision & Scope là gì?

**Trả lời:** Đầu vào gồm Project Proposal đã phê duyệt, hiện trạng vận hành và nhu cầu người dùng. Các bước: viết tuyên bố tầm nhìn → mô tả As-Is → thiết kế To-Be → Gap Analysis → định nghĩa phạm vi → danh mục tính năng ưu tiên.

**LIBIF:** Gap Analysis 7 khoảng trống ánh xạ từ vấn đề hiện tại sang tính năng cụ thể (bản quét không tìm được → OCR + tìm kiếm toàn văn; chia sẻ tệp gốc → Canvas + mã hóa).

### 3. Tài liệu Vision & Scope được đánh giá như thế nào?

**Trả lời:** Đánh giá dựa trên: tầm nhìn có truyền đạt được giá trị cho khách hàng không; Gap Analysis đủ đầy và chính xác không; In-Scope và Out-of-Scope rõ ràng không; tính năng có truy xuất về khoảng trống đã xác nhận không.

### 4. Tại sao cần tạo tài liệu Vision & Scope?

**Trả lời:** Ba lý do: (1) Định hướng chiến lược sản phẩm để nhóm quyết định đúng hướng. (2) Phòng tránh scope creep bằng Out-of-Scope rõ ràng. (3) Làm căn cứ cho Product Backlog — mỗi tính năng phải truy xuất về khoảng trống đã xác nhận.

### 5. Tài liệu được sử dụng và cập nhật trong dự án như thế nào?

**Trả lời:** Vision & Scope được dùng khi Sprint Planning để kiểm tra tính năng mới có nằm trong phạm vi không; khi có yêu cầu phát sinh để quyết định in hay out; khi Backlog thay đổi lớn để đảm bảo truy xuất nguồn gốc.

**LIBIF:** Tài liệu được rà soát sau Sprint 1, Sprint 2 và khi có thay đổi phạm vi được phê duyệt.

### 6. Gap Analysis của LIBIF có những khoảng trống nào?

**Trả lời:** Bảy khoảng trống: (1) bản quét không tìm được → OCR + tìm kiếm; (2) nhận dạng rời rạc → hàng chờ và đối soát; (3) thiếu bước kiểm soát trước xuất bản → phê duyệt; (4) chia sẻ tệp gốc → mã hóa + Canvas; (5) một tài khoản nhiều phiên → phân quyền và giới hạn đồng thời; (6) sinh viên tìm từng trang → nhảy tới đúng trang; (7) bản sao khó truy nguồn → watermark + audit log.

### 7. Tại sao Out-of-Scope phải được ghi rõ?

**Trả lời:** Không ghi rõ Out-of-Scope thì mọi yêu cầu mới đều có thể được lập luận là "hợp lý". Ghi rõ giúp PM từ chối nhanh, bảo vệ tiến độ và ngân sách.

**LIBIF:** Vận hành thật với SLA, kiểm thử xâm nhập chuyên nghiệp và ứng dụng di động được ghi tường minh là ngoài phạm vi bản mẫu.

### 8. Tính năng nào có mức ưu tiên Nên có (Should Have)?

**Trả lời:** Theo dõi tiến độ hàng chờ OCR, nhảy tới đúng trang từ kết quả tìm kiếm và làm mờ màn hình khi mất tiêu điểm. Các tính năng Bắt buộc phải hoàn thành trước khi xem xét những mục này.

## Điều không nên nói

- Không nói Vision & Scope giống SRS hoặc Product Backlog — đây là tài liệu cấp tầm nhìn, không phải yêu cầu chi tiết.
- Không nói Out-of-Scope là tính năng "sẽ làm sau" — đây là ranh giới rõ ràng của bản mẫu.
- Không nói LIBIF cam kết ngăn chặn tuyệt đối mọi hình thức sao chép.
- Không liệt kê toàn bộ bảng Gap Analysis khi vấn đáp — chọn 2–3 ví dụ tiêu biểu.
