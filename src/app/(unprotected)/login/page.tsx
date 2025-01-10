import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { LoginForm } from '@/features/auth/components/login-form'
import { signIn } from '@/features/auth/actions/auth'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email below to sign in to your account"
      isLogin
    >
      <LoginForm onSubmit={signIn} />
    </AuthLayout>
  )
}
