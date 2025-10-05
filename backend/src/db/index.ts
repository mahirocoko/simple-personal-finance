import { Database } from 'bun:sqlite'
import { readFileSync } from 'fs'
import { join } from 'path'

// Initialize SQLite database
const dbPath = join(import.meta.dir, '..', '..', 'finance.db')
export const db = new Database(dbPath)

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Initialize database schema
export function initDatabase() {
  const schema = readFileSync(join(import.meta.dir, 'schema.sql'), 'utf-8')
  db.exec(schema)
  console.log('✅ Database initialized successfully')
}

// Helper function to run queries safely
export function query<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql)
  return stmt.all(...params) as T[]
}

// Helper function to run single row queries
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const stmt = db.prepare(sql)
  return stmt.get(...params) as T | null
}

// Helper function to run INSERT/UPDATE/DELETE
export function execute(sql: string, params: any[] = []) {
  const stmt = db.prepare(sql)
  return stmt.run(...params)
}
