import { Category } from '@/types/database.types'
import { Transaction } from '@/features/transactions/types/transaction'

export interface DateRange {
  from: Date
  to: Date
}

export interface DailyExpenseProps {
  date: string
  totalAmount: number
  transactions: Transaction[]
  categoryTotals: Record<string, number>
  categories: Category[]
}
