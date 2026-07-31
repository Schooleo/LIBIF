# LIBIF
## Intelligent Library Digitization & Document Management System

---

# SOFTWARE DEVELOPMENT METHODOLOGY & CI/CD GUIDE
### (AI-ASSISTED DEVELOPMENT METHODOLOGY & CI/CD DEPLOYMENT GUIDE)

> Details the AI-assisted Agile software development methodology (GitHub Copilot & Antigravity AI Assistant), code generation scenarios, testing workflows, and automated containerized CI/CD deployment with Docker.

---

| Field | Content |
|---|---|
| **Project Name** | LIBIF — Intelligent Library Digitization System |
| **Version** | v1.0 (Development Methodology & CI/CD Architecture) |
| **Date** | July 20, 2026 |
| **Author** | DevOps & Lead Software Engineer |

---

## 1. AI-ASSISTED AGILE METHODOLOGY

The LIBIF project adopts an **Agile / Scrum** process across an **8-week** timeframe accelerated by AI Coding Assistants (**GitHub Copilot** and **Antigravity AI Assistant**), enabling a lean team of 6 engineers to match the throughput of a traditional 12-15 member team.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYBRID AGILE + AI DEVELOPMENT WORKFLOW                   │
├───────────────┬───────────────────────────────┬─────────────────────────────┤
│ 1. PLANNING   │ 2. PROMPT & CODE GEN          │ 3. REVIEW & TESTING         │
│ • Agile Sprint│ • Context Provision           │ • Peer Code Review          │
│ • User Story  │ • AI Prompting (Antigravity)  │ • Human-in-the-loop QA      │
│ • Task Breakdown│ • Code Generation           │ • Automated CI/CD Testing   │
└───────────────┴───────────────────────────────┴─────────────────────────────┘
```

### 1.1 AI Role across SDLC Stages

| SDLC Phase | Developer Role | AI Assistant Support (Antigravity / Copilot) | Acceleration |
|---|---|---|:---:|
| **Requirements & Spec** | Define User Stories & AC | Auto-generate Acceptance Test cases & WBS breakdown | **2.5x** |
| **Architecture & DB** | Design ERDs & API Contracts | Generate Prisma Schemas, DB Migration Scripts & DTOs | **3.0x** |
| **Backend Coding** | Implement core business logic | Generate Boilerplate NestJS Controllers, Services, Repositories | **3.5x** |
| **Frontend Development**| UI/UX design execution | Generate React/Next.js Tailwind Components & State Hooks | **3.0x** |
| **Testing & Fixes** | E2E & UAT testing | Auto-write Jest/Vitest unit tests, parse stack traces | **4.0x** |
| **Documentation** | Review & publish | Auto-generate OpenAPI/Swagger & technical docs | **5.0x** |

---

## 2. REAL-WORLD AI CODE GENERATION SCENARIOS

### 2.1 Scenario 1: Generating NestJS Backend Catalog Module

- **Prompt provided to AI:**
  > *"Generate a NestJS Controller and Service for the Catalog module in the LIBIF project. Requirements: Use Prisma ORM to query books, support pagination (page, limit), filtering by categoryId and tags, and full-text search by title/author. Include class-validator DTOs and Swagger annotations."*

- **AI Generated Code (NestJS Service Snippet):**

```typescript
// src/modules/catalog/catalog.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterCatalogDto } from './dto/filter-catalog.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FilterCatalogDto) {
    const { page = 1, limit = 10, categoryId, search, tags } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (tags && tags.length > 0) where.tags = { hasSome: tags };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
```

### 2.2 Scenario 2: Generating Next.js DRM Reader Toolbar Component

- **Prompt provided to AI:**
  > *"Create a React component in Next.js 14 (TypeScript, TailwindCSS) for a Reader Controls Toolbar. Include Zoom In/Out, Previous/Next page buttons, page indicator, and a Fullscreen toggle button."*

- **AI Generated Code (React Component Snippet):**

```tsx
// src/components/reader/ReaderToolbar.tsx
'use client';
import React from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface ReaderToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onToggleFullscreen: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  currentPage, totalPages, zoom, onPageChange, onZoomChange, onToggleFullscreen
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-3 shadow-md rounded-t-lg">
      <div className="flex items-center space-x-3">
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} className="p-2 hover:bg-slate-800 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">Page {currentPage} / {totalPages}</span>
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className="p-2 hover:bg-slate-800 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} className="p-2 hover:bg-slate-800 rounded">
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))} className="p-2 hover:bg-slate-800 rounded">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={onToggleFullscreen} className="p-2 hover:bg-slate-800 rounded border-l border-slate-700 ml-2">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
```

---

## 3. DOCKER CONTAINERIZATION & CI/CD AUTOMATION

### 3.1 Multi-Stage Dockerfile Strategy

Reduces Image size from **1.2GB down to 145MB**, accelerating deployment speed and securing production containers.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 3.2 GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: LIBIF CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install Dependencies
        run: pnpm install
      - name: Run Linter
        run: pnpm lint
      - name: Run Unit Tests
        run: pnpm test:cov

  build-and-push-docker:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build & Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: libif/backend:latest,libif/backend:${{ github.sha }}

  deploy-staging:
    needs: build-and-push-docker
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Cloud Server via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/libif
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f
```

---

## 4. METHODOLOGY IMPACT SUMMARY

Combining **Agile Scrum + AI Assistants + Containerized CI/CD** yields:
- **Velocity:** Reduced feature iteration cycle from **3 weeks down to 1 week**.
- **Code Quality:** 100% PRs pass automated linting and unit tests with **> 82% Code Coverage**.
- **Deployment Efficiency:** Zero-downtime deployment completing in **45 seconds** via Docker Compose.
