# Personal Finance App

Full-stack personal finance tracker built with a React Router v7 SPA frontend and a Bun + Hono API backend. The project focuses on practicing modern TypeScript tooling while delivering practical income, expense, and savings goal tracking for a single user.

## Key Features

- Dashboard with a monthly summary (income, expense, balance) and data ready for category breakdown visualisations.
- Income and expense management with month filters, category metadata, validation, and deletion safety checks.
- Savings goals with progress tracking, remaining amount calculation, and quick "add savings" helpers.
- Built-in localisation (English and Thai) covering UI labels and form validation via Lingui.
- SQLite schema seeded with Thai defaults plus optional sample data seeding for easier demos.
- Structured JSON error responses and shared fetch utilities for a consistent client experience.

## Tech Stack

- Frontend: React 19, React Router 7 (SPA mode), TypeScript, Tailwind CSS, React Hook Form, Zod, Lingui, Vite.
- Backend: Bun 1.2, Hono 4, SQLite (bun:sqlite), TypeScript.
- Tooling: Vitest + Testing Library, Biome, Lingui CLI, React Router type generation.

## Project Structure

```
my-ai-lab/
├── backend/                # Bun + Hono API and SQLite database
│   ├── index.ts            # Hono bootstrap and route wiring
│   ├── src/
│   │   ├── db/             # SQLite helpers, schema.sql, seed helpers
│   │   └── routes/         # Categories, transactions, goals handlers
│   ├── seed.ts             # Script to insert sample data
│   └── finance.db          # SQLite database (auto-created)
└── frontend/               # React Router SPA
    ├── app/                # Routes, components, hooks, schemas, i18n
    ├── public/
    ├── react-router.config.ts
    ├── vite.config.ts      # Vite dev proxy to backend
    └── package.json
```

## Getting Started

### Prerequisites

- Bun 1.2+ (installs dependencies and runs the API)
- Node.js 18+ (for the React Router frontend tooling)

### 1. Backend (API)

```bash
cd backend
bun install
bun run dev
```

- Server runs on `http://localhost:3000`.
- `initDatabase()` applies `src/db/schema.sql` (enables foreign keys and inserts default categories) before serving requests.
- SQLite data lives in `backend/finance.db`. Delete the file to reset the database; it will be recreated on the next start.
- Seed optional demo data (current-month transactions plus three goals):

```bash
bun run seed
```

### 2. Frontend (SPA)

```bash
cd frontend
npm install
npm run dev
```

- Vite dev server runs on `http://localhost:5173`.
- `VITE_API_URL` (default `http://localhost:3000/api`) controls the API base URL. The dev server also proxies `/api/*` to the Bun backend.

### 3. Open the App

Visit `http://localhost:5173` once both servers are running. The dashboard route (`/`) loads by default with links to Transactions and Savings Goals.

## Useful Scripts

- **Frontend (`frontend/`)**
  - `npm run dev` – start the React Router dev server.
  - `npm run build` – create a production bundle.
  - `npm run test` – run unit tests with Vitest and Testing Library.
  - `npm run lint` / `npm run format` – Biome static analysis and formatting.
  - `npm run typecheck` – generate router types then run TypeScript.
  - `npm run lingui:extract` / `npm run lingui:compile` – update and build translation catalogs.
- **Backend (`backend/`)**
  - `bun run dev` – start the API with hot reload.
  - `bun start` – run the API once (no hot reload).
  - `bun run seed` – insert example categories, transactions, and goals.

## API Overview

All endpoints are prefixed with `/api` and return JSON shaped as `{ success, data?, error? }`.

- **Health**
  - `GET /api/health` – uptime check.
  - `GET /` – root route returns API metadata (status, version).
- **Categories**
  - `GET /api/categories` – list all categories (income and expense).
  - `GET /api/categories/:id` – fetch a single category.
  - `POST /api/categories` – create category (`name`, `type`, optional `color`, `icon`).
  - `PUT /api/categories/:id` – update category metadata.
  - `DELETE /api/categories/:id` – remove a category (blocked when referenced by transactions).
- **Transactions**
  - `GET /api/transactions?month=YYYY-MM&type=income|expense&category_id=ID` – filterable transaction list.
  - `GET /api/transactions/:id` – fetch transaction with category details.
  - `POST /api/transactions` – create transaction (validates amount, type, category existence).
  - `PUT /api/transactions/:id` – update transaction fields.
  - `DELETE /api/transactions/:id` – delete transaction.
  - `GET /api/transactions/summary?month=YYYY-MM` – aggregated totals plus category breakdown for dashboards.
- **Goals**
  - `GET /api/goals` – list all savings goals with computed progress.
  - `GET /api/goals/:id` – fetch goal details.
  - `GET /api/goals/:id/progress` – goal progress including deadline countdown flags.
  - `POST /api/goals` – create goal (validates positive target and non-negative current amount).
  - `PUT /api/goals/:id` – update goal and recalculate progress.
  - `DELETE /api/goals/:id` – remove goal.

## Data Model

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT '💰',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL CHECK(amount > 0),
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL CHECK(target_amount > 0),
  current_amount REAL DEFAULT 0 CHECK(current_amount >= 0),
  deadline DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

- `schema.sql` seeds 12 Thai categories (salary, utilities, entertainment, etc.) with emojis and brand colours.
- `seed.ts` adds current-month sample transactions and three example savings goals.

## Internationalisation

- Lingui loads English and Thai message catalogs from `frontend/app/locales`.
- `LocaleSwitcher` persists the selected locale in `localStorage` and activates translations at runtime.
- Zod schemas (`frontend/app/schemas`) map validation messages through `frontend/app/lib/zod-i18n.ts`, keeping errors translatable.

## Resetting or Migrating Data

- Delete `backend/finance.db` to recreate a fresh database on the next server start.
- Update SQL schema or seed data in `backend/src/db/schema.sql` and `backend/src/db/seed.ts`.
- Use `bun run seed` after schema changes to repopulate demo content.

## License

MIT
