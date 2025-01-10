import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { RegisterForm } from '@/features/auth/components/register-form'
import { signUp } from '@/features/auth/actions/auth'

export default async function RegisterPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your email below to create your account"
    >
      <RegisterForm onSubmit={signUp} />
    </AuthLayout>
  )
}
