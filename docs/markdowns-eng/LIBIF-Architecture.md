# LIBIF
## Intelligent Library Digitization & Document Management System

---

# SYSTEM ARCHITECTURE DOCUMENTATION

> Detailed architectural design document for the LIBIF Library Digitization project. Evaluates overall architecture options, data processing models, communication patterns, and tech stack selection.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (System Architecture Design) |
| **Date** | July 10, 2026 |
| **Author** | Lead Architect & Engineering Team |

---

## 1. APPLICATION TYPE

**LIBIF** is an **Enterprise Web Application** serving two distinct operational interaction flows:

- **Reader Portal:** External responsive web portal enabling students/readers to search and read digitized books securely.
- **Librarian Admin Panel:** Internal administrative web portal for librarians to upload scanned raw PDF files, review quality, ingest metadata, and monitor system analytics.

---

## 2. OVERALL ARCHITECTURE EVALUATION & SELECTION

To establish a solid foundation, the engineering team evaluated two primary architecture patterns: **Modular Monolith** vs **Microservices**:

| Option Evaluated | Core Strengths | Challenges & Drawbacks |
|---|---|---|
| **Modular Monolith** | • Simple deployment, low operational overhead.<br>• In-process function calls, high performance.<br>• Clean code isolation at module level. | • Shared physical database across modules.<br>• Shared CPU/Memory server resources. |
| **Microservices** | • Independent scaling per service.<br>• Isolated physical databases per domain.<br>• Technological flexibility per service. | • High infrastructure complexity & cost.<br>• Network latency across RPC/REST calls.<br>• Difficult for small engineering teams. |

### ✅ Decision & Rationale: Modular Monolith

The system adopts the **Modular Monolith** architecture. This choice minimizes operational complexity during MVP deployment, optimizes server resource utilization, and speeds up time-to-market. Clear folder structure isolation (Authentication, Upload, Catalog, Reader, Processing) keeps code clean and decouples modules, leaving them ready for future Microservice extraction if OCR workloads scale massively.

---

## 3. DATA PROCESSING MODEL SELECTION (PDF & OCR)

The PDF processing pipeline (**Validation $\rightarrow$ Compression $\rightarrow$ Tesseract OCR (`vie`) Searchable Layer Injection $\rightarrow$ Full-text Indexing**) requires a robust data stream architecture. We evaluated two models:

| Model Evaluated | Characteristics & Advantages | Suitability for Library Digitization |
|---|---|---|
| **Pipe and Filter** | • Breaks pipeline into independent filters.<br>• Data flows continuously through filters. | ✅ Exceptionally suitable for raw PDF processing.<br>✅ Easy quality inspection at each step. |
| **Batch Sequential** | • Processes large data batches sequentially.<br>• Each step must wait 100% for previous step. | ❌ High latency for thick books.<br>❌ Risk of memory exhaustion (OOM) on heavy files. |

### ✅ Decision: Pipe and Filter with Task Queuing

The system chooses the **Pipe and Filter** pattern. Every uploaded PDF passes through a 4-stage filter pipeline. To implement this without blocking resources, we utilize **Redis + BullMQ** as an asynchronous task queue. Each filter runs as an independent worker step, maintaining high stability and CPU utilization.

```
[1. Validation]  →  [2. Compression]  →  [3. Tesseract OCR Text Layer]  →  [4. Indexing]
 (Format Check)     (DPI Optimization)     (Hidden Text Layer vie)          (Full-text Index)
```

---

## 4. COMMUNICATION AND INTERACTION MODEL

For communication between domain modules (e.g., upload events, OCR completion notifications, index updates), we evaluated two models:

| Model | Description & Strengths | Challenges |
|---|---|---|
| **Request - Response** | • Immediate client feedback.<br>• Simple, intuitive REST API programming. | • Blocking execution on long-running tasks.<br>• Unsuitable for heavy background workloads. |
| **Event-Driven** | • Loose coupling between domain modules.<br>• Decouples execution time for heavy tasks. | • Increased architecture complexity.<br>• Harder to trace visual data flows. |

### ✅ Decision: Hybrid Communication Model

The system adopts a **Hybrid** model:
- **Request-Response (REST API over HTTP)** for synchronous reader/admin interactions (auth, search, online reading).
- **Event-Driven Architecture (Asynchronous Events)** for background processing.

When a librarian uploads a book, the system emits a `BookUploadedEvent` and returns an instant `202 Accepted` response. The OCR Pipeline is triggered asynchronously by the Event Handler without blocking HTTP connections.

```
Uploader Module  →  BookUploadedEvent  →  Event Bus (EventEmitter)  →  OCR Worker Queue
                                           (Trigger Background Task)
```

---

## 5. SYSTEM COMPONENTS

The application is structured into modular domain boundaries inside the **Modular Monolith**:

- **Auth Module:** Manages JWT authentication, authorization, and RBAC roles (Librarian, Reader, Admin).
- **Upload Module:** Receives raw PDF files, stores them in Object Storage, and emits background processing events.
- **Catalog Module:** Indexes metadata, provides advanced filtering, and integrates with Google Books ISBN API.
- **Reader Module:** Verifies access rights, generates temporary S3 presigned URLs, and renders books securely via Canvas.
- **Processing Module:** Coordinates the Pipe and Filter pipeline for background PDF compression and Tesseract OCR (`vie`) execution.

### 5.1 Detailed Tech Stack

| Layer | Technology | Selection Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), TailwindCSS, PDF.js | High performance, server-side rendering, responsive UI, Canvas DRM viewer. |
| **Backend** | NestJS (TypeScript) | Strong TypeScript support, modular architecture, enterprise-grade structure. |
| **Database** | PostgreSQL 16 (Prisma ORM) | Relational integrity, native `tsvector` Vietnamese full-text search capability. |
| **Task Queue** | Redis 7 + BullMQ | Reliable queue handling, concurrency control, retry policies, progress tracking. |
| **AI / OCR** | Tesseract OCR (`vie`), PyMuPDF | Industry-standard open-source OCR engine with Vietnamese traineddata (`vie`) & image preprocessing. |
| **Storage** | MinIO / AWS S3 | Standard Object Storage for raw and processed PDF document assets. |

---

## 6. DATA SECURITY & ARCHITECTURAL QUALITY ATTRIBUTES

### 6.1 Security Mechanism & Anti-Download DRM

To protect library textbook copyright, the system enforces a strict security framework:

- **Presigned URLs:** Physical PDF files on MinIO/S3 are never publicly exposed. The backend generates temporary encrypted links with a **short-lived TTL (< 60s)**.
- **Direct Download Block:** The online Reader renders pages dynamically via an HTML5 Canvas element instead of embedding an `iframe` or raw PDF. Right-click context menus, F12 DevTools shortcuts, text selection, and printing commands are trapped and suppressed.

### 6.2 Core Architectural Quality Attributes

- **Maintainability:** Clear module boundaries inside the Modular Monolith allow independent domain updates. For instance, swapping local OCR libraries for a cloud provider requires no frontend modifications.
- **Scalability:** Ready-to-split design. Using Redis + BullMQ decouples the background processing server from the web server thread pool.
- **Fault Tolerance:** BullMQ provides automatic retry policies (3 retries) for transient network or file processing failures.

---

## 7. ARCHITECTURAL CONCLUSION

The architecture for the LIBIF Library Digitization System is optimized for security, performance, and operational cost efficiency:

- Adopted **Modular Monolith** to streamline early development and minimize infrastructure cost.
- Applied **Pipe and Filter** pattern managed by **Redis + BullMQ** worker queues for heavy async OCR.
- Applied **Hybrid Communication** (REST and Event-Driven) for responsive user interaction.

This design delivers high security, excellent performance, and clear scalability for digital library transformation.
