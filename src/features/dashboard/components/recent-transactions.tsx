import { type Transaction } from '@/features/transactions/types/transaction'
import { formatCurrency } from '@/lib/utils'
import { format, parseISO } from 'date-fns'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div
            className="h-9 w-9 rounded-lg"
            style={{ backgroundColor: transaction.category?.color || '#94a3b8' }}
          />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.category?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(transaction.date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={
                transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }
            >
              {transaction.type === 'INCOME' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
