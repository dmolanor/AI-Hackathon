// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookiesRead = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookiesRead.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        })),
        setAll: () => {
          // No hace nada, las cookies se gestionan en middleware
        },
      },
    }
  )
}