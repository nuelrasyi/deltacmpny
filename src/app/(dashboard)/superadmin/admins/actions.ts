'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function createAdminUser(formData: FormData) {
  const name = formData.get('name') as string
  const idCard = formData.get('idCard') as string
  const password = formData.get('password') as string

  if (!name || !idCard || !password) {
    return { error: 'Semua kolom wajib diisi' }
  }

  // Generate the internal dummy email
  const email = `${idCard.trim().toUpperCase()}@dil.internal`

  const adminAuthClient = createAdminClient()

  // Create user in Supabase Auth via Admin API
  const { data, error } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto confirm since it's an internal dummy email
    user_metadata: {
      name: name,
      role: 'admin' // Force role to admin
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin/admins')
  return { success: true }
}

export async function getAdmins() {
  const supabase = supabaseAdmin
  
  // We fetch from the public.users table where role is 'admin' or 'superadmin'
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching admins:', error)
    return []
  }
  
  return data
}

export async function deleteAdminUser(id: string) {
  const adminAuthClient = createAdminClient()
  
  // Hapus user dari Auth (ini akan memicu cascade deletion di tabel users jika disetup, atau kita hapus manual jika tidak)
  const { error } = await adminAuthClient.auth.admin.deleteUser(id)
  
  if (error) {
    return { error: error.message }
  }

  // Kita juga hapus dari public.users untuk berjaga-jaga jika cascade delete tidak aktif
  await adminAuthClient.from('users').delete().eq('id', id)

  revalidatePath('/superadmin/admins')
  return { success: true }
}
