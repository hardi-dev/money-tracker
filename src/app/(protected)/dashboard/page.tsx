import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <div className="rounded-lg border bg-card p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {session.user.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          This is your dashboard. You can start tracking your finances here.
        </p>
      </div>
    </DashboardLayout>
  )
}
