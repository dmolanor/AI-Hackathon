// src/app/not-found.tsx

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="text-lg text-muted-foreground">
          La página que buscas no existe
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl shadow-md hover:bg-primary/90 transition inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}