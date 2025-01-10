import * as z from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

export const registerFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

export type RegisterFormData = z.infer<typeof registerFormSchema>

export interface AuthError {
  message: string
}
