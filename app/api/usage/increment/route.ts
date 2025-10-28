// app/api/usage/increment/route.ts
// 서비스 사용 시 사용량 증가 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { service } = body // 서비스 타입: keyword_analysis, trends 등

    if (!service) {
      return NextResponse.json(
        { error: '서비스 타입이 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // 비로그인 사용자는 기록하지 않음
    if (authError || !user) {
      return NextResponse.json({
        success: true,
        message: '비로그인 사용자 - 기록하지 않음',
      })
    }

    // 오늘 날짜
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 오늘의 사용 기록 조회
    const { data: existingUsage } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('service', service)
      .gte('created_at', today.toISOString())
      .single()

    if (existingUsage) {
      // 기존 기록 업데이트
      const { error: updateError } = await supabase
        .from('usage_logs')
        .update({
          count: existingUsage.count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUsage.id)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        count: existingUsage.count + 1,
        message: '사용량이 기록되었습니다',
      })
    } else {
      // 새 기록 생성
      const { error: insertError } = await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          service,
          count: 1,
          created_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      return NextResponse.json({
        success: true,
        count: 1,
        message: '사용량이 기록되었습니다',
      })
    }
  } catch (error: any) {
    console.error('사용량 증가 오류:', error)
    return NextResponse.json(
      { error: error.message || '사용량 기록 실패' },
      { status: 500 }
    )
  }
}

// 🔧 변경 가능: 사용량 초기화 API (관리자용)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const service = searchParams.get('service')

    if (!userId || !service) {
      return NextResponse.json(
        { error: '사용자 ID와 서비스 타입이 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 오늘의 사용 기록 삭제
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { error } = await supabase
      .from('usage_logs')
      .delete()
      .eq('user_id', userId)
      .eq('service', service)
      .gte('created_at', today.toISOString())

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: '사용량이 초기화되었습니다',
    })
  } catch (error: any) {
    console.error('사용량 초기화 오류:', error)
    return NextResponse.json(
      { error: error.message || '사용량 초기화 실패' },
      { status: 500 }
    )
  }
}