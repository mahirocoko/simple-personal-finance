import { useLingui } from '@lingui/react/macro'
import { ErrorMessage } from '~/components/ui/error-message'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { SummaryCard } from '~/components/ui/summary-card'
import { useTransactionSummary } from '../hooks/use-transactions'

export default function Dashboard() {
  const { t } = useLingui()
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { summary, loading, error } = useTransactionSummary(currentMonth)

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t`Dashboard`}</h1>
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t`Dashboard`}</h1>
        <ErrorMessage message={error} />
      </div>
    )
  }

  const income = summary?.summary?.total_income || 0
  const expense = summary?.summary?.total_expense || 0
  const balance = summary?.summary?.balance || 0

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t`Dashboard`}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard title={t`Income`} amount={income} variant="income" />
        <SummaryCard title={t`Expense`} amount={expense} variant="expense" />
        <SummaryCard title={t`Balance`} amount={balance} variant="balance" />
      </div>

      {/* Category Breakdown */}
      {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t`Expense by Category`}</h2>
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
                    <p className="font-bold">฿{category.total_amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{t`${category.transaction_count} transactions`}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
