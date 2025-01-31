import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/utils'

interface CategoryExpense {
  category: string
  amount: number
}

interface CategoryReportsTabProps {
  categoryExpensesList: CategoryExpense[]
}

export function CategoryReportsTab({ categoryExpensesList }: CategoryReportsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>
          Your expenses breakdown by category for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {categoryExpensesList.map(({ category, amount }) => (
              <div key={category} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <span className="font-medium">{category}</span>
                <span className="text-muted-foreground">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
