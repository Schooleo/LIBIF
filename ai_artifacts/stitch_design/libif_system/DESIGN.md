---
name: LIBIF System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#414846'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#717976'
  outline-variant: '#c0c8c5'
  surface-tint: '#3d665e'
  primary: '#002520'
  on-primary: '#ffffff'
  primary-container: '#103c35'
  on-primary-container: '#7ca79d'
  inverse-primary: '#a4cfc5'
  secondary: '#12696b'
  on-secondary: '#ffffff'
  secondary-container: '#a2edee'
  on-secondary-container: '#1a6d6f'
  tertiary: '#002525'
  on-tertiary: '#ffffff'
  tertiary-container: '#003c3c'
  on-tertiary-container: '#47adac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfece1'
  primary-fixed-dim: '#a4cfc5'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#244e46'
  secondary-fixed: '#a5eff1'
  secondary-fixed-dim: '#89d3d5'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f51'
  tertiary-fixed: '#91f3f2'
  tertiary-fixed-dim: '#74d6d6'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f50'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style
The design system is engineered for the high-stakes environment of institutional knowledge management. It targets academics, librarians, and administrative professionals who require a tool that prioritizes clarity, long-form legibility, and a sense of archival permanence.

The visual direction is a refined **Corporate Minimalism**. It avoids decorative flourishes in favor of structural integrity. The aesthetic is defined by stable grid alignments, a cooling color palette, and purposeful whitespace that reduces cognitive load during intensive document processing tasks. The emotional response is one of "Institutional Trust"—the UI feels like a digital extension of a physical library: quiet, organized, and reliable.

## Colors
The palette is rooted in deep, authoritative greens and cyans to evoke stability and the tradition of academic institutions.

- **Primary & Navigation:** #103C35 (Dark Green) and #0B2F2D (Deep Navigation) are used for high-level structure, headers, and primary sidebars to establish a grounded hierarchy.
- **Interaction:** #0C6668 (Dark Cyan) serves as the main action color, with #138A8A (Interactive Cyan) reserved for hover states and progress indicators.
- **Surfaces:** Use #E8F3F2 and #EDF4F0 for subtle section grouping, such as table headers or search filter backgrounds, to maintain a soft contrast against the #FFFFFF card surfaces.
- **Background:** The #F7F9F8 base tint prevents screen glare during extended periods of use.

## Typography
This design system utilizes **Be Vietnam Pro** for its excellent rendering of Vietnamese diacritics and its contemporary, professional rhythm. 

- **Hierarchy:** Use `display-lg` exclusively for primary dashboard headings. `title-sm` is the standard for card headers.
- **Body Text:** `body-md` is the primary size for document metadata and descriptions to ensure accessibility.
- **Labels:** Use `label-caps` for table column headers and small category tags to differentiate them from interactive data.
- **Weights:** Avoid using weights below 400 for digital screens to maintain legibility in the dark green color space.

## Layout & Spacing
The design system employs a **Fixed Grid** philosophy for desktop to maintain structural integrity of dense document data, transitioning to a fluid model for tablet and mobile.

- **Grid:** A 12-column grid with 16px gutters. For data-heavy views, a 4-column "Navigation/Filter" and 8-column "Content" split is recommended.
- **Rhythm:** All margins and paddings must be multiples of 8px. Use 16px (`md`) for internal card padding and 24px (`lg`) for page margins.
- **Breakpoints:**
  - Desktop: 1200px+ (12 columns)
  - Tablet: 768px - 1199px (8 columns, sidebar collapses to icon-only)
  - Mobile: <767px (4 columns, sidebar becomes a bottom sheet or hamburger menu).

## Elevation & Depth
To maintain an academic and secure feel, depth is created through **Low-Contrast Outlines** and **Tonal Layers** rather than dramatic shadows.

- **Borders:** Use a subtle 1px border (#E2E8F0) for all cards and input fields.
- **Shadows:** Use a single "Soft Depth" shadow level for floating elements like modals or dropdowns: `0px 4px 12px rgba(16, 60, 53, 0.08)`.
- **Layering:** Background is #F7F9F8, primary content containers are #FFFFFF. Secondary sidebars or utility panels use #E8F3F2 to indicate they are subordinate to the main content area.

## Shapes
The shape language is disciplined and geometric. 

- **Standard Radius:** 8px (`rounded-md`) for buttons, input fields, and cards. This provides a modern touch without appearing overly "bubbly" or consumer-grade.
- **Small Elements:** 4px (`rounded-sm`) for checkboxes and tags.
- **Large Elements:** 12px (`rounded-lg`) for main dashboard containers or modals.
- No fully circular (pill) shapes should be used except for status indicators (e.g., "Online" dots).

## Components
- **Buttons:** Primary buttons use #103C35 with white text. Ghost buttons use #0C6668 for text/border. Active states use #138A8A.
- **Input Fields:** 1px border (#E2E8F0) with 8px padding. On focus, the border shifts to #0C6668 with a subtle 2px outer glow of #E8F3F2.
- **Cards:** No shadow by default; 1px border with a pure white background. Title area should be separated by a subtle horizontal rule if the card contains complex data.
- **Chips/Tags:** Use `surface_light_green` for success/archived states and `surface_light_cyan` for active/in-progress states. Text should always be the dark primary color for contrast.
- **Lists:** Table rows should have a hover state of #F7F9F8. Use 12px vertical padding for high-density lists and 16px for standard lists.
- **Navigation:** The left-hand sidebar uses `navigation_deep` (#0B2F2D) with active items highlighted by a 4px left-border of #138A8A and a background of #103C35.