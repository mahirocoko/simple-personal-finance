# Frontend Best Practices

**Last Updated:** 2025-10-06
**Tech Stack:** React 19, React Router v7 (SPA), TypeScript, Bun, Biome

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Component Patterns](#component-patterns)
3. [TypeScript Conventions](#typescript-conventions)
4. [Styling](#styling)
5. [State Management](#state-management)
6. [Forms & Validation](#forms--validation)
7. [API & Data Fetching](#api--data-fetching)
8. [Error Handling](#error-handling)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Code Style & Tooling](#code-style--tooling)
11. [File Organization](#file-organization)
12. [Performance](#performance)
13. [Anti-Patterns](#anti-patterns)

---

## Project Setup

### Package Manager
- **Use Bun** for all package management
- Faster than npm/yarn
- Consistent with backend

```bash
# Install dependencies
bun install

# Add package
bun add package-name

# Dev dependency
bun add -d package-name
```

### React Router v7 (SPA Mode)
```typescript
// react-router.config.ts
export default {
  ssr: false, // SPA mode
} satisfies Config
```

---

## Component Patterns

### Function Components (No React.FC)
✅ **DO:**
```tsx
export function Button(props: IButtonProps) {
  return <button>{props.children}</button>
}
```

❌ **DON'T:**
```tsx
export const Button: React.FC<IButtonProps> = (props) => {
  return <button>{props.children}</button>
}
```

**Why?** More explicit, better TypeScript inference, no implicit `children` prop.

---

### Props Interface Naming
✅ **ALWAYS use `I` prefix for interfaces:**
```tsx
interface IButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button(props: IButtonProps) { ... }
```

---

### Component File Structure

**IMPORTANT: Use kebab-case for component file names**

**Simple components → Single file with kebab-case:**
```
components/ui/
  button.tsx           # ✅ Correct
  card.tsx             # ✅ Correct
  badge.tsx            # ✅ Correct
  error-message.tsx    # ✅ Correct
  loading-spinner.tsx  # ✅ Correct

  # ❌ WRONG - Don't use PascalCase
  Button.tsx
  ErrorMessage.tsx
```

**Complex components with variants → Folder with PascalCase:**
```
components/
  Input/               # Folder uses PascalCase
    index.tsx          # Main component
    InputNumber.tsx    # Variant uses PascalCase
    InputPassword.tsx  # Variant uses PascalCase
    InputSearch.tsx    # Variant uses PascalCase
```

**Naming Rules:**
- **Simple single-file components:** kebab-case (e.g., `button.tsx`, `error-message.tsx`)
- **Complex component folders:** PascalCase folder name (e.g., `Input/`)
- **Variants inside folders:** PascalCase file names (e.g., `InputNumber.tsx`)

**When to use folder:**
- Multiple related components (Input variants)
- Shared types/utils only for this component
- Component-specific styles

---

## TypeScript Conventions

### Type vs Interface

✅ **Interface for:**
- Object shapes
- Component props
- API response structures

```tsx
interface IUserProps {
  name: string
  email: string
}
```

✅ **Type for:**
- Unions
- Primitives
- Utility types

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error'
type Nullable<T> = T | null
```

---

### Import Types
✅ **ALWAYS use `import type` for type-only imports:**
```tsx
import type { AxiosRequestConfig } from 'axios'
import type { IUser } from '@/types'
```

**Why?** Better tree-shaking, clear separation of runtime vs type-level imports.

---

### Export Types
✅ **Inline export (preferred):**
```tsx
export interface IButtonProps {
  children: React.ReactNode
}
```

---

### Required vs Optional Props
**Rule:** If it's necessary → required, otherwise → optional

```tsx
interface IButtonProps {
  children: React.ReactNode    // Required: button needs content
  onClick?: () => void          // Optional: might not have action
  disabled?: boolean            // Optional: default is false
  variant?: 'primary' | 'secondary' // Optional: has default
}
```

---

## Styling

### Tailwind CSS + cn Utility

**Setup cn utility:**
```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Why?** Prevents Tailwind class conflicts and handles conditional classes.

---

### Dynamic Classes with cn

✅ **DO:**
```tsx
import { cn } from '@/lib/utils'

interface IButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Button({ variant = 'primary', className }: IButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        className
      )}
    >
      Click me
    </button>
  )
}
```

**Benefits:**
- Merge conflicting Tailwind classes
- Clean conditional styling
- Allow className override from parent

---

### Using @apply
✅ **Can use `@apply` when appropriate:**
```css
.btn-base {
  @apply px-4 py-2 rounded font-medium transition-colors;
}
```

**When to use:**
- Repeated complex class combinations
- Base styles shared across components

---

## State Management

### Local State → useState
```tsx
export function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Use useState for:**
- Simple component state
- UI state (modals, dropdowns)
- Form inputs (with React Hook Form)

---

### Global State → Zustand
```tsx
// stores/auth.ts
import { create } from 'zustand'

interface IAuthStore {
  user: IUser | null
  login: (user: IUser) => void
  logout: () => void
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

**Use Zustand for:**
- User authentication state
- Global app settings
- Shared data across routes

---

## Forms & Validation

### React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  )
}
```

**Why this stack?**
- Zod: Type-safe schemas, great TypeScript inference
- React Hook Form: Minimal re-renders, easy validation

---

## API & Data Fetching

### TanStack Query (React Query)

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/services/api'

// Query
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.users.getAll(),
  })
}

// Usage
function UserList() {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>
}

// Mutation
export function useCreateUser() {
  return useMutation({
    mutationFn: (data: ICreateUserData) => api.users.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

---

### BaseService Pattern

```typescript
// services/base.ts
import type { AxiosRequestConfig } from 'axios'
import Axios from '@/libs/axios'
import type { IBaseResponse } from '@/types'

export default class BaseService {
  protected static async _post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const res = await Axios.post<IBaseResponse>(url, data, config)
      const { ok, result, error } = res.data

      if (!ok) {
        return Promise.reject(error)
      }

      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  protected static async _get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const res = await Axios.get<IBaseResponse>(url, config)
      const { ok, result, error } = res.data

      if (!ok) {
        return Promise.reject(error)
      }

      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
```

```typescript
// services/user.ts
import BaseService from './base'
import type { IUser, ICreateUserData } from '@/types'

export class UserService extends BaseService {
  static async getAll(): Promise<IUser[]> {
    return this._get<IUser[]>('/users')
  }

  static async create(data: ICreateUserData): Promise<IUser> {
    return this._post<IUser>('/users', data)
  }
}
```

---

## Error Handling

### ErrorCode Enum Pattern

**1. Define error codes:**
```typescript
// enums/error.ts
export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  // ... add more as needed
}
```

**2. Define error messages (with i18n):**
```typescript
// constants/error.ts
import { ErrorCode } from '@/enums/error'
import { msg } from '@lingui/macro'

export const ERROR_CODE_MESSAGE = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: msg`Something went wrong`,
  [ErrorCode.UNKNOWN]: msg`Unknown error occurred`,
  [ErrorCode.UNAUTHORIZED]: msg`Unauthorized access`,
  [ErrorCode.USER_NOT_FOUND]: msg`User not found`,
  [ErrorCode.USER_ALREADY_EXISTS]: msg`User already exists`,
  [ErrorCode.VALIDATION_ERROR]: msg`Validation error`,
}
```

**3. Create error handling hook:**
```typescript
// hooks/use-fetch-error.ts
import { useLingui } from '@lingui/react'
import { ERROR_CODE_MESSAGE } from '@/constants/error'
import { ErrorCode } from '@/enums/error'
import usePopup from './use-popup'

export const useFetchError = () => {
  const { t } = useLingui() // ✅ Use 't', not '_'
  const { message } = usePopup()

  const getErrorCode = (error: any): ErrorCode => {
    let errorCode = ErrorCode.UNKNOWN

    // If error has code and it exists in our enum, use it
    if (Object.values(ErrorCode).includes(error?.code)) {
      errorCode = error.code
    }

    return errorCode
  }

  const getErrorMessage = (error: any): { code: ErrorCode; message: string } => {
    const errorCode = getErrorCode(error)

    // If unknown error but has custom message, use it
    if (errorCode === ErrorCode.UNKNOWN && Boolean(error?.message)) {
      return {
        code: errorCode,
        message: error.message ?? 'No error message set',
      }
    }

    // Otherwise use predefined message
    return {
      code: errorCode,
      message: t(ERROR_CODE_MESSAGE[errorCode]), // ✅ Use t()
    }
  }

  const showErrorMessage = (error: any): void => {
    message.error(getErrorMessage(error).message)
  }

  return {
    getErrorCode,
    getErrorMessage,
    showErrorMessage,
  }
}
```

**4. Usage in components:**
```tsx
import { useFetchError } from '@/hooks/use-fetch-error'

export function UserList() {
  const { data, error } = useUsers()
  const { showErrorMessage } = useFetchError()

  useEffect(() => {
    if (error) {
      showErrorMessage(error)
    }
  }, [error])

  // ... rest of component
}
```

---

## Internationalization (i18n)

### Lingui 5.5.0 Setup

> **Note:** Using Lingui 5.5.0 (latest as of Sep 2025) with macro-first approach and `t` function (replaces legacy `_`).

**Requirements:**
- Node 20.19+ or 22.12+ (for Vite 7 compatibility)
- React 19.x
- Vite 7.x

**Install packages:**
```bash
bun add @lingui/react @lingui/macro
bun add -d @lingui/cli @lingui/vite-plugin
```

**Vite config:**
```typescript
// vite.config.ts
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    lingui(), // Place before React Compiler if using
    // ... other plugins
  ],
})
```

**Lingui config:**
```typescript
// lingui.config.ts
import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  locales: ['en', 'th'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  // Recommended: Fail builds if translations are missing
  failOnMissing: true,
}

export default config
```

---

### Translation Pattern (Using `t` from `useLingui`)

> **Important:** Lingui 5.x uses `t` function (not `_`). Always use `const { t } = useLingui()` as the primary pattern.

**Standard pattern (ใช้เป็นหลัก):**
```tsx
import { useLingui } from '@lingui/react'
import { msg } from '@lingui/macro'

export function MyComponent() {
  const { t } = useLingui() // ✅ Use this pattern

  // Static strings - just msg
  const label = t(msg`Select language`)

  // Dynamic values - msg with variables
  const greeting = t(msg`Hello, {name}`, { name: userName })

  return <div>{greeting}</div>
}
```

**1. Define messages with msg:**
```typescript
// constants/error.ts
import { msg } from '@lingui/macro'
import { ErrorCode } from '@/enums/error'

export const ERROR_CODE_MESSAGE = {
  [ErrorCode.USER_NOT_FOUND]: msg`User not found`,
  [ErrorCode.UNAUTHORIZED]: msg`Unauthorized access`,
  [ErrorCode.VALIDATION_ERROR]: msg`Validation error`,
}
```

**2. Use in components:**
```tsx
import { useLingui } from '@lingui/react'
import { Trans, msg } from '@lingui/macro'

export function WelcomeMessage() {
  const { t } = useLingui() // ✅ Primary pattern

  return (
    <div>
      {/* Static translation with Trans component */}
      <h1><Trans>Welcome to our app</Trans></h1>

      {/* Static translation with t() + msg */}
      <h2>{t(msg`Welcome to our app`)}</h2>

      {/* Dynamic translation with variables */}
      <p>{t(msg`Hello, {name}`, { name: user.name })}</p>

      {/* Trans with variables */}
      <Trans>You have {count} new messages</Trans>
    </div>
  )
}
```

**3. Use with error messages:**
```typescript
// hooks/use-fetch-error.ts
import { useLingui } from '@lingui/react'
import { ERROR_CODE_MESSAGE } from '@/constants/error'

export const useFetchError = () => {
  const { t } = useLingui() // ✅ Use 't', not '_'

  const getErrorMessage = (error: any) => {
    const errorCode = getErrorCode(error)
    return {
      code: errorCode,
      message: t(ERROR_CODE_MESSAGE[errorCode]), // ✅ Translate with t()
    }
  }

  return { getErrorMessage }
}
```

**4. Placeholder helpers (Lingui 5.2+):**
```tsx
import { useLingui } from '@lingui/react'
import { msg, ph } from '@lingui/macro'

function UserProfile({ user }: IUserProfileProps) {
  const { t } = useLingui()

  // Better translator context for dynamic values
  const welcomeMsg = msg`Welcome back, ${ph('userName', 'User name')}!`
  const dateMsg = msg`Last login: ${ph('lastLogin', 'Date of last login')}`

  return (
    <div>
      <h1>{t(welcomeMsg, { userName: user.name })}</h1>
      <p>{t(dateMsg, { lastLogin: formatDate(user.lastLogin) })}</p>
    </div>
  )
}
```

---

### Setup i18n Provider

**1. Create i18n instance:**
```typescript
// lib/i18n.ts
import { i18n } from '@lingui/core'
import { messages as enMessages } from '@/locales/en/messages'
import { messages as thMessages } from '@/locales/th/messages'

i18n.load({
  en: enMessages,
  th: thMessages,
})

i18n.activate('en') // Default locale

export { i18n }
```

**2. Wrap app with provider:**
```tsx
// app/root.tsx
import { I18nProvider } from '@lingui/react'
import { i18n } from '@/lib/i18n'

export default function Root() {
  return (
    <I18nProvider i18n={i18n}>
      <Outlet />
    </I18nProvider>
  )
}
```

---

### Workflow

**1. Extract messages (with optional flags):**
```bash
# Basic extraction
bun lingui extract

# Strict mode - fail if untranslated strings found (Lingui 5.3+)
bun lingui extract --strict

# Use multiple workers for large codebases (Lingui 5.5+)
bun lingui extract --workers 4
```

**2. Translate in locale files:**
```typescript
// locales/th/messages.ts
export const messages = {
  'Welcome to our app': 'ยินดีต้อนรับสู่แอปของเรา',
  'User not found': 'ไม่พบผู้ใช้',
  'Unauthorized access': 'การเข้าถึงไม่ได้รับอนุญาต',
}
```

**3. Compile messages:**
```bash
# Basic compilation
bun lingui compile

# Strict mode - fail on missing translations
bun lingui compile --strict
```

**4. Add to package.json:**
```json
{
  "scripts": {
    "i18n:extract": "lingui extract --workers 4",
    "i18n:compile": "lingui compile --strict",
    "i18n:check": "lingui extract --strict && lingui compile --strict"
  }
}
```

**5. CI/CD Integration:**
```bash
# Fail build if translations are incomplete
bun run i18n:check
```

---

### Language Switcher

```tsx
// components/language-switcher.tsx
import { useLingui } from '@lingui/react'
import { msg } from '@lingui/macro'
import { i18n } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { t } = useLingui() // ✅ Standard pattern

  const changeLanguage = (locale: string) => {
    i18n.activate(locale)
    // Optional: save to localStorage
    localStorage.setItem('locale', locale)
  }

  return (
    <select
      value={i18n.locale}
      onChange={(e) => changeLanguage(e.target.value)}
      aria-label={t(msg`Select language`)} // ✅ t(msg`...`)
    >
      <option value="en">English</option>
      <option value="th">ไทย</option>
    </select>
  )
}
```

---

### Best Practices

**DO:**
- ✅ Use `t()` function for dynamic strings (not `_()`)
- ✅ Use `msg` macro for message descriptors
- ✅ Keep message keys in English (source locale)
- ✅ Use `Trans` component for JSX content
- ✅ Enable `failOnMissing` in config for production
- ✅ Use `--strict` flag in CI/CD
- ✅ Use `ph()` helper for better translator context (Lingui 5.2+)
- ✅ Extract and compile before production
- ✅ Use `--workers` flag for large codebases

**DON'T:**
- ❌ Don't use `_()` (legacy pattern, use `t()` instead)
- ❌ Don't hardcode strings in components
- ❌ Don't translate programmatically without `t()`
- ❌ Don't forget to run `lingui extract`
- ❌ Don't commit untranslated messages
- ❌ Don't skip `--strict` checks in CI

**Example of good practice:**
```tsx
import { useLingui } from '@lingui/react'
import { Trans, msg, ph } from '@lingui/macro'

function MyComponent({ userName }: IMyComponentProps) {
  const { t } = useLingui() // ✅ Standard pattern

  // ✅ Good - JSX content with Trans
  return <Trans>Welcome, {userName}!</Trans>

  // ✅ Good - Static translation
  const greeting = t(msg`Welcome!`)
  const label = t(msg`Select language`)

  // ✅ Good - Dynamic translation
  const greeting = t(msg`Welcome, {name}!`, { name: userName })

  // ✅ Good - With placeholder helpers
  const greeting = t(msg`Welcome, ${ph('userName', 'User name')}!`, { userName })

  // ❌ Bad - Hardcoded string
  return <div>Welcome, {userName}!</div>

  // ❌ Bad - Using legacy '_' function
  const { _ } = useLingui()
  const greeting = _(msg`Welcome!`)
}
```

---

### React 19 Compatibility Notes

Lingui 5.x is fully compatible with React 19's new features:

- **Actions & useOptimistic:** Localized form validation and optimistic UI updates
- **Server Components (RSC):** Server-side i18n with request-scoped `I18n` instances
- **Streaming SSR:** Locale-specific bundles with dynamic imports

**Example with React 19 Actions:**
```tsx
import { useLingui } from '@lingui/react'
import { Trans, msg } from '@lingui/macro'

export function LoginForm() {
  const { t } = useLingui()

  async function loginAction(formData: FormData) {
    'use server'
    // Server-side validation with localized errors
    const email = formData.get('email')
    if (!email) {
      return { error: t(msg`Email is required`) }
    }
    // ... login logic
  }

  return (
    <form action={loginAction}>
      <input
        name="email"
        placeholder={t(msg`Enter email`)}
      />
      <button type="submit">
        <Trans>Login</Trans>
      </button>
    </form>
  )
}
```

---

## Code Style & Tooling

### Biome (Not ESLint + Prettier)

**Install:**
```bash
bun add -d @biomejs/biome
```

**Configuration:** `biome.json`
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 120
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "all"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "correctness": {
        "noUnusedVariables": "warn",
        "noUnusedImports": "warn"
      },
      "style": {
        "useImportType": "warn",
        "useExportType": "warn"
      }
    }
  }
}
```

**Scripts in package.json:**
```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

---

### Code Style Rules

**From biome.json:**
- **Quotes:** Single quotes `'`
- **Semicolons:** As needed (automatic)
- **Trailing commas:** Always
- **Line width:** 120 characters
- **Indent:** 2 spaces

**Examples:**
```tsx
// ✅ Correct
import { useState } from 'react'
import type { IUser } from '@/types'

export function UserCard({ user, onClick }: IUserCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="p-4 rounded"
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
    >
      {user.name}
    </div>
  )
}

// ❌ Wrong (double quotes, unnecessary semicolons)
import { useState } from "react";
import { IUser } from "@/types";

export function UserCard({ user, onClick }: IUserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4 rounded" onClick={onClick}>
      {user.name}
    </div>
  );
}
```

---

## File Organization

### Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input/
│   │   │       ├── index.tsx
│   │   │       ├── InputNumber.tsx
│   │   │       └── InputPassword.tsx
│   │   ├── features/           # Feature-specific components
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   └── layouts/            # Layout components
│   │       ├── MainLayout.tsx
│   │       └── AuthLayout.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-fetch-error.ts
│   │   └── use-popup.ts
│   ├── lib/                    # Utilities
│   │   ├── utils.ts            # cn, formatDate, etc.
│   │   └── axios.ts
│   ├── services/               # API services
│   │   ├── base.ts
│   │   ├── user.ts
│   │   └── auth.ts
│   ├── stores/                 # Zustand stores
│   │   ├── auth.ts
│   │   └── settings.ts
│   ├── types/                  # TypeScript types
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   ├── enums/                  # Enums
│   │   └── error.ts
│   ├── constants/              # Constants
│   │   ├── error.ts
│   │   ├── routes.ts
│   │   └── config.ts
│   ├── routes/                 # Route components
│   │   ├── home.tsx
│   │   ├── dashboard.tsx
│   │   └── login.tsx
│   └── app.css                 # Global styles
├── public/                     # Static assets
├── docs/                       # Documentation
│   └── BEST_PRACTICES.md       # This file
├── react-router.config.ts      # RR config (ssr: false)
├── vite.config.ts              # Vite config
├── biome.json                  # Biome config
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## Performance

### React 19 Optimizations

**1. Use React Compiler (if available):**
- React 19 has built-in compiler optimizations
- Less need for manual `useMemo`/`useCallback`

**2. Lazy load routes:**
```tsx
import { lazy } from 'react'

const Dashboard = lazy(() => import('./routes/dashboard'))
```

**3. Use `use` hook for async data:**
```tsx
import { use } from 'react'

function UserProfile({ userPromise }) {
  const user = use(userPromise)
  return <div>{user.name}</div>
}
```

**4. Optimize images:**
```tsx
<img
  src="/image.jpg"
  loading="lazy"
  decoding="async"
  alt="Description"
/>
```

---

## Anti-Patterns

### ❌ DON'T

**1. Don't use `any` type:**
```tsx
// ❌ Bad
function handleData(data: any) { ... }

// ✅ Good
function handleData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // type narrowing
  }
}
```

**2. Don't mutate state directly:**
```tsx
// ❌ Bad
const [users, setUsers] = useState([])
users.push(newUser) // mutation!

// ✅ Good
setUsers([...users, newUser])
```

**3. Don't forget cleanup in useEffect:**
```tsx
// ❌ Bad
useEffect(() => {
  const interval = setInterval(() => { ... }, 1000)
  // no cleanup!
}, [])

// ✅ Good
useEffect(() => {
  const interval = setInterval(() => { ... }, 1000)
  return () => clearInterval(interval)
}, [])
```

**4. Don't use index as key:**
```tsx
// ❌ Bad
{items.map((item, i) => <li key={i}>{item}</li>)}

// ✅ Good
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

**5. Don't skip React Hook Form for forms:**
```tsx
// ❌ Bad (manual state for every field)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [errors, setErrors] = useState({})

// ✅ Good
const { register, handleSubmit } = useForm()
```

**6. Don't use React.FC:**
```tsx
// ❌ Bad
export const Button: React.FC<IButtonProps> = ({ children }) => { ... }

// ✅ Good
export function Button({ children }: IButtonProps) { ... }
```

**7. Don't mix naming conventions:**
```tsx
// ❌ Bad (inconsistent)
interface ButtonProps { ... }
interface ICardProps { ... }

// ✅ Good (consistent)
interface IButtonProps { ... }
interface ICardProps { ... }
```

---

## Quick Reference

### Checklist for New Components

- [ ] Use function component (not React.FC)
- [ ] Props interface has `I` prefix
- [ ] Use `import type` for type imports
- [ ] Use `cn` utility for dynamic classes
- [ ] Add proper TypeScript types (no `any`)
- [ ] Handle loading/error states
- [ ] Add proper key props in lists
- [ ] Clean up side effects in useEffect
- [ ] Follow Biome formatting rules

### Checklist for New Features

- [ ] Create Zod schema for forms
- [ ] Use React Hook Form
- [ ] Create service in `services/`
- [ ] Use TanStack Query for API calls
- [ ] Add error codes to enum
- [ ] Add error messages to constants
- [ ] Use `useFetchError` hook
- [ ] Update types in `types/`
- [ ] Test in browser
- [ ] Run `bun run lint:fix`

---

## Resources

- [React 19 Docs](https://react.dev)
- [React Router v7 Docs](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Lingui (i18n)](https://lingui.dev)
- [Biome](https://biomejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

---

**Last Updated:** 2025-10-06
**Maintained by:** Frontend Team
