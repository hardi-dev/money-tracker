'use client'

import { Transaction } from '../types/transaction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

interface TransactionGridProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionGrid({ transactions }: TransactionGridProps) {
  if (!transactions.length) {
    return (
      <div className="text-center text-muted-foreground">
        No transactions found
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{transaction.category?.name}</span>
              </div>
              <span
                className={
                  transaction.type === 'EXPENSE'
                    ? 'text-red-500'
                    : 'text-green-500'
                }
              >
                {transaction.type === 'EXPENSE' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>{formatDate(transaction.date)}</span>
              </div>
              {transaction.description && (
                <p className="mt-2 line-clamp-2">{transaction.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
