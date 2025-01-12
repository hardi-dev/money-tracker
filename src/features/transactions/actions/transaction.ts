'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { transactionSchema, transactionFormSchema } from '../schemas/transaction.schema'
import type { TransactionForm } from '../schemas/transaction.schema'
import { TransactionFilters } from "../types/transaction";

export async function createTransaction(data: TransactionForm) {
  try {
    // Validate input data
    const validatedData = transactionFormSchema.parse(data)

    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Create transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([
        {
          ...validatedData,
          user_id: session.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/transactions')
    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error }
  }
}

export async function updateTransaction(id: string, data: TransactionForm) {
  try {
    // Validate input data
    const validatedData = transactionFormSchema.parse(data)

    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Update transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/transactions')
    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { success: false, error }
  }
}

export async function deleteTransaction(id: string) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Delete transaction
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    revalidatePath('/dashboard/transactions')
    return { success: true }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return { success: false, error }
  }
}

export async function getTransactions(filters?: TransactionFilters) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Build query
    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', session.user.id)
      .is('deleted_at', null)

    // Apply filters
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte('date', filters.endDate)
    }

    if (filters?.search) {
      query = query.ilike('description', `%${filters.search}%`)
    }

    // Apply sorting
    if (filters?.sort) {
      query = query.order(filters.sort.field, {
        ascending: filters.sort.direction === 'asc',
      })
    } else {
      query = query.order('date', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    // Parse data through schema to ensure type safety
    const transactions = data.map(transaction => transactionSchema.parse(transaction))

    return { success: true, data: transactions }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error }
  }
}
