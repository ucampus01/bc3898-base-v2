// app/api/keywords/analyze/route.ts
// Google Custom Search 기반 키워드 분석 API

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

    // 🔧 변경 가능: Google Custom Search API 호출
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(keyword)}`,
      { method: 'GET' }
    )

    if (!response.ok) {
      throw new Error('Google API 호출 실패')
    }

    const data = await response.json()

    // 결과 가공
    const results = {
      keyword,
      totalResults: data.searchInformation?.totalResults || 0,
      searchTime: data.searchInformation?.searchTime || 0,
      items: data.items?.slice(0, 10).map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
      })) || [],
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('키워드 분석 오류:', error)
    return NextResponse.json(
      { error: error.message || '키워드 분석 실패' },
      { status: 500 }
    )
  }
}