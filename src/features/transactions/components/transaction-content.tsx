import { type Transaction } from '../types/transaction'
import { TransactionTable } from './transaction-table'
import { TransactionGrid } from './transaction-grid'
import { TransactionTableSkeleton } from './transaction-table-skeleton'

interface TransactionContentProps {
  viewMode: 'list' | 'grid'
  transactions: Transaction[]
  isLoading: boolean
}

export function TransactionContent({
  viewMode,
  transactions,
  isLoading,
}: TransactionContentProps) {
  if (viewMode === 'list') {
    return isLoading ? (
      <TransactionTableSkeleton />
    ) : (
      <TransactionTable transactions={transactions} isLoading={isLoading} />
    )
  }

  return isLoading ? (
    <TransactionTableSkeleton />
  ) : (
    <TransactionGrid transactions={transactions} isLoading={isLoading} />
  );
}
