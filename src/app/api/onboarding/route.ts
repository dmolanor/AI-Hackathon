import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface OnboardingPayload {
  profileUpdates?: Record<string, any>;
  testAnswers?:    Record<string, any>;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options) {
          try { cookieStore.set({ name, value: '', ...options }); } catch {}
        },
      },
    }
  );

  // 1) validate session
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;

  // 2) parse payload
  const { profileUpdates, testAnswers }: OnboardingPayload = await request.json();

  // 3) update profile
  if (profileUpdates && Object.keys(profileUpdates).length) {
    const { error: pErr } = await supabase
      .from('user_profiles')
      .update({ ...profileUpdates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }
  }

  // 4) upsert test
  let savedTest = null;
  if (testAnswers && Object.keys(testAnswers).length) {
    const { data, error: tErr } = await supabase
      .from('entrepreneurial_tests')
      .upsert({ ...testAnswers, user_id: userId }, { onConflict: 'user_id' })
      .select()
      .single();
    if (tErr) {
      return NextResponse.json({ error: tErr.message }, { status: 500 });
    }
    savedTest = data;
  }

  // 5) mark onboarding complete
  if (savedTest) {
    const { error: cErr } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (cErr) {
      return NextResponse.json({ error: cErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    testData: savedTest
  }, { status: 200 });
}
