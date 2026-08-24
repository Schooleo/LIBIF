# BẢN IN NỘP KÈM — KẾT QUẢ CHẠY TEST ĐƠN VỊ/COMPONENT VÀ GATE LIÊN QUAN

## 1. Execution summary

| Gate | Lệnh/công cụ | Kết quả được ghi nhận | Nguồn |
|---|---|---|---|
| API test | Jest, `npm test -w apps/api` | 192 tests ở mốc PR #34 | Sprint 5 report |
| Web component test | Vitest, `npm test -w apps/web` | 96 tests ở mốc PR #34 | Sprint 5 report |
| API e2e | Jest e2e config | 12 suites / 73 tests | Sprint 5 closure record |
| Worker integration | Jest worker config + Docker services | 1 suite / 5 scenarios, 5/5 | Sprint 5 report |
| Static/build | ESLint + API/web production build | Passed ở mốc PR #34 | Sprint 5 report |

## 2. Nội dung worker scenarios

Worker gate bao phủ các đường đi đã được ghi nhận: Redis delivery, MinIO input/output, PostgreSQL state, embedded-text extraction, Vietnamese OCR, corrupt PDF failure, duplicate delivery, cancellation, supersession và private cleanup. Đây là integration evidence; không gọi toàn bộ các scenario này là unit test.

## 3. Cách đọc kết quả

- Số test là số được Sprint report ghi lại, không phải raw terminal output được lưu trong repository.
- “Passed” chỉ xác nhận lần chạy ở build/evidence tương ứng; không chứng minh production capacity, browser matrix hoặc UAT.
- API/web test count không cho biết trực tiếp độ bao phủ AC; cần RTM và risk coverage để kết luận.
- Không có report coverage threshold chính thức trong repository, nên không điền phần trăm bao phủ.

## 4. Kết luận

Các gate tự động và worker integration cung cấp bằng chứng đáng kể cho chất lượng kỹ thuật của POC. Tuy nhiên, kết quả này phải đi cùng Test Report `INCOMPLETE`, vì các điều kiện kết thúc còn thiếu gồm UAT, p95/capacity, defect log, real-browser matrix và production hardening.

