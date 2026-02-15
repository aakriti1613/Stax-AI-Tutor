import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tutor - Gamified CS Learning Platform',
  description: 'Next-generation AI-powered, gamified Computer Science learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Navigation />
        <div className="pt-16 overflow-x-hidden">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#00ffff',
              border: '1px solid #00ffff',
            },
          }}
        />
      </body>
    </html>
  )
}


