import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Public storefront displaying content from Firestore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        
        {/* Navigation Bar */}
        <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Brand */}
              <Link href="/" className="flex items-center space-x-2 shrink-0">
                <ShoppingBag className="h-8 w-8 text-orange-500" />
                <span className="font-bold text-xl tracking-tight">STOREFRONT</span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors">Home</Link>
                <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors">All Products</Link>
              </nav>

            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mt-16 pb-12">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm">© {new Date().getFullYear()} Storefront. All rights reserved.</p>
          </div>
        </footer>

      </body>
    </html>
  )
}
