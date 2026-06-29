import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/server/supabase'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { target_id, action } = await request.json()

  if (action === 'follow') {
    await supabase.from('follows').insert({ follower_id: user.id, following_id: target_id })
  } else {
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', target_id)
  }
  return NextResponse.json({ success: true })
}
