# Navigation Patterns

Comprehensive guide to navigation patterns using shadcn/ui components with responsive design, accessibility, and user experience considerations.

## Overview

Navigation is the backbone of user experience, helping users understand where they are and where they can go. This guide covers navigation patterns from simple menus to complex responsive layouts.

## Core Navigation Principles

### 1. Clear Information Architecture
- Group related navigation items logically
- Use clear, descriptive labels
- Maintain consistent navigation across pages
- Provide visual feedback for current location

### 2. Responsive Design
- Adapt navigation patterns for different screen sizes
- Prioritize important navigation items on mobile
- Use mobile-first design principles
- Ensure touch targets are at least 44px

### 3. Accessibility Standards
- Support keyboard navigation
- Include proper ARIA labels and roles
- Maintain focus management
- Provide sufficient color contrast (4.5:1 minimum)

## Navigation Menu

### Responsive Navigation with useIsMobile Hook

```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function ResponsiveNavigation() {
  const isMobile = useIsMobile()

  const navigationItems = [
    {
      title: 'Products',
      href: '/products',
      description: 'Browse our product catalog',
      items: [
        { title: 'Electronics', href: '/products/electronics' },
        { title: 'Clothing', href: '/products/clothing' },
        { title: 'Books', href: '/products/books' },
      ],
    },
    {
      title: 'About',
      href: '/about',
      description: 'Learn more about our company',
    },
    {
      title: 'Contact',
      href: '/contact',
      description: 'Get in touch with us',
    },
  ]

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-medium">{item.title}</h3>
                {item.items && (
                  <div className="pl-4 space-y-1">
                    {item.items.map((subItem) => (
                      <NavigationMenuLink
                        key={subItem.href}
                        href={subItem.href}
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {subItem.title}
                      </NavigationMenuLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href={item.href}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {item.title}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {item.description}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                    {item.items.map((subItem) => (
                      <NavigationMenuLink key={subItem.href} href={subItem.href}>
                        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">
                            {subItem.title}
                          </div>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <a
                  href={item.href}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  {item.title}
                </a>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## Sidebar Navigation

### Collapsible Sidebar with Keyboard Shortcuts

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu, PlusCircle, Search, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SidebarLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Toggle sidebar with Cmd/Ctrl + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        if (isMobile) {
          setMobileOpen(!mobileOpen)
        } else {
          setIsCollapsed(!isCollapsed)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCollapsed, isMobile, mobileOpen])

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => isMobile ? setMobileOpen(false) : setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {!isCollapsed && (
          <h2 className="ml-2 text-lg font-semibold">Navigation</h2>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          <NavItem
            icon={<Search className="h-4 w-4" />}
            label="Search"
            collapsed={isCollapsed}
            onClick={() => console.log('Search')}
          />
          <NavItem
            icon={<PlusCircle className="h-4 w-4" />}
            label="Create New"
            collapsed={isCollapsed}
            onClick={() => console.log('Create')}
          />
          <NavItem
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            collapsed={isCollapsed}
            onClick={() => console.log('Settings')}
          />
        </nav>
      </ScrollArea>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-80">
          {sidebarContent}
        </SheetContent>
        {/* Main content */}
        <main className="flex-1">
          {/* Your main content here */}
        </main>
      </Sheet>
    )
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={30}
        collapsible
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className={cn(
          isCollapsed && "min-w-[50px]"
        )}
      >
        {sidebarContent}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80} minSize={70}>
        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="text-muted-foreground">
            Press Cmd/Ctrl + B to toggle sidebar
          </p>
        </main>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  onClick: () => void
}

function NavItem({ icon, label, collapsed, onClick }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        collapsed && "justify-center px-2"
      )}
      onClick={onClick}
    >
      {icon}
      {!collapsed && <span className="ml-2">{label}</span>}
    </Button>
  )
}
```

## Tabs Navigation

### Manual & Automatic Activation Patterns

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsNavigation() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <h3 className="text-lg font-semibold">Overview</h3>
        <p className="text-muted-foreground">
          View your dashboard and key metrics at a glance.
        </p>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <h3 className="text-lg font-semibold">Analytics</h3>
        <p className="text-muted-foreground">
          Dive deep into your data with advanced analytics.
        </p>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <h3 className="text-lg font-semibold">Reports</h3>
        <p className="text-muted-foreground">
          Generate and view detailed reports.
        </p>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <p className="text-muted-foreground">
          Configure your preferences and account settings.
        </p>
      </TabsContent>
    </Tabs>
  )
}
```

### Vertical Tabs

```tsx
export function VerticalTabs() {
  return (
    <div className="flex gap-6">
      <Tabs defaultValue="account" orientation="vertical" className="w-48">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Tabs defaultValue="account" className="w-full">
          <TabsContent value="account">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p className="text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </TabsContent>

          <TabsContent value="password">
            <h3 className="text-lg font-semibold">Password</h3>
            <p className="text-muted-foreground">
              Change your password and security settings.
            </p>
          </TabsContent>

          <TabsContent value="notifications">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-muted-foreground">
              Configure how you receive notifications.
            </p>
          </TabsContent>

          <TabsContent value="privacy">
            <h3 className="text-lg font-semibold">Privacy</h3>
            <p className="text-muted-foreground">
              Manage your privacy and data sharing preferences.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

## Breadcrumb Navigation

### Accessible Breadcrumb Pattern

```tsx
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}

            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  item.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Usage example
export function BreadcrumbExample() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', current: true },
  ]

  return <Breadcrumb items={breadcrumbItems} />
}
```

## Mobile Navigation Patterns

### Bottom Navigation Bar

```tsx
import { Button } from '@/components/ui/button'
import { Home, Search, Plus, User, Settings } from 'lucide-react'

const bottomNavItems = [
  { icon: Home, label: 'Home', href: '/', active: true },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Plus, label: 'Create', href: '/create' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <nav className="flex justify-around items-center h-16 px-4">
        {bottomNavItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center justify-center h-full py-1 px-3",
              item.active && "text-primary"
            )}
            asChild
          >
            <a href={item.href}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </a>
          </Button>
        ))}
      </nav>
    </div>
  )
}
```

### Hamburger Menu with Slide Navigation

```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Menu, X } from 'lucide-react'

const mobileNavItems = [
  { title: 'Home', href: '/', description: 'Go to homepage' },
  { title: 'Products', href: '/products', description: 'Browse products' },
  { title: 'About', href: '/about', description: 'Learn about us' },
  { title: 'Contact', href: '/contact', description: 'Get in touch' },
]

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {mobileNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div>{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </a>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground">
              © 2024 Your Company
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Accessibility Guidelines

### Keyboard Navigation

All navigation components should support:

- **Tab Navigation**: Move between navigation items
- **Arrow Keys**: Navigate within menus and dropdowns
- **Enter/Space**: Activate navigation items
- **Escape**: Close menus and dropdowns
- **Home/End**: Jump to first/last items

### ARIA Attributes

```tsx
// Example for proper ARIA implementation
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a
        href="/home"
        role="menuitem"
        aria-current="page"
        aria-label="Home page"
      >
        Home
      </a>
    </li>
    <li role="none">
      <button
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
        aria-controls="products-dropdown"
      >
        Products
      </button>
      <ul
        id="products-dropdown"
        role="menu"
        aria-hidden={!isDropdownOpen}
      >
        {/* Dropdown items */}
      </ul>
    </li>
  </ul>
</nav>
```

### Focus Management

```tsx
// Focus trap for mobile menu
useEffect(() => {
  if (menuOpen) {
    // Focus first menu item
    firstMenuItemRef.current?.focus()

    // Trap focus within menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusableElements) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }
}, [menuOpen])
```

## Performance Considerations

### Lazy Loading Navigation Content

```tsx
import { Suspense, lazy } from 'react'

// Lazy load heavy navigation components
const HeavyNavigationMenu = lazy(() => import('./HeavyNavigationMenu'))

export function OptimizedNavigation() {
  return (
    <nav>
      <Suspense fallback={<div>Loading navigation...</div>}>
        <HeavyNavigationMenu />
      </Suspense>
    </nav>
  )
}
```

### Virtual Scrolling for Long Lists

```tsx
import { FixedSizeList as List } from 'react-window'

interface VirtualizedNavigationProps {
  items: Array<{ id: string; label: string; href: string }>
}

export function VirtualizedNavigation({ items }: VirtualizedNavigationProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <a
        href={items[index].href}
        className="block px-3 py-2 hover:bg-accent"
      >
        {items[index].label}
      </a>
    </div>
  )

  return (
    <List
      height={300}
      itemCount={items.length}
      itemSize={40}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

## Testing Navigation

### Navigation Testing Checklist

- [ ] All navigation items are keyboard accessible
- [ ] Focus indicators are clearly visible
- [ ] ARIA labels and roles are correctly implemented
- [ ] Navigation works on mobile devices
- [ ] Touch targets are at least 44px
- [ ] Dropdown menus can be closed with Escape
- [ ] Breadcrumb navigation is properly structured
- [ ] Current page/location is clearly indicated
- [ ] Navigation patterns are consistent across the site
- [ ] Responsive behavior works correctly

## References

- [Radix UI Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu)
- [WCAG Navigation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/navigating.html)
- [Mobile Navigation Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/input/forms/)