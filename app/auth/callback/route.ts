// app/auth/callback/route.ts
// OAuth 콜백 처리

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      // 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // 사용자 프로필 확인
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        // 역할이 없으면 온보딩 페이지로
        // 🔧 변경 가능: 온보딩 플로우 커스터마이징
        if (!profile || !profile.role) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
        }
      }
    } catch (error) {
      console.error('인증 콜백 오류:', error)
      return NextResponse.redirect(new URL('/auth/login?error=callback', requestUrl.origin))
    }
  }

  // 🔧 변경 가능: 로그인 후 기본 리다이렉트 경로
  return NextResponse.redirect(new URL(next || '/dashboard', requestUrl.origin))
}