-- Personal Finance App Database Schema
-- SQLite Database

-- Categories table
-- Stores income and expense categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT '💰',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
-- Stores all income and expense transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL CHECK(amount > 0),
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  category_id INTEGER NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Goals table
-- Stores financial savings goals
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL CHECK(target_amount > 0),
  current_amount REAL DEFAULT 0 CHECK(current_amount >= 0),
  deadline DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Insert default categories
INSERT INTO categories (name, type, color, icon) VALUES
  ('เงินเดือน', 'income', '#10b981', '💵'),
  ('ธุรกิจส่วนตัว', 'income', '#059669', '💼'),
  ('รายได้อื่นๆ', 'income', '#34d399', '💰'),
  ('อาหาร', 'expense', '#ef4444', '🍜'),
  ('ค่าเดินทาง', 'expense', '#f59e0b', '🚗'),
  ('ช้อปปิ้ง', 'expense', '#ec4899', '🛍️'),
  ('ค่าบ้าน', 'expense', '#8b5cf6', '🏠'),
  ('สาธารณูปโภค', 'expense', '#6366f1', '💡'),
  ('บันเทิง', 'expense', '#14b8a6', '🎬'),
  ('สุขภาพ', 'expense', '#06b6d4', '💊'),
  ('การศึกษา', 'expense', '#3b82f6', '📚'),
  ('อื่นๆ', 'expense', '#6b7280', '📦');
