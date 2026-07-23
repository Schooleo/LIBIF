# Document DRM and Screenshot Prevention for LIBIF

Date: 2026-07-23
Status: validated research result — architect approved

## Executive conclusion

**Absolute DRM and absolute screenshot prevention are not achievable for a document that must be visibly rendered on user-controlled hardware.** A web page cannot stop operating-system capture tools, privileged software, modified clients, external capture devices, or a phone camera. Even Microsoft documents that its native Windows capture-exclusion API is not a DRM guarantee and cannot prevent photographing the display.

The strongest suitable LIBIF POC is therefore **controlled page delivery plus attributable deterrence**, not a claim of DRM:

1. keep the source PDF private and deny Reader download/raw-stream routes;
2. render bounded page rasters on the server from the active file version;
3. authorize every manifest/page request and return no OCR text or object key;
4. burn a per-user/session/page watermark into every page image;
5. draw the raster onto HTML canvas with integrated real-page progress;
6. add no-store caching, rate/concurrency limits, access auditing, and anomaly alerts;
7. explicitly disclose that screenshots/cameras remain possible.

If screenshot blocking is a hard requirement rather than a deterrence goal, the product must leave the open browser and require a **managed native client or managed remote desktop/Cloud PC**. Even those controls block standard capture paths rather than every possible capture method.

## Evidence and applicability boundaries

### 1. Browser DRM is media-specific, not document DRM

The W3C Encrypted Media Extensions specification extends `HTMLMediaElement` for playback of encrypted media. It states that EME is an API for interacting with content-protection systems and does not itself define a DRM system. Its supported resources use media containers and common-encryption formats. This does not provide a standard encrypted-PDF/image/canvas pipeline.

Google likewise describes Widevine as protection for premium media using EME and common-encryption media formats. Microsoft describes PlayReady as protection for audio/video/media files. Encoding document pages as a DRM video would sacrifice document semantics, accessibility, random page interaction, and operational simplicity while still not stopping cameras.

Sources:

- W3C, Encrypted Media Extensions: https://www.w3.org/TR/encrypted-media-2/
- Google Widevine overview: https://developers.google.com/widevine/drm/overview
- Microsoft PlayReady: https://learn.microsoft.com/playready

### 2. The open web has capture APIs, not a capture-blocking API

The W3C Screen Capture specification defines how a user can choose a display, window, or browser surface to capture. Its permissions policy controls whether the current document may call `getDisplayMedia`; it is not a policy that prevents the operating system, another process, browser tooling, or a camera from capturing the rendered pixels. Microsoft makes the same boundary explicit for managed Edge: its screenshot-disable policy blocks keyboard shortcuts and extension APIs but may still be bypassed by browser capture, OS features, or another application.

Canvas changes presentation and can remove a selectable text layer or native PDF download toolbar, but it does not create a protected output path. Client-side PDF.js is also not a DRM boundary: its official API loads PDF URLs or binary PDF data into the browser/worker, so the source document still reaches the client.

Sources:

- W3C, Screen Capture: https://www.w3.org/TR/screen-capture/
- Microsoft Edge `DisableScreenshots` policy: https://learn.microsoft.com/deployedge/microsoft-edge-policies/DisableScreenshots
- Mozilla PDF.js API: https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html

### 3. Native capture controls are useful but explicitly limited

- **Android:** `FLAG_SECURE` tells Android to block screenshots and non-secure displays for a flagged window. This is meaningful protection against standard Android capture paths, but it requires a native/managed app and cannot block an external camera or a compromised device.
- **Windows desktop:** `SetWindowDisplayAffinity(..., WDA_EXCLUDEFROMCAPTURE)` excludes a top-level window from supported public OS capture APIs. Microsoft explicitly says it is not a DRM guarantee and gives photographing the screen as a limitation.
- **Electron:** `BrowserWindow.setContentProtection(true)` maps to Windows capture exclusion. Electron documents that on newer macOS versions, applications using ScreenCaptureKit can still capture the protected Electron window, so it is not a dependable cross-platform boundary.
- **iOS/iPadOS:** Apple exposes capture-state detection so apps can react to recording/mirroring. Apple specifically blacks out FairPlay Streaming **video** during capture; that protected-video behavior does not turn arbitrary document views into screenshot-proof surfaces. Screenshot notifications also occur after a screenshot event rather than guaranteeing prevention.

Sources:

- Android, secure sensitive activities / `FLAG_SECURE`: https://developer.android.com/security/fraud-prevention/activities
- Microsoft, `SetWindowDisplayAffinity`: https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity
- Electron, `setContentProtection`: https://www.electronjs.org/docs/latest/api/browser-window#winsetcontentprotectionenable-macos-windows
- Apple, screen capture state: https://developer.apple.com/documentation/uikit/uiscreen/iscaptured

### 4. Rights-managed documents control authorized use, not visible-pixel capture

Microsoft Purview Information Protection/Azure Rights Management can encrypt files, bind access to identity/authorization policy, and enforce supported usage rights in compatible applications. Microsoft documents native protection for PDF and other supported file types, and SharePoint IRM-protected PDFs require compatible readers.

This is materially stronger than hiding a PDF URL: a copied protected file remains encrypted and requires a rights-aware client. It introduces licensing, tenant/identity integration, approved-viewer requirements, vendor dependency, offline-policy questions, and it still cannot prevent a camera recording authorized visible content.

Sources:

- Microsoft Purview Information Protection: https://learn.microsoft.com/purview/information-protection
- MIP SDK supported file types: https://learn.microsoft.com/information-protection/develop/concept-supported-filetypes
- IRM-compatible PDF readers: https://learn.microsoft.com/purview/sp-compatible-pdf-readers-for-irm

### 5. Managed remote sessions provide the strongest practical capture resistance

Azure Virtual Desktop/Windows 365 can block protected remote content from supported OS screenshots and screen sharing. Microsoft recommends combining this with watermarking and disabling clipboard, drive, and printer redirection. Its documentation also states that screen-capture protection is not DRM-level protection and that a physical camera remains a reason to use traceable watermarking. Some protected configurations reject browser clients and require supported managed clients.

This is the strongest documented option reviewed for a high-assurance deployment because content stays in a controlled remote session and endpoint policies can constrain capture and exfiltration. It has high licensing, device-management, infrastructure, latency, support, and accessibility costs.

Source:

- Microsoft, Azure Virtual Desktop screen-capture protection: https://learn.microsoft.com/azure/virtual-desktop/screen-capture-protection

## Option comparison

| Option | Source PDF protected after delivery? | Blocks standard screenshots? | Camera/privileged-client resistant? | Fit for LIBIF |
|---|---:|---:|---:|---|
| Raw PDF iframe / browser PDF viewer | No | No | No | Reject |
| Client PDF.js/canvas from PDF bytes | No | No | No | Reject as DRM; useful only for UI |
| Server raster pages + canvas + watermark | Yes, source remains server-side | No | No | Best POC deterrence |
| Managed Edge + Purview/Intune policies | Yes if paired with server raster/no-download | Managed browser paths only | No | Useful institution-managed middle tier |
| Rights-managed PDF + approved viewer | Yes | Product/platform dependent | No | Strong production option if ecosystem/licensing fits |
| Native Android/Windows managed app | Yes if app receives only raster/encrypted content | Standard capture paths: often yes | No | Stronger controlled-device tier |
| Cross-platform Electron app | Depends on delivery | Windows useful; newer macOS bypass documented | No | Not sufficient alone |
| Managed AVD/Windows 365 + DLP + watermark | Yes, content remains in remote environment | Yes on supported managed clients | No | Strongest practical high-assurance tier |
| Convert pages to EME DRM video | Media encrypted | Platform/media dependent | No | Reject: wrong format, poor accessibility/UX |

## Recommended tiered design

### Tier 1 — Phase 7 POC: controlled browser viewer

Implement the already planned server-raster/canvas architecture with these additions:

- **Source boundary:** private object storage; Reader cannot call source stream/download endpoints.
- **Page authorization:** manifest and page requests verify authenticated user, role, document publication state, active file/version, page bounds, and session entitlement every time.
- **Raster controls:** cap DPI, dimensions, pages, render duration, and concurrent renders; cache only private file-version-scoped derivatives.
- **Burned-in watermark:** render user identifier, timestamp, document/page ID, and a signed session trace or QR code into the page bitmap. Randomize safe placement to make simple cropping harder.
- **Browser delivery:** short-lived page authorization, `Cache-Control: private, no-store`, no service-worker caching, no object keys, no OCR plaintext, and no source-PDF URL.
- **Viewer:** canvas only; real manifest page count; keyboard-accessible navigation; progress saved only after a successful render.
- **Abuse controls:** request throttles, impossible-rate/page-scrape detection, concurrent-session limits, audit events, alerting, and fast entitlement revocation.
- **Truthful UX:** “protected/traceable reading session” or “copy-deterrent view,” never “screenshot-proof” or “absolute DRM.”

Residual risk: screenshots, cameras, browser automation, OCR of page images, and page-by-page reconstruction remain possible. Tile fragmentation and disabled context menus add friction but are not security boundaries and should not be prioritized over authorization, watermarking, auditing, and rate controls.

### Tier 2 — Stronger production: rights-managed or managed native client

Choose one according to deployment constraints:

- For institution-managed browsing, require Edge for Business work profiles and apply Purview/Intune clipboard and screen-capture policies to the LIBIF origin. Microsoft documents that these controls are policy/location scoped and that general Edge screenshot policy still cannot block OS-level tools, so retain watermarks and server-side source protection.
- Integrate a rights-managed PDF ecosystem such as Microsoft Purview Information Protection when institution identity, licensing, supported readers, offline rights, print/copy rules, and tenant administration are acceptable.
- Or ship a managed native client that receives only raster pages/encrypted derivatives and enables Android `FLAG_SECURE` or Windows capture exclusion. Treat macOS/iOS document screenshot prevention as weaker and test each supported OS/version.
- Require device compliance/attestation, disable debug builds, protect local caches with platform keystores, and revoke licenses/session keys.

Residual risk: rooted/jailbroken/compromised endpoints, privileged capture, accessibility extraction, and external cameras.

Source for the managed-browser option:

- Microsoft Edge for Business protected clipboard/screen capture: https://learn.microsoft.com/deployedge/microsoft-edge-management-protected-clipboard

### Tier 3 — High assurance: managed remote workspace

For rare highly restricted collections:

- require supported Azure Virtual Desktop/Windows 365 clients;
- enable client-and-server screen-capture protection;
- disable clipboard, drive, printer, and unnecessary device redirection;
- add traceable per-session QR/user watermarks;
- use conditional access, managed endpoints, short sessions, and detailed auditing;
- reject unsupported web clients.

Residual risk: cameras and authorized-user transcription. Pair technical controls with policy, user agreements, incident response, and sanctions.

## Accessibility and product constraints

Removing selectable text and blocking assistive extraction can harm screen-reader users, search, quotation, education, and legitimate accessibility workflows. EME itself notes that accessibility support content may need to remain available to the user agent. LIBIF should define an accessible entitlement path rather than silently making protected books unusable: for example, an authorized accessible rendition, screen-reader mode with additional auditing, or institution-mediated accommodations. Product/legal owners should review copyright exceptions, accessibility duties, and privacy implications of user-identifying watermarks before production.

## Decision for LIBIF

1. **Do not promise absolute DRM or screenshot prevention.** It is technically untrue for the current browser product.
2. **Proceed with server-side page rasterization + canvas + burned-in identity watermark + no raw Reader PDF route** for the POC.
3. **Add capture/exfiltration controls only as tiered deployment modes**, not as one cross-platform guarantee.
4. **Use rights-managed PDF or managed remote workspace only if stakeholders accept licensing, supported-client, accessibility, and operations costs.**
5. **Define success as reducing leak probability, increasing traceability, and limiting bulk extraction—not making visual content impossible to copy.**


## Validation outcome

Validation mode: prompt + architect artifact.

Verdict: **APPROVED**. The review confirmed that the report is primary-source grounded, makes no unsupported absolute-security claim, applies its recommendations to arbitrary documents, states screenshot/camera/accessibility residual risks, and provides actionable browser, managed-client, and high-assurance tiers for LIBIF.

Implementation note: this is a strategic research result. The canonical implementation contract is the Phase 7 plan at `ai_artifacts/plans/plan-phase-7-admin-operations-users-reporting-settings-2026-07-23.md`.
