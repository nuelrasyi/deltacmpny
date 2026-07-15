'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getBatches() {
  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      program:programs(id, title)
    `)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching batches:', error)
    return []
  }

  return data
}

export async function getBatchesByProgramId(programId: string) {
  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('program_id', programId)
    .order('start_date', { ascending: true })

  if (error) {
    return []
  }

  return data
}

export async function createBatch(formData: FormData) {
  const program_id = formData.get('program_id') as string
  const name = formData.get('name') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const status = formData.get('status') as string || 'upcoming'

  if (!program_id || !name || !start_date) {
    return { error: 'Program, Nama Batch, dan Tanggal Mulai wajib diisi' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('batches')
    .insert({
      program_id,
      name,
      start_date,
      end_date: end_date || null,
      status
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin/batches')
  revalidatePath('/program/[slug]', 'page')
  return { success: true }
}

export async function deleteBatch(id: string | number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { error } = await supabaseAdmin
    .from('batches')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin/batches')
  return { success: true }
}

export async function getBatchById(id: string) {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching batch by id:', error)
    return null
  }
  return data
}

export async function updateBatch(id: string, formData: FormData) {
  const program_id = formData.get('program_id') as string
  const name = formData.get('name') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const status = formData.get('status') as string

  if (!program_id || !name || !start_date || !status) {
    return { error: 'Program, Nama Batch, Tanggal Mulai, dan Status wajib diisi' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('batches')
    .update({
      program_id,
      name,
      start_date,
      end_date: end_date || null,
      status
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/superadmin/batches')
  revalidatePath('/program/[slug]', 'page')
  return { success: true }
}
