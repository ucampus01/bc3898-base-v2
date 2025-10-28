// app/api/usage/check/route.ts
// 무료 사용자 사용 횟수 체크 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service') // 서비스 타입: keyword_analysis, trends 등

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // 비로그인 사용자 처리
    if (authError || !user) {
      // 🔧 변경 가능: 비로그인 사용자 제한 횟수
      const freeLimit = 5
      
      return NextResponse.json({
        isAllowed: true,
        remaining: freeLimit,
        limit: freeLimit,
        message: '로그인하면 더 많은 기능을 사용할 수 있습니다',
        tier: 'anonymous',
      })
    }

    // 사용자 정보 조회
    const { data: profile } = await supabase
      .from('users')
      .select('membership_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.membership_tier || 'free'

    // 🔧 변경 가능: 플랜별 사용 제한
    const limits: Record<string, number> = {
      free: 10,
      basic: 100,
      standard: 500,
      premium: -1, // 무제한
    }

    const limit = limits[tier]

    // 오늘 사용량 조회
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: usageData, error: usageError } = await supabase
      .from('usage_logs')
      .select('count')
      .eq('user_id', user.id)
      .eq('service', service)
      .gte('created_at', today.toISOString())
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      throw usageError
    }

    const currentUsage = usageData?.count || 0

    // 무제한 플랜
    if (limit === -1) {
      return NextResponse.json({
        isAllowed: true,
        remaining: -1,
        limit: -1,
        message: '무제한 사용 가능',
        tier,
      })
    }

    // 사용 가능 여부 확인
    const isAllowed = currentUsage < limit
    const remaining = Math.max(0, limit - currentUsage)

    return NextResponse.json({
      isAllowed,
      remaining,
      limit,
      currentUsage,
      message: isAllowed 
        ? `오늘 ${remaining}회 더 사용 가능합니다` 
        : '오늘의 사용 한도를 초과했습니다. 플랜을 업그레이드하세요.',
      tier,
    })
  } catch (error: any) {
    console.error('사용량 체크 오류:', error)
    return NextResponse.json(
      { error: error.message || '사용량 체크 실패' },
      { status: 500 }
    )
  }
}