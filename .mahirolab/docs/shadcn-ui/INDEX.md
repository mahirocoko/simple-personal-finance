# shadcn/ui Documentation Index

Complete documentation for shadcn/ui components, patterns, and integration with the project's design system.

## 📚 Documentation Structure

### Core Documentation
- **[README.md](./README.md)** - Complete integration guide and quick reference
- **[Migration Guide](./migration-guide.md)** - HTML to shadcn/ui migration patterns

### Component Documentation
- **[FORM-COMPONENTS](./components/FORM-COMPONENTS.md)** - Forms, inputs, validation patterns
- **[DATA-DISPLAY](./components/DATA-DISPLAY.md)** - Tables, cards, charts, data visualization
- **[FEEDBACK-OVERLAYS](./components/FEEDBACK-OVERLAYS.md)** - Dialogs, toasts, menus, notifications
- **[ADVANCED-COMPONENTS](./components/ADVANCED-COMPONENTS.md)** - Calendar, color picker, slider, complex interactions

### Pattern Documentation
- **[FORMS](./patterns/FORMS.md)** - Form best practices, validation, accessibility
- **[NAVIGATION](./patterns/NAVIGATION.md)** - Navigation patterns, responsive design
- **[LAYOUT](./patterns/LAYOUT.md)** - Layout systems, spacing, responsive patterns
- **[ACCESSIBILITY](./patterns/ACCESSIBILITY.md)** - WCAG compliance, ARIA patterns, inclusive design

## 🚀 Getting Started

1. **Initialize shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```

2. **Install core components**
   ```bash
   npx shadcn@latest add button input card dialog
   ```

3. **Add validation for forms**
   ```bash
   npm install react-hook-form @hookform/resolvers zod
   npx shadcn@latest add form
   ```

## 📖 Research Foundation

Documentation is based on comprehensive research completed November 11, 2025:

- **Form Components Research** (`20251111_104022_*`) - Latest button variants, input patterns
- **Data Display Research** (`20251111_104037_*`) - Responsive tables, chart integration
- **Feedback & Overlays Research** (`20251111_104043_*`) - Toast migration, dialog patterns
- **Advanced Components Research** (`20251111_104048_*`) - EyeDropper API, timezone support

## 🔧 Key Features

### React 19 & Next.js 15 Ready
- Full compatibility with latest React and Next.js
- Optimized for Server Components and streaming SSR
- TypeScript support with strict typing

### Modern CSS Integration
- Tailwind CSS v4 compatibility
- OKLCH color space support
- CSS Grid and Flexbox patterns

### Accessibility First
- WCAG 2.1 AA compliance
- Full keyboard navigation
- Screen reader support
- High contrast mode support

## 🎨 Design System Integration

shadcn/ui components are fully integrated with the project's design system:

- **Color System**: OKLCH tokens with semantic naming
- **Typography**: Inter font family with responsive scaling
- **Spacing**: 4px base unit with consistent scale
- **Components**: Unified radius, shadows, and transitions

## 🧪 Testing & Quality

- **Automated Testing**: axe-core integration for accessibility
- **Visual Testing**: Storybook integration for component testing
- **Performance**: Optimized for minimal bundle size
- **Browser Support**: Modern browsers with progressive enhancement

## 📋 Quick Reference

### Common Patterns
```tsx
// Form with validation
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Responsive navigation
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { useIsMobile } from '@/hooks/use-is-mobile'

// Data table with TanStack
import { DataTable } from '@/components/ui/data-table'
```

### Migration Checklist
- [ ] Replace HTML forms with shadcn/ui form components
- [ ] Migrate Toast to Sonner
- [ ] Apply CSS fix for Select scroll lock bug
- [ ] Update color tokens to OKLCH system
- [ ] Add proper ARIA labels and descriptions
- [ ] Test keyboard navigation
- [ ] Verify color contrast ratios

## 🤝 Contributing

When contributing to shadcn/ui documentation:

1. Follow the established documentation patterns
2. Include code examples for all patterns
3. Test on multiple devices and browsers
4. Verify accessibility compliance
5. Update this index when adding new documentation

## 🔗 Related Resources

- **[Design System](../DESIGN_SYSTEM.md)** - Complete design system documentation
- **[Frontend Best Practices](../FRONTEND_BEST_PRACTICES.md)** - React and TypeScript patterns
- **[Git Commit Guide](../COMMIT_GUIDE.md)** - Commit standards and guidelines
- **[Project Structure](../PROJECT_STRUCTURE.md)** - Overall project organization

---

*Last Updated: 2025-11-11*
*Research Date: 2025-11-11*