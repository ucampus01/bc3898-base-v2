// app/dashboard/youtuber/page.tsx
// 유튜버 전용 대시보드

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function YouTuberDashboardPage() {
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
            🎬 유튜버 대시보드
          </h1>
          <p className="text-gray-600">
            유튜브 키워드 최적화 및 트렌드를 확인하세요
          </p>
        </div>

        {/* 유튜버 전용 통계 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">분석한 키워드</p>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-red-600">156개</p>
            <p className="text-sm text-gray-500 mt-1">이번 달</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">평균 조회수</p>
              <span className="text-2xl">👀</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">45.2K</p>
            <p className="text-sm text-gray-500 mt-1">분석 영상 기준</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">경쟁도</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-green-600">중간</p>
            <p className="text-sm text-gray-500 mt-1">추천 키워드 기준</p>
          </div>
        </div>

        {/* 유튜버 추천 도구 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            유튜버 추천 도구
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 🔧 변경 가능: 유튜버 전용 도구 추가 */}
            <Link 
              href="/services/youtube-keywords"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎬</span>
                <div>
                  <p className="font-semibold text-gray-900">유튜브 키워드</p>
                  <p className="text-sm text-gray-600">동영상 키워드 최적화</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/trends"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <div>
                  <p className="font-semibold text-gray-900">트렌드 분석</p>
                  <p className="text-sm text-gray-600">인기 급상승 주제</p>
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
                  <p className="text-sm text-gray-600">검색량 조사</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/rank-tracking"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">순위 추적</p>
                  <p className="text-sm text-gray-600">영상 순위 모니터링</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 인기 카테고리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            이번 주 인기 유튜브 카테고리
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {/* 🔧 변경 가능: 실제 카테고리 데이터 연동 */}
            {[
              { name: '게임', icon: '🎮' },
              { name: 'Vlog', icon: '📹' },
              { name: '요리', icon: '🍳' },
              { name: '리뷰', icon: '⭐' },
              { name: '교육', icon: '📚' },
              { name: '음악', icon: '🎵' },
              { name: '뷰티', icon: '💄' },
              { name: '운동', icon: '💪' },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/services/youtube-keywords?category=${category.name}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-red-50 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="font-semibold text-gray-900">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}