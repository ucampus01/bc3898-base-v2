// app/services/daum-datalab/page.tsx
// 다음(카카오) 데이터랩 페이지

'use client'

import { useState } from 'react'

export default function DaumDatalabPage() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  // 트렌드 조회
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
      const usageCheck = await fetch(`/api/usage/check?service=daum_datalab`)
      const usageData = await usageCheck.json()

      if (!usageData.isAllowed) {
        setError(usageData.message)
        setLoading(false)
        return
      }

      // 다음 데이터랩 API 호출
      const response = await fetch('/api/daum/datalab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '조회 실패')
      }

      setResults(data)

      // 사용량 증가
      await fetch('/api/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'daum_datalab' }),
      })
    } catch (err: any) {
      setError(err.message || '조회 중 오류가 발생했습니다')
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
            💬 다음(카카오) 데이터랩
          </h1>
          <p className="text-gray-600">
            카카오 검색 트렌드와 연관 검색어를 확인하세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색할 키워드를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {loading ? '조회 중...' : '트렌드 조회'}
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
            {/* 🔧 변경 가능: Daum API 응답 구조에 맞게 수정 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                검색 트렌드
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">검색량 지수</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.searchVolume || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">트렌드</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.trend || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* 연관 검색어 */}
            {results.relatedKeywords && results.relatedKeywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  연관 검색어
                </h2>
                <div className="flex flex-wrap gap-2">
                  {results.relatedKeywords.map((relKeyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-yellow-100 hover:text-yellow-700 transition cursor-pointer"
                    >
                      {relKeyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 안내 메시지 */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">
              키워드를 입력하고 트렌드를 조회하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}