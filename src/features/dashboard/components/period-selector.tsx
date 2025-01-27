import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRange {
  from: Date
  to: Date
}

interface PeriodSelectorProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export function PeriodSelector({ 
  dateRange,
  onDateRangeChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => {
              if (date) {
                onDateRangeChange({
                  from: date,
                  to: dateRange.to < date ? date : dateRange.to
                })
              }
            }}
            defaultMonth={dateRange.from}
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">to</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.to, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={dateRange.to}
            onSelect={(date) => {
              if (date) {
                onDateRangeChange({
                  from: dateRange.from > date ? date : dateRange.from,
                  to: date
                })
              }
            }}
            defaultMonth={dateRange.to}
            fromDate={dateRange.from}
          />
        </PopoverContent>
      </Popover>

      <Select
        onValueChange={(value) => {
          const today = new Date()
          switch (value) {
            case "today":
              onDateRangeChange({ from: today, to: today })
              break
            case "this-week": {
              const monday = new Date(today)
              monday.setDate(today.getDate() - today.getDay() + 1)
              onDateRangeChange({ from: monday, to: today })
              break
            }
            case "this-month": {
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
              onDateRangeChange({ from: firstDay, to: today })
              break
            }
            case "this-year": {
              const firstDay = new Date(today.getFullYear(), 0, 1)
              onDateRangeChange({ from: firstDay, to: today })
              break
            }
          }
        }}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Quick select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
