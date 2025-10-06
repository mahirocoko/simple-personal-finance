import { cn } from '~/lib/utils'

export interface ISummaryCardProps {
  title: string
  amount: number
  variant: 'income' | 'expense' | 'balance'
}

const variantStyles: Record<
  ISummaryCardProps['variant'],
  { container: string; title: string; amount: string }
> = {
  income: {
    container: 'bg-green-100',
    title: 'text-green-800',
    amount: 'text-green-900',
  },
  expense: {
    container: 'bg-red-100',
    title: 'text-red-800',
    amount: 'text-red-900',
  },
  balance: {
    container: 'bg-blue-100',
    title: 'text-blue-800',
    amount: 'text-blue-900',
  },
}

export function SummaryCard({ title, amount, variant }: ISummaryCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn('p-6 rounded-lg shadow', styles.container)}>
      <h2 className={cn('text-sm font-semibold mb-2', styles.title)}>{title}</h2>
      <p className={cn('text-3xl font-bold', styles.amount)}>฿{amount.toLocaleString()}</p>
    </div>
  )
}
