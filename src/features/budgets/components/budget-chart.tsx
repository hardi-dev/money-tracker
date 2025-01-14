'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { useBudgets } from '../hooks/use-budgets'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function BudgetChart() {
  const { budgets } = useBudgets()

  const chartData = budgets.map((budget) => ({
    name: budget.category?.name || '',
    budget: budget.amount,
    spent: budget.spent || 0,
    remaining: budget.amount - (budget.spent || 0),
    color: budget.category?.color || '#94a3b8',
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Analysis</CardTitle>
        <CardDescription>
          Compare budget allocation and spending across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution" className="space-y-4">
          <TabsList>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="budget"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, value }) => `${name} (${formatCurrency(value)})`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="spending" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#94a3b8" />
                <Bar dataKey="spent" name="Spent" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
