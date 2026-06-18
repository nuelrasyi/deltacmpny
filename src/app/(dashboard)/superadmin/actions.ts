'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@/utils/supabase/server'

export async function getCompanyProfile() {
  const { data, error } = await supabaseAdmin
    .from('company_profiles')
    .select('*, logo:media_assets(id, url, filename)')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching company profile:', error)
    return null
  }
  return data
}

export async function updateCompanyProfile(formData: FormData) {
  const name = formData.get('name') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string
  const description = formData.get('description') as string
  const about_us = formData.get('about_us') as string | null
  const logo_id = formData.get('logo_id') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const updateData: any = {
    name,
    whatsapp_number,
    email,
    address,
    description,
    ...(about_us !== null && { about_us }),
    updated_at: new Date().toISOString()
  }

  if (logo_id) {
    updateData.logo_id = logo_id
  }

  const { error } = await supabaseAdmin
    .from('company_profiles')
    .upsert({ id: 1, ...updateData })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin')
  revalidatePath('/', 'layout')
  return { success: true }
}
