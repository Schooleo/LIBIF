# LIBIF
## Intelligent Library Digitization & Document Management System

---

# AI AND HUMAN-IN-THE-LOOP DOCUMENT EVALUATION GUIDE
### (AI-HUMAN-IN-THE-LOOP DOCUMENT EVALUATION GUIDE)

> Standardized 4-step evaluation workflow for software project documentation quality using a **Human-in-the-loop (HITL)** model: AI initial analysis $\rightarrow$ Human expert review, score override & sign-off.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Human-in-the-loop Governance Framework) |
| **Date** | July 20, 2026 |
| **Author** | QA & AI Prompt Engineering Team |

---

## 1. HUMAN-IN-THE-LOOP (HITL) GOVERNANCE OBJECTIVES

Applying AI Assistants for software documentation review provides high speed and broad scanning coverage. However, AI can suffer from hallucinations, lack organizational context, or evaluate overly optimistically/pessimistically.

The **Human-in-the-loop (HITL)** governance model establishes a strict rule: **"AI Proposes & Analyzes — Humans Audit & Decide"**, ensuring project documentation achieves both technical precision and practical alignment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      HITL CRITIQUE INTERACTION WORKFLOW                     │
├─────────────────┬───────────────────┬───────────────────┬───────────────────┤
│ 1. AI DRAFTING  │ 2. AI EVALUATION  │ 3. HUMAN REVIEW   │ 4. FINAL APPROVAL │
│ • Prompt parsing│ • Scored Rubric   │ • Expert Critique │ • Human Sign-off  │
│ • Doc Synthesis │ • Deficit Analysis│ • Override Score  │ • Freeze Baseline │
└─────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

---

## 2. 4-STEP EVALUATION WORKFLOW

### Step 1: AI Prompting & Automated Document Scan
- **AI Action:** AI scans all `.md` and `.pdf` documentation files (`Project-Proposal.md`, `LIBIF-Vision-Scope.md`, `LIBIF-Architecture.md`...).
- **Output:** Synthesized raw data mapped against 21 Rubric criteria.

### Step 2: AI Baseline Evaluation
- **AI Action:** AI outputs a baseline score draft across 10 criteria, identifying documentation gaps.
- **Output:** Preliminary evaluation report (e.g., `evaluation.md` or `report.md`).

### Step 3: Human Expert Review & Critique
- **Human Action (PM / Lead Architect):**
  1. Audits authenticity of AI metrics (e.g., team size 4 vs 6 members, cost 62.5M vs 90.5M VND).
  2. Critiques theoretical AI assumptions against local realities (e.g., Vietnamese copyright law risks).
  3. Logs rationale for score overrides.

### Step 4: Final Sign-off & Baseline Freeze
- **Collaborative Action:** Human experts request documentation revisions or directly fill missing sections. Once 100% compliant, PM signs off on baseline freeze.

---

## 3. HUMAN OVERRIDE MATRIX (AI VS HUMAN REVIEW)

| Evaluation Criterion | Initial AI Score | Human Expert Critique | Final Approved Score |
|---|:---:|---|:---:|
| **1. Problem Validation** | **9.0 / 10** | Concur with AI. Librarian time loss metric (45-60 min/book) at HCMUS is accurate. | **9.0 / 10** |
| **5. Business Viability** | **8.0 / 10** | **Adjustment:** AI missed team headcount expansion (4 to 6 members), raising budget to 90.5M VND. Score adjusted to reflect viability. | **8.5 / 10** |
| **9. Risk Assessment** | **7.5 / 10** | **Human Warning:** Copyright risk is CRITICAL. Mandate DRM Canvas Reader deployment to mitigate legal liabilities. | **6.5 / 10** |

---

## 4. RACI RESPONSIBILITY MATRIX FOR HITL REVIEW

| Role / Stakeholder | AI Assistant | Project Manager (PM) | Lead Architect | Legal & QA Expert |
|---|:---:|:---:|:---:|:---:|
| **Initial Rubric Scanning** | **R** (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
| **Cost & Schedule Audit** | C (Consulted) | **R / A** | C (Consulted) | I (Informed) |
| **Architecture & PoC Audit** | C (Consulted) | I (Informed) | **R / A** | I (Informed) |
| **Legal & Copyright Audit** | C (Consulted) | A (Accountable) | I (Informed) | **R** |
| **Final Baseline Approval** | I (Informed) | **A** | C (Consulted) | C (Consulted) |

*Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed.*
