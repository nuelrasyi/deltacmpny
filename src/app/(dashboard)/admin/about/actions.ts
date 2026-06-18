'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@/utils/supabase/server'

export async function updateAboutUs(formData: FormData) {
  const about_us = formData.get('about_us') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Use upsert to update just the about_us field for company profile ID 1
  const { error } = await supabaseAdmin
    .from('company_profiles')
    .update({ 
      about_us,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}
