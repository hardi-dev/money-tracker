'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginFormData, RegisterFormData } from '../types/auth'

export async function signIn(data: LoginFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: { message: error.message } }
  }

  redirect('/dashboard')
}

export async function signUp(data: RegisterFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: { message: error.message } }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: { message: error.message } }
  }

  // Clear all cookies
  for (const cookie of cookieStore.getAll()) {
    cookieStore.delete(cookie.name)
  }

  redirect('/login')
}
