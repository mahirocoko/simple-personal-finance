# Claude-Codex Orchestrator/Worker Architecture

## 📖 Document Map

| What You Need | Go To |
| --- | --- |
| **Quick start with shortcodes** (ccc, nnn, gogogo, rrr, lll) | [Communication Protocol](#communication-protocol) |
| **Complete project overview** (directory layout, all scripts, workflows) | [Project Structure](#project-structure) |
| **Git commit standards** (conventional commits, emoji guide) | [Git Commit Guide](#git-commit-guide) |
| **Core script usage** (codex-exec, codex-research, codex-worker-launcher) | [Helper Scripts](#helper-scripts) |
| **Frontend best practices** (React 19, TypeScript, patterns) | [Frontend Best Practices](#frontend-best-practices) |
| **shadcn/ui component library** (comprehensive guide, migration, patterns) | [shadcn/ui Component Library](#shadcn-ui-component-library) |
| **Design system** (OKLCH tokens, themes, accessibility) | [Design System](#design-system) |
| **Example workflows** (quick tasks, research, parallel workers, pipelines) | [Examples Library](#examples-library) |
| **Report templates** (research, worker tasks, code reviews) | [Templates Library](#templates-library) |
| **Utility tools** (status dashboard, cleanup, maintenance) | [Utility Scripts](#utility-scripts) |

## 🔴 Critical Safety Notice
**All helper scripts invoke `codex exec` with `danger-full-access`, granting unrestricted system permissions.**
- Run only inside isolated development environments that you control.
- Keep secrets, credentials, and private data out of scope for any Codex job.
- Consider adding allowlists or permission guards before sharing these scripts with others.
- Inspect everything Codex writes under `.mahirolab/**` in case unexpected files or code appear.

## Core Idea: Direct Process Execution
Replacing `tmux send-keys` with direct `codex exec` calls makes automation faster, more reliable, and easier to integrate with tooling.
- No terminal emulation latency or timing hacks.
- Clean access to stdout/stderr plus exit codes for precise scripting.
- Natural fit for CI/CD pipelines or higher-level orchestrators.

### Baseline `codex exec` Usage
```bash
# Run directly with an explicit reasoning level
codex exec -s danger-full-access -c model_reasoning_effort="low" "Describe the task here"

# Examples
codex exec -s danger-full-access -c model_reasoning_effort="high" "Refactor the API to use TypeScript interfaces"
codex exec -s danger-full-access -c model_reasoning_effort="low" "List all files in src/"
```

### Reasoning Level Cheat Sheet (approximate runtimes)
- `minimal` – fastest (~5-10s) for trivial tasks.
- `low` – balanced speed and depth (~10-15s).
- `medium` – default choice for moderate complexity (~15-25s).
- `high` – deepest reasoning for large refactors or analyses (~30-60s+).

## Architecture Overview
Three bash wrappers tailor `codex exec` to complementary workflows:
1. **Direct execution** for immediate, synchronous tasks.
2. **Research mode** that enables web search and enforces a structured report.
3. **Background workers** that keep long jobs running while persisting logs with process identifiers.

## Helper Scripts

All scripts located in `.mahirolab/bin/`

### `codex-exec.sh`
- **Role:** Thin wrapper for on-demand, synchronous commands.
- **Usage:** `.mahirolab/bin/codex-exec.sh [reasoning_level] "task"` (single argument defaults to `low`).
- **New Features:**
  - `--dry-run` / `-d` - Preview command without executing
  - `--help` / `-h` - Comprehensive help with examples
  - `--version` / `-v` - Show version information
- **Behavior:** Prints colorized status, forwards the prompt to `codex exec`, and always enables `danger-full-access`.
- **Output:** Streams stdout/stderr to the console without saving files—ideal for quick experiments you want to supervise manually.
- **Ad-hoc backgrounding:** Append `&` to launch in the background (for example, `./codex-exec.sh high "Analyze large dataset" &`) and manage the job yourself with `jobs`, `wait`, or `tail`.

### `codex-research.sh`
- **Role:** Research assistant that turns on the `web_search` tool and captures results.
- **Usage:** `./codex-research.sh "research topic"` (required argument).
- **Behavior:**
  - Sanitizes the topic into a slug, prepends a timestamp, and ensures `.mahirolab/research/` exists.
  - Supplies a fixed prompt template enforcing sections such as Executive Summary and Key Findings, plus plain-URL citations.
  - Forces `model_reasoning_effort="medium"` and runs with `danger-full-access`.
- **Output:** Markdown report saved once Codex honors the `Save output to:` instruction (the agent replaces `PLACEHOLDER` with its own PID).
- **Follow-up:** Review the generated file in `.mahirolab/research/` to validate citations, section order, and completeness before sharing.

### `codex-worker-launcher.sh`
- **Role:** Background orchestrator that embeds the originating Bash PID in the final filename.
- **Usage:**
  - Full form: `./codex-worker-launcher.sh [reasoning_level] [output_type] "task"`.
  - Shorthand: `./codex-worker-launcher.sh "task"` (defaults to `low` reasoning and `workers` output type).
- **Behavior:**
  - Creates a timestamped temp file under `.mahirolab/<output_type>/`.
  - Spawns `codex exec` in a subshell, captures the Bash PID, and waits for the agent to write the temp file.
  - Renames the file to `<timestamp>_<bashpid>_codex_task.md` for traceability once writing finishes.
- **Suggested monitoring pattern:**
  1. Launch the worker and note the printed Bash PID.
  2. Avoid polling until a user or downstream system requests results.
  3. When prompted, open or tail the persisted file to inspect progress or the final log.
  4. Optionally verify the exit code to confirm success vs. failure.
- **Best fit:** Medium/high reasoning jobs, long analyses, and orchestrations that require stable filenames for later automation.

## Workflow Patterns
- **Quick fixes / short edits:** Run `codex-exec.sh` synchronously.
- **Research with citations:** Use `codex-research.sh` and review the generated Markdown report.
- **Long-running or parallel jobs:** Prefer `codex-worker-launcher.sh` so each worker produces a timestamped log tagged with a PID.
- **Parallel execution:** Launch multiple Codex runs (`codex exec ... &` or several worker launchers) and `wait` for completion when you need synchronization.
- **Manual background management:** If you background `codex exec` or `codex-exec.sh` directly, record the job ID and only check in when required to avoid unnecessary polling.

## Best Practices & Safety Checklist
- Match reasoning effort to task size: keep `minimal/low` tasks in the foreground, consider backgrounding for `medium`, and default to backgrounding for `high`.
- After starting any background job, pause monitoring until someone explicitly asks for status to reduce noise and resource churn.
- Inspect exit codes for every completed job (0 = success, non-zero = failure) and review diffs before committing file changes.
- Scope Codex's accessible directories wherever possible, especially for sensitive repositories.
- Treat all generated artifacts as untrusted until you audit them.

## Verified Capabilities
- ✅ Non-interactive `codex exec` flows
- ✅ Automated code modifications (including git patches)
- ✅ Unit tests, API endpoints, and large-scale refactors
- ✅ Structured research reports with plain-URL citations
- ✅ Parallel or long-running workers with PID-tagged logs

## Utility Scripts

### `codex-status.sh` - Job Dashboard
**Role:** Job monitoring dashboard for all Codex tasks

**Features:**
- View all running and completed jobs
- Filter by type (workers, research)
- Show statistics (file count, disk usage)
- Display job age and size information

**Usage:**
```bash
./codex-status.sh              # Recent jobs
./codex-status.sh --stats      # Statistics
./codex-status.sh --workers    # Workers only
./codex-status.sh --latest 20  # Last 20 jobs
```

**When to Use:**
- Check job progress
- View completed tasks
- Monitor disk usage
- Debug job issues

### `codex-cleanup.sh` - Maintenance Utility
**Role:** Automated cleanup and storage management

**Features:**
- Delete old files (default: 7+ days)
- Compress aging files (3+ days)
- Storage statistics
- Dry-run mode
- Force mode (skip confirmation)

**Usage:**
```bash
./codex-cleanup.sh --dry-run   # Preview cleanup
./codex-cleanup.sh --stats     # Show disk usage
./codex-cleanup.sh --age 14    # Delete 14+ days old
./codex-cleanup.sh --force     # No confirmation
```

**When to Use:**
- Regular maintenance
- Low disk space
- Archive old reports
- Clean up experiments

## Examples Library

Pre-built workflow examples in `.mahirolab/examples/`:

| Example | Description | Runtime |
|---------|-------------|---------|
| **01-quick-task.sh** | Basic synchronous execution | < 1 min |
| **02-research-workflow.sh** | Multiple research tasks | 3-5 min |
| **03-parallel-workers.sh** | Concurrent background jobs | Varies |
| **04-mixed-reasoning-levels.sh** | Reasoning strategy demo | 2-3 min |
| **05-sequential-pipeline.sh** | Chained dependent tasks | 5-10 min |

All examples are:
- ✅ Executable bash scripts
- ✅ Well-documented
- ✅ Include tips & best practices
- ✅ Self-contained

### Quick Start with Examples
```bash
# Test basic functionality
./examples/01-quick-task.sh

# Try research workflow
./examples/02-research-workflow.sh

# Run parallel workers
./examples/03-parallel-workers.sh
```

## Templates Library

Markdown templates for consistent outputs in `.mahirolab/templates/`:

### `research-report.md`
- Executive Summary
- Key Findings
- Technical Specifications
- References (direct URLs)
- Recommendations

### `worker-task.md`
- Task Summary
- Execution Details
- Files Modified/Created
- Code Changes
- Testing Results
- Next Steps

### `code-review.md`
- Overview & Rating
- Critical/Moderate/Minor Issues
- Code Quality Metrics
- Security Analysis
- Performance Analysis
- Action Items

Templates include:
- Consistent formatting
- Placeholder variables (`{{TOPIC}}`, `{{DATE}}`, etc.)
- Section guidelines
- Example content

### Using Templates
```bash
# Research reports are auto-generated by codex-research.sh
./codex-research.sh "Your research topic"

# Worker tasks use template structure
./codex-worker-launcher.sh "Your task description"

# Manual template usage
cp templates/research-report.md my-report.md
# Edit placeholder variables
```

## Configuration System

### `codex.yaml` (Reference Only)
Currently not actively used by scripts. Scripts use hardcoded defaults:

```yaml
default_reasoning: low
output_dir: .mahirolab
auto_cleanup:
  max_age_days: 7
workers:
  max_parallel: 3
  timeout_seconds: 600
```

**To customize:** Edit individual script variables directly.

## Reasoning Levels Guide

| Level | Time | Best For | Example Use Cases |
|-------|------|----------|-------------------|
| **minimal** | 5-10s | Trivial tasks | File listing, simple searches |
| **low** | 10-15s | Simple edits | Add comments, simple refactors |
| **medium** | 15-25s | Moderate tasks | API design, moderate analysis |
| **high** | 30-60s+ | Complex analysis | Architecture review, deep refactoring |

**Rule of thumb:**
- Start with `low` for unknown tasks
- Use `minimal` for batch operations
- Reserve `high` for critical thinking

## File Naming Conventions

### Research Reports
```
.mahirolab/research/YYYYMMDD_HHMMSS_PLACEHOLDER_codex_topic_name.md
                    └─timestamp─┘ └─PID─┘        └─sanitized topic─┘
```

### Worker Tasks
```
.mahirolab/workers/YYYYMMDD_HHMMSS_12345_codex_task.md
                   └─timestamp─┘ └─PID┘
```

### State Files
```
.mahirolab/state/plan_YYYYMMDD_HHMMSS.md
.mahirolab/state/retrospective_YYYYMMDD.md
```

## Maintenance & Hardening

### ✅ Completed
- ✅ Job monitoring dashboard (`codex-status.sh`)
- ✅ Log rotation and cleanup utility (`codex-cleanup.sh`)
- ✅ Dry-run mode for codex-exec.sh
- ✅ Comprehensive help and examples
- ✅ Communication protocol with shortcodes
- ✅ State management system (`.mahirolab/state/`)
- ✅ Frontend best practices documentation
- ✅ Design system with shadcn/ui integration
- ✅ Git commit standards with emoji requirements

### 💡 Future Ideas
- Template integration with research/worker scripts
- Pipeline orchestration (YAML-based workflows)
- Retry logic with exponential backoff
- Configuration loader for codex.yaml
- Web UI for job monitoring
- Metrics and analytics dashboard

## Getting Started

### 1. Quick Test
```bash
# Test all core scripts
./codex-exec.sh --version
./codex-research.sh --help
./codex-worker-launcher.sh --help
```

### 2. Run First Example
```bash
./examples/01-quick-task.sh
```

### 3. Start Using Shortcodes
```bash
# In your conversation with Claude
User: lll    # See current status
User: ccc    # Start session with context
```

### 4. Read Documentation
- Main: This file (`CLAUDE.md`)
- Protocol: [Communication Protocol](#communication-protocol)
- Project: [Project Structure](#project-structure)
- Frontend: [Frontend Best Practices](#frontend-best-practices)
- Design: [Design System](#design-system)

---

## Communication Protocol

### Core Shortcodes

For efficient collaboration between User and Claude, use these shortcodes:

#### `ccc` - Create Context & Compact
**Purpose:** สรุปและบีบอัด conversation ปัจจุบัน

**Claude Action:**
1. วิเคราะห์ conversation ที่ผ่านมา
2. สรุปประเด็นสำคัญ (เป้าหมายหลัก, สิ่งที่ทำไปแล้ว, การตัดสินใจที่สำคัญ)
3. สร้าง context file: `.mahirolab/state/context.md`
4. แสดง summary กลับมาให้ user ดู

**When to Use:** เริ่มต้น session ใหม่, ก่อนจะวาง plan, เมื่อ conversation ยาวเกินไป

#### `nnn` - Smart Planning
**Purpose:** สร้าง implementation plan แบบละเอียด

**Claude Action:**
1. ตรวจสอบว่ามี context ล่าสุดหรือไม่ (อายุ < 1 ชั่วโมง)
   - ถ้าไม่มีหรือเก่า → รัน `ccc` ก่อนอัตโนมัติ
2. อ่าน `.mahirolab/state/context.md`
3. สร้าง detailed plan: `.mahirolab/state/plan_YYYYMMDD_HHMMSS.md`
4. แสดง plan overview

**When to Use:** เมื่อต้องการแผนงานที่ชัดเจน, ก่อนเริ่มงานใหญ่ๆ

#### `gogogo` - Execute Plan
**Purpose:** เริ่มดำเนินการตาม plan ล่าสุด

**Claude Action:**
1. อ่าน plan ล่าสุดจาก `.mahirolab/state/`
2. ถามยืนยันก่อนเริ่ม (ถ้า user ไม่ได้บอกให้ skip)
3. Execute tasks ทีละ step:
   - แสดง task ที่กำลังทำ
   - ทำงานตาม specification
   - Update progress ใน `.mahirolab/state/progress.md`
   - ถามก่อนไป step ถัดไปถ้าเป็น critical task
4. Report หลังจบแต่ละ phase

**When to Use:** เมื่อพร้อมจะเริ่มทำตาม plan, เมื่ออยากให้ Claude ทำแบบ autonomous

#### `rrr` - Retrospective
**Purpose:** สร้าง session retrospective

**Claude Action:**
1. อ่าน context, plan, progress, และ conversation history
2. วิเคราะห์และสร้าง retrospective
3. บันทึกลง `.mahirolab/state/retrospective_YYYYMMDD.md`

**When to Use:** จบ session, จบ milestone ใหญ่, ทุกสัปดาห์ (weekly retro)

#### `lll` - List Project Status
**Purpose:** แสดงภาพรวมสถานะโปรเจกต์

**Claude Action:**
1. แสดงข้อมูลจากหลายแหล่ง:
   - Current context (ถ้ามี)
   - Active plan (ถ้ามี)
   - Recent progress
   - Git status
   - Recent codex jobs
   - File structure changes

**When to Use:** เริ่มต้น session เพื่อดูว่าค้างอะไรไว้, Check progress ระหว่างทำงาน

### State Management

**Directory Structure:**
```
.mahirolab/state/
├── context.md              # Current session context
├── plan_YYYYMMDD_HHMMSS.md # Implementation plans
├── progress.md             # Execution progress tracking
├── execution_log.md        # Detailed execution log
└── retrospective_YYYYMMDD.md # Session retrospectives
```

**Typical Workflow:**
```bash
Session Start:
  User: lll                    # Check status
  Claude: [shows dashboard]

  User: ccc                    # Create context
  Claude: [creates context.md, shows summary]

  User: nnn                    # Create plan
  Claude: [creates plan, shows overview]

  User: gogogo                 # Execute
  Claude: [executes step-by-step]

Session End:
  User: rrr                    # Retrospective
  Claude: [creates retrospective]
```

## Project Structure

### Directory Layout

```
my-ai/
├── 📜 Core Scripts (3)
│   ├── codex-exec.sh              # Direct synchronous execution
│   ├── codex-research.sh          # Web-enabled research
│   └── codex-worker-launcher.sh   # Background workers with PID tracking
│
├── 🛠️ Utility Scripts (2)
│   ├── codex-status.sh            # Job monitoring dashboard
│   └── codex-cleanup.sh           # Automated cleanup & maintenance
│
├── 📖 Documentation
│   ├── CLAUDE.md                  # Main architecture documentation
│   ├── docs/
│   │   ├── SHORTCODES.md          # Communication protocol
│   │   ├── PROJECT_STRUCTURE.md   # This file
│   │   ├── COMMIT_GUIDE.md        # Git commit standards
│   │   ├── DESIGN_SYSTEM.md       # UI/UX design system
│   │   └── FRONTEND_BEST_PRACTICES.md # Frontend development guide
│   └── .gitignore                 # Git ignore rules
│
├── ⚙️ Configuration
│   └── codex.yaml                 # Reference config (not actively used)
│
├── 📚 Examples
│   └── examples/
│       ├── 01-quick-task.sh       # Basic synchronous execution
│       ├── 02-research-workflow.sh # Web-enabled research
│       ├── 03-parallel-workers.sh # Concurrent background tasks
│       ├── 04-mixed-reasoning-levels.sh # Reasoning strategy guide
│       ├── 05-sequential-pipeline.sh # Chained dependent tasks
│       └── README.md              # Examples documentation
│
├── 📄 Templates
│   └── templates/
│       ├── research-report.md     # Structured research output
│       ├── worker-task.md         # Background task reports
│       ├── code-review.md         # Comprehensive code reviews
│       └── README.md              # Templates documentation
│
└── 💾 Runtime Data (Generated)
    └── .mahirolab/
        ├── workers/               # Worker job outputs
        ├── research/              # Research reports
        └── state/                 # Communication protocol state
            ├── context.md         # Session context (ccc)
            ├── plan_*.md          # Implementation plans (nnn)
            ├── progress.md        # Execution progress (gogogo)
            └── retrospective_*.md # Session retrospectives (rrr)
```

## Git Commit Guide

### Commit Message Format

```
<type>: <subject>

<optional body>

<optional footer>
```

**Important:** This project **REQUIRES emojis** for better visual representation and team consistency.

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Subject Line Rules

- **Length Requirements**: 8-60 characters
- **No scope**: Don't use `type(scope):` format
- **No period**: Don't end with a period
- **Required emoji**: All commits must have emojis

### Valid Examples

```bash
# ✅ Good examples (with required emojis)
feat: 🎉 add user authentication system
fix: 🐛 resolve cart calculation error
docs: 📝 update installation instructions
style: 💄 format code with prettier
refactor: ♻️ simplify product filter logic
perf: ⚡ optimize image loading performance
test: ✅ add unit tests for auth service
build: 📦 update webpack configuration
ci: 👷 add automated deployment workflow
chore: 🔧 update dependencies
revert: ⏪ revert authentication changes
```

### Emoji Usage (Required)

- 🎉 **feat**: New feature
- 🐛 **fix**: Bug fix
- 📝 **docs**: Documentation
- 💄 **style**: Styling
- ♻️ **refactor**: Refactoring
- ⚡ **perf**: Performance
- ✅ **test**: Tests
- 📦 **build**: Build system
- 👷 **ci**: CI/CD
- 🔧 **chore**: Maintenance
- ⏪ **revert**: Revert

## Frontend Best Practices

### Technology Stack

- **React 19** - Latest React with new features
- **React Router v7 (SPA)** - Single Page Application mode
- **TypeScript** - Type safety
- **Bun** - Package manager and runtime
- **Biome** - Linting and formatting
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lingui 5.5** - Internationalization

### Component Patterns

#### Function Components (No React.FC)
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

#### Props Interface Naming
✅ **ALWAYS use `I` prefix for interfaces:**
```tsx
interface IButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button(props: IButtonProps) { ... }
```

#### File Naming Convention
**Simple components → Single file with kebab-case:**
```
components/ui/
  button.tsx           # ✅ Correct
  card.tsx             # ✅ Correct
  error-message.tsx    # ✅ Correct
```

**Complex components with variants → Folder with PascalCase:**
```
components/
  Input/               # Folder uses PascalCase
    index.tsx          # Main component
    InputNumber.tsx    # Variant uses PascalCase
    InputPassword.tsx  # Variant uses PascalCase
```

### TypeScript Conventions

#### Type vs Interface
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

#### Import Types
✅ **ALWAYS use `import type` for type-only imports:**
```tsx
import type { AxiosRequestConfig } from 'axios'
import type { IUser } from '@/types'
```

### Styling with Tailwind CSS

#### cn Utility Function
```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Dynamic Classes
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

### Forms & Validation

#### React Hook Form + Zod
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

### Code Style (Biome)

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
  }
}
```

## shadcn/ui Component Library

**Documentation:** `.mahirolab/docs/shadcn-ui/` (comprehensive guides, components, patterns)
**Research Reports:** `.mahirolab/research/` (4 deep-dive reports completed Nov 11, 2025)
**Compatibility:** React 19, Next.js 15, Tailwind CSS v4, TypeScript

### 🚀 Quick Start

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install core components
npx shadcn@latest add button input card dialog navigation-menu

# For forms with validation
npx shadcn@latest add form select checkbox radio-group textarea
npm install react-hook-form @hookform/resolvers zod
```

### 📚 Component Categories & Key Updates

#### Form Components ✅ (Updated Sep 2025)
- **Button:** 9 variants + new `icon-sm`/`icon-lg` sizes (Sep 24, 2025)
- **Input:** Enhanced label/helper patterns, file upload support (Sep 18, 2025)
- **Form:** React Hook Form + Zod integration scaffold (Beta status)

#### Navigation & Layout 🧭
- **NavigationMenu:** `useIsMobile` hook for responsive switching
- **Tabs:** WAI-ARIA manual/automatic activation patterns
- **Sidebar:** Cookie management, cmd/ctrl+b shortcuts, collapsible states

#### Data Display 📊
- **Data Table:** TanStack integration, mobile scroll fallbacks
- **Chart:** Recharts primitives, v3 upgrade incoming
- **Card/Avatar/Badge:** Responsive patterns with data-slot hooks

#### ⚠️ Critical Updates (Feb 2025)
- **Toast:** **DEPRECATED** → migrate to Sonner immediately
- **CLI 3.0:** Registry overhaul with namespaced components
- **Select:** Known scroll lock bug (#4227) - requires CSS workaround

#### Advanced Components ⚙️
- **Color Picker:** EyeDropper API (HTTPS required)
- **Calendar:** Timezone-aware rendering, multilingual support
- **Slider:** Multi-thumb ranges, Radix 1.3.6 compatibility

### 🔧 Known Issues & Fixes

#### Select Scroll Lock Bug (#4227)
```css
/* Apply globally */
body[data-scroll-locked] {
  overflow: hidden;
  padding-right: var(--removed-body-scroll-bar-width, 0px);
}
```

#### Toast Migration to Sonner
```bash
# Install
npx shadcn@latest add sonner

# Replace usage
// ❌ Before
const { toast } = useToast()
// ✅ After
import { toast } from "sonner"
```

### 📖 Documentation Structure
```
.mahirolab/docs/shadcn-ui/
├── README.md                 # Complete integration guide
├── migration-guide.md        # HTML → shadcn/ui patterns
├── INDEX.md                  # Documentation index and navigation
├── components/              # Individual component docs
│   ├── FORM-COMPONENTS.md   # Forms, inputs, validation
│   ├── DATA-DISPLAY.md      # Tables, cards, charts
│   ├── FEEDBACK-OVERLAYS.md # Dialogs, toasts, menus
│   └── ADVANCED-COMPONENTS.md # Calendar, color picker, slider
└── patterns/               # Usage patterns
    ├── FORMS.md            # Form best practices
    ├── NAVIGATION.md       # Navigation patterns
    ├── LAYOUT.md           # Layout systems
    └── ACCESSIBILITY.md    # WCAG & ARIA patterns
```

### 🧪 Best Practices
- Use `Label htmlFor` associations for all form controls
- Apply data-state hooks for styling, maintain semantic structure
- Test both light/dark modes (OKLCH token system)
- Ensure full keyboard navigation support
- Migrate Toast to Sonner immediately

### 📚 Research Sources
Comprehensive research reports (Nov 11, 2025):
- Form Components Deep Dive (`20251111_104022_*`) - Latest button variants, form patterns
- Data Display Deep Dive (`20251111_104037_*`) - Responsive tables, charts, data patterns
- Feedback & Overlays Deep Dive (`20251111_104043_*`) - Toast migration, dialog patterns
- Advanced Components Deep Dive (`20251111_104048_*`) - EyeDropper API, timezone support

**Note:** Research content has been extracted and organized into accessible documentation in the components/ and patterns/ directories above.

---

## Design System

### Design Philosophy

Inspired by **Linear**, **Vercel Geist**, and **Stripe** design systems:

1. **Minimalist & Expressive** — Restrained design that scales with features
2. **Spacious Layouts** — Ample breathing room around all elements
3. **Accessible by Default** — WCAG 2.1 AA minimum, AAA where possible
4. **Perceptually Uniform** — OKLCH color space for consistent visual progression
5. **Semantic Clarity** — Self-documenting token names

### Color System

#### Primary Palette (Linear's Magic Blue)
```css
/* Primary Brand Color - Subtle Desaturated Blue */
--color-primary-50:  oklch(0.97 0.01 250);
--color-primary-100: oklch(0.94 0.02 250);
--color-primary-200: oklch(0.87 0.04 250);
--color-primary-300: oklch(0.78 0.06 250);
--color-primary-400: oklch(0.68 0.10 250);
--color-primary-500: oklch(0.60 0.15 250); /* Base */
--color-primary-600: oklch(0.52 0.16 250);
--color-primary-700: oklch(0.44 0.15 250);
--color-primary-800: oklch(0.36 0.12 250);
--color-primary-900: oklch(0.28 0.09 250);
```

#### Neutral Palette (High Contrast)
```css
/* Neutral - High Contrast (Vercel-inspired) */
--color-neutral-50:  oklch(0.99 0.00 0);
--color-neutral-100: oklch(0.97 0.00 0);
--color-neutral-200: oklch(0.93 0.00 0);
--color-neutral-300: oklch(0.87 0.00 0);
--color-neutral-400: oklch(0.72 0.00 0);
--color-neutral-500: oklch(0.56 0.00 0);
--color-neutral-600: oklch(0.45 0.00 0);
--color-neutral-700: oklch(0.36 0.00 0);
--color-neutral-800: oklch(0.26 0.00 0);
--color-neutral-900: oklch(0.18 0.00 0);
```

#### Semantic Colors
```css
/* Success - Green */
--color-success-500: oklch(0.60 0.14 150);

/* Warning - Amber */
--color-warning-500: oklch(0.70 0.12 60);

/* Error - Red */
--color-error-500: oklch(0.58 0.18 20);

/* Info - Blue */
--color-info-500: oklch(0.62 0.14 230);
```

### Typography System

#### Font Families
```css
:root {
  --font-sans: 'Inter Variable', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter Display Variable', var(--font-sans);
  --font-mono: 'JetBrains Mono Variable', 'Geist Mono', monospace;
}
```

#### Font Size Scale
```css
/* Based on Tailwind CSS semantic naming + USWDS guidance */
--text-xs: 0.75rem (12px)    /* Fine print, labels */
--text-sm: 0.875rem (14px)    /* Secondary text */
--text-base: 1rem (16px)      /* Body copy (default) */
--text-lg: 1.125rem (18px)    /* Lead paragraphs */
--text-xl: 1.25rem (20px)     /* H5 */
--text-2xl: 1.5rem (24px)     /* H4 */
--text-3xl: 1.875rem (30px)   /* H3 */
--text-4xl: 2.25rem (36px)    /* H2 */
--text-5xl: 3rem (48px)       /* H1 */
```

### Spacing System

#### 4px Base Unit
```css
/* Spacing Scale (4px base) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### shadcn/ui Integration

#### Installation
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
```

#### Base Semantic Tokens
```css
:root {
  /* Base */
  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0 0);

  /* Surfaces */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0 0);

  /* Interactive States */
  --primary: oklch(0.60 0.15 250);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.97 0.00 0);
  --secondary-foreground: oklch(0.18 0 0);

  --muted: oklch(0.97 0.00 0);
  --muted-foreground: oklch(0.56 0 0);

  /* UI Elements */
  --border: oklch(0.93 0.00 0);
  --input: oklch(0.93 0.00 0);
  --ring: oklch(0.60 0.15 250);

  --radius: 0.625rem; /* 10px */
}
```

### Dark Mode Support

#### Theme Toggle
```tsx
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### Accessibility Guidelines

#### WCAG 2.1 Compliance
- ✅ AA contrast ratios (4.5:1 text, 3:1 UI)
- ✅ AAA contrast where feasible (7:1)
- ✅ Color not sole indicator
- ✅ Focus indicators (2px outline, `:focus-visible`)
- ✅ Keyboard navigation (Tab, Enter, Space, Esc)
- ✅ Screen reader support (ARIA labels)
- ✅ ≥16px body text with ≥1.5 line height
