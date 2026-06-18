import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const targetEmail = 'super-001@dil.internal';
  
  // 1. Ambil semua user dari Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (authError) {
    return NextResponse.json({ error: authError.message });
  }

  // 2. Cari user superadmin kita
  let superUser = authData.users.find(u => 
    u.email?.toLowerCase() === targetEmail
  );

  // 3. Jika belum ada, BUATKAN akunnya secara otomatis!
  if (!superUser) {
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: targetEmail,
      password: 'password123',
      email_confirm: true
    });

    if (createError) {
      return NextResponse.json({ error: `Gagal membuat akun Auth: ${createError.message}` });
    }
    
    superUser = newUser.user;
  }

  // 4. Paksa masukkan/perbarui data di tabel public.users menjadi superadmin
  const { error: dbError } = await supabaseAdmin.from('users').upsert({
    id: superUser.id,
    email: superUser.email,
    name: 'Superadmin Utama',
    role: 'superadmin'
  });

  if (dbError) {
    return NextResponse.json({ error: `Gagal update tabel users: ${dbError.message}` });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Perbaikan Selesai! Akun superadmin berhasil dibuat/diperbarui. Gunakan ID: SUPER-001 dan Password: password123 untuk login.' 
  });
}
