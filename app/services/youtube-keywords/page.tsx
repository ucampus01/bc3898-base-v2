// app/services/youtube-keywords/page.tsx
// 유튜브 키워드 분석 페이지

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function YouTubeKeywordsPage() {
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
      const usageCheck = await fetch(`/api/usage/check?service=youtube_keywords`)
      const usageData = await usageCheck.json()

      if (!usageData.isAllowed) {
        setError(usageData.message)
        setLoading(false)
        return
      }

      // YouTube API 호출
      const response = await fetch('/api/youtube/search', {
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
        body: JSON.stringify({ service: 'youtube_keywords' }),
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
            🎬 유튜브 키워드 분석
          </h1>
          <p className="text-gray-600">
            동영상 키워드 최적화 및 경쟁 분석
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="유튜브 키워드를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? '검색 중...' : '동영상 검색'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {results && results.videos && (
          <div className="space-y-6">
            {/* 통계 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                검색 결과 통계
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">총 동영상 수</p>
                  <p className="text-2xl font-bold text-red-600">
                    {results.totalResults?.toLocaleString() || 0}개
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">평균 조회수</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.avgViews?.toLocaleString() || 0}회
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">경쟁도</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.competition || '중간'}
                  </p>
                </div>
              </div>
            </div>

            {/* 동영상 목록 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                관련 동영상 (상위 20개)
              </h2>
              <div className="space-y-4">
                {/* 🔧 변경 가능: 동영상 카드 레이아웃 */}
                {results.videos.slice(0, 20).map((video: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
                    {/* 썸네일 */}
                    <div className="relative w-48 h-28 flex-shrink-0 bg-gray-100 rounded">
                      {video.thumbnailUrl && (
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover rounded"
                        />
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {video.channelTitle}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>조회수: {video.viewCount?.toLocaleString()}회</span>
                        <span>좋아요: {video.likeCount?.toLocaleString()}개</span>
                        <span>댓글: {video.commentCount?.toLocaleString()}개</span>
                      </div>
                      {video.videoUrl && (
                        
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-red-600 hover:underline"
                        >
                          유튜브에서 보기 →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 키워드 */}
            {results.relatedKeywords && results.relatedKeywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  추천 키워드
                </h2>
                <div className="flex flex-wrap gap-2">
                  {results.relatedKeywords.map((relKeyword: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setKeyword(relKeyword)
                        handleSearch(new Event('submit') as any)
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-700 transition"
                    >
                      {relKeyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 안내 메시지 */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-600">
              유튜브 키워드를 입력하고 검색하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}