// app/dashboard/seller/page.tsx
// 셀러 전용 대시보드

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SellerDashboardPage() {
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
            🛒 셀러 대시보드
          </h1>
          <p className="text-gray-600">
            상품 키워드 분석 및 경쟁 상품을 확인하세요
          </p>
        </div>

        {/* 셀러 전용 통계 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">분석한 상품</p>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-red-600">89개</p>
            <p className="text-sm text-gray-500 mt-1">이번 달</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">평균 경쟁도</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">중간</p>
            <p className="text-sm text-gray-500 mt-1">분석 키워드 기준</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">추적 중인 키워드</p>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-green-600">34개</p>
            <p className="text-sm text-gray-500 mt-1">쿠팡/네이버 통합</p>
          </div>
        </div>

        {/* 셀러 추천 도구 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            셀러 추천 도구
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 🔧 변경 가능: 셀러 전용 도구 추가 */}
            <Link 
              href="/services/coupang-wing"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <p className="font-semibold text-gray-900">쿠팡윙 분석</p>
                  <p className="text-sm text-gray-600">상품 키워드 & 가격</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/naver-ads"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900">네이버 검색광고</p>
                  <p className="text-sm text-gray-600">광고 키워드 분석</p>
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
                  <p className="text-sm text-gray-600">상품 검색량 조사</p>
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
                  <p className="text-sm text-gray-600">시즌별 인기 상품</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 인기 상품 카테고리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            이번 주 인기 상품 카테고리
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {/* 🔧 변경 가능: 실제 카테고리 데이터 연동 */}
            {[
              { name: '가전', icon: '🔌' },
              { name: '패션', icon: '👗' },
              { name: '식품', icon: '🍔' },
              { name: '뷰티', icon: '💄' },
              { name: '생활', icon: '🏠' },
              { name: '디지털', icon: '💻' },
              { name: '스포츠', icon: '⚽' },
              { name: '완구', icon: '🧸' },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/services/coupang-wing?category=${category.name}`}
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