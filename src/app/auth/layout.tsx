// src/app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 py-10 px-4">
      {children}
    </div>
  )
}
  