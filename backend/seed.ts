#!/usr/bin/env bun

import { initDatabase } from './src/db'
import { seedSampleData } from './src/db/seed'

console.log('🚀 Starting database seed...')
console.log('')

// Initialize database first
initDatabase()

// Seed sample data
seedSampleData()

console.log('')
console.log('✨ All done!')
