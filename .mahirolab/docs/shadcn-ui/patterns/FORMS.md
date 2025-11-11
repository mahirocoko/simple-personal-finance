# Form Patterns

Comprehensive guide to form patterns and best practices using shadcn/ui components with validation, accessibility, and user experience considerations.

## Overview

Forms are the primary way users interact with your application. This guide covers form patterns from simple layouts to complex multi-step forms with validation and error handling.

## Core Form Principles

### 1. Progressive Enhancement
- Start with semantic HTML structure
- Layer JavaScript for enhanced interactions
- Ensure forms work without JavaScript
- Provide clear visual feedback

### 2. Accessibility First
- Use proper semantic elements (`<form>`, `<label>`, `<button>`)
- Ensure keyboard navigation works correctly
- Provide sufficient color contrast (4.5:1 minimum)
- Include ARIA labels and descriptions

### 3. Clear Visual Hierarchy
- Group related fields together
- Use consistent spacing and alignment
- Provide clear action buttons (primary vs secondary)
- Show validation states clearly

## Form Layout Patterns

### Single Column Layout

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function SingleColumnForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="name@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  )
}
```

### Multi-Column Layout

```tsx
export function MultiColumnForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="New York" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="NY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" placeholder="10001" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Address
      </Button>
    </form>
  )
}
```

### Inline Form Pattern

```tsx
export function InlineForm() {
  return (
    <form className="flex items-center space-x-2">
      <Input
        type="email"
        placeholder="Enter your email"
        className="flex-1"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  )
}
```

## Validation Patterns

### Client-Side Validation with React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpData) => {
    try {
      // Submit logic here
      console.log(data)
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          className={errors.confirmPassword ? 'border-destructive' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="agreeToTerms" {...register('agreeToTerms')} />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the terms and conditions
        </Label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-destructive" role="alert">
          {errors.agreeToTerms.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
```

### Real-Time Validation

```tsx
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RealTimeValidation() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      setError('')
      setIsValid(false)
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsValid(false)
    } else {
      setError('')
      setIsValid(true)
    }
  }, [email])

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={error ? 'border-destructive' : isValid ? 'border-green-500' : ''}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-600">Email looks good!</p>
      )}
    </div>
  )
}
```

## Multi-Step Forms

### Step Indicator Pattern

```tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const steps = ['Personal Info', 'Address', 'Payment', 'Review']

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`ml-2 text-sm ${
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="min-h-[300px]">
        {currentStep === 0 && <PersonalInfoStep />}
        {currentStep === 1 && <AddressStep />}
        {currentStep === 2 && <PaymentStep />}
        {currentStep === 3 && <ReviewStep />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
```

## Form State Management

### Loading States

```tsx
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function FormWithLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Form submitted')
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  )
}
```

### Success & Error Messages

```tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

export function FormWithMessages() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Submit logic
      await submitForm()
      setStatus('success')
      setMessage('Form submitted successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}

      {status === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Accessibility Best Practices

### Form Labels & Associations

```tsx
// ✅ Correct - Use htmlFor to associate labels with inputs
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input id="email" type="email" />
</div>

// ✅ Correct - Use aria-describedby for helper text
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    aria-describedby="password-help"
  />
  <p id="password-help" className="text-sm text-muted-foreground">
    Must be at least 8 characters long
  </p>
</div>

// ✅ Correct - Use aria-invalid for error states
<Input
  aria-invalid={hasError ? 'true' : 'false'}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <p id="email-error" className="text-sm text-destructive" role="alert">
    {errorMessage}
  </p>
)}
```

### Fieldsets & Legends

```tsx
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function FieldsetExample() {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none">
        Shipping Method
      </legend>
      <RadioGroup defaultValue="standard">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="standard" id="standard" />
          <Label htmlFor="standard">Standard Shipping (5-7 days)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="express" id="express" />
          <Label htmlFor="express">Express Shipping (2-3 days)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="overnight" id="overnight" />
          <Label htmlFor="overnight">Overnight Shipping</Label>
        </div>
      </RadioGroup>
    </fieldset>
  )
}
```

## Mobile Form Patterns

### Responsive Input Sizes

```tsx
// Mobile-first form design
export function MobileOptimizedForm() {
  return (
    <form className="space-y-6 px-4 py-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">Email</Label>
        <Input
          id="email"
          type="email"
          className="h-12 text-base" // Larger touch targets on mobile
          placeholder="name@example.com"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-medium"
      >
        Sign Up
      </Button>
    </form>
  )
}
```

### Input Types for Mobile

```tsx
export function MobileInputTypes() {
  return (
    <form className="space-y-4">
      {/* Brings up numeric keypad on mobile */}
      <Input type="tel" placeholder="Phone Number" />

      {/* Brings up email keyboard with @ key */}
      <Input type="email" placeholder="Email" />

      {/* Brings up numeric keypad for PIN entry */}
      <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="PIN" />

      {/* Brings up calendar picker on mobile */}
      <Input type="date" />

      {/* Auto-completes addresses */}
      <Input
        type="text"
        autoComplete="street-address"
        placeholder="Street Address"
      />
    </form>
  )
}
```

## Performance Considerations

### Debounce Validation

```tsx
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

export function DebouncedValidation() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const debouncedValue = useDebounce(value, 300)

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [])

  // Validate when debounced value changes
  React.useEffect(() => {
    if (debouncedValue && !validateEmail(debouncedValue)) {
      setError('Invalid email address')
    } else {
      setError('')
    }
  }, [debouncedValue, validateEmail])

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter email"
    />
  )
}
```

## Testing Forms

### Form Testing Checklist

- [ ] All form fields have associated labels
- [ ] Form submission works with keyboard only
- [ ] Error messages are accessible to screen readers
- [ ] Form works without JavaScript (progressive enhancement)
- [ ] Mobile touch targets are at least 44px
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are clearly visible
- [ ] Form state changes are properly announced
- [ ] Loading states provide feedback to users
- [ ] Form validation provides helpful error messages

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [WCAG Form Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/input-purposes.html)
- [HTML Form Best Practices](https://web.dev/learn/forms/)