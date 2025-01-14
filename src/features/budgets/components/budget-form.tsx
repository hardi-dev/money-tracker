'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { type BudgetFormData } from '../types/budget'
import { budgetFormSchema } from '../schemas/budget.schema'
import { useCategories } from '@/features/categories/hooks/use-categories'

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => Promise<void>
  defaultValues?: Partial<BudgetFormData>
}

export function BudgetForm({ onSubmit, defaultValues }: BudgetFormProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (defaultValues?.start_date && defaultValues?.end_date) {
      return {
        from: new Date(defaultValues.start_date),
        to: new Date(defaultValues.end_date),
      }
    }
    return undefined
  })

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      start_date: defaultValues?.start_date,
      end_date: defaultValues?.end_date,
      ...defaultValues,
    },
  })

  const { categories } = useCategories()
  const expenseCategories = categories.filter((category) => category.type === 'EXPENSE')

  // Update form dates when date range changes
  React.useEffect(() => {
    if (date?.from) {
      form.setValue('start_date', format(date.from, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
    }
    if (date?.to) {
      form.setValue('end_date', format(date.to, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
    }
  }, [date, form])

  const handleSubmit = async (data: BudgetFormData) => {
    if (!date?.from || !date?.to) return

    try {
      await onSubmit(data)
      form.reset()
      setDate(undefined)
    } catch (error) {
      console.error('Failed to submit budget:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (e) => console.log(e))} className="space-y-4">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter budget amount"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Date Range</FormLabel>
          <CalendarDateRangePicker
            date={date}
            onDateChange={setDate}
          />
          {(!date?.from || !date?.to) && (
            <p className="text-sm text-destructive">Please select a date range</p>
          )}
        </div>

        <Button type="submit" disabled={!date?.from || !date?.to}>
          {defaultValues ? 'Update' : 'Create'} Budget
        </Button>
      </form>
    </Form>
  )
}
