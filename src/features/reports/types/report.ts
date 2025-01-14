import { type Transaction } from '@/features/transactions/types/transaction'

export interface ReportSummary {
  totalIncome: number
  totalExpense: number
  savingsRate: number
  topCategories: {
    income: CategorySummary[]
    expense: CategorySummary[]
  }
  monthlyTrends: MonthlyTrend[]
}

export interface CategorySummary {
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expense: number
  savings: number
}

export interface ReportFilters {
  startDate?: string
  endDate?: string
  categoryIds?: string[]
  type?: 'INCOME' | 'EXPENSE'
}

export interface ReportData {
  summary: ReportSummary
  transactions: Transaction[]
}
