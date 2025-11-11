# Feedback & Overlay Components

Complete guide to shadcn/ui feedback and overlay components including dialogs, toasts, menus, and interactive overlays.

## Overview

Feedback and overlay components provide user interaction feedback and control information flow. This section covers dialogs, menus, toasts, and other overlay components with their accessibility patterns.

## Dialog & Modal

### Dialog Patterns

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">Username</Label>
        <Input id="username" defaultValue="@peduarte" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Dialog Accessibility Guidelines

- Trap focus within the dialog
- Close on Escape key
- Click outside to close (optional)
- Maintain proper heading hierarchy
- Provide clear actions and cancel options

## Toast Migration to Sonner

### 🚨 Critical Update: Toast Component Deprecated

The Toast component has been deprecated in favor of Sonner. Migrate immediately:

```bash
# Install Sonner
npx shadcn@latest add sonner
npm install sonner
```

### Migration Pattern

```tsx
// ❌ Before (Deprecated)
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

function handleSubmit() {
  toast({
    title: "Success!",
    description: "Your changes have been saved.",
  })
}

// ✅ After (Sonner)
import { toast } from 'sonner'

function handleSubmit() {
  toast.success("Your changes have been saved.")
}
```

### Sonner Usage Patterns

```tsx
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

// In your app root
export function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  )
}

// Success toast
toast.success("Profile updated successfully!")

// Error toast
toast.error("Failed to update profile")

// Loading toast
const toastId = toast.loading("Uploading...")

// Update loading toast
toast.success("Upload complete!", { id: toastId })

// Rich content
toast("Profile updated", {
  description: "Your changes have been saved to the database.",
  action: {
    label: "View",
    onClick: () => console.log("View profile"),
  },
})
```

## Dropdown Menu & Context Menu

### Dropdown Menu Patterns

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Context Menu

```tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'

<ContextMenu>
  <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Forward</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>View Page Source</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Menu Accessibility Guidelines

- Ensure keyboard navigation (arrow keys, Enter, Escape)
- Provide visible focus indicators
- Use semantic menu roles
- Include menu separators for logical grouping
- Maintain proper focus management

## Sheet & Drawer

### Sheet Component

```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      {/* Form content */}
    </div>
  </SheetContent>
</Sheet>
```

### Drawer Pattern (Mobile First)

```tsx
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader className="text-left">
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>
        This action cannot be undone.
      </DrawerDescription>
    </DrawerHeader>
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setOpen(false)}>Continue</Button>
      </div>
    </div>
  </DrawerContent>
</Drawer>
```

## Hover Card & Popover

### Hover Card

```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

<HoverCard>
  <HoverCardTrigger asChild>
    <Link href="/docs/primitives/hover-card" className="text-sm font-medium">
      @radix-ui/react-hover-card
    </Link>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    <div className="flex justify-between space-x-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@radix-ui/react-hover-card</h4>
        <p className="text-sm text-muted-foreground">
          Displays rich content in a portal, triggered when a user's element enters another element.
        </p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

### Popover

```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Dimensions</h4>
        <p className="text-sm text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="maxWidth">Max. width</Label>
          <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

## Command Palette

### Command Component

```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>
        <Calendar className="mr-2 h-4 w-4" />
        <span>Calendar</span>
      </CommandItem>
      <CommandItem>
        <Smile className="mr-2 h-4 w-4" />
        <span>Search Emoji</span>
      </CommandItem>
      <CommandItem>
        <Calculator className="mr-2 h-4 w-4" />
        <span>Calculator</span>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Accessibility Guidelines

### WCAG 2.1 Compliance

- **Focus Management**: Proper focus trapping and restoration
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: 4.5:1 minimum for normal text
- **Timing**: Provide sufficient time to read and use content

### Focus Trapping

Ensure focus is properly managed in modals and dialogs:

```tsx
// Focus is automatically trapped by shadcn/ui Dialog
// Focus returns to trigger element when dialog closes
```

### Escape Key Handling

All overlays should close on Escape key press (handled by default).

### Screen Reader Support

- Use `aria-label` for icon-only buttons
- Provide `aria-describedby` for additional context
- Announce changes when content updates
- Use live regions for dynamic content

## Performance Considerations

### Portal Usage

All overlays use React portals for proper z-index layering. Ensure:

- Root element exists for portal mounting
- Proper CSS containment for performance
- Event handlers are properly cleaned up

### Animation Performance

- Use CSS transforms instead of layout properties
- Prefer opacity changes for smooth animations
- Use `will-change` sparingly
- Test on lower-end devices

## Migration Patterns

See [Migration Guide](../migration-guide.md) for detailed migration patterns from alert dialogs and modals to shadcn/ui components.

## References

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)
- [WCAG Modal Dialog Guidelines](https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/dialog.html)