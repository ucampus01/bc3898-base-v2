// app/api/youtube/search/route.ts
// YouTube Data API v3

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { keyword } = body

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드를 입력해주세요' },
        { status: 400 }
      )
    }

    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    // 🔧 변경 가능: YouTube Data API v3 호출
    const apiKey = process.env.YOUTUBE_API_KEY!
    
    // 1. 동영상 검색
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&maxResults=20&type=video&key=${apiKey}`
    )

    if (!searchResponse.ok) {
      throw new Error('YouTube API 호출 실패')
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items?.map((item: any) => item.id.videoId).join(',') || ''

    // 2. 동영상 상세 정보 조회
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
    )

    if (!videosResponse.ok) {
      throw new Error('YouTube 상세 정보 조회 실패')
    }

    const videosData = await videosResponse.json()

    // 통계 계산
    const videos = videosData.items || []
    const viewCounts = videos.map((v: any) => parseInt(v.statistics?.viewCount || 0))
    const avgViews = viewCounts.length > 0 
      ? Math.round(viewCounts.reduce((a: number, b: number) => a + b, 0) / viewCounts.length) 
      : 0

    // 경쟁도 계산 (조회수 기반)
    let competition = '낮음'
    if (avgViews > 100000) competition = '높음'
    else if (avgViews > 10000) competition = '중간'

    // 결과 가공
    const results = {
      keyword,
      totalResults: searchData.pageInfo?.totalResults || 0,
      avgViews,
      competition,
      videos: videos.map((video: any) => ({
        videoId: video.id,
        title: video.snippet?.title,
        description: video.snippet?.description,
        channelTitle: video.snippet?.channelTitle,
        publishedAt: video.snippet?.publishedAt,
        thumbnailUrl: video.snippet?.thumbnails?.medium?.url,
        viewCount: parseInt(video.statistics?.viewCount || 0),
        likeCount: parseInt(video.statistics?.likeCount || 0),
        commentCount: parseInt(video.statistics?.commentCount || 0),
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      })),
      relatedKeywords: searchData.items?.slice(0, 5).map((item: any) => 
        item.snippet?.title.split(' ').slice(0, 3).join(' ')
      ) || [],
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('YouTube API 오류:', error)
    return NextResponse.json(
      { error: error.message || 'API 호출 실패' },
      { status: 500 }
    )
  }
}