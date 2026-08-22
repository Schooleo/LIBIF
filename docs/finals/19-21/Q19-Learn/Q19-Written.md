# Q19-Written — Kế hoạch Quản lý Chất lượng của LIBIF

> Bản viết tay trong khoảng 10 phút: vẽ luồng trước, sau đó trình bày quá trình hình thành và cách đánh giá.

## Mô hình cần vẽ

    Tầm nhìn + SOW + Danh sách sản phẩm + Kiến trúc + Rủi ro
                              │
                              ▼
          Chọn đối tượng và đặc tính chất lượng
                              │
                              ▼
       Chỉ số + cách đo + ngưỡng + người phụ trách
                              │
                              ▼
            QA phòng ngừa + QC phát hiện
                              │
                              ▼
       Bằng chứng thực tế → đánh giá → cải tiến QMP

## 1. Quá trình hình thành QMP

Nhóm xây dựng Kế hoạch Quản lý Chất lượng (QMP) theo các bước:

1. **Thu thập đầu vào:** Tầm nhìn và Phạm vi, SOW, PBI-01–PBI-16, AC-01–AC-08, kiến trúc, DoD và Sổ đăng ký Rủi ro.
2. **Chọn đối tượng quản lý:** sản phẩm, quy trình, dự án, con người và môi trường.
3. **Chọn đặc tính chất lượng:** tính đúng đắn, độ tin cậy, hiệu năng, bảo mật, khả năng sử dụng, bảo trì, kiểm thử và tính khả chuyển.
4. **Chuyển thành chỉ số đo:** tỷ lệ ca kiểm thử đạt, lỗi theo mức nghiêm trọng, thời gian phản hồi, độ bao phủ và tỷ lệ AC đạt.
5. **Đặt ngưỡng:** tìm kiếm dưới 2 giây; không còn lỗi nghiêm trọng trước phát hành; toàn bộ AC bắt buộc phải đạt.
6. **Xác định hoạt động:** QA gồm quy chuẩn lập trình, đào tạo, DoD, rà soát và cổng CI; QC gồm thanh tra, phân tích tĩnh, kiểm thử, theo dõi lỗi và UAT.
7. **Phân công và phê duyệt:** quy định vai trò, lịch, bằng chứng; PO, trưởng nhóm kỹ thuật và QA rà soát trước khi thiết lập đường cơ sở.
8. **Cập nhật:** dùng dữ liệu từng Sprint để điều chỉnh chỉ số, ngưỡng và biện pháp kiểm soát.

## 2. Phương pháp đánh giá QMP

QMP được đánh giá theo ba tầng:

- **Chất lượng tài liệu:** đúng, đủ, rõ, đo được, nhất quán và truy vết được tới yêu cầu, rủi ro, kiểm thử và bằng chứng.
- **Tính khả thi:** nhân lực, công cụ, dữ liệu, chi phí và lịch trình phù hợp với 5 Sprint.
- **Hiệu lực thực tế:** cổng CI có chặn mã không đạt; rà soát có tìm lỗi sớm; lỗi và việc làm lại có giảm; AC, DoD và tiêu chí phát hành có được đáp ứng.

Kết quả đánh giá phải dẫn đến một trong ba quyết định: **phê duyệt**, **phê duyệt kèm hành động khắc phục** hoặc **yêu cầu làm lại**.

## 3. Tại sao LIBIF cần QMP?

QMP biến khái niệm “phần mềm tốt” thành yêu cầu đo được; thống nhất cách hiểu giữa khách hàng, PO, lập trình viên và QA; phòng ngừa lỗi sớm; tạo tiêu chí khách quan cho Hoàn thành, nghiệm thu và phát hành; đồng thời cung cấp bằng chứng để kiểm toán và cải tiến.

**Kết luận:** QMP không phải tài liệu viết một lần. Đây là đường cơ sở chất lượng được đo bằng bằng chứng thực tế và cập nhật khi phạm vi, kiến trúc hoặc rủi ro thay đổi.
