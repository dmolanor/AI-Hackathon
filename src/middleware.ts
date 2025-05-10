// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Initialize response, cloning the request to ensure headers are passed along.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(cookie => ({ name: cookie.name, value: cookie.value }));
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Update `request.cookies` for Supabase's potential immediate re-read.
            // `request.cookies.set` typically only takes name and value.
            request.cookies.set(name, value);
            // Set the cookie on the outgoing `response` with all options.
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refrescar y verificar la sesión automáticamente en cada solicitud.
  // The primary purpose here is to trigger a session refresh if necessary,
  // which would involve the cookie store methods above.
  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};