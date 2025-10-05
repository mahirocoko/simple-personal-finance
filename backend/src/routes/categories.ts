import { Hono } from 'hono'
import { db, query, queryOne, execute } from '../db'

const categories = new Hono()

// GET /api/categories - List all categories
categories.get('/', (c) => {
  try {
    const allCategories = query(
      'SELECT * FROM categories ORDER BY type, name'
    )
    return c.json({ success: true, data: allCategories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500)
  }
})

// GET /api/categories/:id - Get single category
categories.get('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const category = queryOne('SELECT * FROM categories WHERE id = ?', [id])

    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404)
    }

    return c.json({ success: true, data: category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return c.json({ success: false, error: 'Failed to fetch category' }, 500)
  }
})

// POST /api/categories - Create new category
categories.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { name, type, color, icon } = body

    // Validation
    if (!name || !type) {
      return c.json({
        success: false,
        error: 'Name and type are required'
      }, 400)
    }

    if (!['income', 'expense'].includes(type)) {
      return c.json({
        success: false,
        error: 'Type must be either "income" or "expense"'
      }, 400)
    }

    const result = execute(
      'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
      [name, type, color || '#3b82f6', icon || '💰']
    )

    const newCategory = queryOne(
      'SELECT * FROM categories WHERE id = ?',
      [result.lastInsertRowid]
    )

    return c.json({ success: true, data: newCategory }, 201)
  } catch (error) {
    console.error('Error creating category:', error)
    return c.json({ success: false, error: 'Failed to create category' }, 500)
  }
})

// PUT /api/categories/:id - Update category
categories.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, type, color, icon } = body

    // Check if category exists
    const existing = queryOne('SELECT * FROM categories WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Category not found' }, 404)
    }

    // Validation
    if (type && !['income', 'expense'].includes(type)) {
      return c.json({
        success: false,
        error: 'Type must be either "income" or "expense"'
      }, 400)
    }

    execute(
      'UPDATE categories SET name = ?, type = ?, color = ?, icon = ? WHERE id = ?',
      [
        name || existing.name,
        type || existing.type,
        color || existing.color,
        icon || existing.icon,
        id
      ]
    )

    const updated = queryOne('SELECT * FROM categories WHERE id = ?', [id])

    return c.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating category:', error)
    return c.json({ success: false, error: 'Failed to update category' }, 500)
  }
})

// DELETE /api/categories/:id - Delete category
categories.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')

    // Check if category exists
    const existing = queryOne('SELECT * FROM categories WHERE id = ?', [id])
    if (!existing) {
      return c.json({ success: false, error: 'Category not found' }, 404)
    }

    // Check if category is being used by transactions
    const inUse = queryOne(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      [id]
    )

    if (inUse && inUse.count > 0) {
      return c.json({
        success: false,
        error: 'Cannot delete category that is being used by transactions'
      }, 400)
    }

    execute('DELETE FROM categories WHERE id = ?', [id])

    return c.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return c.json({ success: false, error: 'Failed to delete category' }, 500)
  }
})

export default categories
