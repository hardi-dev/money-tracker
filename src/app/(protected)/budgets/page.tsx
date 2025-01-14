'use client'

import { PageHeader } from '@/components/page-header'
import { BudgetOverview } from '@/features/budgets/components/budget-overview'
import { BudgetAlerts } from '@/features/budgets/components/budget-alerts'
import { BudgetList } from '@/features/budgets/components/budget-list'

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Budgets"
        text="Set and track your spending limits"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <BudgetOverview />
        </div>
        <div className="col-span-3">
          <BudgetAlerts />
        </div>
      </div>

      <BudgetList />
    </div>
  )
}
