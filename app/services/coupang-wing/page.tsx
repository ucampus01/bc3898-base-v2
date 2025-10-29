// app/services/coupang-wing/page.tsx
// 쿠팡윙 상품 키워드 분석 페이지

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function CoupangWingPage() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  // 상품 검색
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
      const usageCheck = await fetch(`/api/usage/check?service=coupang_wing`)
      const usageData = await usageCheck.json()

      if (!usageData.isAllowed) {
        setError(usageData.message)
        setLoading(false)
        return
      }

      // 쿠팡 API 호출
      const response = await fetch('/api/coupang/products', {
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
        body: JSON.stringify({ service: 'coupang_wing' }),
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
            🛒 쿠팡윙 상품 분석
          </h1>
          <p className="text-gray-600">
            상품 키워드, 가격대, 판매 트렌드를 분석하세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="상품 키워드를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? '검색 중...' : '상품 검색'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {results && results.products && (
          <div className="space-y-6">
            {/* 통계 요약 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                검색 결과 요약
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">총 상품 수</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.products.length?.toLocaleString() || 0}개
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">평균 가격</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.avgPrice?.toLocaleString() || 0}원
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">최저 ~ 최고가</p>
                  <p className="text-lg font-bold text-purple-600">
                    {results.minPrice?.toLocaleString()} ~ {results.maxPrice?.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>

            {/* 상품 목록 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                상품 목록 (상위 20개)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 🔧 변경 가능: 상품 카드 레이아웃 */}
                {results.products.slice(0, 20).map((product: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    {product.imageUrl && (
                      <div className="relative w-full h-48 mb-3 bg-gray-100 rounded">
                        <Image
                          src={product.imageUrl}
                          alt={product.productName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                      {product.productName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">
                        {product.productPrice?.toLocaleString()}원
                      </span>
                      {product.productUrl && (
                        
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          상세보기 →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600">
              상품 키워드를 입력하고 검색하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}