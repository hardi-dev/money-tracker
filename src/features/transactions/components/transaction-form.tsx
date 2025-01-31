'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransactions } from '../hooks/use-transactions'
import { transactionFormSchema } from '../schemas/transaction.schema'
import type { Transaction, TransactionForm as TransactionFormData } from '../schemas/transaction.schema'
import { Loader2 } from 'lucide-react'

interface TransactionFormProps {
  transaction?: Transaction
  onSuccess?: () => void
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const { addTransaction, editTransaction, isLoading } = useTransactions()
  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: transaction?.type || 'EXPENSE',
      amount: transaction?.amount,
      category_id: transaction?.category_id || '',
      description: transaction?.description || '',
      date: transaction?.date || new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (transaction?.id) {
        await editTransaction(transaction.id, data)
      } else {
        await addTransaction(data)
      }
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting transaction:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 md:h-10 text-sm md:text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Enter amount"
                    className="h-9 md:h-10 text-sm md:text-base"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || isCategoriesLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-9 md:h-10 text-sm md:text-base">
                    <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="text-sm md:text-base"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter description" 
                  className="h-9 md:h-10 text-sm md:text-base"
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="h-9 md:h-10 text-sm md:text-base"
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto h-9 md:h-10 text-sm md:text-base"
          >
            {isLoading && <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />}
            {transaction ? 'Update' : 'Create'} Transaction
          </Button>
        </div>
      </form>
    </Form>
  )
}
