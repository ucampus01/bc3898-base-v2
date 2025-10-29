// app/api/export/csv/route.ts
// CSV 데이터 내보내기 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body // type: 'keywords' | 'projects' | 'usage'

    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    let csvContent = ''

    // 🔧 변경 가능: CSV 생성 로직
    switch (type) {
      case 'keywords': {
        // 키워드 CSV 생성
        csvContent = 'ID,키워드,검색량,경쟁도,CPC,플랫폼,생성일\n'
        
        const keywords = data || []
        keywords.forEach((keyword: any) => {
          csvContent += [
            keyword.id,
            `"${keyword.keyword}"`,
            keyword.search_volume || 0,
            keyword.competition || 'N/A',
            keyword.cpc || 0,
            keyword.platform || 'N/A',
            new Date(keyword.created_at).toLocaleDateString('ko-KR'),
          ].join(',') + '\n'
        })
        break
      }

      case 'projects': {
        // 프로젝트 CSV 생성
        csvContent = 'ID,프로젝트명,설명,키워드 수,생성일\n'
        
        const projects = data || []
        projects.forEach((project: any) => {
          csvContent += [
            project.id,
            `"${project.name}"`,
            `"${project.description || ''}"`,
            project.keyword_count || 0,
            new Date(project.created_at).toLocaleDateString('ko-KR'),
          ].join(',') + '\n'
        })
        break
      }

      case 'usage': {
        // 사용량 CSV 생성
        csvContent = '서비스,사용 횟수,날짜\n'
        
        const usageLogs = data || []
        usageLogs.forEach((log: any) => {
          csvContent += [
            log.service,
            log.count,
            new Date(log.created_at).toLocaleString('ko-KR'),
          ].join(',') + '\n'
        })
        break
      }

      default:
        return NextResponse.json(
          { error: '지원하지 않는 타입입니다' },
          { status: 400 }
        )
    }

    // UTF-8 BOM 추가 (엑셀에서 한글 깨짐 방지)
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csvContent

    // CSV 파일 반환
    return new NextResponse(csvWithBOM, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${type}_${Date.now()}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('CSV 내보내기 오류:', error)
    return NextResponse.json(
      { error: error.message || 'CSV 생성 실패' },
      { status: 500 }
    )
  }
}