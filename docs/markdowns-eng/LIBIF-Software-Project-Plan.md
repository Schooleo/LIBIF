# LIBIF
## Intelligent Library Digitization & Document Management System

---

# SOFTWARE PROJECT PLAN (SPP) & STATEMENT OF WORK (SOW)

> Comprehensive Software Project Plan detailing the Executive Summary, formal Statement of Work (SOW), Project Milestones, Agile Fixed-Price Contracting terms, Quality Assurance (QA) Plan, and Risk Governance.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Document Type** | Software Project Plan & Statement of Work (SOW) |
| **Status** | Approved v2.0 (Aligned with Project Charter & Proposal) |
| **Date** | July 19, 2026 |
| **Author** | Project Manager & Governance Team |

---

## 1. EXECUTIVE SUMMARY

The **LIBIF Software Project Plan (SPP)** establishes the execution framework for delivering an automated library digitization platform within an **8-week Agile timeframe** (July 19, 2026 – September 13, 2026). The plan balances technical rigor with financial risk control under a **2-Stage Agile Fixed-Price Contract model**, ensuring predictable delivery while maintaining high software quality.

---

## 2. STATEMENT OF WORK (SOW)

### 2.1 Purpose & Definition of Statement of Work (SOW)
The **Statement of Work (SOW)** serves as the formal contractual baseline between the Project Sponsor (Executive Board / Library Management) and the Development Team (6 Engineering Students). It explicitly defines the project's purpose, boundaries, specific deliverables, period of performance, and formal acceptance conditions to prevent scope creep and align expectations.

### 2.2 Period of Performance & Work Location
- **Performance Period:** 8 Weeks (July 19, 2026 – September 13, 2026).
- **Primary Location:** Faculty of Computer Science & Engineering, HCMUS (Hybrid remote & campus lab).

### 2.3 In-Scope Deliverables
1. **Admin Digitization Portal:** PDF file drag-and-drop upload, automated Google Books ISBN metadata fetching, and tree-structure category/tag management.
2. **Background Processing Pipeline:** Asynchronous PDF compression and **Tesseract OCR (`vie`)** full-text extraction via Redis + BullMQ task queue.
3. **Reader Discovery Portal:** Online catalog search, multi-attribute filtering (category, tags, year), and full-text keyword snippet search.
4. **DRM Canvas Reader:** In-browser secure viewer with dynamic student watermark overlay (Student ID + IP + Timestamp), anti-copying, anti-printing, and anti-downloading controls.
5. **Management Analytics Dashboard:** Real-time analytics tracking read counts, top books, peak reading hours, and Excel report export.

### 2.4 Out-of-Scope Items
- Native mobile applications for iOS/Android (Web Responsive only).
- Direct integration with legacy physical library hardware protocols (SIP2/Z39.50).
- Paid e-commerce e-book purchase functionality.

### 2.5 Acceptance & Governance Terms
Deliverables are formally accepted when fulfilling the **Definition of Done (DoD)**:
- 100% Peer Review sign-off.
- Minimum **80% Code Coverage** on unit tests.
- Verification of quantitative Acceptance Criteria (AC) by the QA Lead.
- Formal UAT sign-off by the Project Sponsor.

---

## 3. PROJECT MILESTONES & SCHEDULE

```
Week 1-2         Week 3-4         Week 5-6         Week 7-8
[MILESTONE 1] ──► [MILESTONE 2] ──► [MILESTONE 3] ──► [MILESTONE 4]
Upload & Meta    Tesseract & Cat  Search & DRM     Dashboard & QA
```

| Milestone | Target Date | Major Deliverables | Key Performance Indicator (KPI) |
|---|:---:|---|---|
| **M1: Ingest & Metadata** | Week 2 (July 31) | Framework Setup, PDF Upload (US-01), ISBN API Metadata (US-02). | Successful upload of 200MB PDFs & 80% auto-filled metadata. |
| **M2: OCR & Processing** | Week 4 (Aug 14) | Tesseract OCR Pipeline (US-03), Online Catalog Portal (US-04), Auth/RBAC. | Async OCR processing under 5s/page & catalog search response < 1.5s. |
| **M3: Discovery & Security**| Week 6 (Aug 28) | Full-text search (US-05), DRM Canvas Reader (US-06), Approval (US-08). | Zero file download leakage & full-text keyword snippet jump. |
| **M4: Analytics & Delivery**| Week 8 (Sept 13) | Dashboard (US-07), Category/Tag admin (US-09), E2E QA Handoff. | 100% User Acceptance Testing (UAT) sign-off & production deployment. |

---

## 4. AGILE FIXED-PRICE CONTRACTING MODEL

To align incentive structures between stakeholders and the engineering team, the project adopts a **2-Stage Agile Fixed-Price Contract**:

- **Stage 1 (Sprint 1-2 Baseline):** Fixed scope and fee for Core Ingest, Storage, and Tesseract OCR Engine.
- **Stage 2 (Sprint 3-4 Flexibility):** Fixed total fee (**90,500,000 VND**) with flexible Story Point swap privileges for secondary features based on mid-term review feedback.

---

## 5. QUALITY ASSURANCE (QA) & RISK PLAN

### 5.1 Quality Assurance Strategy
- **Code Review:** 100% Peer Review required before merging Pull Requests.
- **Unit Testing:** Minimum **80% Code Coverage** enforced via Jest/Vitest.
- **Automated CI/CD:** Continuous Integration pipeline running linter, unit tests, and security scans on every commit.

### 5.2 Key Risk Controls
- **OCR Accuracy Risk:** Implemented pre-processing image binarization, thresholding, and contrast filters to maintain > 92% Vietnamese diacritic accuracy on aged printed books.
- **Server Load Risk:** Decoupled heavy OCR execution to worker containers backed by Redis queues to guarantee Web Server stability.
