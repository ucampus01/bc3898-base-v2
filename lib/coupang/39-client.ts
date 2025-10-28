// lib/coupang/client.ts
// 쿠팡 파트너스 API 헬퍼 함수

import crypto from 'crypto'

// 🔧 변경 가능: 쿠팡 HMAC 서명 생성 함수
function generateCoupangSignature(
  method: string,
  path: string,
  query: string,
  secretKey: string
): { authorization: string; datetime: string } {
  const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  const message = datetime + method + path + query
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex')

  return {
    authorization: signature,
    datetime,
  }
}

// 🔧 변경 가능: 쿠팡 상품 검색 헬퍼
export async function searchCoupangProducts(keyword: string, limit: number = 20) {
  const accessKey = process.env.COUPANG_ACCESS_KEY!
  const secretKey = process.env.COUPANG_SECRET_KEY!
  const domain = 'https://api-gateway.coupang.com'
  const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search'
  const query = `?keyword=${encodeURIComponent(keyword)}&limit=${limit}`

  const { authorization, datetime } = generateCoupangSignature('GET', path, query, secretKey)
  const authHeader = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${authorization}`

  try {
    const response = await fetch(`${domain}${path}${query}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('쿠팡 API 호출 실패')
    }

    return await response.json()
  } catch (error) {
    console.error('쿠팡 상품 검색 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 쿠팡 카테고리별 상품 조회 헬퍼
export async function getCoupangProductsByCategory(categoryId: string, limit: number = 20) {
  const accessKey = process.env.COUPANG_ACCESS_KEY!
  const secretKey = process.env.COUPANG_SECRET_KEY!
  const domain = 'https://api-gateway.coupang.com'
  const path = '/v2/providers/affiliate_open_api/apis/openapi/products/bestcategories'
  const query = `/${categoryId}?limit=${limit}`

  const { authorization, datetime } = generateCoupangSignature('GET', path, query, secretKey)
  const authHeader = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${authorization}`

  try {
    const response = await fetch(`${domain}${path}${query}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('쿠팡 카테고리 API 호출 실패')
    }

    return await response.json()
  } catch (error) {
    console.error('쿠팡 카테고리 API 호출 실패:', error)
    throw error
  }
}

// 🔧 변경 가능: 쿠팡 딥링크 생성 헬퍼
export async function generateCoupangDeepLink(coupangUrl: string) {
  const accessKey = process.env.COUPANG_ACCESS_KEY!
  const secretKey = process.env.COUPANG_SECRET_KEY!
  const domain = 'https://api-gateway.coupang.com'
  const path = '/v2/providers/affiliate_open_api/apis/openapi/deeplink'
  const query = ''

  const { authorization, datetime } = generateCoupangSignature('POST', path, query, secretKey)
  const authHeader = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${authorization}`

  try {
    const response = await fetch(`${domain}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coupangUrls: [coupangUrl],
      }),
    })

    if (!response.ok) {
      throw new Error('쿠팡 딥링크 생성 실패')
    }

    return await response.json()
  } catch (error) {
    console.error('쿠팡 딥링크 생성 실패:', error)
    throw error
  }
}