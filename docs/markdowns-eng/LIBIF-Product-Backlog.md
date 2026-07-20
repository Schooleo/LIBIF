# LIBIF
## Intelligent Library Digitization & Document Management System

---

# PRODUCT BACKLOG & ACCEPTANCE CRITERIA

> Central repository of product requirements structured as User Stories mapped directly to real-world library workflows for Librarians, Readers, and Management; detailing quantitative Acceptance Criteria (AC), Definition of Done (DoD), and Sprint Roadmap.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Standardized Product Backlog) |
| **Date** | July 10, 2026 |
| **Author** | LIBIF Engineering & Product Team |

---

## 1. PRODUCT BACKLOG OVERVIEW

The Product Backlog serves as the single source of truth for functional requirements, guiding the engineering team across 4 development Sprints. Requirements directly address pain points experienced by three key user groups: **Librarians**, **Borrowers/Readers**, and **Library Management**.

### 1.1 Requirement Structure
Each Backlog item comprises:
- **User Story ID & Title:** Unique identifier tracking code commits and test scripts (e.g., US-01, US-02...).
- **User Story Description:** Standard format: *"As a [Role], I want to [Action], So that [Benefit]"*.
- **Mapped Workflow Step:** Direct linkage to current manual bottleneck.
- **Acceptance Criteria (AC):** Quantitative, verifiable test conditions.

### 1.2 Definition of Done (DoD)
A User Story is marked "Done" only when fulfilling:
1. Clean code adhering to coding standards, verified via Peer Review.
2. Unit tests completed with a minimum **80% Code Coverage**.
3. Successful integration deployment on Staging environment with zero Blocker/Critical bugs.
4. All quantitative Acceptance Criteria (AC) verified by QA.
5. Technical documentation and API specs updated.

---

## 2. EPIC 1: DIGITIZATION & DOCUMENT MANAGEMENT

Focuses on librarian features, solving fragmented file storage and manual metadata entry.

### US-01: Upload Scanned Raw PDF (PDF Document Upload)
- **Description:** As a Librarian, I want to drag and drop raw PDF files to centralize scanned book assets.
- **Mapped Workflow:** Eliminates manual file saving on personal hard drives or fragmented Google Drives.
- **Acceptance Criteria (AC):**
  - **AC1:** Drag-and-drop interface supporting PDF uploads up to **200MB**.
  - **AC2:** Displays real-time upload progress bar with percentage.
  - **AC3:** Validates file formats, rejecting non-PDF files with clear error messages.
  - **AC4:** Uploaded files stored securely in Object Storage (MinIO/S3) with path logged in database.

### US-02: Smart Metadata Entry via ISBN (Smart Metadata Entry)
- **Description:** As a Librarian, I want to enter an ISBN code to auto-populate book metadata.
- **Mapped Workflow:** Solves error-prone manual Excel data entry.
- **Acceptance Criteria (AC):**
  - **AC1:** Input field integrated with barcode scanner via camera or handheld scanner.
  - **AC2:** Calling "Lookup" fetches Google Books API, auto-filling Title, Author, Publisher, Publication Year, and Summary.
  - **AC3:** Displays "Information not found, please enter manually" if ISBN lookup fails.
  - **AC4:** Librarian can select Categories from dropdown and input custom search Tags.

### US-03: Background Async OCR & Compression (Background OCR & Compression)
- **Description:** As a Librarian, I want the system to automatically compress PDFs and run OCR for full-text searchability.
- **Mapped Workflow:** Fixes non-searchable raw image PDFs.
- **Acceptance Criteria (AC):**
  - **AC1:** Compression and OCR executed asynchronously via Redis + BullMQ queue.
  - **AC2:** Compressed PDF reduces file size by at least **40%** while maintaining visual legibility.
  - **AC3:** VietOCR engine recognizes Vietnamese diacritics with at least **92%** accuracy on standard printed books.
  - **AC4:** Extracted text layer stored in PostgreSQL database for full-text search indexing.

---

## 3. EPIC 2: DISCOVERY & ONLINE READING

Focuses on reader features, enabling self-service digital access.

### US-04: Online Catalog Search (Online Catalog Search)
- **Description:** As a Reader, I want to search books by title, author, category, and tags.
- **Mapped Workflow:** Eliminates student messaging to librarians checking book availability.
- **Acceptance Criteria (AC):**
  - **AC1:** Search portal provides left-hand multi-attribute filtering (Category, Tags, Publication Year).
  - **AC2:** Results display in grid/list view with cover image, title, author, summary, and status.
  - **AC3:** Search query response time under **1.5 seconds** for a catalog of 10,000 books.

### US-05: Full-Text Content Search (Full-Text Search)
- **Description:** As a Reader, I want to search keywords inside book page contents for deep research.
- **Mapped Workflow:** Leverages background OCR text layers generated in US-03.
- **Acceptance Criteria (AC):**
  - **AC1:** Search bar offers "Search inside book content" toggle option.
  - **AC2:** Results display book title with highlighted text snippet.
  - **AC3:** Clicking a snippet opens the online reader and jumps directly to that specific page.

### US-06: Secure Online DRM PDF Viewer (Secure PDF Viewer)
- **Description:** As a Reader, I want to read books online in-browser without downloading files.
- **Mapped Workflow:** Prevents copyright leakage and unauthorized local downloads.
- **Acceptance Criteria (AC):**
  - **AC1:** Reader renders dynamically using HTML5 Canvas (PDF.js), concealing raw file tags.
  - **AC2:** Disables right-click, F12 DevTools, text copying (Ctrl+C), and printing shortcuts (Ctrl+P).
  - **AC3:** Raw PDF access secured via temporary AWS S3 Presigned URLs expiring in **15 minutes**.
  - **AC4:** Automatically bookmarks current reading page for subsequent sessions.

---

## 4. EPIC 3: MANAGEMENT & STATISTICAL ANALYTICS

Focuses on library management statistics.

### US-07: Statistics Dashboard (Statistics Dashboard)
- **Description:** As a Library Manager, I want to view analytical charts on digitized books, total reads, and popular categories.
- **Mapped Workflow:** Replaces manual Excel counting for end-of-period reports.
- **Acceptance Criteria (AC):**
  - **AC1:** Dashboard displays primary KPIs: Total Digitized Books, Total Reads, Registered Readers.
  - **AC2:** Pie chart for category distribution and line chart for weekly/monthly reading trends.
  - **AC3:** Date range filtering and Excel data export capability.

### US-08: Access Control & Approval Workflow (Librarian Approval Workflow)
- **Description:** As an Admin, I want to review digitized books before publishing them to readers.
- **Acceptance Criteria (AC):**
  - **AC1:** Uploaded books set to "Draft/Pending Approval" state after OCR completion.
  - **AC2:** Admin previews OCR PDF and metadata, clicking "Approve" (Publish) or "Reject".
  - **AC3:** Rejection requires entering a reason and reverting status to "Needs Revision".

### US-09: Category & Tag Management (Category & Tag Management)
- **Description:** As a Librarian, I want to manage categories and tags to organize digital assets.
- **Acceptance Criteria (AC):**
  - **AC1:** Tree-structure category management supporting Add/Edit/Delete parent and child categories.
  - **AC2:** Warns if deleting a category containing books, preventing data link corruption.
  - **AC3:** Centralized tag management for merging duplicate search tags.

---

## 5. SPRINT ROADMAP & PRIORITY ALLOCATION (MoSCoW)

| Timeline | User Story Items | MoSCoW Priority | Milestone Deliverables |
|---|---|:---:|---|
| **Sprint 1** <br>*(Weeks 1-2)* | • US-01: Upload PDF <br>• US-02: Smart Metadata <br>• Framework Setup | **MUST HAVE** | Functional file upload and metadata auto-fill forms. |
| **Sprint 2** <br>*(Weeks 3-4)* | • US-03: OCR & Compression <br>• US-04: Online Catalog <br>• Auth & RBAC | **MUST HAVE** | Stable background OCR queue, active online catalog portal. |
| **Sprint 3** <br>*(Weeks 5-6)* | • US-05: Full-text Search <br>• US-06: DRM Secure Viewer <br>• US-08: Book Approval | **MUST HAVE / SHOULD** | Anti-download secure viewer, full-text content snippet search. |
| **Sprint 4** <br>*(Weeks 7-8)* | • US-07: Management Dashboard <br>• US-09: Category/Tag Admin <br>• QA Testing & Fixes | **SHOULD HAVE / COULD** | Real-time management analytics, fully tested production build. |
