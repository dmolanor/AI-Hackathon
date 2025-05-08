import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Caché para el cliente admin
let adminClientInstance: SupabaseClient | null = null;

export const createAdminClient = () => {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Admin Client Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
    console.error('Attempted to read NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `Found: ${supabaseUrl.substring(0,20)}...` : 'NOT FOUND');
    console.error('Attempted to read SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Found (masked)' : 'NOT FOUND');
    throw new Error('Supabase URL or Service Role Key environment variables are not set for Admin Client. Please check .env.local and restart the server.');
  }

  adminClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return adminClientInstance;
};
