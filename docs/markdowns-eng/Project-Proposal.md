# PROJECT PROPOSAL
## LIBIF — Intelligent Library Digitization & Document Management System

---

> **Document Type:** Project Proposal  
> **Status:** Draft v2.0  
> **Date:** July 19, 2026  
> **Development Team:** 6 Senior Students, Faculty of Computer Science & Engineering — HCMUS  
> **Technical Support:** Antigravity AI Assistant · GitHub Copilot  

---

## TABLE OF CONTENTS

1. [Business Case — Real-World Case Study](#1-business-case)
2. [Why This Problem Matters](#2-why-this-problem-matters)
3. [Stakeholder Analysis](#3-stakeholder-analysis)
4. [Feasibility Assessment](#4-feasibility-assessment)
5. [Project Roadmap & Timeline](#5-project-roadmap--timeline)
6. [Project Budget](#6-project-budget)
7. [Expected Business Impact](#7-expected-business-impact)
8. [Conclusion](#8-conclusion)

> *Details regarding feature scope, technical architecture, and user requirements are presented in the accompanying **Business Requirements Document (BRD)** and **User Requirements Document (URD)**.*

---

## 1. Business Case

### Case Study: An Afternoon at the Faculty Library

Ms. Nguyen Thi Lan, the sole librarian of a Computer Science faculty at a university in Ho Chi Minh City, starts her shift at 8:00 AM. On her desk sits a newly donated stack of books — 47 specialized textbooks valued at approximately **35 million VND**. Her mission today: scan each book, rename files, log entries into Excel, and wait for students to message via Zalo to send files one by one.

At 2:00 PM, Minh — a third-year student — sends a message asking to borrow *Numerical Analysis* for next week's exam preparation. Ms. Lan searches her computer for 23 minutes, discovers the file was misfiled, and sends it via email. That PDF — lacking any protection mechanism — spreads across the entire class via a Telegram group within 24 hours.

**This is nobody's fault.** It is the inevitable outcome of a manual workflow built for a pre-internet world operating in 2026.

**LIBIF** is proposed to replace that entire manual loop: automating OCR, centralizing digital document storage, and empowering students with self-service discovery — secure, instant, and available 24/7.

---

## 2. Why This Problem Matters

### 2.1 A Real and Sufficiently Painful Problem

The current manual digital document management workflow causes **three measurable types of losses**:

**① Workforce Loss — Librarians trapped in low-value tasks**
A librarian manually processing a book (scanning → renaming → Excel entry → student response) takes an average of 45–60 minutes. For a catalog of 500 books requiring digitization, this equals **375–500 labor hours** — over **46 full-time working days** — just to complete data entry. During this time, librarians cannot engage in knowledge management, advisory, or professional development.

**② Access Loss — Students unable to learn when needed**
The average time for a student to access a digitized document is **24–72 hours** — measured from sending a request to receiving the file, depending entirely on the librarian's schedule. In modern learning environments with pop quizzes and tight deadlines, this delay directly impairs academic performance.

**③ Copyright Loss — Uncontrolled infringement**
Once a PDF is distributed via email or messaging apps, all distribution control mechanisms fail. The institution lacks data on readership, file spreading, or unauthorized redistribution, exposing itself to copyright liabilities.

### 2.2 Global Context Validating Importance

Library digitization is not a trend — it is a baseline requirement for modern educational institutions. UNESCO confirms millions of physical documents face irreparable degradation if not digitized in time. OCR technology is proven to be the backbone of modern digital libraries, transforming static images into full-text searchable data.

### 2.3 Why Now, Why LIBIF

Two critical conditions converge to make this the ideal timing:
1. **Vietnamese OCR technology with Tesseract is mature and highly effective:** Tesseract OCR, an industry-standard open-source engine, combined with Vietnamese language traineddata (`vie`) and tailored image preprocessing (grayscale conversion, thresholding, deskewing), delivers high accuracy and processing efficiency for Vietnamese printed documents. By minimizing RAM and CPU overhead compared to heavy deep-learning alternatives, Tesseract provides a robust, lightweight, and cost-effective solution perfectly aligned with project needs.
2. **Deployment costs have dropped significantly:** The minimum cloud infrastructure to run LIBIF costs only **~1,200,000 – 2,000,000 VND/month**.

### 2.4 Why Not Continue Using Google Drive / Email

| Issue | Google Drive / Email | LIBIF |
|---|---|---|
| Distribution Control | ❌ Files can be copied freely | ✅ Secure in-browser reading, no raw downloads |
| Full-text Search | ❌ Search by file name only | ✅ Full-text search inside document content |
| Access Speed | ❌ Dependent on librarian (24–72h) | ✅ Instant, 24/7 self-service |
| Usage Reporting | ❌ No usage metrics | ✅ Real-time analytics dashboard |
| Copyright Compliance | ❌ No enforcement | ✅ Embedded technical DRM protection |

---

## 3. Stakeholder Analysis

### 3.1 Comprehensive Stakeholder Map

To ensure thorough coverage across institutional leadership, daily library operations, legal compliance, and end-user adoption, project stakeholders are expanded into seven distinct groups:

| Stakeholder Group | Project Role | Current Pain Point | Expected Benefit |
|---|---|---|---|
| **Executive Board / Leadership** | Strategic Approver & Project Sponsor | Pressure for institutional digital transformation without clear ROI or concrete solutions. | Turnkey solution fulfilling digital transformation commitments and boosting institutional academic reputation. |
| **Library Management** | Operational Sponsor & Domain Owner | Lack of real-time reporting metrics on resource utilization; unable to justify procurement budget. | Real-time analytics dashboard proving ROI and guiding strategic acquisition and digitization decisions. |
| **Librarians & Staff** | Daily System Operators | Trapped in repetitive manual tasks (scanning, Excel entry, Zalo messaging); stressed by urgent student requests. | Substantial reduction in manual data entry workload; automated ISBN metadata ingest and student self-service. |
| **Faculty & Researchers** | Content Contributors & Advanced Readers | Fragmented access to specialized materials; risk of unauthorized distribution of proprietary course reserves/syllabi. | Dual-role portal: secure sharing of course reserves/lectures to enrolled students and instant 24/7 access to rare research references. |
| **Students & Learners** | Primary Beneficiary / End Readers | 24–72 hour wait times for document requests; inability to search inside book content; poor mobile access. | Instant 24/7 self-service catalog search, full-text OCR lookup, and responsive in-browser DRM reader on all devices. |
| **Legal & Copyright Compliance Officers** | Compliance & Risk Approvers | High risk of copyright infringement liabilities due to uncontrolled PDF distribution via Zalo/email. | Technical DRM enforcement (in-browser Canvas Reader, dynamic watermarking, presigned expiring URLs) enforcing institutional compliance. |
| **IT & Infrastructure Team** | Systems & Maintenance Operators | Unstructured ad-hoc incident calls; maintaining fragmented legacy server tools with zero documentation. | Standardized Modular Monolith architecture, single-command Docker deployment, complete API contracts, and low cloud ops overhead. |

---

### 3.2 Power vs. Interest Matrix (Mendelow's Grid)

Stakeholders are mapped across influence (Power) and project impact (Interest) to establish effective engagement strategies:

```
                  HIGH POWER
                      │
   [KEEP SATISFIED]   │   [MANAGE CLOSELY]
   • Legal & Copyright│   • Executive Board
     Compliance       │   • Library Management
   • IT & Infra Team  │
                      │
──────────────────────┼──────────────────────
                      │
     [MONITOR]        │   [KEEP INFORMED]
   • External QA &    │   • Librarians & Staff
     Accreditation    │   • Faculty & Researchers
     Bodies           │   • Students & Learners
                      │
                  LOW POWER ──────────► HIGH INTEREST
```

- **Manage Closely (High Power, High Interest):** Executive Board & Library Management. Require bi-weekly milestone demos, ROI dashboard previews, and budget/timeline updates.
- **Keep Satisfied (High Power, Medium/Low Interest):** Legal/Copyright Officers & IT Infrastructure Team. Must be consulted on DRM enforcement compliance, security audits, and system architecture handoff.
- **Keep Informed (Low Power, High Interest):** Librarians, Faculty, and Students. Focus on UI simplicity, user onboarding guides, and active feedback loops during UAT.
- **Monitor (Low Power, Low Interest):** External Accreditation Bodies. Ensure system reporting outputs meet standard institutional audit requirements.

---

### 3.3 Stakeholder Success Conditions & Resistance Risk Mitigation

To ensure smooth adoption across all levels, key success conditions, primary resistance risks, and mitigation strategies are mapped for all seven stakeholder groups:

| Stakeholder Group | Key Success Condition | Primary Resistance Risk | Mitigation Strategy |
|---|---|---|---|
| **Executive Board / Leadership** | Clear evidence of institutional digital transformation progress and high ROI. | Skepticism toward project completion and fear of wasted institutional investment. | Bi-weekly milestone demos, clear EVM status reporting, and executive dashboard previews. |
| **Library Management** | Real-time analytics on resource utilization to justify procurement budgets to board. | Hesitation to adopt if system fails to provide actionable management reporting. | Automated dashboard tracking total reads, top categories, and peak access hours with 1-click report export. |
| **Librarians & Staff** | System must be simpler, cleaner, and faster than manual Excel logbook entry. | Resistance to changing established manual habits or fear of software complexity. | Zero-training UI: Drag-and-drop PDF ingest + 1-click ISBN metadata auto-fill. |
| **Faculty & Researchers** | Secure sharing of course reserves without unauthorized public leakage of proprietary materials. | Concerns regarding intellectual property theft or piracy of custom lecture notes/syllabi. | Granular role-based access control, secure Canvas Reader, and dynamic user watermark injection. |
| **Students & Learners** | Instant 24/7 self-service document search and seamless in-browser reading on any device. | Frustration if online reader is slow, non-responsive on mobile, or requires plugin installation. | Lightweight HTML5 Canvas Reader with responsive layout, instant OCR full-text search snippets, and zero-plugin setup. |
| **Legal & Copyright Officers** | Zero raw PDF file exposure or direct download links in browser network logs. | Risk of blocking deployment due to fear of copyright litigation from commercial book publishers. | Expiring presigned S3 URLs (< 60s), Canvas rendering blocking copy/print, and dynamic student MSSV/IP watermark overlay. |
| **IT & Infrastructure Team** | Single-command deployment with zero complex server orchestration or heavy maintenance overhead. | Refusal to maintain undocumented code bases or overly complex multi-server infrastructure. | Containerized Docker Compose deployment, comprehensive OpenAPI/Swagger contracts, and Modular Monolith architecture. |

---

## 4. Feasibility Assessment

### 4.1 Technical Feasibility
- **Modular Monolith Architecture:** Ensures low operational complexity while maintaining clear domain isolation for future Microservices extraction.
- **Async Tesseract OCR Worker Queue:** Redis + BullMQ pipeline decouples heavy OCR workloads from Web Server thread pool, eliminating 504 timeouts and OOM crashes.
- **DRM Canvas Reader:** In-browser Canvas rendering with dynamic watermarks, disabling copy/download commands while securing presigned URLs.

### 4.2 Financial & Operational Feasibility
- **MVP Development Cost:** **90,500,000 VND** one-time budget for a 6-member engineering team over 8 weeks.
- **Annual Operating Budget:** **~70,440,000 VND/year** for AWS cloud infrastructure, drastically lower than enterprise commercial software (125M – 1.25B VND/year).

---

## 5. Project Roadmap & Timeline

### 5.1 8-Week Sprint Allocation

- **Sprint 1 (Weeks 1-2):** Foundation Setup, Raw PDF Drag-Drop Upload (US-01), Smart ISBN Metadata Auto-fill (US-02).
- **Sprint 2 (Weeks 3-4):** Background Async Tesseract OCR Worker & Compression Pipeline (US-03), Online Catalog Search (US-04), Auth & RBAC.
- **Sprint 3 (Weeks 5-6):** Full-text Search Snippets (US-05), DRM Canvas Reader (US-06), Librarian Approval Workflow (US-08).
- **Sprint 4 (Weeks 7-8):** Management Statistics Dashboard (US-07), Category & Tag Management (US-09), E2E Testing & QA Handoff.

---

## 6. Project Budget

### 6.1 Labor Budget Breakdown (6 Engineers, 8 Weeks)

| Role | Headcount | Monthly Fee / Person | Total Fee (2 Months) | Responsibilities |
|---|:---:|:---:|:---:|---|
| PM / System Architect (Lead) | 1 | 10,000,000 VND | **20,000,000 VND** | Planning, architecture design, CI/CD, database design, API core |
| Backend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** | Catalog service, S3 object storage integration, auth & Security Reader API |
| AI / OCR Specialist | 1 | 8,500,000 VND | **17,000,000 VND** | Tesseract OCR pipeline, Redis BullMQ worker queue, full-text index tuning |
| Frontend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** | Admin Portal, DRM Canvas Reader component, Dashboard UI |
| UI/UX Designer & Tech Writer | 1 | 5,500,000 VND | **11,000,000 VND** | UI mockups, design system, user manual & technical documentation |
| QA / Testing Engineer | 1 | 5,250,000 VND | **10,500,000 VND** | Unit testing, E2E automation test scripts, security & UAT testing |
| **TOTAL LABOR COST** | **6** | — | **90,500,000 VND** | |

---

## 7. Expected Business Impact

- **Substantial Reduction** in librarian data entry and processing time per book.
- **Instant Access** for students to discover and read digitized textbooks 24/7.
- **Robust Protection** against unauthorized raw PDF downloads and uncontrolled distribution.
- **Measurable ROI** through real-time management dashboard tracking readership metrics.

---

## 8. Conclusion

LIBIF offers a practical, high-impact, and technically sound solution to modernize university library digitization workflows. By automating manual bottlenecks and protecting digital assets, LIBIF establishes a robust foundation for institutional digital transformation.
