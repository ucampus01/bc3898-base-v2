// app/mypage/page.tsx
// 마이페이지 (프로필 및 구독 관리)

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function MyPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // 사용자 프로필 조회
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // 구독 정보 조회
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            마이페이지
          </h1>
          <p className="text-gray-600">
            계정 정보 및 구독을 관리하세요
          </p>
        </div>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            프로필 정보
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <p className="text-gray-900">{profile?.name || '미설정'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                역할
              </label>
              <p className="text-gray-900 capitalize">
                {profile?.role === 'blogger' && '블로거'}
                {profile?.role === 'seller' && '셀러'}
                {profile?.role === 'youtuber' && '유튜버'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가입일
              </label>
              <p className="text-gray-900">
                {new Date(profile?.created_at || '').toLocaleDateString('ko-KR')}
              </p>
            </div>

            {/* 🔧 변경 가능: 프로필 수정 기능 추가 */}
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              프로필 수정
            </button>
          </div>
        </div>

        {/* 구독 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            구독 정보
          </h2>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">현재 플랜</p>
                  <p className="text-2xl font-bold text-purple-600 capitalize">
                    {subscription.plan}
                  </p>
                </div>
                <span className="text-4xl">💎</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  구독 상태
                </label>
                <p className="text-gray-900">
                  {subscription.status === 'active' && '✅ 활성'}
                  {subscription.status === 'trialing' && '🎁 무료 체험 중'}
                  {subscription.status === 'canceled' && '❌ 취소됨'}
                  {subscription.status === 'past_due' && '⚠️ 결제 실패'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  다음 결제일
                </label>
                <p className="text-gray-900">
                  {new Date(subscription.current_period_end).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {subscription.trial_end && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    무료 체험 종료일
                  </label>
                  <p className="text-gray-900">
                    {new Date(subscription.trial_end).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Link
                  href="/subscription"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  플랜 변경
                </Link>
                {/* 🔧 변경 가능: 구독 취소 기능 */}
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  구독 취소
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                현재 무료 플랜을 사용 중입니다
              </p>
              <Link
                href="/subscription"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                유료 플랜 둘러보기
              </Link>
            </div>
          )}
        </div>

        {/* 계정 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            계정 관리
          </h2>
          <div className="space-y-3">
            {/* 🔧 변경 가능: 비밀번호 변경 기능 추가 */}
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              비밀번호 변경
            </button>
            
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              알림 설정
            </button>
            
            <Link
              href="/api/auth/logout"
              className="block w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              로그아웃
            </Link>

            {/* 🔧 변경 가능: 회원 탈퇴 기능 추가 */}
            <button className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}