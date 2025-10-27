// app/api/auth/session/route.ts
// 사용자 세션 확인 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error

    if (!session) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 200 }
      )
    }

    // 사용자 프로필 정보 가져오기
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return NextResponse.json(
      {
        user: session.user,
        profile,
        session,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '세션 조회 실패' },
      { status: 500 }
    )
  }
}