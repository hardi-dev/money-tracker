import { useCallback, useState } from 'react'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { type ReportFilters, type ReportData } from '../types/report'
import { generateReportData } from '../utils/report-utils'

export function useReports(): { reportData: ReportData, filters: ReportFilters, updateFilters: (newFilters: Partial<ReportFilters>) => void } {
  const [filters, setFilters] = useState<ReportFilters>({})
  const { transactions } = useTransactions()

  const reportData: ReportData = generateReportData(transactions, filters)

  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  return {
    reportData,
    filters,
    updateFilters,
  }
}
