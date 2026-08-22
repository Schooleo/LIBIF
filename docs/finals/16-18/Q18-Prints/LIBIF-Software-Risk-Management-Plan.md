# Kế hoạch quản lý rủi ro phần mềm — LIBIF

| Thuộc tính | Nội dung |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF) |
| Phương pháp phát triển | Scrum, 10 tuần / 05 Sprint |
| Quy mô nhóm | 06 thành viên |
| Người phụ trách Risk Register | Thành viên 2 |
| Người điều phối/phê duyệt thay đổi | Thành viên 1 và cả nhóm |
| Nơi theo dõi | Risk Register này; hành động được theo dõi trên Trello |
| Phiên bản | 1.0 |
| Ngày lập | `[Điền ngày họp đầu kỳ]` |

## 1. Mục đích và phạm vi

Tài liệu xác định, đánh giá, ứng phó và theo dõi các sự kiện **chưa xảy ra, không chắc xảy ra** nhưng có thể làm LIBIF trễ tiến độ, lệch phạm vi, giảm chất lượng hoặc giảm giá trị demo. Khi một rủi ro đã xảy ra, nhóm ghi nó thành **issue** trên Trello và xử lý theo phương án dự phòng.

Risk Register tập trung vào các rủi ro thực tế nhóm đã nhận diện: cạnh tranh/giá trị sản phẩm, khả năng dùng Coding Agent, sự cố công nghệ, con người, chất lượng mã do AI và phạm vi–tính năng.

## 2. Quy trình thực hiện của nhóm

1. **Nghiên cứu và lọc ban đầu:** Thành viên 2 dùng LLM để tìm các rủi ro điển hình, đối chiếu với LIBIF và loại các rủi ro mà AI đã hỗ trợ giảm đáng kể. Thành viên 2 cũng nhận diện các rủi ro mới do việc dùng AI tạo ra.
2. **Họp đầu kỳ trên Discord:** cả nhóm kiểm tra danh sách thô dựa vào Product Backlog, công nghệ, cách làm việc và phụ thuộc; chỉ giữ các rủi ro còn liên quan và đáng kể.
3. **Lập Risk Register:** Thành viên 2 tổng hợp nguyên nhân, hậu quả, dấu hiệu và phương án xử lý. Cả nhóm chấm Xác suất và Tác động theo thang 1–5, tính `P × I` rồi ưu tiên giữ các rủi ro điểm cao.
4. **Đầu mỗi Sprint:** nhóm rà soát lại rủi ro trên Discord, chấm lại điểm khi cần và đưa hành động giảm thiểu vào Trello/Sprint Backlog.
5. **Khi có dấu hiệu:** thành viên báo sớm trên Messenger/Trello; Thành viên 2 cập nhật register, còn Thành viên 1 điều phối phân công hoặc thay đổi kế hoạch nếu cần.
6. **Khi rủi ro xảy ra:** chuyển thành issue, thực hiện contingency, ghi ảnh hưởng rồi cập nhật scope/tiến độ trên Trello.

## 3. Trách nhiệm

| Thành phần | Trách nhiệm |
| :--- | :--- |
| Thành viên 2 | Duy trì Risk Register, nhắc rà soát đầu Sprint, ghi thay đổi điểm/trạng thái. |
| Thành viên 1 | Điều phối họp, phân công nguồn lực khi có trigger, cùng nhóm quyết định thay đổi đáng kể. |
| Cả nhóm | Nhận diện rủi ro, tham gia chấm điểm, báo sớm dấu hiệu và thực hiện action được giao. |

## 4. Thang đánh giá

### 4.1 Xác suất (P)

| Điểm | Mức | Diễn giải |
| :---: | :--- | :--- |
| 1 | Rất thấp | 0–20% |
| 2 | Thấp | Trên 20–40% |
| 3 | Trung bình | Trên 40–70% |
| 4 | Cao | Trên 70–90% |
| 5 | Rất cao | Trên 90% |

### 4.2 Tác động (I)

| Điểm | Mức | Diễn giải trong dự án 10 tuần |
| :---: | :--- | :--- |
| 1 | Không đáng kể | Không ảnh hưởng Sprint Goal hay tiêu chí chấp nhận. |
| 2 | Nhỏ | Ảnh hưởng chức năng phụ hoặc chậm không quá 02 ngày. |
| 3 | Trung bình | Cần rework đáng kể hoặc làm Sprint Goal bị ảnh hưởng. |
| 4 | Lớn | Đe dọa chức năng Must Have hoặc làm trễ gần một Sprint. |
| 5 | Nghiêm trọng | Có thể không đạt Product Goal/tuần 10. |

`Điểm rủi ro = P × I`: 1–4 thấp, 5–9 trung bình, 10–16 cao, 17–25 nghiêm trọng.

> Điểm dưới đây là **ước lượng đồng thuận của nhóm**, dựa trên quy mô sáu người, thời gian 10 tuần, việc dùng Coding Agent và mức độ phụ thuộc công nghệ. Đây là công cụ ưu tiên hành động, không phải số liệu thống kê.

## 5. Risk Register

| ID | Rủi ro, nguyên nhân và hậu quả | P | I | Điểm | Mức | Owner | Trạng thái |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| R-01 | Một đối thủ có thể ra sản phẩm/ý tưởng tương tự trước, làm phần trình bày mất khác biệt. Đây không trực tiếp chặn việc nộp bài nhưng có thể giảm giá trị đề xuất. | 2 | 3 | 6 | Trung bình | Thành viên 2 | Đang theo dõi |
| R-02 | Coding Agent (ví dụ Codex, Claude Code) có thể không truy cập được ở Việt Nam hoặc tài khoản bị hạn chế. Vì nhóm dùng Agent hỗ trợ, năng suất có thể giảm và phải làm lại kế hoạch. | 2 | 4 | 8 | Trung bình | Thành viên 2 | Đang theo dõi |
| R-03 | Công nghệ/phụ thuộc như MinIO có thể lỗi hoặc không tương thích đột xuất. Luồng lưu trữ và xử lý tài liệu có thể bị gián đoạn, ảnh hưởng chức năng cốt lõi. | 3 | 4 | 12 | Cao | Thành viên 2 + người phụ trách kỹ thuật | Đang theo dõi |
| R-04 | Bất đồng kéo dài, mất động lực hoặc một thành viên rời nhóm có thể làm mất capacity/tri thức, nhất là với module chưa bàn giao. Nhóm từng có bất đồng khi chọn công nghệ nên cần theo dõi chủ động. | 3 | 4 | 12 | Cao | Thành viên 1 | Đang theo dõi |
| R-05 | Code/thiết kế do AI sinh ra có thể không đúng coding convention hoặc sai hướng yêu cầu. Nếu đưa vào quá nhanh, nhóm phải rework và chất lượng giảm. | 4 | 3 | 12 | Cao | Thành viên 2 + người tạo thay đổi | Đang theo dõi |
| R-06 | Nhóm có thể hiểu sai scope hoặc chọn feature không phù hợp, làm tốn thời gian vào chức năng ít giá trị và thiếu chức năng cốt lõi khi hết 10 tuần. | 3 | 5 | 15 | Cao | Thành viên 1 + Thành viên 2 | Đang theo dõi |

### Cơ sở chấm điểm tóm tắt

- **R-01, R-02:** chưa có dấu hiệu đã xảy ra và có phương án thay thế, nên xác suất thấp; tuy nhiên hậu quả vẫn đáng kể nếu xảy ra gần deadline.
- **R-03, R-04:** công nghệ mới/tích hợp nhiều thành phần và nhóm sáu người khiến một sự cố hoặc mất người có thể ảnh hưởng gần một Sprint.
- **R-05:** nhóm chủ động dùng AI nên nguy cơ code lệch chuẩn có khả năng cao; review còn giúp khoanh hậu quả ở mức trung bình.
- **R-06:** Product Backlog là nền tảng của dự án; hiểu sai scope có thể làm thất bại mục tiêu sản phẩm, nên tác động nghiêm trọng.

## 6. Phương án ứng phó

| ID | Giảm thiểu trước khi xảy ra | Dấu hiệu kích hoạt | Dự phòng khi xảy ra |
| :--- | :--- | :--- | :--- |
| R-01 | Mỗi Sprint xem các sản phẩm/ý tưởng tương tự và nêu rõ điểm khác biệt LIBIF sẽ demo. | Có sản phẩm tương tự được công bố hoặc nhóm không giải thích được điểm khác biệt. | Thu hẹp thông điệp vào bài toán/thao tác nhóm làm tốt nhất; ưu tiên demo luồng cốt lõi thay vì thêm feature. |
| R-02 | Không để tri thức chỉ nằm trong Agent: lưu hướng dẫn chạy, commit, tài liệu kỹ thuật; thử trước ít nhất một phương án làm thủ công/công cụ thay thế. | Nhiều thành viên không truy cập được Agent hoặc nhà cung cấp báo hạn chế tài khoản/khu vực. | Chuyển sang cách làm thủ công/công cụ thay thế; Thành viên 1 chia lại task và giảm feature không cốt lõi nếu cần. |
| R-03 | Thử MinIO và các tích hợp sớm; khóa phiên bản; có README khởi chạy và kiểm tra luồng upload–xử lý–đọc trước khi nhận thêm feature. | Dịch vụ lỗi lặp lại, không khởi động được, hoặc integration test/luồng cốt lõi thất bại. | Khoanh vùng lỗi, khôi phục cấu hình/phiên bản ổn định; dùng storage thay thế hoặc giới hạn demo theo dữ liệu có sẵn. |
| R-04 | Thảo luận bất đồng bằng lý do kỹ thuật và thuyết phục cả nhóm; backup người làm module, cập nhật tiến độ trên Trello và báo sớm khi vướng. | Tranh luận không đi đến quyết định, vắng họp lặp lại, task không cập nhật hoặc thành viên báo muốn rời nhóm. | Thành viên 1 họp riêng, chia lại việc và tổ chức bàn giao; ưu tiên Must Have, giảm feature phụ theo thống nhất nhóm. |
| R-05 | Người dùng AI phải đọc, hiểu, test và review code; đối chiếu coding convention, Product Backlog và Definition of Done trước khi merge. | Review phát hiện code không giải thích được, sai convention, sai acceptance criterion hoặc test lỗi. | Không merge/hoàn tác thay đổi; sửa hoặc viết lại thủ công, cập nhật prompt/hướng dẫn review để tránh lặp lại. |
| R-06 | Rà từng PBI/acceptance criterion ở đầu Sprint; chỉ đưa task map được với PBI vào Trello; demo sớm luồng quan trọng để lấy phản hồi. | Có task/feature không map được PBI, yêu cầu mâu thuẫn, hoặc Sprint Goal không còn phục vụ Product Goal. | Dừng feature lệch scope; Thành viên 1 và cả nhóm chốt lại ưu tiên, cập nhật backlog/Trello và tái phân công. |

## 7. Kế hoạch hành động và theo dõi

| Action | Rủi ro | Người thực hiện | Thời điểm | Bằng chứng |
| :--- | :--- | :--- | :--- | :--- |
| Rà risk register, P/I và trigger | Tất cả | Thành viên 2 + cả nhóm | Họp đầu kỳ, đầu mỗi Sprint trên Discord | Biên bản họp / bản cập nhật register |
| Kiểm tra scope–PBI trước khi nhận task | R-06 | Thành viên 1, Thành viên 2 | Sprint Planning | Card Trello liên kết PBI |
| Review code Agent-assisted và kiểm tra test | R-05 | Người tạo code + người review | Trước merge | Pull request/commit/test |
| Kiểm thử sớm MinIO và luồng tài liệu | R-03 | Người phụ trách kỹ thuật | Đầu Sprint có chức năng liên quan | Kết quả test/ghi chú Trello |
| Rà capacity, động lực và vướng mắc | R-04 | Thành viên 1 + cả nhóm | Đầu Sprint và khi có dấu hiệu | Trello/Messenger/biên bản họp |
| Kiểm tra phương án thay thế Coding Agent | R-02 | Thành viên 2 | Họp đầu kỳ; cập nhật khi có dấu hiệu | Tài liệu hướng dẫn / ghi chú họp |

## 8. Đánh giá và cập nhật kế hoạch

Kế hoạch được đánh giá bằng năm câu hỏi: (1) có phải sự kiện tương lai còn bất định không; (2) nguyên nhân–hậu quả, P/I, owner, trigger, mitigation và contingency đã đủ chưa; (3) ưu tiên có đúng theo P × I và thời điểm xảy ra không; (4) action có thể thực hiện trong Sprint không; và (5) action có còn phù hợp Product Backlog/Trello không.

Nhóm cập nhật register ở họp đầu kỳ và đầu mỗi Sprint trên Discord; ngoài ra cập nhật ngay khi xuất hiện trigger. Các thay đổi về scope/feature được phản ánh trước ở Product Backlog và card Trello liên quan. Chỉ khi một rủi ro xảy ra, nhóm mới ghi nó thành issue và theo dõi cách xử lý đến khi đóng.

## 9. Lịch sử cập nhật

| Phiên bản | Ngày | Nội dung thay đổi | Người cập nhật |
| :--- | :--- | :--- | :--- |
| 1.0 | `[Điền ngày họp đầu kỳ]` | Lập sáu rủi ro, chấm P/I và thống nhất phương án ứng phó. | Thành viên 2 |
| 1.x | `[Điền ngày đầu Sprint]` | Rà soát/cập nhật theo thực tế Sprint. | Thành viên 2 |
