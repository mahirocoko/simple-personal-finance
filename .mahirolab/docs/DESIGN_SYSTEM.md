# Professional UI Design System

**Version:** 1.0.0
**Last Updated:** October 7, 2025
**Framework:** React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing & Layout](#spacing--layout)
6. [Semantic Tokens](#semantic-tokens)
7. [Component Architecture](#component-architecture)
8. [Dark Mode & Theming](#dark-mode--theming)
9. [Accessibility](#accessibility)
10. [Implementation Guide](#implementation-guide)
11. [References](#references)

---

## Executive Summary

This design system synthesizes best practices from **Linear**, **Vercel Geist**, and **Stripe** design systems, built on **shadcn/ui** with comprehensive semantic tokens for production-ready applications. It emphasizes:

- **Professional aesthetics** with subtle, desaturated palettes
- **Accessibility-first** approach (WCAG 2.1 AA/AAA compliance)
- **Scalable token architecture** using OKLCH color space
- **Comprehensive spacing system** based on 4px/8px grid
- **Modular typography** with type scale ratios (1.125–1.333)

---

## Design Philosophy

### Inspiration from Leading Platforms

**Linear Philosophy:**
> "Plenty of space, not cramped" — generous whitespace, calm visual language

**Vercel Geist:**
> High-contrast accessibility, performant interfaces, clean typography

**Stripe:**
> Professional precision, consistent rhythm, brand-driven accents

### Core Principles

1. **Minimalist & Expressive** — Restrained design that scales with features
2. **Spacious Layouts** — Ample breathing room around all elements
3. **Accessible by Default** — WCAG 2.1 AA minimum, AAA where possible
4. **Perceptually Uniform** — OKLCH color space for consistent visual progression
5. **Semantic Clarity** — Self-documenting token names

---

## Color System

### Color Architecture

**WCAG 2.1 Compliance (Updated May 2025):**
- **AA:** 4.5:1 contrast for text, 3:1 for UI elements
- **AAA:** 7:1 contrast for enhanced accessibility

**Color Space:** OKLCH (perceptually uniform, adopted by Tailwind v4.1)

### Primary Palette

Inspired by Linear's Magic Blue (#5E6AD2) with professional refinement:

```css
/* Primary Brand Color - Subtle Desaturated Blue */
--color-primary-50:  oklch(0.97 0.01 250);
--color-primary-100: oklch(0.94 0.02 250);
--color-primary-200: oklch(0.87 0.04 250);
--color-primary-300: oklch(0.78 0.06 250);
--color-primary-400: oklch(0.68 0.10 250);
--color-primary-500: oklch(0.60 0.15 250); /* Base - #5E6AD2 equivalent */
--color-primary-600: oklch(0.52 0.16 250);
--color-primary-700: oklch(0.44 0.15 250);
--color-primary-800: oklch(0.36 0.12 250);
--color-primary-900: oklch(0.28 0.09 250);
--color-primary-950: oklch(0.20 0.06 250);
```

### Neutral Palette

Based on Linear's Mercury White & Nordic Gray:

```css
/* Neutral - High Contrast (Vercel-inspired) */
--color-neutral-50:  oklch(0.99 0.00 0);
--color-neutral-100: oklch(0.97 0.00 0);
--color-neutral-200: oklch(0.93 0.00 0);
--color-neutral-300: oklch(0.87 0.00 0);
--color-neutral-400: oklch(0.72 0.00 0);
--color-neutral-500: oklch(0.56 0.00 0);
--color-neutral-600: oklch(0.45 0.00 0);
--color-neutral-700: oklch(0.36 0.00 0);
--color-neutral-800: oklch(0.26 0.00 0);
--color-neutral-900: oklch(0.18 0.00 0);
--color-neutral-950: oklch(0.10 0.00 0);
```

### Semantic Colors

**Radix Colors 12-step scales** for accessible states:

```css
/* Success - Green */
--color-success-500: oklch(0.60 0.14 150);
--color-success-on: oklch(0.99 0.00 0); /* High contrast text */

/* Warning - Amber */
--color-warning-500: oklch(0.70 0.12 60);
--color-warning-on: oklch(0.20 0.00 0);

/* Error - Red */
--color-error-500: oklch(0.58 0.18 20);
--color-error-on: oklch(0.99 0.00 0);

/* Info - Blue */
--color-info-500: oklch(0.62 0.14 230);
--color-info-on: oklch(0.99 0.00 0);
```

### Stripe Professional Purple (Accent)

```css
/* Secondary/Accent - Stripe Purple #635BFF */
--color-accent-500: oklch(0.58 0.20 280);
--color-accent-600: oklch(0.50 0.18 280);
```

---

## Typography System

### Type Scale Ratios

**Selected Ratio:** 1.200 (Minor Third) — Shopify Polaris standard
**Alternative:** 1.250 (Major Third) for increased hierarchy

### Font Families

**Inspiration:** Vercel's Geist Sans & Mono

**Recommended Fonts:**
1. **Primary:** Inter (Variable) — body & headings
2. **Display:** Inter Display (Variable) — large headings
3. **Monospace:** JetBrains Mono / Geist Mono

**Implementation:**

```css
@import url('https://rsms.me/inter/inter.css');

:root {
  --font-sans: 'Inter Variable', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter Display Variable', var(--font-sans);
  --font-mono: 'JetBrains Mono Variable', 'Geist Mono', monospace;
}
```

### Font Size Scale

Based on Tailwind CSS semantic naming + USWDS guidance (≥16px body):

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 0.75rem (12px) | 1rem | Fine print, labels |
| `text-sm` | 0.875rem (14px) | 1.25rem | Secondary text |
| `text-base` | 1rem (16px) | 1.5rem | **Body copy (default)** |
| `text-lg` | 1.125rem (18px) | 1.75rem | Lead paragraphs |
| `text-xl` | 1.25rem (20px) | 1.75rem | H5 |
| `text-2xl` | 1.5rem (24px) | 2rem | H4 |
| `text-3xl` | 1.875rem (30px) | 2.25rem | H3 |
| `text-4xl` | 2.25rem (36px) | 2.5rem | H2 |
| `text-5xl` | 3rem (48px) | 1 | H1 |

### Line Height System

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-normal: 1.5; /* ≥1.5 for accessibility (USWDS) */
--leading-relaxed: 1.75;
--leading-loose: 2;
```

### Letter Spacing

**USWDS Guidance:** Size-dependent adjustment for headings

```css
--tracking-tighter: -0.05em; /* Large headings only */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em; /* Labels, buttons */
--tracking-wider: 0.05em;
```

### Typography Tokens

```css
/* Semantic Typography */
--text-heading: var(--font-display);
--text-body: var(--font-sans);
--text-mono: var(--font-mono);

--text-heading-1: 3rem / 1 var(--text-heading);
--text-heading-2: 2.25rem / 2.5rem var(--text-heading);
--text-heading-3: 1.875rem / 2.25rem var(--text-heading);
--text-body-lg: 1.125rem / 1.75rem var(--text-body);
--text-body-base: 1rem / 1.5rem var(--text-body);
--text-label: 0.875rem / 1.25rem var(--text-body);
```

---

## Spacing & Layout

### Spacing Scale (4px Base Unit)

**Material Design + Atlassian + Lightning DS convergence:**

```css
/* Spacing Scale (4px base) */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Semantic Spacing Tokens

**Naming Convention:** `space-{context}-{size}`

```css
/* Element-level spacing (within components) */
--space-element-xs: var(--space-1);   /* 4px - icon gaps */
--space-element-sm: var(--space-2);   /* 8px - tight spacing */
--space-element-md: var(--space-3);   /* 12px - standard gap */
--space-element-lg: var(--space-4);   /* 16px - comfortable */

/* Component-level spacing (between related elements) */
--space-component-xs: var(--space-3);  /* 12px */
--space-component-sm: var(--space-4);  /* 16px */
--space-component-md: var(--space-6);  /* 24px */
--space-component-lg: var(--space-8);  /* 32px */
--space-component-xl: var(--space-12); /* 48px */

/* Section-level spacing (layout separation) */
--space-section-xs: var(--space-8);   /* 32px */
--space-section-sm: var(--space-12);  /* 48px */
--space-section-md: var(--space-16);  /* 64px */
--space-section-lg: var(--space-24);  /* 96px */
--space-section-xl: var(--space-32);  /* 128px */
```

### Vertical Rhythm

**GOV.UK approach:** Line heights aligned to 4px grid

```css
/* Maintain 4px rhythm */
* {
  box-sizing: border-box;
}

body {
  line-height: 1.5; /* 24px on 16px base = 4px multiple */
}
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

---

## Semantic Tokens

### shadcn/ui Base Tokens (Extended)

**Default shadcn/ui tokens:**

```css
:root {
  /* Base */
  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0 0);

  /* Surfaces */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0 0);

  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0 0);

  /* Interactive States */
  --primary: oklch(0.60 0.15 250);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.97 0.00 0);
  --secondary-foreground: oklch(0.18 0 0);

  --muted: oklch(0.97 0.00 0);
  --muted-foreground: oklch(0.56 0 0);

  --accent: oklch(0.97 0.00 0);
  --accent-foreground: oklch(0.18 0 0);

  --destructive: oklch(0.58 0.18 20);
  --destructive-foreground: oklch(0.99 0 0);

  /* UI Elements */
  --border: oklch(0.93 0.00 0);
  --input: oklch(0.93 0.00 0);
  --ring: oklch(0.60 0.15 250);

  --radius: 0.625rem; /* 10px */
}
```

### Extended Semantic Token Layers

#### Surface Tokens

```css
--surface-base: var(--background);           /* Default background */
--surface-raised: var(--card);               /* Cards, elevated */
--surface-overlay: oklch(1 0 0 / 0.95);      /* Modals, dropdowns */
--surface-sunken: oklch(0.97 0.00 0);        /* Wells, inputs */
--surface-inverse: var(--foreground);        /* Dark on light */
```

#### Border Tokens

```css
--border-subtle: oklch(0.97 0.00 0);         /* Light separation */
--border-default: var(--border);             /* Standard borders */
--border-strong: oklch(0.87 0.00 0);         /* Emphasis */
--border-interactive: var(--primary);         /* Buttons, inputs */
--border-focus: var(--ring);                 /* Focus rings */
```

#### Text Tokens

```css
--text-primary: var(--foreground);           /* Main content */
--text-secondary: oklch(0.56 0 0);           /* Supporting text */
--text-tertiary: oklch(0.72 0 0);            /* Subtle hints */
--text-disabled: oklch(0.87 0 0);            /* Inactive state */
--text-inverse: var(--background);           /* On dark */
--text-link: var(--primary);                 /* Clickable text */
--text-link-hover: oklch(0.52 0.16 250);     /* Hover state */
```

#### Interactive State Tokens

```css
--interactive-idle: var(--primary);
--interactive-hover: oklch(0.52 0.16 250);   /* Darker */
--interactive-active: oklch(0.44 0.15 250);  /* Even darker */
--interactive-disabled: oklch(0.87 0.00 0);
--interactive-focus: var(--ring);
```

### Component-Specific Tokens

**Buttons:**

```css
/* Primary Button */
--button-primary-bg: var(--primary);
--button-primary-text: var(--primary-foreground);
--button-primary-hover: var(--interactive-hover);
--button-primary-active: var(--interactive-active);

/* Secondary Button */
--button-secondary-bg: var(--secondary);
--button-secondary-text: var(--secondary-foreground);
--button-secondary-hover: oklch(0.93 0.00 0);
--button-secondary-active: oklch(0.87 0.00 0);

/* Ghost Button */
--button-ghost-bg: transparent;
--button-ghost-text: var(--text-primary);
--button-ghost-hover: var(--secondary);
```

**Inputs:**

```css
--input-bg: var(--background);
--input-border: var(--input);
--input-border-focus: var(--border-focus);
--input-text: var(--foreground);
--input-placeholder: var(--text-tertiary);
```

**Tables:**

```css
--table-header-bg: var(--muted);
--table-header-text: var(--muted-foreground);
--table-row-hover: oklch(0.99 0.00 0);
--table-row-selected: oklch(0.97 0.01 250);
```

---

## Component Architecture

### shadcn/ui Base Components

**Install via CLI:**

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add form
```

### Custom Extensions

**Inspired by Linear:**

- **Command Palette** (Cmd+K) — `cmdk` library
- **Inline Editing Inputs** — Editable text with validation
- **Status Indicators** — Colored dots + labels
- **Keyboard Shortcut Hints** — Subtle badges

**Inspired by Stripe:**

- **Segmented Controls** — Radio button groups
- **Banner Notifications** — Info/warning/error alerts
- **Code Snippet Blocks** — Syntax-highlighted code
- **Step Indicators** — Multi-step form progress

**Inspired by Vercel:**

- **Gradient Backgrounds** — Subtle radial gradients
- **Animated Transitions** — Smooth state changes
- **Toast Notifications** — `sonner` library
- **Loading Skeletons** — Content placeholders

### Layout Patterns

**Dashboard Layout:**

```tsx
<div className="flex h-screen">
  <Sidebar className="w-64 border-r border-border-subtle" />
  <main className="flex-1 overflow-auto p-space-section-md">
    <Header />
    <Content />
  </main>
</div>
```

**Settings Layout:**

```tsx
<div className="mx-auto max-w-container-lg p-space-section-md">
  <nav className="space-y-space-component-sm">...</nav>
  <div className="ml-64">
    <SettingsContent />
  </div>
</div>
```

---

## Dark Mode & Theming

### Theme Implementation

**Using next-themes:**

```tsx
// app/providers.tsx
import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

### Dark Mode Token Mapping

```css
.dark {
  --background: oklch(0.18 0 0);
  --foreground: oklch(0.99 0 0);

  --card: oklch(0.20 0 0);
  --card-foreground: oklch(0.97 0 0);

  --popover: oklch(0.20 0 0);
  --popover-foreground: oklch(0.97 0 0);

  --primary: oklch(0.68 0.10 250);
  --primary-foreground: oklch(0.18 0 0);

  --secondary: oklch(0.26 0 0);
  --secondary-foreground: oklch(0.97 0 0);

  --muted: oklch(0.26 0 0);
  --muted-foreground: oklch(0.72 0 0);

  --accent: oklch(0.26 0 0);
  --accent-foreground: oklch(0.97 0 0);

  --border: oklch(0.36 0 0);
  --input: oklch(0.36 0 0);
  --ring: oklch(0.68 0.10 250);
}
```

### Theme Toggle Component

```tsx
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

---

## Accessibility

### WCAG 2.1 Compliance Checklist

**Visual:**
- ✅ AA contrast ratios (4.5:1 text, 3:1 UI)
- ✅ AAA contrast where feasible (7:1)
- ✅ Color not sole indicator
- ✅ Focus indicators (2px outline, `:focus-visible`)

**Interaction:**
- ✅ Keyboard navigation (Tab, Enter, Space, Esc)
- ✅ Screen reader support (ARIA labels)
- ✅ Skip links for main content
- ✅ `prefers-reduced-motion` honored

**Typography:**
- ✅ ≥16px body text (USWDS)
- ✅ ≥1.5 line height for paragraphs
- ✅ Adjustable letter spacing for headings

### Motion Guidelines (Vercel)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Management

```css
/* Remove default outline, add custom ring */
:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

---

## Implementation Guide

### File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── patterns/        # Reusable patterns
│   ├── styles/
│   │   ├── tokens/
│   │   │   ├── colors.css
│   │   │   ├── typography.css
│   │   │   ├── spacing.css
│   │   │   ├── semantic.css
│   │   │   └── components.css
│   │   ├── themes/
│   │   │   ├── light.css
│   │   │   └── dark.css
│   │   └── globals.css
│   └── lib/
│       └── utils.ts         # cn() helper
└── tailwind.config.ts
```

### Tailwind v4 Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(0.97 0.01 250)',
          500: 'oklch(0.60 0.15 250)',
          950: 'oklch(0.20 0.06 250)',
        },
        // ... other colors
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        // Uses default 4px-based scale
      },
    },
  },
  plugins: [],
}

export default config
```

### Global Styles with @theme

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Tailwind v4 @theme directive */
  --color-primary: oklch(0.60 0.15 250);
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --space-component: 1rem;
}

:root {
  /* shadcn/ui semantic tokens */
  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0 0);
  /* ... rest of tokens */
}

.dark {
  --background: oklch(0.18 0 0);
  --foreground: oklch(0.99 0 0);
  /* ... dark overrides */
}
```

### Component Usage Example

```tsx
// Using semantic tokens
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="py-space-section-lg">
      <div className="container max-w-container-lg">
        <h1 className="text-heading-1 mb-space-component-md">
          Professional UI Design
        </h1>
        <p className="text-body-lg text-text-secondary mb-space-component-lg">
          Built with shadcn/ui, inspired by Linear, Vercel, and Stripe.
        </p>
        <Button size="lg" className="gap-space-element-md">
          Get Started
        </Button>
      </div>
    </section>
  )
}
```

---

## References

### Official Documentation
- **shadcn/ui:** https://ui.shadcn.com/docs/theming
- **Tailwind CSS v4:** https://tailwindcss.com/docs/theme
- **Radix UI:** https://radix-ui.com
- **W3C WCAG 2.1:** https://www.w3.org/TR/WCAG21/
- **CSS Color Module Level 4:** https://www.w3.org/TR/css-color-4/

### Design Systems Studied
- **Linear Brand:** https://linear.app/brand
- **Linear UI Redesign:** https://linear.app/now/how-we-redesigned-the-linear-ui
- **Vercel Geist:** https://vercel.com/geist
- **Vercel Design Guidelines:** https://vercel.com/design/guidelines
- **Stripe Apps Design:** https://docs.stripe.com/stripe-apps/design
- **Stripe Figma Toolkit:** https://www.figma.com/community/file/1105918844720321397

### Design Token Standards
- **W3C Design Tokens Community Group:** https://www.w3.org/community/design-tokens/
- **VA Design System:** https://design.va.gov/foundation/design-tokens
- **Atlassian Spacing:** https://atlassian.design/foundations/spacing/
- **Material Design Metrics:** https://m1.material.io/layout/metrics-keylines.html

### Typography & Spacing
- **USWDS Typography:** https://designsystem.digital.gov/components/typography/
- **Shopify Polaris v10:** https://polaris.shopify.com/whats-new/version-10-typography
- **GOV.UK Type Scale:** https://design-system.service.gov.uk/styles/type-scale/
- **Tailwind Font Size:** https://tailwindcss.com/docs/font-size

### Tools & Libraries
- **Inter Font:** https://rsms.me/inter/
- **Radix Colors:** https://www.radix-ui.com/colors
- **next-themes:** https://github.com/pacocoursey/next-themes
- **cmdk:** https://cmdk.paco.me/
- **sonner:** https://sonner.emilkowal.ski/

---

**End of Design System Documentation**

_Last updated: October 7, 2025_
_Version: 1.0.0_
