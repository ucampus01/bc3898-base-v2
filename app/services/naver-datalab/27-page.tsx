// app/services/naver-datalab/page.tsx
// 네이버 데이터랩 트렌드 분석 페이지

'use client'

import { useState } from 'react'

export default function NaverDatalabPage() {
  const [keywords, setKeywords] = useState<string[]>([''])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  // 키워드 추가
  const addKeyword = () => {
    if (keywords.length < 5) {
      setKeywords([...keywords, ''])
    }
  }

  // 키워드 변경
  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  // 키워드 삭제
  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index))
    }
  }

  // 트렌드 조회
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validKeywords = keywords.filter(k => k.trim())
    
    if (validKeywords.length === 0) {
      setError('최소 1개의 키워드를 입력해주세요')
      return
    }

    if (!startDate || !endDate) {
      setError('기간을 선택해주세요')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      // 사용량 체크
      const usageCheck = await fetch(`/api/usage/check?service=naver_datalab`)
      const usageData = await usageCheck.json()

      if (!usageData.isAllowed) {
        setError(usageData.message)
        setLoading(false)
        return
      }

      // 네이버 데이터랩 API 호출
      const response = await fetch('/api/naver/datalab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: validKeywords,
          startDate,
          endDate,
        }),
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
        body: JSON.stringify({ service: 'naver_datalab' }),
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
            📉 네이버 데이터랩
          </h1>
          <p className="text-gray-600">
            검색어 트렌드, 성별/연령대별 관심도를 확인하세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* 키워드 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비교할 키워드 (최대 5개)
              </label>
              {keywords.map((keyword, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder={`키워드 ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {keywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}
              {keywords.length < 5 && (
                <button
                  type="button"
                  onClick={addKeyword}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  + 키워드 추가
                </button>
              )}
            </div>

            {/* 기간 선택 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
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
            {/* 🔧 변경 가능: 차트 라이브러리 연동 (recharts 등) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                검색 트렌드
              </h2>
              <p className="text-gray-600 mb-4">
                선택한 기간 동안의 검색량 변화를 확인하세요
              </p>
              {/* 여기에 차트 컴포넌트 추가 */}
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">차트 영역 (recharts 연동 필요)</p>
              </div>
            </div>

            {/* 데이터 테이블 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                상세 데이터
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">날짜</th>
                      {keywords.filter(k => k.trim()).map((keyword, index) => (
                        <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {keyword}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.data && results.data.map((row: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{row.period}</td>
                        {row.values.map((value: number, vIndex: number) => (
                          <td key={vIndex} className="px-4 py-3 text-sm text-gray-600">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">
              키워드와 기간을 선택하고 조회하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}