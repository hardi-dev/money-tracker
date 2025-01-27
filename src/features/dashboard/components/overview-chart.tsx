import { formatCurrency } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'

export function OverviewChart() {
  const { dailyExpenses } = useDashboard()

  // Convert daily expenses to chart data format
  const data = Object.entries(dailyExpenses)
    .map(([date, amount]) => ({
      date,
      expense: amount
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7) // Show last 7 days

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="expense" name="Daily Expenses" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
