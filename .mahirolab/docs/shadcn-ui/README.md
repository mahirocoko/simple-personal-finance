# shadcn/ui Component Library Guide

**Last Updated:** 2025-11-11
**Research Date:** 2025-11-11 (5 comprehensive reports completed)
**Compatible:** React 19, Next.js 15, Tailwind CSS v4

## 📋 Quick Reference

### Installation Commands
```bash
# Core form components
npx shadcn@latest add button input select checkbox radio-group switch textarea form

# Navigation & layout
npx shadcn@latest add navigation-menu tabs breadcrumb separator sheet sidebar

# Data display
npx shadcn@latest add card table badge avatar skeleton progress alert callout chart tooltip popover

# Feedback & overlays
npx shadcn@latest add dialog modal dropdown-menu context-menu toast alert-dialog drawer hover-card command

# Advanced components
npx shadcn@latest add calendar date-picker color-picker slider toggle resizable scroll-area menubar label accordion collapsible aspect-ratio
```

### Key Updates from Research (Nov 2025)

#### ✅ **Production Ready**
- **Button**: Updated Sep 24, 2025 with `icon-sm`, `icon-lg`, `spinner`, `dropdown` demos
- **Input**: Changelog Sep 18, 2025 - removed extraneous `flex` class
- **CLI 3.0**: August 2025 registry overhaul with namespaced components
- **React 19/Next.js 15**: Full compatibility confirmed

#### ⚠️ **Important Changes**
- **Toast**: **DEPRECATED** → migrate to Sonner immediately
- **Select**: Known scroll lock bug (#4227) - apply CSS workaround
- **Form**: Beta status, future `<Field />` API coming
- **Radix**: June 2025 migration command `pnpm dlx shadcn@latest migrate radix`

#### 🆕 **New Features**
- **EyeDropper API**: Color picker with native sampling (HTTPS required)
- **Timezone Support**: Calendar with timezone-aware rendering
- **Multi-thumb Sliders**: Range sliders with min steps between thumbs
- **Resizable Panels**: react-resizable-panels integration

## 🎯 Component Categories

### 📝 **Form Components**
- **Button** - 9 variants (default, secondary, destructive, outline, ghost, link, sm, lg, icon sizes)
- **Input** - Text, email, password, file, number with label/helper patterns
- **Select** - Dropdown with groups, descriptions, disabled states
- **Checkbox & Radio** - Group patterns, alignment utilities
- **Switch** - Icon toggles, disabled states, form integration
- **Textarea** - Long-form input with button composition
- **Form** - React Hook Form + Zod validation scaffold

### 🧭 **Navigation & Layout**
- **NavigationMenu** - Desktop fly-outs, mobile stacked panels, useIsMobile hook
- **Tabs** - Manual/automatic activation, keyboard navigation
- **Breadcrumb** - Ellipsis, dropdown overflow, aria-current="page"
- **Separator** - Semantic dividers, decorative prop
- **Sheet** - Edge-specific side props, sticky header/footer
- **Sidebar** - Cookie management, collapsible states, cmd/ctrl+b shortcuts

### 📊 **Data Display**
- **Card** - CardAction slots, responsive widths
- **Table** - Semantic tables with captions, associations
- **Data Table** - TanStack integration, mobile scroll fallbacks
- **Chart** - Recharts primitives, upcoming v3 upgrade
- **Badge** - Variants (default, outline, destructive), asChild linking
- **Avatar** - Fallbacks, data-[slot=avatar] hooks, clustered rings
- **Skeleton** - Layout mirroring placeholders
- **Progress** - Controlled progress bars
- **Alert & Callout** - Icon+title+description variants, MDX support

### 💬 **Feedback & Overlays**
- **Dialog & Modal** - Focus trapping, inert backgrounds, data-state hooks
- **Alert Dialog** - Cancel/Action footer, screen reader announcements
- **Dropdown Menu** - Roving tabindex, collision-aware animations
- **Context Menu** - Touch long-press triggers, collision awareness
- **Toast** → **Sonner** - Lucide icons (Oct 13, 2025), TOAST_LIMIT
- **Drawer** - Vaul v1.1.2 gestures, directional presets
- **Hover Card** - Sight-hover previews only (supplement keyboard targets)
- **Command** - cmdk v1.1.1 IME fixes, global palettes

### ⚙️ **Advanced Components**
- **Calendar** - Timezone props, multilingual grids, SSR-safe detection
- **Date Picker** - chrono-node parsing, natural-language scheduling
- **Color Picker** - EyeDropper API, HTTPS required, color library
- **Slider** - Multi-thumb ranges, RTL support, @radix-ui/react-slider 1.3.6
- **Toggle** - aria-pressed semantics, Radix Toggle 1.1.10
- **Resizable** - Panel groups, nested groups, keyboard handles
- **Scroll Area** - Radix ScrollArea v1.2.0-beta, optional horizontal bars
- **Menubar** - Submenus, checkbox/radio items, shortcut slots
- **Accordion & Collapsible** - Progressive disclosure patterns
- **Aspect Ratio** - CLS prevention with Next/Image fill

## 🔧 Critical Known Issues & Fixes

### 🐛 **Select Scroll Lock Bug (#4227)**
**Issue:** Select removes body scrollbar causing layout shift
**Fix:** Apply CSS workaround
```css
/* Select scroll lock fix */
body[data-scroll-locked] {
  overflow: hidden;
  padding-right: var(--removed-body-scroll-bar-width, 0px);
}
```

### 🔄 **Toast Migration**
**Issue:** Legacy toast deprecated Feb 2025
**Solution:** Migrate to Sonner
```bash
npx shadcn@latest add sonner
```

### 🔒 **EyeDropper API Requirement**
**Requirement:** HTTPS mandatory for native color sampling
**Fallback:** Graceful degradation on HTTP

### 📱 **Responsive Navigation**
**Pattern:** Switch between NavigationMenu (desktop) and Sheet/Sidebar (mobile)
```tsx
const isMobile = useIsMobile()
return isMobile ? <Sidebar /> : <NavigationMenu />
```

## ♿ **Accessibility Requirements**

### ✅ **Mandatory Patterns**
- **Labels:** All form controls need explicit `<Label htmlFor>` associations
- **ARIA:** Use data-state hooks for styling, maintain semantic structure
- **Keyboard:** Full keyboard navigation support required
- **Screen Reader:** Proper announcements, landmarks, descriptions
- **Focus Management:** Visible focus indicators, logical tab order

### 🎯 **Best Practices**
- **Hover Card:** Supplement with click targets for keyboard users
- **Tooltips:** Use only for supplemental information
- **Dialogs:** Ensure focus trapping and inert backgrounds
- **Forms:** Maintain React Hook Form + Zod validation patterns

## 🎨 **Design System Integration**

### 🌈 **Color System**
- **Base:** OKLCH color space with WCAG 2.1 AA/AAA compliance
- **Tokens:** --background, --foreground, --card, --popover, --primary, --secondary, --muted, --accent, --destructive, --border, --input, --ring
- **Chart:** 5 dedicated --chart-* palette slots

### 📐 **Spacing System**
- **Base:** 4px unit with semantic scale (1-16)
- **Usage:** Consistent padding/margins across components

### 🔤 **Typography**
- **Font:** Geist or Inter Variable (decision pending)
- **Scale:** xs-sm-base-lg-xl-2xl-3xl-4xl-5xl
- **Line Height:** Tight, normal, relaxed options

### 🌓 **Dark Mode**
- **Implementation:** next-themes with class-based approach
- **Requirement:** All components must support dark mode
- **Testing:** Validate contrast ratios in both themes

## 📚 **Documentation Structure**

```
.mahirolab/docs/shadcn-ui/
├── README.md                 # This file - integration guide
├── components/              # Individual component documentation
│   ├── form-components.md   # Button, Input, Select, etc.
│   ├── navigation-layout.md # NavigationMenu, Tabs, etc.
│   ├── data-display.md     # Card, Table, Chart, etc.
│   ├── feedback-overlays.md # Dialog, Toast, etc.
│   └── advanced-components.md # Calendar, Slider, etc.
├── patterns/               # Common UI patterns
│   ├── forms.md           # Form best practices
│   ├── navigation.md      # Navigation patterns
│   └── layouts.md         # Layout patterns
└── migration-guide.md     # HTML → shadcn/ui migration
```

## 🚀 **Getting Started**

1. **Install Components:**
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Configure Design Tokens:**
   ```css
   :root {
     --background: oklch(1 0 0);
     --foreground: oklch(0.18 0 0);
     --primary: oklch(0.60 0.15 250);
     /* ... other tokens */
   }
   ```

3. **Follow Component Patterns:**
   - Use proper label associations
   - Apply data-state hooks for styling
   - Maintain accessibility standards
   - Test dark mode compatibility

## 📖 **Research Sources**

Comprehensive research reports available in `.mahirolab/research/`:
- `20251111_104022_*` - Form Components Deep Dive
- `20251111_104028_*` - Navigation & Layout Deep Dive
- `20251111_104037_*` - Data Display Deep Dive
- `20251111_104043_*` - Feedback & Overlays Deep Dive
- `20251111_104048_*` - Advanced Components Deep Dive

## 🤝 **Contributing**

When adding new components:
1. Check research reports for latest updates
2. Follow established patterns
3. Ensure accessibility compliance
4. Test both light/dark modes
5. Update documentation

---

**Status:** ✅ Research Complete, Ready for Implementation
**Next:** See [Migration Guide](./migration-guide.md) for HTML → shadcn/ui patterns