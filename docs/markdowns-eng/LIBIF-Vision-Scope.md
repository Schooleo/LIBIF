# LIBIF
## Intelligent Library Digitization & Document Management System

---

# PROJECT VISION & SCOPE DOCUMENT

> Document analyzing current state and manual workflows of Librarians, Readers, and Library Management; proposing core features and defining the future state for the Library Digitization system.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Detailed Manual Workflow Analysis) |
| **Date** | July 10, 2026 |
| **Author** | LIBIF Development Team |

---

## 1. PROJECT OVERVIEW

The Library Digitization System was established to address the challenge of converting massive physical book collections in universities, research institutes, and community libraries into digital formats (e-books, PDFs) for seamless online search, management, and reading. The system not only stores files but also standardizes librarian upload workflows, automatically processing file content using Optical Character Recognition (OCR) to enhance reader searchability and learning experiences.

### 1.1 Core Idea

The workflow begins by physically scanning printed books into raw PDF format. Librarians upload these PDF files to the system and complete a metadata entry form (book title, category, tags, ISBN, author...). The system then automates storage, file optimization, and provides a full-text online discovery portal for readers.

---

## 2. PROJECT VISION

To become a comprehensive, reliable, and intelligent library digitization management platform. **LIBIF** aims to eliminate geographical and physical barriers, preserving knowledge in rare, antique paper books or academic materials for long-term distribution under secure digital formats.

### 2.1 Closed-Loop Digitization Lifecycle

The system encompasses all steps in the library digitization value chain:

```
[SCAN]        →  [UPLOAD]    →  [METADATA]   →  [PROCESS]      →  [ACCESS]
(Physical Scan)   (File Upload)  (Entry/Ingest) (Optimize & OCR)  (Online Reader)
```

---

## 3. CURRENT STATE & MANUAL WORKFLOW ANALYSIS

The current management and access process for non-digitized or ad-hoc digitized books exhibits severe limitations for all participating stakeholders:

### 3.1 Librarian Workflow
- **Scanning & Storage:** Librarians use handheld or flatbed scanners to scan book pages into raw PDF files. These PDFs are manually saved on local PCs or uploaded to personal/library Google Drive folders.
- **Metadata Management:** Supplementary metadata like category, ISBN, author, and keywords are recorded in separate Excel spreadsheets or physical logbooks with no direct linking to the PDF files.
- **Reader Support:** When a reader requests a document, the librarian searches for the book title in Excel, locates the corresponding PDF in Google Drive, and sends it via email or Zalo messaging.
- **⚠️ Bottlenecks / Pain Points:** Scattered PDF files subject to loss. Manual Excel data entry is time-consuming and error-prone. No automated quality control for uploaded files.

### 3.2 Borrower / Reader Workflow
- **Document Request:** Readers must physically visit the library or message librarians to check if a book has been digitized.
- **Access & Reading:** Readers await responses, receiving attached PDF files via email or download links. They must download files to personal devices to read using external PDF software.
- **⚠️ Bottlenecks / Pain Points:** Readers are passive, dependent on librarian response times. No online full-text search. File downloads consume local device storage and pose severe copyright infringement risks due to uncontrolled redistribution.

### 3.3 Management Workflow
- **Reporting & Evaluation:** At period end, management requests librarians to manually compile statistics on digitization progress, borrow counts, and newly digitized assets.
- **⚠️ Bottlenecks / Pain Points:** Inaccurate statistics due to manual tallying, delayed reports, and lack of real-time visibility into actual student reading demand.

---

## 4. FEATURE PROPOSALS FROM WORKFLOW ANALYSIS

### 4.1 Feature Mapping Table

| Manual Workflow Pain Point | Corresponding System Feature |
|---|---|
| Scattered PDF storage, lost linkage with metadata. | **Centralized Document Management System (DMS):** PDF uploads linked directly to book metadata records. |
| Manual Excel data entry for catalog, tags, ISBN. | **Smart Metadata Form:** Auto-fills author, publisher, and summary via Google Books API ISBN lookup. |
| Readers cannot self-serve, fully dependent on librarians. | **Online Catalog Portal:** Advanced search by title, author, category, tags, and full-text search. |
| Forced PDF downloads increase copyright leakage risks. | **Secure In-App DRM Canvas Reader:** Secure online reading disabling copy and direct file downloads. |
| Lack of accurate metrics for management evaluation. | **Automated Reporting Dashboard:** Real-time metrics on read counts, average reading time, and popular categories. |

---

### 4.2 WORKFLOW-LEVEL COMPARISON WITH COMPETITORS

| Workflow Step | Current Manual Workflow | DSpace / Koha / Vebrary | Future State on **LIBIF** |
|---|---|---|---|
| **1. File Ingest** | Save raw PDFs on local disk or personal Google Drive. | Multi-step complex admin upload interface in open-source systems. | **Drag-and-drop raw PDF to Web Admin Portal**; automated async S3 ingest & compression queue. |
| **2. Metadata Entry** | Manually log title, author, ISBN in disconnected Excel sheets. | Complex manual entry using MARC21/Dublin Core standards. | **Scan/Type ISBN**: Automated Google Books API call pre-fills 80% metadata. |
| **3. OCR & Compression** | No OCR. Raw image PDFs non-searchable. | Dependent on external batch OCR plugins; complex setup, server overload risks. | **Automated Pipe & Filter VietOCR Worker Queue**; 50%+ size reduction, searchable text layer generation. |
| **4. Discovery & Reading** | Readers message librarians; receive files via email/Zalo. | Search via OPAC, download PDF file to local device (copyright risk). | **Online Catalog Portal**: Full-text search & read directly via **DRM Canvas Reader** (anti-copy/download). |
| **5. Reporting** | Manual tallying of borrow logs, delayed paper reports. | Basic file download counts; lacks granular reading behavior charts. | **Real-time Dashboard**: Automated statistics on total reads, reading time, popular categories, Excel export. |

---

### 4.3 WORKFLOW COMPARISON WITH TOOL COMBINATIONS

| Workflow Step | Tool Combination (Nextcloud + Paperless-ngx + Google Drive) | Optimized Workflow on **LIBIF** |
|---|---|---|
| **File Storage & Management** | Must configure sync across 3 distinct services; fragmented data, permission errors. | **Single All-in-One Platform**: Centralized PDF, Metadata, OCR, and Access Control management. |
| **Vietnamese OCR Workflow** | Paperless-ngx uses basic Tesseract OCR; low accuracy on Vietnamese diacritics (< 80%). | **Integrated VietOCR Deep Learning Model**: > 94% accuracy on Vietnamese diacritical text. |
| **Security & DRM** | Google Drive / Nextcloud allows raw file downloads or default iframe viewing. | **Proprietary DRM Canvas Reader**: Dynamic Canvas rendering, right-click/shortcut blocking, dynamic watermarking. |
| **Ops & Maintenance Cost** | Requires dedicated IT staff to maintain, update, and glue 3 separate tools together. | **Streamlined Modular Monolith**: 1-Click Docker deployment, minimal maintenance cost. |

---

## 5. FUTURE STATE

- **Librarian Workflow:** Scan books to PDF, upload via admin portal. System automatically optimizes file size and executes background VietOCR. Librarian scans ISBN barcode, system auto-fills metadata, librarian selects category and tags.
- **Reader Workflow:** Access online library portal, freely search books. Click to read instantly in secure PDF viewer with automatic page bookmarking.
- **Management Workflow:** Access management dashboard to monitor real-time library usage metrics and guide future procurement/digitization decisions.

---

## 6. MVP PROJECT SCOPE

### 6.1 In-Scope for MVP
- ✅ **Authentication & Authorization:** 3 roles — Librarian, Reader, Admin.
- ✅ **PDF Upload:** Admin portal supporting drag-and-drop raw PDF uploads to Object Storage.
- ✅ **Smart Metadata Entry:** Metadata form integrated with Google Books ISBN lookup API.
- ✅ **Background PDF Queue:** Async task queue handling image compression and Vietnamese/English OCR.
- ✅ **Reader Portal:** Web discovery interface with category, tag, and publication year filtering.
- ✅ **Secure Reader:** Integrated online viewer disabling right-click copy and direct file downloads.
- ✅ **Basic Analytics:** Tracking total reads, pages read, and top popular books.

### 6.2 Out-of-Scope
- ❌ Native Mobile Apps for iOS/Android (Web responsive only).
- ❌ Integration with legacy physical library management systems via legacy protocols (SIP2/Z39.50).
- ❌ AI-based automatic book categorization beyond ISBN lookup.
- ❌ Paid e-commerce book purchase system.

---

## 7. CORE REQUIREMENTS

### 7.1 Key Functional Requirements
- **FR1 (PDF Process Queue):** Asynchronous task queuing to prevent librarian connection blocking during heavy PDF uploads.
- **FR2 (Full-text Search):** Support keyword searching within OCR-extracted book text layers.
- **FR3 (Copyright Protection):** Online PDF reader must conceal raw storage URLs and disable standard download mechanisms.

### 7.2 Key Non-Functional Requirements
- **Availability:** **99.9%** uptime to support 24/7 student access.
- **OCR Efficiency:** Process OCR and compression under **5 seconds/page** average in background queue.
