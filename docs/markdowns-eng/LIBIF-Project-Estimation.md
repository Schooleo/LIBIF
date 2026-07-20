# LIBIF
## Intelligent Library Digitization & Document Management System

---

# SOFTWARE PROJECT ESTIMATION DOCUMENTATION

> Detailed estimation document covering Work Breakdown Structure (WBS), PERT 3-Point estimation, AI Acceleration Factors, Resource Breakdown Structure (RBS), RACI Matrix, and Total Project Budget.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Project Cost & Schedule Estimation) |
| **Date** | July 10, 2026 |
| **Author** | Project Manager & Lead Architect |

---

## 1. WORK BREAKDOWN STRUCTURE (WBS)

The project work scope is broken down into 5 main Work Packages (WPs):

- **WP1: Project Governance & Architecture Setup** (System architecture, CI/CD, DB Schema).
- **WP2: Digitization & Metadata Module** (Raw PDF Upload, Google Books ISBN API integration).
- **WP3: Background OCR & Processing Pipeline** (Redis BullMQ Queue, VietOCR Worker, Searchable PDF generation).
- **WP4: Reader Discovery & Secure DRM Viewer** (Online Catalog, Full-text Search, DRM Canvas Reader).
- **WP5: Admin Analytics & QA Handoff** (Dashboard analytics, UAT testing, Deployment).

---

## 2. PERT ESTIMATION & AI ACCELERATION FACTORS

Effort estimation utilizes **PERT 3-Point Estimation** ($E = \frac{O + 4M + P}{6}$), adjusted by an **AI Acceleration Factor ($\alpha$)** resulting from the integration of GitHub Copilot and Antigravity AI Assistant.

$$\text{Final Effort} = E \times (1 - \alpha)$$

| Work Package | Optimistic (O) | Most Likely (M) | Pessimistic (P) | PERT Effort (E) | AI Factor ($\alpha$) | Final Adjusted Effort |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **WP1: Setup & Infra** | 3 days | 5 days | 8 days | 5.17 days | 30% | **3.62 days** |
| **WP2: Upload & Metadata** | 5 days | 8 days | 12 days | 8.17 days | 35% | **5.31 days** |
| **WP3: VietOCR Queue** | 8 days | 12 days | 18 days | 12.33 days | 40% | **7.40 days** |
| **WP4: Reader & DRM** | 7 days | 10 days | 15 days | 10.33 days | 35% | **6.71 days** |
| **WP5: Dashboard & QA** | 4 days | 7 days | 10 days | 7.00 days | 40% | **4.20 days** |
| **TOTAL EFFORT** | **27 days** | **42 days** | **63 days** | **43.00 days** | **~36%** | **27.24 days** |

---

## 3. RESOURCE BREAKDOWN STRUCTURE (RBS) & RACI MATRIX

### 3.1 Resource Breakdown Structure (6 Members)
- **1 Project Manager / Lead Architect** (Project governance, architecture, CI/CD, core API).
- **1 Backend Engineer** (Database, S3 integration, Auth & Security API).
- **1 AI / OCR Specialist** (VietOCR pipeline tuning, BullMQ worker queue).
- **1 Frontend Engineer** (Catalog Portal, DRM Canvas Reader, Dashboard).
- **1 UI/UX Designer & Tech Writer** (UI mockups, design system, user manual).
- **1 QA / Testing Engineer** (Unit tests, E2E test scripts, security testing).

### 3.2 RACI Matrix

| Task / Deliverable | PM / Architect | Backend Dev | AI Specialist | Frontend Dev | UI/UX / Writer | QA Engineer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **System Architecture** | **A / R** | C | C | C | I | I |
| **PDF Upload & S3** | A | **R** | C | C | I | I |
| **VietOCR Worker Queue** | A | C | **R** | I | I | C |
| **DRM Canvas Reader** | A | C | I | **R** | C | C |
| **Admin Dashboard** | A | C | I | **R** | C | I |
| **QA & UAT Testing** | A | I | I | I | I | **R** |

---

## 4. TOTAL PROJECT BUDGET ESTIMATION

### 4.1 Development Labor Budget (8-Week MVP)

| Role | Headcount | Monthly Fee / Person | Total Fee (2 Months) |
|---|:---:|:---:|:---:|
| PM / System Architect (Lead) | 1 | 10,000,000 VND | **20,000,000 VND** |
| Backend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** |
| AI / OCR Specialist | 1 | 8,500,000 VND | **17,000,000 VND** |
| Frontend Engineer | 1 | 8,000,000 VND | **16,000,000 VND** |
| UI/UX Designer & Tech Writer | 1 | 5,500,000 VND | **11,000,000 VND** |
| QA / Testing Engineer | 1 | 5,250,000 VND | **10,500,000 VND** |
| **SUBTOTAL LABOR COST** | **6** | — | **90,500,000 VND** |

### 4.2 Infrastructure & Contingency Reserve
- **Cloud Infrastructure (Development & Testing):** **3,500,000 VND** (AWS EC2, S3, Redis).
- **Contingency Reserve (15%):** **14,100,000 VND**.
- **TOTAL ESTIMATED PROJECT BUDGET:** **108,100,000 VND** (Direct labor baseline: **90.5M VND**).
