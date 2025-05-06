// src/app/error.tsx
'use client'

export default function ErrorPage({ error }: { error: Error }) {
  console.error(error)
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-600">¡Oops! Algo falló</h1>
      <pre className="mt-4 text-sm text-gray-700">{error.message}</pre>
    </div>
  )
}
