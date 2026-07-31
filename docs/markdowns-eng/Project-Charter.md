# PROJECT CHARTER
## LIBIF — Intelligent Library Digitization & Document Management System

---

> **Document Type:** Formal Project Charter  
> **Status:** Approved v1.0  
> **Date:** July 19, 2026  
> **Project Sponsor:** Executive Board & Faculty Library Management, Faculty of CSE — HCMUS  
> **Project Manager / Lead Architect:** PM & System Architect (Engineering Lead)  
> **Target Path:** `docs/markdowns-eng/Project-Charter.md`  

---

## 1. PROJECT AUTHORIZATION & PURPOSE

### 1.1 Executive Summary & Formal Authorization
This **Project Charter** formally authorizes the initiation of the **LIBIF (Intelligent Library Digitization & Document Management System)** project. It grants the Project Manager and the 6-member engineering team the authority to allocate approved financial resources, utilize university hardware infrastructure, and execute the 8-week MVP development roadmap.

### 1.2 Strategic Business Need
As detailed in [Project-Proposal.md](./Project-Proposal.md) and [LIBIF-Vision-Scope.md](./LIBIF-Vision-Scope.md), manual library digitization workflows result in severe operational inefficiencies:
- **Workforce Loss:** Librarians waste 375–500 hours per 500 books on manual scanning, file renaming, and Excel data entry.
- **Access Loss:** Students wait 24–72 hours to receive digitized course reserves.
- **Copyright Loss:** Uncontrolled PDF distribution via email/Zalo creates intellectual property liabilities.

LIBIF replaces these bottlenecks with an automated pipeline featuring open-source **Tesseract OCR (`vie`)**, smart ISBN metadata ingest, and an in-browser **DRM Canvas Reader**.

---

## 2. PROJECT OBJECTIVES & SUCCESS CRITERIA

| Objective Category | Quantitative SMART Target | Verification Method |
|---|---|---|
| **Operational Efficiency** | Reduce librarian manual cataloging time by **70%** (< 5 minutes/book). | UAT timing benchmarks during Sprint 1-2. |
| **Student Access Speed** | Provide instant 24/7 online reading access (< 2 seconds portal search load). | Load testing performance metrics. |
| **Copyright Security** | **0 raw PDF file exposures** in DOM tree or network tab; 100% Canvas rendering. | Security penetration audit & DevTools inspection. |
| **OCR Accuracy** | Achieve **> 92% accuracy** on printed Vietnamese diacritical text. | Quality assurance sampling on scanned test pages. |
| **Budget Control** | Complete MVP within the one-time **90,500,000 VND** labor budget limit. | Weekly Earned Value Management (EVM) cost tracking. |

---

## 3. PROJECT SPONSOR & MANAGEMENT AUTHORITY

### 3.1 Sponsor Roles & Authority Limits
- **Project Sponsor (Executive Board / Library Management):**
  - Holds final authority over project charter approval, scope changes, and budget release.
  - Approves final User Acceptance Testing (UAT) and system go-live deployment.
  - Resolves cross-departmental escalations (e.g., legal compliance, IT server access).

- **Project Manager (PM / Lead System Architect):**
  - Authorized to manage the **90,500,000 VND** MVP labor fee and **~1.2M – 2.0M VND/month** AWS cloud operational budget.
  - Authorized to assign tasks, enforce coding standards, and manage daily Sprint iterations for the 6 engineering team members.
  - Authorized to approve technical design decisions (e.g., Modular Monolith architecture, Redis/BullMQ queue configurations).

---

## 4. HIGH-LEVEL BUDGET & RESOURCE ALLOCATION

### 4.1 Development Labor Budget (8 Weeks / 6 Engineers)

| Role | Headcount | Monthly Fee / Person | Total Allocated Fee (2 Months) |
|---|:---:|:---:|:---:|
| PM / System Architect (Lead) | 1 | 10,000,000 VND | **20,000,000 VND** |
| Backend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** |
| AI / OCR Specialist | 1 | 8,500,000 VND | **17,000,000 VND** |
| Frontend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** |
| UI/UX Designer & Tech Writer | 1 | 5,500,000 VND | **11,000,000 VND** |
| QA / Testing Engineer | 1 | 5,250,000 VND | **10,500,000 VND** |
| **TOTAL APPROVED LABOR BUDGET** | **6** | — | **90,500,000 VND** |

### 4.2 Cloud Operating Infrastructure Budget
- **Hosting Target:** AWS EC2 / MinIO Object Storage / Managed PostgreSQL.
- **Estimated Operating Cost:** **~1,200,000 – 2,000,000 VND/month** (~70,440,000 VND/year), representing an 80%+ savings compared to enterprise commercial software.

---

## 5. SUMMARY MILESTONE SCHEDULE

The project adheres to an 8-week Agile/Scrum release lifecycle:

```
[ W1-W2: Sprint 1 ]  →  [ W3-W4: Sprint 2 ]  →  [ W5-W6: Sprint 3 ]  →  [ W7-W8: Sprint 4 ]
PDF Ingest & ISBN        Async OCR & Catalog     DRM Canvas Reader       Dashboard & UAT
```

| Milestone ID | Target Week | Major Deliverables & Key Outputs |
|:---:|:---:|---|
| **M1** | End of Week 2 | Ingest Portal ready; PDF drag-drop upload (US-01) & ISBN Auto-fill API (US-02) complete. |
| **M2** | End of Week 4 | Background Tesseract OCR worker queue (US-03) integrated; Online Catalog Portal (US-04) live. |
| **M3** | End of Week 6 | Full-text snippet search (US-05) & Secure DRM Canvas Reader (US-06) verified. |
| **M4** | End of Week 8 | Management Analytics Dashboard (US-07), E2E Security Audit, and Final UAT Sign-off. |

---

## 6. RACI GOVERNANCE MATRIX

To ensure clear operational accountability and eliminate role ambiguity, project deliverables are mapped using the standard **RACI Model**:
- **R — Responsible:** The role that performs the activity to achieve the deliverable.
- **A — Accountable:** The single role with final approval authority and ultimate accountability (Only ONE 'A' per activity).
- **C — Consulted:** Subject Matter Experts (SMEs) providing critical input prior to execution.
- **I — Informed:** Stakeholders kept updated on progress and milestone completion.

### 6.1 Deliverable RACI Matrix

| Project Activity / Deliverable | Project Sponsor | PM / Architect | Backend Eng. | AI/OCR Spec. | Frontend Eng. | UI/UX & Writer | QA Engineer | Legal Officers | IT Team |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Project Charter & Budget Release** | **A** | R | I | I | I | I | I | C | C |
| **System Architecture & Database Design** | I | **A/R** | C | C | C | I | I | I | C |
| **PDF Drag-Drop Ingest & Storage (US-01)** | I | A | **R** | I | C | C | C | I | I |
| **Smart ISBN Metadata Auto-Fill (US-02)** | I | A | **R** | I | C | C | C | I | I |
| **Async Tesseract OCR Pipeline (US-03)** | I | A | C | **R** | I | I | C | I | I |
| **Online Catalog Search API (US-04/05)** | I | A | **R** | C | C | I | C | I | I |
| **Secure DRM Canvas Reader (US-06)** | I | A | C | I | **R** | C | C | **C** | I |
| **Analytics Dashboard UI (US-07)** | C | A | C | I | **R** | C | C | I | I |
| **UI/UX Design System & Documentation** | I | A | I | I | C | **R** | I | I | I |
| **Unit, E2E & Security Testing** | I | A | C | C | C | I | **R** | C | I |
| **Docker Deployment & Infrastructure** | I | A | C | C | I | I | C | I | **R** |
| **User Acceptance Testing (UAT) Sign-off** | **A** | R | I | I | I | C | R | C | I |

---

## 7. PROJECT RISKS, ASSUMPTIONS & CONSTRAINTS

### 7.1 Key Project Constraints
1. **Fixed Schedule:** Strict 8-week development window for MVP delivery.
2. **Fixed Budget:** Financial ceiling of 90.5M VND labor cost.
3. **No Native Desktop Plugins:** DRM protection must operate strictly inside standard web browsers without requiring native client installations.

### 7.2 High-Level Risk Management Table

| Risk Factor | Impact | Likelihood | Mitigation Strategy |
|---|:---:|:---:|---|
| **Low OCR Accuracy on Vintage Books** | High | Medium | Implement image preprocessing (grayscale, thresholding, deskewing) and manual metadata correction override. |
| **Server Memory Bottlenecks during OCR** | High | Low | Offload heavy OCR tasks to Redis + BullMQ asynchronous background worker queue. |
| **Resistance from Library Staff** | Medium | Medium | Design zero-training UI featuring drag-and-drop uploads and 1-click ISBN auto-fill. |
| **Copyright Infringement Liabilities** | Critical | Low | Enforce HTML5 Canvas rendering, expiring S3 URLs (< 60s), and dynamic student watermark overlays. |

---

## 8. FORMAL APPROVAL & SIGN-OFF

By signing below, the Project Sponsor and Project Manager formally approve this **Project Charter**, authorizing the immediate allocation of resources and execution of the LIBIF project scope.

```
__________________________________          __________________________________
Dr. Representative, Project Sponsor          PM & Lead System Architect
Faculty of CSE — HCMUS                      LIBIF Engineering Team
Date: July 19, 2026                         Date: July 19, 2026
```
