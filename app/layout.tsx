import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroApp - Transformando la agricultura',
  description: 'Solución integral para la gestión agrícola moderna',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-gradient-to-b from-primary/20 to-background min-h-screen`}>
        <div className="bg-[url('/leaf.svg')] bg-repeat min-h-screen">
          <ThemeProvider>       
            <main>{children}</main>        
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

