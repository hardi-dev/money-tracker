'use client'

import { useCallback } from 'react'
import { useToast } from '@/components/hooks/use-toast'
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from '../actions/transaction'
import type { Transaction, TransactionForm, TransactionFilters } from '../schemas/transaction.schema'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

type UpdateTransactionParams = {
  id: string
  data: TransactionForm
}

type TransactionError = {
  message: string
}

export function useTransactions(filters?: TransactionFilters) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await getTransactions(filters)
      if (!response.success) throw response.error
      return response.data || []
    },
  })

  const invalidateTransactions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  }, [queryClient])

  const { mutateAsync: createTransactionMutation } = useMutation<
    Transaction,
    TransactionError,
    TransactionForm
  >({
    mutationFn: async (data) => {
      const response = await createTransaction(data)
      if (!response.success) throw response.error
      return response.data
    },
    onSuccess: () => {
      invalidateTransactions()
      toast({
        description: 'Transaction created successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error.message || 'Failed to create transaction',
      })
    },
  })

  const { mutateAsync: updateTransactionMutation } = useMutation<
    Transaction,
    TransactionError,
    UpdateTransactionParams
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateTransaction(id, data)
      if (!response.success) throw response.error
      return response.data
    },
    onSuccess: () => {
      invalidateTransactions()
      toast({
        description: 'Transaction updated successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error.message || 'Failed to update transaction',
      })
    },
  })

  const { mutateAsync: deleteTransactionMutation } = useMutation<
    void,
    TransactionError,
    string
  >({
    mutationFn: async (id) => {
      const response = await deleteTransaction(id)
      if (!response.success) throw response.error
    },
    onSuccess: () => {
      invalidateTransactions()
      toast({
        description: 'Transaction deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error.message || 'Failed to delete transaction',
      })
    },
  })

  const addTransaction = useCallback(
    (data: TransactionForm) => createTransactionMutation(data),
    [createTransactionMutation]
  )

  const editTransaction = useCallback(
    (id: string, data: TransactionForm) =>
      updateTransactionMutation({ id, data }),
    [updateTransactionMutation]
  )

  const removeTransaction = useCallback(
    (id: string) => deleteTransactionMutation(id),
    [deleteTransactionMutation]
  )

  return {
    transactions,
    isLoading,
    addTransaction,
    editTransaction,
    removeTransaction,
  }
}
