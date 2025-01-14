// 'use client'

import { Metadata } from 'next'
// import { PageHeader } from '@/components/page-header'
import { BudgetOverview } from '@/features/budgets/components/budget-overview'
import { BudgetList } from '@/features/budgets/components/budget-list'
import { BudgetAlerts } from '@/features/budgets/components/budget-alerts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BudgetChart } from '@/features/budgets/components/budget-chart'

export const metadata: Metadata = {
  title: 'Budgets | Money Tracker',
  description: 'Manage and track your budgets',
}

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      {/* <PageHeader
        heading="Budget Planning"
        text="Set and manage your budgets to stay on track with your financial goals"
      /> */}

      <BudgetAlerts />

      <div className="grid gap-6">
        <BudgetOverview />

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <BudgetList />
          </TabsContent>

          <TabsContent value="chart">
            <BudgetChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
