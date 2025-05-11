// src/app/layout.tsx
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '600', '700']
})

// Navbar height approximation
const NAVBAR_HEIGHT_PX = 64;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es" className={`${inter.variable}`}>
      <head />
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <Navbar user={user} />
        
        <main 
          className="flex-1 w-full"
          style={{ paddingTop: `${NAVBAR_HEIGHT_PX}px` }}
        >
          {children}
        </main>

        <Footer />

        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/51959319349"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-full drop-shadow-lg hover:scale-110 transition-transform"
          aria-label="Soporte por WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#25D366"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12a11.95 11.95 0 001.775 6.228L0 24l6.239-1.758A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.638 17.284c-.237.662-1.376 1.304-1.9 1.344-.487.04-1.096.057-3.505-.72-2.943-1.034-4.846-4.208-5-4.407-.155-.199-1.188-1.584-1.188-3.02s.75-2.14 1.019-2.44c.267-.3.59-.375.787-.375.196 0 .393.002.566.01.182.008.427-.07.668.51.237.579.804 1.948.875 2.087.07.14.117.306.022.505-.096.199-.144.32-.283.494s-.299.396-.427.532c-.14.14-.285.29-.124.568.159.277.707 1.17 1.517 1.893 1.044.93 1.922 1.22 2.2 1.36.278.14.437.117.6-.07.163-.186.688-.8.874-1.075.183-.273.366-.226.622-.135.255.092 1.61.76 1.884.897.273.14.455.204.522.318.067.115.067.662-.17 1.324z" />
          </svg>
        </a>
      </body>
    </html>
  )
}
