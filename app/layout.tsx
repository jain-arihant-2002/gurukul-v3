import "@/app/globals.css";
import type { Metadata } from 'next'

import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "./_component/Navbar"

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
            <Navbar/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}