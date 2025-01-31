'use client'
import { useState } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/common/page-header'
import { useUser } from '@/features/auth/hooks/use-user'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { PeriodSelector } from '@/features/dashboard/components/period-selector'
import { OverviewTab } from './tabs/overview-tab'
import { DailyExpensesTab } from './tabs/daily-expenses-tab'
import { CategoryReportsTab } from './tabs/category-reports-tab'
import { DateRange } from '../types/dashboard'

export function DashboardContent() {
  const now = new Date()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(now),
    to: endOfMonth(now)
  })

  const { user } = useUser()
  const { categories } = useCategories()
  const {
    todayExpenses,
    weekExpenses,
    periodExpenses,
    dailyExpensesData,
    categoryExpenses,
    activeBudgets,
    budgetsNearLimit,
    recentTransactions,
  } = useDashboard({ dateRange })

  // Convert dailyExpenses object to sorted array
  const dailyExpensesList = Object.entries(dailyExpensesData)
    .map(([date, data]) => ({
      date,
      ...data
    }))
    .sort((a, b) => b.date.localeCompare(a.date))

  // Create category expenses array with names
  const categoryExpensesList = Object.entries(categoryExpenses)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId)?.name || 'Unknown',
      amount
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex-1 space-y-4 p-1 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          heading={`Welcome back${user?.email ? `, ${user.email}` : ''}!`}
          text="Track your financial progress and manage your money effectively."
          className="p-0"
        />
        <PeriodSelector 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Daily Expenses</TabsTrigger>
          <TabsTrigger value="reports">Expenses by Category</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab
            dateRange={dateRange}
            todayExpenses={todayExpenses}
            weekExpenses={weekExpenses}
            periodExpenses={periodExpenses}
            activeBudgets={activeBudgets}
            budgetsNearLimit={budgetsNearLimit}
            recentTransactions={recentTransactions}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <DailyExpensesTab
            dailyExpensesList={dailyExpensesList}
            categories={categories}
          />
        </TabsContent>
        <TabsContent value="reports">
          <CategoryReportsTab
            categoryExpensesList={categoryExpensesList}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
