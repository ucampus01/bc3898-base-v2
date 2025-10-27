// app/page.tsx
// 메인 랜딩 페이지

import Link from 'next/link'
import ServiceMenu from '@/components/layout/ServiceMenu'
import { getCurrentUser } from '@/lib/supabase/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            블로거·셀러·유튜버를 위한
            <br />
            올인원 키워드 분석 플랫폼
          </h1>
          <p className="text-xl mb-8 opacity-90">
            네이버, 구글, 유튜브, 쿠팡 데이터를 한 곳에서 분석하세요
          </p>
          
          {/* 🔧 변경 가능: CTA 버튼 문구 및 링크 */}
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link 
                href="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                대시보드로 이동
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/signup"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  무료로 시작하기
                </Link>
                <Link 
                  href="/auth/login"
                  className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            왜 저희 서비스를 선택해야 할까요?
          </h2>
          
          {/* 🔧 변경 가능: 특징 카드 추가/수정 */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">통합 데이터</h3>
              <p className="text-gray-600">
                네이버, 구글, 유튜브, 쿠팡 데이터를 한눈에 비교
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">실시간 분석</h3>
              <p className="text-gray-600">
                최신 트렌드와 검색량을 실시간으로 확인
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">맞춤 추천</h3>
              <p className="text-gray-600">
                블로거/셀러/유튜버별 최적화된 키워드 추천
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            모든 서비스
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {user ? '원하는 서비스를 선택하세요' : '로그인하면 모든 기능을 사용할 수 있어요'}
          </p>
          
          <ServiceMenu />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              14일 무료 체험으로 모든 기능을 경험해보세요
            </p>
            
            {/* 🔧 변경 가능: 무료 체험 기간 */}
            <Link 
              href="/auth/signup"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              14일 무료 체험 시작
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}