'use server'
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookiesRead = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () =>
          cookiesRead.getAll().map((c) => ({ name: c.name, value: c.value })),
        // En App Router no podemos escribir cookies desde server components
        setAll: () => {
          // No hace nada, las cookies se gestionan en middleware
        },
      },
    }
  )
}
