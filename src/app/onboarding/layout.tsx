// src/app/onboarding/layout.tsx
import React from 'react'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-background flex flex-col">
      {children}
    </section>
  )
}
