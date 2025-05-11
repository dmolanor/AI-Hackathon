'use client'; // Mark as Client Component

// src/app/auth/page.tsx
import AuthForm from '@/components/AuthForm';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'login' | 'signup' | null;

  // Determine initialMode: if mode is 'signup', pass 'signup', otherwise default to 'login'
  const initialMode = mode === 'signup' ? 'signup' : 'login';

  return (
    <div className="w-full">
      <AuthForm initialMode={initialMode} />
    </div>
  )
}
