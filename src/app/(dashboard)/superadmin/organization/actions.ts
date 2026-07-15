'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getOrganizationMembers() {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data
}

export async function getOrganizationMemberById(id: string) {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function deleteOrganizationMember(id: string, avatarUrl: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // If there's an avatar, attempt to delete it from storage
  if (avatarUrl) {
    try {
      const urlParts = avatarUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      await supabaseAdmin.storage.from('avatars').remove([fileName])
    } catch (err) {
      console.error('Failed to delete avatar from storage', err)
    }
  }

  const { error } = await supabaseAdmin
    .from('organization_members')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin/organization')
  revalidatePath('/about')
  return { success: true }
}

export async function upsertOrganizationMember(formData: FormData) {
  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const position = formData.get('position') as string
  const role = formData.get('role') as string
  const order_index = parseInt((formData.get('order_index') as string) || '0', 10)
  const avatarFile = formData.get('avatar') as File | null
  let existingAvatarUrl = formData.get('existing_avatar_url') as string | null

  if (!name || !position || !role) {
    return { error: 'Nama, Jabatan, dan Peran wajib diisi' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  let avatar_url = existingAvatarUrl

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true })

    if (uploadError) {
      return { error: 'Gagal mengunggah foto profil: ' + uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(uploadData.path)
    avatar_url = publicUrl
  }

  const memberData = {
    name,
    position,
    role,
    avatar_url,
    order_index,
  }

  let error;
  if (id) {
    const { error: updateError } = await supabaseAdmin
      .from('organization_members')
      .update(memberData)
      .eq('id', id)
    error = updateError
  } else {
    const { error: insertError } = await supabaseAdmin
      .from('organization_members')
      .insert(memberData)
    error = insertError
  }

  if (error) return { error: error.message }

  revalidatePath('/superadmin/organization')
  revalidatePath('/about')
  return { success: true }
}
