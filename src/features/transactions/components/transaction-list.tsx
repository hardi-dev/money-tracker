'use client'

import { useState } from 'react'
import { useTransactions } from '../hooks/use-transactions'
import { type TransactionFilters } from '../types/transaction'
import { TransactionHeader } from './transaction-header'
import { TransactionContent } from './transaction-content'

export function TransactionList() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filters, setFilters] = useState<TransactionFilters>({})
  const { transactions, isLoading } = useTransactions(filters)

  const handleViewModeChange = (mode: 'list' | 'grid') => {
    setViewMode(mode)
  }

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      <TransactionHeader
        isLoading={isLoading}
        viewMode={viewMode}
        filters={filters}
        onViewModeChange={handleViewModeChange}
        onFilterChange={handleFilterChange}
      />

      <TransactionContent
        viewMode={viewMode}
        transactions={transactions}
        isLoading={isLoading}
      />
    </div>
  );
}
