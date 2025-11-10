import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'

export interface ISummaryCardProps {
  title: string
  amount: number
  variant: 'income' | 'expense' | 'balance'
}

const variantStyles: Record<ISummaryCardProps['variant'], { title: string; amount: string }> = {
  income: {
    title: 'text-success',
    amount: 'text-success-foreground',
  },
  expense: {
    title: 'text-destructive',
    amount: 'text-destructive-foreground',
  },
  balance: {
    title: 'text-primary',
    amount: 'text-foreground',
  },
}

export function SummaryCard({ title, amount, variant }: ISummaryCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className={cn('text-sm font-medium', styles.title)}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn('text-2xl font-bold', styles.amount)}>฿{amount.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
