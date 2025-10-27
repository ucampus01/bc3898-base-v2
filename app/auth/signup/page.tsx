// app/auth/signup/page.tsx
// 회원가입 페이지

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // 이메일 회원가입
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      setLoading(false)
      return
    }

    // 🔧 변경 가능: 비밀번호 최소 길이
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setSuccess(true)
      
      // 🔧 변경 가능: 가입 후 리다이렉트 지연 시간
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000)
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  // 소셜 회원가입
  const handleOAuthSignup = async (provider: 'google' | 'facebook' | 'kakao' | 'naver') => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            회원가입
          </h2>
          <p className="text-gray-600">
            간편하게 가입하고 모든 기능을 사용하세요
          </p>
        </div>

        {/* 성공 메시지 */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            회원가입이 완료되었습니다! 역할 선택 페이지로 이동합니다...
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!success && (
          <>
            {/* 소셜 회원가입 */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuthSignup('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글로 간편 가입
              </button>

              <button
                onClick={() => handleOAuthSignup('naver')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white px-4 py-3 rounded-lg hover:bg-[#02B350] transition disabled:opacity-50"
              >
                <span className="text-xl font-bold">N</span>
                네이버로 간편 가입
              </button>

              <button
                onClick={() => handleOAuthSignup('kakao')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#000000] px-4 py-3 rounded-lg hover:bg-[#FDD835] transition disabled:opacity-50"
              >
                <span className="text-xl">💬</span>
                카카오로 간편 가입
              </button>

              <button
                onClick={() => handleOAuthSignup('facebook')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white px-4 py-3 rounded-lg hover:bg-[#166FE5] transition disabled:opacity-50"
              >
                <span className="text-xl">f</span>
                페이스북으로 간편 가입
              </button>
            </div>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>

            {/* 이메일 회원가입 폼 */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="최소 6자 이상"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호 재입력"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? '가입 중...' : '이메일로 가입하기'}
              </button>
            </form>
          </>
        )}

        {/* 하단 링크 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
              로그인
            </Link>
          </p>
          
          {/* 🔧 변경 가능: 구독 페이지 링크 문구 */}
          <Link 
            href="/subscription"
            className="block text-sm text-purple-600 hover:underline font-semibold"
          >
            💎 결제하고 향상된 서비스 이용하기
          </Link>
        </div>
      </div>
    </div>
  )
}