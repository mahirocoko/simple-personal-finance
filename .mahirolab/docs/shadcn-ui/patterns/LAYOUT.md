# Layout Patterns

Comprehensive guide to layout patterns using shadcn/ui components with responsive design, spacing systems, and modern CSS techniques.

## Overview

Layout patterns provide structure and organization to your application interface. This guide covers grid systems, responsive layouts, spacing, and component arrangement using shadcn/ui components.

## Design System Foundations

### Spacing System (4px Base Unit)

```css
/* Spacing Scale based on 4px */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Container Patterns

```tsx
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-screen-sm': size === 'sm',
          'max-w-screen-md': size === 'md',
          'max-w-screen-lg': size === 'lg',
          'max-w-screen-xl': size === 'xl',
          'max-w-none': size === 'full',
        },
        className
      )}
    >
      {children}
    </div>
  )
}

// Usage examples
export function LayoutExamples() {
  return (
    <div className="space-y-8">
      {/* Default container */}
      <Container>
        <div className="bg-muted p-8 rounded-lg">
          <h2>Default Container (lg)</h2>
          <p>Max width: 1024px</p>
        </div>
      </Container>

      {/* Small container */}
      <Container size="sm">
        <div className="bg-muted p-8 rounded-lg">
          <h2>Small Container</h2>
          <p>Max width: 640px</p>
        </div>
      </Container>

      {/* Full width container */}
      <Container size="full">
        <div className="bg-muted p-8 rounded-lg">
          <h2>Full Width Container</h2>
          <p>No max width constraint</p>
        </div>
      </Container>
    </div>
  )
}
```

## Grid Layout Patterns

### 12-Column Grid System

```tsx
interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: number
  className?: string
}

export function Grid({ children, cols = 1, gap = 4, className }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        {
          'grid-cols-1': cols === 1,
          'grid-cols-2': cols === 2,
          'grid-cols-3': cols === 3,
          'grid-cols-4': cols === 4,
          'grid-cols-6': cols === 6,
          'grid-cols-12': cols === 12,
        },
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// Responsive grid with breakpoints
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Grid Item {i + 1}</h3>
          <p className="text-sm text-muted-foreground">
            Responsive grid item that adapts to screen size
          </p>
        </div>
      ))}
    </div>
  )
}
```

### Card Grid Layout

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CardGrid() {
  const cards = [
    {
      title: 'Analytics',
      description: 'View detailed analytics and insights',
      icon: '📊',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: '👥',
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: '⚙️',
    },
    {
      title: 'Reports',
      description: 'Generate and download reports',
      icon: '📈',
    },
    {
      title: 'Security',
      description: 'Monitor security and access logs',
      icon: '🔒',
    },
    {
      title: 'Support',
      description: 'Get help and support resources',
      icon: '💬',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="text-3xl mb-2">{card.icon}</div>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Flexbox Layout Patterns

### Sidebar Layout

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SidebarLayout({ sidebar, children, className }: SidebarLayoutProps) {
  return (
    <div className={cn('flex h-screen', className)}>
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30">
        <ScrollArea className="h-full">
          <div className="p-6">
            {sidebar}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

// Usage example
export function DashboardLayout() {
  const sidebarContent = (
    <nav className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Main Menu</h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Settings
          </Button>
        </div>
      </div>
    </nav>
  )

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's what's happening today.
        </p>

        <ResponsiveGrid />
      </div>
    </SidebarLayout>
  )
}
```

### Header and Main Layout

```tsx
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <>
            <Separator orientation="vertical" className="h-6 mx-4" />
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function HeaderMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Application"
        subtitle="Manage your application settings"
        actions={
          <>
            <Button variant="outline" size="sm">
              Settings
            </Button>
            <Button size="sm">
              New Project
            </Button>
          </>
        }
      />

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
```

## Responsive Layout Patterns

### Mobile-First Stack Layout

```tsx
export function ResponsiveStackLayout() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold">
          Responsive Layout
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This layout adapts gracefully to different screen sizes using
          Tailwind's responsive utilities.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg space-y-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

const features = [
  {
    icon: '🚀',
    title: 'Fast Performance',
    description: 'Optimized for speed and efficiency',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Works perfectly on all devices',
  },
  {
    icon: '🎨',
    title: 'Beautiful Design',
    description: 'Modern and intuitive interface',
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Enterprise-grade security',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Instant response times',
  },
  {
    icon: '🛠️',
    title: 'Customizable',
    description: 'Tailored to your needs',
  },
]

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '1M+', label: 'Users' },
  { value: '150+', label: 'Countries' },
  { value: '24/7', label: 'Support' },
]
```

### Complex Multi-Column Layout

```tsx
export function MultiColumnLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar (4 columns on large screens) */}
      <aside className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Create New Project
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Import Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content (8 columns on large screens) */}
      <main className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Main Content Area</CardTitle>
            <CardDescription>
              This is where your primary content will be displayed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3>Responsive Design</h3>
              <p>
                This layout uses a 12-column grid system that adapts to different
                screen sizes. On large screens, the sidebar takes 4 columns and
                the main content takes 8 columns. On smaller screens, everything
                stacks vertically.
              </p>
              <h3>Flexible Components</h3>
              <p>
                Each section uses shadcn/ui components like Card, Button, and
                Badge to maintain consistency across the application.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed analytics and performance metrics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate and download comprehensive reports
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

const activities = [
  { title: 'Project "Dashboard" updated', time: '2 hours ago' },
  { title: 'New user registration', time: '5 hours ago' },
  { title: 'Report generated successfully', time: '1 day ago' },
  { title: 'System maintenance completed', time: '2 days ago' },
]
```

## Specialized Layout Patterns

### Two-Panel Layout

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export function TwoPanelLayout() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="p-6 border-r">
          <h2 className="text-lg font-semibold mb-4">Left Panel</h2>
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-3 border rounded cursor-pointer hover:bg-muted">
                Item {i + 1}
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={70}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Right Panel</h2>
          <p className="text-muted-foreground">
            Drag the divider to resize panels. This layout is perfect for
            applications like code editors, file explorers, or email clients.
          </p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Centered Content Layout

```tsx
export function CenteredLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your password"
              />
            </div>

            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
```

## Layout Best Practices

### Consistent Spacing

```tsx
// Use consistent spacing throughout your layouts
export function ConsistentSpacing() {
  return (
    <div className="space-y-8"> // Page sections
      <section className="space-y-6"> // Section content
        <div className="space-y-4"> // Component group
          <div className="space-y-2"> // Related items
            {/* Items */}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Responsive Typography

```tsx
export function ResponsiveTypography() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
        Responsive Heading
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
        This text scales appropriately with screen size
      </p>
    </div>
  )
}
```

### Container Queries (Future Consideration)

```tsx
// While waiting for container queries, use min/max-width
export function ContainerAwareLayout() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Items that adapt based on available space */}
    </div>
  )
}
```

## Performance Considerations

### Layout Optimization

```tsx
// Use CSS containment for better performance
export function OptimizedLayout() {
  return (
    <div className="contain-layout">
      {/* Content that doesn't affect outside layout */}
    </div>
  )
}

// Use transform instead of layout properties for animations
export function AnimatedLayout() {
  return (
    <div className="transition-transform duration-200 hover:scale-105">
      {/* Hover effects that don't trigger layout recalculations */}
    </div>
  )
}
```

## Testing Layouts

### Layout Testing Checklist

- [ ] Layout works on mobile (320px+)
- [ ] Layout works on tablet (768px+)
- [ ] Layout works on desktop (1024px+)
- [ ] Navigation is accessible on all screen sizes
- [ ] Touch targets are at least 44px
- [ ] Text remains readable at all sizes
- [ ] Horizontal scrolling is avoided
- [ ] Images and media scale properly
- [ ] Focus order is logical
- [ ] Layout maintains consistency across pages

## References

- [Tailwind CSS Layout Documentation](https://tailwindcss.com/docs/layout)
- [CSS Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Complete Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)