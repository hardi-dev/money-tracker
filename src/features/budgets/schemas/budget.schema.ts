import { z } from 'zod'

const categorySchema = z.object({
  id: z.string(),
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

export const budgetSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  category_id: z.string({
    required_error: 'Category is required',
  }),
  amount: z.number().positive('Amount must be positive'),
  start_date: z.string({
    required_error: 'Start date is required',
  }),
  end_date: z.string({
    required_error: 'End date is required',
  }),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
  category: categorySchema.optional(),
})

export const budgetFormSchema = budgetSchema
  .pick({
    category_id: true,
    amount: true,
    start_date: true,
    end_date: true,
  })
  .extend({
    amount: z.union([
      z.string().transform((val) => Number(val)),
      z.number(),
    ]).refine((val) => val > 0, {
      message: 'Amount must be positive',
    }),
  })
