'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const DIL_DOMAIN = '@dil.internal'

export async function loginWithIdCard(formData: FormData) {
  const idCard = formData.get('idCard') as string
  const password = formData.get('password') as string

  if (!idCard || !password) {
    return { error: 'ID dan Password wajib diisi' }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Konversi ID menjadi email dummy
  const email = idCard.includes('@') ? idCard : `${idCard}${DIL_DOMAIN}`

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'ID atau Password salah' }
  }

  // Cek role user di tabel public.users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (userError || !userData) {
    // Jika tidak ada di tabel users (mungkin data tidak sinkron), paksa logout
    await supabase.auth.signOut()
    return { error: 'Akun tidak terdaftar secara resmi di sistem' }
  }

  const role = userData.role

  // Arahkan ke dashboard sesuai role
  if (role === 'superadmin') {
    redirect('/superadmin')
  } else {
    redirect('/admin')
  }
}

// KHUSUS SUPERADMIN: Mendaftarkan admin baru
export async function registerNewAdmin(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Verifikasi bahwa yang memanggil ini adalah superadmin
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return { error: 'Unauthorized' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (currentUser?.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat mendaftarkan admin baru' }
  }

  const rawIdCard = formData.get('idCard') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string

  if (!rawIdCard || !name || !password) {
    return { error: 'Semua field (Nama, ID, Password) wajib diisi' }
  }

  const idCard = `DIL-${rawIdCard.trim()}`
  const email = `${idCard}${DIL_DOMAIN}`

  // Gunakan supabaseAdmin (Service Role) untuk membuat user melewati RLS tanpa me-logout superadmin
  const { data: newUserAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return { error: `Gagal membuat auth: ${authError.message}` }
  }

  if (newUserAuth.user) {
    // Update tabel public.users (karena trigger on_auth_user_created kemungkinan sudah membuat barisnya)
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        email: email,
        name: name,
        role: 'admin' // Role default
      })
      .eq('id', newUserAuth.user.id)

    if (dbError) {
      // Rollback jika gagal insert ke database
      await supabaseAdmin.auth.admin.deleteUser(newUserAuth.user.id)
      return { error: `Gagal menyimpan ke database: ${dbError.message}` }
    }
  }

  return { success: 'Admin berhasil didaftarkan!' }
}

export async function getAdmins() {
  // Gunakan admin client untuk membypass RLS, karena saat ini RLS table users menghalangi
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admins:', error)
    return []
  }

  return data
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
