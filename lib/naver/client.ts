// lib/naver/client.ts
// 네이버 API 헬퍼 함수

// 🔧 변경 가능: 네이버 검색광고 API 호출 헬퍼
export async function getNaverAdKeywords(keyword: string) {
  const apiUrl = 'https://api.naver.com/keywordstool'
  const clientId = process.env.NAVER_AD_API_KEY!
  const clientSecret = process.env.NAVER_AD_SECRET!
  const customerId = process.env.NAVER_AD_CUSTOMER_ID!

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'X-Customer-Id': customerId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywordList: [keyword],
        showDetail: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('네이버 검색광고 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('네이버 검색광고 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 네이버 데이터랩 API 호출 헬퍼
export async function getNaverDatalab(keywords: string[], startDate: string, endDate: string) {
  const apiUrl = 'https://openapi.naver.com/v1/datalab/search'
  const clientId = process.env.NAVER_CLIENT_ID!
  const clientSecret = process.env.NAVER_CLIENT_SECRET!

  const requestBody = {
    startDate: startDate.replace(/-/g, ''),
    endDate: endDate.replace(/-/g, ''),
    timeUnit: 'date',
    keywordGroups: keywords.map((keyword) => ({
      groupName: keyword,
      keywords: [keyword],
    })),
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error('네이버 데이터랩 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('네이버 데이터랩 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 네이버 검색 API 호출 헬퍼
export async function naverWebSearch(query: string, display: number = 10) {
  const apiUrl = 'https://openapi.naver.com/v1/search/blog.json'
  const clientId = process.env.NAVER_CLIENT_ID!
  const clientSecret = process.env.NAVER_CLIENT_SECRET!

  try {
    const response = await fetch(
      `${apiUrl}?query=${encodeURIComponent(query)}&display=${display}`,
      {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    )

    if (!response.ok) {
      throw new Error('네이버 검색 API 오류')
    }

    return await response.json()
  } catch (error) {
    console.error('네이버 검색 API 호출 실패:', error)
    throw error
  }
}