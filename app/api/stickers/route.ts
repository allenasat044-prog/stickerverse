import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/server/supabase'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '20')

  let query = supabase
    .from('stickers')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('stickers')
    .insert({ ...body, uploader_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
