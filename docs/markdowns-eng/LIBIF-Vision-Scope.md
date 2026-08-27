# LIBIF
## Intelligent Library Digitization & Document Management System

---

# PROJECT VISION & SCOPE DOCUMENT

> Comprehensive analysis of the current manual state, derived system features, target future state workflow, and business process comparisons against manual workflows, commercial enterprise competitors, and DIY tool stacks.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization & Document Management System |
| **Document Type** | Project Vision & Scope Document |
| **Status** | Approved v3.0 (Structured Current/Future States & Process Comparisons) |
| **Date** | July 19, 2026 |
| **Development Team** | 6 Senior Students, Faculty of Computer Science & Engineering — HCMUS |
| **Technical Support** | Antigravity AI Assistant · GitHub Copilot |

---

## 1. PROJECT OVERVIEW & VISION

The **LIBIF** Library Digitization System addresses the urgent institutional challenge of converting physical book collections in university faculties into secure, searchable digital assets (e-books, PDFs). The system automates librarian upload workflows, processes document contents via open-source **Tesseract OCR (`vie`)**, centralizes metadata cataloging, and provides a secure online discovery portal for readers.

### 1.1 Core Vision Statement
To serve as a comprehensive, highly secure, and cost-effective library digitization management platform. **LIBIF** aims to eliminate physical learning barriers, preserve rare academic materials, and protect intellectual property while establishing a baseline digital transformation standard for educational institutions.

### 1.2 Strategic Goals & Impact Objectives
1. **Operational Efficiency:** Reduce librarian manual data entry time by **70%**, cutting book processing overhead from 45–60 minutes down to automated 1-click ingest.
2. **Instant Student Access:** Eliminate document access delays, shifting student access time from **24–72 hours** down to instant 24/7 self-service.
3. **Copyright Protection:** Prevent raw PDF leakage and unauthorized file sharing via Zalo/Telegram through in-browser DRM rendering and Dynamic Watermarking (Student ID + IP + Timestamp).
4. **Economic Viability:** Maintain cloud operational expenses under **~1.2M – 2.0M VND/month** (~70.44M VND/year), saving over 80% compared to commercial enterprise software.

---

## 2. CURRENT STATE ANALYSIS & DERIVED SYSTEM FEATURES

### 2.1 Current State: The Manual Digitization Workflow
Currently, academic faculty libraries operate an error-prone, highly fragmented manual workflow:
1. **Manual Scan & File Naming:** Staff manually scan books page-by-page on flatbed scanners and rename PDF files on local workstation storage.
2. **Disconnected Excel Data Entry:** Metadata (title, author, publisher, ISBN) is manually typed into local Excel spreadsheets without validation or standardization.
3. **No OCR Processing:** Scanned PDFs remain static image files, making full-text content search impossible for students and researchers.
4. **Ad-hoc Messaging Distribution:** Students message librarians via Zalo/Email to request files; librarians search computer folders for up to 30 minutes to locate, attach, and send raw PDFs.
5. **Copyright & Metric Blindness:** Distributed raw PDFs are copied freely across social media; management has zero visibility into readership metrics or utilization rates.

### 2.2 Derivation of Core System Features from Manual Current State Pain Points
From the friction, losses, and vulnerabilities of the current manual state, the core features of the **LIBIF** system are directly derived:

| Current Manual State Bottleneck | Operational Impact & Institutional Loss | Derived LIBIF System Feature | Target Impact Metric |
|---|---|---|---|
| Scattered local PDF files, manual file naming | Data fragmentation, lost document assets | **Centralized Asset Management (DMS):** Secure AWS S3 object storage linked to Postgres metadata records. | 100% centralized asset indexing |
| Manual Excel metadata entry (15–20 min/book) | Workforce loss, high data entry error rate | **Smart Metadata Form (US-02):** Auto-populates title, author, and publisher via Google Books ISBN lookup API. | 80% reduction in entry time |
| Static image PDFs without text layer | Students unable to search inside document content | **Async Tesseract OCR Pipeline (US-03):** Redis + BullMQ queue generates searchable Vietnamese text layers (`vie`). | 100% full-text OCR coverage |
| Passive student wait time via Zalo/Email (24–72h) | Access loss, directly impaired learning performance | **Online Discovery Portal (US-04, US-05):** 24/7 self-service catalog & full-text snippet search. | Instant 24/7 self-service access |
| Raw PDF downloads via email cause piracy | Copyright loss, institutional IP liability | **DRM Canvas Reader & Dynamic Watermark (US-06):** Canvas rendering, expiring presigned URLs (< 60s), anti-copy/print, & Student ID + IP + timestamp overlay. | Zero raw PDF exposure & 100% leak traceability |
| Manual email access list management | High administrative burden adding student emails | **Campus SSO Integration (US-00):** Automated access control synced with campus Single Sign-On and course enrollment records. | Zero-friction student access |
| Paper-based loan tracking / zero reading metrics | Unable to justify procurement budget | **Real-Time Analytics Dashboard (US-07):** Automated statistics on total reads, top categories, peak access hours. | 1-click report export |

---

## 3. FUTURE STATE & OPTIMIZED WORKFLOW PIPELINE

### 3.1 Future State: End-to-End Automated Workflow
In the target **Future State**, LIBIF transforms the entire digitization lifecycle into a unified, secure 5-step automated pipeline:

```
[1. PHYSICAL SCAN]  →  [2. DRAG-DROP UPLOAD]  →  [3. SMART METADATA]  →  [4. ASYNC OCR QUEUE]  →  [5. DRM CANVAS READER]
 (Flatbed Scan)          (Raw PDF Ingest)        (ISBN Auto-fill)       (Tesseract vie)        (24/7 Secure Access)
```

1. **Step 1 (Ingest):** Librarian uploads raw scanned PDF to LIBIF Admin Portal via 1-click drag-and-drop.
2. **Step 2 (Metadata):** Librarian scans or types ISBN; system auto-fills 80% of metadata via Google Books API.
3. **Step 3 (Async OCR & Compression):** System queues PDF into Redis + BullMQ background pipeline, running Tesseract OCR (`vie`) with grayscale/thresholding preprocessing and 50%+ file compression without freezing web server.
4. **Step 4 (Publishing & Indexing):** Document metadata and searchable text layers are published to the Online Discovery Portal with role-based access control.
5. **Step 5 (Secure Self-Service Discovery & Reading):** Students discover documents instantly 24/7, reading via the DRM Canvas Reader with dynamic watermark injection (Student ID + IP + Timestamp) preventing raw PDF downloads.

---

## 4. BUSINESS PROCESS WORKFLOW COMPARISONS

### 4.1 Comparison 1: LIBIF Future Workflow vs Current Manual Process

| Workflow Step | Current Manual Process | LIBIF Future State Workflow | Operational Improvement |
|---|---|---|---|
| **File Ingest & Storage** | Local disk / personal Google Drive folder. | Centralized AWS S3 object storage with Postgres metadata linkage. | Eliminates file loss & scattered storage. |
| **Metadata Ingest** | Manually type title, author, publisher into Excel. | 1-Click ISBN scan / auto-fill via Google Books API. | Reduces cataloging time from 20 min to < 2 min. |
| **OCR Processing** | None. Image PDFs are non-searchable. | Automated background Redis + BullMQ Tesseract OCR (`vie`) queue. | Enables full-text keyword search. |
| **Student Discovery & Access** | Student messages librarian; waits 24–72 hours for raw PDF attachment via email/Zalo. | Instant 24/7 self-service catalog search & in-browser DRM reading. | Shifts access delay from 24–72h to instant. |
| **Security & Copyright** | Raw PDF sent via email; copied freely across social media. | HTML5 Canvas rendering, expiring presigned URLs (< 60s), anti-copy/print, & dynamic watermark overlay. | Prevents raw PDF downloads & traces screenshot leaks. |
| **Usage Analytics** | Manual borrow logs; delayed paper reports. | Real-time analytics dashboard tracking reads, peak hours, popular categories. | Provides 1-click management decision data. |

---

### 4.2 Comparison 2: LIBIF Future Workflow vs Competitor Workflows (Enterprise & Commercial)

| Workflow Dimension | Open-Source Repositories (DSpace / Koha) | Commercial Enterprise Software (Vebrary - Lạc Việt / Libol - Tinh Vân) | LIBIF Future State Workflow |
|---|---|---|---|
| **Primary Scope & Focus** | Open Access thesis archiving (DSpace) or physical book circulation (Koha). Adopted by VNU, HCMUT, Da Lat Univ. | International standard library management (MARC21, Z39.50) for central university libraries. | Department & Faculty-level digital document management & secure e-textbook reading. |
| **Ingest & Cataloging** | Multi-step admin ingest interface; requires pre-OCR'd PDFs. High Solr/Tomcat overhead. | Heavy manual cataloging steps and complex MARC21 data entry. | **1-Click Ingest**: Drag-drop PDF upload + ISBN auto-fill & async Tesseract OCR queue. |
| **Security & DRM Protection** | ❌ **No Copy DRM**: Basic login control; downloaded PDFs can be freely redistributed. | ❌ Complex access control; lacks in-browser Canvas DRM and dynamic watermarking. | 🟢 **Canvas DRM + Dynamic Watermark**: Blocks downloads, overlays Student ID + IP to trace screenshot leaks. |
| **Cost & Operational Overhead** | Moderate IT maintenance complexity. | ❌ **High Cost**: 125M – 1.25B VND/year licensing and maintenance. | 🟢 **High ROI**: ~1.2M – 2.0M VND/month cloud ops; zero high licensing fees. |

---

### 4.3 Comparison 3: LIBIF Future Workflow vs Informal Tools / Google Drive & Email

| Workflow Issue / Dimension | Google Drive / Email / Ad-Hoc Tools | LIBIF Future State Workflow |
|---|---|---|
| **Distribution Control** | ❌ Files can be copied freely & redistributed via social media | ✅ Secure in-browser HTML5 Canvas reading, expiring presigned URLs (< 60s), no raw downloads |
| **Full-text Search** | ❌ Search by file name only; scanned image PDFs non-searchable | ✅ Full-text OCR keyword search inside document content with snippet highlighting |
| **Access Speed** | ❌ Dependent on librarian availability (24–72h wait delay) | ✅ Instant, 24/7 self-service discovery and reading portal |
| **Usage Reporting** | ❌ No usage metrics or readership tracking | ✅ Real-time analytics dashboard for total reads, peak hours, and category usage |
| **Copyright Compliance** | ❌ No technical enforcement; exposes institution to IP liabilities | ✅ Embedded technical DRM protection with dynamic student ID + IP + timestamp watermarking |

---

## 5. MVP PROJECT SCOPE & SPRINT ROADMAP

### 5.1 In-Scope for 8-Week MVP
- ✅ **Authentication & Campus SSO (US-00):** Campus Single Sign-On integration & 3 roles — Librarian, Reader, Admin.
- ✅ **PDF Ingest (US-01):** Drag-and-drop PDF upload to S3 object storage.
- ✅ **Smart ISBN Metadata (US-02):** Google Books API auto-fill integration.
- ✅ **Async Tesseract OCR Queue (US-03):** Redis + BullMQ background worker pipeline.
- ✅ **Online Catalog Search (US-04):** Multi-attribute filtering (category, tags, publication year).
- ✅ **Full-Text Content Search (US-05):** Keyword search inside OCR text layers.
- ✅ **DRM Canvas Reader & Dynamic Watermark (US-06):** In-browser canvas rendering, expiring presigned URLs (< 60s), anti-copy/print, and Student ID + IP + timestamp watermark overlay.
- ✅ **Management Analytics (US-07):** Statistics dashboard for total reads and category usage.
- ✅ **Admin Approval Workflow (US-08):** Librarian catalog review and publishing pipeline.
- ✅ **Category & Tag Admin (US-09):** Tree-structure category hierarchy management.

### 5.2 Out-of-Scope for MVP
- ❌ Native Mobile Apps (iOS/Android — Web Responsive only).
- ❌ Legacy physical library protocols (SIP2/Z39.50 integration).
- ❌ Automatic AI book categorization beyond ISBN API.
- ❌ Commercial e-commerce payment gateways.

---

## 6. CORE SYSTEM REQUIREMENTS

### 6.1 Key Functional Requirements
- **FR1 (Async PDF Queue):** Decouple heavy OCR processing using Redis + BullMQ worker queue to prevent 504 timeouts.
- **FR2 (Full-Text Search):** Search keywords inside OCR-generated text layers with snippet highlighting.
- **FR3 (Copyright Protection & DRM):** DRM Reader must render PDF pages as canvas pixels, conceal raw URLs, block download/copy events, and inject dynamic watermarks (Student ID, IP, timestamp) overlay.
- **FR4 (Campus Access Control):** Integrate authentication with Campus Single Sign-On (SSO) and course enrollment records.

### 6.2 Key Non-Functional Requirements
- **Availability:** **99.9%** uptime to support 24/7 student learning.
- **Performance:** Background OCR & compression processing under **< 5 seconds/page** average.
- **Low Operational Footprint:** Run on standard cloud VM hosting for **~1.2M – 2.0M VND/month**.

---

## 7. CONCLUSION

The revised **Vision & Scope Document** clearly defines the Current State manual bottlenecks and derives all core LIBIF system features to achieve the target Future State. By providing comprehensive business process comparisons against manual workflows, commercial enterprise competitors, and DIY tool combinations, LIBIF demonstrates exceptional operational ROI, robust DRM security, and technical feasibility for academic library digitalization.
