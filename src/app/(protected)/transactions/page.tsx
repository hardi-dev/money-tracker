'use client'

import { PageHeader } from '@/components/page-header'
import { TransactionList } from '@/features/transactions/components/transaction-list'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Transactions"
        text="View and manage your transactions"
      />
      <TransactionList />
    </div>
  )
}
