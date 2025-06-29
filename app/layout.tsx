import "@/app/globals.css";
import type { Metadata } from 'next'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: 'Gurukul',
  description: 'A LMS for the modern world',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster/>
        </body>
      </html>
    </>
  )
}