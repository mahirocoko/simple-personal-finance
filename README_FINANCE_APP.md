# 💰 Personal Finance App

Full-stack personal finance web application built with **React Router v7** (frontend) and **Bun + Hono** (backend).

## 🎯 Features

### MVP Features
- **Transaction Management**: Track income and expenses with categories
- **Financial Goals**: Set and monitor savings goals
- **Dashboard**: View monthly summary and spending breakdown
- **Categories**: Pre-configured Thai categories (12 default categories)

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) v1.2.19
- **Framework**: [Hono](https://hono.dev) v4
- **Database**: SQLite (via `bun:sqlite`)
- **Language**: TypeScript

### Frontend
- **Framework**: [React Router](https://reactrouter.com) v7 (SPA)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) v1.2+
- Node.js v18+ (for frontend)

### Installation

1. **Backend Setup**
```bash
cd backend
bun install
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

You'll need **two terminal windows**:

**Terminal 1 - Backend** (Port 3000):
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend** (Port 5173):
```bash
cd frontend
npm run dev
```

### Seeding Sample Data (Optional)

```bash
cd backend
bun run seed
```

This adds:
- Sample income/expense transactions for current month
- 3 sample savings goals

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📚 API Endpoints

### Categories
- `GET /api/categories` - List all
- `POST /api/categories` - Create
- `PUT /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

### Transactions
- `GET /api/transactions` - List (with filters: month, type, category_id)
- `GET /api/transactions/summary` - Monthly summary
- `POST /api/transactions` - Create
- `PUT /api/transactions/:id` - Update
- `DELETE /api/transactions/:id` - Delete

### Goals
- `GET /api/goals` - List all
- `GET /api/goals/:id/progress` - Progress details
- `POST /api/goals` - Create
- `PUT /api/goals/:id` - Update
- `DELETE /api/goals/:id` - Delete

## 🎨 Features Overview

- **Dashboard**: Monthly summary, balance, category breakdown
- **Transactions**: Add/edit/delete, filter by month/type/category
- **Goals**: Set targets, track progress, add savings incrementally

## 📝 Notes

- Single-user app (no authentication)
- SQLite file-based database (`backend/finance.db`)
- Frontend proxies to backend via Vite config

---

**Built with ❤️ using Bun, Hono, React Router v7, and Tailwind CSS**
