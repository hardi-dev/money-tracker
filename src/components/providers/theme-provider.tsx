"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ProviderProps = Parameters<typeof NextThemesProvider>[0]

export function ThemeProvider({ children, ...props }: ProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
