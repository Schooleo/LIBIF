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
1. **Vietnamese OCR technology has matured:** VietOCR (Transformer architecture) and PaddleOCR achieve 95–98% accuracy on Vietnamese text.
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

### 3.1 Stakeholder Map

| Stakeholder | Role | Current Pain Point | Expected Benefit |
|---|---|---|---|
| **Library Management** | Sponsor / Approver | Lack of reporting data, unknown resource utilization | Real-time dashboard proving ROI to executive board |
| **Librarians** | Daily Operators | Trapped in repetitive manual tasks, stressed by urgent student requests | 70% reduction in data entry time, automated student interaction |
| **Students & Faculty** | Primary Beneficiaries | 24–72 hour wait times, unknown digital availability | Instant 24/7 self-service discovery and reading |
| **Executive Board** | Strategic Approvers | Digital transformation pressure, lacking concrete solutions | Turnkey solution fulfilling digital transformation commitments |
| **IT Team** | Maintenance & Ops | Unstructured ad-hoc incident calls | Standardized architecture, complete technical docs, easy maintenance |

---

## 4. Feasibility Assessment

### 4.1 Technical Feasibility
- **Modular Monolith Architecture:** Ensures low operational complexity while maintaining clear domain isolation for future Microservices extraction.
- **Async VietOCR Worker Queue:** Redis + BullMQ pipeline decouples heavy OCR workloads from Web Server thread pool, eliminating 504 timeouts and OOM crashes.
- **DRM Canvas Reader:** In-browser Canvas rendering with dynamic watermarks, disabling copy/download commands while securing presigned URLs.

### 4.2 Financial & Operational Feasibility
- **MVP Development Cost:** **90,500,000 VND** one-time budget for a 6-member engineering team over 8 weeks.
- **Annual Operating Budget:** **~70,440,000 VND/year** for AWS cloud infrastructure, drastically lower than enterprise commercial software (125M – 1.25B VND/year).

---

## 5. Project Roadmap & Timeline

### 5.1 8-Week Sprint Allocation

- **Sprint 1 (Weeks 1-2):** Foundation Setup, Raw PDF Drag-Drop Upload (US-01), Smart ISBN Metadata Auto-fill (US-02).
- **Sprint 2 (Weeks 3-4):** Background Async VietOCR Worker & Compression Pipeline (US-03), Online Catalog Search (US-04), Auth & RBAC.
- **Sprint 3 (Weeks 5-6):** Full-text Search Snippets (US-05), DRM Canvas Reader (US-06), Librarian Approval Workflow (US-08).
- **Sprint 4 (Weeks 7-8):** Management Statistics Dashboard (US-07), Category & Tag Management (US-09), E2E Testing & QA Handoff.

---

## 6. Project Budget

### 6.1 Labor Budget Breakdown (6 Engineers, 8 Weeks)

| Role | Headcount | Monthly Fee / Person | Total Fee (2 Months) | Responsibilities |
|---|:---:|:---:|:---:|---|
| PM / System Architect (Lead) | 1 | 10,000,000 VND | **20,000,000 VND** | Planning, architecture design, CI/CD, database design, API core |
| Backend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** | Catalog service, S3 object storage integration, auth & Security Reader API |
| AI / OCR Specialist | 1 | 8,500,000 VND | **17,000,000 VND** | VietOCR pipeline, Redis BullMQ worker queue, full-text index tuning |
| Frontend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** | Admin Portal, DRM Canvas Reader component, Dashboard UI |
| UI/UX Designer & Tech Writer | 1 | 5,500,000 VND | **11,000,000 VND** | UI mockups, design system, user manual & technical documentation |
| QA / Testing Engineer | 1 | 5,250,000 VND | **10,500,000 VND** | Unit testing, E2E automation test scripts, security & UAT testing |
| **TOTAL LABOR COST** | **6** | — | **90,500,000 VND** | |

---

## 7. Expected Business Impact

- **70% Reduction** in librarian data entry and processing time per book.
- **Instant Access (< 5s)** for students to discover and read digitized textbooks 24/7.
- **100% Protection** against unauthorized raw PDF downloads and uncontrolled distribution.
- **Measurable ROI** through real-time management dashboard tracking readership metrics.

---

## 8. Conclusion

LIBIF offers a practical, high-impact, and technically sound solution to modernize university library digitization workflows. By automating manual bottlenecks and protecting digital assets, LIBIF establishes a robust foundation for institutional digital transformation.
