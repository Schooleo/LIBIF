# LIBIF
## Hệ thống Số hóa Thư viện Thông minh (Library Digitization & Document Management System)

---

# HƯỚNG DẪN QUY TRÌNH ĐÁNH GIÁ TÀI LIỆU DỰ ÁN KẾT HỢP AI VÀ CON NGƯỜI (HUMAN-IN-THE-LOOP)
### (AI-HUMAN-IN-THE-LOOP DOCUMENT EVALUATION GUIDE)

> Tài liệu chuẩn hóa quy trình 4 bước đánh giá chất lượng bộ tài liệu dự án phần mềm với mô hình **Human-in-the-loop (Con người kiểm duyệt)**: AI thực hiện phân tích ban đầu $\rightarrow$ Chuyên gia con người thẩm định, điều chỉnh & phê duyệt.

---

| Trường thông tin | Nội dung |
|---|---|
| **Tên dự án** | LIBIF — Hệ thống Số hóa Thư viện Thông minh (Library Digitization System) |
| **Phiên bản** | v1.0 (Human-in-the-loop Governance Framework) |
| **Ngày lập** | Ngày 20 tháng 07 năm 2026 |
| **Tác giả** | Đội ngũ Quản trị Chất lượng (QA) & AI Prompt Engineers |

---

## 1. MỤC TIÊU CỦA MÔ HÌNH HUMAN-IN-THE-LOOP (HITL)

Việc áp dụng Trí tuệ Nhân tạo (AI Assistant) để đánh giá tài liệu dự án mang lại tốc độ vượt trội và khả năng quét diện rộng. Tuy nhiên, AI có thể gặp các hạn chế như hallucination (tự suy đoán sai lệch), thiếu ngữ cảnh thực tế của tổ chức, hoặc đánh giá quá lạc quan/bi quan. 

Mô hình **Human-in-the-loop (HITL)** thiết lập một cơ chế quản trị nghiêm ngặt: **"AI đề xuất & Phân tích — Con người Thẩm định & Quyết định"**, đảm bảo bộ tài liệu dự án vừa đạt tính chuẩn xác kỹ thuật vừa đảm bảo tính pháp lý và thực tiễn cao nhất.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LUỒNG TƯƠNG TÁC PHẢN BIỆN HITL                         │
├─────────────────┬───────────────────┬───────────────────┬───────────────────┤
│ 1. AI DRAFTING  │ 2. AI EVALUATION  │ 3. HUMAN REVIEW   │ 4. FINAL APPROVAL │
│ • Prompt parsing│ • Scored Rubric   │ • Expert Critique │ • Human Sign-off  │
│ • Doc Synthesis │ • Deficit Analysis│ • Override Score  │ • Freeze Baseline │
└─────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

---

## 2. QUY TRÌNH 4 BƯỚC THỰC THI ĐÁNH GIÁ TÀI LIỆU (4-STEP WORKFLOW)

### Bước 1: Khởi tạo Prompt và Quét Tài liệu Tự động bởi AI (AI Scanning)
- **Hành động của AI:** AI quấy quét toàn bộ các file `.md` và `.pdf` trong bộ tài liệu (`Project-Proposal.md`, `LIBIF-Vision-Scope.md`, `LIBIF-Architecture.md`...).
- **Đầu ra:** AI tổng hợp dữ liệu thô và đối chiếu với bộ 21 tiêu chí chi tiết trong Rubric dự án.

### Bước 2: Đánh giá Dự thảo ban đầu bởi AI (AI Baseline Evaluation)
- **Hành động của AI:** AI đưa ra bảng điểm dự thảo, chấm từng tiêu chí theo thang điểm 10, chỉ ra các khoảng trống thiếu sót (Gaps) và đề xuất điểm số.
- **Đầu ra:** Báo cáo đánh giá sơ bộ (như file `evaluation.md` hoặc `report.md`).

### Bước 3: Thẩm định & Phản biện bởi Chuyên gia Con người (Human Expert Review)
- **Hành động của Con người (Chuyên gia/PM/Architect):**
  1. Kiểm tra lại tính chân thực của các con số AI đã chấm (ví dụ: Chi phí 62.5M vs 90.5M VNĐ).
  2. Phản biện lại các đánh giá mà AI nghiêng về lý thuyết nhưng khó áp dụng thực tế (ví dụ: Rủi ro bản quyền Luật sở hữu trí tuệ Việt Nam).
  3. Ghi chép lý do ghi nhận hoặc ghi đè (Override) điểm số của AI.

### Bước 4: Chỉnh sửa Đồng thuận & Phê duyệt Cuối cùng (Final Approval & Sign-off)
- **Hành động phối hợp:** Con người yêu cầu AI cập nhật lại tài liệu hoặc con người trực tiếp bổ sung các phần còn thiếu. Khi đạt 100% tiêu chuẩn, Giám đốc Dự án (PM) bấm phê duyệt chốt baseline.

---

## 3. KHUNG BỎ PHIẾU THẨM ĐỊNH AI VS CON NGƯỜI (HUMAN OVERRIDE MATRIX)

Dưới đây là ví dụ thực tế về bảng theo dõi phản biện Human-in-the-loop đối với tài liệu `Project-Proposal.md` và `LIBIF-Vision-Scope.md`:

| Tiêu chí Đánh giá | AI Chấm Ban đầu | Nhận xét Phản biện của Con người (Human Expert) | Điểm Chốt Cuối cùng |
|---|:---:|---|:---:|
| **1. Problem Validation** | **9.0 / 10** | Đồng ý với AI. Số liệu tổn thất 45-60 phút/đầu sách của thủ thư tại HCMUS là hoàn toàn chính xác. | **9.0 / 10** |
| **5. Business Viability** | **8.0 / 10** | **Điều chỉnh:** AI chưa tính đến việc tăng nhân sự từ 4 lên 6 người làm ngân sách MVP tăng từ 62.5M lên 90.5M VNĐ. Tuy nhiên ngân sách vẫn hợp lý. | **8.5 / 10** |
| **9. Risk Assessment** | **7.5 / 10** | **Cảnh báo từ Con người:** AI chấm 7.5 là hơi quan liêu. Vấn đề bản quyền khi đưa tài liệu nội bộ lên web là rủi ro pháp lý RẤT LỚN. Cần bắt buộc bổ sung tính năng DRM Canvas Reader. | **6.5 / 10** |

---

## 4. MA TRẬN PHÂN CÔNG VAI TRÒ HUMAN-IN-THE-LOOP (RACI MATRIX)

| Vai trò / Thành viên | AI Assistant | Project Manager (PM) | Lead Architect | Legal & QA Expert |
|---|:---:|:---:|:---:|:---:|
| **Quét & Đánh giá Rubric sơ bộ** | **R** (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
| **Thẩm định Chi phí & Tiến độ** | C (Consulted) | **R / A** | C (Consulted) | I (Informed) |
| **Thẩm định Kiến trúc & PoC** | C (Consulted) | I (Informed) | **R / A** | I (Informed) |
| **Thẩm định Pháp lý & Bản quyền**| C (Consulted) | A (Accountable) | I (Informed) | **R** |
| **Phê duyệt Tài liệu Baseline** | I (Informed) | **A** | C (Consulted) | C (Consulted) |

*Ghi chú: R = Người thực hiện, A = Người chịu trách nhiệm chính/Phê duyệt, C = Người tư vấn, I = Người nhận thông tin.*

---

## 5. KẾT LUẬN

Tài liệu hướng dẫn này đảm bảo việc đánh giá tài liệu dự án LIBIF không dừng lại ở các nhận xét tự động của máy móc mà luôn có sự giám sát, chịu trách nhiệm và điều chỉnh sát thực tế của con người (Human-in-the-loop), tạo nên chuẩn mực cao nhất cho hồ sơ dự án.
