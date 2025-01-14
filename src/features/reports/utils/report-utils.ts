import { type Transaction } from '@/features/transactions/types/transaction'
import { type ReportFilters, type ReportData, type CategorySummary, type MonthlyTrend } from '../types/report'
import { startOfMonth, format, parseISO } from 'date-fns'

export function generateReportData(
  transactions: Transaction[],
  filters: ReportFilters,
): ReportData {
  const filteredTransactions = filterTransactions(transactions, filters)
  const summary = generateSummary(filteredTransactions)

  return {
    summary,
    transactions: filteredTransactions,
  }
}

function filterTransactions(transactions: Transaction[], filters: ReportFilters): Transaction[] {
  return transactions.filter((transaction) => {
    if (filters.startDate && transaction.date < filters.startDate) return false
    if (filters.endDate && transaction.date > filters.endDate) return false
    if (filters.categoryIds?.length && !filters.categoryIds.includes(transaction.category_id)) return false
    if (filters.type && transaction.type !== filters.type) return false
    return true
  })
}

function generateSummary(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  const categorySummaries = generateCategorySummaries(transactions)
  const monthlyTrends = generateMonthlyTrends(transactions)

  return {
    totalIncome,
    totalExpense,
    savingsRate,
    topCategories: {
      income: categorySummaries.income.slice(0, 5),
      expense: categorySummaries.expense.slice(0, 5),
    },
    monthlyTrends,
  }
}

function generateCategorySummaries(transactions: Transaction[]) {
  const categoryMap = new Map<string, CategorySummary>()

  transactions.forEach((transaction) => {
    const key = transaction.category_id
    const current = categoryMap.get(key) || {
      categoryId: transaction.category_id,
      categoryName: transaction.category?.name || '',
      categoryColor: transaction.category?.color || '#94a3b8',
      amount: 0,
      percentage: 0,
      transactionCount: 0,
    }

    categoryMap.set(key, {
      ...current,
      amount: current.amount + transaction.amount,
      transactionCount: current.transactionCount + 1,
    })
  })

  const incomeTotal = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseTotal = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const categories = Array.from(categoryMap.values())
  const income = categories
    .filter((c) => {
      const transaction = transactions.find((t) => t.category_id === c.categoryId)
      return transaction?.type === 'INCOME'
    })
    .map((c) => ({
      ...c,
      percentage: incomeTotal > 0 ? (c.amount / incomeTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  const expense = categories
    .filter((c) => {
      const transaction = transactions.find((t) => t.category_id === c.categoryId)
      return transaction?.type === 'EXPENSE'
    })
    .map((c) => ({
      ...c,
      percentage: expenseTotal > 0 ? (c.amount / expenseTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return { income, expense }
}

function generateMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
  const monthlyMap = new Map<string, MonthlyTrend>()

  transactions.forEach((transaction) => {
    const month = format(startOfMonth(parseISO(transaction.date)), 'yyyy-MM')
    const current = monthlyMap.get(month) || {
      month,
      income: 0,
      expense: 0,
      savings: 0,
    }

    if (transaction.type === 'INCOME') {
      current.income += transaction.amount
    } else {
      current.expense += transaction.amount
    }
    current.savings = current.income - current.expense

    monthlyMap.set(month, current)
  })

  return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month))
}
