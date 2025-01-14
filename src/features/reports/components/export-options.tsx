import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { type ReportData } from '../types/report'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from '@/lib/utils'

interface ExportOptionsProps {
  reportData: ReportData
}

export function ExportOptions({ reportData }: ExportOptionsProps) {
  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text('Financial Report', 14, 22)
    
    // Add summary
    doc.setFontSize(16)
    doc.text('Summary', 14, 32)
    doc.setFontSize(12)
    doc.text(`Total Income: ${formatCurrency(reportData.summary.totalIncome)}`, 14, 42)
    doc.text(`Total Expense: ${formatCurrency(reportData.summary.totalExpense)}`, 14, 52)
    doc.text(`Savings Rate: ${reportData.summary.savingsRate.toFixed(1)}%`, 14, 62)
    
    // Add transactions table
    autoTable(doc, {
      head: [['Date', 'Category', 'Type', 'Amount', 'Description']],
      body: reportData.transactions.map((t) => [
        t.date,
        t.category?.name || '',
        t.type,
        formatCurrency(t.amount),
        t.description || '',
      ]),
      startY: 70,
    })
    
    doc.save('financial-report.pdf')
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Type', 'Amount', 'Description']
    const data = reportData.transactions.map((t) => [
      t.date,
      t.category?.name || '',
      t.type,
      t.amount,
      t.description || '',
    ])

    const csvContent = [
      headers.join(','),
      ...data.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'transactions.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportToPDF} variant="outline" size="sm">
        <DownloadIcon className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button onClick={exportToCSV} variant="outline" size="sm">
        <DownloadIcon className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  )
}
