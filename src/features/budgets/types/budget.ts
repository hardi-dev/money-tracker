import { z } from 'zod'
import { budgetSchema, budgetFormSchema } from '../schemas/budget.schema'

export type BudgetRecurrenceInterval = 'weekly' | 'monthly' | 'yearly'
export type BudgetAlertType = 'warning' | 'danger'

export type Budget = z.infer<typeof budgetSchema>
export type BudgetFormData = z.infer<typeof budgetFormSchema>

export type BudgetProgress = {
  budgetId: string
  spent: number
  remaining: number
  percentage: number
  isOverBudget: boolean
}

export type BudgetAlert = {
  budgetId: string
  type: BudgetAlertType
  message: string
  percentage: number
}
