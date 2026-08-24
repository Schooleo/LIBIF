# Q11-Written — Mô hình Kế hoạch Dự án (Project Plan) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình trước, sau đó giải thích WHAT, HOW và WHY.

## Mô hình cần vẽ

    Đầu vào: Vision-Scope, Product Backlog, Architecture, Charter, PoC, Estimation
                              │
                              ▼
              Áp dụng nguyên tắc W5HH để chuyển Baseline ước tính
                    thành Kế hoạch quản lý dự án cụ thể
                              │
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼         ▼
      WHY       WHAT       WHEN       WHO       WHERE      HOW      HOW MUCH
    Mục đích   Baseline    5 Sprint  RACI 6TV  Kênh giao    Scrum 
    & tiêu chí & WBS 8                       tiếp/họp    DoD/DoR    Effort
    thành công work pkg                                    Quality   765h
                                                           Risk      Cost
                                                           Change    0 VNĐ
                              │
                              ▼
        Kế hoạch dự án hoàn chỉnh (LIBIF-Project-Planning.md)
              Theo dõi (velocity, WIP, defect...)

## Giải thích

1. **WHY — Mục đích**
   - WHAT: Nêu lý do tồn tại của kế hoạch — chuyển baseline ước tính thành hoạt động quản trị cụ thể cho 5 Sprint.
   - WHY: Trả lời câu hỏi "Can we do it?" trước khi cam kết — theo nguyên tắc Why Planning (giảm bất định, tạo niềm tin, hỗ trợ quyết định).

2. **WHAT — Baseline & WBS**
   - WHAT: Baseline gồm 136 SP (104 SP Must Have), 900h → 765h effort và 0 VNĐ tiền mặt. WBS phân rã thành 8 work package, mỗi package có owner rõ ràng.
   - WHY: WBS là cầu nối giữa Product Backlog (đơn vị SP) và tổ chức công việc thực tế (đơn vị package/owner) — theo nguyên tắc Decomposition trong slide WBS.

3. **WHEN — Lịch trình**
   - WHAT: 5 Sprint × 2 tuần, mỗi Sprint có Sprint Goal + Milestone (G1 Baseline&OCR → G5 Final Submission); có lịch hoạt động lặp lại trong từng Sprint (Planning → Refinement → Feature freeze → Review/Retro).
   - WHY: Milestone bắt buộc/chọn lọc giúp quản lý biết dự án đang ở đâu so với kế hoạch (giống Milestone List trong slide Software Project Planning).

4. **WHO — Tổ chức nhóm**
   - WHAT: 6 thành viên có vai trò chính + vai trò kiêm nhiệm; Ma trận RACI rút gọn xác định A (Accountable)/R (Responsible)/C (Consulted)/I (Informed) cho từng hoạt động.
   - WHY: Tránh chồng chéo trách nhiệm, đảm bảo mỗi hoạt động có đúng 1 người chịu trách nhiệm cuối (Accountable).

5. **WHERE, HOW, HOW MUCH**
   - WHAT: Kênh giao tiếp/họp; phương pháp Scrum với Definition of Ready/Done; kế hoạch chất lượng, quản lý lỗi; rủi ro có owner; quy trình thay đổi & cấu hình, kể cả nguyên tắc dùng Coding Agent; effort 765h phân bổ theo 6 nhóm công việc; ngân sách 0 VNĐ theo hạng mục.
   - WHY: Đây là phần "How" và "How much" của W5HH — biến chiến lược quản lý và kỹ thuật thành quy tắc vận hành hằng ngày và con số kiểm soát cụ thể.

## Phương pháp đánh giá tài liệu

- **Đối chiếu W5HH:** đủ 7 câu hỏi Why/What/When/Who/Where/How/How much chưa bị bỏ sót mục nào.
- **Đối chiếu baseline:** số liệu (136 SP, 900h/765h, 10 tuần, 0 VNĐ) phải khớp đúng với `LIBIF-Project-Estimation.md` v3.0 — không tự đặt số liệu mới ở bước lập kế hoạch.
- **Kiểm tra tính khả thi:** effort phân theo RACI/WBS có vượt capacity 15h/tuần/người không (mục 7).
- **Kiểm tra completeness:** đủ 8 thành phần lý thuyết — schedule, resource, cost, quality, communication, risk, change/config, closure; thiếu thành phần nào là kế hoạch chưa đủ.
- **Kiểm tra khả năng theo dõi:** có ngưỡng/metric rõ ràng để phát hiện lệch kế hoạch không (mục 13) — không có ngưỡng thì không thể đánh giá sai lệch.
- **Đánh giá bằng vận hành thực tế:** sau mỗi Sprint, so khớp velocity/kết quả thật với dự báo; nếu lệch thì áp dụng đúng cơ chế mục 6.3/12.1, không xử lý tùy tiện.
- **Phê duyệt hình thức:** có xác nhận của 4 vai trò (mục 15) mới coi là baseline chính thức để thực thi.

## Tại sao LIBIF cần tài liệu Kế hoạch dự án?

Nhóm có 6 người, 16 PBI, nhiều luồng kỹ thuật (OCR, bảo mật, tìm kiếm) trong 10 tuần cố định; nếu không tổng hợp tiến độ/nguồn lực/chi phí/chất lượng/rủi ro/giao tiếp vào một tài liệu, nhóm dễ phân công chồng chéo, không phát hiện sớm lệch tiến độ, thiếu bằng chứng đóng góp. Project Plan là "bản đồ dẫn đường" giúp cả nhóm và giảng viên cùng biết đang ở đâu và cần đi tiếp thế nào.

**Kết luận:** Kế hoạch dự án LIBIF hình thành từ 6 tài liệu đầu vào, được cấu trúc theo W5HH thành 15 mục cụ thể, và được đánh giá bằng cách đối chiếu ngược với W5HH, với baseline Estimation, với tính khả thi capacity, với đủ 8 thành phần lý thuyết, và với kết quả vận hành thực tế qua từng Sprint — đây là tài liệu sống (living document), không phải viết một lần rồi bỏ đó.