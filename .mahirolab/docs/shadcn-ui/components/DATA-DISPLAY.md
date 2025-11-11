# Data Display Components

Comprehensive guide to shadcn/ui data display components with responsive patterns and best practices.

## Overview

Data display components help present information clearly and effectively. This section covers tables, cards, charts, and other data visualization components with their responsive patterns and accessibility features.

## Card

### Responsive Card Patterns

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Standard card with all sections
<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Responsive card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id} className="data-slot">
      <CardHeader>
        <CardTitle className="text-lg">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Data Slot Hooks

Use data-slot hooks for conditional styling:

```tsx
<Card data-state={isLoading ? 'loading' : 'idle'}>
  <CardContent>
    {isLoading ? (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ) : (
      children
    )}
  </CardContent>
</Card>
```

## Badge

### Status Indicators

```tsx
import { Badge } from '@/components/ui/badge'

// Status badges with semantic colors
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Pending</Badge>

// Custom status badges
<Badge className="bg-green-100 text-green-800 border-green-200">
  Success
</Badge>
<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
  Warning
</Badge>
```

## Avatar

### User Avatars with Fallbacks

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// User avatar with fallback
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Avatar group
<div className="flex -space-x-2">
  {users.map((user) => (
    <Avatar key={user.id} className="border-2 border-background">
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
  <Avatar className="border-2 border-background">
    <AvatarFallback>+{remainingUsers}</AvatarFallback>
  </Avatar>
</div>
```

## Table & Data Table

### Basic Table Pattern

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.id}>
        <TableCell className="font-medium">{invoice.name}</TableCell>
        <TableCell>
          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
            {invoice.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="outline" size="sm">View</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Data Table with TanStack Integration

```tsx
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { data } from './data'

export function UsersDataTable() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

### Mobile Scroll Fallbacks

For responsive tables, use horizontal scrolling on mobile:

```tsx
<div className="rounded-md border">
  <div className="overflow-x-auto">
    <Table>
      {/* Table content */}
    </Table>
  </div>
</div>
```

## Skeleton

### Loading States

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Card skeleton
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>

// Table skeleton
<div className="space-y-3">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center space-x-4">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  ))}
</div>
```

## Progress

### Progress Indicators

```tsx
import { Progress } from '@/components/ui/progress'

// Basic progress
<Progress value={33} />

// Progress with label
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>33%</span>
  </div>
  <Progress value={33} />
</div>

// Animated progress
<Progress value={progress} className="transition-all duration-500" />
```

## Alert & Callout

### Alert Variants

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Information alert
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational alert message.
  </AlertDescription>
</Alert>

// Success alert
<Alert className="border-green-200 bg-green-50">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertTitle className="text-green-800">Success</AlertTitle>
  <AlertDescription className="text-green-700">
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>

// Warning alert
<Alert className="border-yellow-200 bg-yellow-50">
  <AlertTriangle className="h-4 w-4 text-yellow-600" />
  <AlertTitle className="text-yellow-800">Warning</AlertTitle>
  <AlertDescription className="text-yellow-700">
    Please review your input before proceeding.
  </AlertDescription>
</Alert>

// Error alert
<Alert className="border-red-200 bg-red-50">
  <XCircle className="h-4 w-4 text-red-600" />
  <AlertTitle className="text-red-800">Error</AlertTitle>
  <AlertDescription className="text-red-700">
    Something went wrong. Please try again.
  </AlertDescription>
</Alert>
```

## Chart Integration

### Recharts Primitives

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
]

export function BarChartDemo() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

### Responsive Design

For responsive charts, ensure container sizing:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <div className="h-[300px]">
    <BarChartDemo />
  </div>
  <div className="h-[300px]">
    <LineChartDemo />
  </div>
</div>
```

## Accessibility Guidelines

### Table Accessibility

- Use proper table headers with `<th>` elements
- Include `scope` attributes for header cells
- Provide table captions for complex tables
- Ensure keyboard navigation works correctly

### Chart Accessibility

- Provide alternative text descriptions
- Include data tables as fallbacks
- Use sufficient color contrast
- Ensure interactive elements are keyboard accessible

## Performance Considerations

### Large Data Sets

- Implement virtualization for large tables
- Use pagination or infinite scroll
- Lazy load chart data when needed
- Debounce search and filter operations

### Image Optimization

- Use appropriate image sizes for avatars
- Implement lazy loading for offscreen images
- Use modern image formats (WebP, AVIF)

## Migration Patterns

See [Migration Guide](../migration-guide.md) for detailed migration from HTML tables and basic layouts to shadcn/ui components.

## References

- [TanStack Table Documentation](https://tanstack.com/table/v8)
- [Recharts Documentation](https://recharts.org/)
- [WCAG Data Table Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/data-tables.html)