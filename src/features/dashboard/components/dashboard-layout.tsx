import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <DashboardSidebar className="hidden border-r md:block" />
      <div className="flex w-full flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1">
          <div className="container max-w-screen-2xl py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
