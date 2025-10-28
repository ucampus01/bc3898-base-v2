// components/layout/ServiceMenu.tsx
// 모든 서비스 목록 컴포넌트

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function ServiceMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [supabase])

  // 🔧 변경 가능: 서비스 목록 추가/수정
  const services = [
    {
      category: '키워드 분석',
      items: [
        {
          name: '키워드 분석',
          description: '네이버/구글 키워드 상세 분석',
          icon: '🔍',
          href: '/services/keyword-analysis',
          free: true,
        },
        {
          name: '키워드 확장',
          description: '연관 키워드 자동 확장',
          icon: '🌐',
          href: '/services/keyword-expand',
          free: true,
        },
        {
          name: '간편 조회',
          description: '빠른 키워드 비교 조회',
          icon: '⚡',
          href: '/services/quick-search',
          free: true,
        },
      ],
    },
    {
      category: '트렌드 & 순위',
      items: [
        {
          name: '트렌드 분석',
          description: '실시간 검색 트렌드',
          icon: '📈',
          href: '/services/trends',
          free: false,
        },
        {
          name: '검색 순위 추적',
          description: '내 콘텐츠 순위 모니터링',
          icon: '📊',
          href: '/services/rank-tracking',
          free: false,
        },
        {
          name: '영향력 순위',
          description: '블로그/사이트 영향력 분석',
          icon: '⭐',
          href: '/services/influence',
          free: false,
        },
      ],
    },
    {
      category: '플랫폼별 분석',
      items: [
        {
          name: '네이버 검색광고',
          description: '광고 키워드 경쟁도 분석',
          icon: '🎯',
          href: '/services/naver-ads',
          free: false,
        },
        {
          name: '네이버 데이터랩',
          description: '검색어 트렌드 & 인구통계',
          icon: '📉',
          href: '/services/naver-datalab',
          free: false,
        },
        {
          name: '다음 데이터랩',
          description: '카카오 검색 트렌드',
          icon: '💬',
          href: '/services/daum-datalab',
          free: false,
        },
        {
          name: '쿠팡윙',
          description: '상품 키워드 & 가격 분석',
          icon: '🛒',
          href: '/services/coupang-wing',
          free: false,
        },
        {
          name: '유튜브 키워드',
          description: '동영상 키워드 최적화',
          icon: '🎬',
          href: '/services/youtube-keywords',
          free: false,
        },
      ],
    },
  ]

  return (
    <div className="space-y-12" id="services">
      {services.map((category) => (
        <div key={category.category}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {category.category}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((service) => (
              <Link
                key={service.name}
                href={isLoggedIn || service.free ? service.href : '/auth/login'}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{service.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {service.name}
                      </h4>
                      {service.free ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          무료
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          유료
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="text-gray-400 group-hover:text-blue-600 transition">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* 로그인 유도 메시지 */}
      {!isLoggedIn && (
        <div className="text-center p-8 bg-blue-50 rounded-xl">
          <p className="text-lg text-gray-700 mb-4">
            🔒 모든 기능을 사용하려면 로그인이 필요합니다
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            로그인하고 시작하기
          </Link>
        </div>
      )}
    </div>
  )
}