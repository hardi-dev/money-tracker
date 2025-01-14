'use client'

import { ReportSummary } from '@/features/reports/components/report-summary'
import { DetailedReports } from '@/features/reports/components/detailed-reports'
import { ExportOptions } from '@/features/reports/components/export-options'
import { useReports } from '@/features/reports/hooks/use-reports'
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker'
import { type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import React from 'react'

export default function ReportsPage() {
  const { reportData, updateFilters } = useReports()
  const [date, setDate] = React.useState<DateRange | undefined>()

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setDate(dateRange)
    if (!dateRange) return
    updateFilters({
      startDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined,
      endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          heading="Reports & Analytics"
          text="Analyze your financial data and track your progress"
        />
        <ExportOptions reportData={reportData} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <CalendarDateRangePicker
            date={date}
            onDateChange={handleDateRangeChange}
          />
        </CardContent>
      </Card>

      <ReportSummary summary={reportData.summary} />
      
      <DetailedReports summary={reportData.summary} />
    </div>
  )
}
