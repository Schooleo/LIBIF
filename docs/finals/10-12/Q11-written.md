# Q11-Written — Mô hình Kế hoạch Dự án (Project Plan) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình trước, sau đó giải thích WHAT, HOW và WHY.

## Mô hình cần vẽ

    Đầu vào: LIBIF-Project-Estimation.md (baseline: 136 SP, 900h→765h,
             8,8 triệu VNĐ), Product Backlog, Architecture, Charter
                              │
                              ▼
              Áp dụng nguyên tắc W5HH để chuyển Baseline ước tính
                    thành Kế hoạch quản lý dự án cụ thể
                              │
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼         ▼
      WHY       WHAT      WHEN       WHO      WHERE      HOW     HOW MUCH
     (Mục 1)   (Mục 2,5) (Mục 6)   (Mục 4)   (Mục 10)  (Mục 3,9, (Mục 7,8)
    Mục đích   Baseline  5 Sprint  RACI 6TV  Kênh giao  11,12)   Effort
    & tiêu chí & WBS 8   +Milestone           tiếp/họp  Scrum/DoD Effort
    thành công work pkg  G1→G5                          Quality  765h
                                                          Risk    Cost
                                                          Change  0 VNĐ
                              │
                              ▼
        Kế hoạch dự án hoàn chỉnh (LIBIF-Project-Planning.md)
        Mục 13 Theo dõi (velocity, WIP, defect...) → Mục 14 Kết thúc
                    → Mục 15 Phê duyệt (PO, SM, Dev, GVHD)

## Giải thích

1. **WHY — Mục đích (Mục 1)**
   - WHAT: Nêu lý do tồn tại của kế hoạch — chuyển baseline ước tính thành hoạt động quản trị cụ thể cho 5 Sprint.
   - WHY: Trả lời câu hỏi "Can we do it?" trước khi cam kết — theo nguyên tắc Why Planning (giảm bất định, tạo niềm tin, hỗ trợ quyết định).

2. **WHAT — Baseline & WBS (Mục 2, 5)**
   - WHAT: Baseline gồm 136 SP (104 SP Must Have), 900h → 765h effort, 8,8 triệu VNĐ. WBS phân rã thành 8 work package (1.0 Quản lý dự án → 8.0 Bàn giao học phần), mỗi package có owner rõ ràng.
   - WHY: WBS là cầu nối giữa Product Backlog (đơn vị SP) và tổ chức công việc thực tế (đơn vị package/owner) — theo nguyên tắc Decomposition trong slide WBS.

3. **WHEN — Lịch trình (Mục 6)**
   - WHAT: 5 Sprint × 2 tuần, mỗi Sprint có Sprint Goal + Milestone (G1 Baseline&OCR → G5 Final Submission); có lịch hoạt động lặp lại trong từng Sprint (Planning → Refinement → Feature freeze → Review/Retro).
   - WHY: Milestone bắt buộc/chọn lọc giúp quản lý biết dự án đang ở đâu so với kế hoạch (giống Milestone List trong slide Software Project Planning).

4. **WHO — Tổ chức nhóm (Mục 4)**
   - WHAT: 6 thành viên có vai trò chính + vai trò kiêm nhiệm; Ma trận RACI rút gọn xác định A (Accountable)/R (Responsible)/C (Consulted)/I (Informed) cho từng hoạt động.
   - WHY: Tránh chồng chéo trách nhiệm, đảm bảo mỗi hoạt động có đúng 1 người chịu trách nhiệm cuối (Accountable).

5. **WHERE, HOW, HOW MUCH (Mục 3, 9, 10, 11, 12, 7, 8)**
   - WHAT: Kênh giao tiếp/họp (Mục 10); phương pháp Scrum với Definition of Ready/Done (Mục 3); kế hoạch chất lượng, quản lý lỗi (Mục 9); rủi ro có owner (Mục 11); quy trình thay đổi & cấu hình, kể cả nguyên tắc dùng Coding Agent (Mục 12); effort 765h phân bổ theo 6 nhóm công việc (Mục 7); ngân sách 0 VNĐ theo hạng mục (Mục 8).
   - WHY: Đây là phần "How" và "How much" của W5HH — biến chiến lược quản lý và kỹ thuật thành quy tắc vận hành hằng ngày và con số kiểm soát cụ thể.

## Tại sao LIBIF cần tài liệu Kế hoạch dự án?

Baseline trong Estimation chỉ là **con số** (136 SP, 765h, 0 VNĐ); Kế hoạch dự án biến con số đó thành **bản đồ hành động**: ai làm gì, khi nào, theo quy trình nào, kiểm soát rủi ro/chất lượng/chi phí ra sao, và khi nào coi là kết thúc. Không có bản đồ này, nhóm khó theo dõi tiến độ, khó phân công minh bạch và khó chứng minh bằng chứng quản lý dự án

**Kết luận:** Kế hoạch dự án = W5HH áp dụng cụ thể cho LIBIF, xây trên baseline của Estimation, được theo dõi, điều chỉnh qua quy trình thay đổi và kết thúc theo checklist rõ ràng.