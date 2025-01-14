'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@/features/auth/hooks/use-user'

export default function DashboardPage() {
  const { user } = useUser()
  const {
    currentMonthIncome,
    currentMonthExpenses,
    totalBalance,
    incomePercentageChange,
    expensePercentageChange,
    activeBudgets,
    budgetsNearLimit,
    recentTransactions,
    transactions,
  } = useDashboard()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.email ? `, ${user.email}` : ''}!
        </h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalBalance)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(currentMonthIncome)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {incomePercentageChange >= 0 ? '+' : ''}
                  {incomePercentageChange.toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(currentMonthExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {expensePercentageChange >= 0 ? '+' : ''}
                  {expensePercentageChange.toFixed(1)}% from last month
                </p>
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
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart transactions={transactions} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You made {transactions.length} transactions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={recentTransactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
