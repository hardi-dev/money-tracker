'use client'

import { TransactionList } from '@/features/transactions/components/transaction-list'

export default function TransactionsPage() {
  return (
    <div className="container py-6">
      <TransactionList />
    </div>
  )
}
