import { Button } from '@/components/ui/button'
import { Grid2X2, List, Plus, X } from 'lucide-react'
import { TransactionDialog } from './transaction-dialog'
import { TransactionFiltersDialog } from './transaction-filters'
import { type TransactionFilters } from '../types/transaction'
import { TransactionFiltersSkeleton } from './transaction-filters-skeleton'
import { useState } from 'react'

interface TransactionHeaderProps {
  isLoading: boolean
  viewMode: 'list' | 'grid'
  filters: TransactionFilters
  onViewModeChange: (mode: 'list' | 'grid') => void
  onFilterChange: (filters: TransactionFilters) => void
}

export function TransactionHeader({
  isLoading,
  viewMode,
  filters,
  onViewModeChange,
  onFilterChange,
}: TransactionHeaderProps) {
  const [resetKey, setResetKey] = useState(0)

  // Check if there are any active filters
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof TransactionFilters]
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true)
  })

  const handleResetFilters = () => {
    onFilterChange({})
    setResetKey(prev => prev + 1) // Force re-render of TransactionFiltersDialog
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Filter */}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <TransactionFiltersSkeleton />
          ) : (
            <>
              <TransactionFiltersDialog
                filters={filters}
                onFilterChange={onFilterChange}
                resetKey={resetKey}
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* View Mode */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewModeChange(viewMode === 'list' ? 'grid' : 'list')}
          title={
            viewMode === 'list'
              ? 'Switch to grid view'
              : 'Switch to list view'
          }
        >
          {viewMode === 'list' ? (
            <>
              <Grid2X2 className="mr-2 h-4 w-4" /> Grid
            </>
          ) : (
            <>
              <List className="mr-2 h-4 w-4" /> List
            </>
          )}
        </Button>
      </div>

      {/* Add Transaction */}
      <TransactionDialog
        trigger={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        }
      />
    </div>
  )
}
