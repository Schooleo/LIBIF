# Q1-Written — Tài liệu Đề xuất Dự án (Project Proposal) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình đầu vào → đầu ra, giải thích WHAT và WHY.

## Mô hình cần vẽ

    ┌─────────────────────────────────────────────┐
    │              ĐẦU VÀO (Inputs)               │
    │  ① Idea: số hóa tài liệu quét, kiểm soát    │
    │     quyền đọc và truy vết bản quyền          │
    │  ② Business case: thủ thư xử lý rời rạc,     │
    │     sinh viên không tìm được toàn văn,        │
    │     thư viện thiếu bằng chứng truy vết       │
    │  ③ 3 đối thủ: DSpace / Greenstone /         │
    │     Ex Libris Alma                          │
    └──────────────────────┬──────────────────────┘
                           │ Agent tổng hợp
                           ▼
    ┌─────────────────────────────────────────────┐
    │         ĐẦU RA — Project Proposal           │
    │  • Problem Statement                        │
    │  • Mục tiêu & Tiêu chí thành công           │
    │  • Scope: In-Scope / Out-of-Scope           │
    │  • Deliverables                             │
    │  • Time: 10 tuần / 5 Sprint                 │
    │  • Cost: 8.800.000 VNĐ (trần 10 triệu)      │
    │  • Feasibility (Kỹ thuật/Tiến độ/Tài chính) │
    │  • Rủi ro chính                             │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
              Đầu vào cho Vision & Scope
              và Project Charter

## Giải thích

1. **Đầu vào**

   - WHAT: Ý tưởng ban đầu là xây quy trình số hóa tập trung cho thư viện. Business case từ hiện trạng thực tế. Ba đối thủ được phân tích để chứng minh khoảng trống thị trường:
     - DSpace: thiếu OCR tiếng Việt và kiểm soát phiên đọc.
     - Greenstone: không có quy trình thủ thư tập trung và nhật ký truy cập.
     - Ex Libris Alma: phạm vi quá rộng, chi phí quá cao cho nhóm nhỏ.
   - WHY: Phải phân tích đủ 3 đối thủ để chứng minh tại sao không dùng giải pháp hiện có mà phải xây LIBIF.
2. **Đầu ra — các mục trong Proposal**

   - **Problem Statement:** thiếu quy trình thống nhất cho OCR, kiểm duyệt, phân quyền và đọc trực tuyến.
   - **Mục tiêu:** chạy được luồng tải → OCR → đối soát → phê duyệt → tìm kiếm → đọc; không rò rỉ đường dẫn PDF gốc; có watermark và audit log.
   - **Scope:** In-Scope — OCR, đối soát, mã hóa, phân quyền, Canvas Reader, watermark, audit log. Out-of-Scope — máy quét, bản quyền nội dung, ứng dụng di động, vận hành thật.
   - **Deliverables:** bản mẫu chạy được, tài liệu quản lý dự án, mã nguồn, Docker, bộ kiểm thử.
   - **Time:** 10 tuần, 5 Sprint, 900 giờ-người của 6 sinh viên.
   - **Cost:** tiền mặt 8.800.000 VNĐ, trần kiểm soát 10.000.000 VNĐ.
   - **Feasibility:** Kỹ thuật — khả thi nhờ PoC và hạ tầng sẵn có; Tiến độ — khả thi nếu giữ phạm vi ưu tiên; Tài chính — trong ngân sách học phần.
   - **Rủi ro:** chất lượng ảnh quét, thiếu hụt năng lực nhóm, giới hạn bảo vệ nội dung trên trình duyệt.

## Tại sao cần tạo tài liệu Đề xuất Dự án?

Proposal là căn cứ để giảng viên (người cho phép khởi động) phê duyệt dự án; ghi rõ lý do tồn tại, phạm vi, lợi ích và rủi ro trước khi nhóm đầu tư 900 giờ công; là đầu vào trực tiếp cho Vision & Scope và Project Charter.

**Kết luận:** Proposal trả lời **"Tại sao làm?"** trước khi nhóm quyết định **"Làm gì?"** và **"Làm như thế nào?"**.
