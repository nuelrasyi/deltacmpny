import { createClient } from '@supabase/supabase-js';

// Pastikan key ini hanya digunakan di SERVER ENVIRONMENT (seperti Server Actions atau API Routes)
// JANGAN PERNAH meng-ekspos file ini ke komponen sisi klien ('use client')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Warning: Supabase URL atau Service Role Key tidak ditemukan di environment variables.');
}

// Client khusus untuk melewati RLS dan melakukan tugas admin berat (seperti mendaftarkan user baru di balik layar)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false // Penting agar tidak menimpa sesi admin yang sedang login
  }
});
