import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { useBudgets } from '@/features/budgets/hooks/use-budgets'
import { startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'

export function useDashboard() {
  const { transactions } = useTransactions()
  const { budgets } = useBudgets()

  // Get current month's data
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  // Get last month's data
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(
    (t) => {
      const date = parseISO(t.date)
      return date >= currentMonthStart && date <= currentMonthEnd
    }
  )

  // Filter transactions for last month
  const lastMonthTransactions = transactions.filter(
    (t) => {
      const date = parseISO(t.date)
      return date >= lastMonthStart && date <= lastMonthEnd
    }
  )

  // Calculate current month totals
  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate last month totals
  const lastMonthIncome = lastMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const lastMonthExpenses = lastMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate percentages
  const incomePercentageChange = lastMonthIncome === 0 
    ? 100 
    : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100

  const expensePercentageChange = lastMonthExpenses === 0
    ? 100
    : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100

  // Calculate total balance
  const totalBalance = transactions
    .reduce((sum, t) => {
      return t.type === 'INCOME' 
        ? sum + t.amount 
        : sum - t.amount
    }, 0)

  // Get active budgets
  const activeBudgets = budgets.filter(b => !b.deleted_at)
  const budgetsNearLimit = activeBudgets.filter(budget => {
    const budgetTransactions = currentMonthTransactions
      .filter(t => t.category_id === budget.category_id)
      .reduce((sum, t) => sum + t.amount, 0)
    
    return (budgetTransactions / budget.amount) >= 0.8 // 80% or more of budget used
  })

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    currentMonthIncome,
    currentMonthExpenses,
    totalBalance,
    incomePercentageChange,
    expensePercentageChange,
    activeBudgets: activeBudgets.length,
    budgetsNearLimit: budgetsNearLimit.length,
    recentTransactions,
    transactions: currentMonthTransactions,
  }
}
