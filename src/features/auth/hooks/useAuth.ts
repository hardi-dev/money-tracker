'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthError } from '../types/auth'

interface UseAuthProps<T> {
  onSubmit: (data: T) => Promise<{ error: AuthError } | undefined>
  onSuccess?: () => void
  onError?: (error: AuthError) => void
}

export function useAuth<T>({ onSubmit, onSuccess, onError }: UseAuthProps<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: T) => {
    try {
      setIsLoading(true)
      const result = await onSubmit(data)
      
      if (result?.error) {
        onError?.(result.error)
      } else {
        onSuccess?.()
        router.refresh()
      }
    } catch {
      onError?.({ message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    onSubmit: handleSubmit,
  }
}
