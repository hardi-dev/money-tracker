import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardBottomNav } from './dashboard-bottom-nav'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {/* Fixed Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex h-[100vh] pt-14">
        {/* Desktop sidebar */}
        <DashboardSidebar className="hidden border-r md:block" />

        {/* Main content */}
        <main className="flex-1 w-full overflow-y-auto">
          <div className="container max-w-screen-2xl py-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardBottomNav />
    </>
  )
}
