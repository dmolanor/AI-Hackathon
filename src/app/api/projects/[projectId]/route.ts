// src/app/api/projects/[projectId]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type ParamsPromise = Promise<{ projectId: string }>;

// Campos que permites actualizar:
interface ProjectUpdatePayload {
  title?: string;
  description?: string;
  industry?: string;
  required_skills?: string[];
  status?: 'idea' | 'developing' | 'launched';
  updated_at?: string;
}

export async function GET(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const { projectId } = await params;
  const supabase       = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from('projects')
    .select('*, user_profiles(username, full_name)')
    .eq('id', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const { projectId } = await params;
  const supabase       = createRouteHandlerClient({ cookies });
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Recupera sólo los campos permitidos del body
  const body = await request.json();
  const payload: ProjectUpdatePayload = {
    updated_at: new Date().toISOString(),
  };
  if (typeof body.title === 'string')           payload.title = body.title;
  if (typeof body.description === 'string')     payload.description = body.description;
  if (typeof body.industry === 'string')        payload.industry = body.industry;
  if (Array.isArray(body.required_skills))      payload.required_skills = body.required_skills;
  if (['idea','developing','launched'].includes(body.status))
                                                payload.status = body.status;

  // Comprueba que el proyecto exista y que el user.id coincida
  const { data: proj, error: fetchErr } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectId)
    .single();

  if (fetchErr || !proj) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  if (proj.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const { projectId } = await params;
  const supabase       = createRouteHandlerClient({ cookies });
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verifica ownership
  const { data: proj, error: fetchErr } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectId)
    .single();

  if (fetchErr || !proj) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  if (proj.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Deleted' }, { status: 200 });
}
