// app/api/naver/datalab/route.ts
// 네이버 데이터랩 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { keywords, startDate, endDate } = body

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: '키워드를 입력해주세요' },
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: '기간을 선택해주세요' },
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

    // 🔧 변경 가능: 네이버 데이터랩 API 호출
    const apiUrl = 'https://openapi.naver.com/v1/datalab/search'
    const clientId = process.env.NAVER_CLIENT_ID
    const clientSecret = process.env.NAVER_CLIENT_SECRET

    const requestBody = {
      startDate: startDate.replace(/-/g, ''),
      endDate: endDate.replace(/-/g, ''),
      timeUnit: 'date',
      keywordGroups: keywords.map((keyword: string, index: number) => ({
        groupName: keyword,
        keywords: [keyword],
      })),
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId!,
        'X-Naver-Client-Secret': clientSecret!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error('네이버 데이터랩 API 호출 실패')
    }

    const data = await response.json()

    // 결과 가공
    const results = {
      keywords,
      startDate,
      endDate,
      data: data.results || [],
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('네이버 데이터랩 API 오류:', error)
    return NextResponse.json(
      { error: error.message || 'API 호출 실패' },
      { status: 500 }
    )
  }
}