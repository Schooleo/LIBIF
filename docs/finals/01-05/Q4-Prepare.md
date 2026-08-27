# Q4-Prepare — Chuẩn bị vấn đáp về Yêu cầu Phần mềm (Product Backlog)

## Khung trả lời 20–40 giây

Dùng cấu trúc ba ý:

1. **Trả lời trực tiếp:** nêu nội dung hoặc cấu trúc của tài liệu.
2. **Dẫn chứng LIBIF:** chỉ đúng Epic/PBI trong bản in Product Backlog.
3. **Giá trị quản lý:** nói tại sao cấu trúc này giúp nhóm phát triển đúng hướng.

Điểm neo phải nhớ:

    ĐẦU VÀO: Vision & Scope (Gap Analysis + tính năng cấp cao) + Nhu cầu người dùng
         ↓
    ĐẦU RA — Product Backlog gồm:
      5 Epics → 16 PBIs (mỗi PBI gồm 4 thành phần)
        User Story: Là... / Tôi muốn... / Để...
        Acceptance Criteria: Given-When-Then
        MoSCoW: Must (13) / Should (3)
        Dependencies: chuỗi PBI-01→02→04→05→07→11→14,16

## Câu hỏi có thể được hỏi

### 1. Các câu hỏi chính cần trả lời trong tài liệu Product Backlog là gì?

**Trả lời:** Năm câu hỏi: (1) Hệ thống có tính năng gì? (2) Tính năng nào quan trọng nhất? (3) Mỗi tính năng phải làm được gì cụ thể? (4) Các tính năng phụ thuộc nhau thế nào? (5) Nguồn gốc yêu cầu từ đâu?

**LIBIF:** 5 Epics / 16 PBIs; 13 Must Have; chuỗi phụ thuộc từ PBI-01 đến PBI-16; 100% PBIs truy xuất về Gap Analysis trong Vision & Scope.

### 2. Các đầu vào và bước hình thành Product Backlog là gì?

**Trả lời:** Đầu vào gồm Vision & Scope (Gap Analysis + tính năng cấp cao) và nhu cầu người dùng. Các bước: phân rã tính năng thành Epic → viết User Story → viết Acceptance Criteria → phân loại MoSCoW → xác định phụ thuộc.

**LIBIF:** 7 khoảng trống trong Gap Analysis → 5 Epics → 16 PBIs với đầy đủ User Story và Acceptance Criteria dạng Given-When-Then.

### 3. Tài liệu Product Backlog được đánh giá như thế nào?

**Trả lời:** Đánh giá dựa trên: 100% PBIs có truy xuất nguồn gốc; User Story đúng chuẩn 3 phần; Acceptance Criteria có thể kiểm thử; phân loại MoSCoW hợp lý; phụ thuộc không tạo vòng tròn.

**LIBIF:** 13 Must Have đủ để chạy luồng cốt lõi; chuỗi phụ thuộc không bị block.

### 4. Tại sao cần tạo tài liệu Product Backlog?

**Trả lời:** Ba lý do: (1) Hướng dẫn phát triển cụ thể — lập trình viên biết code gì. (2) Căn cứ kiểm thử — QA viết test case từ Acceptance Criteria. (3) Kiểm soát tiến độ — PM theo dõi % PBIs hoàn thành.

### 5. Tài liệu được sử dụng và cập nhật trong dự án như thế nào?

**Trả lời:** Sprint Planning — kéo PBIs vào Sprint theo thứ tự ưu tiên và phụ thuộc; Sprint Review — đối chiếu Acceptance Criteria để xác nhận Done; Refinement — thêm PBIs mới với đầy đủ User Story trước khi đưa vào Sprint.

### 6. Chuỗi phụ thuộc của LIBIF là gì?

**Trả lời:** PBI-01 (tải lên) → PBI-02 (OCR) → PBI-04 (đối soát) → PBI-05 (phê duyệt) → PBI-07 (mã hóa) → PBI-08 (phân quyền) → PBI-09 (giới hạn phiên) → PBI-10 (tìm kiếm) → PBI-11 (Canvas) → PBI-14 (watermark) / PBI-15 (blur) / PBI-16 (audit log).

### 7. MoSCoW là gì và tại sao LIBIF dùng?

**Trả lời:** MoSCoW phân loại Must Have (bắt buộc để MVP chạy), Should Have (nên có), Could Have (có thể có), Won't Have (không làm lần này). LIBIF dùng để bảo vệ tiến độ 10 tuần — 13 Must Have đảm bảo luồng cốt lõi; 3 Should Have chỉ làm nếu còn thời gian.

### 8. Acceptance Criteria của PBI-11 (Canvas Reader) là gì?

**Trả lời:** Given độc giả mở xem cuốn sách; When trình đọc Canvas khởi tạo; Then dữ liệu từng trang được giải mã trên RAM và vẽ lên Canvas mà không để lại đường link tải file PDF trên cây DOM.

## Điều không nên nói

- Không nói Backlog là tài liệu tĩnh — Backlog là "living document" cập nhật liên tục.
- Không nói User Story là đặc tả kỹ thuật — User Story là yêu cầu từ góc nhìn người dùng.
- Không nhầm Epic với Sprint — Epic là nhóm nghiệp vụ, Sprint là đơn vị thời gian.
- Không nói nhóm có thể bỏ qua phụ thuộc — chuỗi phụ thuộc không thể đảo ngược nếu không có dữ liệu đầu vào.
