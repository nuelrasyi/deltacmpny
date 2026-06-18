'use server'

import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'File tidak ditemukan' }
  }

  const supabase = await createClient()

  // Get current user id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

  // 1. Upload to Supabase Storage Bucket named 'media'
  const { data: uploadData, error: uploadError } = await supabaseAdmin
    .storage
    .from('media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: `Gagal mengunggah ke storage: ${uploadError.message}. Pastikan bucket 'media' sudah ada dan berstatus Public.` }
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('media')
    .getPublicUrl(fileName)

  // 3. Save to media_assets table
  const { data: assetData, error: dbError } = await supabaseAdmin
    .from('media_assets')
    .insert({
      filename: file.name,
      url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: user.id
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB error:', dbError)
    // Attempt rollback storage
    await supabaseAdmin.storage.from('media').remove([fileName])
    return { error: 'Gagal menyimpan ke database' }
  }

  return { success: true, data: assetData }
}

export async function getMediaAssets() {
  const supabase = await createClient()

  const { data, error } = await supabaseAdmin
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data
}
