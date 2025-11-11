# Accessibility Patterns

Comprehensive guide to implementing accessibility in shadcn/ui components with WCAG 2.1 compliance, ARIA patterns, and inclusive design practices.

## Overview

Accessibility is not optional—it's essential. This guide covers accessibility patterns, WCAG 2.1 requirements, and best practices for creating inclusive user interfaces using shadcn/ui components.

## WCAG 2.1 Compliance Levels

### Level AA Requirements (Minimum Standard)

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus indicators for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper semantic HTML and ARIA labels
- **Resize Support**: Text zoom up to 200% without loss of functionality

### Level AAA Requirements (Enhanced)

- **Color Contrast**: 7:1 for normal text, 4.5:1 for large text
- **Enhanced Contrast**: Better contrast for UI components
- **Audio Descriptions**: Video content with audio descriptions
- **Sign Language**: Sign language interpretation for video content

## Focus Management

### Focus Indicators

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Enhanced focus indicator
export function AccessibleButton({ children, className, ...props }) {
  return (
    <Button
      className={cn(
        // Default focus styles from shadcn/ui
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Enhanced high contrast focus
        "focus-visible:ring-4 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

// Custom focus styles for navigation
export function FocusableNavLink({ href, children, isActive }) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "focus-visible:ring-4 focus-visible:ring-offset-2",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  )
}
```

### Focus Trapping in Modals

```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useEffect, useRef } from 'react'

export function FocusTrapDialog({ open, onOpenChange, children }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (!focusableElements?.length) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    }

    const initialFocus = contentRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement

    initialFocus?.focus()

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={contentRef} className="focus:outline-none">
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

### Skip Links

```tsx
export function SkipLinks() {
  return (
    <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring ml-2"
      >
        Skip to navigation
      </a>
    </div>
  )
}
```

## ARIA Patterns

### Semantic Structure

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AccessibleCard({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <h2>{title}</h2>
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Main landmark elements
export function PageLayout() {
  return (
    <div className="min-h-screen">
      <header role="banner">
        {/* Header content */}
      </header>

      <nav role="navigation" aria-label="Main navigation">
        {/* Navigation content */}
      </nav>

      <main id="main-content" role="main" tabIndex={-1}>
        {/* Main content */}
      </main>

      <aside role="complementary" aria-label="Sidebar">
        {/* Sidebar content */}
      </aside>

      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  )
}
```

### Form Accessibility

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function AccessibleFormField({
  id,
  label,
  type = 'text',
  required = false,
  error,
  helperText,
  ...props
}) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${fieldId}-error` : undefined
  const helperId = helperText ? `${fieldId}-helper` : undefined

  return (
    <div className="space-y-2">
      <Label
        htmlFor={fieldId}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>

      <Input
        id={fieldId}
        type={type}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(errorId, helperId)}
        className={cn(error && "border-destructive focus:ring-destructive")}
        required={required}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}

// Checkbox group with fieldset
export function CheckboxGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium leading-none">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={value?.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...(value || []), option.value])
                } else {
                  onChange(value?.filter(v => v !== option.value) || [])
                }
              }}
            />
            <Label htmlFor={option.value} className="text-sm font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
```

### Table Accessibility

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AccessibleTable({ data, columns }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} scope="col">
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Complex table with headers and scope
export function ComplexDataTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <caption className="sr-only">
          Sales data for Q1 2024, showing product categories, regions, and revenue
        </caption>
        <TableHeader>
          <TableRow>
            <TableHeader scope="col" rowSpan={2}>Product Category</TableHeader>
            <TableHeader scope="col" colSpan={3}>Revenue by Region</TableHeader>
            <TableHeader scope="col" rowSpan={2}>Total</TableHeader>
          </TableRow>
          <TableRow>
            <TableHeader scope="col">North</TableHeader>
            <TableHeader scope="col">South</TableHeader>
            <TableHeader scope="col">East</TableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">Electronics</TableCell>
            <TableCell>$125,000</TableCell>
            <TableCell>$98,000</TableCell>
            <TableCell>$156,000</TableCell>
            <TableCell>$379,000</TableCell>
          </TableRow>
          {/* More rows */}
        </TableBody>
      </Table>
    </div>
  )
}
```

## Screen Reader Support

### Live Regions

```tsx
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

// Screen reader announcements
export function ScreenReaderAnnouncer() {
  const [announcement, setAnnouncement] = useState('')

  const announce = (message: string) => {
    setAnnouncement('')
    setTimeout(() => setAnnouncement(message), 100)
  }

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      <Button onClick={() => announce('Data saved successfully')}>
        Save Changes
      </Button>
    </>
  )
}

// Status updates with live regions
export function StatusUpdater() {
  const [status, setStatus] = useState('Ready')
  const [isLive, setIsLive] = useState(false)

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus)
    setIsLive(true)
    setTimeout(() => setIsLive(false), 1000)
  }

  return (
    <div className="space-y-4">
      <div
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "p-3 rounded-md",
          isLive && "bg-muted border",
          !isLive && "sr-only"
        )}
      >
        Status: {status}
      </div>

      <Button onClick={() => updateStatus('Processing...')}>
        Start Processing
      </Button>
      <Button onClick={() => updateStatus('Complete')}>
        Mark Complete
      </Button>
    </div>
  )
}
```

### Descriptive Links and Buttons

```tsx
import { Button } from '@/components/ui/button'

// Descriptive link text
export function AccessibleLinkList() {
  const links = [
    {
      href: '/annual-report-2024.pdf',
      text: 'Download Annual Report 2024 (PDF)',
      description: 'Comprehensive financial report for fiscal year 2024',
    },
    {
      href: '/user-guide',
      text: 'Read User Guide',
      description: 'Step-by-step instructions for using the platform',
    },
  ]

  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted"
            aria-describedby={`link-desc-${index}`}
          >
            <span>{link.text}</span>
            <span className="text-sm text-muted-foreground">→</span>
          </a>
          <p id={`link-desc-${index}`} className="text-sm text-muted-foreground ml-3">
            {link.description}
          </p>
        </li>
      ))}
    </ul>
  )
}

// Icon buttons with labels
export function IconButtonWithLabel() {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Edit profile"
        title="Edit profile"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Delete item"
        title="Delete item"
      >
        <Trash className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share content"
        title="Share content"
      >
        <Share className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## Color and Contrast

### High Contrast Mode Support

```tsx
import { Button } from '@/components/ui/button'

// High contrast mode detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// High contrast button
export function HighContrastButton({ children, ...props }) {
  const isHighContrast = useHighContrast()

  return (
    <Button
      className={cn(
        isHighContrast && [
          "border-2 border-current",
          "bg-transparent text-current",
          "hover:bg-current hover:text-background focus:bg-current focus:text-background"
        ]
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
```

### Color-Only Indicators

```tsx
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// Status indicators with icons and text
export function StatusIndicator({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          text: 'Success'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          text: 'Warning'
        }
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          text: 'Error'
        }
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          text: 'Unknown'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn(
        config.bgColor,
        config.borderColor,
        config.color,
        "flex items-center gap-2"
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{config.text}</span>
    </Badge>
  )
}
```

## Reduced Motion

### Motion Preferences

```tsx
import { useState, useEffect } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Motion-aware animations
export function MotionAwareComponent({ children }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={cn(
        !prefersReducedMotion && "transition-all duration-300 hover:scale-105"
      )}
    >
      {children}
    </div>
  )
}
```

## Keyboard Navigation

### Custom Keyboard Interactions

```tsx
import { useState, useEffect, useRef } from 'react'

// Custom dropdown with keyboard navigation
export function KeyboardDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => (prev + 1) % options.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => (prev - 1 + options.length) % options.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].value)
            setIsOpen(false)
          }
          break
        case 'Escape':
          setIsOpen(false)
          triggerRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, options, onChange])

  useEffect(() => {
    if (isOpen) {
      const focusedItem = dropdownRef.current?.querySelector(
        `[data-index="${focusedIndex}"]`
      ) as HTMLElement
      focusedItem?.focus()
    }
  }, [focusedIndex, isOpen])

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full justify-between"
      >
        {value || 'Select an option'}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
          role="listbox"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              data-index={index}
              role="option"
              aria-selected={value === option.value}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-muted",
                value === option.value && "bg-muted",
                focusedIndex === index && "bg-accent"
              )}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Accessibility Testing

### Testing Checklist

#### Automated Testing
```tsx
// jest-axe for accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Component Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = render(<MyComponent />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

#### Manual Testing Checklist
- [ ] **Keyboard Navigation**
  - Tab order is logical
  - All interactive elements are keyboard accessible
  - Focus indicators are clearly visible
  - Escape key works for modals and dropdowns

- [ ] **Screen Reader Support**
  - All images have alt text
  - Form fields have proper labels
  - Status updates are announced
  - Landmarks are properly identified

- [ ] **Visual Accessibility**
  - Color contrast meets WCAG AA standards
  - Text can be zoomed to 200%
  - Content is readable in high contrast mode
  - Animations respect prefers-reduced-motion

- [ ] **Cognitive Accessibility**
  - Content is clearly written
  - Instructions are easy to understand
  - Error messages are helpful
  - Consistent navigation and layout

## Tools and Resources

### Browser Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web Accessibility Evaluation Tool
- **Color Contrast Analyzer**: Check color contrast ratios
- **Accessibility Insights**: Comprehensive accessibility testing

### Testing Tools
- **axe-core**: Automated accessibility testing engine
- **jest-axe**: Jest integration for axe
- **@testing-library/jest-dom**: Accessibility-focused queries
- **playwright**: Accessibility testing with automated browsers

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [A11y Project](https://www.a11yproject.com/)

Remember: Accessibility is a continuous process, not a one-time checklist. Test regularly and include users with disabilities in your testing process.