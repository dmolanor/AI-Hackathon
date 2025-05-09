// src/app/api/community/recommendations/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { 
          try { cookieStore.set(name, value, options); } catch { /* dev-ignore */ }
        },
        remove(name: string, options: CookieOptions) { 
          try { cookieStore.set(name, '', options); } catch { /* dev-ignore */ }
        },
      },
    }
  );

  const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

  // Authentication is optional for a basic placeholder, but good for consistency
  if (authError || !currentUser) {
    // For a public recommendations placeholder, you might allow unauthenticated access
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Placeholder: Fetch a few users (e.g., limit 3, excluding current user if authenticated)
    let usersQuery = supabase
      .from('user_profiles')
      .select('id, username, full_name, email, avatar_url, headline'); // Adjust fields as needed
    
    if (currentUser) {
      usersQuery = usersQuery.neq('id', currentUser.id);
    }
    
    const { data: recommendedUsers, error: usersError } = await usersQuery.limit(3);

    if (usersError) {
      console.error('Error fetching recommended users (placeholder):', usersError);
      // Don't fail entirely, try to fetch projects or return empty
    }

    // Placeholder: Fetch a few projects (e.g., limit 3, excluding current user's projects if authenticated)
    let projectsQuery = supabase
      .from('projects')
      .select('*, user_profiles(username, full_name)'); // Adjust fields as needed

    if (currentUser) {
        projectsQuery = projectsQuery.neq('user_id', currentUser.id);
    }

    const { data: recommendedProjects, error: projectsError } = await projectsQuery
        .order('created_at', { ascending: false }) // Or some other ordering for variety
        .limit(3);

    if (projectsError) {
      console.error('Error fetching recommended projects (placeholder):', projectsError);
      // Don't fail entirely if users were fetched
    }

    return NextResponse.json({
      users: recommendedUsers || [],
      projects: recommendedProjects || [],
    }, { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error processing GET /api/community/recommendations:', e);
    return NextResponse.json({ error: 'Unexpected server error in recommendations', details: message }, { status: 500 });
  }
} 