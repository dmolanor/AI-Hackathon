// src/app/api/user/profile/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Definición del tipo PossibleValue si no está ya importado o definido globalmente
// Si ya está definido en otro lugar (ej. onboarding/route.ts) y es accesible, no necesitas redefinirlo.
// Por simplicidad, lo redefiniré aquí si este archivo es independiente.
type PossibleValue = string | number | boolean | string[] | null | undefined;

export async function GET() {
  // await the cookies store before using it
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
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // ignore in server component context
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // ignore in server component context
          }
        },
      },
    }
  );

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authorized or user not found' }, { status: 401 });
    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        username,
        full_name,
        country,
        city,
        age,
        cv_url,
        linkedin_url
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({
          id: user.id,
          email: user.email,
          phone: user.phone,
          username: null,
          full_name: null,
          country: null,
          city: null,
          age: null,
          cv_url: null,
          linkedin_url: null,
          passion_aligns_work: null,
          goals_if_no_money: null,
          definition_of_success: null,
          industry: null,
          problem_to_solve: null,
          business_type: null,
          passion_project_description: null,
          time_management: null,
          communication_sales: null,
          leadership: null,
          financial_knowledge: null,
          digital_skills: null,
          problem_solving: null,
          learning_investment: null,
          education_level: null,
          skills_to_develop: null,
        }, { status: 200 });
      }
      return NextResponse.json({ error: 'Failed to fetch profile data', details: profileError.message }, { status: 500 });
    }

    if (!profileData) {
      return NextResponse.json({
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: null,
        full_name: null,
        country: null,
        city: null,
        age: null,
        cv_url: null,
        linkedin_url: null,
        passion_aligns_work: null,
        goals_if_no_money: null,
        definition_of_success: null,
        industry: null,
        problem_to_solve: null,
        business_type: null,
        passion_project_description: null,
        time_management: null,
        communication_sales: null,
        leadership: null,
        financial_knowledge: null,
        digital_skills: null,
        problem_solving: null,
        learning_investment: null,
        education_level: null,
        skills_to_develop: null,
      }, { status: 200 });
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      ...profileData,
    };

    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // ignore in server component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // ignore in server component
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const updatedData = await request.json();
    const { phone, ...profileUpdates } = updatedData;

    // handle phone update
    let authErr = null;
    if (phone !== undefined && phone !== user.phone) {
      const { error } = await supabase.auth.updateUser({ phone });
      authErr = error;
    }

    // filter allowed fields
    const allowed = [
      'full_name','country','city','age','cv_url','linkedin_url',
      'passion_aligns_work','goals_if_no_money','definition_of_success',
      'industry','problem_to_solve','business_type','passion_project_description',
      'time_management','communication_sales','leadership','financial_knowledge',
      'digital_skills','problem_solving','learning_investment','education_level',
      'skills_to_develop'
    ];
    const updates: Record<string, PossibleValue> = {};
    for (const k of allowed) {
      if (profileUpdates[k] !== undefined) updates[k] = profileUpdates[k];
    }

    let profileData: Record<string, PossibleValue> | null = null;
    let profileErr = null;

    if (Object.keys(updates).length) {
      const res = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      profileData = res.data;
      profileErr = res.error;
    } else {
      const res = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profileData = res.data;
      profileErr = res.error;
    }

    if (authErr || profileErr) {
      const details = [
        authErr?.message && `Auth error: ${authErr.message}`,
        profileErr?.message && `Profile error: ${profileErr.message}`,
      ].filter(Boolean).join('; ');
      return NextResponse.json({ error: 'Failed to update profile', details }, { status: 500 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      phone: phone ?? user.phone,
      ...(profileData || {})
    }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request data';
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 400 });
  }
}
