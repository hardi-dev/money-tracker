import { useCallback, useEffect, useState } from 'react'
import { type BudgetFormData, type Budget, type BudgetProgress, type BudgetAlert } from '../types/budget'
import { createBudget, updateBudget, deleteBudget, getBudgets, getBudgetProgress, getBudgetAlerts } from '../actions/budget'
import { useToast } from '@/components/hooks/use-toast'

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [progress, setProgress] = useState<Record<string, BudgetProgress>>({})
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchBudgets = useCallback(async () => {
    try {
      const result = await getBudgets()
      if (!result.success || !result.data) {
        throw new Error('Failed to fetch budgets')
      }
      setBudgets(result.data)
      
      // Fetch progress for each budget
      const progressData: Record<string, BudgetProgress> = {}
      for (const budget of result.data) {
        const progressResult = await getBudgetProgress(budget.id)
        if (progressResult.success && progressResult.data) {
          progressData[budget.id] = progressResult.data
        }
      }
      setProgress(progressData)

      // Fetch alerts
      const alertsResult = await getBudgetAlerts()
      if (alertsResult.success && alertsResult.data) {
        setAlerts(alertsResult.data)
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch budgets'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const create = async (data: BudgetFormData) => {
    try {
      const result = await createBudget(data)
      if (!result.success) {
        throw result.error
      }
      toast({
        title: 'Success',
        description: 'Budget created successfully'
      })
      fetchBudgets()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create budget'
      })
      throw error
    }
  }

  const update = async (id: string, data: BudgetFormData) => {
    try {
      const result = await updateBudget(id, data)
      if (!result.success) {
        throw result.error
      }
      toast({
        title: 'Success',
        description: 'Budget updated successfully'
      })
      fetchBudgets()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update budget'
      })
      throw error
    }
  }

  const remove = async (id: string) => {
    try {
      const result = await deleteBudget(id)
      if (!result.success) {
        throw result.error
      }
      toast({
        title: 'Success',
        description: 'Budget deleted successfully'
      })
      fetchBudgets()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete budget'
      })
      throw error
    }
  }

  return {
    budgets,
    progress,
    alerts,
    loading,
    create,
    update,
    remove,
    refresh: fetchBudgets
  }
}
