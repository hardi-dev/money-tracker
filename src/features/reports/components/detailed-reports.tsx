import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ReportSummary } from '../types/report'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DetailedReportsProps {
  summary: ReportSummary
}

export function DetailedReports({ summary }: DetailedReportsProps) {
  return (
    <Tabs defaultValue="monthly">
      <TabsList>
        <TabsTrigger value="monthly">Monthly Comparison</TabsTrigger>
        <TabsTrigger value="category">Category Analysis</TabsTrigger>
        <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expense</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="category" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.topCategories.income.map((category) => (
                  <div key={category.categoryId} className="flex items-center">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.categoryColor }}
                    />
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">{category.categoryName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.categoryColor,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.topCategories.expense.map((category) => (
                  <div key={category.categoryId} className="flex items-center">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.categoryColor }}
                    />
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">{category.categoryName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.categoryColor,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Savings Rate Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={summary.monthlyTrends.map((trend) => ({
                  ...trend,
                  savingsRate:
                    trend.income > 0
                      ? ((trend.income - trend.expense) / trend.income) * 100
                      : 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="savingsRate"
                  name="Savings Rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
