import { createAdminClient } from '@/utils/supabase/admin'; // Need an admin client for createUser
import { createClient } from '@/utils/supabase/server'; // Use server client for checks
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for input validation
const signupSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  firstName: z.string().min(1, { message: 'El nombre es requerido' }),
  lastName: z.string().min(1, { message: 'El apellido es requerido' }),
  username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }).regex(/^[a-zA-Z0-9_]+$/, { message: 'Nombre de usuario solo puede contener letras, números y guiones bajos' }),
});

export async function POST(request: Request) {
  let signupData;
  try {
    const body = await request.json();
    signupData = signupSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al leer la solicitud' }, { status: 400 });
  }

  const { email, password, firstName, lastName, username } = signupData;
  
  // Use await if createClient is async
  const supabase = await createClient(); 
  const supabaseAdmin = createAdminClient(); // Assuming createAdminClient is synchronous

  try {
    // 1. Check if username is unique in the profiles table
    //    (Assuming a 'user_profiles' table with a unique 'username' column)
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle(); // Use maybeSingle to handle null if not found

    if (profileError) {
      console.error('Error checking username:', profileError);
      return NextResponse.json({ error: 'Error interno del servidor al verificar usuario.' }, { status: 500 });
    }

    if (existingProfile) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso.' }, { status: 409 }); // 409 Conflict
    }

    // 2. If username is unique, attempt to create the user with Supabase Auth Admin
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Make sure email confirmation is required
      user_metadata: {
        full_name: fullName,
        username: username,
        // Add other default metadata if needed
      },
    });

    if (createError) {
      console.error('Supabase Admin createUser Error:', createError.message);
      // Check for specific errors like email already registered
      // Supabase admin client might return different error messages/codes than client SDK
      if (createError.message.includes('duplicate key value violates unique constraint "users_email_key"') || createError.message.toLowerCase().includes('email address already registered')) {
          return NextResponse.json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' }, { status: 409 });
      }
      // Generic internal error for other admin create user issues
      return NextResponse.json({ error: 'No se pudo crear la cuenta en este momento.' }, { status: 500 });
    }

    // 3. User created successfully (confirmation email should be sent by Supabase if enabled)
    // Optionally: Insert profile data here if not handled by triggers
    // For now, just return success
    return NextResponse.json({ message: 'Registro iniciado. Revisa tu correo para confirmar.', userId: user?.id }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
} 