// src/app/api/community/connections/route.ts
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
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set(name, value, options); } catch { /* dev-ignore */ }
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set(name, '', options); } catch { /* dev-ignore */ }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Fetch connections for the current user where status is 'connected'
    const { data: connections, error: connectionsError } = await supabase
      .from('user_connections')
      .select('user_id_1, user_id_2')
      .eq('status', 'connected')
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);

    if (connectionsError) {
      console.error('Error fetching user connections:', connectionsError);
      return NextResponse.json({ error: 'Failed to fetch connections', details: connectionsError.message }, { status: 500 });
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json([], { status: 200 }); // No connections found
    }

    // Step 2: Identify the IDs of the other users in these connections
    const otherUserIds = connections.map(conn => {
      return conn.user_id_1 === user.id ? conn.user_id_2 : conn.user_id_1;
    }).filter(id => id !== null && id !== undefined); // Filter out any potential nulls/undefined although unlikely with FKs
    
    if (otherUserIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // Should not happen if connections were found, but as a safeguard
    }

    // Step 3: Fetch profiles of these other users
    // Adjust the select query to include fields you need for UserCard
    const { data: connectedUserProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, username, full_name, email, avatar_url, headline') // Example fields
      .in('id', otherUserIds);

    if (profilesError) {
      console.error('Error fetching connected user profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles for connections', details: profilesError.message }, { status: 500 });
    }

    return NextResponse.json(connectedUserProfiles || [], { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error processing GET /api/community/connections:', e);
    return NextResponse.json({ error: 'Unexpected server error', details: message }, { status: 500 });
  }
} 