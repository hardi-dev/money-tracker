import { z } from 'zod'

const categorySchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string(),
  icon: z.string().nullable(),
  description: z.string().nullable(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
})

export const transactionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Type is required',
    invalid_type_error: 'Type must be either INCOME or EXPENSE',
  }),
  category_id: z.string({
    required_error: 'Category is required',
  }),
  description: z.string().optional(),
  date: z.string({
    required_error: 'Date is required',
  }),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
  category: categorySchema.optional(),
})

export const transactionFormSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Type is required',
    invalid_type_error: 'Type must be either INCOME or EXPENSE',
  }),
  amount: z.union([
    z.string().transform((val) => Number(val)),
    z.number(),
  ]).refine((val) => val > 0, {
    message: 'Amount must be positive',
  }),
  category_id: z.string({
    required_error: 'Category is required',
  }),
  description: z.string().optional(),
  date: z.string({
    required_error: 'Date is required',
  }),
})

export const transactionFilterSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category_id: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  sort: z
    .object({
      field: z.enum(['amount', 'date', 'created_at', 'type', 'description']),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
})

export type Transaction = z.infer<typeof transactionSchema>
export type TransactionForm = z.infer<typeof transactionFormSchema>
export type TransactionFilters = z.infer<typeof transactionFilterSchema>
