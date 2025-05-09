// src/app/api/community/requests/route.ts
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
    // Step 1: Fetch pending connection requests FOR the current user
    // This means user.id is user_id_2 and status is 'pending'
    const { data: pendingRequests, error: requestsError } = await supabase
      .from('user_connections')
      .select('user_id_1, requested_at') // Select user_id_1 (requester) and when it was requested
      .eq('user_id_2', user.id)
      .eq('status', 'pending');

    if (requestsError) {
      console.error('Error fetching pending connection requests:', requestsError);
      return NextResponse.json({ error: 'Failed to fetch pending requests', details: requestsError.message }, { status: 500 });
    }

    if (!pendingRequests || pendingRequests.length === 0) {
      return NextResponse.json([], { status: 200 }); // No pending requests found
    }

    // Step 2: Identify the IDs of the users who sent the requests
    const requesterUserIds = pendingRequests.map(req => req.user_id_1).filter(id => id);

    if (requesterUserIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 3: Fetch profiles of these requesters
    // Adjust the select query to include fields you need for UserCard displaying a request
    const { data: requesterProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, username, full_name, email, avatar_url, headline') // Example fields
      .in('id', requesterUserIds);

    if (profilesError) {
      console.error('Error fetching requester user profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles for requesters', details: profilesError.message }, { status: 500 });
    }

    // Optionally, combine requester profile with the request details (like requested_at)
    const enrichedRequests = requesterProfiles?.map(profile => {
        const requestDetails = pendingRequests.find(req => req.user_id_1 === profile.id);
        return {
            ...profile,
            requested_at: requestDetails?.requested_at
        };
    }) || [];

    return NextResponse.json(enrichedRequests, { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error processing GET /api/community/requests:', e);
    return NextResponse.json({ error: 'Unexpected server error', details: message }, { status: 500 });
  }
} 