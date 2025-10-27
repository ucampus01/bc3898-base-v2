// app/auth/login/page.tsx
// 로그인 페이지

'use client'

import { useState } from 'react'
import Link from 'link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 이메일 로그인
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || '로그인에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  // 소셜 로그인
  // 🔧 변경 가능: provider 추가/제거 가능
  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'kakao' | 'naver') => {
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
      setError(error.message || '로그인에 실패했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            로그인
          </h2>
          <p className="text-gray-600">
            계정에 로그인하여 모든 기능을 이용하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          {/* 🔧 변경 가능: 소셜 로그인 버튼 스타일 및 순서 */}
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-

          <button
        onClick={() => handleOAuthLogin('naver')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white px-4 py-3 rounded-lg hover:bg-[#02B350] transition disabled:opacity-50"
      >
        <span className="text-xl font-bold">N</span>
        네이버로 로그인
      </button>

      <button
        onClick={() => handleOAuthLogin('kakao')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#000000] px-4 py-3 rounded-lg hover:bg-[#FDD835] transition disabled:opacity-50"
      >
        <span className="text-xl">💬</span>
        카카오로 로그인
      </button>

      <button
        onClick={() => handleOAuthLogin('facebook')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white px-4 py-3 rounded-lg hover:bg-[#166FE5] transition disabled:opacity-50"
      >
        <span className="text-xl">f</span>
        페이스북으로 로그인
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

    {/* 이메일 로그인 폼 */}
    <form onSubmit={handleEmailLogin} className="space-y-4">
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
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? '로그인 중...' : '이메일로 로그인'}
      </button>
    </form>

    {/* 하단 링크 */}
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline font-semibold">
          회원가입
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