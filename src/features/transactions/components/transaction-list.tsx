'use client'

import { useState } from 'react'
import { TransactionFilters } from '../types/transaction'
import { useTransactions } from '../hooks/use-transactions'
import { TransactionTable } from './transaction-table'
import { TransactionTableSkeleton } from './transaction-table-skeleton'
import { TransactionGridSkeleton } from './transaction-grid-skeleton'
import { TransactionFiltersSkeleton } from './transaction-filters-skeleton'
import { TransactionDialog } from './transaction-dialog'
import { TransactionFiltersDialog } from './transaction-filters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Grid2X2, List } from 'lucide-react'
import { TransactionGrid } from './transaction-grid'

type ViewMode = 'list' | 'grid'

export function TransactionList() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<TransactionFilters>({})
  const { transactions, isLoading } = useTransactions(filters)

  console.log(transactions)

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters)
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center gap-4">
          <TransactionDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            }
          />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleViewMode}
            title={
              viewMode === "list"
                ? "Switch to grid view"
                : "Switch to list view"
            }
          >
            {viewMode === "list" ? (
              <Grid2X2 className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TransactionFiltersSkeleton />
      ) : (
        <TransactionFiltersDialog
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {viewMode === 'list' ? (
        isLoading ? (
          <TransactionTableSkeleton />
        ) : (
          <TransactionTable 
            transactions={transactions}
            isLoading={isLoading}
          />
        )
      ) : isLoading ? (
        <TransactionGridSkeleton />
      ) : (
        <TransactionGrid
          transactions={transactions}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
