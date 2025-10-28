// app/api/coupang/products/route.ts
// 쿠팡 파트너스 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

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

    // 🔧 변경 가능: 쿠팡 파트너스 API 호출
    const accessKey = process.env.COUPANG_ACCESS_KEY!
    const secretKey = process.env.COUPANG_SECRET_KEY!
    const domain = 'https://api-gateway.coupang.com'
    const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search'
    const query = `?keyword=${encodeURIComponent(keyword)}&limit=20`

    // HMAC 서명 생성
    const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    const message = datetime + 'GET' + path + query
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(message)
      .digest('hex')

    const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`

    const response = await fetch(`${domain}${path}${query}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('쿠팡 API 호출 실패')
    }

    const data = await response.json()

    // 가격 통계 계산
    const products = data.data?.productData || []
    const prices = products.map((p: any) => p.productPrice).filter((p: number) => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : 0
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

    // 결과 가공
    const results = {
      keyword,
      totalCount: data.data?.totalCount || 0,
      products: products.map((product: any) => ({
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage,
        productUrl: product.productUrl,
        isRocket: product.isRocket,
        isFreeShipping: product.isFreeShipping,
      })),
      avgPrice,
      minPrice,
      maxPrice,
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('쿠팡 API 오류:', error)
    return NextResponse.json(
      { error: error.message || 'API 호출 실패' },
      { status: 500 }
    )
  }
}