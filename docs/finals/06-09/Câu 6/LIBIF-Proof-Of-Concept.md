# BÁO CÁO CHỨNG MINH Ý TƯỞNG (PROOF OF CONCEPT)

| Thuộc tính | Giá trị |
| :--- | :--- |
| Tên dự án | Hệ thống Thư viện Số & Quản lý Bản quyền Số (LIBIF/CDLS) |
| Chủ đề PoC | Xử lý OCR tiếng Việt bất đồng bộ cho tài liệu PDF quét |
| Mục tiêu | Chứng minh hệ thống có thể nhận PDF quét, trích xuất văn bản thật và lưu kết quả mà không chặn luồng HTTP |
| Công nghệ chính | NestJS, Redis/BullMQ, Tesseract.js (`vie+eng`), PostgreSQL, MinIO |
| Chi phí tiền mặt | 0 VNĐ; sử dụng thư viện mã nguồn mở và hạ tầng học tập hiện có |
| Trạng thái | Đã tích hợp vào mã nguồn và có kiểm thử tích hợp worker |

---

## 1. Bài toán kỹ thuật cần chứng minh

LIBIF nhận tài liệu PDF quét nên thường không có lớp văn bản để tìm kiếm. OCR tiếng Việt tiêu tốn CPU và có thể kéo dài theo số trang; nếu xử lý đồng bộ trong request tải lên, API có thể timeout và người dùng phải chờ toàn bộ tác vụ hoàn tất.

PoC của nhóm trả lời câu hỏi:

> **LIBIF có thể đưa PDF quét vào hàng đợi, xử lý OCR tiếng Việt ở worker nền, lưu văn bản thật theo từng trang và chuyển tài liệu sang bước đối soát hay không?**

Canvas Reader và các lớp bảo vệ DRM là quyết định kiến trúc của sản phẩm, **không phải chủ đề PoC của nhóm**.

---

## 2. Đầu vào và tiêu chí thành công

### 2.1 Đầu vào

1. Product Backlog và yêu cầu tải tài liệu, OCR, đối soát và tìm kiếm toàn văn.
2. Kiến trúc Pipe & Filter và yêu cầu không chặn luồng HTTP.
3. Tài liệu PDF quét tiếng Việt dùng làm fixture kiểm thử.
4. Tesseract.js với dữ liệu ngôn ngữ `vie+eng`.
5. Redis/BullMQ, MinIO và PostgreSQL trong môi trường tích hợp.

### 2.2 Tiêu chí thành công

- Job được đưa vào hàng đợi và worker xử lý thành công.
- Hệ thống nhận biết PDF quét và ghi `extractionMethod = OCR`.
- Văn bản nhận dạng thật được lưu; không dùng chuỗi kết quả giả lập.
- Kết quả theo từng trang được lưu để phục vụ đối soát và tìm kiếm.
- PDF lỗi phải thất bại an toàn, không tạo artifact hoặc bản ghi phê duyệt sai.
- Tác vụ trùng không làm cùng một job được xử lý hai lần.

---

## 3. Quá trình hình thành PoC

1. **Xác định rủi ro:** OCR là bước đầu vào của luồng số hóa và có nguy cơ làm nghẽn API nếu chạy đồng bộ.
2. **Thiết kế thử nghiệm:** tách API nhận file khỏi worker xử lý bằng Redis/BullMQ.
3. **Xây dựng OCR adapter:** kiểm tra PDF; nếu không có text layer thì render từng trang thành PNG ở cấu hình mặc định 200 DPI và chạy Tesseract.js với `vie+eng`.
4. **Lưu kết quả:** worker lưu văn bản trích xuất và JSON theo từng trang vào private storage, đồng thời ghi metadata, checksum, ngôn ngữ và số trang trong PostgreSQL.
5. **Kết nối quy trình:** sau khi OCR hoàn tất, job chuyển sang indexing và tạo dữ liệu cho bước đối soát/phê duyệt.
6. **Kiểm thử tích hợp:** chạy worker thật với Redis, MinIO, PostgreSQL và fixture PDF quét tiếng Việt; kiểm tra cả luồng thành công, job trùng và PDF hỏng.

---

## 4. Mô hình PoC

```text
PDF quét tiếng Việt
        │
        ▼
API tải file → MinIO private storage
        │
        ▼
Redis/BullMQ queue
        │
        ▼
NestJS OCR worker
  ├─ kiểm tra PDF và text layer
  ├─ PDF → ảnh trang 200 DPI
  └─ Tesseract.js (vie+eng)
        │
        ├─► Văn bản OCR
        ├─► JSON văn bản theo trang
        └─► Metadata/checksum trong PostgreSQL
                     │
                     ▼
             Indexing → Đối soát
```

---

## 5. Phương pháp đánh giá và bằng chứng

| Tiêu chí | Phương pháp đánh giá | Bằng chứng trong repository | Kết quả |
| :--- | :--- | :--- | :--- |
| OCR chạy với dữ liệu thật | Đưa fixture PDF quét tiếng Việt qua hàng đợi và chờ job thành công | `apps/api/test/processing-worker.worker-spec.ts` | Job thành công, phương pháp trích xuất là `OCR` |
| Có đầu ra thực | Đọc artifact từ MinIO và kiểm tra nội dung nhận dạng | `processing-worker.worker-spec.ts` | Văn bản chứa nội dung fixture, không chứa chuỗi giả `[OCR Processed]` |
| Giữ cấu trúc theo trang | Đọc artifact `OCR_LAYOUT` | `processing-worker.worker-spec.ts` | JSON chứa số trang và văn bản tương ứng |
| Không xử lý trùng | Gửi cùng một persisted job hai lần | `processing-worker.worker-spec.ts` | Job chỉ được claim và xử lý một lần |
| Thất bại an toàn | Gửi PDF hỏng | `processing-worker.worker-spec.ts` | Job thất bại, không tạo artifact hoặc approval row |
| Cấu hình OCR phù hợp | Rà soát OCR adapter | `apps/api/src/modules/processing/ocr/pdftotext-ocr-engine.adapter.ts` | Hỗ trợ `vie+eng`, giới hạn trang/thời gian và xóa workspace tạm |

Nhóm đánh giá PoC bằng **kết quả mã nguồn chạy được và kiểm thử tích hợp**, không chỉ bằng mô tả lý thuyết. Lệnh kiểm chứng là:

```bash
make test-worker
```

---

## 6. Kết quả sử dụng trong dự án

- PoC được đưa vào `WorkerModule` và luồng `PDF_OCR_PIPELINE` của backend.
- Văn bản OCR trở thành đầu vào cho tìm kiếm toàn văn.
- Dữ liệu theo trang hỗ trợ giao diện đối soát trước khi phê duyệt.
- Trạng thái xử lý được hiển thị cho giao diện người dùng thay vì giữ request tải lên chờ OCR.
- Kết quả PoC làm căn cứ cho Architecture, Project Estimate và Sprint Planning.

---

## 7. Giới hạn và hướng đánh giá tiếp

- Kiểm thử tích hợp hiện chứng minh luồng OCR thật trên fixture có kiểm soát; chưa phải benchmark độ chính xác cho mọi loại sách hoặc chất lượng scan.
- Độ chính xác phụ thuộc DPI, độ nghiêng, nhiễu ảnh, font và ngôn ngữ; vì vậy LIBIF vẫn cần bước đối soát Human-in-the-loop.
- Khi có bộ dữ liệu chuẩn lớn hơn, nhóm có thể bổ sung Character Error Rate, Word Error Rate và thời gian xử lý trung bình mỗi trang.

**Kết luận:** PoC chứng minh LIBIF có thể xử lý OCR tiếng Việt ở worker nền, lưu kết quả thật và chuyển tiếp sang tìm kiếm/đối soát với chi phí tiền mặt 0 VNĐ. PoC giảm rủi ro kỹ thuật trước khi nhóm mở rộng toàn bộ quy trình số hóa.
