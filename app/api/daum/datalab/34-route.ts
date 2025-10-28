// app/api/daum/datalab/route.ts
// 다음(카카오) 데이터랩 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { keyword } = body

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드를 입력해주세요' },
        { status: 400 }
      )
    }

    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    // 🔧 변경 가능: 카카오(다음) API 호출
    // 참고: 실제 카카오 트렌드 API 엔드포인트로 교체 필요
    const apiUrl = 'https://dapi.kakao.com/v2/search/web'
    const apiKey = process.env.KAKAO_REST_API_KEY

    const response = await fetch(
      `${apiUrl}?query=${encodeURIComponent(keyword)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('카카오 API 호출 실패')
    }

    const data = await response.json()

    // 결과 가공
    const results = {
      keyword,
      searchVolume: data.meta?.total_count || 0,
      trend: 'stable', // 🔧 변경 가능: 실제 트렌드 데이터 계산
      relatedKeywords: data.documents?.slice(0, 10).map((doc: any) => doc.title) || [],
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('다음 데이터랩 API 오류:', error)
    return NextResponse.json(
      { error: error.message || 'API 호출 실패' },
      { status: 500 }
    )
  }
}