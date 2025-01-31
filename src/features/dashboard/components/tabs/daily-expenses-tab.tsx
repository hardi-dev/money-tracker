import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion } from '@/components/ui/accordion'
import { DailyExpenseItem } from '../daily-expense-item'
import { Category } from '@/types/database.types'
import { Transaction } from '@/features/transactions/types/transaction'

interface DailyExpense {
  date: string
  totalAmount: number
  transactions: Transaction[]
  categoryTotals: Record<string, number>
}

interface DailyExpensesTabProps {
  dailyExpensesList: DailyExpense[]
  categories: Category[]
}

export function DailyExpensesTab({ dailyExpensesList, categories }: DailyExpensesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Expenses</CardTitle>
        <CardDescription>
          Your expenses breakdown by day for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <ScrollArea className="h-[calc(100vh-15rem)] md:h-[600px] pr-0 md:pr-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {dailyExpensesList.map(({ date, totalAmount, transactions, categoryTotals }) => (
              <DailyExpenseItem
                key={date}
                date={date}
                totalAmount={totalAmount}
                transactions={transactions}
                categoryTotals={categoryTotals}
                categories={categories}
              />
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
