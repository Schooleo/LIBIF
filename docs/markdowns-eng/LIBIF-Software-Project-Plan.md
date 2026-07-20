# LIBIF
## Intelligent Library Digitization & Document Management System

---

# SOFTWARE PROJECT PLAN (SPP)

> Comprehensive Software Project Plan detailing Executive Summary, Scope of Work (SOW), Project Milestones, Agile Fixed-Price Contracting terms, Quality Assurance (QA) Plan, and Risk Management.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Software Project Plan) |
| **Date** | July 10, 2026 |
| **Author** | Project Manager & Governance Team |

---

## 1. EXECUTIVE SUMMARY

The **LIBIF Software Project Plan** establishes the execution framework for delivering an automated library digitization platform within an **8-week Agile timeframe**. The plan balances technical rigor with cost control under an **Agile Fixed-Price Contract model**, ensuring predictable delivery while maintaining high software quality.

---

## 2. STATEMENT OF WORK (SOW)

### 2.1 In-Scope Deliverables
- **Admin Digitization Portal:** PDF file upload, automated Google Books ISBN metadata fetching, and category/tag management.
- **Background Processing Pipeline:** Asynchronous PDF compression and VietOCR Vietnamese full-text extraction via Redis BullMQ task queue.
- **Reader Discovery Portal:** Online catalog search, multi-attribute filtering, and full-text keyword snippet search.
- **DRM Canvas Reader:** In-browser secure viewer with dynamic watermarking, anti-copying, anti-printing, and anti-downloading controls.
- **Management Analytics Dashboard:** Real-time analytics tracking read counts, top books, and usage trends.

### 2.2 Out-of-Scope Items
- Native mobile applications (iOS/Android).
- Direct integration with physical library legacy hardware protocols (SIP2/Z39.50).
- Paid e-commerce functionality.

---

## 3. PROJECT MILESTONES & SCHEDULE

```
Week 1-2         Week 3-4         Week 5-6         Week 7-8
[MILESTONE 1] ──► [MILESTONE 2] ──► [MILESTONE 3] ──► [MILESTONE 4]
Upload & Meta    VietOCR & Catalog Search & DRM    Dashboard & QA
```

| Milestone | Target Date | Major Deliverables | Key Performance Indicator |
|---|:---:|---|---|
| **M1: Ingest & Metadata** | Week 2 | Setup framework, PDF Upload (US-01), ISBN API Metadata (US-02). | Successful upload of 200MB PDFs & 80% auto-filled metadata. |
| **M2: OCR & Processing** | Week 4 | VietOCR Pipeline (US-03), Online Catalog Portal (US-04), Auth/RBAC. | Async OCR processing under 2s/page & catalog search response < 1.5s. |
| **M3: Discovery & Security**| Week 6 | Full-text search (US-05), DRM Canvas Reader (US-06), Approval (US-08). | Zero file download leakage & full-text keyword snippet jump. |
| **M4: Analytics & Delivery**| Week 8 | Dashboard (US-07), Category/Tag management (US-09), E2E QA Handoff. | 100% User Acceptance Testing (UAT) sign-off & production deployment. |

---

## 4. AGILE FIXED-PRICE CONTRACTING MODEL

To align incentive structures between stakeholders and the engineering team, the project adopts a **2-Stage Agile Fixed-Price Contract**:

- **Stage 1 (Sprint 1-2 Baseline):** Fixed scope and fee for Core Ingest, Storage, and VietOCR Engine.
- **Stage 2 (Sprint 3-4 Flexibility):** Fixed total fee with flexible Story Point swap privileges for secondary features based on mid-term review feedback.

---

## 5. QUALITY ASSURANCE (QA) & RISK PLAN

### 5.1 Quality Assurance Strategy
- **Code Review:** 100% Peer Review required before merging Pull Requests.
- **Unit Testing:** Minimum **80% Code Coverage** enforced via Jest/Vitest.
- **Automated CI/CD:** Continuous Integration pipeline running linter, unit tests, and security scans on every commit.

### 5.2 Key Risk Controls
- **OCR Accuracy Risk:** Implemented pre-processing image binarization and contrast filters to maintain > 92% Vietnamese diacritic accuracy on aged printed books.
- **Server Load Risk:** Decoupled heavy OCR execution to Python worker containers backed by Redis queues to guarantee Web Server stability.
