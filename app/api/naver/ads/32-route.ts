// app/api/naver/ads/route.ts
// 네이버 검색광고 API

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

    // 🔧 변경 가능: 네이버 검색광고 API 호출
    const apiUrl = 'https://api.naver.com/keywordstool'
    const clientId = process.env.NAVER_AD_API_KEY
    const clientSecret = process.env.NAVER_AD_SECRET
    const customerId = process.env.NAVER_AD_CUSTOMER_ID

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId!,
        'X-Naver-Client-Secret': clientSecret!,
        'X-Customer-Id': customerId!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywordList: [keyword],
        showDetail: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('네이버 API 호출 실패')
    }

    const data = await response.json()

    // 결과 가공
    const results = {
      keyword,
      monthlyPcQcCnt: data.keywordList?.[0]?.monthlyPcQcCnt || 0,
      monthlyMobileQcCnt: data.keywordList?.[0]?.monthlyMobileQcCnt || 0,
      monthlyAvePcClkCnt: data.keywordList?.[0]?.monthlyAvePcClkCnt || 0,
      monthlyAveMobileClkCnt: data.keywordList?.[0]?.monthlyAveMobileClkCnt || 0,
      compIdx: data.keywordList?.[0]?.compIdx || 'N/A',
      relKeywords: data.keywordList?.[0]?.relKeywords || [],
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('네이버 검색광고 API 오류:', error)
    return NextResponse.json(
      { error: error.message || 'API 호출 실패' },
      { status: 500 }
    )
  }
}