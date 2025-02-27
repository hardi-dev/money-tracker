import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { useBudgets } from '@/features/budgets/hooks/use-budgets'
import { 
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  parseISO,
  format,
  isWithinInterval,
} from 'date-fns'

interface DateRange {
  from: Date
  to: Date
}

interface UseDashboardOptions {
  dateRange: DateRange
}

export function useDashboard(options: UseDashboardOptions) {
  const { transactions } = useTransactions()
  const { budgets } = useBudgets()

  // Get current period data
  const now = new Date()
  const { from: periodStart, to: periodEnd } = options.dateRange

  // Get today's data
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  // Get this week's data
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  // Filter transactions for different periods
  const todayTransactions = transactions.filter(
    (t) => {
      const date = parseISO(t.date)
      return date >= todayStart && date <= todayEnd
    }
  )

  const weekTransactions = transactions.filter(
    (t) => {
      const date = parseISO(t.date)
      return date >= weekStart && date <= weekEnd
    }
  )

  const currentPeriodTransactions = transactions.filter(
    (t) => {
      const date = parseISO(t.date)
      return isWithinInterval(date, { start: periodStart, end: periodEnd })
    }
  )

  // Calculate totals for different periods
  const todayExpenses = todayTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const weekExpenses = weekTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const periodExpenses = currentPeriodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate daily expenses for analytics
  const dailyExpensesData = transactions
    .filter(t => {
      const date = parseISO(t.date)
      return t.type === 'EXPENSE' && isWithinInterval(date, { start: periodStart, end: periodEnd })
    })
    .reduce((acc, t) => {
      const date = format(parseISO(t.date), 'yyyy-MM-dd')
      if (!acc[date]) {
        acc[date] = {
          totalAmount: 0,
          transactions: [],
          categoryTotals: {}
        }
      }
      acc[date].totalAmount += t.amount
      acc[date].transactions.push(t)
      
      if (!acc[date].categoryTotals[t.category_id]) {
        acc[date].categoryTotals[t.category_id] = 0
      }
      acc[date].categoryTotals[t.category_id] += t.amount
      
      return acc
    }, {} as Record<string, {
      totalAmount: number
      transactions: typeof transactions
      categoryTotals: Record<string, number>
    }>)

  // For backwards compatibility
  const dailyExpenses = Object.entries(dailyExpensesData).reduce((acc, [date, data]) => {
    acc[date] = data.totalAmount
    return acc
  }, {} as Record<string, number>)

  // Calculate category-wise expenses for reports
  const categoryExpenses = currentPeriodTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      if (!acc[t.category_id]) acc[t.category_id] = 0
      acc[t.category_id] += t.amount
      return acc
    }, {} as Record<string, number>)

  // Get active budgets
  const activeBudgets = budgets.filter(b => !b.deleted_at)
  const budgetsNearLimit = activeBudgets.filter(budget => {
    const budgetTransactions = currentPeriodTransactions
      .filter(t => t.category_id === budget.category_id)
      .reduce((sum, t) => sum + t.amount, 0)
    
    return (budgetTransactions / budget.amount) >= 0.8
  })

  // Get recent transactions
  const recentTransactions = [...currentPeriodTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    todayExpenses,
    weekExpenses,
    periodExpenses,
    dailyExpenses,
    dailyExpensesData,
    categoryExpenses,
    activeBudgets: activeBudgets.length,
    budgetsNearLimit: budgetsNearLimit.length,
    recentTransactions,
    transactions: currentPeriodTransactions,
  }
}
