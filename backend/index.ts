import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initDatabase } from './src/db'
import categories from './src/routes/categories'
import transactions from './src/routes/transactions'
import goals from './src/routes/goals'

const app = new Hono()

// Initialize database on startup
initDatabase()

// Middleware
app.use('/*', logger())
app.use('/*', cors())

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    path: c.req.path
  }, 404)
})

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Personal Finance API',
    version: '1.0.0',
    status: 'running'
  })
})

// API routes
const api = app.basePath('/api')

api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount routes
api.route('/categories', categories)
api.route('/transactions', transactions)
api.route('/goals', goals)

console.log('🚀 Server starting on http://localhost:3000')

export default {
  port: 3000,
  fetch: app.fetch,
}