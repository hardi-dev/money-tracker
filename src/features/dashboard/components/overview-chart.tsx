import { type Transaction } from '@/features/transactions/types/transaction'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { startOfDay, format, parseISO } from 'date-fns'

interface OverviewChartProps {
  transactions: Transaction[]
}

export function OverviewChart({ transactions }: OverviewChartProps) {
  // Group transactions by date
  const transactionsByDate = transactions.reduce((acc, transaction) => {
    const date = format(startOfDay(parseISO(transaction.date)), 'MMM dd')
    
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 }
    }
    
    if (transaction.type === 'INCOME') {
      acc[date].income += transaction.amount
    } else {
      acc[date].expense += transaction.amount
    }
    
    return acc
  }, {} as Record<string, { date: string; income: number; expense: number }>)

  const data = Object.values(transactionsByDate).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#22c55e" />
        <Bar dataKey="expense" name="Expense" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
