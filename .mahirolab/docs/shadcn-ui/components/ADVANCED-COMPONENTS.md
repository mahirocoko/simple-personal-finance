# Advanced Components

Comprehensive guide to shadcn/ui advanced components including calendars, color pickers, sliders, and complex interactive elements.

## Overview

Advanced components provide sophisticated functionality for complex user interactions. This section covers cutting-edge components with their latest features and browser compatibility requirements.

## Calendar & Date Picker

### Timezone-Aware Rendering

```tsx
import { Calendar } from '@/components/ui/calendar'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'

export function TimezoneAwareCalendar() {
  const [date, setDate] = useState<CalendarDate | null>(null)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      timeZone={getLocalTimeZone()}
    />
  )
}
```

### Multilingual Support

```tsx
import { Calendar } from '@/components/ui/calendar'
import { createCalendar } from '@internationalized/date'

export function MultilingualCalendar() {
  const [locale] = useState('en-US')

  return (
    <Calendar
      locale={locale}
      createCalendar={createCalendar}
    />
  )
}
```

### Date Picker Integration

```tsx
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

export function DatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Color Picker

### EyeDropper API Integration

**🔒 HTTPS Required**: The EyeDropper API only works on secure contexts (HTTPS).

```tsx
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function EyeDropperPicker() {
  const [color, setColor] = useState('#000000')

  const pickColor = async () => {
    try {
      if (!window.EyeDropper) {
        throw new Error('EyeDropper API not supported')
      }

      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      setColor(result.sRGBHex)
    } catch (error) {
      console.error('Failed to pick color:', error)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div
        className="w-12 h-12 rounded border-2 border-gray-300"
        style={{ backgroundColor: color }}
      />
      <Button onClick={pickColor} disabled={!window.EyeDropper}>
        {window.EyeDropper ? 'Pick Color' : 'EyeDropper Not Supported'}
      </Button>
      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="px-3 py-2 border rounded"
      />
    </div>
  )
}
```

### Fallback Color Picker

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FallbackColorPicker() {
  const [color, setColor] = useState('#000000')

  return (
    <div className="space-y-2">
      <Label htmlFor="color">Color</Label>
      <div className="flex items-center space-x-2">
        <div
          className="w-10 h-10 rounded border-2 border-gray-300"
          style={{ backgroundColor: color }}
        />
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-20 h-10 p-1"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
```

## Slider

### Multi-Thumb Ranges

```tsx
import { Slider } from '@/components/ui/slider'

export function RangeSlider() {
  const [value, setValue] = useState([20, 80])

  return (
    <div className="space-y-4">
      <Slider
        value={value}
        onValueChange={setValue}
        max={100}
        step={1}
        minStepsBetweenThumbs={1}
        className="w-[100%]"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Min: {value[0]}</span>
        <span>Max: {value[1]}</span>
      </div>
    </div>
  )
}
```

### Radix 1.3.6 Compatibility

The Slider component is compatible with Radix UI 1.3.6 and includes:

- Touch-friendly interaction
- Keyboard navigation (arrow keys, Home, End)
- ARIA support
- Customizable thumb and track styling

```tsx
import { Slider } from '@/components/ui/slider'
import { Volume2 } from 'lucide-react'

export function VolumeSlider() {
  const [volume, setVolume] = useState([50])

  return (
    <div className="flex items-center space-x-4">
      <Volume2 className="h-4 w-4" />
      <Slider
        value={volume}
        onValueChange={setVolume}
        max={100}
        step={1}
        className="w-[200px]"
      />
      <span className="text-sm text-muted-foreground w-8">
        {volume[0]}%
      </span>
    </div>
  )
}
```

## Resizable Panels

### Resizable Component

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Complex Layout Example

```tsx
export function ComplexLayout() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="p-4">
          <h2 className="font-semibold mb-4">Navigation</h2>
          {/* Navigation content */}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="p-4">
              <h1 className="font-semibold mb-4">Main Content</h1>
              {/* Main content */}
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={15}>
            <div className="p-4">
              <h2 className="font-semibold mb-4">Output</h2>
              {/* Output panel */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Scroll Area

### Custom Scrollbar

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

export function CustomScrollbar() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

### Horizontal Scroll

```tsx
export function HorizontalScroll() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {items.map((item) => (
          <div key={item} className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
            {item}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## Accordion & Collapsible

### Accordion Component

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Collapsible Component

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          Can I use this in my project?
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Yes. Free to use for personal and commercial projects. No attribution required.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Tabs

### Manual & Automatic Activation

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here. Click save when you're done.
      </TabsContent>
      <TabsContent value="password">
        Change your password here. After saving, you'll be logged out.
      </TabsContent>
    </Tabs>
  )
}
```

## Accessibility Guidelines

### Calendar Accessibility

- Provide keyboard navigation for all date selection
- Include clear labels for months and days
- Support screen reader announcements
- Maintain proper focus management

### Color Picker Accessibility

- Provide text-based color input for screen readers
- Include color contrast information
- Support keyboard navigation
- Offer fallbacks for unsupported features

### Slider Accessibility

- Provide value labels and descriptions
- Include keyboard controls (arrow keys, Home, End)
- Announce value changes to screen readers
- Ensure sufficient touch target size

## Browser Compatibility

### EyeDropper API Support

- ✅ Chrome 95+
- ✅ Edge 95+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

### Internationalized Date API

- ✅ Modern browsers with `Intl.DateTimeFormat`
- ✅ Node.js with full ICU support
- ⚠️ May require polyfills for older environments

### Fallback Strategies

Always provide fallbacks for unsupported features:

```tsx
// EyeDropper fallback
const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

// Modern date handling fallback
const hasModernDateAPI = typeof Intl !== 'undefined' && Intl.DateTimeFormat
```

## Performance Considerations

### Complex Components

- Implement virtualization for large data sets
- Use `React.memo` for expensive renders
- Debounce rapid interactions
- Test on lower-end devices

### Animation Performance

- Use CSS transforms for smooth animations
- Prefer `opacity` changes over layout operations
- Use `will-change` sparingly
- Test animation frame rates

## Migration Patterns

See [Migration Guide](../migration-guide.md) for detailed migration patterns from custom date pickers and color selectors to shadcn/ui components.

## References

- [Internationalized Date API](https://unicode-org.github.io/icu/userguide/datetime/)
- [EyeDropper API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
- [Radix UI Slider Documentation](https://www.radix-ui.com/primitives/docs/components/slider)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)