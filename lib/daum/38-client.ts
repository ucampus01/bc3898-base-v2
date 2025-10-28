// lib/daum/client.ts
// 다음(카카오) API 헬퍼 함수

// 🔧 변경 가능: 카카오 웹 검색 API 호출 헬퍼
export async function kakaoWebSearch(query: string, size: number = 10) {
  const apiUrl = 'https://dapi.kakao.com/v2/search/web'
  const apiKey = process.env.KAKAO_REST_API_KEY!

  try {
    const response = await fetch(
      `${apiUrl}?query=${encodeURIComponent(query)}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('카카오 검색 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('카카오 검색 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 카카오 블로그 검색 API 호출 헬퍼
export async function kakaoBlogSearch(query: string, size: number = 10) {
  const apiUrl = 'https://dapi.kakao.com/v2/search/blog'
  const apiKey = process.env.KAKAO_REST_API_KEY!

  try {
    const response = await fetch(
      `${apiUrl}?query=${encodeURIComponent(query)}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('카카오 블로그 검색 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('카카오 블로그 검색 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 카카오 이미지 검색 API 호출 헬퍼
export async function kakaoImageSearch(query: string, size: number = 10) {
  const apiUrl = 'https://dapi.kakao.com/v2/search/image'
  const apiKey = process.env.KAKAO_REST_API_KEY!

  try {
    const response = await fetch(
      `${apiUrl}?query=${encodeURIComponent(query)}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('카카오 이미지 검색 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('카카오 이미지 검색 API 호출 실패:', error)
    throw error
  }
}