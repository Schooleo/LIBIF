# PROOF OF CONCEPT (PoC)
## Architectural Feasibility: Anti-Leakage DRM & Secure PDF Viewer for LIBIF

---

> **Document Type:** Proof of Concept (PoC) Feasibility Plan  
> **Project:** LIBIF — Intelligent Library Digitization & Document Management System  
> **Core Objective:** Validate technical feasibility of preventing raw PDF downloads and uncontrolled document leakage  
> **Status:** PROPOSED FEASIBLE APPROACH  
> **Date:** July 24, 2026  

---

## 1. Objective

The objective of this Proof of Concept (PoC) is to demonstrate how **LIBIF** can solve its primary security challenge: **preventing unauthorized PDF document downloading, text copying, printing, and raw file leakage** in a standard web browser without requiring users to install third-party plugins.

---

## 2. The Hardest Problem: Uncontrolled PDF Leakage

### 2.1 Why Current Workflows Fail
In standard library applications or ad-hoc setups (e.g., Google Drive, standard PDF embeds, or raw `<iframe src="book.pdf">`), documents are exposed as raw PDF files. 

Users can easily:
1. Inspect the browser `Network` tab or HTML source code to extract direct `.pdf` URLs.
2. Download the intact PDF file and share it freely via Zalo, Telegram, or email.
3. Select and copy sensitive text directly from the page DOM.

### 2.2 Core Challenge
To satisfy copyright requirements, LIBIF must allow students to read books in their browser 24/7 while preventing them from downloading or capturing raw `.pdf` files.

---

## 3. Proposed Solution & Architecture

To solve this challenge, LIBIF proposes a 4-step security mechanism:

```
[ Backend Server ] ──(Presigned S3 URL <60s)──> [ Client Browser ]
                                                      │
                                          (Fetch ArrayBuffer into RAM)
                                                      │
                                       (Render via HTML5 Canvas 2D)
                                                      │
                                   (Apply Dynamic Forensic Watermark)
```

### 1. Short-Lived Presigned S3 URLs (< 60s TTL)
Instead of public bucket URLs, the backend generates temporary presigned S3 URLs valid for **under 60 seconds**. Once loaded into browser memory, the link expires immediately, preventing link sharing.

### 2. In-Memory ArrayBuffer Loading
The client fetches document binary data directly into browser RAM (`ArrayBuffer`). The PDF is never saved as a file on local disk, nor exposed via persistent `blob:` URLs.

### 3. HTML5 Canvas Pixel Rendering
Using `pdfjs-dist`, pages are rendered directly into HTML5 `<canvas>` elements as 2D pixels:
- **No DOM Text Nodes:** Browser inspect element tools yield no readable text HTML nodes.
- **No Direct Image Saving:** The canvas prevents standard "Save Image As" actions when right-click is disabled.

### 4. DOM Event Interception & Anti-Copy
Client-side event listeners trap and suppress browser actions:
- Disable right-click context menu (`contextmenu`).
- Block download and print keyboard shortcuts (`Ctrl+S`, `Ctrl+P`, `Ctrl+U`, `F12`).
- Hide canvas view during printing attempts via CSS `@media print`.

### 5. Dynamic Forensic Watermark
During canvas rendering, a transparent watermark overlay is drawn across the page containing:
- **Student ID (MSSV)**
- **Client IP Address**
- **Timestamp**

If a user takes a physical photo of their screen, the source of the leak is immediately traceable.

---

## 4. Feasibility Code Blueprint

Below is the conceptual implementation structure for the proposed reader component:

```tsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface SecureViewerProps {
  bookId: string;
  userMetadata: { studentId: string; ip: string };
  getTemporaryUrl: (id: string) => Promise<string>;
}

export const SecurePdfViewer: React.FC<SecureViewerProps> = ({ bookId, userMetadata, getTemporaryUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      // 1. Get temporary URL (<60s)
      const tempUrl = await getTemporaryUrl(bookId);

      // 2. Fetch binary stream into RAM
      const res = await fetch(tempUrl);
      const buffer = await res.arrayBuffer();

      // 3. Render page onto Canvas
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // 4. Draw Dynamic Forensic Watermark
      ctx.fillStyle = 'rgba(180, 0, 0, 0.15)';
      ctx.font = '16px sans-serif';
      ctx.fillText(`LICENSED TO: ${userMetadata.studentId} | IP: ${userMetadata.ip}`, 50, 100);
    };

    loadDocument();
  }, [bookId]);

  // 5. Intercept Copy / Print / Context Menu
  useEffect(() => {
    const disableActions = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', disableActions);
    return () => window.removeEventListener('keydown', disableActions);
  }, []);

  return (
    <div style={{ userSelect: 'none' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
```

---

## 5. Feasibility Validation Criteria

To verify this approach during development (Sprint 3), the implementation will be evaluated against these validation criteria:

| Test Objective | Target Result |
| :--- | :--- |
| **URL Extraction** | Extracted presigned URLs must expire within 60 seconds and fail upon re-use. |
| **Direct Download** | No direct `.pdf` download buttons or raw links exist in DOM source. |
| **Text Copying** | Right-click context menu and `Ctrl+C` text selection are fully disabled. |
| **Browser Print** | `Ctrl+P` prints a blank page due to CSS `@media print` rules. |
| **Traceability** | Screenshots or photos display readable Student ID and IP watermark. |

---

## 6. Conclusion

By combining **short-lived S3 presigned URLs**, **in-memory ArrayBuffer loading**, **HTML5 Canvas pixel rendering**, and **dynamic watermarking**, LIBIF has a clear, theoretically sound, and achievable solution to prevent PDF leakage without requiring complex desktop plugins.
