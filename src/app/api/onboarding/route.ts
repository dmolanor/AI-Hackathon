// src/app/api/onboarding/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { userId, profileData } = await request.json()

  // Inserta o actualiza el perfil en la tabla 'profiles'
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ id: userId, ...profileData }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data }, { status: 200 })
}
