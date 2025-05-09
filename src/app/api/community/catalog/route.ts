import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

  // const { data: { user } } = await supabase.auth.getUser(); // Uncomment if needed to exclude current user

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const industryFilter = searchParams.get('industry');
  const skillsParam = searchParams.get('skills'); // Comma-separated string

  try {
    // Fetch users (user_profiles)
    let usersQuery = supabase
      .from('user_profiles')
      .select('id, username, full_name, country, city, age, linkedin_url');
      // .neq('id', user?.id || ' '); // Opcional: excluir al usuario actual

    if (searchTerm) {
      usersQuery = usersQuery.or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      // If you have other text fields in user_profiles to search, add them to the .or() string
    }
    // Note: Industry and skills filters are primarily applied to projects below.
    // If user_profiles also has these fields, similar logic can be added here.

    const { data: users, error: usersError } = await usersQuery.limit(20);

    if (usersError) {
      console.error('Error fetching users for catalog:', usersError);
      // Decide if this is a fatal error or if we can proceed to fetch projects
    }

    // Fetch projects
    let projectsQuery = supabase
      .from('projects')
      .select('*, user_profiles(username, full_name)');
      // .neq('user_id', user?.id || ' '); // Opcional: excluir proyectos del usuario actual

    if (searchTerm) {
      projectsQuery = projectsQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    if (industryFilter) {
      projectsQuery = projectsQuery.eq('industry', industryFilter);
    }

    if (skillsParam) {
      const skillsArray = skillsParam.split(',').map(skill => skill.trim()).filter(skill => skill);
      if (skillsArray.length > 0) {
        // Assuming required_skills is an array of text (text[]) in Supabase
        // Use .overlaps for array column to match if any of the skills are present
        projectsQuery = projectsQuery.overlaps('required_skills', skillsArray);
        // If you need to match ALL skills, you would use .contains, e.g.:
        // projectsQuery = projectsQuery.contains('required_skills', skillsArray);
      }
    }

    const { data: projects, error: projectsError } = await projectsQuery
      .order('created_at', { ascending: false })
      .limit(20);

    if (projectsError) {
      console.error('Error fetching projects for catalog:', projectsError);
      // Consider returning a partial success or an error
      if (usersError) { // If both failed
        return NextResponse.json({ error: 'Failed to fetch catalog data', detailsUsers: usersError.message, detailsProjects: projectsError.message }, { status: 500 });
      }
    }
    
    if (usersError && !projectsError) {
        // Partial success, projects fetched but not users
        console.warn('Partial success: Fetched projects but failed to fetch users.');
    }

    return NextResponse.json({
      users: users || [],
      projects: projects || [],
    }, { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Unexpected error in catalog API:', e);
    return NextResponse.json({ error: 'Error inesperado al obtener el catálogo', details: message }, { status: 500 });
  }
} 