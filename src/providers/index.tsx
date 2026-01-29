import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import ReduxProvider from '@/store/Provider'
export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <SonnerProvider />
        <ReduxProvider>
            {children}
        </ReduxProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
