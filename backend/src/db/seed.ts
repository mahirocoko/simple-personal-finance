import { execute } from './index'

export function seedSampleData() {
  console.log('🌱 Seeding sample data...')

  try {
    // Sample transactions for this month
    const currentDate = new Date()
    const thisMonth = currentDate.toISOString().slice(0, 7)

    // Income transactions
    const incomes = [
      {
        amount: 50000,
        type: 'income',
        category_id: 1, // เงินเดือน
        description: 'เงินเดือนประจำเดือน',
        date: `${thisMonth}-01`,
      },
      {
        amount: 15000,
        type: 'income',
        category_id: 2, // ธุรกิจส่วนตัว
        description: 'รายได้จากงานฟรีแลนซ์',
        date: `${thisMonth}-15`,
      },
    ]

    // Expense transactions
    const expenses = [
      {
        amount: 8500,
        type: 'expense',
        category_id: 7, // ค่าบ้าน
        description: 'ค่าเช่าบ้าน',
        date: `${thisMonth}-01`,
      },
      {
        amount: 2500,
        type: 'expense',
        category_id: 8, // สาธารณูปโภค
        description: 'ค่าไฟ-น้ำ-เน็ต',
        date: `${thisMonth}-05`,
      },
      {
        amount: 450,
        type: 'expense',
        category_id: 4, // อาหาร
        description: 'ข้าวเที่ยง',
        date: `${thisMonth}-10`,
      },
      {
        amount: 650,
        type: 'expense',
        category_id: 4, // อาหาร
        description: 'ซื้อของกินเข้าบ้าน',
        date: `${thisMonth}-12`,
      },
      {
        amount: 1200,
        type: 'expense',
        category_id: 5, // ค่าเดินทาง
        description: 'ค่าน้ำมันรถ',
        date: `${thisMonth}-08`,
      },
      {
        amount: 3500,
        type: 'expense',
        category_id: 6, // ช้อปปิ้ง
        description: 'ซื้อเสื้อผ้า',
        date: `${thisMonth}-14`,
      },
      {
        amount: 850,
        type: 'expense',
        category_id: 9, // บันเทิง
        description: 'ดูหนัง',
        date: `${thisMonth}-16`,
      },
    ]

    // Insert sample transactions
    for (const tx of [...incomes, ...expenses]) {
      execute(
        'INSERT INTO transactions (amount, type, category_id, description, date) VALUES (?, ?, ?, ?, ?)',
        [tx.amount, tx.type, tx.category_id, tx.description, tx.date]
      )
    }

    // Sample goals
    const goals = [
      {
        name: 'กองทุนฉุกเฉิน',
        target_amount: 100000,
        current_amount: 35000,
        deadline: `${currentDate.getFullYear()}-12-31`,
      },
      {
        name: 'ซื้อรถใหม่',
        target_amount: 500000,
        current_amount: 120000,
        deadline: `${currentDate.getFullYear() + 1}-06-30`,
      },
      {
        name: 'ทริปท่องเที่ยวญี่ปุ่น',
        target_amount: 80000,
        current_amount: 25000,
        deadline: `${currentDate.getFullYear()}-09-01`,
      },
    ]

    // Insert sample goals
    for (const goal of goals) {
      execute(
        'INSERT INTO goals (name, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?)',
        [goal.name, goal.target_amount, goal.current_amount, goal.deadline]
      )
    }

    console.log('✅ Sample data seeded successfully!')
    console.log(`   - ${incomes.length + expenses.length} transactions`)
    console.log(`   - ${goals.length} goals`)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}
