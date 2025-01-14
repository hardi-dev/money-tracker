'use client'

import { useState } from 'react'
import { type Budget, type BudgetFormData } from '../types/budget'
import { useBudgets } from '../hooks/use-budgets'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { BudgetForm } from './budget-form'
import { formatCurrency, formatDateRange } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'

export function BudgetList() {
  const { budgets, progress, loading, create, update, remove } = useBudgets()
  const [editBudget, setEditBudget] = useState<Budget | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  const handleCreate = async (data: BudgetFormData) => {
    try {
      await create(data)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to create budget:', error)
    }
  }

  const handleUpdate = async (data: BudgetFormData) => {
    try {
      if (!editBudget) return
      await update(editBudget.id, data)
      setEditBudget(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to update budget:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
    } catch (error) {
      console.error('Failed to delete budget:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <BudgetForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const budgetProgress = progress[budget.id]
          const percentage = budgetProgress?.percentage || 0
          const spent = budgetProgress?.spent || 0

          return (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{budget.category?.name}</span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditBudget(budget)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <BudgetForm
                          defaultValues={{
                            category_id: budget.category_id,
                            amount: budget.amount,
                            start_date: budget.start_date,
                            end_date: budget.end_date,
                          }}
                          onSubmit={handleUpdate}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this budget? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(budget.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
                <CardDescription>
                  {budget.start_date && budget.end_date
                    ? `Budget for ${formatDateRange(budget.start_date, budget.end_date)}`
                    : 'One-time Budget'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: {formatCurrency(spent)}</span>
                    <span>Budget: {formatCurrency(budget.amount)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {percentage.toFixed(1)}% used
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
