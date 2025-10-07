# Design System Quick Start Guide

**Get started implementing the professional UI design system in 30 minutes.**

---

## 📦 Prerequisites

- ✅ React 19 + TypeScript project
- ✅ Tailwind CSS v4 installed
- ✅ shadcn/ui configured

---

## 🚀 Implementation Steps

### Step 1: Install Core Dependencies (5 min)

```bash
# Install fonts
npm install @next/font

# Install shadcn/ui components
npx shadcn@latest init

# Install theming
npm install next-themes

# Install icons
npm install lucide-react
```

### Step 2: Setup Design Tokens (10 min)

**Create `frontend/src/styles/globals.css`:**

```css
@import "tailwindcss";

@theme {
  /* Tailwind v4 @theme directive */
  --color-primary: oklch(0.60 0.15 250);
  --color-neutral-500: oklch(0.56 0.00 0);
  --font-sans: 'Inter Variable', system-ui, -apple-system, sans-serif;
}

:root {
  /* Light Mode - shadcn/ui tokens */
  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0 0);

  --primary: oklch(0.60 0.15 250);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.97 0.00 0);
  --secondary-foreground: oklch(0.18 0 0);

  --muted: oklch(0.97 0.00 0);
  --muted-foreground: oklch(0.56 0 0);

  --border: oklch(0.93 0.00 0);
  --input: oklch(0.93 0.00 0);
  --ring: oklch(0.60 0.15 250);

  --radius: 0.625rem;

  /* Extended semantic tokens */
  --text-primary: var(--foreground);
  --text-secondary: oklch(0.56 0 0);
  --space-component-md: 1.5rem;
  --space-section-md: 4rem;
}

.dark {
  --background: oklch(0.18 0 0);
  --foreground: oklch(0.99 0 0);

  --primary: oklch(0.68 0.10 250);
  --primary-foreground: oklch(0.18 0 0);

  --secondary: oklch(0.26 0 0);
  --secondary-foreground: oklch(0.97 0 0);

  --border: oklch(0.36 0 0);
  --input: oklch(0.36 0 0);
}

/* Typography */
body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-sans);
  font-weight: 600;
}

/* Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 3: Configure Fonts (5 min)

**Update `frontend/src/app/layout.tsx`:**

```tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Step 4: Setup Theme Provider (5 min)

**Create `frontend/src/components/theme-provider.tsx`:**

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Update `frontend/src/app/layout.tsx`:**

```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 5: Install Core Components (5 min)

```bash
# Essential components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add dialog

# Form components
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add checkbox

# Layout components
npx shadcn@latest add separator
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
```

### Step 6: Create Theme Toggle (5 min)

**Create `frontend/src/components/theme-toggle.tsx`:**

```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## 🎨 Usage Examples

### Example 1: Hero Section

```tsx
export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Professional UI Design System
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Built with shadcn/ui, inspired by Linear, Vercel, and Stripe.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Example 2: Feature Card

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function FeatureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Semantic Tokens</CardTitle>
        <CardDescription>
          Comprehensive token system with 3 semantic layers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Extended shadcn/ui tokens for surface, border, text, and interactive states.
        </p>
      </CardContent>
    </Card>
  )
}
```

### Example 3: Form with Validation

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
```

---

## 🎯 Next Steps

1. **Read Full Documentation:** `docs/DESIGN_SYSTEM.md`
2. **Explore Research Reports:** `.mahirolab/research/`
3. **Install Additional Components:** Table, Dialog, Tabs, etc.
4. **Customize Tokens:** Adjust colors, spacing for your brand
5. **Build Custom Components:** Extend base components

---

## 📚 Resources

- **Full Design System:** `docs/DESIGN_SYSTEM.md`
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Tailwind v4 Docs:** https://tailwindcss.com
- **Design Inspiration:** Linear, Vercel, Stripe

---

**Ready to build professional UIs!** 🎉
