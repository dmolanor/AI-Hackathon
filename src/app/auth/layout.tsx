// src/app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-headerOrange to-themeYellow py-10 px-4">
      {/* Optional: Add a container for better content presentation if needed, e.g., a card or a div with max-width */}
      {/* For now, directly rendering children to keep it simple, assuming AuthForm handles its own card-like presentation */}
      {children}
    </div>
  )
}
  