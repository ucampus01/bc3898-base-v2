// app/subscription/page.tsx
// 요금제 선택 페이지

import { getCurrentUser } from '@/lib/supabase/auth'
import Link from 'next/link'

export default async function SubscriptionPage() {
  const user = await getCurrentUser()

  // 🔧 변경 가능: 요금제 정보 수정
  const plans = [
    {
      id: 'free',
      name: '무료',
      price: 0,
      period: '영구',
      features: [
        '키워드 분석 10회/일',
        '기본 트렌드 조회',
        '검색 순위 확인 3개',
        '광고 표시',
      ],
      limitations: [
        '고급 분석 불가',
        '데이터 내보내기 불가',
        '프로젝트 관리 불가',
      ],
      buttonText: '현재 플랜',
      buttonVariant: 'secondary',
      popular: false,
    },
    {
      id: 'basic',
      name: '베이직',
      price: 13800,
      period: '30일',
      features: [
        '키워드 분석 무제한',
        '모든 트렌드 데이터',
        '검색 순위 추적 30개',
        '광고 제거',
        '네이버 데이터랩',
        'CSV 내보내기',
      ],
      limitations: [
        '유튜브 분석 제한',
        '쿠팡 데이터 제한',
      ],
      buttonText: '14일 무료체험',
      buttonVariant: 'primary',
      popular: false,
      stripeId: 'price_basic_monthly', // 🔧 변경 가능: 실제 Stripe Price ID
    },
    {
      id: 'standard',
      name: '스탠다드',
      price: 29700,
      period: '30일',
      features: [
        '베이직 플랜 모든 기능',
        '유튜브 키워드 분석',
        '쿠팡윙 상품 분석',
        '검색 순위 추적 150개',
        'PDF 리포트 생성',
        '프로젝트 관리 10개',
        '우선 지원',
      ],
      limitations: [],
      buttonText: '14일 무료체험',
      buttonVariant: 'primary',
      popular: true,
      stripeId: 'price_standard_monthly', // 🔧 변경 가능: 실제 Stripe Price ID
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: 89100,
      period: '30일',
      features: [
        '스탠다드 모든 기능',
        '검색 순위 추적 500개',
        '프로젝트 무제한',
        'API 접근 권한',
        '맞춤 리포트',
        '전담 매니저',
        '최우선 지원',
      ],
      limitations: [],
      buttonText: '구독하기',
      buttonVariant: 'premium',
      popular: false,
      stripeId: 'price_premium_monthly', // 🔧 변경 가능: 실제 Stripe Price ID
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            요금제 선택
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {user ? '나에게 맞는 플랜을 선택하세요' : '지금 가입하고 14일 무료 체험을 시작하세요'}
          </p>
          <p className="text-sm text-gray-500">
            💳 부가세 별도 | 언제든지 해지 가능
          </p>
        </div>

        {/* 요금제 카드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {/* 인기 배지 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    HOT! 🔥
                  </span>
                </div>
              )}

              {/* 플랜 정보 */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">무료</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price.toLocaleString()}원
                      </span>
                      <span className="text-gray-600">/ {plan.period}</span>
                    </>
                  )}
                </div>
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">✗</span>
                    <span className="text-sm text-gray-400">{limitation}</span>
                  </li>
                ))}
              </ul>

              {/* 버튼 */}
              {user ? (
                <Link
                  href={plan.id === 'free' ? '/dashboard' : `/api/stripe/checkout?plan=${plan.id}`}
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.buttonVariant === 'premium'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  가입하고 시작하기
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* 자주 묻는 질문 */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">
            자주 묻는 질문
          </h2>
          
          {/* 🔧 변경 가능: FAQ 내용 추가/수정 */}
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-6 shadow">
              <summary className="font-semibold cursor-pointer">
                무료 체험 기간은 얼마나 되나요?
              </summary>
              <p className="mt-4 text-gray-600">
                모든 유료 플랜은 14일 무료 체험이 제공됩니다. 체험 기간 동안 언제든 해지하실 수 있으며, 해지 시 비용이 청구되지 않습니다.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow">
              <summary className="font-semibold cursor-pointer">
                플랜은 언제든지 변경할 수 있나요?
              </summary>
              <p className="mt-4 text-gray-600">
                네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 시 일할 계산되어 청구됩니다.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow">
              <summary className="font-semibold cursor-pointer">
                환불 정책은 어떻게 되나요?
              </summary>
              <p className="mt-4 text-gray-600">
                무료 체험 기간 내 해지 시 비용이 청구되지 않습니다. 유료 구독 후에는 사용한 기간만큼만 청구되며, 남은 기간에 대해서는 일할 환불됩니다.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow">
              <summary className="font-semibold cursor-pointer">
                여러 계정에서 동시에 사용할 수 있나요?
              </summary>
              <p className="mt-4 text-gray-600">
                무료와 베이직 플랜은 1개 기기, 스탠다드는 2개 기기, 프리미엄은 4개 기기에서 동시 로그인이 가능합니다.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        {!user && (
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">
              아직 계정이 없으신가요?
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              무료로 시작하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}