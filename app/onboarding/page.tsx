// app/onboarding/page.tsx
// 신규 사용자 역할 선택 페이지

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const [selectedRole, setSelectedRole] = useState<'blogger' | 'seller' | 'youtuber' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 🔧 변경 가능: 역할 옵션 추가/수정
  const roles = [
    {
      id: 'blogger' as const,
      name: '블로거',
      icon: '✍️',
      description: '블로그 키워드 분석과 SEO 최적화',
      benefits: [
        '네이버 데이터랩 분석',
        '검색 순위 추적',
        '트렌드 키워드 추천',
        '포스팅 전략 수립',
      ],
    },
    {
      id: 'seller' as const,
      name: '셀러',
      icon: '🛒',
      description: '상품 키워드 분석과 시장 조사',
      benefits: [
        '쿠팡윙 상품 분석',
        '네이버 쇼핑 키워드',
        '경쟁 상품 조사',
        '가격대 분석',
      ],
    },
    {
      id: 'youtuber' as const,
      name: '유튜버',
      icon: '🎬',
      description: '유튜브 키워드 최적화와 조회수 분석',
      benefits: [
        '유튜브 키워드 분석',
        '인기 영상 트렌드',
        '경쟁 채널 분석',
        '태그 최적화',
      ],
    },
  ]

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('역할을 선택해주세요')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      // 사용자 역할 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: selectedRole })
        .eq('id', user.id)

      if (updateError) throw updateError

      // 역할별 대시보드로 이동
      router.push(`/dashboard/${selectedRole}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || '역할 설정에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            환영합니다! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            어떤 분야에서 활동하고 계신가요?
          </p>
        </div>

        {/* 역할 선택 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all text-left ${
                selectedRole === role.id
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'hover:scale-102'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{role.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {role.description}
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  제공되는 기능:
                </p>
                <ul className="space-y-1">
                  {role.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRole === role.id && (
                <div className="mt-4 text-center">
                  <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
                    선택됨 ✓
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* 시작 버튼 */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '설정 중...' : '시작하기'}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            나중에 마이페이지에서 변경할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}