'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { useBudgets } from '../hooks/use-budgets'

export function BudgetOverview() {
  const { budgets } = useBudgets()

  const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0)
  const totalSpent = budgets.reduce((acc, budget) => acc + (budget.spent || 0), 0)
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{Math.round(spentPercentage)}% used</span>
            <span>{formatCurrency(totalBudget - totalSpent)} remaining</span>
          </div>
          <Progress value={spentPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Active Budgets</span>
          <span className="font-medium">{budgets.length}</span>
        </div>
      </CardContent>
    </Card>
  )
}
