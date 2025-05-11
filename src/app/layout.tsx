// src/app/layout.tsx
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { Montserrat } from 'next/font/google';
import React from 'react';
import './globals.css';

// Configure Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700', '800', '900']
});

// Calculate Navbar height approximation (py-3 translates roughly to h-12/h-14 depending on content/icons)
// Let's use a safe value like 64px (16 * 4)
const NAVBAR_HEIGHT_PX = 64;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es" className={`${montserrat.variable}`}>
      <head />
      <body className="font-montserrat antialiased bg-bgMain text-foreground flex flex-col min-h-screen">
        <Navbar user={user} />
        
        <main 
          className="flex-1 w-full"
          style={{ paddingTop: `${NAVBAR_HEIGHT_PX}px` }}
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}