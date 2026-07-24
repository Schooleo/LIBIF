# LIBIF
## Intelligent Library Digitization & Document Management System

---

# PROJECT VISION & SCOPE DOCUMENT

> Comprehensive analysis of the current state, manual library workflows, and stakeholder pain points; defining the target vision, technical architecture, and 8-week MVP project scope aligned directly with the **Project Proposal**.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization & Document Management System |
| **Document Type** | Project Vision & Scope Document |
| **Status** | Approved v2.0 (Aligned with Project Proposal) |
| **Date** | July 19, 2026 |
| **Development Team** | 6 Senior Students, Faculty of Computer Science & Engineering — HCMUS |
| **Technical Support** | Antigravity AI Assistant · GitHub Copilot |

---

## 1. PROJECT OVERVIEW

The **LIBIF** Library Digitization System addresses the urgent institutional challenge of converting physical book collections in university faculties into secure, searchable digital assets (e-books, PDFs). The system automates librarian upload workflows, processes document contents via open-source **Tesseract OCR (`vie`)**, centralizes metadata cataloging, and provides a secure online discovery portal for readers.

### 1.1 Core Value Proposition
The end-to-end digitized lifecycle replaces error-prone manual tasks with an automated pipeline:

```
[PHYSICAL SCAN]  →  [DRAG-DROP UPLOAD]  →  [SMART METADATA]  →  [ASYNC OCR QUEUE]  →  [DRM CANVAS READER]
 (Flatbed Scan)      (Raw PDF Ingest)     (ISBN Auto-fill)       (Tesseract vie)       (24/7 Secure Access)
```

---

## 2. PROJECT VISION & STRATEGIC GOALS

To serve as a comprehensive, highly secure, and cost-effective library digitization management platform. **LIBIF** aims to eliminate physical learning barriers, preserve rare academic materials, and protect intellectual property while establishing a baseline digital transformation standard for educational institutions.

### 2.1 Strategic Alignment & Objectives
1. **Operational Efficiency:** Reduce librarian manual data entry time by **70%**, cutting book processing overhead from 45–60 minutes down to automated ingest.
2. **Instant Student Access:** Eliminate document access delays, shifting student access time from **24–72 hours** down to instant 24/7 self-service.
3. **Copyright Protection:** Prevent raw PDF leakage and unauthorized file sharing via Zalo/Telegram through dynamic in-browser DRM rendering.
4. **Economic Viability:** Maintain cloud operational expenses under **~1.2M – 2.0M VND/month** (~70.44M VND/year), saving over 80% compared to commercial enterprise software.

---

## 3. CURRENT STATE & PAIN POINT ANALYSIS

Manual digitization workflows in academic faculty libraries cause **three measurable types of institutional losses**:

### 3.1 Three Measurable Institutional Losses
1. **Workforce Loss (Librarians trapped in low-value manual tasks):**
   Scanning, manual renaming, Excel logging, and Zalo messaging consume 45–60 minutes per book. Digitizing a catalog of 500 books requires **375–500 labor hours** (over 46 full-time working days), preventing staff from engaging in knowledge advisory or management.
2. **Access Loss (Students unable to learn when needed):**
   Students wait **24–72 hours** from sending a document request via email/Zalo to receiving files, directly impairing exam preparation and academic performance.
3. **Copyright Loss (Uncontrolled IP infringement):**
   Distributing raw PDF files via email or messaging apps bypasses all copyright controls. Files spread across student groups without readership tracking or access revocation mechanisms.

---

## 4. STAKEHOLDER ANALYSIS & GOVERNANCE

To ensure institutional alignment, stakeholders are categorized into 7 distinct groups mapped across Mendelow's Grid and a RACI Governance Matrix.

### 4.1 Mendelow's Power vs. Interest Matrix

```
                  HIGH POWER
                      │
   [KEEP SATISFIED]   │   [MANAGE CLOSELY]
   • Legal & Copyright│   • Executive Board
     Officers         │   • Library Management
   • IT & Infra Team  │
                      │
──────────────────────┼──────────────────────
                      │
      [MONITOR]       │   [KEEP INFORMED]
   • External QA &    │   • Librarians & Staff
     Accreditation    │   • Faculty & Researchers
                      │   • Students & Learners
                      │
                  LOW POWER ──────────► HIGH INTEREST
```

### 4.2 RACI Matrix (Responsibility, Accountability, Consulted, Informed)

| Project Phase / Deliverable | Executive Board | Library Management | Librarians | Faculty | Students | Legal Officers | IT Team |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Project Charter & Budget Approval** | **A** | C | I | I | I | C | C |
| **Raw PDF Ingest & Cataloging** | I | **A** | **R** | I | I | I | I |
| **Async Tesseract OCR Pipeline** | I | I | I | I | I | I | **R/A** |
| **DRM Canvas Reader Security** | I | C | I | C | I | **A** | **R** |
| **Online Discovery & Reading** | I | I | I | C | **R/A** | I | I |
| **Analytics & Reporting Dashboard** | C | **R/A** | I | I | I | I | I |

*Legend: **R** = Responsible (Does the work), **A** = Accountable (Final decision/approver), **C** = Consulted (Provides input), **I** = Informed (Kept updated).*

---

## 5. FEATURE MAPPING & WORKFLOW COMPARISONS

### 5.1 Feature Alignment Table

| Current Manual Pain Point | Corresponding LIBIF System Feature | Target Impact Metrics |
|---|---|---|
| Scattered PDF storage, lost metadata linkage. | **Centralized Document Management System (DMS):** Raw PDF linked to Postgres metadata records. | 100% centralized asset indexing. |
| Time-consuming manual Excel data entry. | **Smart Metadata Form:** Auto-populates title, author, and publisher via Google Books ISBN lookup API. | 80% reduction in entry time. |
| Passive student wait times (24–72 hours). | **Online Catalog Portal:** Advanced search by title, author, category, tags, and full-text OCR content. | Instant 24/7 self-service access. |
| Raw PDF downloads cause copyright leakage. | **Secure DRM Canvas Reader:** In-browser canvas rendering with expiring presigned S3 URLs (< 60s). | Zero raw PDF download exposure. |
| Lack of visibility into reading metrics. | **Real-Time Reporting Dashboard:** Automated statistics on reads, top categories, and peak access hours. | 1-click management report export. |

---

### 5.2 Workflow Comparison with Competitors

| Workflow Step | Current Manual Workflow | Enterprise Systems (DSpace / Koha) | Optimized Workflow on **LIBIF** |
|---|---|---|---|
| **1. File Ingest** | Save raw PDFs on local disk or personal Google Drive. | Multi-step complex admin upload interface in open-source systems. | **Drag-and-drop raw PDF to Admin Portal**; automated async S3 ingest & compression. |
| **2. Metadata Entry** | Manually log title, author, ISBN in disconnected Excel sheets. | Complex manual entry using MARC21/Dublin Core standards. | **Scan/Type ISBN**: Automated Google Books API call pre-fills 80% metadata. |
| **3. OCR & Processing** | No OCR. Raw image PDFs non-searchable. | Dependent on external batch OCR plugins; complex setup, server overload risks. | **Automated Pipe & Filter Tesseract OCR (`vie`) Queue**; 50%+ compression, searchable text layer. |
| **4. Discovery & Access** | Readers message librarians; receive files via email/Zalo. | Search via OPAC, download PDF file to local device (copyright risk). | **Online Catalog Portal**: Full-text search & read directly via **DRM Canvas Reader** (anti-copy/download). |
| **5. Reporting** | Manual tallying of borrow logs, delayed paper reports. | Basic file download counts; lacks granular reading behavior charts. | **Real-time Dashboard**: Automated statistics on total reads, reading time, popular categories, Excel export. |

---

### 5.3 Workflow Comparison with Tool Combinations

| Workflow Dimension | Tool Combination (Nextcloud + Paperless-ngx + Drive) | Optimized Workflow on **LIBIF** |
|---|---|---|
| **File Management** | Must configure sync across 3 distinct services; fragmented data, permission errors. | **Single All-in-One Platform**: Centralized PDF, Metadata, OCR, and Access Control management. |
| **Vietnamese OCR Engine** | Paperless-ngx uses basic OCR without image preprocessing; lower diacritic accuracy. | **Tailored Tesseract OCR (`vie`)**: Grayscale, thresholding, and deskewing image preprocessing for high accuracy. |
| **Security & DRM** | Google Drive / Nextcloud allows raw file downloads or default iframe viewing. | **Proprietary DRM Canvas Reader**: Dynamic Canvas rendering, right-click/shortcut blocking, dynamic watermarking. |
| **Ops & Maintenance Cost** | Requires dedicated IT staff to maintain, update, and glue 3 separate tools together. | **Streamlined Modular Monolith**: 1-Click Docker Compose deployment, low cloud ops cost (~1.2M-2M VND/mo). |

---

## 6. MVP PROJECT SCOPE & SPRINT ROADMAP

### 6.1 In-Scope for 8-Week MVP
- ✅ **Authentication & RBAC:** 3 roles — Librarian, Reader, Admin.
- ✅ **PDF Ingest (US-01):** Drag-and-drop PDF upload to S3 object storage.
- ✅ **Smart ISBN Metadata (US-02):** Google Books API auto-fill integration.
- ✅ **Async Tesseract OCR Queue (US-03):** Redis + BullMQ background worker pipeline.
- ✅ **Online Catalog Search (US-04):** Multi-attribute filtering (category, tags, publication year).
- ✅ **Full-Text Content Search (US-05):** Keyword search inside OCR text layers.
- ✅ **DRM Canvas Reader (US-06):** In-browser canvas rendering, expiring presigned URLs (< 60s), anti-copy/print.
- ✅ **Management Analytics (US-07):** Statistics dashboard for total reads and category usage.
- ✅ **Admin Approval Workflow (US-08):** Librarian catalog review and publishing pipeline.
- ✅ **Category & Tag Admin (US-09):** Tree-structure category hierarchy management.

### 6.2 Out-of-Scope for MVP
- ❌ Native Mobile Apps (iOS/Android — Web Responsive only).
- ❌ Legacy physical library protocols (SIP2/Z39.50 integration).
- ❌ Automatic AI book categorization beyond ISBN API.
- ❌ Commercial e-commerce payment gateways.

---

## 7. CORE SYSTEM REQUIREMENTS

### 7.1 Key Functional Requirements
- **FR1 (Async PDF Queue):** Decouple heavy OCR processing using Redis + BullMQ worker queue to prevent 504 timeouts.
- **FR2 (Full-Text Search):** Search keywords inside OCR-generated text layers with snippet highlighting.
- **FR3 (Copyright Protection):** DRM Reader must render PDF pages as canvas pixels, conceal raw URLs, and block download/copy events.

### 7.2 Key Non-Functional Requirements
- **Availability:** **99.9%** uptime to support 24/7 student learning.
- **Performance:** Background OCR & compression processing under **< 5 seconds/page** average.
- **Low Operational Footprint:** Run on standard cloud VM hosting for **~1.2M – 2.0M VND/month**.

---

## 8. CONCLUSION

The updated **Vision & Scope Document** is fully aligned with the **Project Proposal**. By automating manual librarian bottlenecks, protecting intellectual property with a DRM Canvas Reader, and leveraging a lightweight Tesseract OCR pipeline, LIBIF establishes a secure, practical, and highly achievable digital library foundation.
