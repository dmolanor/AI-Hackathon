// src/app/layout.tsx
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import React from 'react'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <head />
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <header className="w-full bg-background shadow-sm border-b border-border">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-primary">AI-First Reinventor</span>
            </Link>
            <div className="space-x-6">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-foreground hover:text-primary transition"
                  >
                    Dashboard
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button 
                      type="submit"
                      className="text-sm font-medium text-foreground hover:text-primary transition"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-sm font-medium text-foreground hover:text-primary transition"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/onboarding"
                    className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
                  >
                    Onboarding
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="w-full bg-secondary/30 py-8 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">AI-First Reinventor</h3>
                <p className="text-sm text-muted-foreground">
                  Transformando carreras y creando oportunidades para emprendedores en la era de la IA.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Enlaces</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition">
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition">
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition">
                      Términos
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Contacto</h3>
                <p className="text-sm text-muted-foreground">
                  ¿Preguntas o sugerencias? <br />
                  <a href="mailto:info@ai-reinventor.com" className="text-primary hover:underline">
                    info@ai-reinventor.com
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              © 2025 AI-First Reinventor. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}