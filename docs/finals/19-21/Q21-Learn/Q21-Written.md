# Q21-Written — Sổ đăng ký Bài học Kinh nghiệm của LIBIF

> Bản viết tay trong khoảng 10 phút: vẽ vòng lặp học hỏi, trình bày quá trình hình thành và cách đánh giá.

## Mô hình cần vẽ

    Sự kiện thực tế
    (Sprint, lỗi, rủi ro, phản hồi, sai lệch)
              │
              ▼
      Dữ kiện + bằng chứng + ảnh hưởng
              │
              ▼
        Phân tích nguyên nhân gốc
              │
              ▼
         Đúc kết bài học cụ thể
              │
              ▼
    Hành động + người phụ trách + thời hạn
              │
              ▼
      Kiểm chứng ở Sprint sau ──┐
              ▲                 │
              └──── cải tiến ───┘

## 1. Quá trình hình thành Sổ đăng ký Bài học Kinh nghiệm

Sổ được cập nhật xuyên suốt dự án từ Rà soát/Cải tiến Sprint, sàng lọc rủi ro và lỗi, sai lệch ước lượng/lịch/chất lượng, thanh tra mã nguồn, kiểm thử, phản hồi khách hàng và các mốc phát hành.

Nhóm thực hiện theo bảy bước:

1. **Thu thập dữ kiện:** sự kiện, thời điểm, bằng chứng và ảnh hưởng; tách dữ kiện khỏi ý kiến.
2. **Mô tả kết quả:** điều đã làm tốt, chưa tốt hoặc gây bất ngờ.
3. **Phân tích nguyên nhân:** dùng Năm câu hỏi Tại sao, sơ đồ xương cá hoặc phân tích trường lực.
4. **Đúc kết bài học:** viết theo dạng `điều kiện → hành động → kết quả`, tránh nhận xét chung chung.
5. **Chuyển thành hành động:** xác định người phụ trách, thời hạn, mức ưu tiên và tài liệu/quy trình cần đổi.
6. **Xác nhận hiệu quả:** kiểm tra trong Sprint sau xem hành động đã áp dụng và chỉ số có cải thiện không.
7. **Chia sẻ và lưu trữ:** đưa bài học vào kho tri thức để nhóm hoặc dự án sau tái sử dụng.

Các trường chính gồm mã bài học, nguồn/ngày, bối cảnh, sự kiện, ảnh hưởng, nguyên nhân gốc, điều làm tốt/chưa tốt, khuyến nghị, hành động, người phụ trách, thời hạn, bằng chứng, kết quả xác nhận và trạng thái.

## 2. Phương pháp đánh giá

Một bài học tốt phải:

- **Cụ thể và có bằng chứng:** dựa trên sự kiện, chỉ số hoặc hồ sơ thật.
- **Có quan hệ nhân quả:** phân biệt triệu chứng với nguyên nhân gốc.
- **Có thể hành động:** có hành động, người phụ trách, thời hạn và nơi cập nhật.
- **Có thể chuyển giao:** nêu rõ bối cảnh để dự án khác biết khi nào áp dụng.
- **Cân bằng:** ghi cả cách làm tốt cần duy trì và vấn đề cần sửa.
- **Khép kín vòng cải tiến:** hành động được theo dõi và xác nhận hiệu quả.
- **Không đổ lỗi cá nhân:** tập trung vào hệ thống và quy trình.

Ví dụ: thay vì ghi “OCR cần tốt hơn”, cần ghi “Vì độ chính xác OCR phụ thuộc chất lượng bản quét, từ Sprint sau bộ dữ liệu phải được quản lý phiên bản theo DPI/ngôn ngữ và có dữ liệu chuẩn; QA kiểm tra trước khi đo”.

**Kết luận:** Bài học kinh nghiệm chỉ có giá trị khi biến dữ kiện thành hành động và kiểm chứng được sự cải thiện, không phải chỉ ghi lại điều đã xảy ra.
