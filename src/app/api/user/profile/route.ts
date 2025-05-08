import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('API /api/user/profile: User from cookie:', user);
    console.log('API /api/user/profile: Error from getUser:', userError);

    if (userError || !user) {
      console.error('Error fetching user or no user:', userError);
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
        linkedin_url,
        passion_aligns_work,
        goals_if_no_money,
        definition_of_success,
        industry,
        problem_to_solve,
        business_type,
        passion_project_description,
        time_management,
        communication_sales,
        leadership,
        financial_knowledge,
        digital_skills,
        problem_solving,
        learning_investment,
        education_level,
        skills_to_develop
      `)
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError);
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
      console.warn('Profile data not found (profileData is null after error checks), returning default structure.');
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
    console.error('Unexpected error in GET /api/user/profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'An unexpected error occurred', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const updatedData = await request.json();
    
    const { phone, ...profileUpdates } = updatedData;

    let authUpdateError = null;
    if (phone !== undefined && phone !== user.phone) { 
        const { error } = await supabase.auth.updateUser({ phone });
        authUpdateError = error;
    }
    
    if (profileUpdates.username) delete profileUpdates.username;
    if (profileUpdates.email) delete profileUpdates.email;

    // Ensure only actual profile fields are passed to update
    const allowedProfileFields = [
      'full_name', 'country', 'city', 'age', 'cv_url', 'linkedin_url',
      'passion_aligns_work', 'goals_if_no_money', 'definition_of_success',
      'industry', 'problem_to_solve', 'business_type', 'passion_project_description',
      'time_management', 'communication_sales', 'leadership', 'financial_knowledge',
      'digital_skills', 'problem_solving', 'learning_investment', 'education_level',
      'skills_to_develop'
    ];
    
    const filteredProfileUpdates: { [key: string]: string | number | boolean | null } = {};
    for (const key of allowedProfileFields) {
      if (profileUpdates[key] !== undefined) {
        filteredProfileUpdates[key] = profileUpdates[key];
      }
    }

    let profileUpdateError = null;
    let updatedProfileData = null;

    if (Object.keys(filteredProfileUpdates).length > 0) {
        const { data, error } = await supabase
            .from('user_profiles')
            .update(filteredProfileUpdates)
            .eq('user_id', user.id)
            .select()
            .single();
        profileUpdateError = error;
        updatedProfileData = data;
    } else {
        // If only phone was updated, fetch current profile to return consistent data
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
        profileUpdateError = error; // This could be an error if profile doesn't exist
        updatedProfileData = data;
    }

    if (authUpdateError || profileUpdateError) {
      console.error('Error updating profile:', { authUpdateError, profileUpdateError });
      const errors = [];
      if (authUpdateError) errors.push(`Auth update error: ${authUpdateError.message}`);
      if (profileUpdateError) errors.push(`Profile update error: ${profileUpdateError.message}`);
      return NextResponse.json({ error: 'Failed to update profile', details: errors.join('; ') }, { status: 500 });
    }
    
    // Combine results: if profile was updated, use that, otherwise use existing profile data
    // with potentially updated auth info (like phone, which Supabase handles directly on user object)
    const finalUserData = {
        id: user.id,
        email: user.email, // Email doesn't change here
        phone: phone !== undefined ? phone : user.phone, // Reflect new phone if updated
        ...(updatedProfileData || {}), // Spread the profile data
    };

    return NextResponse.json(finalUserData, { status: 200 });
  } catch (error) {
    console.error('Error processing PUT /api/user/profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request data or unexpected error';
    return NextResponse.json({ error: 'Invalid request data or unexpected error', details: errorMessage }, { status: 400 });
  }
} 