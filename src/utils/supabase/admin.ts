import { createClient } from '@supabase/supabase-js'

// This client bypasses RLS and should ONLY be used in secure server environments (Server Actions)
// It uses the service_role key to manage users without breaking the current session
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
