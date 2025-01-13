import { z } from 'zod'
import {
  transactionFilterSchema,
  transactionFormSchema,
} from '../schemas/transaction.schema'

export type TransactionType = 'INCOME' | 'EXPENSE'

export type Transaction = {
  id: string
  user_id: string
  category_id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  category?: {
    id: string
    user_id: string
    name: string
    type: TransactionType
    color: string
    icon: string | null
    description: string | null
    is_default: boolean
    created_at: string
    updated_at: string | null
    deleted_at: string | null
  }
}

export type TransactionFilters = z.infer<typeof transactionFilterSchema>
export type TransactionFormData = z.infer<typeof transactionFormSchema>
