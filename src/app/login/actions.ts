'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function login(formData: FormData) {
  let emailInput = formData.get('email') as string
  const password = formData.get('password') as string

  if (!emailInput || !password) {
    return { error: 'Email/ID Card dan kata sandi wajib diisi' }
  }

  // Jika input bukan email (tidak ada '@')
  if (!emailInput.includes('@')) {
    let idCard = emailInput.trim().toUpperCase()
    
    // Jika user hanya mengetik angka (misal '002'), otomatis tambahkan 'DIL-'
    if (/^\d+$/.test(idCard)) {
      idCard = `DIL-${idCard}`
    }
    
    emailInput = `${idCard}@dil.internal`
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput,
    password,
  })

  if (error) {
    return { error: 'Email/ID Card atau kata sandi tidak valid' }
  }

  // Gunakan admin client untuk mengecek role agar bypass RLS database
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const nextUrl = formData.get('next') as string

  if (userData?.role === 'superadmin') {
    revalidatePath('/superadmin', 'layout')
    redirect(nextUrl || '/superadmin')
  } else {
    revalidatePath('/admin', 'layout')
    redirect(nextUrl || '/admin')
  }
}

export async function logout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
