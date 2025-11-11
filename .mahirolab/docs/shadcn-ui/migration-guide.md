# Migration Guide: HTML → shadcn/ui Components

**Last Updated:** 2025-11-11
**Compatible:** React 19, Next.js 15, TypeScript

## 🎯 Migration Overview

This guide provides step-by-step instructions for migrating from standard HTML elements to shadcn/ui components, incorporating research findings and best practices from the comprehensive shadcn/ui deep-dive reports.

## 📋 Quick Reference Table

| HTML Element | shadcn/ui Component | Installation Command | Key Features |
|-------------|-------------------|---------------------|--------------|
| `<button>` | `<Button>` | `npx shadcn@latest add button` | 9 variants, icon sizes, accessibility |
| `<input type="text">` | `<Input>` | `npx shadcn@latest add input` | Label helper patterns, file upload |
| `<select>` | `<Select>` | `npx shadcn@latest add select` | Groups, descriptions, disabled states |
| `<textarea>` | `<Textarea>` | `npx shadcn@latest add textarea` | Long-form input, button composition |
| `<div class="card">` | `<Card>` | `npx shadcn@latest add card` | CardAction slots, responsive widths |
| `<table>` | `<Table>` | `npx shadcn@latest add table` | Semantic structure, accessibility |
| `<dialog>` | `<Dialog>` | `npx shadcn@latest add dialog` | Focus trapping, animations |
| `<nav>` | `<NavigationMenu>` | `npx shadcn@latest add navigation-menu` | Desktop/mobile responsive |
| `<div class="badge">` | `<Badge>` | `npx shadcn@latest add badge` | Variants, asChild linking |
| `<img class="avatar">` | `<Avatar>` | `npx shadcn@latest add avatar` | Fallbacks, data-slot hooks |

## 🔄 Step-by-Step Migration

### Phase 1: Form Components

#### Button Migration
```tsx
// ❌ Before
<button
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  onClick={handleClick}
>
  Click me
</button>

// ✅ After
import { Button } from "@/components/ui/button"

<Button onClick={handleClick}>
  Click me
</Button>

// ✅ With variants
<Button variant="destructive" size="lg">
  Delete
</Button>

// ✅ Icon button (Sep 24, 2025 update)
<Button variant="outline" size="icon-sm">
  <Settings className="h-4 w-4" />
</Button>
```

#### Input Migration
```tsx
// ❌ Before
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium mb-1">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
    placeholder="Enter your email"
  />
  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
</div>

// ✅ After
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
  />
  {error && <p className="text-sm text-destructive">{error}</p>}
</div>
```

#### Select Migration
```tsx
// ❌ Before
<div>
  <label htmlFor="country">Country</label>
  <select id="country" className="w-full border rounded p-2">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
</div>

// ✅ After
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox & Radio Groups
```tsx
// ❌ Before
<div>
  <label>
    <input type="checkbox" className="mr-2" />
    I agree to terms
  </label>
</div>

// ✅ After
import { Checkbox } from "@/components/ui/checkbox"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to terms</Label>
</div>
```

### Phase 2: Layout Components

#### Card Migration
```tsx
// ❌ Before
<div className="border rounded-lg p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
    Action
  </button>
</div>

// ✅ After
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Table Migration
```tsx
// ❌ Before
<table className="w-full border-collapse">
  <thead>
    <tr className="border-b">
      <th className="text-left p-2">Name</th>
      <th className="text-left p-2">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b">
      <td className="p-2">John Doe</td>
      <td className="p-2">
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
          Active
        </span>
      </td>
    </tr>
  </tbody>
</table>

// ✅ After
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Phase 3: Navigation Components

#### Navigation Menu
```tsx
// ❌ Before
<nav className="flex space-x-4">
  <a href="/home" className="hover:text-blue-600">Home</a>
  <a href="/about" className="hover:text-blue-600">About</a>
  <a href="/contact" className="hover:text-blue-600">Contact</a>
</nav>

// ✅ After (Desktop)
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/home">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// ✅ Mobile responsive with useIsMobile hook
const isMobile = useIsMobile()
return isMobile ? <Sidebar /> : <NavigationMenu />
```

### Phase 4: Overlay Components

#### Dialog Migration
```tsx
// ❌ Before
<dialog open={isOpen} className="border rounded-lg p-6">
  <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
  <p className="mb-4">Are you sure you want to delete this item?</p>
  <div className="flex justify-end space-x-2">
    <button onClick={() => setIsOpen(false)}>Cancel</button>
    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
      Delete
    </button>
  </div>
</dialog>

// ✅ After
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this item? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🔧 Critical Migration Issues

### ⚠️ Select Scroll Lock Bug (#4227)

**Problem:** Select components remove body scrollbar causing layout shift

**Solution:** Apply CSS fix globally
```css
/* app/globals.css or equivalent */
body[data-scroll-locked] {
  overflow: hidden;
  padding-right: var(--removed-body-scroll-bar-width, 0px);
}

/* Alternative fix from research */
[data-scroll-locked] {
  position: fixed;
  overflow: hidden;
  width: 100%;
}
```

### 🔄 Toast → Sonner Migration

**Problem:** Legacy Toast deprecated February 2025

**Migration Steps:**
```bash
# 1. Install Sonner
npx shadcn@latest add sonner

# 2. Update imports
// ❌ Before
import { useToast } from "@/components/ui/use-toast"

// ✅ After
import { toast } from "sonner"

// 3. Update usage
// ❌ Before
const { toast } = useToast()
toast({ title: "Success", description: "Item saved" })

// ✅ After
toast.success("Item saved")
toast.error("Something went wrong")
```

### 🔒 EyeDropper API Requirements

**Requirement:** HTTPS mandatory for native color sampling

**Implementation:**
```tsx
import { useState, useEffect } from 'react'

export function ColorPicker() {
  const [color, setColor] = useState('#000000')
  const [eyedropperSupported, setEyedropperSupported] = useState(false)

  useEffect(() => {
    // Check if EyeDropper API is available (HTTPS only)
    setEyedropperSupported('EyeDropper' in window)
  }, [])

  const handleEyedropper = async () => {
    if (!eyedropperSupported) {
      toast.error("EyeDropper requires HTTPS connection")
      return
    }

    try {
      // @ts-ignore - EyeDropper API
      const eyeDropper = new EyeDropper()
      const result = await eyeDropper.open()
      setColor(result.sRGBHex)
    } catch (error) {
      toast.error("EyeDropper cancelled or failed")
    }
  }

  return (
    <div className="space-y-2">
      <div
        className="w-16 h-16 rounded border"
        style={{ backgroundColor: color }}
      />
      {eyedropperSupported && (
        <Button onClick={handleEyedropper} size="sm">
          Pick Color
        </Button>
      )}
    </div>
  )
}
```

## 🧪 Testing Strategy

### 1. Accessibility Testing
```bash
# Install accessibility testing tools
npm install -D @axe-core/react
npm install -D jest-axe
```

### 2. Visual Regression Testing
```bash
# Install visual testing tools
npm install -D @storybook/test-runner
npm install -D chromatic
```

### 3. Component Testing
```tsx
// Example: Button component test
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

## 📋 Migration Checklist

### Pre-Migration ✅
- [ ] Backup current codebase
- [ ] Run existing tests to ensure baseline
- [ ] Install shadcn/ui CLI: `npx shadcn@latest init`
- [ ] Configure design tokens (CSS variables)
- [ ] Set up component library directory structure

### Component Migration ✅
- [ ] Install required components via CLI
- [ ] Replace HTML elements with shadcn/ui components
- [ ] Update imports throughout codebase
- [ ] Apply proper TypeScript types
- [ ] Configure accessibility attributes

### Post-Migration ✅
- [ ] Run test suite and fix failures
- [ ] Validate accessibility (axe-core, keyboard navigation)
- [ ] Test dark mode compatibility
- [ ] Check responsive behavior
- [ ] Performance testing (bundle size, render performance)

### Known Issues ✅
- [ ] Apply Select scroll lock CSS fix
- [ ] Migrate Toast to Sonner
- [ ] Handle EyeDropper API HTTPS requirement
- [ ] Test Radix migration command compatibility

## 🚀 Best Practices

### 1. Incremental Migration
- Migrate one component type at a time
- Commit after each successful migration
- Test thoroughly before proceeding

### 2. Consistency
- Use established patterns from research
- Follow accessibility guidelines
- Maintain consistent spacing and typography

### 3. Performance
- Lazy load large component groups
- Optimize bundle size
- Use proper memoization where needed

### 4. Documentation
- Document component usage patterns
- Create storybook stories
- Update design system documentation

## 🔗 Additional Resources

### Research Reports
- Form Components Deep Dive (20251111_104022_*)
- Navigation & Layout Deep Dive (20251111_104028_*)
- Data Display Deep Dive (20251111_104037_*)
- Feedback & Overlays Deep Dive (20251111_104043_*)
- Advanced Components Deep Dive (20251111_104048_*)

### Official Documentation
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

---

**Status:** ✅ Ready for Migration Implementation
**Next Step:** Begin Phase 2 - Frontend Cleanup before component migration