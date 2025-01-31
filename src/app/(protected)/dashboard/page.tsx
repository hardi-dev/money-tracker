// React imports
'use client'
import { useState } from 'react'

// External libraries
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { Wallet } from 'lucide-react'

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Features
import { useUser } from '@/features/auth/hooks/use-user'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import { PeriodSelector } from '@/features/dashboard/components/period-selector'
import { PageHeader } from '@/components/common/page-header'

// Utils
import { formatCurrency } from '@/lib/utils'
import { Category } from '@/types/database.types'
import { Transaction } from '@/features/transactions/types/transaction'

// Types
interface DateRange {
  from: Date
  to: Date
}

interface DailyExpenseProps {
  date: string
  totalAmount: number
  transactions: Transaction[]
  categoryTotals: Record<string, number>
  categories: Category[]
}

/**
 * Daily expense item component that shows transactions and category totals for a specific day
 */
function DailyExpenseItem({ date, totalAmount, transactions, categoryTotals, categories }: DailyExpenseProps) {
  return (
    <AccordionItem 
      value={date}
      className="border rounded-xl px-2 shadow-sm transition-all hover:shadow-md data-[state=open]:shadow-md"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <div className="text-center flex flex-col justify-center gap-y-1 pt-1">
                <div className="text-xl/3 font-bold text-primary">
                  {format(parseISO(date), 'dd')}
                </div>
                <div className="text-xs/3 uppercase text-primary/80">
                  {format(parseISO(date), 'MMM')}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-base font-semibold">
                {format(parseISO(date), 'EEEE')}
              </div>
              <div className="text-sm text-muted-foreground">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-red-600">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              {Object.keys(categoryTotals).length} categor{Object.keys(categoryTotals).length !== 1 ? 'ies' : 'y'}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-6">
        <div className="space-y-6 pt-2">
          {/* Category Breakdown */}
          <div className="rounded-xl border bg-card p-6">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Category Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([categoryId, amount]) => {
                  const category = categories.find(c => c.id === categoryId)
                  const percentage = (amount / totalAmount) * 100
                  return (
                    <div key={categoryId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category?.color || '#94a3b8' }}
                          />
                          <span className="font-medium">
                            {category?.name || 'Unknown'}
                          </span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category?.color || '#94a3b8'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Transactions
            </h4>
            <div className="space-y-2">
              {transactions
                .sort((a, b) => b.amount - a.amount)
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: transaction.category?.color || '#94a3b8' }}
                      >
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.category?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.description || 'No description'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(transaction.date), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function DashboardPage() {
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
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader
          heading={`Welcome back${user?.email ? `, ${user.email}` : ''}!`}
          text="Track your financial progress and manage your money effectively."
        />
        <PeriodSelector 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

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
            <Card className="col-span-4">
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
                Your expenses breakdown by day for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {dailyExpensesList.map(({ date, totalAmount, transactions, categoryTotals }) => (
                    <DailyExpenseItem
                      key={date}
                      date={date}
                      totalAmount={totalAmount}
                      transactions={transactions}
                      categoryTotals={categoryTotals}
                      categories={categories}
                    />
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                Your expenses breakdown by category for the selected period
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
