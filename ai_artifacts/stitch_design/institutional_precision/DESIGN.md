---
name: Institutional Precision
colors:
  surface: '#f8faf9'
  surface-dim: '#d8dada'
  surface-bright: '#f8faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f3'
  surface-container: '#eceeed'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#414846'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f0'
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
  background: '#f8faf9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
typography:
  headline-xl:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system establishes a professional, authoritative aesthetic tailored for administrative efficiency and high-density information management. The personality is institutional yet accessible, prioritizing clarity and trust through a refined Corporate Minimalism style. 

The visual narrative centers on structured layouts, generous but purposeful whitespace, and a high-contrast color palette that guides the user's eye toward critical actions and notifications. By utilizing sharp data visualizations and a systematic approach to interface density, the design system ensures that complex administrative forms and notification centers remain legible and unintimidating.

## Colors

The palette is anchored by deep, institutional greens and cyans to evoke stability. 

- **Primary Dark Green (#103C35):** Reserved for core branding elements and high-level headers.
- **Primary Dark Cyan (#0C6668):** Used for secondary emphasis and supportive structural elements.
- **Interactive Cyan (#138A8A):** The dedicated action color for buttons, active states, and links, ensuring high visibility against the neutral background.
- **Navigation Green (#0B2F2D):** Specifically for sidebars and top-level navigation to provide a strong visual anchor.
- **Surface & Borders:** The background uses a soft mint-grey (#F7F9F8) to reduce eye strain, while cards remain pure white (#FFFFFF). Borders (#D9E1DE) are kept subtle to maintain a clean, border-heavy grid without visual clutter.

## Typography

The design system utilizes **Be Vietnam Pro** across all levels to maintain a contemporary, friendly, yet professional tone. 

- **Headlines:** Use bold weights and slight negative letter-spacing for a modern, compact look in administrative headers.
- **Body Text:** Standardized at 16px for optimal readability in data-heavy forms. 
- **Labels:** Utilizes semi-bold weights and uppercase styling for form field headers and small UI descriptors to differentiate them clearly from user input.
- **Mobile Scaling:** Headline sizes are aggressively reduced on mobile to ensure notification titles and form headers do not wrap excessively.

## Layout & Spacing

The layout follows a strict **8px linear rhythm**. This ensures mathematical harmony across all components.

- **Grid:** A 12-column fluid grid is used for desktop administrative dashboards, transitioning to a single-column stack for mobile forms.
- **Gutters:** Standardized at 24px to provide clear separation between data cards and form sections.
- **Density:** Notification centers should utilize "Compact" spacing (8px between items), while administrative forms should use "Default" spacing (16px to 24px between fields) to prevent user fatigue.

## Elevation & Depth

This design system favors a **flat, layered approach** over heavy shadows to maintain its institutional character.

- **Tonal Layering:** Depth is primarily communicated through color. The base background (#F7F9F8) sits at the lowest level, with white cards (#FFFFFF) appearing to sit "on top."
- **Low-Contrast Outlines:** Instead of shadows, use 1px borders in #D9E1DE to define container boundaries.
- **Active State Elevation:** Only interactive elements (like buttons or hovered cards) may use a subtle, highly diffused ambient shadow (0px 4px 12px rgba(16, 60, 53, 0.08)) to indicate interactivity without breaking the minimalist aesthetic.

## Shapes

The shape language is structured and approachable. 

- **Standard Elements:** Buttons, input fields, and small components use an **8px radius**.
- **Container Elements:** Larger cards, notification panels, and modal containers use a slightly softer **10px radius** to distinguish them as primary structural vessels.
- **Interactive States:** Use consistent rounding across all states to maintain a predictable hit area for administrative users.

## Components

- **Buttons:** Primary buttons use Interactive Cyan (#138A8A) with white text. Secondary buttons use a ghost style with the Interactive Cyan border and text.
- **Input Fields:** Use the 8px radius with the #D9E1DE border. On focus, the border shifts to Interactive Cyan with a 1px solid stroke. Labels sit above the field in `label-md` style.
- **Cards:** White background, 10px radius, and a 1px border (#D9E1DE). No shadows are used for static cards.
- **Notification Center:** Items are stacked with 8px spacing. New notifications feature a subtle left-accent bar in Interactive Cyan to denote the "unread" status.
- **Chips:** Used for status indicators (e.g., "Pending", "Approved"). These feature a light tinted background of the status color with high-contrast text.
- **Lists:** Clean, row-based layouts with #D9E1DE horizontal dividers. Each row has a minimum height of 48px to ensure touch-targets and legibility in administrative tables.