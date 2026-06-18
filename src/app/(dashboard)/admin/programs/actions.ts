'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Program } from '@/types/database.types'

export async function getPrograms() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name, slug),
      media:media_assets(url, filename)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching programs:', error)
    return []
  }

  return data
}

export async function createProgram(formData: FormData) {
  const title = formData.get('title') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : 0
  const is_active = formData.get('is_active') === 'true'
  const media_asset_id = formData.get('media_asset_id') as string | null

  if (!title || !category_id) {
    return { error: 'Judul dan Kategori wajib diisi' }
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify unique slug
  const { data: existing } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return { error: 'Program dengan judul serupa sudah ada. Harap gunakan judul lain.' }
  }

  const { error } = await supabaseAdmin
    .from('programs')
    .insert({
      title,
      slug,
      category_id: parseInt(category_id),
      description,
      price,
      is_active,
      media_asset_id: media_asset_id || null
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/programs')
  return { success: true }
}

export async function deleteProgram(id: string | number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { error } = await supabaseAdmin
    .from('programs')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/programs')
  return { success: true }
}

export async function getProgramById(id: string | number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      media:media_assets(id, url, filename)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return null
  }
  return data
}

export async function updateProgram(id: string | number, formData: FormData) {
  const title = formData.get('title') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : 0
  const is_active = formData.get('is_active') === 'true'
  const media_asset_id = formData.get('media_asset_id') as string

  if (!title || !category_id) {
    return { error: 'Judul dan Kategori wajib diisi' }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify unique slug ignoring current program
  const { data: existing } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .single()

  if (existing) {
    return { error: 'Program dengan judul serupa sudah ada. Harap gunakan judul lain.' }
  }

  const updateData: any = {
    title,
    slug,
    category_id: parseInt(category_id),
    description,
    price,
    is_active,
    updated_at: new Date().toISOString()
  }

  if (media_asset_id) {
    updateData.media_asset_id = media_asset_id
  }

  const { error } = await supabaseAdmin
    .from('programs')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/programs')
  revalidatePath(`/program/${slug}`)
  revalidatePath('/program')
  return { success: true }
}
