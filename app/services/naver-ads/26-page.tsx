// app/services/naver-ads/page.tsx
// 네이버 검색광고 키워드 분석 페이지

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NaverAdsPage() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  // 키워드 검색
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!keyword.trim()) {
      setError('키워드를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      // 사용량 체크
      const usageCheck = await fetch(`/api/usage/check?service=naver_ads`)
      const usageData = await usageCheck.json()

      if (!usageData.isAllowed) {
        setError(usageData.message)
        setLoading(false)
        return
      }

      // 네이버 광고 API 호출
      const response = await fetch('/api/naver/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '검색 실패')
      }

      setResults(data)

      // 사용량 증가
      await fetch('/api/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'naver_ads' }),
      })
    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 네이버 검색광고 분석
          </h1>
          <p className="text-gray-600">
            키워드 경쟁도, 클릭당 비용(CPC), 예상 노출량 등을 확인하세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="분석할 키워드를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '분석 중...' : '분석하기'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {results && (
          <div className="space-y-6">
            {/* 🔧 변경 가능: 결과 레이아웃 커스터마이징 */}
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                기본 정보
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">월간 검색량</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.monthlyPcQcCnt?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">경쟁 정도</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.compIdx || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">평균 CPC</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.monthlyAvePcClkCnt ? `${results.monthlyAvePcClkCnt}원` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* 연관 키워드 */}
            {results.relKeywords && results.relKeywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  연관 키워드
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.relKeywords.map((relKeyword: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900">{relKeyword.relKeyword}</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {relKeyword.compIdx}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>검색량: {relKeyword.monthlyPcQcCnt?.toLocaleString()}</span>
                        <span>CPC: {relKeyword.monthlyAvePcClkCnt}원</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 안내 메시지 */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600">
              키워드를 입력하고 분석하기 버튼을 클릭하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}