# Q10-Written — Mô hình Ước tính Dự án (Project Estimate) của LIBIF

> Bản viết tay khoảng một mặt A4: vẽ mô hình trước, sau đó giải thích WHAT, HOW và WHY.

## Mô hình cần vẽ

    Đầu vào: Product Backlog (16 PBI/5 Epic), Architecture, PoC,
             Vision & Scope, Charter, Proposal
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Bước 1 — ƯỚC TÍNH KÍCH CỠ (SIZE)                          │
    │ Kỹ thuật: Planning Poker, thang Fibonacci (1,2,3,5,8,13)  │
    │ 16 PBI + 3 EN  →  136 Story Points                        │
    │ (104 SP Bắt Buộc + 13 SP Nên Làm + 19 SP hỗ trợ)          │
    └─────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Bước 2 — ƯỚC TÍNH THỜI GIAN (DURATION)                    │
    │ 05 Sprint × 02 tuần = 10 tuần                              │
    │ Velocity giả định ban đầu ≈ 27 SP/Sprint                  │
    └─────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Bước 3 — ƯỚC TÍNH CÔNG SỨC (EFFORT)                       │
    │ Đếm (Count):   6 SV × 15h × 10 tuần = 900 giờ-người        │
    │ Tính (Compute): trừ 10% Scrum events + 5% gián đoạn học   │
    │                 tập → 765 giờ-người (85%)                 │
    └─────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Bước 4 — ƯỚC TÍNH CHI PHÍ (COST)                          │
    │ Toàn bộ hạ tầng/công cụ miễn phí (Azure for Students,     │
    │ AI free-tier)  →  0 VNĐ                                   │
    └─────────────────────────────────────────────────────────┘
                              │
                              ▼
              BASELINE ƯỚC TÍNH (chốt trong tài liệu)
        Sai số dự kiến: −20% đến +30% (trước khi có velocity thực)
        Điểm tái ước tính: cuối Sprint 1 và cuối Sprint 2

    Kỹ thuật nền tảng xuyên suốt: quy tắc "Đếm – Tính toán – Phán đoán"
    (Count, Compute, Judge) và nguyên tắc Phân rã (Decomposition/WBS):
    Product → Epic → PBI → Task (mỗi task ≤ 2 ngày effort)

## Giải thích

1. **Đầu vào và bước hình thành**
   - WHAT: Tài liệu Ước tính dự án được xây dựng từ 6 tài liệu đầu vào: Product Backlog, Architecture, PoC, Vision & Scope, Charter, Proposal.
   - HOW: Nhóm dùng **Planning Poker** (kết hợp expert opinion + analogy + disaggregation) để ước tính Story Points cho từng PBI theo thang Fibonacci, sau đó dùng quy tắc **Đếm – Tính toán – Phán đoán** để chuyển Size → Effort → Duration → Cost.
   - WHY: Vì Size (SP) là đại lượng tương đối, ổn định hơn Duration/Cost vốn phụ thuộc năng suất đội; ước tính Size trước rồi mới suy ra Duration/Cost qua velocity giả định.

2. **Phân rã (Decomposition) và WBS**
   - WHAT: Mỗi PBI lớn được phân rã thành các task nhỏ hơn (Work Breakdown Structure: Product → System → Feature → Task) để dễ ước lượng và giảm sai số.
   - WHY: Theo Law of Large Numbers, cần tối thiểu 5-10 item nhỏ để sai số dương/âm bù trừ nhau; task càng nhỏ (≤ 2 ngày) thì ước lượng càng chính xác.

3. **Công sức (Effort) — Count rồi Compute**
   - WHAT: Đếm trực tiếp năng lực danh nghĩa (900 giờ-người), sau đó tính toán trừ hao 15% (Scrum events + gián đoạn học tập) ra công sức thực tế 765 giờ-người.
   - WHY: Không thể đếm trực tiếp effort hữu ích, phải suy ra bằng công thức có dữ liệu lịch sử/giả định (EST-A02, EST-A03).

4. **Baseline và tái ước tính**
   - WHAT: Toàn bộ 4 bước trên chốt lại thành Baseline (Mục 10 của tài liệu); có sai số dự kiến −20%/+30%; tái ước tính cuối Sprint 1, Sprint 2 dựa trên velocity thực tế.
   - WHY: Ước tính đầu dự án luôn nằm trong "Cone of Uncertainty" (vùng sai số rộng), Cone chỉ thu hẹp khi có quyết định/tiến độ thực tế; do đó cần cơ chế tái ước tính thay vì cố định một lần.

## Tại sao LIBIF cần tài liệu Ước tính dự án?

Nhóm có deadline cố định (10 tuần), năng lực giới hạn (6 SV, 15h/tuần) và có rủi ro học tập song song. Ước tính dự án giúp: (1) xác định mục tiêu 136 SP có khả thi (target vs. estimate), (2) làm cơ sở cam kết phạm vi 13 PBI Bắt Buộc, (3) hỗ trợ lập kế hoạch 5 Sprint và phân bổ công sức theo nhóm công việc, (4) tạo baseline để theo dõi velocity và kiểm soát scope creep.

**Kết luận:** Ước tính dự án là quy trình lặp **Đếm/Tính/Phán đoán → Size → Duration/Effort/Cost → Baseline → Tái ước tính theo dữ liệu thực tế**, không phải một con số cố định một lần.