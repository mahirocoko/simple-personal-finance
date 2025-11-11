# Form Components

Complete guide to shadcn/ui form components with latest updates and best practices.

## Overview

Form components are the backbone of user interaction. This section covers all form-related components with their latest updates, accessibility patterns, and integration examples.

## Button

### Latest Updates (September 2025)

**New Variants Added:**
- `icon-sm`: 16x16px icon button
- `icon-lg`: 24x24px icon button
- Enhanced loading states
- Improved disabled styling

### Usage Patterns

```tsx
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'

// Standard button with icon
<Button>
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>

// New icon variants
<Button variant="outline" size="icon-sm">
  <Settings className="h-4 w-4" />
</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>
```

### Accessibility Guidelines

- Use `type="submit"` for form submission
- Provide sufficient click targets (minimum 44px)
- Include loading states for async actions
- Maintain color contrast ratios (4.5:1 minimum)

## Input

### Enhanced Label & Helper Patterns (September 2025)

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Standard input with label
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email Address</Label>
  <Input type="email" id="email" placeholder="name@example.com" />
  <p className="text-sm text-muted-foreground">We'll never share your email.</p>
</div>

// Input with error state
<Input
  type="text"
  placeholder="Enter your name"
  className="border-destructive focus:ring-destructive"
  aria-invalid="true"
  aria-describedby="name-error"
/>
<p id="name-error" className="text-sm text-destructive">Name is required</p>
```

### File Upload Support

```tsx
<Input
  type="file"
  accept=".jpg,.jpeg,.png"
  className="cursor-pointer"
/>
```

### Best Practices

- Always associate inputs with labels using `htmlFor`
- Provide helper text for complex inputs
- Use appropriate input types (email, tel, url)
- Implement proper error states with aria attributes

## Select

### Critical Issue (#4227) - Scroll Lock Bug

The Select component has a known scroll lock issue. Apply this CSS fix:

```css
body[data-scroll-locked] {
  overflow: hidden;
  padding-right: var(--removed-body-scroll-bar-width, 0px);
}
```

### Usage Patterns

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="next">Next.js</SelectItem>
    <SelectItem value="remix">Remix</SelectItem>
    <SelectItem value="astro">Astro</SelectItem>
  </SelectContent>
</Select>
```

## Checkbox, Radio Group, Switch

### Checkbox Pattern

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms" className="text-sm font-medium leading-none">
    Accept terms and conditions
  </Label>
</div>
```

### Radio Group Pattern

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

### Switch Pattern

```tsx
import { Switch } from '@/components/ui/switch'

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

## Form Integration (Beta)

### React Hook Form + Zod Integration Scaffold

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type FormData = z.infer<typeof formSchema>

export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register('username')}
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Accessibility Requirements

### WCAG 2.1 Compliance

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px solid outline with `:focus-visible`
- **Keyboard Navigation**: Full tab/enter/space/escape support
- **Screen Reader Support**: Proper ARIA labels and descriptions

### Testing Checklist

- [ ] All form controls are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Error messages are associated with form controls
- [ ] Labels are properly associated with inputs
- [ ] Color contrast meets WCAG AA standards

## Migration Patterns

See [Migration Guide](../migration-guide.md) for detailed migration patterns from HTML forms to shadcn/ui components.

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [WCAG Form Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/input-purposes.html)