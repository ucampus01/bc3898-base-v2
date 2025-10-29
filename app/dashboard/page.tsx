// app/dashboard/page.tsx
// 통합 대시보드 페이지

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // 사용자 프로필 조회
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // 역할이 없으면 온보딩으로 리다이렉트
  if (!profile?.role) {
    redirect('/onboarding')
  }

  // 구독 정보 조회
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // 오늘 사용량 조회
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: usageLogs } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())

  const totalUsageToday = usageLogs?.reduce((sum, log) => sum + log.count, 0) || 0

  // 🔧 변경 가능: 플랜별 제한 설정
  const tierLimits: Record<string, number> = {
    free: 10,
    basic: 100,
    standard: 500,
    premium: -1, // 무제한
  }

  const tier = profile?.membership_tier || 'free'
  const limit = tierLimits[tier]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            대시보드
          </h1>
          <p className="text-gray-600">
            안녕하세요, {profile?.name || user.email}님 👋
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* 멤버십 등급 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">멤버십 등급</p>
              <span className="text-2xl">👑</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 capitalize">
              {tier}
            </p>
            {tier === 'free' && (
              <Link href="/subscription" className="text-sm text-purple-600 hover:underline mt-2 block">
                업그레이드 →
              </Link>
            )}
          </div>

          {/* 오늘 사용량 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">오늘 사용량</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {totalUsageToday} / {limit === -1 ? '∞' : limit}
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2 transition-all"
                style={{ 
                  width: limit === -1 ? '100%' : `${Math.min((totalUsageToday / limit) * 100, 100)}%` 
                }}
              />
            </div>
          </div>

          {/* 역할 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">내 역할</p>
              <span className="text-2xl">
                {profile?.role === 'blogger' && '✍️'}
                {profile?.role === 'seller' && '🛒'}
                {profile?.role === 'youtuber' && '🎬'}
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 capitalize">
              {profile?.role === 'blogger' && '블로거'}
              {profile?.role === 'seller' && '셀러'}
              {profile?.role === 'youtuber' && '유튜버'}
            </p>
            <Link href={`/dashboard/${profile?.role}`} className="text-sm text-blue-600 hover:underline mt-2 block">
              전용 대시보드 →
            </Link>
          </div>

          {/* 구독 만료일 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">구독 상태</p>
              <span className="text-2xl">📅</span>
            </div>
            {subscription ? (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(subscription.current_period_end).toLocaleDateString('ko-KR')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {subscription.status === 'active' ? '활성' : '비활성'}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">무료 플랜</p>
            )}
          </div>
        </div>

        {/* 빠른 액세스 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            빠른 액세스
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* 🔧 변경 가능: 빠른 액세스 링크 추가/수정 */}
            <Link 
              href="/services/keyword-analysis"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900">키워드 분석</p>
                  <p className="text-sm text-gray-600">상세 분석 시작</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/services/trends"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <div>
                  <p className="font-semibold text-gray-900">트렌드 분석</p>
                  <p className="text-sm text-gray-600">실시간 트렌드</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/projects"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📁</span>
                <div>
                  <p className="font-semibold text-gray-900">프로젝트</p>
                  <p className="text-sm text-gray-600">관리 및 추적</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            최근 활동
          </h2>
          {usageLogs && usageLogs.length > 0 ? (
            <div className="space-y-3">
              {usageLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {log.service.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {log.count}회 사용
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              아직 활동 내역이 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  )
}