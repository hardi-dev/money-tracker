import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import { DateRange } from '../../types/dashboard'
import { Transaction } from '@/features/transactions/types/transaction'

interface OverviewTabProps {
  dateRange: DateRange
  todayExpenses: number
  weekExpenses: number
  periodExpenses: number
  activeBudgets: number
  budgetsNearLimit: number
  recentTransactions: Transaction[]
}

export function OverviewTab({
  dateRange,
  todayExpenses,
  weekExpenses,
  periodExpenses,
  activeBudgets,
  budgetsNearLimit,
  recentTransactions,
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
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
              Selected Period Expense
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
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Daily expenses for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart dateRange={dateRange} />
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
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
    </div>
  )
}
