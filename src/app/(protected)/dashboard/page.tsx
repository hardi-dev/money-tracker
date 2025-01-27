'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@/features/auth/hooks/use-user'
import { PageHeader } from '@/components/common/page-header'
import { useCategories } from '@/features/categories/hooks/use-categories'

export default function DashboardPage() {
  const { user } = useUser()
  const { categories } = useCategories()
  const {
    todayExpenses,
    weekExpenses,
    periodExpenses,
    dailyExpenses,
    categoryExpenses,
    activeBudgets,
    budgetsNearLimit,
    recentTransactions,
  } = useDashboard()

  // Convert dailyExpenses object to sorted array
  const dailyExpensesList = Object.entries(dailyExpenses)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => b.date.localeCompare(a.date))

  // Create category expenses array with names
  const categoryExpensesList = Object.entries(categoryExpenses)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId)?.name || 'Unknown',
      amount
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        heading={`Welcome back${user?.email ? `, ${user.email}` : ''}!`}
        text="Track your financial progress and manage your money effectively."
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Daily Expenses</TabsTrigger>
          <TabsTrigger value="reports">Expenses by Category</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Today Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(todayExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Week Total Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(weekExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Period Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(periodExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Budgets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBudgets}</div>
                <p className="text-xs text-muted-foreground">
                  {budgetsNearLimit} budget{budgetsNearLimit === 1 ? '' : 's'} near limit
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Daily expenses for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your most recent transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={recentTransactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Expenses</CardTitle>
              <CardDescription>
                Your expenses breakdown by day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {dailyExpensesList.map(({ date, amount }) => (
                    <div key={date} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <span className="font-medium">{date}</span>
                      <span className="text-muted-foreground">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                Your expenses breakdown by category for this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {categoryExpensesList.map(({ category, amount }) => (
                    <div key={category} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
