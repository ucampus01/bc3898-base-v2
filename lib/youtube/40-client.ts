// lib/youtube/client.ts
// YouTube Data API v3 헬퍼 함수

// 🔧 변경 가능: YouTube 동영상 검색 헬퍼
export async function searchYouTubeVideos(keyword: string, maxResults: number = 20) {
  const apiKey = process.env.YOUTUBE_API_KEY!
  const apiUrl = 'https://www.googleapis.com/youtube/v3/search'

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet&q=${encodeURIComponent(keyword)}&maxResults=${maxResults}&type=video&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube 검색 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube 검색 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: YouTube 동영상 상세 정보 헬퍼
export async function getYouTubeVideoDetails(videoIds: string[]) {
  const apiKey = process.env.YOUTUBE_API_KEY!
  const apiUrl = 'https://www.googleapis.com/youtube/v3/videos'
  const ids = videoIds.join(',')

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet,statistics,contentDetails&id=${ids}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube 상세 정보 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube 상세 정보 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: YouTube 채널 정보 헬퍼
export async function getYouTubeChannelInfo(channelId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY!
  const apiUrl = 'https://www.googleapis.com/youtube/v3/channels'

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube 채널 정보 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube 채널 정보 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: YouTube 인기 동영상 헬퍼
export async function getYouTubeTrendingVideos(maxResults: number = 20, regionCode: string = 'KR') {
  const apiKey = process.env.YOUTUBE_API_KEY!
  const apiUrl = 'https://www.googleapis.com/youtube/v3/videos'

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube 인기 동영상 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube 인기 동영상 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: YouTube 댓글 조회 헬퍼
export async function getYouTubeVideoComments(videoId: string, maxResults: number = 20) {
  const apiKey = process.env.YOUTUBE_API_KEY!
  const apiUrl = 'https://www.googleapis.com/youtube/v3/commentThreads'

  try {
    const response = await fetch(
      `${apiUrl}?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube 댓글 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube 댓글 API 호출 실패:', error)
    throw error
  }
}