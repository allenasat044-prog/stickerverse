import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/server/supabase'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('stickers')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.rpc('increment_download', { sticker_id: id })
  if (error) {
    // fallback: direct update
    await supabase.from('stickers').update({ download_count: 0 }).eq('id', id)
  }
  return NextResponse.json({ success: true })
}
