// src/app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'; // Ensure this is your server client utility
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient(); // Server client
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError.message);
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=session_exchange_failed&message=${encodeURIComponent(exchangeError.message)}`);
    }
    
    // After session exchange, get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user after session exchange or user is null:', userError?.message);
      // If user is null here, it's a critical issue post-session exchange.
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=user_fetch_failed&message=${userError ? encodeURIComponent(userError.message) : 'Unknown user fetch error'}`);
    }

    // Fetch user profile to check onboarding status
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    // PGRST116 means "Row to be updated was not found" or simply "Row not found" on select.
    // This is expected for a brand new user whose profile might not have been created yet
    // or if profile creation is a separate step that hasn't completed.
    // In such cases, they should definitely go to onboarding.
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile for redirect (and not PGRST116):', profileError.message);
      // For unexpected profile errors (not PGRST116), redirect to auth with an error.
      // It's safer than sending to onboarding if there's a DB issue, for example.
      // Alternatively, could redirect to an error page or log more extensively.
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=profile_fetch_error&message=${encodeURIComponent(profileError.message)}`);
    }

    // If profile exists and onboarding_completed is true, go to dashboard.
    if (profile && profile.onboarding_completed) {
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } else {
      // If profile doesn't exist (PGRST116 error was handled, or profile is null)
      // OR if onboarding_completed is false,
      // redirect to onboarding.
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
    }

  } else {
    // Handle missing code (e.g., direct access to callback URL without a code)
    console.warn('Auth callback called without a code.');
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=missing_auth_code&message=Authentication code was not provided.`);
  }
}