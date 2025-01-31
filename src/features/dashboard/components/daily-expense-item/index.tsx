import { format, parseISO } from 'date-fns'
import { Wallet } from 'lucide-react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { formatCurrency } from '@/lib/utils'
import { DailyExpenseProps } from '../../types/dashboard'

/**
 * Daily expense item component that shows transactions and category totals for a specific day
 */
export function DailyExpenseItem({ date, totalAmount, transactions, categoryTotals, categories }: DailyExpenseProps) {
  return (
    <AccordionItem 
      value={date}
      className="border rounded-xl px-2 shadow-sm transition-all hover:shadow-md data-[state=open]:shadow-md data-[state=open]:bg-accent/30"
    >
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <div className="text-center flex flex-col justify-center gap-y-0">
                <div className="text-lg/4 font-bold text-primary">
                  {format(parseISO(date), 'dd')}
                </div>
                <div className="text-[10px]/3 uppercase text-primary/80 -mt-1">
                  {format(parseISO(date), 'MMM')}
                </div>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">
                {format(parseISO(date), 'EEEE')}
              </div>
              <div className="text-xs text-muted-foreground">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-red-600">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {Object.keys(categoryTotals).length} categor{Object.keys(categoryTotals).length !== 1 ? 'ies' : 'y'}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-4 pt-2">
          {/* Category Breakdown */}
          <div className="rounded-xl border bg-card/50 p-3">
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
              Category Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([categoryId, amount]) => {
                  const category = categories.find(c => c.id === categoryId)
                  const percentage = (amount / totalAmount) * 100
                  return (
                    <div key={categoryId} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full ring-2 ring-background"
                            style={{ backgroundColor: category?.color || '#94a3b8' }}
                          />
                          <span className="text-sm font-medium">
                            {category?.name || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category?.color || '#94a3b8'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
              Transactions
            </h4>
            <div className="space-y-2">
              {transactions
                .sort((a, b) => b.amount - a.amount)
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-xl border bg-card/50 p-3 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-background/20"
                        style={{ backgroundColor: transaction.category?.color || '#94a3b8' }}
                      >
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {transaction.category?.name || 'Unknown'}
                        </div>
                        {transaction.description && (
                          <div className="text-xs text-muted-foreground">
                            {transaction.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {format(parseISO(transaction.date), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
