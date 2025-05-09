// src/app/api/projects/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// import { z } from 'zod'; // z will be unused after removing schema

// Esquema para la validación de la creación de proyectos (REMOVED)
// const projectSchema = z.object({ ... });

// GET /api/projects - Obtener proyectos (con filtros opcionales)
export async function GET(request: Request) {
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
            cookieStore.set(name, value, options);
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (_error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const searchTerm = searchParams.get('search');
  const industryFilter = searchParams.get('industry');
  const skillsParam = searchParams.get('skills');

  try {
    let query = supabase
      .from('projects')
      .select('*, user_profiles(username, full_name)'); // Adjust selection as needed

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    if (industryFilter) {
      query = query.eq('industry', industryFilter);
    }

    if (skillsParam) {
      const skillsArray = skillsParam.split(',').map(skill => skill.trim()).filter(skill => skill);
      if (skillsArray.length > 0) {
        query = query.overlaps('required_skills', skillsArray);
      }
    }
    
    // Add pagination, ordering as needed
    query = query.order('created_at', { ascending: false }).limit(50);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error processing GET /api/projects:', e);
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 });
  }
}

// POST /api/projects - Crear un nuevo proyecto
export async function POST(request: Request) {
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
            cookieStore.set(name, value, options);
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (_error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectData = await request.json();
    
    // Basic validation (can be expanded with a library like Zod)
    if (!projectData.title || !projectData.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newProject = {
      user_id: user.id,
      title: projectData.title,
      description: projectData.description,
      industry: projectData.industry, // Optional
      required_skills: projectData.required_skills, // Optional, assuming array of text
      status: projectData.status || 'idea', // Optional, default to 'idea'
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error processing POST /api/projects:', e);
    return NextResponse.json({ error: 'Invalid request data', details: message }, { status: 400 });
  }
} 