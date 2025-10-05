# Personal Finance App

A simple personal finance web application for tracking income, expenses, and financial goals.

## Tech Stack

- **Frontend:** React Router v7 (SPA)
- **Backend:** Bun + Hono
- **Database:** SQLite

## Features (MVP)

- ✅ Transaction Management (income/expense tracking)
- ✅ Category Organization
- ✅ Financial Goals & Progress Tracking
- ✅ Dashboard with Summary & Charts

## Project Structure

```
my-ai-lab/
├── frontend/          # React Router v7 SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Bun + Hono API
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── controllers/
│   └── package.json
└── database.sqlite    # SQLite database
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) runtime

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

### Installation

Coming soon...

### Development

Coming soon...

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Monthly summary

### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/:id/progress` - Get goal progress

## Database Schema

### Categories
```sql
id INTEGER PRIMARY KEY
name TEXT NOT NULL
type TEXT CHECK(type IN ('income', 'expense'))
color TEXT
icon TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Transactions
```sql
id INTEGER PRIMARY KEY
amount REAL NOT NULL
type TEXT CHECK(type IN ('income', 'expense'))
category_id INTEGER REFERENCES categories(id)
description TEXT
date DATE NOT NULL
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Goals
```sql
id INTEGER PRIMARY KEY
name TEXT NOT NULL
target_amount REAL NOT NULL
current_amount REAL DEFAULT 0
deadline DATE
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

## Roadmap

- [ ] Phase 1: Project Setup & Database Design
- [ ] Phase 2: Backend Development (Bun + Hono)
- [ ] Phase 3: Frontend Development (React Router v7)
- [ ] Phase 4: Integration & Polish
- [ ] Phase 5: Optional Enhancements
  - [ ] Date range filters
  - [ ] Export to CSV
  - [ ] Dark mode
  - [ ] Advanced charts
  - [ ] Recurring transactions
  - [ ] Budget planning

## Learning Goals

This project is designed as a learning experience for backend development, focusing on:

- REST API design and implementation
- Database modeling and SQL
- Bun runtime and Hono framework
- Full-stack application architecture

---

## Development Tools

This project uses the [Claude-Codex Orchestrator](.mahirolab/) for AI-assisted development.

### Shortcodes

- **`ccc`** - Create context snapshot
- **`nnn`** - Generate implementation plan
- **`gogogo`** - Execute plan
- **`rrr`** - Create retrospective
- **`lll`** - Show project status

See [CLAUDE.md](CLAUDE.md) for full documentation.

## License

MIT
