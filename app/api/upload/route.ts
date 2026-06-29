import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/server/supabase'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const filename = `${user.id}/${Date.now()}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('stickers')
    .upload(filename, bytes, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('stickers').getPublicUrl(filename)
  return NextResponse.json({ url: publicUrl })
}
