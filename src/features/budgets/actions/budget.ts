'use server'

import { createClient } from '@/lib/supabase/server'
import { type BudgetFormData, type BudgetAlert } from '../types/budget'
import { budgetFormSchema } from '../schemas/budget.schema'
import { revalidatePath } from 'next/cache'

export async function createBudget(data: BudgetFormData) {
  try {
    // Validate input data
    const validatedData = budgetFormSchema.parse(data)

    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Create budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert([
        {
          ...validatedData,
          user_id: session.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { success: true, data: budget }
  } catch (error) {
    console.error('Error creating budget:', error)
    return { success: false, error }
  }
}

export async function updateBudget(id: string, data: BudgetFormData) {
  try {
    // Validate input data
    const validatedData = budgetFormSchema.parse(data)

    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Update budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { success: true, data: budget }
  } catch (error) {
    console.error('Error updating budget:', error)
    return { success: false, error }
  }
}

export async function deleteBudget(id: string) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Delete budget
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { success: true }
  } catch (error) {
    console.error('Error deleting budget:', error)
    return { success: false, error }
  }
}

export async function getBudgets() {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Get budgets with category details
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories (
          id,
          name,
          type
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: budgets }
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return { success: false, error }
  }
}

export async function getBudgetProgress(budgetId: string) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Get budget details
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .eq('user_id', session.user.id)
      .single()

    if (budgetError) throw budgetError

    // Get sum of transactions for this budget's category within the budget period
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('category_id', budget.category_id)
      .eq('user_id', session.user.id)
      .gte('date', budget.start_date)
      .lte('date', budget.end_date)

    if (transactionsError) throw transactionsError

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
    const remaining = budget.amount - spent
    const percentage = (spent / budget.amount) * 100

    return {
      success: true,
      data: {
        budgetId,
        spent,
        remaining,
        percentage,
        isOverBudget: spent > budget.amount
      }
    }
  } catch (error) {
    console.error('Error calculating budget progress:', error)
    return { success: false, error }
  }
}

export async function getBudgetAlerts() {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Get active budgets
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories (
          name,
          type
        )
      `)
      .eq('user_id', session.user.id)
      .gte('end_date', new Date().toISOString())

    if (error) throw error

    const alerts: BudgetAlert[] = []
    
    for (const budget of budgets) {
      const progressResult = await getBudgetProgress(budget.id)
      if (!progressResult.success || !progressResult.data) continue

      const { percentage, isOverBudget } = progressResult.data
      
      if (percentage >= (budget.notification_threshold || 80)) {
        alerts.push({
          budgetId: budget.id,
          type: isOverBudget ? 'danger' : 'warning',
          message: `${budget.category.name} budget is ${isOverBudget ? 'exceeded' : 'nearly reached'}`,
          percentage
        } satisfies BudgetAlert)
      }
    }

    return { success: true, data: alerts }
  } catch (error) {
    console.error('Error fetching budget alerts:', error)
    return { success: false, error }
  }
}
