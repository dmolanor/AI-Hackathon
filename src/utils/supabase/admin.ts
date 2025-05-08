import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Nota: Asegúrate de que estas variables de entorno estén definidas en tu .env.local o en tu entorno de Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Caché para el cliente admin
let adminClientInstance: SupabaseClient | null = null;

export const createAdminClient = () => {
  if (adminClientInstance) {
    return adminClientInstance;
  }
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key environment variables are not set.');
  }
  adminClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // Importante: deshabilita autoRefreshToken con la clave de servicio
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return adminClientInstance;
};
