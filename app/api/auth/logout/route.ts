// app/api/auth/logout/route.ts
// 로그아웃 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
    
    return NextResponse.json(
      { message: '로그아웃 성공' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '로그아웃 실패' },
      { status: 500 }
    )
  }
}