'use client'

import { useBudgets } from '../hooks/use-budgets'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BudgetAlerts() {
  const { alerts, loading } = useBudgets()

  if (loading || alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.budgetId}
          variant={alert.type === 'danger' ? 'destructive' : 'default'}
          className={cn(
            alert.type === 'warning' && 'border-warning bg-warning/10'
          )}
        >
          {alert.type === 'danger' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {alert.type === 'danger' ? 'Budget Exceeded' : 'Budget Warning'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p>{alert.message}</p>
            <p className="text-sm mt-1">
              Current usage: {alert.percentage.toFixed(1)}%
            </p>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
