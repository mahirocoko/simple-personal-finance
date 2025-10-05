import { Hono } from 'hono'
import { db, query, queryOne, execute } from '../db'

const transactions = new Hono()

// GET /api/transactions - List transactions with optional filters
transactions.get('/', (c) => {
  try {
    const month = c.req.query('month') // Format: YYYY-MM
    const type = c.req.query('type') // income or expense
    const categoryId = c.req.query('category_id')

    let sql = `
      SELECT
        t.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (month) {
      sql += ` AND strftime('%Y-%m', t.date) = ?`
      params.push(month)
    }

    if (type) {
      sql += ` AND t.type = ?`
      params.push(type)
    }

    if (categoryId) {
      sql += ` AND t.category_id = ?`
      params.push(categoryId)
    }

    sql += ` ORDER BY t.date DESC, t.created_at DESC`

    const allTransactions = query(sql, params)

    return c.json({ success: true, data: allTransactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return c.json({ success: false, error: 'Failed to fetch transactions' }, 500)
  }
})

// GET /api/transactions/summary - Get monthly summary
transactions.get('/summary', (c) => {
  try {
    const month = c.req.query('month') || new Date().toISOString().slice(0, 7)

    const summary = queryOne(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
    `, [month])

    // Get breakdown by category
    const categoryBreakdown = query(`
      SELECT
        c.id,
        c.name,
        c.type,
        c.color,
        c.icon,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_amount
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
        AND strftime('%Y-%m', t.date) = ?
      GROUP BY c.id
      HAVING total_amount > 0
      ORDER BY total_amount DESC
    `, [month])

    return c.json({
      success: true,
      data: {
        month,
        summary,
        categoryBreakdown
      }
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    return c.json({ success: false, error: 'Failed to fetch summary' }, 500)
  }
})

// GET /api/transactions/:id - Get single transaction
transactions.get('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const transaction = queryOne(`
      SELECT
        t.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [id])

    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }

    return c.json({ success: true, data: transaction })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return c.json({ success: false, error: 'Failed to fetch transaction' }, 500)
  }
})

// POST /api/transactions - Create new transaction
transactions.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { amount, type, category_id, description, date } = body

    // Validation
    if (!amount || !type || !category_id) {
      return c.json({
        success: false,
        error: 'Amount, type, and category_id are required'
      }, 400)
    }

    if (!['income', 'expense'].includes(type)) {
      return c.json({
        success: false,
        error: 'Type must be either "income" or "expense"'
      }, 400)
    }

    if (amount <= 0) {
      return c.json({
        success: false,
        error: 'Amount must be greater than 0'
      }, 400)
    }

    // Check if category exists
    const category = queryOne('SELECT * FROM categories WHERE id = ?', [category_id])
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404)
    }

    const result = execute(
      `INSERT INTO transactions (amount, type, category_id, description, date)
       VALUES (?, ?, ?, ?, ?)`,
      [amount, type, category_id, description || null, date || new Date().toISOString().split('T')[0]]
    )

    const newTransaction = queryOne(
      `SELECT
        t.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?`,
      [result.lastInsertRowid]
    )

    return c.json({ success: true, data: newTransaction }, 201)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return c.json({ success: false, error: 'Failed to create transaction' }, 500)
  }
})

// PUT /api/transactions/:id - Update transaction
transactions.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { amount, type, category_id, description, date } = body

    // Check if transaction exists
    const existing = queryOne('SELECT * FROM transactions WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }

    // Validation
    if (type && !['income', 'expense'].includes(type)) {
      return c.json({
        success: false,
        error: 'Type must be either "income" or "expense"'
      }, 400)
    }

    if (amount !== undefined && amount <= 0) {
      return c.json({
        success: false,
        error: 'Amount must be greater than 0'
      }, 400)
    }

    if (category_id) {
      const category = queryOne('SELECT * FROM categories WHERE id = ?', [category_id])
      if (!category) {
        return c.json({ success: false, error: 'Category not found' }, 404)
      }
    }

    execute(
      `UPDATE transactions
       SET amount = ?, type = ?, category_id = ?, description = ?, date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        amount ?? existing.amount,
        type ?? existing.type,
        category_id ?? existing.category_id,
        description ?? existing.description,
        date ?? existing.date,
        id
      ]
    )

    const updated = queryOne(`
      SELECT
        t.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [id])

    return c.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return c.json({ success: false, error: 'Failed to update transaction' }, 500)
  }
})

// DELETE /api/transactions/:id - Delete transaction
transactions.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')

    // Check if transaction exists
    const existing = queryOne('SELECT * FROM transactions WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }

    execute('DELETE FROM transactions WHERE id = ?', [id])

    return c.json({ success: true, message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return c.json({ success: false, error: 'Failed to delete transaction' }, 500)
  }
})

export default transactions
