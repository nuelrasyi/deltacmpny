import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Try to get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not logged in' });
  }

  // 1. Fetch with normal client (subject to RLS)
  const { data: normalData, error: normalError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch with admin client (bypasses RLS)
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    normal_fetch: { data: normalData, error: normalError?.message },
    admin_fetch: { data: adminData, error: adminError?.message },
    diagnosis: normalData ? 'RLS is NOT blocking.' : 'RLS IS BLOCKING! You need a policy or disable RLS.'
  });
}
