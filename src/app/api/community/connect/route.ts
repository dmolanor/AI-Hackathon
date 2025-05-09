import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    if (targetUserId === user.id) {
      return NextResponse.json({ error: 'Cannot send a connection request to yourself' }, { status: 400 });
    }

    // Check if a connection (pending or connected) already exists in either direction
    const { data: existingConnection, error: checkError } = await supabase
      .from('user_connections')
      .select('id, status')
      .or(`(user_id_1.eq.${user.id},user_id_2.eq.${targetUserId}),(user_id_1.eq.${targetUserId},user_id_2.eq.${user.id})`)
      .maybeSingle(); // Use maybeSingle as there should be at most one such record if constraint is good

    if (checkError) {
      console.error('Error checking for existing connection:', checkError);
      return NextResponse.json({ error: 'Failed to check existing connection', details: checkError.message }, { status: 500 });
    }

    if (existingConnection) {
      if (existingConnection.status === 'connected') {
        return NextResponse.json({ message: 'Already connected', status: existingConnection.status }, { status: 409 }); // Conflict
      }
      // If pending, check who initiated it.
      // If current user initiated: "Request already sent"
      // If target user initiated: "This user has already sent you a request. Please respond to it."
      // For simplicity here, we'll just say a request exists.
      return NextResponse.json({ message: 'Connection request already exists or is pending', status: existingConnection.status }, { status: 409 });
    }

    // Create new connection request
    const newConnection = {
      user_id_1: user.id, // Requester
      user_id_2: targetUserId, // Recipient
      status: 'pending',
      requested_at: new Date().toISOString(),
    };

    const { data: createdConnection, error: insertError } = await supabase
      .from('user_connections')
      .insert(newConnection)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating connection request:', insertError);
      // Check for unique constraint violation if applicable (e.g., code '23505' for PostgreSQL)
      if (insertError.code === '23505') { // Unique violation
          return NextResponse.json({ error: 'Connection request already exists (database constraint)' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create connection request', details: insertError.message }, { status: 500 });
    }

    return NextResponse.json(createdConnection, { status: 201 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON payload', details: message }, { status: 400 });
    }
    console.error('Error processing POST /api/community/connect:', e);
    return NextResponse.json({ error: 'Unexpected server error', details: message }, { status: 500 });
  }
} 