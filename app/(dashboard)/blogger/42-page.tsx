// app/dashboard/blogger/page.tsx
// 블로거 전용 대시보드

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BloggerDashboardPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // 사용자 프로필 조회
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✍️ 블로거 대시보드
          </h1>
          <p className="text-gray-600">
            블로그 키워드 분석 및 트렌드를 확인하세요
          </p>
        </div>

        {/* 블로거 전용 통계 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">분석한 키워드</p>
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">127개</p>
            <p className="text-sm text-gray-500 mt-1">이번 달</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">추적 중인 포스트</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-green-600">23개</p>
            <p className="text-sm text-gray-500 mt-1">순위 모니터링</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">평균 검색량</p>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">1,250</p>
            <p className="text-sm text-gray-500 mt-1">월간 평균</p>
          </div>
        </div>

        {/* 블로거 추천 도구 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            블로거 추천 도구
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 🔧 변경 가능: 블로거 전용 도구 추가 */}
            <Link 
              href="/services/naver-datalab"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📉</span>
                <div>
                  <p className="font-semibold text-gray-900">네이버 데이터랩</p>
                  <p className="text-sm text-gray-600">검색 트렌드 분석</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/keyword-analysis"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900">키워드 분석</p>
                  <p className="text-sm text-gray-600">상세 키워드 조사</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/rank-tracking"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">순위 추적</p>
                  <p className="text-sm text-gray-600">포스트 순위 모니터링</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/influence"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900">영향력 순위</p>
                  <p className="text-sm text-gray-600">블로그 영향력 분석</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 인기 키워드 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            이번 주 인기 블로그 키워드
          </h2>
          <div className="flex flex-wrap gap-2">
            {/* 🔧 변경 가능: 실제 트렌드 데이터 연동 */}
            {['다이어트', '재테크', '건강', '요리', '여행', '육아', '반려동물', '인테리어'].map((keyword, index) => (
              <Link
                key={index}
                href={`/services/keyword-analysis?keyword=${keyword}`}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}