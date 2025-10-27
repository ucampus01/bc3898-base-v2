// components/layout/Header.tsx
// 상단 헤더

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // 현재 사용자 가져오기
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          {/* 🔧 변경 가능: 로고 이미지 또는 텍스트 */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            키워드Pro
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition">
              서비스
            </Link>
            <Link href="/subscription" className="text-gray-700 hover:text-blue-600 transition">
              요금제
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  대시보드
                </Link>
                <Link href="/mypage" className="text-gray-700 hover:text-blue-600 transition">
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  로그인
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/#services" className="text-gray-700 hover:text-blue-600">
                서비스
              </Link>
              <Link href="/subscription" className="text-gray-700 hover:text-blue-600">
                요금제
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                    대시보드
                  </Link>
                  <Link href="/mypage" className="text-gray-700 hover:text-blue-600">
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-blue-600"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                    로그인
                  </Link>
                  <Link href="/auth/signup" className="text-blue-600 font-semibold">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}