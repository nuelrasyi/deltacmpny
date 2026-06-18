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
  const supabase = await createClient()
  
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
