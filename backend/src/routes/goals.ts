import { Hono } from 'hono'
import { db, query, queryOne, execute } from '../db'

const goals = new Hono()

// GET /api/goals - List all goals
goals.get('/', (c) => {
  try {
    const allGoals = query(`
      SELECT
        *,
        ROUND((current_amount * 100.0 / target_amount), 2) as progress_percentage,
        ROUND(target_amount - current_amount, 2) as remaining_amount
      FROM goals
      ORDER BY deadline ASC, created_at DESC
    `)

    return c.json({ success: true, data: allGoals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return c.json({ success: false, error: 'Failed to fetch goals' }, 500)
  }
})

// GET /api/goals/:id - Get single goal
goals.get('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const goal = queryOne(`
      SELECT
        *,
        ROUND((current_amount * 100.0 / target_amount), 2) as progress_percentage,
        ROUND(target_amount - current_amount, 2) as remaining_amount
      FROM goals
      WHERE id = ?
    `, [id])

    if (!goal) {
      return c.json({ success: false, error: 'Goal not found' }, 404)
    }

    return c.json({ success: true, data: goal })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return c.json({ success: false, error: 'Failed to fetch goal' }, 500)
  }
})

// GET /api/goals/:id/progress - Get goal progress with details
goals.get('/:id/progress', (c) => {
  try {
    const id = c.req.param('id')

    const goal = queryOne(`
      SELECT
        *,
        ROUND((current_amount * 100.0 / target_amount), 2) as progress_percentage,
        ROUND(target_amount - current_amount, 2) as remaining_amount
      FROM goals
      WHERE id = ?
    `, [id])

    if (!goal) {
      return c.json({ success: false, error: 'Goal not found' }, 404)
    }

    // Calculate days remaining
    let daysRemaining = null
    let isOverdue = false

    if (goal.deadline) {
      const today = new Date()
      const deadlineDate = new Date(goal.deadline)
      const timeDiff = deadlineDate.getTime() - today.getTime()
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))
      isOverdue = daysRemaining < 0
    }

    return c.json({
      success: true,
      data: {
        ...goal,
        daysRemaining,
        isOverdue,
        isCompleted: goal.current_amount >= goal.target_amount
      }
    })
  } catch (error) {
    console.error('Error fetching goal progress:', error)
    return c.json({ success: false, error: 'Failed to fetch goal progress' }, 500)
  }
})

// POST /api/goals - Create new goal
goals.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { name, target_amount, current_amount, deadline } = body

    // Validation
    if (!name || !target_amount) {
      return c.json({
        success: false,
        error: 'Name and target_amount are required'
      }, 400)
    }

    if (target_amount <= 0) {
      return c.json({
        success: false,
        error: 'Target amount must be greater than 0'
      }, 400)
    }

    if (current_amount !== undefined && current_amount < 0) {
      return c.json({
        success: false,
        error: 'Current amount cannot be negative'
      }, 400)
    }

    const result = execute(
      `INSERT INTO goals (name, target_amount, current_amount, deadline)
       VALUES (?, ?, ?, ?)`,
      [name, target_amount, current_amount || 0, deadline || null]
    )

    const newGoal = queryOne(`
      SELECT
        *,
        ROUND((current_amount * 100.0 / target_amount), 2) as progress_percentage,
        ROUND(target_amount - current_amount, 2) as remaining_amount
      FROM goals
      WHERE id = ?
    `, [result.lastInsertRowid])

    return c.json({ success: true, data: newGoal }, 201)
  } catch (error) {
    console.error('Error creating goal:', error)
    return c.json({ success: false, error: 'Failed to create goal' }, 500)
  }
})

// PUT /api/goals/:id - Update goal
goals.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, target_amount, current_amount, deadline } = body

    // Check if goal exists
    const existing = queryOne('SELECT * FROM goals WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Goal not found' }, 404)
    }

    // Validation
    if (target_amount !== undefined && target_amount <= 0) {
      return c.json({
        success: false,
        error: 'Target amount must be greater than 0'
      }, 400)
    }

    if (current_amount !== undefined && current_amount < 0) {
      return c.json({
        success: false,
        error: 'Current amount cannot be negative'
      }, 400)
    }

    execute(
      `UPDATE goals
       SET name = ?, target_amount = ?, current_amount = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name ?? existing.name,
        target_amount ?? existing.target_amount,
        current_amount ?? existing.current_amount,
        deadline ?? existing.deadline,
        id
      ]
    )

    const updated = queryOne(`
      SELECT
        *,
        ROUND((current_amount * 100.0 / target_amount), 2) as progress_percentage,
        ROUND(target_amount - current_amount, 2) as remaining_amount
      FROM goals
      WHERE id = ?
    `, [id])

    return c.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating goal:', error)
    return c.json({ success: false, error: 'Failed to update goal' }, 500)
  }
})

// DELETE /api/goals/:id - Delete goal
goals.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')

    // Check if goal exists
    const existing = queryOne('SELECT * FROM goals WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Goal not found' }, 404)
    }

    execute('DELETE FROM goals WHERE id = ?', [id])

    return c.json({ success: true, message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return c.json({ success: false, error: 'Failed to delete goal' }, 500)
  }
})

export default goals
