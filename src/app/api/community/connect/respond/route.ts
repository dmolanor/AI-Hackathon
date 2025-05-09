import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
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

  if (authError || !currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { requesterId, action } = await request.json();

    if (!requesterId) {
      return NextResponse.json({ error: 'requesterId is required' }, { status: 400 });
    }
    if (!action || (action !== 'accept' && action !== 'reject')) {
      return NextResponse.json({ error: "Invalid action. Must be 'accept' or 'reject'." }, { status: 400 });
    }

    // Find the pending connection request where currentUser is user_id_2 and requesterId is user_id_1
    const { data: connectionRequest, error: findError } = await supabase
      .from('user_connections')
      .select('id, status')
      .eq('user_id_1', requesterId)
      .eq('user_id_2', currentUser.id)
      .eq('status', 'pending')
      .single(); // Expecting only one such request

    if (findError || !connectionRequest) {
      if (findError && findError.code === 'PGRST116') { // PGRST116: Row not found
          return NextResponse.json({ error: 'Pending connection request not found' }, { status: 404 });
      }
      console.error('Error finding connection request:', findError);
      return NextResponse.json({ error: 'Failed to find connection request', details: findError?.message }, { status: 500 });
    }

    let updatedConnectionData;
    if (action === 'accept') {
      updatedConnectionData = {
        status: 'connected',
        accepted_at: new Date().toISOString(),
      };
    } else { // action === 'reject'
      updatedConnectionData = {
        status: 'rejected',
        // Optionally, you could clear accepted_at or add a rejected_at timestamp
      };
    }

    const { data: updatedConnection, error: updateError } = await supabase
      .from('user_connections')
      .update(updatedConnectionData)
      .eq('id', connectionRequest.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating connection request:', updateError);
      return NextResponse.json({ error: 'Failed to update connection request', details: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedConnection, { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON payload', details: message }, { status: 400 });
    }
    console.error('Error processing PUT /api/community/connect/respond:', e);
    return NextResponse.json({ error: 'Unexpected server error', details: message }, { status: 500 });
  }
} 