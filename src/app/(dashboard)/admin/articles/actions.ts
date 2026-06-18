'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Article } from '@/types/database.types'

export async function getArticles() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(name),
      media:media_assets(url, filename)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data
}

export async function deleteArticle(id: string | number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/articles')
  return { success: true }
}

export async function createArticle(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const is_published = formData.get('is_published') === 'true'
  const media_asset_id = formData.get('media_asset_id') as string | null

  if (!title || !content) {
    return { error: 'Judul dan konten wajib diisi' }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const supabase = await createClient()

  // Get current user id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Check unique slug
  const { data: existing } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return { error: 'Artikel dengan judul ini sudah ada.' }
  }

  const { error } = await supabaseAdmin
    .from('articles')
    .insert({
      title,
      slug,
      content,
      author_id: user.id,
      published_at: is_published ? new Date().toISOString() : null,
      media_asset_id: media_asset_id || null
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/articles')
  return { success: true }
}

export async function getArticleById(id: string | number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
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

export async function updateArticle(id: string | number, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const is_published = formData.get('is_published') === 'true'
  const media_asset_id = formData.get('media_asset_id') as string

  if (!title || !content) {
    return { error: 'Judul dan konten wajib diisi' }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check unique slug
  const { data: existing } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .single()

  if (existing) {
    return { error: 'Artikel dengan judul ini sudah ada.' }
  }

  const updateData: any = {
    title,
    slug,
    content,
    updated_at: new Date().toISOString()
  }

  if (is_published) {
    // If it's being published now, we could update published_at if we wanted to
    // But typically we don't clear it. 
    updateData.published_at = new Date().toISOString()
  } else {
    updateData.published_at = null
  }

  if (media_asset_id) {
    updateData.media_asset_id = media_asset_id
  }

  const { error } = await supabaseAdmin
    .from('articles')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/articles')
  revalidatePath(`/artikel/${slug}`)
  revalidatePath('/artikel')
  return { success: true }
}
