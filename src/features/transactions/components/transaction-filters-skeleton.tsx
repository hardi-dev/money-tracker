'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function TransactionFiltersSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="relative">
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-[100px]" />
    </div>
  )
}
