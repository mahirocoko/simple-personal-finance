import { useTransactionSummary } from '../hooks/useTransactions'

export default function Dashboard() {
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const { summary, loading, error } = useTransactionSummary(currentMonth)

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  const income = summary?.summary?.total_income || 0
  const expense = summary?.summary?.total_expense || 0
  const balance = summary?.summary?.balance || 0

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-green-800 mb-2">
            รายรับ (Income)
          </h2>
          <p className="text-3xl font-bold text-green-900">
            ฿{income.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-red-800 mb-2">
            รายจ่าย (Expense)
          </h2>
          <p className="text-3xl font-bold text-red-900">
            ฿{expense.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-blue-800 mb-2">
            คงเหลือ (Balance)
          </h2>
          <p className="text-3xl font-bold text-blue-900">
            ฿{balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">รายจ่ายแยกตามหมวดหมู่</h2>
          <div className="space-y-3">
            {summary.categoryBreakdown
              .filter((cat: any) => cat.type === 'expense')
              .map((category: any) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ฿{category.total_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.transaction_count} รายการ
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
