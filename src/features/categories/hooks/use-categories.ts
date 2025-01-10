'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/database.types'
import { CategoryFilters, CategoryFormData } from '../types/category'

export function useCategories() {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  const fetchCategories = useCallback(async (filters?: CategoryFilters) => {
    try {
      setIsLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('No user found')

      let query = supabase.from('categories').select('*')

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      query = query.eq('user_id', session.user.id)

      const { data, error } = await query.order('name')

      if (error) throw error
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (data: CategoryFormData) => {
    try {
      setIsLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('No user found')

      const { error } = await supabase.from('categories').insert([
        {
          ...data,
          user_id: session.user.id
        }
      ])
      if (error) throw error
      await fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: string, data: CategoryFormData) => {
    try {
      setIsLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('No user found')

      const { error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      await fetchCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.user) throw new Error('No user found')

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchCategories])

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
